# squash.lt redizaino eskizas

Neoficialus Lietuvos skvošo asociacijos svetainės (squash.lt) pagrindinio puslapio eskizas. Tai ne LSA svetainė, o hobio projektas idėjoms parodyti.

Vienas statinis puslapis: HTML, CSS ir vanilla JS, be build žingsnio.

## Kas viduje

- `index.html`: pagrindinis puslapis.
- `naujienos.html`, `straipsnis.html?id=…`: naujienų sąrašas su temomis ir straipsnio šablonas. Duomenys `data/naujienos.json` (23 tikri squash.lt įrašai, tekstai išvalyti iki paprasto HTML).
- `assets/site.css`, `assets/site.js`: bendri stiliai ir logika (juosta, meniu, slinkimas, žinutės langas, versijos ir temos perjungikliai).
- `assets/home.js`, `assets/news.js`, `assets/article.js`: konkrečių puslapių logika.
- `tools/sync_chrome.py`: juosta, meniu ir poraštės laikomi `index.html` tarp `<!-- chrome:top -->` ir `<!-- chrome:bottom -->` žymų. Pakeitus juos, paleisk `python3 tools/sync_chrome.py`, kad atsinaujintų vidiniai puslapiai.
- `img/`: nuotraukos iš squash.lt, sumažintos ir suspaustos (~2 MB vietoj ~27 MB dabartiniame pagrindiniame).
- `favicon.svg`: kamuoliukas su dviem taškais, puslapyje retkarčiais virsta rakete.

## Meniu

Varžybos ▾ · Žaisk skvošą ▾ · Naujienos · Daugiau ▾ | Žaidėjo portalas ↗ · Tapk nariu. Punktai, kurių puslapių dar nėra, veda į dabartinį squash.lt.

## Versijos

Apačioje kairėje „Senas / Naujas“: senoji versija apgaubia naują turinį dabartine squash.lt juosta ir poraštė. Nuoroda su `?v=senas` arba `?v=naujas`.

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
