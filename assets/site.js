/* Bendra visų puslapių logika: juosta, meniu, slinkimas, žinutės langas, versija, tema.
   Puslapis aprašo save per window.PAGE = { spy:[[id,pavadinimas]...], current:'naujienos', label:'Naujienos' }. */
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const arrSvg='<svg width="11" height="11" aria-hidden="true"><use href="#arr"/></svg>';
const plusSvg='<svg aria-hidden="true"><use href="#plus"/></svg>';
const PAGE=window.PAGE||{spy:[]};
const samePage=a=>{ const n=p=>p.replace(/index\.html$/,''); try{ const u=new URL(a.href,location.href); return n(u.pathname)===n(location.pathname) && u.hash.length>1; }catch(_){ return false; } };

/* Mobilus meniu */
const menu=document.getElementById('mnav'), mOpen=document.getElementById('menuOpen');
const GRP_OF={kalendorius:'varz',reitingas:'varz','kur-zaisti':'zaisk',treneriai:'zaisk',saugumo:'zaisk',apie:'lsa',valdyba:'lsa',teisejams:'lsa',antidopingas:'lsa',manipuliavimas:'lsa'};
function setGroup(g,on){ g.classList.toggle('open',on); g.querySelector('.mnav-item').setAttribute('aria-expanded',String(on)); }
function setMenu(on){
  if(on){
    menu.hidden=false; void menu.offsetWidth; menu.classList.add('open');
    document.documentElement.style.overflow='hidden';
    const cur=GRP_OF[curId()]||null;
    menu.querySelectorAll('.mnav-grp').forEach(g=>setGroup(g,g.dataset.grp===cur));
    setTimeout(()=>menu.querySelector('.mnav-close').focus({preventScroll:true}),60);
  }else if(!menu.hidden){
    menu.classList.remove('open'); document.documentElement.style.overflow='';
    setTimeout(()=>{ if(!menu.classList.contains('open')) menu.hidden=true; }, reduceMotion?0:300);
  }
  mOpen.setAttribute('aria-expanded',String(on));
}
mOpen.addEventListener('click',()=>setMenu(true));
menu.addEventListener('click',e=>{
  if(e.target.closest('[data-mclose]')){ setMenu(false); mOpen.focus({preventScroll:true}); return; }
  const it=e.target.closest('.mnav-grp > .mnav-item'); if(it){ const g=it.parentElement; setGroup(g,!g.classList.contains('open')); }
});
addEventListener('keydown',e=>{ if(e.key==='Escape' && menu.classList.contains('open')){ setMenu(false); mOpen.focus(); } });
addEventListener('resize',()=>{ if(innerWidth>=1180 && menu.classList.contains('open')) setMenu(false); });

/* Sklandus slinkimas (easeInOutCubic) ir atvykimo žyma. Veikia tik nuorodoms į tą patį puslapį */
let glideId=0;
function glide(target){
  const y=target.id==='pradzia' ? 0 : Math.max(0,target.getBoundingClientRect().top+scrollY+(parseFloat(getComputedStyle(target).paddingTop)||0)-92);
  const start=scrollY, d=y-start, id=++glideId;
  if(reduceMotion || Math.abs(d)<2){ scrollTo(0,y); return Promise.resolve(); }
  const dur=Math.min(1300,Math.max(600,Math.abs(d)*0.32)), t0=performance.now();
  return new Promise(res=>{
    (function step(t){
      if(id!==glideId) return res();
      const p=Math.min(1,(t-t0)/dur), k=p<.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;
      scrollTo(0,start+d*k);
      p<1 ? requestAnimationFrame(step) : res();
    })(t0);
  });
}
addEventListener('wheel',()=>glideId++,{passive:true});
addEventListener('touchstart',()=>glideId++,{passive:true});
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href*="#"]'); if(!a || a.hasAttribute('data-inquiry') || !samePage(a)) return;
  const t=document.getElementById(new URL(a.href,location.href).hash.slice(1)); if(!t) return;
  e.preventDefault();
  if(menu.classList.contains('open')) setMenu(false);
  spyLock=SPY.some(([id])=>id===t.id) ? t.id : null; spy();
  glide(t).then(()=>{ spyLock=null; spy(); t.classList.remove('arrive'); void t.offsetWidth; t.classList.add('arrive'); setTimeout(()=>t.classList.remove('arrive'),1700); });
});

