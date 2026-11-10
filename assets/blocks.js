/* Blokai iš assets/data.js. Tas pats blokas rodomas pagrindiniame ir vidiniame puslapyje:
   <div data-block="venues|coaches|events|rank|news|hero-event|countdown" ...></div>
   Šoninis panelis (Sheet) rodo trenerį ar klubą; antras ekranas užeina ant pirmo su „Atgal“. */

const MON=['Sau','Vas','Kov','Bal','Geg','Bir','Lie','Rgp','Rgs','Spa','Lap','Gru'];
const MON_FULL=['Sausis','Vasaris','Kovas','Balandis','Gegužė','Birželis','Liepa','Rugpjūtis','Rugsėjis','Spalis','Lapkritis','Gruodis'];
const ARR='<svg aria-hidden="true"><use href="#arr"/></svg>';
const placeOf=a=>typeof a==='number' ? VENUES[a] : a;
const coachesAt=i=>COACHES.map((c,j)=>[c,j]).filter(([c])=>c.at.includes(i));
const ini=c=>c.n.split(' ').map(w=>w[0]).join('');
const role=c=>c.soon?'Trenerė':'Treneris';
/* Skambinti treneriui: tikras numeris arba pavyzdinis su žyme */
const telHref=t=>'tel:'+t.replace(/\s/g,'');
const callBtn=(c,cls='btn btn-line')=>`<a class="${cls} call" href="${telHref(c.tel)}"><svg class="ph-ic" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 2h3l1.5 3.5-2 1.2a8 8 0 0 0 3.8 3.8l1.2-2L14 10v3a1 1 0 0 1-1 1A11 11 0 0 1 2 3a1 1 0 0 1 1-1Z"/></svg><span>${esc(c.tel)}</span>${c.telDemo?'<small class="fake">Demo numeris</small>':''}</a>`;
/* Rankedin API (leidžia užklausas iš naršyklės) */
async function rkFetch({gender=1,age=1,skip=0,take=10}){
  const q=new URLSearchParams({rankingId:RANKING.id,rankingType:1,ageGroup:age,participantGender:gender,weekFromNow:0,language:'en',skip,take});
  const r=await fetch(`${RANKING.api}?${q}`); if(!r.ok) throw new Error(r.status); return r.json();
}
const clubShort=c=>(c||'').replace('Lithuanian squash association','LSA');
const upcoming=()=>{ const t=new Date().toISOString().slice(0,10); const f=EVENTS.filter(e=>(e.end||e.d)>=t); return f.length?f:EVENTS; };

/* Eilutės (vietoj piliulių): klubai ir treneriai kaip ramus sąrašas su linijomis */
function whereRows(c){
  return `<ul class="rows">${c.at.map(a=>{ const p=placeOf(a);
    return typeof a==='number'
      ? `<li><button type="button" class="row" data-venue="${a}"><span class="row-k">${esc(p.city)}</span><span class="row-v">${esc(p.place)}</span><span class="row-go">${ARR}</span></button></li>`
      : `<li><span class="row row-off"><span class="row-k">${esc(p.city)}</span><span class="row-v">${esc(p.place)}</span></span></li>`; }).join('')}</ul>`;
}
function coachRows(i){
  const list=coachesAt(i);
  if(!list.length) return '<p class="muted">Trenerių informacijos dar nėra.</p>';
  return `<ul class="rows">${list.map(([c,j])=>`<li><button type="button" class="row" data-coach="${j}"><span class="row-ini${c.img?' has-img':''}" aria-hidden="true">${c.img?`<img src="${esc(c.img)}" alt="" loading="lazy">`:esc(ini(c))}</span><span class="row-v">${esc(c.n)}<small>${esc(c.cert)}</small></span><span class="row-go">${ARR}</span></button></li>`).join('')}</ul>`;
}

