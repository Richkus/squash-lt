/* Kur žaisti: tikri duomenys iš squash.lt/kur-zaisti */
const VENUES=[
  {city:'Vilnius',x:250,y:186,place:'SEB arena',addr:'Ąžuolyno g. 7, Vilnius',tel:'+370 5 236 2205'},
  {city:'Kaunas',x:171.2,y:165,place:'Padel HUB',addr:'B. Brazdžionio g. 25, Kaunas',tel:'+370 633 86336'},
  {city:'Klaipėda',x:13.1,y:84,place:'Skvošo zona',addr:'Svajonės g. 31a, Klaipėda',tel:'+370 685 61677'},
  {city:'Šiauliai',x:138.1,y:62,place:'Uniqa arena',addr:'Išradėjų g. 14, Šiauliai',tel:'+370 636 91111'},
  {city:'Garliava',x:169.5,y:173,place:'Pagrokim skvošą',addr:'J. Šimkaus g. 20, Garliava',tel:'+370 631 26884'},
  {city:'Druskininkai',x:175.2,y:253,place:'Grand Spa',addr:'V. Kudirkos g. 45, Druskininkai',tel:'+370 313 51200'},
  {city:'Tauragė',x:79.3,y:130,place:'Bendruomenių namai',addr:'Vytauto g. 141, Tauragė',tel:'+370 678 47991'}
];
/* Treneriai: duomenys iš squash.lt/treneriai. at: kuriuose klubuose dirba (VENUES indeksas arba laisvas tekstas) */
const COACHES=[
  {n:'Mantas Kočiūnas',at:[0],cert:'ESF 3 lygis',lang:'LT, EN',
   bio:'Buvęs daugkartinis Lietuvos čempionas ir rinktinės kapitonas. Dirba su visais: nuo pirmą kartą raketę paimančių iki profesionalų.',
   full:['Ilgametę patirtį turintis skvošo treneris, buvęs daugkartinis Lietuvos skvošo čempionas ir Lietuvos rinktinės kapitonas. Treniruotes veda Vilniuje, SEB arenoje, lietuvių ir anglų kalbomis.','Mantas dirba su įvairaus lygio žaidėjais: nuo pradedančiųjų, pirmą kartą paimančių raketę į rankas, iki pažengusių ir profesionalių sportininkų. Treniruotėse daug dėmesio skiria technikai, taktikai, psichologiniams žaidimo aspektams ir individualiems žaidėjo poreikiams.','Jo treniruočių principas: saugus, kokybiškas ir tikslingas augimas. Mantas turi aukščiausią ESF 3 lygio trenerio sertifikatą.']},
  {n:'Ilja Koryšev',at:[{city:'Vilnius',place:'klubas tikslinamas'}],cert:'WSF 1 ir 2 lygis',lang:'EN, RU',
   bio:'Daugiau nei 10 metų žaidimo ir trenerio patirtis. Veda individualias ir grupines treniruotes vaikams ir suaugusiems.',
   full:['Sertifikuotas skvošo treneris, dirbantis Lietuvoje, turintis daugiau nei 10 metų žaidimo ir treniravimo patirtį. Jis yra įgijęs WSF Level 1 ir Level 2 trenerio kvalifikacijas ir aktyviai dirba su įvairaus amžiaus ir lygio žaidėjais: nuo pradedančiųjų iki pažengusių sportininkų.','Ilja specializuojasi individualiose ir grupinėse treniruotėse suaugusiesiems bei vaikams, didelį dėmesį skiria technikos pagrindams, žaidimo supratimui, judėjimui aikštelėje ir ilgalaikiam žaidėjų progresui.','Treneris veda treniruotes anglų ir rusų kalbomis, taip pat aktyviai mokosi lietuvių kalbos. Ilja prisideda prie skvošo vystymo Lietuvoje, skatindamas reguliarų, saugų ir motyvuojantį treniruočių procesą.']},
  {n:'Andrėjus Kolčėvnikovas',at:[0],cert:'ESF 1 · WSF 2 lygis',lang:'LT, EN, RU',
   bio:'Treniruoja nuo 2012 m. Tiki, kad skvoše laimi ne tik kojos, bet ir galva: gebėjimas mąstyti ir valdyti žaidimą.',
   full:['Patyręs skvošo treneris, treniruotes vedantis Vilniuje, SEB arenoje. Treneriu dirba nuo 2012 metų ir turi plačią patirtį su įvairaus lygio žaidėjais: nuo pradedančiųjų iki čempionų. Andrėjus treniruoja vaikus, jaunimą, mėgėjus, pažengusius ir varžyboms besiruošiančius žaidėjus, veda individualias ir grupines treniruotes anglų, rusų ir lietuvių kalbomis.','Jo treniravimo filosofija paremta motyvacija, sąžiningu darbu ir žaidimo supratimu. Andrėjus tiki, kad skvošas yra sportas, kuriame laimi ne tik fizinis pasirengimas, bet ir galva: gebėjimas mąstyti, priimti sprendimus ir valdyti žaidimą. Treniruotėse jis vertina ambicingus tikslus, norą dirbti ir pagarbą sąžiningam žaidimui.','Andrėjus turi ESF I lygio trenerio sertifikatą, WSF II lygio kvalifikaciją ir yra dalyvavęs Hadrian Stiff trenerių kursuose.']},
  {n:'Laurynas Minkus',at:[1],cert:'WSF 1 lygis',lang:'LT, EN',
   bio:'10 metų treniravimo patirtis. Pagrindinė kryptis yra vaikų ir jaunimo ugdymas, taisyklinga technika ir judėjimas korte.',
   full:['Charizmatiškas ir energingas skvošo treneris, turintis 10 metų treniravimo patirtį. Treniruotes veda Kaune, Padel Hub sporto komplekse, lietuvių ir anglų kalbomis. Laurynas dirba su vaikais, jaunimu ir suaugusiaisiais.','Pagrindinė jo darbo kryptis: vaikų ir jaunimo ugdymas, taisyklingos technikos formavimas, judėjimas korte, žaidimo supratimas, fizinis pasirengimas ir nuoseklus progresas. Treniruotėse Laurynui svarbi aiški struktūra, individualus dėmesys, motyvuojanti atmosfera ir žaidėjo pasitikėjimas savimi.','Laurynas yra baigęs WSF Level 1 trenerių kursus.']},
  {n:'Linas Zdanavičius',at:[1,4,{city:'Kaunas',place:'VS Fitness'}],cert:'WSF 1 lygis',lang:'EN, RU',
   bio:'10+ metų patirtis. Nestandartinio stiliaus žaidėjas, todėl moko praktinių sprendimų, kaip geriau suprasti varžovą.',
   full:['10+ metų skvošo patirties turintis treneris, dirbantis Kaune, Padel Hub, Garliavos skvošo klube ir VS Fitness. Linas treniruoja vaikus, jaunimą ir suaugusiuosius: nuo pradedančiųjų iki mėgėjų, pažengusių bei B, C ir D lygio žaidėjų. Veda individualias ir grupines treniruotes anglų bei rusų kalbomis.','Treniruotėse daug dėmesio skiria technikos tobulinimui, fizinės ištvermės ugdymui, taktiniam mąstymui ir individualiems žaidėjo tikslams. Pats būdamas nestandartinio žaidimo stiliaus žaidėjas, Linas gali perteikti įvairius praktinius sprendimus, padedančius geriau suprasti varžovą ir efektyviau žaisti aikštelėje.','Linas yra baigęs WSF 1 lygio trenerių kursus ir 2 lygio teisėjų kursus.']},
  {n:'Linas Pilipavičius',at:[0],cert:'England Squash 1 lygis',lang:'LT, EN',
   bio:'Aiškūs pagrindai, nuoseklus progresas ir pasitikėjimas savimi korte. Treniruoja vaikus ir suaugusius.',
   full:['Patyręs skvošo treneris, vedantis treniruotes Vilniuje, SEB arenoje. Jis dirba su vaikais ir suaugusiaisiais, pradedančiaisiais bei pažengusiais žaidėjais, kviesdamas treniruotis visus: nuo pirmųjų žingsnių skvošo aikštelėje iki aukštesnio žaidimo lygio siekiančių sportininkų.','Treniruotes veda individualiai arba grupėse, lietuvių ir anglų kalbomis. Linas yra įgijęs Anglijos skvošo asociacijos pirmo lygio trenerio sertifikatą.','Jo treniruotėse svarbu aiškus pagrindų formavimas, nuoseklus progresas ir žaidėjo pasitikėjimas savimi aikštelėje.']},
  {n:'Andrius Stančaitis',at:[2],cert:'ESF 1 lygis',lang:'LT, EN, RU',
   bio:'Patirtį kaupė Velse. Moko atsižvelgdamas į žmogaus judėjimą, tikslus ir galimybes, ne vien į sporto šaką.',
   full:['Patyręs skvošo treneris, šiuo metu dirbantis Klaipėdoje, „Skvošo zonoje“, patirtį ne vienus metus kaupęs Velse, Jungtinėje Karalystėje.','Andriaus treniravimo filosofija paremta individualiu požiūriu į žaidėją. Jo įsitikinimu, skvošo reikia mokyti atsižvelgiant į žmogaus judėjimą, tikslus ir galimybes, o ne vien į pačią sporto šaką. Toks požiūris leidžia skvošą atrasti įvairaus amžiaus ir pasirengimo žmonėms: nuo pirmą kartą raketę paimančių pradedančiųjų iki pažengusių žaidėjų.','Treniruotėse Andrius daug dėmesio skiria technikai, judėjimo kokybei ir natūraliai žaidimo plastikai. Jis turi ESF Level 1 trenerio sertifikatą ir yra išklausęs ESF Level 2 mokymus. Treniruotės vyksta lietuvių, anglų ir rusų kalbomis.']},
  {n:'Marina Zaremba',at:[0],from:'Argentina',cert:'Profesionali žaidėja · Argentina',lang:'',soon:true,
   bio:'Profesionali skvošo žaidėja ir trenerė iš Argentinos. Treniruoja Vilniuje, SEB arenoje.',
   full:['Profesionali skvošo žaidėja ir trenerė iš Argentinos. Treniruotes veda Vilniuje, SEB arenoje.','Daugiau informacijos apie Mariną ir jos treniruotes paskelbsime netrukus.']}
];
const placeOf=a=>typeof a==='number' ? `${VENUES[a].city} · ${VENUES[a].place}` : `${a.city} · ${a.place}`;
const coachesAt=i=>COACHES.map((c,j)=>[c,j]).filter(([c])=>c.at.includes(i));
const tagsOf=c=>c.at.length
  ? c.at.map(a=>typeof a==='number' ? `<button class="tag" type="button" data-venue="${a}">${esc(placeOf(a))}</button>` : `<span class="tag tag-off">${esc(placeOf(a))}</span>`).join('')
  : `<span class="tag tag-off">${esc(c.from||'')} · klubas netrukus</span>`;

