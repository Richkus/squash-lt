"""Nukopijuoja bendrą juostą, meniu, žinutės langą ir poraštes iš index.html į vidinius puslapius.
Paleisti po kiekvieno juostos ar poraštės pakeitimo index.html:  python3 tools/sync_chrome.py"""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
src = (root / 'index.html').read_text(encoding='utf-8')
blocks = {k: re.search(rf'<!-- chrome:{k} -->.*?<!-- /chrome:{k} -->', src, re.S).group(0) for k in ('top', 'bottom')}
for page in ('naujienos.html', 'straipsnis.html', 'reitingas.html'):
    f = root / page
    t = f.read_text(encoding='utf-8')
    for k, b in blocks.items():
        t = re.sub(rf'<!-- chrome:{k} -->.*?<!-- /chrome:{k} -->', lambda _: b, t, flags=re.S)
    f.write_text(t, encoding='utf-8')
    print('atnaujinta', page)
