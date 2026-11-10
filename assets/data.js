/* Vienintelis turinio šaltinis: klubai, treneriai, varžybos, reitingas.
   Iš jų piešiami blokai pagrindiniame ir vidiniuose puslapiuose (assets/blocks.js). */

/* Kur žaisti: tikri duomenys iš squash.lt/kur-zaisti. x,y: vieta žemėlapyje */
const VENUES=[
  {slug:'vilnius',city:'Vilnius',x:250,y:186,place:'SEB arena',addr:'Ąžuolyno g. 7, Vilnius',tel:'+370 5 236 2205'},
  {slug:'kaunas',city:'Kaunas',x:171.2,y:165,place:'Padel HUB',addr:'B. Brazdžionio g. 25, Kaunas',tel:'+370 633 86336'},
  {slug:'klaipeda',city:'Klaipėda',x:13.1,y:84,place:'Skvošo zona',addr:'Svajonės g. 31a, Klaipėda',tel:'+370 685 61677'},
  {slug:'siauliai',city:'Šiauliai',x:138.1,y:62,place:'Uniqa arena',addr:'Išradėjų g. 14, Šiauliai',tel:'+370 636 91111'},
  {slug:'garliava',city:'Garliava',x:169.5,y:173,place:'Pagrokim skvošą',addr:'J. Šimkaus g. 20, Garliava',tel:'+370 631 26884'},
  {slug:'druskininkai',city:'Druskininkai',x:175.2,y:253,place:'Grand Spa',addr:'V. Kudirkos g. 45, Druskininkai',tel:'+370 313 51200'},
  {slug:'taurage',city:'Tauragė',x:79.3,y:130,place:'Bendruomenių namai',addr:'Vytauto g. 141, Tauragė',tel:'+370 678 47991'}
];