const acc=document.getElementById('acc');
acc.innerHTML=VENUES.map((v,i)=>`
  <li class="${i===0?'open':''}">
    <button class="acc-btn" type="button" id="ab${i}" aria-expanded="${i===0}" aria-controls="ap${i}">
      <h3>${esc(v.city)}</h3><span class="count">${esc(v.place)}</span><span class="plus">${plusSvg}</span>
    </button>
    <div class="acc-body" id="ap${i}" role="region" aria-labelledby="ab${i}"><div>
      <dl><div><dt>Klubas</dt><dd>${esc(v.place)}</dd></div><div><dt>Adresas</dt><dd>${esc(v.addr)}</dd></div><div><dt>Telefonas</dt><dd>${esc(v.tel)}</dd></div>
        <div><dt>Treneriai</dt><dd>${coachesAt(i).length ? coachesAt(i).map(([c,j])=>`<button class="c-link" type="button" data-coach="${j}">${esc(c.n)}</button>`).join('') : '<span class="muted">Informacijos dar nėra</span>'}</dd></div></dl>
      <div class="actions">
        <a class="btn btn-line" href="tel:${v.tel.replace(/\s/g,'')}">Skambinti</a>
        <a class="btn btn-line" href="https://maps.google.com/?q=${encodeURIComponent(v.addr)}" target="_blank" rel="noopener">Kaip nuvykti</a>
      </div>
    </div></div>
  </li>`).join('');
