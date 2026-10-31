/* Mietix: Seite auch ohne Internet (31.10.2026). Netz zuerst, Speicher ohne Netz oder wenn das Netz länger als 3 Sekunden braucht. */
const C="mietix-seiten-1";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(/supabase\.co$/.test(u.hostname))return;
  if(!(u.origin===self.location.origin||/fonts\.(googleapis|gstatic)\.com$|jsdelivr\.net$|unpkg\.com$|cdnjs\.cloudflare\.com$/.test(u.hostname)))return;
  if(r.cache==="no-store"||r.cache==="force-cache")return;   // Versionsprüfung der Seite selbst nicht stören
  const ausSpeicher=()=>caches.match(r,{ignoreSearch:u.origin===self.location.origin}).then(m=>m||caches.match(u.origin+u.pathname));
  const netz=fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const k=res.clone();caches.open(C).then(c=>c.put(r,k)).catch(()=>{})}return res});
  // Seitenaufruf bei schlechtem Netz (Tiefgarage, Übergabe): nach 3 Sekunden die Kopie vom Handy zeigen, das Netz holt im Hintergrund weiter (31.10.2026)
  if(r.mode==="navigate"){e.respondWith(new Promise(ok=>{let fertig=false;const gib=x=>{if(!fertig&&x){fertig=true;ok(x)}};
    const t=setTimeout(()=>ausSpeicher().then(gib),3000);
    netz.then(res=>{clearTimeout(t);gib(res)}).catch(()=>{clearTimeout(t);ausSpeicher().then(m=>{gib(m||Response.error());if(!m&&!fertig){fertig=true;ok(Response.error())}})})}));
    e.waitUntil(netz.catch(()=>{}));return}
  e.respondWith(netz.catch(()=>ausSpeicher().then(m=>m||Response.error())))});