/* ===== Šoninis panelis su ekranų steku ===== */
const Sheet=(function(){
  let root=null, stack=[], first=null;
  const X='<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 2l10 10M12 2 2 12"/></svg>';
  const BACK='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M10 6H2M5.5 2.5 2 6l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  function ensure(){
    if(root) return;
    root=document.createElement('div'); root.className='drawer'; root.id='sheet'; root.setAttribute('aria-hidden','true');
    root.innerHTML='<div class="scrim" data-sheet-close></div>';
    document.body.appendChild(root);
    root.addEventListener('click',e=>{
      if(e.target.closest('[data-sheet-close]')) close();
      else if(e.target.closest('[data-sheet-back]')) pop();
      else if(e.target.closest('[data-inquiry]')) close(false);
    });
  }
  function panel(view){
    const prev=stack[stack.length-1];
    const a=document.createElement('aside'); a.className='panel'; a.setAttribute('role','dialog'); a.setAttribute('aria-modal','true'); a.setAttribute('aria-label',view.title);
    a.innerHTML=`<div class="panel-head">${prev?`<button class="back" type="button" data-sheet-back>${BACK}<span>${esc(prev.view.title)}</span></button>`:`<span class="eyebrow">${esc(view.kicker)}</span>`}<button class="x" type="button" data-sheet-close aria-label="Uždaryti">${X}</button></div>
      <div class="panel-body">${view.body}</div>${view.foot?`<div class="panel-foot">${view.foot}</div>`:''}`;
    return a;
  }
  function push(view,trigger){
    ensure();
    const top=stack[stack.length-1];
    const el=panel(view); root.appendChild(el); void el.offsetWidth; el.classList.add('in');
    if(top) top.el.classList.add('under');
    stack.push({view,el,trigger});
    setTimeout(()=>el.querySelector('.back, .x').focus({preventScroll:true}),80);
  }
  function show(view,trigger){
    ensure();
    if(!root.classList.contains('open')){
      first=trigger||document.activeElement; stack.forEach(s=>s.el.remove()); stack=[];
      root.classList.add('open'); root.setAttribute('aria-hidden','false');
      document.documentElement.style.overflow='hidden'; document.documentElement.classList.add('modal-open');
      push(view,trigger); return;
    }
    const idx=stack.findIndex(s=>s.view.key===view.key);
    if(idx>=0 && idx===stack.length-2) return pop();      /* tas pats ekranas kaip po apačia: tiesiog grįžtam */
    if(idx===stack.length-1) return;
    push(view,trigger);
  }
  function pop(){
    if(stack.length<2) return close();
    const top=stack.pop(), under=stack[stack.length-1];
    top.el.classList.remove('in'); under.el.classList.remove('under');
    setTimeout(()=>top.el.remove(),500);
    const t=top.trigger; (t && under.el.contains(t) ? t : under.el.querySelector('.back, .x')).focus({preventScroll:true});
  }
  function close(restore=true){
    if(!root || !root.classList.contains('open')) return;
    root.classList.remove('open'); root.setAttribute('aria-hidden','true');
    stack.forEach(s=>s.el.classList.remove('in'));
    const old=stack; stack=[]; setTimeout(()=>old.forEach(s=>s.el.remove()),500);
    document.documentElement.style.overflow=''; document.documentElement.classList.remove('modal-open');
    if(restore && first && document.contains(first)) first.focus({preventScroll:true});
  }
  addEventListener('keydown',e=>{ if(e.key==='Escape' && root && root.classList.contains('open')){ e.stopPropagation(); pop(); } });
  return {show,pop,close,isOpen:()=>!!root&&root.classList.contains('open')};
})();