/* Juosta: išskleidžiami sąrašai ir slenkanti aktyvaus skyriaus žyma.
   Žyma stoja ant grupės mygtuko, jei aktyvus punktas yra jos viduje; „Daugiau“ rodo dabartinio punkto pavadinimą */
const navBar=document.getElementById('navBar'), navInd=navBar.querySelector('.nav-ind'), dds=[...navBar.querySelectorAll('.nav-more')];
function setDD(dd,on){ dd.classList.toggle('open',on); dd.querySelector('.nav-more-btn').setAttribute('aria-expanded',String(on)); }
dds.forEach(dd=>dd.querySelector('.nav-more-btn').addEventListener('click',e=>{ e.stopPropagation(); const on=!dd.classList.contains('open'); dds.forEach(x=>setDD(x,false)); setDD(dd,on); }));
document.addEventListener('click',e=>{ dds.forEach(dd=>{ if(dd.classList.contains('open') && (!dd.contains(e.target) || e.target.closest('.nav-more-panel a'))) setDD(dd,false); }); });
addEventListener('keydown',e=>{ const o=dds.find(dd=>dd.classList.contains('open')); if(e.key==='Escape' && o){ setDD(o,false); o.querySelector('.nav-more-btn').focus(); } });
let navCur=null;
function updateNav(id){
  navCur=id;
  navBar.querySelectorAll('a[data-nav]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.nav===id)));
  const a=id ? navBar.querySelector(`a[data-nav="${id}"]`) : null, dd=a ? a.closest('.nav-more') : null;
  dds.forEach(x=>{
    const btn=x.querySelector('.nav-more-btn'), lbl=x.querySelector('.nav-more-label');
    btn.setAttribute('aria-current',String(x===dd));
    if(x.dataset.swap!==undefined) lbl.textContent= x===dd ? a.firstChild.textContent.trim() : lbl.dataset.def;
  });
  const target=!a ? null : dd ? dd.querySelector('.nav-more-btn') : a;
  if(!target || !navBar.offsetWidth){ navInd.style.opacity='0'; return; }
  const x=target.getBoundingClientRect().left-navBar.getBoundingClientRect().left;
  const first=navInd.style.opacity!=='1';
  if(first) navInd.style.transition='none';
  navInd.style.width=target.offsetWidth+'px'; navInd.style.transform=`translateX(${x}px)`; navInd.style.opacity='1';
  if(first){ void navInd.offsetWidth; navInd.style.transition=''; }
}
navBar.querySelectorAll('.nav-more-label').forEach(l=>l.dataset.def=l.textContent);
addEventListener('resize',()=>updateNav(navCur));
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(()=>updateNav(navCur));

/* Aktyvus skyrius. Vidiniame puslapyje aktyvus visada pats puslapis (PAGE.current) */
const SPY=PAGE.spy||[];
const spySecs=SPY.map(([id])=>document.getElementById(id));
const ddLabel=document.getElementById('ddLabel');
let curSpy=null, spyQueued=false, spyLock=null;
const curId=()=>PAGE.current || (curSpy>=0 && SPY[curSpy] ? SPY[curSpy][0] : null);
const topBar=document.querySelector('.top'), heroPanel=document.querySelector('.hero-panel');
function spy(){
  spyQueued=false;
  const hr=heroPanel && heroPanel.getBoundingClientRect(), solidNow=!hr || !(hr.top<72 && hr.bottom>64);   /* skaidri juosta tik tada, kai po ja tamsi hero nuotrauka */
  document.documentElement.classList.toggle('past-hero',solidNow);
  const atTop=scrollY<40;   /* puslapio pradžioje pilnas logotipas kairėje, nuslinkus įslysta į juostą */
  if(solidNow!==topBar.classList.contains('solid') || atTop!==topBar.classList.contains('at-top')){ topBar.classList.toggle('solid',solidNow); topBar.classList.toggle('at-top',atTop); setTimeout(()=>updateNav(navCur),reduceMotion?0:470); }
  let idx=-1;
  if(SPY.length){
    const line=innerHeight*0.38;
    spySecs.forEach((s,i)=>{ if(s && s.getBoundingClientRect().top+(parseFloat(getComputedStyle(s).paddingTop)||0)<=line) idx=i; });
    if(innerHeight+scrollY>=document.documentElement.scrollHeight-4) idx=spySecs.length-1;
    if(spyLock!==null) idx=SPY.findIndex(([id])=>id===spyLock);
  }
  if(idx===curSpy) return; curSpy=idx;
  const id=curId();
  updateNav(id);
  menu.querySelectorAll('[data-spy]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.spy===id)));
  ddLabel.textContent=PAGE.label || (idx<0 ? 'Meniu' : SPY[idx][1]);
  ddLabel.classList.remove('swap'); void ddLabel.offsetWidth; ddLabel.classList.add('swap');
}
addEventListener('scroll',()=>{ if(!spyQueued){ spyQueued=true; requestAnimationFrame(spy); } },{passive:true});
addEventListener('resize',spy); spy();

/* Kopijavimas */
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>{
  const old=b.textContent, ok=()=>{ b.textContent='Nukopijuota'; setTimeout(()=>b.textContent=old,1600); };
  try{ navigator.clipboard.writeText(b.dataset.copy).then(ok).catch(()=>{}); }catch(_){}
}));