/* Žemėlapio taškai: label kairėje, jei miestas prie dešinio krašto */
const pins=document.getElementById('pins'), mapCap=document.getElementById('mapCap');
pins.innerHTML=VENUES.map((v,i)=>{ const left=v.x>230, up=v.city==='Garliava';
  return `<g class="pin" data-i="${i}" transform="translate(${v.x} ${v.y})" tabindex="0" role="button" aria-label="${esc(v.city)}, ${esc(v.place)}">
    <circle class="hit" r="12"/><circle class="ring" r="6"/><circle class="dot" r="3.5"/>
    <text x="${left?-10:10}" y="${up?14:-8}" text-anchor="${left?'end':'start'}">${esc(v.city)}</text></g>`; }).join('');
function setPin(i){
  pins.querySelectorAll('.pin').forEach(p=>p.classList.toggle('on',+p.dataset.i===i));
  if(i>=0){ const on=pins.querySelector(`[data-i="${i}"]`); pins.appendChild(on); mapCap.textContent=`${VENUES[i].city} · ${VENUES[i].place}`; }
  else mapCap.textContent='7 miestai · 19 kortų';
}
function openVenue(i,toggle){
  [...acc.children].forEach((x,j)=>{ const on=j===i ? (toggle ? !x.classList.contains('open') : true) : false; x.classList.toggle('open',on); x.querySelector('.acc-btn').setAttribute('aria-expanded',String(on)); });
  setPin(acc.children[i]?.classList.contains('open') ? i : -1);
}
acc.addEventListener('click',e=>{
  const b=e.target.closest('.acc-btn'); if(!b) return;
  openVenue([...acc.children].indexOf(b.parentElement),true);
});
pins.addEventListener('click',e=>{ const p=e.target.closest('.pin'); if(p) openVenue(+p.dataset.i,false); });
pins.addEventListener('keydown',e=>{ const p=e.target.closest('.pin'); if(p && (e.key==='Enter'||e.key===' ')){ e.preventDefault(); openVenue(+p.dataset.i,false); } });
setPin(0);

