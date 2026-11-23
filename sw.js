const V='alpha-20261123m';
const CORE=["./", "index.html", "alpha.css", "alpha.js?v=20261123m", "spritemap.js", "credits.js", "51-ui.json", "56-menu.json", "ui2.json", "spc0.js", "spc1.js", "spc2.js", "spc3.js", "spc4.js", "spc5.js", "spc6.js", "spc7.js", "spc8.js", "spc9.js", "spc10.js", "spc11.js", "spc12.js", "spc13.js", "p3d/plate.js", "p3d/z9.js", "p3d/z20.js", "p3d/z34.js", "p3d/z35.js", "p3d/z50.js", "p3d/z52.js", "p3d/z54.js", "p3d/z112.js", "p3d/z114.js", "p3d/z121.js", "p3d/z135.js", "p3d/z161.js", "p3d/z175.js", "p3d/z180.js", "p3d/z183.js", "p3d/z193.js", "59-apollo-fish.webp", "60-chicken-65.webp", "61-chicken-biryani.webp", "62-chicken-lollipop.webp", "63-chilli-chicken.webp", "65-fried-rice.webp", "66-veg-biryani.webp", "dish.b64.1.txt", "dish.b64.2.txt", "fish.b64.txt"];
const EXT=["https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(async c=>{
 await Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})));
 await Promise.all(EXT.map(u=>fetch(u,{mode:'no-cors'}).then(r=>c.put(u,r)).catch(()=>{})));
}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(V).then(c=>c.put('index.html',y));return x}).catch(()=>caches.match('index.html',{ignoreSearch:true})));return}
 e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r,{ignoreSearch:true}))));
});