/* Žinutės langas (eskizas: nieko nesiunčia) */
const drawer=document.getElementById('drawer'), form=document.getElementById('inq'), err=document.getElementById('err'), done=document.getElementById('done');
let lastFocus=null;
function setDrawer(on,topic){
  if(on){ lastFocus=document.activeElement; if(topic) form.tema.value=topic; }
  drawer.classList.toggle('open',on); drawer.setAttribute('aria-hidden',String(!on));
  document.documentElement.style.overflow=on ? 'hidden' : '';
  document.documentElement.classList.toggle('modal-open',on);
  if(on) setTimeout(()=>(form.hidden ? document.getElementById('again') : form.vardas).focus({preventScroll:true}),80);
  else if(lastFocus) lastFocus.focus({preventScroll:true});
}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-inquiry]');
  if(t){ e.preventDefault(); if(menu.classList.contains('open')) setMenu(false); setDrawer(true,t.dataset.inquiry); return; }
  if(e.target.closest('[data-dclose]')) setDrawer(false);
});
addEventListener('keydown',e=>{ if(e.key==='Escape' && drawer.classList.contains('open')) setDrawer(false); });
const FLAGS={
  '+370':'linear-gradient(#FDB913 0 33.4%,#006A44 0 66.7%,#C1272D 0)',
  '+371':'linear-gradient(#9E3039 0 40%,#FFFFFF 0 60%,#9E3039 0)',
  '+372':'linear-gradient(#0072CE 0 33.4%,#000000 0 66.7%,#FFFFFF 0)',
  '+48':'linear-gradient(#FFFFFF 0 50%,#DC143C 0)',
  '+44':'linear-gradient(#012169 0 100%)'
};
const flag=document.getElementById('flag');
const setFlag=()=>flag.style.background=FLAGS[form.kodas.value];
form.kodas.addEventListener('change',setFlag); setFlag();
form.addEventListener('submit',e=>{
  e.preventDefault();
  const name=form.vardas.value.trim(), phone=form.telefonas.value.trim(), mail=form.elpastas.value.trim(), msg=form.zinute.value.trim(), how=form.atsakymas.value;
  if(!name){ err.textContent='Įrašyk vardą, kad žinotume, kaip į tave kreiptis.'; form.vardas.focus(); return; }
  if(how==='laiskas' && !/^\S+@\S+\.\S+$/.test(mail)){ err.textContent='Pasirinkai laišką, todėl įrašyk el. pašto adresą, pvz. vardas@pastas.lt.'; form.elpastas.focus(); return; }
  if(how==='skambutis' && phone.replace(/\D/g,'').length<6){ err.textContent='Pasirinkai skambutį, todėl įrašyk telefono numerį.'; form.telefonas.focus(); return; }
  if(!msg){ err.textContent='Parašyk trumpą žinutę.'; form.zinute.focus(); return; }
  err.textContent='';
  document.getElementById('doneText').textContent=(how==='skambutis' ? `Paskambintume numeriu ${form.kodas.value} ${phone}.` : `Atsakytume adresu ${mail}.`)+' Tai eskizas, todėl niekas neišsiųsta.';
  form.hidden=true; done.hidden=false; document.getElementById('again').focus();
});
document.getElementById('again').addEventListener('click',()=>{ form.reset(); setFlag(); done.hidden=true; form.hidden=false; form.vardas.focus(); });

