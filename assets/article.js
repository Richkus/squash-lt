/* Straipsnis: straipsnis.html?id=… iš data/naujienos.json. Turinys perimtas iš squash.lt ir išvalytas iki paprasto teksto */
const MONTHS=['sausio','vasario','kovo','balandžio','gegužės','birželio','liepos','rugpjūčio','rugsėjo','spalio','lapkričio','gruodžio'];
const fmtDate=d=>{ const [y,m,dd]=d.split('-'); return `${y} m. ${MONTHS[+m-1]} ${+dd} d.`; };

(async function(){
  const el=document.getElementById('art');
  let all=[];
  try{ all=await (await fetch('data/naujienos.json')).json(); }catch(_){ el.innerHTML='<p class="empty">Nepavyko įkelti naujienos.</p>'; return; }
  all.sort((a,b)=>b.date.localeCompare(a.date));
  const id=+new URLSearchParams(location.search).get('id');
  const i=all.findIndex(n=>n.id===id);
  if(i<0){ el.innerHTML='<p class="empty">Tokios naujienos neradome. <a href="naujienos.html">Visos naujienos</a></p>'; return; }
  const n=all[i], newer=all[i-1], older=all[i+1];
  document.title=`${n.title} · Lietuvos skvošo asociacija`;
  const body=n.body ? n.body : `<p>${esc(n.excerpt)}</p>`;
  el.innerHTML=`
    <header class="art-head">
      <nav class="crumbs" aria-label="Kelias"><a href="index.html">Pradžia</a><span aria-hidden="true">/</span><a href="naujienos.html">Naujienos</a><span aria-hidden="true">/</span><a href="naujienos.html?tema=${encodeURIComponent(n.cat)}">${esc(n.cat)}</a></nav>
      <h1 class="rise">${esc(n.title)}</h1>
      <p class="meta" style="margin-top:22px"><span>${fmtDate(n.date)}</span><span>${n.min} min skaitymo</span></p>
    </header>
    ${n.img ? `<figure class="art-hero"><img src="${esc(n.img)}" alt=""></figure>` : '<div class="art-hero blank" aria-hidden="true"></div>'}
    <div class="prose">${body}</div>
    <div class="art-foot">
      <a class="link" href="${esc(n.link)}" target="_blank" rel="noopener">Originalas squash.lt<svg width="11" height="11" aria-hidden="true"><use href="#ext"/></svg></a>
      <button class="copy-link btn btn-line" type="button" id="share">Kopijuoti nuorodą</button>
    </div>
    <nav class="pn" aria-label="Kitos naujienos">
      ${newer ? `<a class="prev" href="straipsnis.html?id=${newer.id}"><span class="meta">← Naujesnė</span><h3>${esc(newer.title)}</h3></a>` : '<span></span>'}
      ${older ? `<a class="next" href="straipsnis.html?id=${older.id}"><span class="meta" style="justify-content:flex-end">Senesnė →</span><h3>${esc(older.title)}</h3></a>` : ''}
    </nav>`;
  const share=document.getElementById('share');
  share.addEventListener('click',()=>{
    try{ navigator.clipboard.writeText(location.href).then(()=>{ share.textContent='Nukopijuota'; setTimeout(()=>share.textContent='Kopijuoti nuorodą',1600); }); }catch(_){}
  });
})();
