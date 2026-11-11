"""Surenka puslapius iš bendrų dalių. Paleisti po bet kokio parts/*.html pakeitimo:

    python3 tools/build.py

- Kiekviename *.html faile <!-- part:vardas --> ... <!-- /part:vardas --> turinys pakeičiamas parts/vardas.html.
  Taip juosta, poraštė ir sekcijos (apie, skaičiai, LA28, partneriai, kontaktai) laikomos vienoje vietoje.
- Interaktyvūs blokai (klubai, treneriai, varžybos, reitingas, naujienos) piešiami iš assets/data.js per assets/blocks.js.
- Failų nuorodoms atnaujinama versijos žyma ?b=…, kad naršyklės neimtų senų failų iš talpyklos.
"""
import re, pathlib, time
root = pathlib.Path(__file__).resolve().parent.parent
parts = {p.stem: p.read_text(encoding='utf-8').rstrip('\n') for p in (root / 'parts').glob('*.html')}
token = time.strftime('%m%d%H%M')
for page in sorted(root.glob('*.html')):
    t = page.read_text(encoding='utf-8')
    def fill(m):
        name = m.group(1)
        if name not in parts: raise SystemExit(f'{page.name}: nėra parts/{name}.html')
        return f'<!-- part:{name} -->\n{parts[name]}\n<!-- /part:{name} -->'
    t = re.sub(r'<!-- part:([\w-]+) -->.*?<!-- /part:\1 -->', fill, t, flags=re.S)
    t = re.sub(r'((?:assets/[\w-]+\.(?:css|js))|favicon\.svg)(\?b=\d+)?"', rf'\1?b={token}"', t)
    page.write_text(t, encoding='utf-8')
    print('surinkta', page.name)

# Straipsniai: kiekviena naujiena gauna savo adresą naujienos/<slug>/ (tas pats slug kaip squash.lt).
# Puslapis surenkamas iš straipsnis.html šablono, turinys įrašomas iš karto (be JS), santykiniai keliai gauna ../../
import json, html, shutil
H = html.escape
MONTHS = ['sausio','vasario','kovo','balandžio','gegužės','birželio','liepos','rugpjūčio','rugsėjo','spalio','lapkričio','gruodžio']
SITE = 'https://richkus.github.io/squash-lt/'
posts = sorted(json.loads((root / 'data/naujienos.json').read_text(encoding='utf-8')), key=lambda n: n['date'], reverse=True)
tpl = (root / 'straipsnis.html').read_text(encoding='utf-8')
out_dir = root / 'naujienos'
if out_dir.exists(): shutil.rmtree(out_dir)
ARROW = '<svg width="11" height="11" aria-hidden="true"><use href="#ext"/></svg>'

def prefix(t, pre):
    return re.sub(r'\b(href|src)="(?!https?:|//|#|mailto:|tel:|data:|javascript:|/)([^"]*)"', lambda m: f'{m.group(1)}="{pre}{m.group(2)}"', t)

for i, n in enumerate(posts):
    newer = posts[i-1] if i > 0 else None
    older = posts[i+1] if i + 1 < len(posts) else None
    y, m, d = n['date'].split('-')
    body = n.get('body') or f"<p>{H(n['excerpt'])}</p>"
    hero = f'<figure class="art-hero"><img src="{H(n["img"])}" alt=""></figure>' if n.get('img') else '<div class="art-hero blank" aria-hidden="true"></div>'
    pn = (f'<a class="prev" href="naujienos/{newer["slug"]}/"><span class="meta">← Naujesnė</span><h3>{H(newer["title"])}</h3></a>' if newer else '<span></span>') + \
         (f'<a class="next" href="naujienos/{older["slug"]}/"><span class="meta" style="justify-content:flex-end">Senesnė →</span><h3>{H(older["title"])}</h3></a>' if older else '')
    art = f'''<main id="pradzia">
  <article class="page-head">
    <div class="wrap art" id="art">
    <header class="art-head">
      <nav class="crumbs" aria-label="Kelias"><a href="index.html">Pradžia</a><span aria-hidden="true">/</span><a href="naujienos.html">Naujienos</a><span aria-hidden="true">/</span><a href="naujienos.html?tema={H(n['cat'])}">{H(n['cat'])}</a></nav>
      <h1 class="rise">{H(n['title'])}</h1>
      <p class="meta" style="margin-top:22px"><span><time datetime="{n['date']}">{y} m. {MONTHS[int(m)-1]} {int(d)} d.</time></span><span>{n['min']} min skaitymo</span></p>
    </header>
    {hero}
    <div class="prose">{body}</div>
    <div class="art-foot">
      <a class="link" href="{H(n['link'])}" target="_blank" rel="noopener">Originalas squash.lt{ARROW}</a>
      <button class="copy-link btn btn-line" type="button" id="share">Kopijuoti nuorodą</button>
    </div>
    <nav class="pn" aria-label="Kitos naujienos">{pn}</nav>
    </div>
  </article>
</main>'''
    t = tpl[:tpl.index('<main id="pradzia">')] + art + tpl[tpl.index('</main>') + 7:]
    url = f"{SITE}naujienos/{n['slug']}/"
    desc = H(n['excerpt'][:160])
    t = re.sub(r'<title>.*?</title>', f"<title>{H(n['title'])} · Lietuvos skvošo asociacija</title>", t, count=1)
    t = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">\n<link rel="canonical" href="{url}">\n<meta property="og:type" content="article">\n<meta property="og:title" content="{H(n["title"])}">\n<meta property="og:description" content="{desc}">\n<meta property="og:url" content="{url}">' + (f'\n<meta property="og:image" content="{SITE}{H(n["img"])}">' if n.get('img') else ''), t, count=1)
    t = re.sub(r'<script src="assets/article\.js[^"]*"></script>\n?', '', t)
    t = prefix(t, '../../')
    t = t.replace('<script src="../../assets/site.js', '<script>window.ROOT=\'../../\';</script>\n<script src="../../assets/site.js', 1)
    t = t.replace('</body>', '''<script>document.getElementById('share').addEventListener('click',e=>{ const b=e.currentTarget; try{ navigator.clipboard.writeText(location.href).then(()=>{ b.textContent='Nukopijuota'; setTimeout(()=>b.textContent='Kopijuoti nuorodą',1600); }); }catch(_){} });</script>
</body>''', 1)
    f = out_dir / n['slug'] / 'index.html'
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(t, encoding='utf-8')
print('straipsniai:', len(posts), '→ naujienos/<slug>/')