/* Sena versija: mobilus meniu */
const oldTop=document.getElementById('oldTop'), oldBurger=document.getElementById('oldBurger');
oldBurger.addEventListener('click',()=>{ const on=!oldTop.classList.contains('open'); oldTop.classList.toggle('open',on); oldBurger.setAttribute('aria-expanded',String(on)); });
oldTop.addEventListener('click',e=>{ if(e.target.closest('.old-mpanel a')){ oldTop.classList.remove('open'); oldBurger.setAttribute('aria-expanded','false'); } });

/* Versijų perjungiklis: Senas (dabartinė squash.lt juosta ir poraštė) / Naujas. Pasirinkimas keliauja per puslapius */
const verBtns=document.querySelectorAll('.ver button');
function setVer(v){
  if(v==='old') document.documentElement.dataset.ver='old'; else document.documentElement.removeAttribute('data-ver');
  verBtns.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ver===v)));
  try{ localStorage.setItem('lsa-ver',v); }catch(_){}
  const u=new URL(location.href); u.searchParams.set('v',v==='old'?'senas':'naujas'); history.replaceState(null,'',u);
  if(menu.classList.contains('open')) setMenu(false);
  spy(); updateNav(navCur);
}
verBtns.forEach(b=>b.addEventListener('click',()=>setVer(b.dataset.ver)));
setVer(document.documentElement.dataset.ver==='old'?'old':'new');

