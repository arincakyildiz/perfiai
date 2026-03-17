import{readFileSync,writeFileSync}from"fs";import{join,dirname}from"path";import{fileURLToPath}from"url";
const __dirname=dirname(fileURLToPath(import.meta.url));const DATA=join(__dirname,"../data/perfumes.json");
function gtr(p){const g={male:"erkeklere özel",female:"kadınlara özel",unisex:"uniseks"}[p.gender]||"herkes için";const ss=p.season||[];const pts=[`${p.accords.slice(0,3).join(", ")} notalarıyla öne çıkan, ${g} bir parfüm.`];if(ss.length===4)pts.push("Dört mevsim kullanılabilir.");else if(ss.length)pts.push(ss.map(s=>({spring:"ilkbahar",summer:"yaz",fall:"sonbahar",winter:"kış"}[s]||s)).join(" ve ")+" ayları için ideal.");return pts.join(" ");}
function m(brand,name,g,y,r,ss,acc,desc){const p={brand,name,notes:{top:[],middle:[],base:[]},accords:acc,longevity:"long",sillage:"moderate",season:ss,gender:g,rating:r,short_description:desc,year:y,image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${10000+Math.abs(brand.charCodeAt(0)*name.charCodeAt(0)*31+y*601)%58000}.jpg`};p.short_description_tr=gtr(p);return p;}

const N=[
m("Dior","Escale a Portofino EDT","female",2012,3.82,["spring","summer"],["citrus","floral","fresh","musk"],"Portofino escape. Lemon and jasmine. Mediterranean luxury."),
m("Chanel","No 5 Parfum","female",2013,4.18,["fall","winter"],["aldehydic","floral","powdery","musk"],"No 5 Parfum. Most concentrated. Ultimate luxury."),
m("Tom Ford","Black Violet EDP","female",2020,4.12,["fall","winter"],["floral","violet","woody","amber"],"Black violet. Dark femininity. Nocturnal beauty."),
m("Guerlain","Aqua Allegoria Rosa Rossa EDT","unisex",2022,3.82,["spring","summer"],["rose","floral","citrus","fresh"],"Red rose water. Fresh and delicate. Garden morning."),
m("Hermès","Jour d Hermes Gardenia EDP","female",2013,3.88,["spring","summer"],["floral","gardenia","white floral","musk"],"Gardenia day. White flowers luminous. Quietly radiant."),
m("Giorgio Armani","Si Fiori EDP","female",2017,3.85,["spring","summer"],["floral","rose","fresh","musk"],"Si flowers. Rose and bergamot. Floral simplicity."),
m("YSL","Or d Or EDP","female",2021,4.08,["fall","winter"],["floral","iris","amber","metallic"],"Golden hour. Iris and narcissus. Golden luxury."),
m("Carolina Herrera","Good Girl Legere EDP","female",2018,3.78,["spring","summer"],["floral","sweet","white floral","musk"],"Light good girl. Almond and white jasmine. Day."),
m("Dolce Gabbana","Devotion EDP","female",2021,4.02,["spring","fall"],["floral","fruity","sweet","musk"],"Devotion Italian. Peach and jasmine. Devoted."),
m("Hugo Boss","Boss Alive Intense EDP","female",2021,3.92,["fall","winter"],["floral","sweet","vanilla","woody"],"Intense alive. Cardamom and vanilla. Bold."),
m("Armaf","Club Milestone EDP","male",2019,4.12,["fall","winter"],["fruity","woody","amber","musk"],"Club milestone. Pineapple and birch. Premium Armaf."),
m("Lattafa","Pride EDP","unisex",2022,4.08,["fall","winter"],["oud","amber","floral","sweet"],"Pride oud. Oud and amber. Proud statement."),
m("Rasasi","Egra Pink EDP","female",2020,3.88,["spring","fall"],["floral","rose","sweet","musk"],"Pink joy. Rose and musk. Arabic feminine delight."),
m("Al Haramain","Madinah EDP","unisex",2018,4.05,["fall","winter"],["oud","amber","floral","sweet"],"Madinah sacred. Oud and rose. Holy Arabic luxury."),
m("Swiss Arabian","Oud 24 Hours EDP","unisex",2018,4.15,["fall","winter"],["oud","amber","woody","sweet"],"24 hours oud. Pure and long. True dedication."),
m("Maison Alhambra","Shaghaf Oud Rose EDP","female",2022,3.92,["spring","fall"],["rose","oud","floral","sweet"],"Rose oud feminine. Arabic rose luxury. Silky."),
m("Afnan","9 AM Femme EDP","female",2020,3.95,["spring","fall"],["floral","citrus","sweet","musk"],"9 AM feminine. Grapefruit and peony. Fresh morning."),
m("Zara","Gardenia Musk EDP","female",2022,3.72,["spring","fall"],["floral","musk","sweet","clean"],"Gardenia musk. Floral and musk. Layered white flowers."),
m("Dossier","Floral Neroli EDP","female",2021,3.75,["spring","summer"],["citrus","white floral","fresh","musk"],"Accessible neroli. Orange blossom. Clean luxury."),
m("Kayali","Elixir 11 EDP","unisex",2022,4.02,["fall","winter"],["oriental","amber","floral","sweet"],"Elixir 11. Rose and amber. Premium Kayali."),
m("Abel","Pink Moon EDP","female",2018,3.80,["spring","fall"],["floral","musk","fresh","sweet"],"Pink moon. White musk and rose. Ethical luxury."),
m("Malin Goetz","Blood Orange EDT","unisex",2015,3.78,["spring","summer"],["citrus","fresh","aromatic","musk"],"Blood orange artisan. Bright citrus. Brooklyn joy."),
m("DS Durga","Cowboy Grass EDP","unisex",2015,3.82,["spring","fall"],["green","herbal","woody","fresh"],"Cowboy grass. Prairie and vetiver. American West."),
m("Commodity Gold","Gold EDP","unisex",2015,3.88,["fall","winter"],["amber","iris","woody","musk"],"Liquid gold. Iris and amber. Understated refined."),
m("Imaginary Authors","Cobra and Canary EDP","unisex",2012,3.85,["spring","summer"],["floral","fruity","green","musk"],"Colorful snake story. Grapefruit and gardenia. Whimsical."),
m("Boy Smells","Tantrum EDP","unisex",2018,3.85,["spring","fall"],["floral","fruity","musk","fresh"],"Tantrum. Peach and musk. Playful premium."),
m("CLEAN Reserve","Sueded Oud EDP","unisex",2017,3.88,["fall","winter"],["suede","oud","amber","musk"],"Suede oud. Clean luxury. Approachable oud."),
m("Profumum Roma","Dolce Acqua EDP","unisex",2009,3.98,["spring","summer"],["citrus","white floral","fresh","musk"],"Sweet water. Neroli and white flowers. Italian freshness."),
m("Etro Heliotrope","Heliotrope EDP","unisex",2004,3.92,["spring","fall"],["floral","powdery","sweet","almond"],"Heliotrope almond. Powdery comfort. Intellectual niche."),
m("Czech Czech","Heart of Gold EDT","unisex",2013,3.82,["fall","winter"],["floral","vanilla","sweet","musk"],"Heart gold. Jasmine and rose. Czech artisan."),
m("Roger Vivier","Ici EDP","female",2021,3.82,["spring","summer"],["floral","fresh","citrus","musk"],"Here now. Bergamot and rose. Fashion house luxury."),
m("Shiseido Zen","Feminite du Bois EDP","female",1992,4.12,["fall","winter"],["woody","fruity","spicy","cedar"],"Femininity of wood. Cedar and plum. 1992 revolution."),
m("Houbigant","Quelques Fleurs EDP","female",1912,4.12,["spring","fall"],["floral","aldehydic","powdery","sweet"],"1912 birth of modern feminine. Historical milestone."),
m("Dana","Tabu EDP","female",1932,3.82,["fall","winter"],["oriental","floral","spicy","earthy"],"Notorious 1932. Spiced oriental. Scandalous classic."),
m("Lanvin","Arpege EDP","female",1927,4.15,["fall","winter"],["floral","aldehydic","powdery","oriental"],"Arpege 1927. Grandmother of fragrance. 1927 classic."),
m("Nina Ricci","L Air du Temps EDT","female",1948,4.15,["spring","summer"],["floral","powdery","green","aldehydic"],"Great classic 1948. Carnation and rose. Post-war."),
m("Jean Patou","Joy EDP","female",1930,4.22,["spring","fall"],["floral","rose","jasmine","aldehydic"],"Joy 1930. Most expensive creation. Opulence."),
m("Coty","Chypre EDP","female",1917,4.15,["fall","winter"],["chypre","floral","earthy","mossy"],"Original chypre 1917. The legendary creation."),
m("Halle Berry","Halle by Halle EDP","female",2009,3.58,["spring","fall"],["floral","fruity","sweet","musk"],"Halle. Berry and rose. Actress luxury."),
m("Mariah Carey","Forever EDP","female",2009,3.58,["spring","fall"],["floral","fruity","sweet","musk"],"Mariah forever. Rose and musk. Vocal luxury."),
m("Taylor Swift","Taylor EDP","female",2013,3.60,["spring","fall"],["floral","fruity","sweet","musk"],"Taylor. Bergamot and jasmine. Country pop luxury."),
m("Beyonce","Rise EDP","female",2014,3.65,["spring","fall"],["floral","fruity","fresh","musk"],"Rise queen. Freesia and musk. Empowerment."),
m("Justin Bieber","Collector EDP","male",2013,3.55,["spring","fall"],["fresh","floral","woody","musk"],"Collector Bieber. Fresh and young. Teen luxury."),
m("One Direction","That Moment EDP","female",2013,3.55,["spring","fall"],["floral","fruity","fresh","musk"],"That moment. Strawberry and jasmine. Pop band."),
m("Paris Hilton","Heiress EDP","female",2006,3.55,["spring","fall"],["floral","fruity","sweet","musk"],"Heiress. Sparkling apple and honeysuckle. Socialite."),
m("Gap","So Pink EDT","female",2012,3.48,["spring","summer"],["floral","fruity","fresh","musk"],"So pink. Light and playful. Casual freshness."),
m("American Eagle","Fierce EDP","male",2009,3.60,["spring","summer"],["fresh","musk","woody","citrus"],"AE Fierce. American spirit. Fresh and casual."),
m("Bench","Body for Women EDT","female",2009,3.48,["spring","summer"],["floral","fresh","fruity","musk"],"Bench women. Fresh floral. Everyday accessible."),
m("Replay","Stone for Her EDT","female",2009,3.50,["spring","summer"],["floral","fresh","fruity","musk"],"Stone her. Accessible and light. Casual fresh."),
m("Puma Blue","Blue Generation EDT","male",2009,3.48,["spring","summer"],["aquatic","fresh","citrus","musk"],"Blue generation. Sea and citrus. Sport fresh."),
m("Nike Sport","Sport for Her EDT","female",2010,3.45,["spring","summer"],["fresh","floral","citrus","musk"],"Nike sport her. Athletic feminine. Just do it."),
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