/* Reitingas: demo duomenys */
const RANK={
  v:[['A. Kazlauskas','Vilnius',1840],['M. Petrauskas','Kaunas',1765],['T. Jankauskas','Vilnius',1702],['D. Stankevičius','Klaipėda',1650],['L. Vasiliauskas','Kaunas',1598]],
  m:[['I. Kazlauskaitė','Vilnius',1620],['G. Petrauskienė','Kaunas',1588],['E. Butkutė','Vilnius',1510],['R. Paulauskaitė','Klaipėda',1462],['A. Urbonaitė','Kaunas',1401]]
};
const rank=document.getElementById('rank');
function drawRank(g){
  rank.innerHTML=RANK[g].map((p,i)=>`<li><span class="pos">${String(i+1).padStart(2,'0')}</span><span class="nm">${esc(p[0])}<small>${esc(p[1])}</small></span><span class="pts">${p[2].toLocaleString('lt-LT')}</span></li>`).join('');
  rank.classList.remove('swap'); void rank.offsetWidth; rank.classList.add('swap');
}
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.tabs button').forEach(x=>x.setAttribute('aria-selected',String(x===b)));
  drawRank(b.dataset.g);
}));
drawRank('v');

/* Hero kortelė: kiek liko iki artėjančių varžybų */
(function(){
  const card=document.querySelector('[data-event]'), out=document.getElementById('evIn'); if(!card) return;
  const days=Math.ceil((new Date(card.dataset.event)-Date.now())/86400000);
  out.textContent = days>1 ? `Po ${days} d.` : days===1 ? 'Rytoj' : days===0 ? 'Šiandien' : 'Įvyko';
})();

/* LA28: laikas iki atidarymo (2028-07-14, Los Andželas) */
const LA28=new Date('2028-07-14T19:00:00-07:00');
function tick(){
  let s=Math.max(0,(LA28-Date.now())/1000);
  const d=Math.floor(s/86400); s-=d*86400;
  const h=Math.floor(s/3600); s-=h*3600;
  const m=Math.floor(s/60);
  document.querySelectorAll('[data-days]').forEach(el=>el.textContent=d);
  document.getElementById('cdH').textContent=String(h).padStart(2,'0');
  document.getElementById('cdM').textContent=String(m).padStart(2,'0');
}
tick(); setInterval(tick,20000);



