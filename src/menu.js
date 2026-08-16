const groups={
menudown:['play','ytmp3','ytmp4','tiktok','instagram','facebook','mediafire','gdrive','pinterest','spotify','soundcloud','apk','gitclone'],
menulogos:['logo','logo2','logo3','logo4','neon','glitch','gold','blackpink','naruto','dragonball'],
menuedits:['edit','blur','enhance','upscale','removebg','pixel','invert','gray','sepia','mirror','rotate'],
menuadm:['add','kick','ban','unban','promote','demote','mute','unmute','tagall','hidetag','linkgp','revoke','setname','setdesc','setphoto','groupinfo','open','close','antilink','antispam','antiflood','antiporno','antigore','antiviolence','antipalavra','antimedia','antifake','protecao','punicao','warn','warnings','clearwarn'],
menubn:['bemvindo','bemvindo2','saudacao','despedida','setwelcome','delwelcome'],
menudono:['setprefix','setbotname','grupos','block','unblock','broadcast','oii','oiimenu','oiioff','reload','status','setowner','setbio','setppbot'],
menumemb:['perfil','rank','level','xp','daily','rep','toprep','register','unregister'],
ferramentas:['ping','runtime','info','id','calc','say','tts','translate','short','qr','menu','help'],
menufig:['sticker','s','toimg','take','attp','figinfo','stickerpack'],
alteradores:['toaudio','tomp3','bass','nightcore','slow','fast','reverse','volume','robot','deep','pitch'],
menurpg:['rpg','rpgstart','rpgperfil','rpgdaily','rpgwork','rpghunt','rpgtrain','rpgshop','rpgbuy','rpgsell','rpgduel','rpgrank'],
menuvip:['vip','addvip','delvip','listvip','vipmenu','viponly','checkvip']};
export function mainMenu(user,prefix,name){return `╭────────────────────────╮\n│       『 ${name} 』        │\n│      Olá, ${user}!        │\n╰────────────────────────╯\n\n╭────── 🇧🇷 MENU PRINCIPAL ──────╮\n│\n${Object.keys(groups).map(x=>`│  › ${prefix}${x}`).join('\n')}\n│\n╰────────────────────────────────╯\n\n╭─────── ⚡ 7KZZ SYSTEM ───────╮\n│  Sistema online\n│  Comandos organizados\n╰──────────────────────────────╯`}
export function submenu(cmd,prefix){let a=groups[cmd];if(!a)return null;return `╭────── ${cmd.toUpperCase()} ──────╮\n${a.map(x=>`│ › ${prefix}${x}`).join('\n')}\n╰────────────────────────╯`}
export {groups};
