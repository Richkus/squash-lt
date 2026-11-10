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
const GRP_OF={varzybos:'varz',la28:'varz','kur-zaisti':'zaisk',treneriai:'zaisk',apie:'lsa',partneriai:'lsa'};
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
  const solidNow=!heroPanel || heroPanel.getBoundingClientRect().bottom<64;
  if(solidNow!==topBar.classList.contains('solid')){ topBar.classList.toggle('solid',solidNow); setTimeout(()=>updateNav(navCur),reduceMotion?0:470); }
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

/* Tema: auto → šviesi → tamsi */
const themeBtn=document.getElementById('theme'), themeLbl=document.getElementById('themeLbl');
const THEMES=['auto','light','dark'], TL={auto:'Tema: auto',light:'Tema: šviesi',dark:'Tema: tamsi'};
let theme='auto'; try{ theme=localStorage.getItem('lsa-theme')||'auto'; }catch(_){}
function applyTheme(){ if(theme==='auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.dataset.theme=theme; themeLbl.textContent=TL[theme]; }
applyTheme();
themeBtn.addEventListener('click',()=>{ theme=THEMES[(THEMES.indexOf(theme)+1)%3]; try{ localStorage.setItem('lsa-theme',theme); }catch(_){} applyTheme(); });

/* Favicon: kamuoliukas su dviem taškais retkarčiais trumpam virsta rakete */
(function(){
  const svg=inner=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7.5' fill='#1F7A52'/>${inner}</svg>`);
  const BALL=svg(`<mask id='m'><rect width='32' height='32' fill='#fff'/><circle cx='12.4' cy='12.6' r='2.3' fill='#000'/><circle cx='19.6' cy='12.6' r='2.3' fill='#000'/></mask><circle cx='16' cy='16' r='9.5' fill='#fff' mask='url(#m)'/>`);
  const RACKET=svg(`<ellipse cx='16' cy='12' rx='6.5' ry='8' fill='none' stroke='#fff' stroke-width='2.2'/><path d='M16 20v8' stroke='#fff' stroke-width='3' stroke-linecap='round'/>`);
  const set=h=>{ const l=document.querySelector('link[rel="icon"]'); if(l && l.href!==h) l.href=h; };
  set(BALL);
  if(reduceMotion) return;
  function flash(){ if(document.hidden) return; set(RACKET); setTimeout(()=>set(BALL),900); }
  setTimeout(flash,2200); setInterval(flash,10000);
})();
