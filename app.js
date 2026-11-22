(async()=>{
const $=s=>document.querySelector(s),J=u=>fetch(u).then(r=>r.json());
const [M,UI]=await Promise.all([J('56-menu.json'),J('51-ui.json')]);
const RTL=['ar'];const P=new URLSearchParams(location.search);let L=P.get('lang')||localStorage.lang||(UI[(navigator.language||'en').slice(0,2)]?(navigator.language).slice(0,2):'en');
let cat='all',q='',cart=JSON.parse(localStorage.cart||'{}');
const t=k=>(UI[L]||UI.en)[k]||UI.en[k];
const nm=i=>i.n[L]||i.n.en,ds=i=>i.d[L]||i.d.en;
const save=()=>localStorage.cart=JSON.stringify(cart);
const money=n=>M.currency+n.toLocaleString('en-IN');
const E=(h)=>{const d=document.createElement('div');d.innerHTML=h.trim();return d.firstChild};
function langs(){const b=$('#langs');b.innerHTML='';Object.keys(UI).forEach(k=>{const e=E(`<button class="${k==L?'on':''}">${UI[k].l}</button>`);e.onclick=()=>{L=k;localStorage.lang=k;draw()};b.append(e)});
 const m=E(`<button id="more">🌐 ${t('more')}</button>`);m.onclick=openGT;b.append(m)}
function openGT(){const g=$('#gt');g.classList.toggle('open');if(window.google&&google.translate)return;
 window.gtInit=()=>new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'gt');
 const s=document.createElement('script');s.src='https://translate.google.com/translate_a/element.js?cb=gtInit';document.body.append(s)}
function cats(){const b=$('#cats');b.innerHTML='';[['all',t('all')],['veg',t('veg')],['nonveg',t('nonveg')],...M.cats.map(c=>[c,t(c)])].forEach(([k,v])=>{const e=E(`<button class="${k==cat?'on':''}">${v}</button>`);e.onclick=()=>{cat=k;cats();grid()};b.append(e)})}
function vis(i){if(cat=='veg'&&!i.veg)return 0;if(cat=='nonveg'&&i.veg)return 0;if(M.cats.includes(cat)&&i.cat!=cat)return 0;
 if(q&&!(Object.values(i.n).join(' ')+' '+ds(i)).toLowerCase().includes(q))return 0;return 1}
function grid(){const g=$('#grid');g.innerHTML='';M.items.filter(vis).forEach((i,x)=>{
 const c=E(`<div class="card" style="animation-delay:${x*50}ms">${i.glb?`<model-viewer environment-image="neutral" exposure="1.3" class="im" src="${GLB}" poster="${IMG(i.img)}" loading="lazy" reveal="auto" auto-rotate rotation-per-second="35deg" disable-zoom interaction-prompt="none" camera-orbit="30deg 65deg auto" style="pointer-events:none;--poster-color:#fff;background:#fff"></model-viewer>`:`<img class="im" loading="lazy" src="${IMG(i.img)}" alt="">`}<span class="badge ${i.glb?'d3':''}">${i.glb?t('d3'):t('photo')}</span><span class="vg ${i.veg?'':'nv'}"></span><div class="t"><h3>${nm(i)}</h3><div class="row"><span class="price">${money(i.price)}</span><button class="plus">+</button></div></div></div>`);
 c.querySelector('.plus').onclick=e=>{e.stopPropagation();add(i.id,1);c.animate([{transform:'scale(.94)'},{transform:'scale(1)'}],200)};
 c.onclick=()=>open(i);g.append(c)});bar()}
function add(id,n){cart[id]=Math.max(0,(cart[id]||0)+n);if(!cart[id])delete cart[id];save();bar();if(navigator.vibrate)navigator.vibrate(12)}
const count=()=>Object.values(cart).reduce((a,b)=>a+b,0),sum=()=>M.items.reduce((s,i)=>s+(cart[i.id]||0)*i.price,0);
function bar(){const b=$('#cartbar'),n=count();b.hidden=!n;b.innerHTML=`<span>${t('view')} · ${n} ${t('items')}</span><span>${money(sum())}</span>`;b.onclick=order}
function sheet(h){const s=$('#sheet');s.hidden=false;s.innerHTML=`<div class="panel"><button class="x" aria-label="${t('close')}">×</button>${h}</div>`;
 s.onclick=e=>{if(e.target==s||e.target.classList.contains('x'))close()};return s}
function close(){const s=$('#sheet');s.hidden=true;s.innerHTML=''}
function open(i){
 const stage=i.glb?`<model-viewer src="${GLB}" poster="${IMG(i.img)}" alt="${nm(i)}" camera-controls auto-rotate auto-rotate-delay="1500" rotation-per-second="25deg" interaction-prompt="auto" shadow-intensity="1.2" exposure="1.35" environment-image="neutral" ar ar-modes="webxr scene-viewer quick-look" camera-orbit="30deg 65deg auto" touch-action="pan-y"><button slot="ar-button" class="arbtn">${t('ar')}</button></model-viewer><div class="hintbar">${t('hint')}</div>`
 :`<img class="ph" src="${IMG(i.img)}" alt="${nm(i)}"><div class="hintbar">${t('tilt')}</div>`;
 const s=sheet(`<div class="stage">${stage}</div><h2>${nm(i)}</h2><p class="d">${ds(i)}</p><div class="big"><span class="price" style="font-size:22px">${money(i.price)}</span><div class="qty"><button data-d="-1">−</button><b id="qn">${cart[i.id]||0}</b><button data-d="1">+</button></div><button class="cta">${t('add')}</button></div>`);
 s.querySelectorAll('.qty button').forEach(b=>b.onclick=()=>{add(i.id,+b.dataset.d);$('#qn').textContent=cart[i.id]||0});
 s.querySelector('.cta').onclick=()=>{add(i.id,1);$('#qn').textContent=cart[i.id];};
 if(!i.glb){const im=s.querySelector('.ph'),st=s.querySelector('.stage');const tilt=(x,y)=>im.style.transform=`scale(1.08) rotateY(${x*14}deg) rotateX(${-y*14}deg)`;
  st.onpointermove=e=>{const r=st.getBoundingClientRect();tilt((e.clientX-r.left)/r.width-.5,(e.clientY-r.top)/r.height-.5)};
  st.onpointerleave=()=>im.style.transform='';
  window.ondeviceorientation=e=>{if(e.gamma!=null)tilt(Math.max(-.5,Math.min(.5,e.gamma/60)),Math.max(-.5,Math.min(.5,(e.beta-45)/90)))}}}
function order(){const ids=Object.keys(cart);if(!ids.length)return;
 const rows=ids.map(id=>{const i=M.items.find(x=>x.id==id);return `<div class="line"><span>${cart[id]} × ${nm(i)}</span><span>${money(cart[id]*i.price)}</span></div>`}).join('');
 const s=sheet(`<h2 style="margin-top:4px">${t('order')}</h2>${rows}<div class="tot"><span>${t('total')}</span><span>${money(sum())}</span></div><div class="show">${t('show')}</div><br><button class="cta" style="width:100%;background:#2c241a;color:var(--ink)" id="clr">${t('clear')}</button>`);
 s.querySelector('#clr').onclick=()=>{cart={};save();close();bar()}}
function draw(){document.documentElement.lang=L;document.documentElement.dir=RTL.includes(L)?'rtl':'ltr';
 $('#name').textContent=M.name;$('#place').textContent=M.place;$('#q').placeholder=t('search');$('#demo').textContent=t('demo');langs();cats();grid()}
$('#q').oninput=e=>{q=e.target.value.toLowerCase();grid()};
draw();if(P.get('open'))open(M.items.find(x=>x.id==P.get('open')));if(P.get('order')){add('cb',1);add('af',2);order()}
})();
