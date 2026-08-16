import fs from 'node:fs';
const FILE='./data.json';
const defaults={prefix:'.',botName:'7kzz',connectedGroups:{},blocked:[],vip:[],welcome:{},oii:{text:'',imageUrl:'',title:'7kzz Atualização',description:'',enabled:true},security:{}};
const defaultSecurity={antilink:false,antispam:false,antiflood:false,antiporno:false,antigore:false,antiviolence:false,antipalavra:false,antimedia:false,antifake:false,action:'delete',warnLimit:3,spamWindow:6000,spamLimit:5,floodWindow:5000,floodLimit:8,blockedWords:[]};
let db={...defaults};
try{db={...defaults,...JSON.parse(fs.readFileSync(FILE,'utf8'))}}catch{}
export function save(){fs.writeFileSync(FILE,JSON.stringify(db,null,2))}
export function get(){return db}
export function set(k,v){db[k]=v;save()}
export function toggleArray(k,id,on){db[k]=db[k]||[];db[k]=on?[...new Set([...db[k],id])]:db[k].filter(x=>x!==id);save()}
export function getSecurity(jid){db.security[jid]={...defaultSecurity,...(db.security[jid]||{})};return db.security[jid]}
export function setSecurity(jid,key,value){db.security[jid]={...defaultSecurity,...(db.security[jid]||{}),[key]:value};save();return db.security[jid]}
export {defaultSecurity};
