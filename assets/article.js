/* Seni adresai straipsnis.html?id=… nukreipiami į naujienos/<slug>/ (straipsniai sugeneruoti tools/build.py) */
(async function(){
  const id=+new URLSearchParams(location.search).get('id'), el=document.getElementById('art');
  try{
    const all=await (await fetch('data/naujienos.json')).json(), n=all.find(x=>x.id===id);
    if(n){ location.replace(`naujienos/${n.slug}/`); return; }
  }catch(_){}
  el.innerHTML='<p class="empty">Tokios naujienos neradome. <a href="naujienos.html">Visos naujienos</a></p>';
})();