function coachView(i){
  const c=COACHES[i];
  return {key:'c'+i, kicker:'Treneriai', title:c.n,
    body:`<div class="cd-top"><span class="cd-ini${c.img?' has-img':''}" aria-hidden="true">${c.img?`<img src="${esc(c.img)}" alt="">`:esc(ini(c))}</span><div><h2>${esc(c.n)}</h2><p class="c-meta">${role(c)}<span>${esc(c.cert)}${c.lang?' · '+esc(c.lang):''}</span></p></div></div>
      <p class="p-label">Treniruoja</p>${whereRows(c)}
      <div class="prose cd-text">${c.full.map(t=>`<p>${esc(t)}</p>`).join('')}</div>
      ${c.soon?'':'<a class="link" href="https://squash.lt/treneriai/" target="_blank" rel="noopener">Šaltinis: squash.lt/treneriai<svg width="11" height="11" aria-hidden="true"><use href="#ext"/></svg></a>'}`,
    foot:callBtn(c,'btn btn-accent send')};
}
function venueView(i){
  const v=VENUES[i], tel=v.tel.replace(/\s/g,'');
  return {key:'v'+i, kicker:'Klubas', title:`${v.city} · ${v.place}`,
    body:`<h2 class="vd-city">${esc(v.city)}</h2><p class="vd-place">${esc(v.place)}</p>
      <dl class="vd-dl"><div><dt>Adresas</dt><dd>${esc(v.addr)}</dd></div><div><dt>Telefonas</dt><dd><a href="tel:${tel}">${esc(v.tel)}</a></dd></div></dl>
      <p class="p-label">Treneriai šiame klube</p>${coachRows(i)}
      <div class="actions" style="margin-top:8px"><a class="btn btn-line" href="https://maps.google.com/?q=${encodeURIComponent(v.addr)}" target="_blank" rel="noopener">Kaip nuvykti</a></div>`,
    foot:`<a class="btn btn-accent send" href="tel:${tel}">Skambinti klubui</a>`};
}
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-coach]'); if(c){ e.preventDefault(); Sheet.show(coachView(+c.dataset.coach),c); return; }
  const v=e.target.closest('[data-venue]'); if(v){ e.preventDefault(); Sheet.show(venueView(+v.dataset.venue),v); }
});

