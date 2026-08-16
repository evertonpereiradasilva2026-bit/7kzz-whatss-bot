import makeWASocket,{DisconnectReason,useMultiFileAuthState,fetchLatestBaileysVersion,downloadMediaMessage} from '@whiskeysockets/baileys';
import P from 'pino';import qr from 'qrcode-terminal';import fs from 'node:fs';import {config} from './config.js';import {get,set,toggleArray,save,getSecurity,setSecurity} from './store.js';import {mainMenu,submenu,groups} from './menu.js';
import {classifyText,mediaKind} from './security.js';
const log=P({level:'silent'});const owner=config.owner;const admins=new Set();const spamState=new Map();const warns=new Map();
const jidNum=j=>(j||'').split('@')[0].split(':')[0];
const arg=(a,n=0)=>a.slice(n).join(' '); const mention=m=>{let c=m.message?.extendedTextMessage?.contextInfo?.mentionedJid||[];return c};
const isOwner=(m)=>jidNum(m.key.participant||m.key.remoteJid)===owner;
function textOf(m){return m.message?.conversation||m.message?.extendedTextMessage?.text||m.message?.imageMessage?.caption||m.message?.videoMessage?.caption||''}
function requireOwner(m){return isOwner(m)}
function senderJid(m){return m.key.participant||m.key.remoteJid}
function addWarn(chat,user,reason){const key=chat+'|'+jidNum(user);const n=(warns.get(key)||0)+1;warns.set(key,n);return n}
function clearWarn(chat,user){warns.delete(chat+'|'+jidNum(user))}
async function punish(s,chat,user,reason,security){const n=addWarn(chat,user,reason);const action=security.action||'delete';let msg=`⚠️ Proteção 7kzz
Motivo: ${reason}
Advertência: ${n}/${security.warnLimit}`;if(action==='delete'||n<security.warnLimit){try{await s.sendMessage(chat,{delete:{remoteJid:chat,fromMe:false,id:arguments[2]?.key?.id||''}})}catch{} if(action==='warn'||n<security.warnLimit)return {n,done:false,msg};}if(action==='kick'||(n>=security.warnLimit&&action==='delete')){try{await s.groupParticipantsUpdate(chat,[user],'remove')}catch{}return {n,done:true,msg:msg+'\nAção: remoção.'};}return {n,done:false,msg};}
async function start(){const {state,saveCreds}=await useMultiFileAuthState('./auth');const {version}=await fetchLatestBaileysVersion();const s=makeWASocket({version,auth:state,logger:log,browser:['7kzz','Chrome','2.0']});s.ev.on('creds.update',saveCreds);s.ev.on('connection.update',u=>{if(u.qr){console.log('QR:');qr.generate(u.qr,{small:true})}if(u.connection==='open')console.log('7kzz online');if(u.connection==='close'&&u.lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut)start()});
 s.ev.on('groups.upsert',gs=>{for(const g of gs){get().connectedGroups[g.id]=g.subject}save()});
 s.ev.on('messages.upsert',async({messages})=>{const m=messages?.[0];if(!m?.message||m.key.fromMe)return;const chat=m.key.remoteJid;if(chat==='status@broadcast')return;let t=textOf(m).trim();const p=get().prefix||'.';if(!t.toLowerCase().startsWith(p.toLowerCase()))return;const raw=t.slice(p.length).trim();const parts=raw.split(/\s+/);const c=parts.shift().toLowerCase();const a=parts;const user=m.pushName||jidNum(m.key.participant||chat)||'user';
  const sender=senderJid(m);
  if(get().blocked.includes(jidNum(sender)))return;
  try{
   // Moderação automática roda antes dos comandos, somente em grupos e sem atingir o dono.
   if(chat.endsWith('@g.us') && !isOwner(m)){
    const sec=getSecurity(chat);
    if(sec.antispam || sec.antiflood){
      const key=chat+'|'+jidNum(sender); const now=Date.now(); const st=spamState.get(key)||{times:[],last:''};
      st.times=st.times.filter(x=>now-x<Math.max(sec.spamWindow,sec.floodWindow));
      if(sec.antispam && t && st.last===t.toLowerCase()) st.times.push(now,now); else st.times.push(now);
      st.last=t.toLowerCase(); spamState.set(key,st);
      const flood=sec.antiflood && st.times.filter(x=>now-x<sec.floodWindow).length>=sec.floodLimit;
      const spam=sec.antispam && st.times.filter(x=>now-x<sec.spamWindow).length>=sec.spamLimit;
      if(flood||spam){try{await s.sendMessage(chat,{delete:m.key})}catch{}; const n=addWarn(chat,sender,flood?'flood':'spam'); if(n>=sec.warnLimit){try{await s.groupParticipantsUpdate(chat,[sender],'remove')}catch{}}; return;}
    }
    const reason=classifyText(t,sec);
    const mk=mediaKind(m);
    if(reason || (sec.antimedia && mk)){
      try{await s.sendMessage(chat,{delete:m.key})}catch{}
      const why=reason||('media:'+mk); const n=addWarn(chat,sender,why);
      await s.sendMessage(chat,{text:`⚠️ 7kzz Anti-${why}\nMensagem removida.\nAdvertência: ${n}/${sec.warnLimit}`});
      if(n>=sec.warnLimit && sec.action==='kick'){try{await s.groupParticipantsUpdate(chat,[sender],'remove')}catch{}}
      return;
    }
   }
   if(c==='menu'||c==='help'){return s.sendMessage(chat,{text:mainMenu(user,p,get().botName)})}
   const sm=submenu(c,p);if(sm)return s.sendMessage(chat,{text:sm});
   if(c==='ping')return s.sendMessage(chat,{text:'⚡ 7kzz online | '+Date.now()});
   if(c==='runtime')return s.sendMessage(chat,{text:'⏱️ Bot ativo e operacional.'});
   if(c==='info')return s.sendMessage(chat,{text:`『 ${get().botName} 』\nPrefixo: ${p}\nGrupos conectados: ${Object.keys(get().connectedGroups).length}\nVIPs: ${get().vip.length}`});
   if(c==='id')return s.sendMessage(chat,{text:`ID: ${chat}`});
   if(c==='say')return s.sendMessage(chat,{text:arg(a)});
   if(c==='calc'){let e=arg(a);if(!/^[0-9+\-*/().%\s]+$/.test(e))return s.sendMessage(chat,{text:'Expressão inválida.'});return s.sendMessage(chat,{text:String(Function(`"use strict";return (${e})`)())})}
   if(c==='setprefix'&&requireOwner(m)){if(!a[0])return s.sendMessage(chat,{text:`Uso: ${p}setprefix !`});set('prefix',a[0]);return s.sendMessage(chat,{text:`Prefixo alterado para ${a[0]}`})}
   if(c==='setbotname'&&requireOwner(m)){let n=arg(a);if(!n)return s.sendMessage(chat,{text:`Uso: ${p}setbotname 7kzz`});set('botName',n);return s.sendMessage(chat,{text:`Nome do bot alterado para: ${n}`})}
   if(c==='grupos'&&requireOwner(m)){let gs=Object.entries(get().connectedGroups);return s.sendMessage(chat,{text:gs.length?gs.map(([id,n],i)=>`${i+1}. ${n}\n${id}`).join('\n\n'):'Nenhum grupo registrado.'})}
   if(c==='block'&&requireOwner(m)){let n=a[0]?.replace(/\D/g,'');if(!n)return s.sendMessage(chat,{text:`Uso: ${p}block 5511999999999`});toggleArray('blocked',n,true);return s.sendMessage(chat,{text:'Usuário bloqueado.'})}
   if(c==='unblock'&&requireOwner(m)){let n=a[0]?.replace(/\D/g,'');toggleArray('blocked',n,false);return s.sendMessage(chat,{text:'Usuário desbloqueado.'})}
   if(c==='broadcast'&&requireOwner(m)){let msg=arg(a);if(!msg)return s.sendMessage(chat,{text:`Uso: ${p}broadcast mensagem`});for(const id of Object.keys(get().connectedGroups))await s.sendMessage(id,{text:msg});return s.sendMessage(chat,{text:`Atualização enviada para ${Object.keys(get().connectedGroups).length} grupos.`})}
   if(c==='oii'&&requireOwner(m)){let d=get().oii;if(!d.text&&!d.imageUrl)return s.sendMessage(chat,{text:`Configure com ${p}oiimenu`});if(d.imageUrl){try{await s.sendMessage(chat,{image:{url:d.imageUrl},caption:d.text||d.title})}catch{await s.sendMessage(chat,{text:d.text||'Atualização'})}}else await s.sendMessage(chat,{text:d.text});return}
   if(c==='oiimenu'&&requireOwner(m)){let sub=a[0]?.toLowerCase();if(!sub)return s.sendMessage(chat,{text:`${p}oiimenu texto <mensagem>\n${p}oiimenu foto <url>\n${p}oiimenu titulo <texto>\n${p}oiimenu descricao <texto>\n${p}oiimenu ver\n${p}oiimenu limpar`});if(sub==='texto'){set('oii',{...get().oii,text:arg(a,1)});return s.sendMessage(chat,{text:'Mensagem do oii salva.'})}if(sub==='foto'){set('oii',{...get().oii,imageUrl:a[1]||''});return s.sendMessage(chat,{text:'Foto do oii salva.'})}if(sub==='titulo'){set('oii',{...get().oii,title:arg(a,1)});return s.sendMessage(chat,{text:'Título salvo.'})}if(sub==='descricao'){set('oii',{...get().oii,description:arg(a,1)});return s.sendMessage(chat,{text:'Descrição salva.'})}if(sub==='limpar'){set('oii',{...get().oii,text:'',imageUrl:''});return s.sendMessage(chat,{text:'Configuração do oii limpa.'})}return s.sendMessage(chat,{text:JSON.stringify(get().oii,null,2)})}
   if(c==='addvip'&&requireOwner(m)){let n=a[0]?.replace(/\D/g,'');toggleArray('vip',n,true);return s.sendMessage(chat,{text:'VIP adicionado.'})}
   if(c==='delvip'&&requireOwner(m)){let n=a[0]?.replace(/\D/g,'');toggleArray('vip',n,false);return s.sendMessage(chat,{text:'VIP removido.'})}
   if(c==='listvip'&&requireOwner(m))return s.sendMessage(chat,{text:get().vip.length?get().vip.join('\n'):'Nenhum VIP.'});
   if(c==='vip'){let n=jidNum(m.key.participant||chat);return s.sendMessage(chat,{text:get().vip.includes(n)?'Você é VIP.':'Você não é VIP.'})}
   if(c==='protecao'&&chat.endsWith('@g.us')){let z=getSecurity(chat);return s.sendMessage(chat,{text:`🛡️ 7KZZ PROTEÇÃO\nAnti-link: ${z.antilink?'ON':'OFF'}\nAnti-spam: ${z.antispam?'ON':'OFF'}\nAnti-flood: ${z.antiflood?'ON':'OFF'}\nAnti-porno (texto): ${z.antiporno?'ON':'OFF'}\nAnti-gore (texto): ${z.antigore?'ON':'OFF'}\nAnti-violência (texto): ${z.antiviolence?'ON':'OFF'}\nAnti-palavras: ${z.antipalavra?'ON':'OFF'}\nAnti-mídia: ${z.antimedia?'ON':'OFF'}\nAnti-fake (texto): ${z.antifake?'ON':'OFF'}\nPunição: ${z.action}\nLimite de avisos: ${z.warnLimit}`})}
   if(['antilink','antispam','antiflood','antiporno','antigore','antiviolence','antipalavra','antimedia','antifake'].includes(c)&&chat.endsWith('@g.us')){if(!isOwner(m))return s.sendMessage(chat,{text:'Apenas o dono pode alterar a proteção nesta versão.'});let v=(a[0]||'').toLowerCase();if(!['on','off'].includes(v))return s.sendMessage(chat,{text:`Uso: ${p}${c} on|off`});setSecurity(chat,c,v==='on');return s.sendMessage(chat,{text:`${c}: ${v.toUpperCase()}`})}
   if(c==='punicao'&&chat.endsWith('@g.us')){if(!isOwner(m))return;let v=(a[0]||'').toLowerCase();if(!['delete','warn','kick'].includes(v))return s.sendMessage(chat,{text:`Uso: ${p}punicao delete|warn|kick`});setSecurity(chat,'action',v);return s.sendMessage(chat,{text:`Punição definida: ${v}`})}
   if(c==='antispamlimite'&&chat.endsWith('@g.us' )&&isOwner(m)){let n=Math.max(2,Number(a[0]||5));setSecurity(chat,'spamLimit',n);return s.sendMessage(chat,{text:`Limite anti-spam: ${n}`})}
   if(c==='antifloodlimite'&&chat.endsWith('@g.us')&&isOwner(m)){let n=Math.max(2,Number(a[0]||8));setSecurity(chat,'floodLimit',n);return s.sendMessage(chat,{text:`Limite anti-flood: ${n}`})}
   if(c==='addpalavra'&&chat.endsWith('@g.us')&&isOwner(m)){let w=arg(a).toLowerCase().trim();if(!w)return s.sendMessage(chat,{text:`Uso: ${p}addpalavra termo`});let z=getSecurity(chat);setSecurity(chat,'blockedWords',[...new Set([...(z.blockedWords||[]),w])]);return s.sendMessage(chat,{text:'Palavra adicionada à lista.'})}
   if(c==='delpalavra'&&chat.endsWith('@g.us')&&isOwner(m)){let w=arg(a).toLowerCase().trim();let z=getSecurity(chat);setSecurity(chat,'blockedWords',(z.blockedWords||[]).filter(x=>x!==w));return s.sendMessage(chat,{text:'Palavra removida.'})}
   if(c==='warn'&&chat.endsWith('@g.us')){let u=mention(m)[0]|| (a[0]&&a[0].replace(/\D/g,'')+'@s.whatsapp.net');if(!u)return s.sendMessage(chat,{text:`Uso: ${p}warn @user`});let n=addWarn(chat,u,'manual');return s.sendMessage(chat,{text:`Advertência aplicada: ${n}`})}
   if(c==='warnings'&&chat.endsWith('@g.us')){let u=mention(m)[0]|| (a[0]&&a[0].replace(/\D/g,'')+'@s.whatsapp.net');if(!u)return s.sendMessage(chat,{text:`Uso: ${p}warnings @user`});return s.sendMessage(chat,{text:`Advertências: ${warns.get(chat+'|'+jidNum(u))||0}`})}
   if(c==='clearwarn'&&chat.endsWith('@g.us')){let u=mention(m)[0]|| (a[0]&&a[0].replace(/\D/g,'')+'@s.whatsapp.net');if(!u)return s.sendMessage(chat,{text:`Uso: ${p}clearwarn @user`});clearWarn(chat,u);return s.sendMessage(chat,{text:'Advertências zeradas.'})}
   if(['add','kick','promote','demote','ban','unban','mute','unmute'].includes(c)){if(!chat.endsWith('@g.us'))return s.sendMessage(chat,{text:'Comando exclusivo para grupos.'});if(!isOwner(m))return s.sendMessage(chat,{text:'Apenas o dono pode usar este comando nesta base.'});let users=mention(m);if(!users.length&&a[0])users=[a[0].replace(/\D/g,'')+'@s.whatsapp.net'];if(!users.length)return s.sendMessage(chat,{text:`Mencione alguém: ${p}${c} @user`});let map={add:2,kick:1,promote:3,demote:4,ban:1};if(map[c])await s.groupParticipantsUpdate(chat,users,c==='add'?'add':c==='kick'||c==='ban'?'remove':c==='promote'?'promote':'demote');return s.sendMessage(chat,{text:`${c} executado.`})}
   if(c==='tagall'||c==='hidetag'){if(!chat.endsWith('@g.us'))return;let meta=await s.groupMetadata(chat);let txt=arg(a)||'Atenção!';return s.sendMessage(chat,{text:txt+'\n\n'+meta.participants.map(x=>'@'+jidNum(x.id)).join(' '),mentions:meta.participants.map(x=>x.id)})}
   if(c==='open'||c==='close'){if(!chat.endsWith('@g.us'))return;await s.groupSettingUpdate(chat,c==='open'?'not_announcement':'announcement');return s.sendMessage(chat,{text:c==='open'?'Grupo aberto.':'Grupo fechado para membros.'})}
   if(c==='setname'){if(!chat.endsWith('@g.us')||!requireOwner(m))return;await s.groupUpdateSubject(chat,arg(a));return s.sendMessage(chat,{text:'Nome do grupo alterado.'})}
   if(c==='setdesc'){if(!chat.endsWith('@g.us')||!requireOwner(m))return;await s.groupUpdateDescription(chat,arg(a));return s.sendMessage(chat,{text:'Descrição alterada.'})}
   if(c==='linkgp'){if(!chat.endsWith('@g.us'))return;let code=await s.groupInviteCode(chat);return s.sendMessage(chat,{text:`https://chat.whatsapp.com/${code}`})}
   if(c==='groupinfo'){if(!chat.endsWith('@g.us'))return;let g=await s.groupMetadata(chat);return s.sendMessage(chat,{text:`${g.subject}\nDono: ${g.owner||'desconhecido'}\nMembros: ${g.participants.length}\nDescrição: ${g.desc||'sem descrição'}`})}
   if(c==='perfil'||c==='rank'||c==='level'||c==='xp'||c==='daily'){return s.sendMessage(chat,{text:`Perfil de ${user}\nXP: 0\nNível: 1\nUse ${p}rpgperfil para o RPG.`})}
   if(c==='rpg'||c.startsWith('rpg'))return s.sendMessage(chat,{text:`RPG 7kzz\n› ${p}rpgstart\n› ${p}rpgperfil\n› ${p}rpgdaily\n› ${p}rpgwork\n› ${p}rpghunt\n› ${p}rpgtrain\n› ${p}rpgshop\n› ${p}rpgduel`});
   if(c==='sticker'||c==='s'){if(!m.message.imageMessage)return s.sendMessage(chat,{text:`Envie uma imagem com ${p}sticker`});let buf=await downloadMediaMessage(m,'buffer',{},{});return s.sendMessage(chat,{sticker:buf})}
   if(c==='toimg'&&m.message.stickerMessage){let buf=await downloadMediaMessage(m,'buffer',{},{});return s.sendMessage(chat,{image:buf})}
   return s.sendMessage(chat,{text:`Comando ${p}${c} não encontrado. Use ${p}menu.`});
  }catch(e){console.error(e);await s.sendMessage(chat,{text:'Erro ao executar o comando.'})}
 });}
start();
