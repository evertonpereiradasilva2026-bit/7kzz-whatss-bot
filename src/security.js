const linkRe=/(https?:\/\/|www\.|chat\.whatsapp\.com\/|wa\.me\/|t\.me\/|discord(?:\.gg|\.com\/invite)\/|bit\.ly\/|tinyurl\.com\/)/i;
const pornWords=['porn','porno','xxx','nsfw','sex','nude','nudes','onlyfans'];
const goreWords=['gore','g0re','beheading','decapitation','snuff','mutilation'];
const violenceWords=['massacre','murder','assassination','torture'];
const fakeWords=['fake news','deepfake','golpe','phishing'];
export function classifyText(text, s){
 const t=(text||'').toLowerCase();
 if(s.antiporno && pornWords.some(x=>t.includes(x))) return 'porn';
 if(s.antigore && goreWords.some(x=>t.includes(x))) return 'gore';
 if(s.antiviolence && violenceWords.some(x=>t.includes(x))) return 'violence';
 if(s.antifake && fakeWords.some(x=>t.includes(x))) return 'fake';
 if(s.antipalavra && (s.blockedWords||[]).some(x=>x && t.includes(x.toLowerCase()))) return 'word';
 if(s.antilink && linkRe.test(t)) return 'link';
 return null;
}
export function mediaKind(m){
 if(m?.message?.imageMessage) return 'image';
 if(m?.message?.videoMessage) return 'video';
 if(m?.message?.audioMessage) return 'audio';
 if(m?.message?.documentMessage) return 'document';
 return null;
}