/* Trenerių sąrašas ir kortelė */
const cList=document.getElementById('cList'), cCard=document.getElementById('cCard');
cList.innerHTML=COACHES.map((c,i)=>`<li><button class="c-name" type="button" role="tab" id="ct${i}" data-i="${i}" aria-selected="${i===0}" aria-controls="cCard">${esc(c.n)}</button></li>`).join('');
const ini=c=>c.n.split(' ').map(w=>w[0]).join('');
let cCur=-1;
function showCoach(i){
  if(i===cCur) return; cCur=i; const c=COACHES[i];
  cList.querySelectorAll('.c-name').forEach(b=>b.setAttribute('aria-selected',String(+b.dataset.i===i)));
  cCard.setAttribute('aria-labelledby','ct'+i);
  cCard.innerHTML=`<div class="c-frame"><i></i><i></i><i></i><i></i><div class="c-tile"><span class="loc">${esc(c.at.length ? placeOf(c.at[0]) : c.from)}</span><span class="ini" aria-hidden="true">${esc(ini(c))}</span></div></div>
    <p class="c-meta">${c.soon?'Trenerė':'Treneris'}<span>${esc(c.cert)}${c.lang?' · '+esc(c.lang):''}</span></p>
    <div class="c-tags">${tagsOf(c)}</div>
    <p class="c-bio">${esc(c.bio)}</p>
    <div class="c-acts"><button class="btn btn-accent" type="button" data-coach="${i}">Skaityti daugiau<span class="arr"><svg aria-hidden="true"><use href="#arr"/></svg></span></button><button class="btn btn-line" type="button" data-inquiry="Noriu išbandyti skvošą">Treniruotė</button></div>`;
  cCard.classList.remove('swap'); void cCard.offsetWidth; cCard.classList.add('swap');
}
cList.addEventListener('click',e=>{ const b=e.target.closest('.c-name'); if(b) showCoach(+b.dataset.i); });
if(matchMedia('(hover:hover)').matches) cList.addEventListener('mouseover',e=>{ const b=e.target.closest('.c-name'); if(b) showCoach(+b.dataset.i); });
cList.addEventListener('keydown',e=>{
  if(!['ArrowDown','ArrowUp'].includes(e.key)) return; e.preventDefault();
  const n=(cCur+(e.key==='ArrowDown'?1:-1)+COACHES.length)%COACHES.length; showCoach(n); document.getElementById('ct'+n).focus();
});
showCoach(0);