/* Velykinis kiaušinis: skvošo ralis. Paduok kamuoliuką ir spausk jį, kad neatšoktų du kartus nuo grindų */
(function(){
  const btn=document.getElementById('egg'); if(!btn) return;
  try{ localStorage.removeItem('lsa-theme'); }catch(_){}
  let best=0; try{ best=+localStorage.getItem('lsa-rally-best')||0; }catch(_){}
  let ball=null, hud=null, toast=null, raf=0, x=0, y=0, vx=0, vy=0, rally=0, floor=0, last=0, live=false;
  const G=1900, R=14;
  const say=n=> n===0 ? 'Dvigubas atšokimas. Nieko tokio, treneriai išmokys.'
    : n<5 ? 'Neblogai pradžiai. Korte būtų dar smagiau.'
    : n<15 ? 'Rimtas ralis. Gal jau metas varžyboms?'
    : 'Rinktinės lygis. Mes tavęs ieškome.';
  function el(cls,html){ const d=document.createElement('div'); d.className=cls; if(html) d.innerHTML=html; document.body.appendChild(d); return d; }
  function setHud(){ hud.innerHTML=`<b>Ralis ${rally}</b><span>Rekordas ${Math.max(best,rally)}</span>`; }
  function hit(){
    if(!live) return;
    rally++; floor=0;
    vy=-(900+Math.random()*350); vx=(Math.random()<.5?-1:1)*(220+Math.random()*420);
    ball.classList.remove('hit'); void ball.offsetWidth; ball.classList.add('hit');
    setHud();
  }
  function end(){
    live=false; cancelAnimationFrame(raf);
    if(rally>best){ best=rally; try{ localStorage.setItem('lsa-rally-best',best); }catch(_){} }
    ball.classList.add('out'); setTimeout(()=>{ ball&&ball.remove(); ball=null; },400);
    hud.classList.add('out'); setTimeout(()=>{ hud&&hud.remove(); hud=null; },300);
    showToast(`<span class="eyebrow">Taškas baigtas</span><p class="egg-score">${rally}<small>${rally===1?'smūgis':(rally%10>=2&&rally%10<=9&&(rally%100<10||rally%100>20))?'smūgiai':'smūgių'}</small></p><p class="egg-say">${say(rally)}</p>
      <div class="egg-acts"><button class="btn btn-accent" type="button" data-inquiry="Noriu išbandyti skvošą">Noriu išbandyti<span class="arr"><svg aria-hidden="true"><use href="#arr"/></svg></span></button><button class="btn btn-ghost" type="button" data-egg-again>Dar kartą</button></div>`);
  }
  function showToast(html){
    if(toast) toast.remove();
    toast=el('egg-toast',`<button class="egg-x" type="button" aria-label="Uždaryti" data-egg-close><svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 2l10 10M12 2 2 12"/></svg></button>${html}`);
    toast.setAttribute('role','dialog'); toast.setAttribute('aria-label','Skvošo ralis');
    requestAnimationFrame(()=>toast.classList.add('in'));
    setTimeout(()=>toast && toast.querySelector('.btn')?.focus({preventScroll:true}),120);
  }
  function closeToast(){ if(!toast) return; const t=toast; toast=null; t.classList.remove('in'); setTimeout(()=>t.remove(),300); btn.focus({preventScroll:true}); }
  function step(t){
    const dt=Math.min(.033,(t-last)/1000); last=t;
    vy+=G*dt; x+=vx*dt; y+=vy*dt;
    const W=innerWidth, H=innerHeight;
    if(x<R){ x=R; vx=Math.abs(vx)*.9; }
    if(x>W-R){ x=W-R; vx=-Math.abs(vx)*.9; }
    if(y<R){ y=R; vy=Math.abs(vy)*.8; }
    if(y>H-R){ y=H-R; vy=-Math.abs(vy)*.62; vx*=.9; floor++; ball.classList.remove('bounce'); void ball.offsetWidth; ball.classList.add('bounce'); if(floor>=2){ ball.style.transform=`translate(${x-R}px,${y-R}px)`; return end(); } }
    ball.style.transform=`translate(${x-R}px,${y-R}px)`;
    raf=requestAnimationFrame(step);
  }
  function serve(){
    closeToast();
    if(reduceMotion){ showToast(`<span class="eyebrow">Skvošo ralis</span><p class="egg-say">Paduotume kamuoliuką, bet tavo sistema prašo mažiau judesio. Pažaiskim tikrame korte?</p><div class="egg-acts"><button class="btn btn-accent" type="button" data-inquiry="Noriu išbandyti skvošą">Noriu išbandyti</button></div>`); return; }
    if(live) return;
    const r=btn.getBoundingClientRect();
    x=r.left+18; y=r.top; vx=260+Math.random()*200; vy=-1250; rally=0; floor=0; live=true;
    ball=el('sq-ball'); ball.setAttribute('role','button'); ball.setAttribute('aria-label','Mušk kamuoliuką'); ball.tabIndex=-1;
    ball.addEventListener('pointerdown',e=>{ e.preventDefault(); hit(); });
    hud=el('egg-hud'); setHud();
    const tip=el('egg-tip','Spausk kamuoliuką arba tarpo klavišą. Du atšokimai nuo grindų ir taškas baigtas.'); setTimeout(()=>tip.classList.add('out'),2600); setTimeout(()=>tip.remove(),3000);
    last=performance.now(); raf=requestAnimationFrame(step);
  }
  btn.addEventListener('click',serve);
  addEventListener('keydown',e=>{
    if(live && (e.code==='Space'||e.key===' ')){ e.preventDefault(); hit(); }
    else if(e.key==='Escape' && live){ end(); }
    else if(e.key==='Escape' && toast){ closeToast(); }
  });
  document.addEventListener('click',e=>{
    if(!toast) return;
    if(e.target.closest('[data-egg-close]')) closeToast();
    else if(e.target.closest('[data-egg-again]')) serve();
    else if(e.target.closest('.egg-toast [data-inquiry]')){ const t=toast; toast=null; t.remove(); }
  });
})();