/* Treneriai: duomenys iš squash.lt/treneriai. tel: telefonas; telDemo: true, kol tikro numerio nėra (rodoma žymė „Demo numeris“). at: VENUES indeksai arba laisvas tekstas, kur klubo nėra sąraše */
const COACHES=[
  {n:'Mantas Kočiūnas',tel:'+370 600 000 01',telDemo:true,at:[0],cert:'ESF 3 lygis',lang:'LT, EN',
   bio:'Buvęs daugkartinis Lietuvos čempionas ir rinktinės kapitonas. Dirba su visais: nuo pirmą kartą raketę paimančių iki profesionalų.',
   full:['Ilgametę patirtį turintis skvošo treneris, buvęs daugkartinis Lietuvos skvošo čempionas ir Lietuvos rinktinės kapitonas. Treniruotes veda Vilniuje, SEB arenoje, lietuvių ir anglų kalbomis.','Mantas dirba su įvairaus lygio žaidėjais: nuo pradedančiųjų, pirmą kartą paimančių raketę į rankas, iki pažengusių ir profesionalių sportininkų. Treniruotėse daug dėmesio skiria technikai, taktikai, psichologiniams žaidimo aspektams ir individualiems žaidėjo poreikiams.','Jo treniruočių principas: saugus, kokybiškas ir tikslingas augimas. Mantas turi aukščiausią ESF 3 lygio trenerio sertifikatą.']},
  {n:'Ilja Koryšev',tel:'+370 600 000 02',telDemo:true,at:[{city:'Vilnius',place:'klubas tikslinamas'}],cert:'WSF 1 ir 2 lygis',lang:'EN, RU',
   bio:'Daugiau nei 10 metų žaidimo ir trenerio patirtis. Veda individualias ir grupines treniruotes vaikams ir suaugusiems.',
   full:['Sertifikuotas skvošo treneris, dirbantis Lietuvoje, turintis daugiau nei 10 metų žaidimo ir treniravimo patirtį. Jis yra įgijęs WSF Level 1 ir Level 2 trenerio kvalifikacijas ir aktyviai dirba su įvairaus amžiaus ir lygio žaidėjais: nuo pradedančiųjų iki pažengusių sportininkų.','Ilja specializuojasi individualiose ir grupinėse treniruotėse suaugusiesiems bei vaikams, didelį dėmesį skiria technikos pagrindams, žaidimo supratimui, judėjimui aikštelėje ir ilgalaikiam žaidėjų progresui.','Treneris veda treniruotes anglų ir rusų kalbomis, taip pat aktyviai mokosi lietuvių kalbos. Ilja prisideda prie skvošo vystymo Lietuvoje, skatindamas reguliarų, saugų ir motyvuojantį treniruočių procesą.']},
  {n:'Andrėjus Kolčėvnikovas',tel:'+370 600 000 03',telDemo:true,at:[0],cert:'ESF 1 · WSF 2 lygis',lang:'LT, EN, RU',
   bio:'Treniruoja nuo 2012 m. Tiki, kad skvoše laimi ne tik kojos, bet ir galva: gebėjimas mąstyti ir valdyti žaidimą.',
   full:['Patyręs skvošo treneris, treniruotes vedantis Vilniuje, SEB arenoje. Treneriu dirba nuo 2012 metų ir turi plačią patirtį su įvairaus lygio žaidėjais: nuo pradedančiųjų iki čempionų. Andrėjus treniruoja vaikus, jaunimą, mėgėjus, pažengusius ir varžyboms besiruošiančius žaidėjus, veda individualias ir grupines treniruotes anglų, rusų ir lietuvių kalbomis.','Jo treniravimo filosofija paremta motyvacija, sąžiningu darbu ir žaidimo supratimu. Andrėjus tiki, kad skvošas yra sportas, kuriame laimi ne tik fizinis pasirengimas, bet ir galva: gebėjimas mąstyti, priimti sprendimus ir valdyti žaidimą. Treniruotėse jis vertina ambicingus tikslus, norą dirbti ir pagarbą sąžiningam žaidimui.','Andrėjus turi ESF I lygio trenerio sertifikatą, WSF II lygio kvalifikaciją ir yra dalyvavęs Hadrian Stiff trenerių kursuose.']},
  {n:'Laurynas Minkus',tel:'+370 600 000 04',telDemo:true,at:[1],cert:'WSF 1 lygis',lang:'LT, EN',
   bio:'10 metų treniravimo patirtis. Pagrindinė kryptis yra vaikų ir jaunimo ugdymas, taisyklinga technika ir judėjimas korte.',
   full:['Charizmatiškas ir energingas skvošo treneris, turintis 10 metų treniravimo patirtį. Treniruotes veda Kaune, Padel Hub sporto komplekse, lietuvių ir anglų kalbomis. Laurynas dirba su vaikais, jaunimu ir suaugusiaisiais.','Pagrindinė jo darbo kryptis: vaikų ir jaunimo ugdymas, taisyklingos technikos formavimas, judėjimas korte, žaidimo supratimas, fizinis pasirengimas ir nuoseklus progresas. Treniruotėse Laurynui svarbi aiški struktūra, individualus dėmesys, motyvuojanti atmosfera ir žaidėjo pasitikėjimas savimi.','Laurynas yra baigęs WSF Level 1 trenerių kursus.']},
  {n:'Linas Zdanavičius',tel:'+370 600 000 05',telDemo:true,at:[1,4,{city:'Kaunas',place:'VS Fitness'}],cert:'WSF 1 lygis',lang:'EN, RU',
   bio:'10+ metų patirtis. Nestandartinio stiliaus žaidėjas, todėl moko praktinių sprendimų, kaip geriau suprasti varžovą.',
   full:['10+ metų skvošo patirties turintis treneris, dirbantis Kaune, Padel Hub, Garliavos skvošo klube ir VS Fitness. Linas treniruoja vaikus, jaunimą ir suaugusiuosius: nuo pradedančiųjų iki mėgėjų, pažengusių bei B, C ir D lygio žaidėjų. Veda individualias ir grupines treniruotes anglų bei rusų kalbomis.','Treniruotėse daug dėmesio skiria technikos tobulinimui, fizinės ištvermės ugdymui, taktiniam mąstymui ir individualiems žaidėjo tikslams. Pats būdamas nestandartinio žaidimo stiliaus žaidėjas, Linas gali perteikti įvairius praktinius sprendimus, padedančius geriau suprasti varžovą ir efektyviau žaisti aikštelėje.','Linas yra baigęs WSF 1 lygio trenerių kursus ir 2 lygio teisėjų kursus.']},
  {n:'Linas Pilipavičius',tel:'+370 600 000 06',telDemo:true,at:[0],cert:'England Squash 1 lygis',lang:'LT, EN',
   bio:'Aiškūs pagrindai, nuoseklus progresas ir pasitikėjimas savimi korte. Treniruoja vaikus ir suaugusius.',
   full:['Patyręs skvošo treneris, vedantis treniruotes Vilniuje, SEB arenoje. Jis dirba su vaikais ir suaugusiaisiais, pradedančiaisiais bei pažengusiais žaidėjais, kviesdamas treniruotis visus: nuo pirmųjų žingsnių skvošo aikštelėje iki aukštesnio žaidimo lygio siekiančių sportininkų.','Treniruotes veda individualiai arba grupėse, lietuvių ir anglų kalbomis. Linas yra įgijęs Anglijos skvošo asociacijos pirmo lygio trenerio sertifikatą.','Jo treniruotėse svarbu aiškus pagrindų formavimas, nuoseklus progresas ir žaidėjo pasitikėjimas savimi aikštelėje.']},
  {n:'Andrius Stančaitis',tel:'+370 600 000 07',telDemo:true,at:[2],cert:'ESF 1 lygis',lang:'LT, EN, RU',
   bio:'Patirtį kaupė Velse. Moko atsižvelgdamas į žmogaus judėjimą, tikslus ir galimybes, ne vien į sporto šaką.',
   full:['Patyręs skvošo treneris, šiuo metu dirbantis Klaipėdoje, „Skvošo zonoje“, patirtį ne vienus metus kaupęs Velse, Jungtinėje Karalystėje.','Andriaus treniravimo filosofija paremta individualiu požiūriu į žaidėją. Jo įsitikinimu, skvošo reikia mokyti atsižvelgiant į žmogaus judėjimą, tikslus ir galimybes, o ne vien į pačią sporto šaką. Toks požiūris leidžia skvošą atrasti įvairaus amžiaus ir pasirengimo žmonėms: nuo pirmą kartą raketę paimančių pradedančiųjų iki pažengusių žaidėjų.','Treniruotėse Andrius daug dėmesio skiria technikai, judėjimo kokybei ir natūraliai žaidimo plastikai. Jis turi ESF Level 1 trenerio sertifikatą ir yra išklausęs ESF Level 2 mokymus. Treniruotės vyksta lietuvių, anglų ir rusų kalbomis.']},
  {n:'Marina Zaremba',tel:'+370 600 000 08',telDemo:true,at:[0],from:'Argentina',cert:'Profesionali žaidėja · Argentina',lang:'',soon:true,
   bio:'Profesionali skvošo žaidėja ir trenerė iš Argentinos. Treniruoja Vilniuje, SEB arenoje.',
   full:['Profesionali skvošo žaidėja ir trenerė iš Argentinos. Treniruotes veda Vilniuje, SEB arenoje.','Daugiau informacijos apie Mariną ir jos treniruotes paskelbsime netrukus.']}
];

