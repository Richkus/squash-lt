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
