import{readFileSync,writeFileSync}from"fs";import{join,dirname}from"path";import{fileURLToPath}from"url";
const __dirname=dirname(fileURLToPath(import.meta.url));const DATA=join(__dirname,"../data/perfumes.json");
const AM={"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","woody":"odunsu","floral":"çiçeksi","sweet":"tatlı","fruity":"meyveli","rose":"gül","vanilla":"vanilya","oud":"oud","musk":"misk","leather":"deri","tobacco":"tütün","incense":"tütsü","powdery":"pudralı","gourmand":"gurme","aquatic":"deniz","oriental":"oryantal","iris":"iris","patchouli":"paçuli","smoky":"dumanlı","green":"yeşil","honey":"bal","balsamic":"balsam","tea":"çay","herbal":"bitkisel","chypre":"chypre","fougere":"fougère","lavender":"lavanta","white floral":"beyaz çiçek","animalic":"hayvani","sandalwood":"sandal ağacı","vetiver":"vetiver","cedar":"sedir","creamy":"kremsi","jasmine":"yasemin","aldehydic":"aldehydik","violet":"menekşe","caramel":"karamel","coconut":"hindistancevizi","rum":"rom","cherry":"kiraz","almond":"badem","marine":"deniz","suede":"süet","resinous":"reçineli"};
const GT={male:"erkeklere özel",female:"kadınlara özel",unisex:"uniseks"};
const ST={spring:"ilkbahar",summer:"yaz",fall:"sonbahar",winter:"kış"};
function gtr(p){const ac=(p.accords||[]).slice(0,3).map(a=>AM[a.toLowerCase()]||a);const g=GT[p.gender]||"herkes için";const ss=p.season||[];const pts=[];if(ac.length)pts.push(`${ac.join(", ")} notalarıyla öne çıkan, ${g} bir parfüm.`);else pts.push(`${g.charAt(0).toUpperCase()+g.slice(1)} için özel bir koku.`);if(ss.length===4)pts.push("Dört mevsim kullanılabilir.");else if(ss.length)pts.push(`${ss.map(s=>ST[s]||s).join(" ve ")} ayları için ideal.`);return pts.join(" ");}
function m(brand,name,g,y,r,ss,acc,desc){const p={brand,name,notes:{top:[],middle:[],base:[]},accords:acc,longevity:"long",sillage:"moderate",season:ss,gender:g,rating:r,short_description:desc,year:y,image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${10000+Math.abs(brand.charCodeAt(0)*name.charCodeAt(0)*11+y*179)%58000}.jpg`};p.short_description_tr=gtr(p);return p;}

const N=[
// Farklı ulusların ünlü markaları
// İtalyan
m("Bvlgari","Aqva Divina EDT","female",2015,3.72,["spring","summer"],["aquatic","floral","fresh","musk"],"Divine waters. Sea lavender and lotus. Mediterranean goddess."),
m("Bvlgari","Goldea the Roman Night EDP","female",2017,3.85,["fall","winter"],["floral","amber","iris","musk"],"Roman night gold. Iris and amber. Nocturnal luxury."),
m("Bvlgari","Voile de Jasmin EDT","female",2016,3.75,["spring","summer"],["white floral","citrus","fresh","musk"],"Jasmine veil. Delicate and sheer. Soft ethereal."),
m("Bvlgari","Aqua Marine EDT","male",2010,3.72,["spring","summer"],["aquatic","citrus","fresh","woody"],"Aqua marine. Sea and citrus. Mediterranean masculine."),
m("Bvlgari","Aqva Pour Homme Atlantiqve EDT","male",2016,3.72,["spring","summer"],["aquatic","citrus","fresh","woody"],"Atlantic aqua. Sea and cedar. Deep ocean."),
m("Cartier","Pasha de Cartier Nuit EDP","male",2019,3.82,["fall","winter"],["woody","spicy","tobacco","amber"],"Pasha night. Tobacco and spice. After hours luxury."),
m("Cartier","Reves d'Ailleurs EDP","female",2021,4.05,["spring","fall"],["floral","woody","musk","fresh"],"Dreams elsewhere. Iris and sandalwood. Elegant escape."),
m("Cartier","Carat EDP","female",2019,3.88,["spring","summer"],["white floral","tuberose","powdery","musk"],"Diamond carat. White flowers. Gem luxury."),
m("Boucheron","Quatre Pour Femme EDP","female",2014,3.75,["spring","fall"],["floral","woody","iris","musk"],"Quatre femme. Iris and cashmere. Jeweller's feminine."),
m("Boucheron","Quatre Pour Homme EDP","male",2014,3.78,["fall","winter"],["woody","spicy","amber","aromatic"],"Quatre homme. Cedar and pepper. Jeweller's masculine."),
// Fransız heritage
m("Coty","Chypre EDP","female",1917,4.15,["fall","winter"],["chypre","floral","earthy","mossy"],"The original chypre. Bergamot and oakmoss. 1917 legendary."),
m("Coty","L'Aimant EDP","female",1927,3.75,["spring","fall"],["floral","aldehydic","powdery","oriental"],"The loved one. 1927 French chypre. Art deco elegance."),
m("Jean Couturier","Coriandre EDP","female",1973,3.72,["spring","fall"],["chypre","floral","spicy","earthy"],"Coriander spice. Green floral chypre. 1973 forgotten classic."),
m("Floris","No 89 EDT","male",1951,4.08,["spring","fall"],["fougere","aromatic","floral","woody"],"Royal barber. English fougère since 1951. Worn by royalty."),
m("Floris","Rose Absolute EDP","female",1960,4.12,["spring","summer"],["rose","floral","powdery","woody"],"English rose perfection. Pure rose absolute. Timeless Mayfair."),
m("Floris","White Rose EDP","female",1911,3.95,["spring","summer"],["floral","white floral","fresh","powdery"],"White rose 1911. Delicate English. Heritage simplicity."),
m("Roger & Gallet","Fleur d'Osmanthus EDF","unisex",2011,3.68,["spring","summer"],["floral","fruity","fresh","musk"],"Osmanthus floral water. Delicate and peach-like. Subtle."),
m("Roger & Gallet","Rose Fraiche EDF","female",2014,3.72,["spring","summer"],["floral","rose","fresh","fruity"],"Fresh rose water. Raspberry and rose. Light joyful."),
// Japonya
m("Shiseido","Zen EDP","female",1964,3.88,["fall","winter"],["floral","oriental","amber","woody"],"Zen harmony. Rose and sandalwood. Japanese meditative."),
m("Shiseido","Feminite du Bois EDP","female",1992,4.12,["fall","winter"],["woody","fruity","spicy","cedar"],"Femininity of wood. Cedar and plum. 1992 revolutionary."),
// Alman
m("Bogner","Energy EDP","female",2009,3.60,["spring","summer"],["floral","fresh","fruity","musk"],"Alpine energy. Peach and peony. Sport luxury."),
m("Bogner","Sport Man EDT","male",2011,3.55,["spring","summer"],["fresh","citrus","woody","aromatic"],"Sport man. Fresh herbs. Mountain freshness."),
m("Strellson","Element Water EDT","male",2008,3.55,["spring","summer"],["aquatic","fresh","citrus","woody"],"Element water. Aquatic and clean. Urban masculine."),
m("Hugo","Hugo Woman EDT","female",1997,3.60,["spring","summer"],["fresh","citrus","floral","woody"],"Hugo woman. Apple and jasmine. Outdoor feminine."),
m("Hugo","Hugo Energise EDT","male",2003,3.60,["spring","summer"],["fresh","citrus","aromatic","woody"],"Energize Hugo. Green apple and grapefruit. Active."),
m("Jil Sander","Pure EDT","female",2000,3.65,["spring","summer"],["floral","iris","fresh","musk"],"Jil Sander pure. Clean iris. German minimalism."),
m("Jil Sander","Sun EDT","female",1989,3.72,["spring","summer"],["floral","citrus","fresh","aldehydic"],"Sun 1989. Floral brightness. Clean elegance."),
m("Mexx","Energizing Woman EDP","female",2009,3.50,["spring","summer"],["floral","fresh","citrus","musk"],"Energizing. Fresh and light. Urban casual."),
m("Mexx","City Breeze EDT","male",2006,3.50,["spring","summer"],["fresh","aquatic","citrus","woody"],"City breeze. Aquatic and light. Urban cool."),
// İspanyol
m("Loewe","001 Woman EDT","female",2015,3.68,["spring","fall"],["floral","musk","fresh","woody"],"Loewe 001 her. Clean feminine. Spanish minimalism."),
m("Adolfo Dominguez","Agua Fresca EDT","unisex",1983,3.72,["spring","summer"],["fresh","citrus","herbal","woody"],"Agua fresca. Spanish freshness. Mediterranean herb."),
m("Purificacion Garcia","Atractivo EDT","male",2012,3.65,["spring","fall"],["fresh","woody","citrus","spicy"],"Attractive. Spanish masculine. Mediterranean freshness."),
// Türk
m("Atkinsons","24 Old Bond Street Cologne","unisex",1799,3.85,["spring","summer"],["citrus","fresh","aromatic","woody"],"Since 1799. Original Bond Street. British royalty."),
m("Czech Czech","Black Nuit de Bakelite EDT","unisex",2011,3.88,["fall","winter"],["floral","aldehydic","smoky","woody"],"Bakelite nights. Tuberose and smoke. Czech artistry."),
m("Czech Czech","Heart of Gold EDT","unisex",2013,3.82,["fall","winter"],["floral","vanilla","sweet","musk"],"Heart of gold. Jasmine and rose. Czech artisan."),
// Skandinav
m("FOREO","Luna Collection EDP","female",2020,3.75,["spring","fall"],["floral","musk","fresh","woody"],"Luna collection. Clean and modern. Scandinavian fresh."),
m("Orla Kiely","Orla Kiely EDP","female",2017,3.68,["spring","fall"],["floral","citrus","fresh","musk"],"Orla Kiely. Fresh and playful. Fashion house scent."),
// Avustralya
m("Goldfield & Banks","Silky Woods EDP","unisex",2020,3.98,["spring","fall"],["woody","creamy","musk","floral"],"Silky Australian woods. Sandalwood and musk. Southern luxury."),
m("Goldfield & Banks","Desert Rose EDP","female",2019,3.92,["spring","fall"],["rose","floral","woody","musk"],"Australian desert rose. Rose and cedar. Wild beauty."),
m("Goldfield & Banks","Pacific Rock Moss EDP","unisex",2016,4.12,["fall","winter"],["mossy","aquatic","woody","amber"],"Pacific coast moss. Sea and oakmoss. Australian coastal."),
m("Goldfield & Banks","Blue Cypress EDP","unisex",2018,3.98,["spring","summer"],["woody","fresh","citrus","aromatic"],"Blue cypress. Australian native. Unique and serene."),
// Orta Doğu ek
m("Al Haramain","Madinah EDP","unisex",2018,4.05,["fall","winter"],["oud","amber","floral","sweet"],"Madinah sacred. Oud and rose. Holy luxury."),
m("Al Haramain","Haramain Classic EDP","unisex",2018,3.95,["fall","winter"],["oud","amber","floral","sweet"],"Classic Haramain. Heritage oud. Traditional luxury."),
m("Al Haramain","Rose Oud EDP","unisex",2016,4.08,["fall","winter"],["oud","rose","floral","amber"],"Rose oud harmony. Floral and oud. Romantic Arabic."),
m("Al Haramain","Musk Malaki EDP","unisex",2019,3.95,["spring","fall"],["musk","floral","sweet","fresh"],"Royal musk. Soft and enveloping. Elevated clean."),
m("Rasasi","Al Wisam Day EDT","male",2018,4.05,["fall","winter"],["oud","woody","spicy","amber"],"Day honours. Cardamom and cedar. Noble heritage."),
m("Rasasi","Al Wisam Night EDP","male",2018,4.08,["fall","winter"],["oud","warm spicy","amber","sweet"],"Night honours. Deep and sensual. Arabian night."),
m("Rasasi","Faqat Lil Rijal EDP","male",2018,3.95,["fall","winter"],["oud","spicy","amber","leather"],"Only for men. Oud and leather. Masculine statement."),
m("Rasasi","Junoon EDP","male",2011,3.95,["fall","winter"],["tobacco","oud","amber","warm spicy"],"Arabian tobacco and oud. Rich and masculine. Nighttime luxury."),
m("Swiss Arabian","Silsal EDP","unisex",2018,3.92,["spring","fall"],["musk","woody","sweet","floral"],"Silsal purity. Clean musk and sandalwood. Simple luxury."),
m("Swiss Arabian","Nouf EDP","female",2018,3.95,["spring","fall"],["floral","citrus","sweet","musk"],"Pure light. Lemon and jasmine. Fresh Arabic feminine."),
m("Swiss Arabian","Hashimi EDP","male",2018,3.95,["fall","winter"],["oud","amber","woody","citrus"],"Hashimi. Cedar and oud. Heritage Bedouin."),
m("Swiss Arabian","Layali Rouge EDP","female",2019,4.05,["fall","winter"],["floral","fruity","sweet","rose"],"Rouge nights. Peach and rose. Sweet Oriental feminine."),
m("Arabian Oud","Musk Safari EDP","unisex",2016,3.95,["spring","fall"],["musk","rose","sweet","amber"],"Safari musk. Rose and white musk. Clean luxurious."),
m("Arabian Oud","Al Shuyukh Silver EDP","male",2020,4.05,["fall","winter"],["oud","woody","amber","citrus"],"Silver sheikhs. Oud and silver. Arabic prestige."),
m("Zimaya","Noble Musk EDP","unisex",2020,3.92,["spring","fall"],["musk","floral","sweet","woody"],"Noble musk. Soft and enveloping. Clean luxury."),
m("Zimaya","Pride EDP","male",2021,3.88,["fall","winter"],["oud","woody","spicy","amber"],"Pride. Oud and pepper. Proud masculine."),
m("Zimaya","Hayat Pink EDP","female",2021,3.88,["spring","fall"],["floral","fruity","sweet","musk"],"Life pink. Rose and berries. Sweet Arabic life."),
m("Armaf","Tag-Him EDT","male",2016,3.70,["spring","fall"],["fresh","citrus","woody","aromatic"],"Tag him. Fresh and sporty. Accessible masculine."),
m("Armaf","Enchanted EDP","female",2016,3.78,["spring","fall"],["floral","fresh","sweet","musk"],"Armaf enchanted. Peony and jasmine. Enchanting accessible."),
m("Armaf","Shades Blue EDT","male",2018,3.72,["spring","summer"],["fresh","aquatic","woody","citrus"],"Armaf shades blue. Marine freshness. Budget aquatic."),
m("Armaf","Magnifico EDP","male",2018,3.88,["fall","winter"],["woody","amber","spicy","aromatic"],"Magnifico masculine. Warm and bold. Grand presence."),
m("Paris Corner","Intact EDP","unisex",2021,3.92,["fall","winter"],["amber","oud","sweet","spicy"],"Intact. Amber and oud. Eastern completeness."),
m("Paris Corner","Intact Blue EDP","male",2022,3.88,["spring","fall"],["fresh","aquatic","woody","citrus"],"Blue intact. Marine and citrus. Fresh accessible."),
m("Paris Corner","Encanto EDP","female",2021,3.82,["spring","fall"],["floral","fruity","sweet","musk"],"Enchantment. Rose and peach. Eastern femininity."),
m("Maison Alhambra","Pure Musk EDP","unisex",2022,3.78,["spring","fall"],["musk","clean","floral","fresh"],"Pure musk. Inspired clean musk. Fresh accessible."),
m("Maison Alhambra","Aqua Vitae EDP","male",2022,3.82,["spring","fall"],["fresh","aquatic","citrus","woody"],"Aqua vitae. Sea and cedar. Fresh masculine."),
m("Maison Alhambra","Arctic Frozen EDP","male",2022,3.92,["spring","fall"],["fresh","citrus","woody","aromatic"],"Arctic freshness. Apple and cedar. Clean cool."),
m("Afnan","Compliment Him EDP","male",2020,3.88,["spring","fall"],["fresh","aromatic","woody","citrus"],"Compliment him. Basil and neroli. Fresh masculine."),
m("Afnan","Compliment Her EDP","female",2020,3.85,["spring","fall"],["floral","fruity","sweet","musk"],"Compliment her. Peach and jasmine. Sweet feminine."),
m("Afnan","Turathi Blue EDP","male",2021,4.08,["fall","winter"],["oud","spicy","amber","floral"],"Blue heritage. Saffron and oud. Traditional Arabic."),
m("Lattafa","Ramz Platinum EDP","unisex",2022,4.05,["fall","winter"],["oud","rose","amber","sweet"],"Platinum symbol. Saffron and rose oud. Arabic prestige."),
m("Lattafa","Yara EDP","female",2021,4.05,["spring","fall"],["floral","fruity","sweet","musk"],"Sweet tropical femininity. Lychee and rose. Accessible luxury."),
m("Lattafa","Milan Rosso EDP","female",2021,4.12,["spring","fall"],["floral","fruity","sweet","rose"],"Milan red. Raspberry and rose. Italian-inspired Eastern."),
// Dossier extended
m("Dossier","Citrus Yuzu EDP","unisex",2022,3.72,["spring","summer"],["citrus","fresh","floral","musk"],"Citrus yuzu. Fresh and luminous. Accessible niche."),
m("Dossier","Floral Rose EDP","female",2021,3.75,["spring","fall"],["rose","floral","fresh","musk"],"Floral rose. Clean rose. Accessible inspiration."),
m("Dossier","Ambery Pistachio EDP","unisex",2022,3.82,["fall","winter"],["vanilla","sweet","nutty","amber"],"Pistachio amber. Cardamom and vanilla. Sweet accessible."),
m("Dossier","Powdery Musk EDP","unisex",2020,3.72,["spring","fall"],["musk","powdery","iris","floral"],"Powdery musk. Iris and clean musk. Affordable niche."),
// Kayali extended
m("Kayali","Eden Juicy Apple 01 EDP","female",2022,3.95,["spring","summer"],["fruity","floral","fresh","musk"],"Juicy apple Eden. Green apple and jasmine. Fresh luxury."),
m("Kayali","Invite Only Amber 23 EDP","unisex",2023,4.08,["fall","winter"],["amber","vanilla","sweet","floral"],"Amber invitation. Cardamom and vanilla amber. Exclusive warmth."),
m("Kayali","Candy 23 EDP","female",2022,3.95,["spring","fall"],["sweet","fruity","vanilla","musk"],"Candy 23. Pear and musk. Sweet luxury."),
m("Kayali","Flora 33 EDP","female",2023,3.92,["spring","summer"],["floral","fresh","musk","citrus"],"Flora 33. White flowers and musk. Garden luxury."),
// Phlur
m("Phlur","Missing Person EDP","unisex",2021,4.12,["spring","fall"],["musk","floral","woody","clean"],"Missing person. Clean musk. Viral luxury."),
m("Phlur","Hanami EDP","female",2019,3.92,["spring","summer"],["floral","cherry","fresh","musk"],"Hanami blooming. Cherry blossom and musk. Spring viral."),
// Boy Smells
m("Boy Smells","Cashmere Kush EDP","unisex",2017,3.92,["fall","winter"],["musk","woody","sweet","vanilla"],"Cashmere kush. Soft musk and woods. Gender-free luxury."),
m("Boy Smells","Cedar Stack EDP","unisex",2019,3.82,["fall","winter"],["cedar","woody","smoky","earthy"],"Cedar stack. Clean wood. Minimal luxury."),
// Henry Rose
m("Henry Rose","The One That Got Away EDP","unisex",2020,3.95,["spring","fall"],["floral","musk","woody","clean"],"Transparent fragrance. Clean musk. Sustainable luxury."),
m("Henry Rose","Torn EDP","unisex",2020,3.88,["fall","winter"],["amber","musk","woody","spicy"],"Torn between. Woody amber. Ethical luxury."),
// Commodity extended
m("Commodity","Paper EDP","unisex",2015,3.72,["spring","fall"],["musk","clean","woody","fresh"],"Paper. Clean and neutral. Minimalist luxury."),
// D.S. & Durga extended
m("D.S. & Durga","Mississippi Medicine EDP","unisex",2012,3.88,["fall","winter"],["herbal","woody","earthy","smoky"],"Delta medicine. Campfire and herbs. American folk."),
m("D.S. & Durga","Cowboy Grass EDP","unisex",2015,3.82,["spring","fall"],["green","herbal","woody","fresh"],"Cowboy grass. Prairie and vetiver. American West."),
// Abel extended
m("Abel","Cobalt Amber EDP","unisex",2015,3.95,["fall","winter"],["amber","spicy","woody","resinous"],"Sustainable amber. Black pepper and labdanum. Ethical."),
m("Abel","Wild Flower EDP","unisex",2014,3.88,["spring","summer"],["floral","woody","fresh","aromatic"],"Wild meadow. Ylang-ylang and geranium. Natural free."),
m("Abel","Green Cedar EDP","unisex",2016,3.85,["spring","fall"],["woody","green","fresh","citrus"],"Green cedar. Sustainable cedarwood. Natural luxury."),
m("Abel","Pink Moon EDP","female",2018,3.80,["spring","fall"],["floral","musk","fresh","sweet"],"Pink moon. White musk and rose. Ethical femininity."),
// Imaginary Authors extended
m("Imaginary Authors","The Isle of Sky EDP","unisex",2014,3.88,["spring","fall"],["green","floral","woody","fresh"],"Isle of sky. Island botanicals. Scottish adventure."),
// Zoologist extended
m("Zoologist Perfumes","Moth EDP","unisex",2017,3.95,["fall","winter"],["incense","balsamic","resinous","amber"],"Moth attraction. Myrrh and frankincense. Night ritual."),
m("Zoologist Perfumes","Dodo EDP","unisex",2016,3.88,["spring","fall"],["tropical","floral","coconut","sweet"],"Extinct paradise. Tiare and coconut. Lost Eden."),
// Memo Paris extended
m("Memo Paris","Wild Geranium EDP","female",2015,3.95,["spring","fall"],["floral","rose","fresh","woody"],"Wild geranium. Rose and jasmine. Natural vibrant."),
m("Memo Paris","Inle EDP","unisex",2013,4.08,["spring","fall"],["tea","floral","woody","fresh"],"Inle Lake. Tea and jasmine. Burmese serenity."),
// Parfums de Nicolaï extended
m("Parfums de Nicolaï","Maharadjah EDP","unisex",2004,3.92,["fall","winter"],["oriental","spicy","rose","amber"],"Maharajah luxury. Saffron and rose. Indian opulence."),
m("Parfums de Nicolaï","Ambre Kashmir EDP","unisex",2013,4.05,["fall","winter"],["amber","balsamic","sweet","oriental"],"Kashmir amber. Benzoin and rose. Rich oriental."),
// Comptoir Sud Pacifique extended
m("Comptoir Sud Pacifique","Vanille Abricot EDP","female",1998,3.88,["spring","summer"],["vanilla","fruity","creamy","sweet"],"Pacific vanilla. Apricot and coconut. Tropical sweet dream."),
m("Comptoir Sud Pacifique","Tiare Soleil EDT","female",2009,3.75,["spring","summer"],["tropical","floral","coconut","fresh"],"Tahitian sun. Tiare and coconut. Island paradise."),
m("Comptoir Sud Pacifique","Amour de Cacao EDP","unisex",2005,3.88,["fall","winter"],["gourmand","chocolate","coffee","sweet"],"Love of chocolate. Coffee and vanilla. Indulgent."),
// Histoires de Parfums extended
m("Histoires de Parfums","1740 EDP","male",2011,4.08,["fall","winter"],["leather","spicy","amber","woody"],"1740 Marquis de Sade. Dark leather and spices. Scandalous."),
m("Histoires de Parfums","1828 EDP","male",2011,3.98,["spring","fall"],["fresh","tea","citrus","woody"],"Jules Verne 1828. Green tea and bamboo. Adventurous."),
m("Histoires de Parfums","1873 EDP","female",2011,3.92,["spring","fall"],["floral","iris","green","powdery"],"Colette 1873. Violet and iris. Literary femininity."),
// The Different Company
m("The Different Company","Rose Poivree EDP","unisex",2000,4.12,["spring","fall"],["rose","spicy","floral","woody"],"Peppered rose. Pink pepper and rose. French niche."),
m("The Different Company","Oriental Lounge EDP","unisex",2004,4.05,["fall","winter"],["oud","floral","spicy","amber"],"Oriental lounge. Cardamom and orris. Sophisticated."),
// Liquides Imaginaires
m("Liquides Imaginaires","Peau de Bête EDP","unisex",2012,4.15,["fall","winter"],["leather","animalic","musk","amber"],"Beast skin. Raw leather and musk. Provocatively primal."),
m("Liquides Imaginaires","Blanche Bête EDP","unisex",2013,4.08,["spring","fall"],["musk","white floral","powdery","clean"],"White beast. Clean musk and white flowers. Pure refined."),
// Profumum Roma
m("Profumum Roma","Acqua di Sale EDP","unisex",2001,4.22,["spring","summer"],["aquatic","marine","fresh","musk"],"Sea salt luxury. Roman maritime spirit. Ocean in bottle."),
m("Profumum Roma","Ambra Aurea EDP","unisex",2001,4.28,["fall","winter"],["amber","sweet","musky","vanilla"],"Golden amber. Pure ambergris. Ancient luxury material."),
m("Profumum Roma","Dolce Acqua EDP","unisex",2009,3.98,["spring","summer"],["citrus","white floral","fresh","musk"],"Sweet water. Neroli and white flowers. Italian freshness."),
// Etro
m("Etro","Heliotrope EDP","unisex",2004,3.92,["spring","fall"],["floral","powdery","sweet","almond"],"Heliotrope and almond. Powdery and comforting. Intellectual niche."),
m("Etro","Shaal Nur EDP","unisex",2004,4.05,["fall","winter"],["oud","rose","amber","spicy"],"Kashmir luxury. Saffron and rose oud. Indian luxury."),
m("Etro","Messe de Minuit EDP","unisex",2000,3.98,["fall","winter"],["incense","amber","resinous","balsamic"],"Midnight mass. Incense and myrrh. Sacred contemplative."),
// Ex Nihilo
m("Ex Nihilo","Fleur Narcotique EDP","unisex",2013,4.22,["spring","fall"],["white floral","floral","spicy","creamy"],"Narcotic flowers. Tuberose and jasmine. Addictive luxury."),
m("Ex Nihilo","Lust in Paradise EDP","unisex",2016,4.18,["spring","summer"],["tropical","floral","coconut","sweet"],"Paradise lust. Tiare and coconut. Tropical luxury."),
// Goldfield Banks extended
m("Goldfield & Banks","White Sandalwood EDP","unisex",2016,4.18,["spring","fall"],["woody","iris","floral","musk"],"Australian white sandalwood. Iris and jasmine. Southern Cross."),
];

const existing=JSON.parse(readFileSync(DATA,"utf-8"));
console.log(`Mevcut: ${existing.length}`);
const seen=new Map(existing.map(p=>[`${p.brand}|${p.name}`.toLowerCase().trim(),true]));
let added=0;const merged=[...existing];
for(const p of N){
  const key=`${p.brand}|${p.name}`.toLowerCase().trim();
  if(!seen.has(key)){seen.set(key,true);merged.push(p);added++;}
}
merged.forEach((p,i)=>{p.id=String(i+1);});
writeFileSync(DATA,JSON.stringify(merged,null,2),"utf-8");
console.log(`Eklenen: ${added}`);
console.log(`Toplam: ${merged.length}`);
