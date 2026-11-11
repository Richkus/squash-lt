/* Naujienų sąrašas: duomenys iš data/naujienos.json (tikri squash.lt įrašai), filtrai pagal temą, „Rodyti daugiau“ */
const MONTHS=['sau','vas','kov','bal','geg','bir','lie','rgp','rgs','spa','lap','gru'];
const fmtDate=d=>{ const [y,m,dd]=d.split('-'); return `${+dd} ${MONTHS[+m-1]} ${y}`; };
const CATS=['Visos','Rinktinė','Varžybos','Jaunimas','LSA'];
const PER=9;

function cover(n,big){
  return n.img
    ? `<div class="ph"><img src="${esc(n.img)}" alt="" loading="${big?'eager':'lazy'}"></div>`
    : `<div class="ph blank" aria-hidden="true"><span>${esc(n.cat)}</span><b>${n.date.slice(0,4)}</b></div>`;
}
const meta=n=>`<p class="meta"><b>${esc(n.cat)}</b><span>${fmtDate(n.date)}</span><span>${n.min} min</span></p>`;
const href=n=>`naujienos/${n.slug}/`;

(async function(){
  const filtersEl=document.getElementById('filters'), feat=document.getElementById('feat'), grid=document.getElementById('grid'), more=document.getElementById('more');
  let all=[];
  try{ all=await (await fetch('data/naujienos.json')).json(); }catch(_){ grid.innerHTML='<p class="empty">Nepavyko įkelti naujienų. Pabandyk perkrauti puslapį.</p>'; return; }
  all.sort((a,b)=>b.date.localeCompare(a.date));
  const count=c=>c==='Visos' ? all.length : all.filter(n=>n.cat===c).length;
  let cat=new URLSearchParams(location.search).get('tema'); if(!CATS.includes(cat)) cat='Visos';
  let shown=PER;

  filtersEl.innerHTML=CATS.map(c=>`<button class="chip" type="button" data-cat="${c}" aria-pressed="${c===cat}">${c}<small>${count(c)}</small></button>`).join('');
  filtersEl.addEventListener('click',e=>{
    const b=e.target.closest('.chip'); if(!b || b.dataset.cat===cat) return;
    cat=b.dataset.cat; shown=PER;
    filtersEl.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    const u=new URL(location.href); cat==='Visos' ? u.searchParams.delete('tema') : u.searchParams.set('tema',cat); history.replaceState(null,'',u);
    render(true);
  });
  more.addEventListener('click',()=>{ shown+=PER; render(false); });

  function render(anim){
    const list=all.filter(n=>cat==='Visos' || n.cat===cat);
    const [first,...rest]=list;
    feat.innerHTML=first ? `<a class="feat" href="${href(first)}">${cover(first,true)}<div>${meta(first)}<h2>${esc(first.title)}</h2><p>${esc(first.excerpt)}</p></div></a>` : '<p class="empty">Šioje temoje naujienų dar nėra.</p>';
    grid.innerHTML=rest.slice(0,shown).map(n=>`<a class="ncard" href="${href(n)}">${cover(n)}${meta(n)}<h3>${esc(n.title)}</h3><p class="ex">${esc(n.excerpt)}</p></a>`).join('');
    more.hidden=rest.length<=shown;
    if(anim){ grid.classList.remove('swap'); void grid.offsetWidth; grid.classList.add('swap'); }
  }
  render(false);
})();
