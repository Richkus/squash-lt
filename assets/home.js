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
const acc=document.getElementById('acc');
acc.innerHTML=VENUES.map((v,i)=>`
  <li class="${i===0?'open':''}">
    <button class="acc-btn" type="button" id="ab${i}" aria-expanded="${i===0}" aria-controls="ap${i}">
      <h3>${esc(v.city)}</h3><span class="count">${esc(v.place)}</span><span class="plus">${plusSvg}</span>
    </button>
    <div class="acc-body" id="ap${i}" role="region" aria-labelledby="ab${i}"><div>
      <dl><div><dt>Klubas</dt><dd>${esc(v.place)}</dd></div><div><dt>Adresas</dt><dd>${esc(v.addr)}</dd></div><div><dt>Telefonas</dt><dd>${esc(v.tel)}</dd></div></dl>
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


/* Treneriai: duomenys iš squash.lt/treneriai, aprašymai sutrumpinti */
const COACHES=[
  {n:'Mantas Kočiūnas',loc:'Vilnius · SEB arena',cert:'ESF 3 lygis',lang:'LT, EN',bio:'Buvęs daugkartinis Lietuvos čempionas ir rinktinės kapitonas. Dirba su visais: nuo pirmą kartą raketę paimančių iki profesionalų.'},
  {n:'Ilja Koryšev',loc:'Vilnius',cert:'WSF 1 ir 2 lygis',lang:'EN, RU',bio:'Daugiau nei 10 metų žaidimo ir trenerio patirtis. Veda individualias ir grupines treniruotes vaikams ir suaugusiems.'},
  {n:'Andrėjus Kolčėvnikovas',loc:'Vilnius · SEB arena',cert:'ESF 1 · WSF 2 lygis',lang:'LT, EN, RU',bio:'Treniruoja nuo 2012 m. Tiki, kad skvoše laimi ne tik kojos, bet ir galva: gebėjimas mąstyti ir valdyti žaidimą.'},
  {n:'Laurynas Minkus',loc:'Kaunas · Padel HUB',cert:'WSF 1 lygis',lang:'LT, EN',bio:'10 metų treniravimo patirtis. Pagrindinė kryptis yra vaikų ir jaunimo ugdymas, taisyklinga technika ir judėjimas korte.'},
  {n:'Linas Zdanavičius',loc:'Kaunas · Garliava',cert:'WSF 1 lygis',lang:'EN, RU',bio:'10+ metų patirtis. Nestandartinio stiliaus žaidėjas, todėl moko praktinių sprendimų, kaip geriau suprasti varžovą.'},
  {n:'Linas Pilipavičius',loc:'Vilnius · SEB arena',cert:'England Squash 1 lygis',lang:'LT, EN',bio:'Aiškūs pagrindai, nuoseklus progresas ir pasitikėjimas savimi korte. Treniruoja vaikus ir suaugusius.'},
  {n:'Andrius Stančaitis',loc:'Klaipėda · Skvošo zona',cert:'ESF 1 lygis',lang:'LT, EN, RU',bio:'Patirtį kaupė Velse. Moko atsižvelgdamas į žmogaus judėjimą, tikslus ir galimybes, ne vien į sporto šaką.'}
];
const cList=document.getElementById('cList'), cCard=document.getElementById('cCard');
cList.innerHTML=COACHES.map((c,i)=>`<li><button class="c-name" type="button" role="tab" id="ct${i}" data-i="${i}" aria-selected="${i===0}" aria-controls="cCard">${esc(c.n)}</button></li>`).join('');
let cCur=-1;
function showCoach(i){
  if(i===cCur) return; cCur=i; const c=COACHES[i];
  cList.querySelectorAll('.c-name').forEach(b=>b.setAttribute('aria-selected',String(+b.dataset.i===i)));
  const ini=c.n.split(' ').map(w=>w[0]).join('');
  cCard.setAttribute('aria-labelledby','ct'+i);
  cCard.innerHTML=`<div class="c-frame"><i></i><i></i><i></i><i></i><div class="c-tile"><span class="loc">${esc(c.loc)}</span><span class="ini" aria-hidden="true">${esc(ini)}</span></div></div>
    <p class="c-meta">Treneris<span>${esc(c.cert)} · ${esc(c.lang)}</span></p>
    <p class="c-bio">${esc(c.bio)}</p>
    <div class="c-acts"><button class="btn btn-accent" type="button" data-inquiry="Noriu išbandyti skvošą">Treniruotė<span class="arr"><svg aria-hidden="true"><use href="#arr"/></svg></span></button><a class="link" href="https://squash.lt/treneriai/">Visi aprašymai<svg width="11" height="11" aria-hidden="true"><use href="#ext"/></svg></a></div>`;
  cCard.classList.remove('swap'); void cCard.offsetWidth; cCard.classList.add('swap');
}
cList.addEventListener('click',e=>{ const b=e.target.closest('.c-name'); if(b) showCoach(+b.dataset.i); });
if(matchMedia('(hover:hover)').matches) cList.addEventListener('mouseover',e=>{ const b=e.target.closest('.c-name'); if(b) showCoach(+b.dataset.i); });
cList.addEventListener('keydown',e=>{
  if(!['ArrowDown','ArrowUp'].includes(e.key)) return; e.preventDefault();
  const n=(cCur+(e.key==='ArrowDown'?1:-1)+COACHES.length)%COACHES.length; showCoach(n); document.getElementById('ct'+n).focus();
});
showCoach(0);