/* Trenerio šoninis panelis (1 lygis) ir klubo panelis ant jo (2 lygis, su „Atgal“) */
const cd=document.getElementById('coachDrawer'), cdBody=document.getElementById('cdBody');
const vd=document.getElementById('venueDrawer'), vdBody=document.getElementById('vdBody'), vdBackLbl=document.getElementById('vdBackLbl'), vdCall=document.getElementById('vdCall');
let cdBack=null, cdCur=-1, vdFrom=null;
function openCoach(i){
  const c=COACHES[i]; if(!cd.classList.contains('open')) cdBack=document.activeElement; cdCur=i;
  cdBody.innerHTML=`<div class="cd-top"><span class="cd-ini" aria-hidden="true">${esc(ini(c))}</span><div><h2 id="cdName">${esc(c.n)}</h2><p class="c-meta">${c.soon?'Trenerė':'Treneris'}<span>${esc(c.cert)}${c.lang?' · '+esc(c.lang):''}</span></p></div></div>
    <p class="p-label">Kur treniruoja</p><div class="c-tags">${tagsOf(c)}</div>
    <div class="prose cd-text">${c.full.map(t=>`<p>${esc(t)}</p>`).join('')}</div>
    ${c.soon?'':'<a class="link" href="https://squash.lt/treneriai/" target="_blank" rel="noopener">Šaltinis: squash.lt/treneriai<svg width="11" height="11" aria-hidden="true"><use href="#ext"/></svg></a>'}`;
  cdBody.scrollTop=0;
  cd.classList.add('open'); cd.setAttribute('aria-hidden','false');
  document.documentElement.style.overflow='hidden'; document.documentElement.classList.add('modal-open');
  setTimeout(()=>cd.querySelector('.x').focus({preventScroll:true}),80);
}
function closeCoach(restore=true){
  closeVenuePanel(false);
  if(!cd.classList.contains('open')) return;
  cd.classList.remove('open'); cd.setAttribute('aria-hidden','true');
  document.documentElement.style.overflow=''; document.documentElement.classList.remove('modal-open');
  if(restore && cdBack) cdBack.focus({preventScroll:true});
}
function openVenuePanel(i,from){
  const v=VENUES[i], list=coachesAt(i); vdFrom=from||null;
  vdBackLbl.textContent=COACHES[cdCur]?.n || 'Atgal';
  vdBody.innerHTML=`<span class="eyebrow">Klubas</span>
    <h2 class="vd-city" id="vdName">${esc(v.city)}</h2><p class="vd-place">${esc(v.place)}</p>
    <dl class="vd-dl"><div><dt>Adresas</dt><dd>${esc(v.addr)}</dd></div><div><dt>Telefonas</dt><dd><a href="tel:${v.tel.replace(/\s/g,'')}">${esc(v.tel)}</a></dd></div></dl>
    <p class="p-label">Treneriai šiame klube</p>
    <div class="c-tags">${list.map(([c,j])=>`<button class="tag" type="button" data-coach-swap="${j}"${j===cdCur?' aria-current="true"':''}>${esc(c.n)}</button>`).join('')}</div>
    <div class="actions" style="margin-top:8px"><a class="btn btn-line" href="https://maps.google.com/?q=${encodeURIComponent(v.addr)}" target="_blank" rel="noopener">Kaip nuvykti</a><button class="btn btn-line" type="button" data-venue-map="${i}">Rodyti žemėlapyje</button></div>`;
  vdCall.href='tel:'+v.tel.replace(/\s/g,'');
  vdBody.scrollTop=0;
  vd.classList.add('open'); vd.setAttribute('aria-hidden','false'); cd.classList.add('stacked');
  setTimeout(()=>vd.querySelector('.back').focus({preventScroll:true}),80);
}
function closeVenuePanel(restore=true){
  if(!vd.classList.contains('open')) return;
  vd.classList.remove('open'); vd.setAttribute('aria-hidden','true'); cd.classList.remove('stacked');
  if(restore) (vdFrom && document.contains(vdFrom) ? vdFrom : cd.querySelector('.x')).focus({preventScroll:true});
}
function showOnMap(i){
  closeCoach(false); openVenue(i,false);
  glide(document.getElementById('kur-zaisti')).then(()=>acc.children[i].querySelector('.acc-btn').focus({preventScroll:true}));
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-coach]'); if(b){ openCoach(+b.dataset.coach); return; }
  const v=e.target.closest('[data-venue]'); if(!v) return;
  if(cd.contains(v)) openVenuePanel(+v.dataset.venue,v);   /* iš trenerio panelio: klubas atsidaro ant viršaus */
  else showOnMap(+v.dataset.venue);                         /* iš puslapio: nuslenka į „Kur žaisti“ */
});
cd.addEventListener('click',e=>{
  if(e.target.closest('[data-cclose]')) closeCoach();
  else if(e.target.closest('[data-inquiry]')) closeCoach(false);   /* žinutės langas atsidarys vietoj panelio */
});
vd.addEventListener('click',e=>{
  if(e.target.closest('[data-vback]')) closeVenuePanel();
  else if(e.target.closest('[data-vcloseall]')) closeCoach();
  else if(e.target.closest('[data-coach-swap]')){ const j=+e.target.closest('[data-coach-swap]').dataset.coachSwap; closeVenuePanel(false); if(j!==cdCur) openCoach(j); else cd.querySelector('.x').focus({preventScroll:true}); }
  else if(e.target.closest('[data-venue-map]')) showOnMap(+e.target.closest('[data-venue-map]').dataset.venueMap);
});
addEventListener('keydown',e=>{
  if(e.key!=='Escape') return;
  if(vd.classList.contains('open')) closeVenuePanel();
  else if(cd.classList.contains('open')) closeCoach();
});
