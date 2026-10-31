/* Mietix: Seite auch ohne Internet (31.10.2026). Netz zuerst, Speicher nur ohne Netz. */
const C="mietix-seiten-1";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(/supabase\.co$/.test(u.hostname))return;
  if(!(u.origin===self.location.origin||/fonts\.(googleapis|gstatic)\.com$|jsdelivr\.net$|unpkg\.com$|cdnjs\.cloudflare\.com$/.test(u.hostname)))return;
  if(r.cache==="no-store"||r.cache==="force-cache")return;   // Versionsprüfung der Seite selbst nicht stören
  e.respondWith(fetch(r).then(res=>{if(res&&(res.ok||res.type==="opaque")){const k=res.clone();caches.open(C).then(c=>c.put(r,k)).catch(()=>{})}return res})
    .catch(()=>caches.match(r,{ignoreSearch:u.origin===self.location.origin}).then(m=>m||caches.match(u.origin+u.pathname)).then(m=>m||Response.error())))});
