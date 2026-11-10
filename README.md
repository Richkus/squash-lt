# squash.lt redizaino eskizas

Neoficialus Lietuvos skvošo asociacijos svetainės (squash.lt) pagrindinio puslapio eskizas. Tai ne LSA svetainė, o hobio projektas idėjoms parodyti.

Vienas statinis puslapis: HTML, CSS ir vanilla JS, be build žingsnio.

## Kas viduje

Kiekvienas meniu punktas yra atskiras puslapis, o turinys laikomas vienoje vietoje:

- **Puslapiai:** `index.html` (santrauka), `kalendorius.html`, `reitingas.html`, `kur-zaisti.html`, `treneriai.html`, `saugumo-taisykles.html`, `naujienos.html`, `straipsnis.html?id=…`, `apie.html`, `kontaktai.html`.
- **`assets/data.js`:** vienintelis duomenų šaltinis: klubai, treneriai, varžybos (iš LSA Google kalendoriaus), rankedin nustatymai.
- **`assets/blocks.js`:** blokai iš tų duomenų (`data-block="venues|coaches|events|rank|rank-full|news|hero-event|word-open"`). Reitingas kraunamas gyvai iš rankedin.com API ir šoninis panelis su ekranų steku (treneris ↔ klubas, su „Atgal“). Tas pats blokas rodomas pagrindiniame ir vidiniame puslapyje.
- **`parts/*.html`:** statinės bendros dalys: juosta, poraštė, SKVOŠAS, apie, skaičiai, partneriai, kontaktai.
- **`tools/build.py`:** sudeda `parts/` į visus puslapius ir atnaujina failų versijos žymą. Paleisk po kiekvieno `parts/` pakeitimo: `python3 tools/build.py`.
- **`assets/site.css`, `assets/site.js`:** stiliai ir bendra logika (juosta, meniu, žinutės langas, versijų perjungiklis, velykinis kiaušinis).
- **`data/naujienos.json`:** 23 tikros squash.lt naujienos.
- **`img/`:** suspaustos nuotraukos, LSA logotipas.

## Meniu

Varžybos ▾ (Kalendorius, Reitingas) · Žaisk skvošą ▾ (Kur žaisti, Treneriai, Saugumo taisyklės) · Naujienos · Daugiau ▾ (Apie mus, Kontaktai) | Žaidėjo portalas ↗ · Tapk nariu. Juosta rodo, kuriame puslapyje esi. Punktai su ↗ veda į dabartinį squash.lt.

## Versijos

Poraštėje „Paduok kamuoliuką“: velykinis kiaušinis, mažas skvošo ralis (spausk kamuoliuką, kad neatšoktų du kartus). Apačioje kairėje „Senas / Naujas“: senoji versija apgaubia naują turinį dabartine squash.lt juosta ir poraštė. Nuoroda su `?v=senas` arba `?v=naujas`.

## Kryptis

Rami „PRO“ nuotaika (t1energy.com): Geist 300 teiginiai, Geist Mono etiketės, logotipo žalia kaip vienintelė spalva, motyvas yra dvigubas taškas nuo skvošo kamuoliuko.

## Peržiūra vietoje

```bash
npx http-server . -p 8110 -c-1
```

## Žinomos spragos

- Artėjančios varžybos ir reitingas yra demo duomenys.
- Logotipas: originalus LSA SVG (`img/lsa-logo.svg`); nuslinkus juostoje lieka tik ženklas su „LSA“.
- Forma nieko nesiunčia.