/* Favicon: logotipo žmogeliukas, kas kelias sekundes trumpam virsta skvošo kamuoliuku su dviem taškais */
(function(){
  const svg=inner=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7.5' fill='#18786C'/>${inner}</svg>`);
  const FIGURE=svg(`<g transform='translate(4.3 3.6) scale(.96)'><path fill='#fff' d='M15.2626 5.71344C16.5292 5.32983 17.245 3.99207 16.8614 2.72547C16.4778 1.45888 15.14 0.743081 13.8735 1.12669C12.6069 1.51031 11.8911 2.84807 12.2747 4.11466C12.6583 5.38126 13.996 6.09706 15.2626 5.71344Z M19.3008 12.8302C19.9094 12.6723 20.3571 12.1511 20.4721 11.5332L21.1068 8.13892C22.6261 7.8415 24.2727 5.03591 24.5502 3.55952C24.8552 1.92829 23.7821 0.358388 22.1508 0.0517654C20.5196 -0.253324 18.9512 0.821387 18.6446 2.45262C18.3671 3.93054 18.8884 7.15007 20.2007 7.97182L19.29 12.8333L19.3008 12.8302ZM19.9048 5.52037C19.5951 4.415 19.5461 3.23604 19.658 2.64119C19.8588 1.57261 20.8906 0.865847 21.9592 1.06668H21.9607C22.4774 1.16327 22.9266 1.45609 23.224 1.8915C23.5214 2.3269 23.6318 2.85123 23.5352 3.36788C23.2317 4.98838 21.4732 7.25892 20.8216 7.13627C20.6331 7.10101 20.216 6.63034 19.9048 5.51884V5.52037Z M2.19766 9.59591C2.78484 9.438 3.38582 9.32761 3.98833 9.23716C4.59085 9.14517 5.20102 9.08078 5.81427 9.06545C6.42751 9.04552 7.04689 9.05932 7.66167 9.15744C8.27644 9.25249 8.89735 9.40887 9.46461 9.73389L9.64551 9.83814L9.55506 10.0374C9.03534 11.1873 8.49568 12.3294 7.96216 13.4731L7.14654 15.181L6.73567 16.0365C6.59309 16.3247 6.43671 16.6084 6.2696 16.8843C5.60423 17.9928 4.69663 18.9601 3.62345 19.6715C2.55488 20.3905 1.28239 20.8029 0.0175781 20.8183C0.643087 20.7309 1.25633 20.5806 1.83125 20.3369C2.40463 20.0931 2.94429 19.7804 3.43948 19.4078C4.42834 18.6612 5.24855 17.7107 5.8572 16.6405C6.16535 16.1086 6.40758 15.5352 6.68201 14.9618L7.48536 13.2478C8.03115 12.1087 8.57234 10.9696 9.13039 9.83661L9.22084 10.1386C8.73638 9.84734 8.16913 9.67716 7.59114 9.55911C7.01163 9.4426 6.41218 9.39967 5.81274 9.37974C4.61078 9.34448 3.39962 9.43646 2.1946 9.59897L2.19766 9.59591Z M13.128 14.2387L12.2143 13.8064L13.706 10.6528C14.3606 11.2108 15.1763 11.8041 16.1697 12.2395C16.9179 12.5676 17.6752 12.7562 18.4403 12.8237L19.0228 9.70684C17.3916 9.69305 16.1007 8.63213 14.908 7.4915L14.8666 7.45164C14.1705 6.7878 13.3258 6.32174 12.4213 6.10404C8.70347 5.21176 5.48087 6.03505 2.56949 8.62294C2.56949 8.62294 8.29413 7.39031 11.0001 9.02154L7.70081 15.9957C7.22248 17.0075 6.6261 17.9642 5.87948 18.7967C4.3341 20.5199 2.33339 21.6988 0 21.8552C7.22095 24.7068 10.8698 16.6488 10.8698 16.6488C10.8698 16.6488 15.3863 17.6422 20.0592 24.8954C20.0592 22.7138 19.4582 20.6854 18.3207 18.8319C17.0865 16.8235 15.2575 15.2475 13.1265 14.2387H13.128Z'/></g>`);
  const BALL=svg(`<mask id='m'><rect width='32' height='32' fill='#fff'/><circle cx='12.4' cy='12.6' r='2.3' fill='#000'/><circle cx='19.6' cy='12.6' r='2.3' fill='#000'/></mask><circle cx='16' cy='16' r='9.5' fill='#fff' mask='url(#m)'/>`);
  const set=h=>{ const l=document.querySelector('link[rel="icon"]'); if(l && l.href!==h) l.href=h; };
  set(FIGURE);
  if(reduceMotion) return;
  function flash(){ if(document.hidden) return; set(BALL); setTimeout(()=>set(FIGURE),900); }
  setTimeout(flash,2200); setInterval(flash,10000);
})();