/* Varžybos: DEMO duomenys, kol nėra tikro kalendoriaus. v: VENUES indeksas */
const EVENTS=[
  {d:'2026-11-22',t:'Lietuvos skvošo čempionatas',v:1},
  {d:'2026-12-06',t:'Vilniaus kalėdinis turnyras',v:0},
  {d:'2027-01-17',t:'Pajūrio taurė',v:2},
  {d:'2027-02-07',t:'Jaunių reitingo turnyras',v:3},
  {d:'2027-02-28',t:'LSA taurė: Kauno etapas',v:1},
  {d:'2027-03-14',t:'Veteranų turnyras',v:4},
  {d:'2027-04-11',t:'LSA taurė: Vilniaus etapas',v:0},
  {d:'2027-05-09',t:'Druskininkų pavasario turnyras',v:5}
];

/* Reitingas: DEMO duomenys pagrindinio puslapio ištraukai. Pilnas reitingas yra rankedin.com */
const RANK={
  v:[['A. Kazlauskas','Vilnius',1840],['M. Petrauskas','Kaunas',1765],['T. Jankauskas','Vilnius',1702],['D. Stankevičius','Klaipėda',1650],['L. Vasiliauskas','Kaunas',1598]],
  m:[['I. Kazlauskaitė','Vilnius',1620],['G. Petrauskienė','Kaunas',1588],['E. Butkutė','Vilnius',1510],['R. Paulauskaitė','Klaipėda',1462],['A. Urbonaitė','Kaunas',1401]]
};