/* ===== Blokai ===== */
const MAP_D='M9.1 48.0 L34.2 25.0 L62.8 13.0 L97.0 17.0 L131.3 18.0 L165.5 18.0 L205.5 28.0 L234.0 38.0 L268.2 40.0 L293.9 60.0 L325.3 87.0 L339.0 125.0 L316.7 140.0 L302.5 157.0 L279.6 168.0 L273.9 200.0 L262.5 225.0 L239.7 240.0 L222.6 255.0 L199.7 260.0 L174.1 263.0 L148.4 255.0 L142.7 235.0 L108.4 218.0 L105.6 185.0 L97.0 170.0 L74.2 150.0 L39.9 135.0 L21.1 128.0 L17.1 105.0 L13.1 83.0 L9.1 48.0 Z';
const BLOCKS={
  /* Kur žaisti: žemėlapis ir klubų eilutės; paspaudus atsidaro klubo panelis */
  venues(el){
    el.innerHTML=`<div class="venues">
      <div class="v-visual">
        <span class="eyebrow">Kur žaisti</span>
        <div class="num" aria-hidden="true">${String(VENUES.length).padStart(2,'0')}<small>miestai</small></div>
        <p>Skvošo kortai nuo Klaipėdos iki Druskininkų. Pasirink klubą, paskambink ir rezervuok laiką.</p>
        <div class="map"><svg viewBox="-4 0 352 272" role="img" aria-label="Skvošo klubai Lietuvos žemėlapyje">
          <defs><pattern id="mapDots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.15" fill="currentColor"/></pattern></defs>
          <path class="map-land" d="${MAP_D}" fill="url(#mapDots)"/><path class="map-edge" d="${MAP_D}" fill="none"/>
          <g class="pins">${VENUES.map((v,i)=>{ const left=v.x>230, up=v.slug==='garliava';
            return `<g class="pin" data-pin="${i}" transform="translate(${v.x} ${v.y})"><circle class="hit" r="12"/><circle class="ring" r="6"/><circle class="dot" r="3.5"/><text x="${left?-10:10}" y="${up?14:-8}" text-anchor="${left?'end':'start'}">${esc(v.city)}</text></g>`; }).join('')}</g>
        </svg><span class="map-cap">${VENUES.length} miestai · 19 kortų</span></div>
      </div>
      <ul class="vlist">${VENUES.map((v,i)=>{ const n=coachesAt(i).length;
        return `<li><button type="button" class="vrow" data-venue="${i}" id="${v.slug}"><h3>${esc(v.city)}</h3><span class="vrow-p">${esc(v.place)}</span><span class="vrow-n">${n?`${n} ${n===1?'treneris':'treneriai'}`:'—'}</span><span class="row-go">${ARR}</span></button></li>`; }).join('')}</ul>
    </div>`;
    const pins=el.querySelector('.pins'), cap=el.querySelector('.map-cap');
    const mark=i=>{ pins.querySelectorAll('.pin').forEach(p=>p.classList.toggle('on',+p.dataset.pin===i)); if(i>=0){ pins.appendChild(pins.querySelector(`[data-pin="${i}"]`)); cap.textContent=`${VENUES[i].city} · ${VENUES[i].place}`; } else cap.textContent=`${VENUES.length} miestai · 19 kortų`; };
    el.querySelectorAll('.vrow').forEach(b=>{ b.addEventListener('mouseenter',()=>mark(+b.dataset.venue)); b.addEventListener('focus',()=>mark(+b.dataset.venue)); });
    el.querySelector('.vlist').addEventListener('mouseleave',()=>mark(-1));
    pins.addEventListener('click',e=>{ const p=e.target.closest('.pin'); if(p) Sheet.show(venueView(+p.dataset.pin),el.querySelector(`.vrow[data-venue="${p.dataset.pin}"]`)); });
    /* kur-zaisti.html#kaunas: atidaro klubą iškart */
    const h=decodeURIComponent(location.hash.slice(1)), i=VENUES.findIndex(v=>v.slug===h);
    if(i>=0 && el.dataset.hash!==undefined){ mark(i); setTimeout(()=>Sheet.show(venueView(i),el.querySelector(`#${h}`)),300); }
  },

  /* Treneriai: dideli vardai ir aktyvaus trenerio kortelė. data-filter: miestų filtras */
  coaches(el){
    const cities=[...new Set(COACHES.flatMap(c=>c.at.filter(a=>typeof a==='number').map(a=>VENUES[a].city)))];
    const filter=el.dataset.filter!==undefined, inCity=c=>COACHES.filter(x=>x.at.some(a=>typeof a==='number'&&VENUES[a].city===c)).length;
    el.innerHTML=`<div class="coaches">
        <div class="c-top">${filter
          ? `<div class="c-filter" role="group" aria-label="Miestas"><button type="button" data-city="" aria-pressed="true">Visi<small>${COACHES.length}</small></button>${cities.map(c=>`<button type="button" data-city="${esc(c)}" aria-pressed="false">${esc(c)}<small>${inCity(c)}</small></button>`).join('')}</div>`
          : '<span class="eyebrow">Treneriai</span>'}</div>
        <ul class="c-list" role="tablist" aria-label="Treneriai"></ul>
        <div class="c-card" role="tabpanel" aria-live="polite"></div>
      </div>`;
    const list=el.querySelector('.c-list'), card=el.querySelector('.c-card');
    let shown=COACHES.map((c,i)=>i), cur=-1;
    function draw(){
      list.innerHTML=shown.map(i=>`<li><button class="c-name" type="button" role="tab" data-i="${i}" aria-selected="false">${esc(COACHES[i].n)}</button></li>`).join('');
      cur=-1; pick(shown[0]);
    }
    function pick(i){
      if(i===cur || i===undefined) return; cur=i; const c=COACHES[i];
      list.querySelectorAll('.c-name').forEach(b=>b.setAttribute('aria-selected',String(+b.dataset.i===i)));
      const loc=c.at.length ? (p=>`${p.city} · ${p.place}`)(placeOf(c.at[0])) : (c.from||'');
      /* Info ant nuotraukos: vieta viršuje, pareigos ir aprašas apačioje ant tamsaus gradiento. c.img, kai bus tikra nuotrauka */
      card.innerHTML=`<div class="c-frame"><i></i><i></i><i></i><i></i><div class="c-tile${c.img?' has-img':''}">${c.img?`<img src="${esc(c.img)}" alt="">`:''}<span class="ini" aria-hidden="true">${esc(ini(c))}</span><span class="loc">${esc(loc)}</span>
          <div class="c-ov"><p class="c-meta">${role(c)}<span>${esc(c.cert)}${c.lang?' · '+esc(c.lang):''}</span></p><p class="c-bio">${esc(c.bio)}</p></div></div></div>
        <div class="c-where"><p class="p-label">Treniruoja</p>${whereRows(c)}</div>
        <div class="c-acts"><button class="btn btn-accent" type="button" data-coach="${i}">Skaityti daugiau<span class="arr">${ARR}</span></button>${callBtn(c)}</div>`;
      card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
    }
    list.addEventListener('click',e=>{ const b=e.target.closest('.c-name'); if(b) pick(+b.dataset.i); });
    if(matchMedia('(hover:hover)').matches) list.addEventListener('mouseover',e=>{ const b=e.target.closest('.c-name'); if(b) pick(+b.dataset.i); });
    list.addEventListener('keydown',e=>{
      if(!['ArrowDown','ArrowUp'].includes(e.key)) return; e.preventDefault();
      const k=(shown.indexOf(cur)+(e.key==='ArrowDown'?1:-1)+shown.length)%shown.length; pick(shown[k]); list.querySelector(`[data-i="${shown[k]}"]`).focus();
    });
    el.addEventListener('click',e=>{
      const f=e.target.closest('[data-city]'); if(!f) return;
      el.querySelectorAll('[data-city]').forEach(x=>x.setAttribute('aria-pressed',String(x===f)));
      const city=f.dataset.city;
      shown=COACHES.map((c,i)=>i).filter(i=>!city || COACHES[i].at.some(a=>typeof a==='number' && VENUES[a].city===city));
      draw();
    });
    draw();
  },

  /* Varžybos: data-limit; data-group sugrupuoja pagal mėnesius */
  events(el){
    const lim=+el.dataset.limit||0, list=upcoming().slice(0,lim||undefined);
    const row=e=>{ const [y,m,d]=e.d.split('-'), v=e.v!=null?VENUES[e.v]:null;
      const span=e.end?`${+d}–${+e.end.slice(8)} ${MON[+e.end.slice(5,7)-1].toLowerCase()}.`:'';
      const where=v?`<button type="button" class="ev-place" data-venue="${e.v}">${esc(v.city)}</button>`:'<span class="ev-place-off">Lietuva</span>';
      return `<li class="ev"><time datetime="${e.d}"><b>${d}</b>${MON[+m-1]}</time><div><h4>${esc(e.t)}</h4><p>${where}${span?` · ${span}`:''}</p></div><a class="go" href="kalendorius.html" aria-label="Kalendoriuje: ${esc(e.t)}">${ARR}</a></li>`; };
    if(el.dataset.group===undefined){ el.innerHTML=`<ul class="ev-list">${list.map(row).join('')}</ul>`; return; }
    const groups={}; list.forEach(e=>{ const k=e.d.slice(0,7); (groups[k]=groups[k]||[]).push(e); });
    el.innerHTML=Object.entries(groups).map(([k,es])=>{ const [y,m]=k.split('-'); return `<section class="ev-month"><h3>${MON_FULL[+m-1]} <span>${y}</span></h3><ul class="ev-list">${es.map(row).join('')}</ul></section>`; }).join('');
  },

  /* Reitingo ištrauka: tikras top 5 iš rankedin */
  rank(el){
    el.innerHTML=`<div class="card-head"><h3>Reitingas</h3><div class="tabs" role="tablist" aria-label="Reitingo grupė"><button role="tab" type="button" aria-selected="true" data-g="1">Vyrai</button><button role="tab" type="button" aria-selected="false" data-g="2">Moterys</button></div></div>
      <ol class="rank" aria-live="polite"></ol>
      <div class="card-foot"><a class="link" href="reitingas.html">Visas reitingas<svg width="11" height="11" aria-hidden="true"><use href="#arr"/></svg></a><span class="demo rk-week">rankedin.com</span></div>`;
    const ol=el.querySelector('.rank'), wk=el.querySelector('.rk-week');
    async function draw(g){
      ol.innerHTML='<li class="rk-load">Kraunama…</li>';
      try{
        const d=await rkFetch({gender:g,take:5});
        ol.innerHTML=d.Payload.map((p,i)=>`<li><span class="pos" title="Bendra vieta ${p.ParticipantPoints.Standing}">${String(i+1).padStart(2,'0')}</span><span class="nm">${esc(p.Name)}<small>${esc(clubShort(p.HomeClubName))}</small></span><span class="pts">${Math.round(p.ParticipantPoints.Points).toLocaleString('lt-LT')}</span></li>`).join('');
        if(d.Payload[0]) wk.textContent=`rankedin · ${d.Payload[0].ParticipantPoints.Week} sav.`;
      }catch(_){ ol.innerHTML='<li class="rk-load">Nepavyko įkelti reitingo. <a href="reitingas.html">Atidaryti</a></li>'; }
      ol.classList.remove('swap'); void ol.offsetWidth; ol.classList.add('swap');
    }
    el.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{ el.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',String(x===b))); draw(+b.dataset.g); }));
    draw(1);
  },

  /* Pilnas reitingas iš rankedin: lytis, grupė (filtruojama pagal žaidėjo grupę), po 25 */
  'rank-full'(el){
    const PER=25, cache={}; let g=1, grp='', shown=PER;
    el.innerHTML=`<div class="rkf-bar">
        <div class="tabs" role="tablist" aria-label="Lytis"><button role="tab" type="button" aria-selected="true" data-g="1">Vyrai</button><button role="tab" type="button" aria-selected="false" data-g="2">Moterys</button></div>
        <div class="sel rkf-sel"><label class="sr" for="rkAge">Amžiaus grupė</label><select class="f" id="rkAge"><option value="">Visos grupės</option></select><svg aria-hidden="true"><use href="#chev"/></svg></div>
        <span class="rkf-meta" aria-live="polite"></span>
      </div>
      <div class="rkf-head" aria-hidden="true"><span>Vieta</span><span>Žaidėjas</span><span>Klubas</span><span>Grupė</span><span>Taškai</span></div>
      <ol class="rkf" aria-label="Reitingas"></ol>
      <div class="more-wrap" style="margin-top:24px"><button class="btn btn-line" type="button" hidden>Rodyti daugiau</button></div>`;
    const ol=el.querySelector('.rkf'), more=el.querySelector('.more-wrap .btn'), meta=el.querySelector('.rkf-meta'), sel=el.querySelector('#rkAge');
    const AGE_LT=t=>(t||'').replace('Men-Main','Vyrai').replace('Women-Main','Moterys').replace('Boys Under ','Vaikinai iki ').replace('Girls Under ','Merginos iki ').replace('Men Over ','Vyrai virš ').replace('Women Over ','Moterys virš ');
    const ORDER=t=>{ const n=+(t.match(/\d+/)||[0])[0]; return /Under/.test(t)?n:/Main/.test(t)?100:200+n; };
    const diff=n=> n>0 ? `<span class="up" title="Pakilo ${n}">▲ ${n}</span>` : n<0 ? `<span class="down" title="Nukrito ${-n}">▼ ${-n}</span>` : '<span class="same">–</span>';
    async function data(){
      if(!cache[g]) cache[g]=rkFetch({gender:g,take:300});
      return cache[g];
    }
    async function render(){
      ol.innerHTML='<li class="rk-load">Kraunama…</li>'; more.hidden=true;
      try{
        const d=await data(), all=d.Payload;
        const groups=[...new Set(all.map(p=>p.PlayerAgeGroup).filter(Boolean))].sort((a,b)=>ORDER(a)-ORDER(b));
        sel.innerHTML='<option value="">Visos grupės</option>'+groups.map(t=>`<option value="${esc(t)}">${esc(AGE_LT(t))}</option>`).join(''); sel.value=grp;
        const list=all.filter(p=>!grp || p.PlayerAgeGroup===grp);
        ol.innerHTML=list.slice(0,shown).map((p,i)=>{ const pp=p.ParticipantPoints;
          return `<li><span class="rkf-pos" title="Bendra vieta ${pp.Standing}">${i+1}</span><span class="rkf-diff">${diff(p.StandingDiff)}</span><a class="rkf-name" href="${RANKING.web}${esc(p.ParticipantUrl)}" target="_blank" rel="noopener">${esc(p.Name)}</a><span class="rkf-club">${esc(clubShort(p.HomeClubName))}</span><span class="rkf-age">${esc(AGE_LT(p.PlayerAgeGroup))}</span><span class="rkf-pts">${Math.round(pp.Points).toLocaleString('lt-LT')}</span></li>`; }).join('') || '<li class="rk-load">Šioje grupėje žaidėjų nėra.</li>';
        const w=all[0]?.ParticipantPoints; meta.textContent=`${list.length} ${g===1?'vyr.':'mot.'}${w?` · ${w.Year} m. ${w.Week} sav.`:''}`;
        more.hidden=list.length<=shown;
      }catch(_){ delete cache[g]; ol.innerHTML=`<li class="rk-load">Nepavyko įkelti reitingo. <a href="${RANKING.web}/en/promote/3949ab/ranking/index/${RANKING.id}" target="_blank" rel="noopener">Atidaryti rankedin.com</a></li>`; }
    }
    el.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{ if(+b.dataset.g===g) return; el.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',String(x===b))); g=+b.dataset.g; grp=''; shown=PER; render(); }));
    sel.addEventListener('change',()=>{ grp=sel.value; shown=PER; render(); });
    more.addEventListener('click',()=>{ shown+=PER; render(); });
    render();
  },

  /* Naujausios naujienos iš data/naujienos.json */
  async news(el){
    const lim=+el.dataset.limit||3, IMG=['img/foto-6516.jpg','img/foto-7700.jpg','img/foto-5279.jpg'];
    let all=[]; try{ all=await (await fetch('data/naujienos.json')).json(); }catch(_){ return; }
    all.sort((a,b)=>b.date.localeCompare(a.date));
    el.innerHTML=`<div class="news">${all.slice(0,lim).map((n,k)=>`<a class="post" href="straipsnis.html?id=${n.id}"><div class="ph"><img src="${esc(n.img||IMG[k%IMG.length])}" alt="" loading="lazy"></div><div><time>${n.date}</time><h3>${esc(n.title)}</h3></div></a>`).join('')}</div>`;
  },

  /* Hero kortelė: artimiausios varžybos */
  'hero-event'(el){
    const e=upcoming()[0], v=e.v!=null?VENUES[e.v]:null, [y,m,d]=e.d.split('-');
    const days=Math.ceil((new Date(e.d+'T10:00:00+02:00')-Date.now())/86400000);
    const span=e.end?`${+d}–${+e.end.slice(8)} ${MON[+e.end.slice(5,7)-1].toLowerCase()}.`:`${+d} ${MON[+m-1].toLowerCase()}.`;
    el.querySelector('.nc-date').innerHTML=`<b>${d}</b>${MON[+m-1]}`; el.querySelector('.nc-date').setAttribute('datetime',e.d);
    const when= days>1 ? `po ${days} d.` : days===1 ? 'rytoj' : days===0 ? 'šiandien' : 'vyksta';
    el.querySelector('.nc-txt').innerHTML=`<strong>${esc(e.t)}</strong><span>${span} · ${when}</span>`;
  },

  /* SKVOŠAS: O raidė slenkant atsiveria į kapsulę su nuotrauka, kitos raidės pasitraukia į šonus */
  'word-open'(el){
    const word=el.querySelector('.wo-word'), o=el.querySelector('.wo-o'), sticky=el.querySelector('.wo-sticky');
    const letters=[...word.children].filter(x=>x!==o);
    let fs=0, ow=0, oh=0, maxW=0, maxH=0, queued=false;
    const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    function measure(){
      o.style.setProperty('--w',''); o.style.setProperty('--h','');
      fs=parseFloat(getComputedStyle(word).fontSize); ow=.74*fs; oh=.74*fs;
      const lw=letters.reduce((s,x)=>s+x.getBoundingClientRect().width,0);
      const narrow=innerWidth<760;
      maxW=Math.max(ow,Math.min(sticky.clientWidth*.9-lw, fs*5.2));
      maxH=Math.min(innerHeight*.62, fs*(narrow?2.6:1.5));
      paint();
    }
    function paint(){
      queued=false;
      let e=1;
      if(!reduceMotion){ const r=el.getBoundingClientRect(), span=Math.max(1,r.height-innerHeight); e=ease(Math.min(1,Math.max(0,(-r.top)/span/.7))); }
      o.style.setProperty('--w',(ow+(maxW-ow)*e)+'px');
      o.style.setProperty('--h',(oh+(maxH-oh)*e)+'px');
      o.style.setProperty('--b',(.085*(1-Math.min(1,e*2.2)))+'em');
      o.style.setProperty('--io',Math.min(1,e*2.4));
      o.style.setProperty('--is',1.3-.3*e);
      el.style.setProperty('--cap',Math.min(1,Math.max(0,(e-.6)/.4)));
    }
    addEventListener('scroll',()=>{ if(!queued){ queued=true; requestAnimationFrame(paint); } },{passive:true});
    addEventListener('resize',measure);
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(measure);
    measure();
  },

};
document.querySelectorAll('[data-block]').forEach(el=>{ const f=BLOCKS[el.dataset.block]; if(f) f(el); });
