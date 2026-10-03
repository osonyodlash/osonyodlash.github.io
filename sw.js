// Offline: sahifa — avval tarmoq, keyin kesh; lug'at va boshqa fayllar — avval kesh, fonda yangilanadi.
const C='oy-v3';
const CORE=['./','index.html','manifest.json','bank/a1.json','bank/a2.json','bank/b1.json','bank/b2.json','bank/c1.json','bank/c2.json','bank/texts.json','icons/icon-192.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.hostname.endsWith('goatcounter.com'))return;
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put('index.html',cp));return res}).catch(()=>caches.match('index.html')));return}
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>hit);return hit||net}))});
