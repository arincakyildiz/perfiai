import{readFileSync,writeFileSync}from"fs";import{join,dirname}from"path";import{fileURLToPath}from"url";
const __dirname=dirname(fileURLToPath(import.meta.url));const DATA=join(__dirname,"../data/perfumes.json");
const AM={"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","woody":"odunsu","floral":"çiçeksi","sweet":"tatlı","fruity":"meyveli","rose":"gül","vanilla":"vanilya","oud":"oud","musk":"misk","leather":"deri","tobacco":"tütün","incense":"tütsü","powdery":"pudralı","gourmand":"gurme","aquatic":"deniz","oriental":"oryantal","iris":"iris","patchouli":"paçuli","smoky":"dumanlı","green":"yeşil","honey":"bal","balsamic":"balsam","tea":"çay","herbal":"bitkisel","chypre":"chypre","fougere":"fougère","lavender":"lavanta","white floral":"beyaz çiçek","animalic":"hayvani","sandalwood":"sandal ağacı","vetiver":"vetiver","cedar":"sedir","creamy":"kremsi","jasmine":"yasemin","aldehydic":"aldehydik","coconut":"hindistancevizi","rum":"rom","cherry":"kiraz","almond":"badem","marine":"deniz","suede":"süet","resinous":"reçineli","mossy":"yosunlu","musky":"misk","tropical":"tropik"};
const GT={male:"erkeklere özel",female:"kadınlara özel",unisex:"uniseks"};
const ST={spring:"ilkbahar",summer:"yaz",fall:"sonbahar",winter:"kış"};
function gtr(p){const ac=(p.accords||[]).slice(0,3).map(a=>AM[a.toLowerCase()]||a);const g=GT[p.gender]||"herkes için";const ss=p.season||[];const pts=[];if(ac.length)pts.push(`${ac.join(", ")} notalarıyla öne çıkan, ${g} bir parfüm.`);else pts.push(`${g.charAt(0).toUpperCase()+g.slice(1)} için özel bir koku.`);if(ss.length===4)pts.push("Dört mevsim kullanılabilir.");else if(ss.length)pts.push(`${ss.map(s=>ST[s]||s).join(" ve ")} ayları için ideal.`);return pts.join(" ");}
function m(brand,name,g,y,r,ss,acc,desc){const p={brand,name,notes:{top:[],middle:[],base:[]},accords:acc,longevity:"long",sillage:"moderate",season:ss,gender:g,rating:r,short_description:desc,year:y,image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${10000+Math.abs(brand.charCodeAt(0)*name.charCodeAt(0)*29+y*503)%58000}.jpg`};p.short_description_tr=gtr(p);return p;}

const N=[
m("Dior","Escale a Portofino EDT","female",2012,3.82,["spring","summer"],["citrus","floral","fresh","musk"],"Portofino escape. Lemon and jasmine. Mediterranean luxury."),
m("Chanel","Chance Eau Vive Intense EDP","female",2022,3.88,["spring","fall"],["citrus","floral","fresh","iris"],"Vive intense. Most concentrated Vive. Brilliant joy."),
m("Tom Ford","Costa Azzurra EDP","unisex",2021,4.05,["spring","summer"],["aquatic","woody","citrus","fresh"],"Azure coast. Cypress and mastic. Mediterranean elegance."),
m("Guerlain","Terracotta EDP","female",2020,3.88,["spring","summer"],["floral","fresh","musk","woody"],"Sun-kissed skin. Orange blossom. Mediterranean warmth."),
m("Hermès","Eloge du Calme EDT","unisex",2021,3.88,["spring","fall"],["aromatic","green","woody","fresh"],"Praise of calm. Vetiver and green. Serene luxury."),
m("YSL","Nuit de L'Homme Blue Electrique","male",2016,4.02,["fall","winter"],["aromatic","woody","fresh spicy","citrus"],"Electric blue night. Grapefruit and cedar. Seduction."),
m("Giorgio Armani","Terra Di Gio EDP","male",2021,4.08,["spring","fall"],["woody","fresh","aromatic","citrus"],"Sicilian earth. Bergamot and sage. Modern Mediterranean."),
m("Valentino","Donna Born in Roma Coral Fantasy","female",2022,3.88,["spring","summer"],["floral","citrus","fresh","musk"],"Coral fantasy. Coral rose and citrus. Roman summer."),
m("Carolina Herrera","Good Girl Rose Gold EDP","female",2019,3.85,["spring","fall"],["floral","rose","sweet","musk"],"Rose gold girl. Rose and jasmine. Golden luxury edition."),
m("Montblanc","Explorer Ultra Blue EDP","male",2021,3.88,["spring","fall"],["aquatic","fresh","woody","aromatic"],"Ultra blue. Marine and vetiver. Deep exploration."),
m("Armaf","Club de Nuit Sillage EDP","unisex",2019,4.02,["spring","fall"],["floral","fruity","woody","musk"],"Club sillage. Pineapple and musk. Fresh accessible niche."),
m("Lattafa","Velvet Rose EDP","female",2022,4.08,["spring","fall"],["rose","floral","fruity","sweet"],"Velvet rose. Pink pepper and lychee. Silky luxury."),
m("Lattafa","Oud Mood EDP","unisex",2020,4.15,["fall","winter"],["oud","amber","floral","sweet"],"Oud mood. Saffron and rose oud. Deep opulent."),
m("Rasasi","Hawas for Her EDP","female",2021,3.98,["spring","fall"],["floral","fruity","sweet","musk"],"Hawas her. Fruity floral. Feminine desire Arabic."),
m("Al Haramain","Signature Gold EDP","unisex",2020,4.08,["fall","winter"],["oud","floral","amber","sweet"],"Golden signature. Saffron and oud rose. Heritage."),
m("Zimaya","Oud for Glory EDP","unisex",2022,4.12,["fall","winter"],["oud","spicy","amber","sweet"],"Oud glory. Saffron and rose oud. Arabian crown."),
m("Maison Alhambra","Amber Elixir EDP","female",2019,4.08,["fall","winter"],["amber","floral","sweet","vanilla"],"Amber elixir. Peach and jasmine. Opulent Eastern."),
m("Paris Corner","Hawas Blue EDP","male",2022,3.88,["fall","winter"],["oud","citrus","spicy","amber"],"Blue desire. Oud and bergamot. Arabic masculine."),
m("Afnan","Turathi Gold EDP","unisex",2021,4.05,["fall","winter"],["oud","amber","sweet","spicy"],"Gold heritage. Saffron and oud. Traditional Arabic."),
m("Dossier","Spicy Cedarwood EDP","unisex",2021,3.75,["fall","winter"],["woody","spicy","amber","aromatic"],"Spicy cedarwood. Cedar and black pepper. Accessible niche."),
m("Kayali","Eden White Pear Cactus EDP","female",2023,3.98,["spring","summer"],["floral","fruity","musk","fresh"],"Eden cactus. White pear and cactus. Desert luxury."),
m("Boy Smells","Cedar Stack EDP","unisex",2019,3.82,["fall","winter"],["cedar","woody","smoky","earthy"],"Cedar stack. Clean wood. Minimal artisan luxury."),
m("Abel","Green Cedar EDP","unisex",2016,3.85,["spring","fall"],["woody","green","fresh","citrus"],"Green cedar sustainable. Natural cedarwood luxury."),
m("D.S. & Durga","Mississippi Medicine EDP","unisex",2012,3.88,["fall","winter"],["herbal","woody","earthy","smoky"],"Delta medicine. Campfire and herbs. American folk."),
m("Commodity","Bergamot EDP","unisex",2015,3.92,["spring","summer"],["citrus","fresh","woody","musk"],"Pure bergamot. Tea and musk. Minimal modern luxury."),
m("Fragrance Du Bois","Neroli Oud EDP","unisex",2016,4.18,["spring","fall"],["oud","floral","citrus","amber"],"Neroli and oud. Cardamom and jasmine. Sustainable."),
m("Stephane Humbert Lucas","Mortal Skin EDP","unisex",2017,4.22,["fall","winter"],["leather","tobacco","oud","spicy"],"Skin and death. Tobacco and leather. Niche power."),
m("Malin+Goetz","Cannabis EDP","unisex",2014,3.82,["fall","winter"],["herbal","woody","earthy","musk"],"Cannabis EDP. Herbal and woody. Brooklyn artisan."),
m("Histoires de Parfums","1828 Jules Verne EDP","male",2011,3.98,["spring","fall"],["fresh","tea","citrus","woody"],"Jules Verne 1828. Green tea and bamboo. Adventure."),
m("Parfums de Nicolaï","Ambre Kashmir EDP","unisex",2013,4.05,["fall","winter"],["amber","balsamic","sweet","oriental"],"Kashmir amber. Benzoin and rose. Rich oriental."),
m("Comptoir Sud Pacifique","Vanille Coco EDP","female",2018,3.72,["spring","summer"],["vanilla","coconut","floral","sweet"],"Coconut vanilla. Tropical warmth. Pacific luxury."),
m("Reminiscence","Vanille EDP","unisex",1993,3.75,["fall","winter"],["vanilla","sweet","floral","musk"],"Pure vanilla. Jasmine and warmth. Simple comfort."),
m("Lolita Lempicka","Mon Premier EDP","female",2007,3.72,["spring","fall"],["floral","sweet","gourmand","iris"],"Mon premier. Violet and anise. First Lolita memory."),
m("Zoologist Perfumes","Bee EDP","unisex",2014,4.12,["spring","summer"],["honey","floral","sweet","beeswax"],"Into the hive. Honey and pollen. Natural artisan."),
m("CLEAN Beauty","Reserve Rain EDP","unisex",2015,3.75,["spring","summer"],["aquatic","fresh","musk","clean"],"Clean rain. Aquatic and musk. Transparent freshness."),
m("Imaginary Authors","Isle of Sky EDP","unisex",2014,3.88,["spring","fall"],["green","floral","woody","fresh"],"Isle of sky. Island botanicals. Scottish adventure."),
m("Etro","Messe de Minuit EDP","unisex",2000,3.98,["fall","winter"],["incense","amber","resinous","balsamic"],"Midnight mass. Incense and myrrh. Sacred ritual."),
m("Ex Nihilo","Fleur Narcotique EDP","unisex",2013,4.22,["spring","fall"],["white floral","floral","spicy","creamy"],"Narcotic flowers. Tuberose and jasmine. Addictive."),
m("Profumum Roma","Acqua di Sale EDP","unisex",2001,4.22,["spring","summer"],["aquatic","marine","fresh","musk"],"Sea salt luxury. Roman maritime. Ocean in a bottle."),
m("Liquides Imaginaires","Peau de Bete EDP","unisex",2012,4.15,["fall","winter"],["leather","animalic","musk","amber"],"Beast skin. Raw leather and musk. Provocative."),
m("The Different Company","Rose Poivree EDP","unisex",2000,4.12,["spring","fall"],["rose","spicy","floral","woody"],"Peppered rose. Pink pepper and rose. French niche."),
m("Comptoir Sud Pacifique","Tiare Soleil EDT","female",2009,3.75,["spring","summer"],["tropical","floral","coconut","fresh"],"Tahitian sun. Tiare and coconut. Island paradise."),
m("L'Occitane","Verbena EDT","unisex",2002,3.68,["spring","summer"],["citrus","herbal","fresh","green"],"Provence verbena. Lemon verbena and mint. Summer herb."),
m("Yardley","English Lavender EDT","unisex",1874,3.65,["spring","summer"],["lavender","aromatic","fresh","woody"],"Since 1874. Pure English lavender. Heritage simplicity."),
m("The Body Shop","White Musk Aqua EDT","female",2012,3.68,["spring","summer"],["musk","aquatic","fresh","floral"],"White musk aqua. Sea and musk. Fresh accessible."),
m("Bath & Body Works","Twilight Woods EDP","female",2008,3.62,["fall","winter"],["woody","amber","sweet","floral"],"Twilight woods EDP. Amber and sandalwood. Cozy."),
m("Victoria's Secret","Bare EDP","unisex",2022,3.72,["spring","fall"],["musk","clean","floral","fresh"],"Bare skin. Natural musk. Transparent luxury."),
m("Mariah Carey","Forever EDP","female",2009,3.58,["spring","fall"],["floral","fruity","sweet","musk"],"Mariah forever. Rose and musk. Vocal luxury."),
m("Antonio Banderas","The Secret EDT","male",2010,3.60,["spring","fall"],["fresh","woody","spicy","citrus"],"The secret. Bergamot and cardamom. Latin mystery."),
m("Escada","Born in Paradise EDT","female",2012,3.62,["spring","summer"],["tropical","fruity","floral","citrus"],"Born in paradise. Tropical and fresh. Caribbean joy."),
m("Escada","Agua del Sol EDT","female",2013,3.60,["spring","summer"],["citrus","fruity","floral","aquatic"],"Water of sun. Citrus and mimosa. Mediterranean."),
m("Roger Gallet","Gingembre Rouge EDF","unisex",2013,3.62,["spring","summer"],["spicy","citrus","herbal","fresh"],"Ginger rouge. Spiced citrus. Invigorating freshness."),
m("Elizabeth Arden","Splendor EDP","female",1998,3.72,["spring","summer"],["floral","fresh","aldehydic","woody"],"Splendid bright. Peony and iris. Classic feminine."),
m("Donna Karan","Gold EDP","female",2006,3.75,["fall","winter"],["floral","sweet","oriental","amber"],"DKNY gold. Rich and warm. New York luxury."),
m("Naomi Campbell","Naomi Campbell EDP","female",2000,3.55,["spring","fall"],["floral","fruity","musk","sweet"],"Supermodel. Berry and jasmine. Catwalk luxury."),
m("Justin Bieber","Collector EDP","male",2013,3.55,["spring","fall"],["fresh","floral","woody","musk"],"Collector Bieber. Fresh and young. Teen luxury."),
m("Beyoncé","Rise EDP","female",2014,3.65,["spring","fall"],["floral","fruity","fresh","musk"],"Rise queen. Freesia and musk. Empowerment."),
m("Taylor Swift","Glitter Wonderstruck EDT","female",2012,3.62,["spring","fall"],["floral","fruity","sweet","musk"],"Glitter wonder. Hibiscus and musk. Sparkle."),
m("One Direction","That Moment EDP","female",2013,3.55,["spring","fall"],["floral","fruity","fresh","musk"],"That moment. Strawberry and jasmine. Pop band."),
m("Paris Hilton","Heiress EDP","female",2006,3.55,["spring","fall"],["floral","fruity","sweet","musk"],"Heiress. Sparkling apple and honeysuckle. Socialite."),
m("Halle Berry","Halle EDP","female",2009,3.58,["spring","fall"],["floral","fruity","sweet","musk"],"Halle. Berry and rose. Actress luxury."),
m("Sean John","Unforgivable EDP","male",2005,3.72,["fall","winter"],["fresh","woody","spicy","musk"],"Unforgivable. Cardamom and leather. Sean luxury."),
m("Sarah Jessica Parker","SJP Stash EDP","unisex",2015,3.68,["fall","winter"],["woody","amber","tobacco","spicy"],"SJP stash. Tobacco and cedar. Private collection."),
m("Revlon","Unforgettable EDP","female",2002,3.50,["spring","fall"],["floral","fruity","fresh","musk"],"Unforgettable. Rose and apple. Classic accessible."),
m("Avon","Incandessence EDP","female",2004,3.58,["spring","fall"],["floral","fruity","sweet","musk"],"Incandescent glow. Peony and apple. Warm luminosity."),
m("Bath & Body Works","Moonlight Path EDC","female",1995,3.55,["spring","fall"],["floral","musk","clean","fresh"],"Moonlit path. Soft musk and flowers. Clean classic."),
m("Victoria's Secret","Bombshell Gold EDP","female",2018,3.72,["fall","winter"],["floral","fruity","sweet","amber"],"Bombshell gold. Rich and warm. Golden confidence."),
m("Victoria's Secret","Bombshell Paris EDP","female",2019,3.70,["spring","fall"],["floral","fruity","fresh","musk"],"Bombshell Paris. French romance. European confidence."),
m("Elizabeth Arden","Sunflowers Sunrise EDT","female",2013,3.58,["spring","summer"],["floral","fruity","fresh","citrus"],"Sunflowers sunrise. Morning flowers. Accessible beauty."),
m("Estée Lauder","Beautiful Sheer EDP","female",2001,3.72,["spring","summer"],["floral","fresh","sheer","musk"],"Beautiful sheer. Lighter Beautiful. Daytime version."),
m("Donna Karan","Chaos EDP","female",1996,3.68,["fall","winter"],["oriental","spicy","amber","woody"],"Chaos. Cardamom and vetiver. Bold 90s style."),
m("Mariah Carey","Lollipop Bling EDP","female",2008,3.55,["spring","summer"],["fruity","floral","sweet","musk"],"Lollipop bling. Cherry and vanilla. Sweet pop."),
m("Ed Hardy","Born Wild EDP","female",2011,3.55,["spring","fall"],["floral","fruity","sweet","musk"],"Born wild. Strawberry and jasmine. Tattoo art."),
m("One Direction","You and I EDP","female",2014,3.55,["spring","fall"],["floral","fruity","fresh","musk"],"You and I. Mandarin and peach. Pop band feminine."),
m("Gap","So Pink EDT","female",2012,3.48,["spring","summer"],["floral","fruity","fresh","musk"],"So pink. Light and playful. Casual freshness."),
m("American Eagle","Fierce EDP","male",2009,3.60,["spring","summer"],["fresh","musk","woody","citrus"],"AE Fierce. American spirit. Fresh and casual."),
m("Bench","Body for Women EDT","female",2009,3.48,["spring","summer"],["floral","fresh","fruity","musk"],"Bench women. Fresh floral. Everyday accessible."),
m("Replay","Stone for Her EDT","female",2009,3.50,["spring","summer"],["floral","fresh","fruity","musk"],"Stone her. Accessible and light. Casual fresh."),
m("Jay-Z","Gold EDP","male",2013,3.55,["fall","winter"],["fresh","citrus","woody","amber"],"Jay-Z gold. Accessible luxury. Hip-hop icon."),
m("Usher","She EDP","female",2007,3.52,["spring","fall"],["floral","fruity","sweet","musk"],"Usher she. Berry and jasmine. R&B feminine."),
m("50 Cent","Power EDP","male",2010,3.45,["fall","winter"],["woody","amber","spicy","citrus"],"Power. Bold accessible. Hip-hop masculine."),
m("Nicki Minaj","Minajesty EDP","female",2013,3.62,["spring","fall"],["fruity","floral","sweet","musk"],"Minajesty. Pink and sweet. Rap queen."),
m("Selena Gomez","Rare EDP","female",2022,3.68,["spring","fall"],["floral","fruity","vanilla","musk"],"Rare. Peach and jasmine. Pop princess luxury."),
m("Kylie Jenner","Kylie EDP","female",2016,3.65,["spring","fall"],["floral","fruity","vanilla","musk"],"Kylie. Rose and vanilla. Lip kit brand scent."),
m("Kim Kardashian","KKW Body EDP","female",2019,3.68,["spring","fall"],["musk","floral","woody","fresh"],"KKW body. White musk and orange. Confidence."),
m("Jennifer Aniston","Lolavie EDP","female",2011,3.65,["spring","summer"],["floral","fruity","fresh","musk"],"Lolavie. Bergamot and rose. Hollywood fresh."),
m("Nike","Sport for Her EDT","female",2010,3.45,["spring","summer"],["fresh","floral","citrus","musk"],"Nike sport her. Athletic feminine. Just do it."),
m("Puma","Blue Generation EDT","male",2009,3.48,["spring","summer"],["aquatic","fresh","citrus","musk"],"Blue generation. Sea and citrus. Sport fresh."),
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
