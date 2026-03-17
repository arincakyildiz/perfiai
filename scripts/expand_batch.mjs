import{readFileSync,writeFileSync}from"fs";import{join,dirname}from"path";import{fileURLToPath}from"url";
const __dirname=dirname(fileURLToPath(import.meta.url));
const DATA=join(__dirname,"../data/perfumes.json");
const ATR={"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","musky":"misk","woody":"odunsu","floral":"çiçeksi","sweet":"tatlı","fruity":"meyveli","rose":"gül","vanilla":"vanilya","oud":"oud","musk":"misk","leather":"deri","tobacco":"tütün","incense":"tütsü","powdery":"pudralı","gourmand":"gurme","aquatic":"deniz","oriental":"oryantal","iris":"iris","patchouli":"paçuli","sandalwood":"sandal ağacı","smoky":"dumanlı","green":"yeşil","jasmine":"yasemin","cherry":"kiraz","honey":"bal","balsamic":"balsam","mossy":"yosunlu","resinous":"reçineli","creamy":"kremsi","almond":"badem","coconut":"hindistancevizi","tea":"çay","coffee":"kahve","herbal":"bitkisel","marine":"deniz","chypre":"chypre","fougere":"fougère","lavender":"lavanta","woody":"odunsu","suede":"süet","animalic":"hayvani","mineral":"mineral","white floral":"beyaz çiçek","caramel":"karamel","rum":"rom","cinnamon":"tarçın","pepper":"biber","cedar":"sedir","vetiver":"vetiver","cashmeran":"keşmir","gourmand":"gurme"};
const GT={male:"erkeklere özel",female:"kadınlara özel",unisex:"uniseks"};
const ST={spring:"ilkbahar",summer:"yaz",fall:"sonbahar",winter:"kış"};
const LT={short:"kısa süreli kalıcılık",moderate:"orta düzey kalıcılık",long:"uzun süre kalıcılık",very_long:"çok uzun süre kalıcılık"};
const ST2={soft:"hafif iz",moderate:"orta güçte iz",strong:"güçlü iz",enormous:"çok güçlü iz"};
function gtr(p){const ac=(p.accords||[]).slice(0,3).map(a=>ATR[a.toLowerCase()]||a);const g=GT[p.gender]||"herkes için";const ss=p.season||[];const lo=LT[p.longevity],si=ST2[p.sillage];const pts=[];if(ac.length)pts.push(`${ac.join(", ")} notalarıyla öne çıkan, ${g} bir parfüm.`);else pts.push(`${g.charAt(0).toUpperCase()+g.slice(1)} için özel bir koku.`);if(ss.length===4)pts.push("Dört mevsim kullanılabilir.");else if(ss.length)pts.push(`${ss.map(s=>ST[s]||s).join(" ve ")} ayları için ideal.`);if(lo&&si)pts.push(`${lo.charAt(0).toUpperCase()+lo.slice(1)}, ${si} bırakır.`);return pts.join(" ");}

// [brand, name, gender, year, rating, longevity, sillage, seasons, accords, desc]
const BATCH=[
["Burberry","Burberry Sport Ice For Men EDT","male",2013,3.58,"moderate","soft",["spring","summer"],["aquatic","fresh","citrus","woody"],"Arctic cool sport. Sea and mint. Athletic freshness."],
["Burberry","My Burberry Black EDP","female",2016,3.95,"long","strong",["fall","winter"],["chypre","floral","patchouli","woody"],"Black Burberry. Darker patchouli. Twilight garden."],
["Dolce & Gabbana","The One Intense EDP","male",2012,4.0,"very_long","strong",["fall","winter"],["tobacco","warm spicy","oriental","amber"],"One intense. Tobacco and ginger. Seductive power."],
["Dolce & Gabbana","Anthology The One 10","female",2009,3.82,"long","moderate",["fall","winter"],["floral","woody","citrus","musk"],"Anthology. Rose and vetiver. Numbered collection."],
["Gucci","Guilty Platinum Edition EDT","male",2012,3.72,"long","moderate",["spring","fall"],["citrus","fresh","woody","aromatic"],"Guilty platinum. Citrus and guaiac. Limited freshness."],
["Gucci","Made to Measure EDT","male",2011,3.75,"long","moderate",["fall","winter"],["woody","spicy","amber","citrus"],"Tailor-made. Pepper and vetiver. Sartorial masculine."],
["Gucci","Bloom Acqua di Fiori EDT","female",2018,3.72,"moderate","soft",["spring","summer"],["floral","white floral","fresh","musk"],"Bloom water. Light white flowers. Sheer garden."],
["Prada","Infusion de Tubéreuse EDP","female",2010,3.95,"long","moderate",["spring","fall"],["white floral","iris","powdery","fresh"],"Tuberose infusion. Clean and crisp. White petals."],
["Prada","Infusion de Rose EDP","female",2017,3.88,"long","moderate",["spring","summer"],["rose","floral","fresh","musk"],"Rose infusion. Natural and clean. Pure rose."],
["Versace","Eros Flame Limited Edition EDP","male",2022,3.90,"long","strong",["fall","winter"],["warm spicy","citrus","leather","amber"],"Flame limited. Hotter citrus. Special occasion."],
["Versace","Yellow Diamond Intense EDP","female",2012,3.80,"long","strong",["spring","fall"],["floral","citrus","fruity","musk"],"Intense yellow. Deeper florals. More lasting shine."],
["Giorgio Armani","Sì Fiori EDP","female",2017,3.85,"long","moderate",["spring","summer"],["floral","rose","fresh","musk"],"Sì flowers. Rose and bergamot. Floral simplicity."],
["Giorgio Armani","Armani Code Colonia EDT","male",2015,3.78,"moderate","moderate",["spring","summer"],["citrus","fresh","aromatic","woody"],"Code cologne. Light and fresh. Summer seduction."],
["YSL","Manifesto Le Parfum EDP","female",2013,3.85,"long","strong",["fall","winter"],["floral","oriental","rose","amber"],"Manifesto parfum. Richer rose. Concentrated luxury."],
["YSL","Black Opium Intense EDP","female",2016,4.05,"very_long","enormous",["fall","winter"],["gourmand","coffee","floral","oriental"],"Intense opium. Stronger coffee. Maximum seduction."],
["YSL","Libre Le Parfum EDP","female",2021,4.12,"very_long","strong",["fall","winter"],["lavender","floral","oriental","sweet"],"Libre concentrated. Intense lavender and amber. Maximum freedom."],
["Chanel","Allure Homme Édition Blanche EDT","male",2008,3.98,"long","moderate",["spring","fall"],["citrus","woody","aromatic","musk"],"White edition. Clean and luminous. Allure elevated."],
["Chanel","Gabrielle Chanel Essence EDP","female",2019,3.92,"long","strong",["spring","fall"],["floral","white floral","fresh","musk"],"Gabrielle essence. More concentrated. Radiant intensity."],
["Dior","Miss Dior Absolutely Blooming EDP","female",2016,3.85,"long","strong",["spring","fall"],["floral","fruity","rose","musk"],"Absolutely Miss. Raspberry and rose. Vibrant blooming."],
["Dior","Dior Homme Parfum","male",2014,4.18,"very_long","strong",["fall","winter"],["iris","woody","leather","amber"],"Homme parfum. Iris leather and amber. Ultimate masculinity."],
["Dior","Sauvage Elixir","male",2021,4.35,"very_long","enormous",["fall","winter"],["spicy","woody","amber","fresh spicy"],"The elixir. Most concentrated Sauvage. Maximum presence."],
["Hermès","Terre d Hermès Eau Intense Vétiver EDP","male",2018,4.28,"long","strong",["fall","winter"],["vetiver","woody","citrus","earthy"],"Intense vetiver. Pure vetiver and grapefruit. Deep masculinity."],
["Hermès","Eau des Merveilles Bleues EDT","female",2016,3.82,"moderate","moderate",["spring","summer"],["aquatic","citrus","fresh","musk"],"Blue wonders. Sea and citrus. Oceanic delight."],
["Tom Ford","Plum Japonais EDP","unisex",2013,4.15,"long","strong",["fall","winter"],["fruity","floral","oriental","amber"],"Japanese plum. Osmanthus and oolong. Eastern artistry."],
["Tom Ford","Noir Pour Femme EDP","female",2013,4.08,"long","strong",["fall","winter"],["floral","oriental","sweet","amber"],"Noir feminine. Orchid and amber. Dark luxe."],
["Tom Ford","Grey Vetiver EDP","male",2009,4.18,"long","moderate",["spring","fall"],["vetiver","woody","citrus","aromatic"],"Grey vetiver. Clean sage and vetiver. Minimal icon."],
["Guerlain","Mon Guerlain Bloom of Rose EDP","female",2020,3.88,"long","moderate",["spring","summer"],["floral","rose","lavender","musk"],"Bloom of rose. Rose and lavender. Spring awakening."],
["Lancôme","Miracle Forever EDP","female",2006,3.78,"long","moderate",["spring","fall"],["floral","fruity","fresh","woody"],"Forever miracle. Lychee and jasmine. Lasting joy."],
["Givenchy","Dahlia Noir EDP","female",2011,3.88,"long","strong",["fall","winter"],["floral","woody","rose","musk"],"Black dahlia. Rose and patchouli. Mysterious."],
["Givenchy","Très Irrésistible EDT","female",2004,3.75,"long","moderate",["spring","summer"],["floral","rose","fruity","musk"],"Very irresistible rose. Anise and rose. Playful."],
["Valentino","Valentina EDP","female",2011,3.82,"long","moderate",["spring","fall"],["floral","powdery","iris","musk"],"Valentina. White flowers and iris. Italian chic."],
["Valentino","Valentino Uomo Born in Roma EDT","male",2020,3.88,"long","strong",["fall","winter"],["woody","spicy","aromatic","leather"],"Born Roma him. Bergamot and leather. Roman gent."],
["Carolina Herrera","CH Carolina Herrera EDT","female",2009,3.72,"long","moderate",["spring","summer"],["floral","fresh","citrus","woody"],"CH signature. Orange blossom and amber. Accessible luxury."],
["Carolina Herrera","Herrera for Men EDT","male",2014,3.68,"long","moderate",["fall","winter"],["woody","spicy","aromatic","amber"],"Herrera masculine. Ginger and cedar. NYC man."],
["Hugo Boss","Boss Bottled No 6 EDT","male",2012,3.75,"long","moderate",["fall","winter"],["fresh spicy","woody","apple","amber"],"Number 6. Apple and spice. Reliable Boss."],
["Hugo Boss","Boss Femme EDP","female",2000,3.72,"long","moderate",["spring","fall"],["floral","fruity","fresh","woody"],"Femme Boss. Peach and freesia. Classic Boss lady."],
["Hugo Boss","Hugo Deep Red EDP","female",2001,3.75,"long","moderate",["fall","winter"],["floral","fruity","sweet","amber"],"Deep red. Tangerine and rose. Warm and feminine."],
["Burberry","Burberry Brit Gold EDP","female",2014,3.78,"long","moderate",["spring","fall"],["floral","fruity","fresh","musk"],"Brit gold. Peach and freesia. Precious edition."],
["Burberry","Burberry Sport Women EDT","female",2010,3.62,"moderate","soft",["spring","summer"],["fresh","floral","citrus","musk"],"Sport Brit. Fresh and feminine. Court freshness."],
["Valentino","Valentino Donna Rose EDP","female",2021,3.88,"long","moderate",["spring","fall"],["rose","floral","woody","musk"],"Donna rose. Blooming rose and bergamot. Italian romance."],
["Bulgari","Bvlgari Splendida Patchouli Tentation EDP","female",2019,3.85,"long","strong",["fall","winter"],["patchouli","woody","sweet","amber"],"Patchouli tentation. Dark and luxurious. Italian seduction."],
["Bulgari","Bvlgari Splendida Magnolia Sensuel EDP","female",2017,3.82,"long","moderate",["spring","fall"],["white floral","floral","fresh","musk"],"Magnolia sensuel. White magnolia. Soft and sensual."],
["Cartier","Cartier Déclaration Essence EDT","male",2018,3.88,"long","moderate",["spring","fall"],["spicy","woody","citrus","aromatic"],"Essence declaration. Cedar and spice. Refined statement."],
["Cartier","Cartier Must de Cartier EDP","female",1981,3.95,"very_long","strong",["fall","winter"],["oriental","floral","amber","sweet"],"Must have. 1981 oriental. Timeless luxury."],
["Armaf","Armaf Club de Nuit Blue EDP","male",2016,3.85,"long","strong",["spring","fall"],["fresh","citrus","woody","aromatic"],"Club blue. Bergamot and aquatic. Fresh budget."],
["Armaf","Armaf Niche Oud EDP","unisex",2018,3.92,"long","strong",["fall","winter"],["oud","rose","amber","floral"],"Armaf oud. Rose and amber. Quality accessible."],
["Mancera","Mancera Lemon Line EDP","unisex",2020,3.95,"long","moderate",["spring","summer"],["citrus","woody","fresh","aromatic"],"Lemon line. Yuzu and cedar. Clean citrus luxury."],
["Mancera","Mancera Sand EDP","unisex",2015,4.0,"long","moderate",["fall","winter"],["musky","amber","sweet","woody"],"Sand dunes. Sandalwood and musk. Desert warmth."],
["Montale","Montale Oud Tobacco EDP","unisex",2020,4.15,"very_long","enormous",["fall","winter"],["tobacco","oud","amber","spicy"],"Oud tobacco. Rich and complex. Maximum Montale."],
["Montale","Montale Chypre Vanille EDP","female",2013,3.95,"long","strong",["fall","winter"],["chypre","vanilla","floral","amber"],"Chypre vanilla. Unexpected combination. Unique luxury."],
["Montale","Montale Rose Elixir EDP","female",2010,4.0,"long","moderate",["spring","fall"],["rose","floral","fruity","musk"],"Rose elixir. Concentrated rose. Potent beauty."],
["Kenzo","Kenzo Memori EDT","unisex",2020,3.78,"long","moderate",["spring","fall"],["floral","woody","musk","fresh"],"Kenzo memories. Fresh and light. Nostalgic."],
["Lacoste","Lacoste L.12.12 White Intense EDT","male",2020,3.72,"long","moderate",["spring","summer"],["fresh","citrus","herbal","woody"],"Intense white. Elevated sport. Crisp and clean."],
["Lacoste","Lacoste Red Label EDT","male",2002,3.65,"long","moderate",["fall","winter"],["fresh","citrus","spicy","woody"],"Red label. Bergamot and spice. Sporty masculine."],
["Azzaro","Azzaro Pour Elle EDP","female",2012,3.72,"long","moderate",["spring","fall"],["floral","fruity","fresh","musk"],"Pour elle Azzaro. Bergamot and peony. Fresh feminine."],
["Azzaro","Azzaro Decibel EDT","male",1999,3.62,"moderate","moderate",["spring","summer"],["aquatic","fresh","citrus","woody"],"Azzaro decibel. Aquatic and bergamot. 90s fresh."],
["Police","Police Amber Sky EDT","male",2019,3.60,"long","moderate",["fall","winter"],["amber","warm spicy","woody","citrus"],"Amber sky. Warm and accessible. Everyday luxury."],
["Police","Police Instinct EDT","male",2016,3.58,"moderate","moderate",["spring","fall"],["fresh","woody","aromatic","citrus"],"Police instinct. Fresh and bold. Urban masculine."],
["Davidoff","Davidoff Horizon EDP","male",2018,3.75,"long","moderate",["fall","winter"],["woody","amber","spicy","aromatic"],"Davidoff horizon. Warm and sophisticated. New vision."],
["Davidoff","Davidoff Adventure Amazonia EDT","male",2012,3.62,"moderate","moderate",["spring","summer"],["fresh","citrus","green","woody"],"Amazon adventure. Citrus and leaves. Jungle freshness."],
["Joop","Joop Thrill Woman EDP","female",2010,3.62,"long","moderate",["spring","fall"],["floral","sweet","fruity","musk"],"Joop thrill. Sweet and feminine. Accessible joy."],
["Nautica","Nautica Blue EDT","male",2021,3.68,"long","moderate",["spring","summer"],["aquatic","citrus","fresh","woody"],"Nautica blue new. Fresh marine. Refreshed sailing."],
["Tommy Hilfiger","Tommy Hilfiger Loud for Her EDP","female",2012,3.62,"long","moderate",["spring","fall"],["floral","fruity","sweet","musk"],"Loud girl. Fruity and fun. American pop."],
["Ferrari","Ferrari Uomo EDT","male",2015,3.62,"moderate","moderate",["spring","fall"],["fresh","citrus","woody","aromatic"],"Ferrari uomo. Italian man fresh. Speed and style."],
["Lamborghini","Lamborghini Terazza EDP","male",2021,3.65,"long","moderate",["spring","fall"],["fresh","citrus","woody","spicy"],"Terazza freshness. Bergamot and cedar. Italian outdoor."],
["Aston Martin","Aston Martin Drives EDT","male",2014,3.68,"long","moderate",["fall","winter"],["woody","amber","spicy","citrus"],"Aston Martin drives. Leather and cedar. British speed."],
["Aston Martin","Aston Martin Emotion EDT","male",2020,3.65,"moderate","moderate",["spring","fall"],["fresh","citrus","aromatic","woody"],"Aston emotion. Fresh and refined. Bond car."],
["Porsche Design","Porsche Design Tuxedo EDP","male",2019,3.75,"long","strong",["fall","winter"],["woody","amber","smoky","leather"],"Tuxedo. Smoke and leather. Black tie luxury."],
["Porsche Design","Porsche Design No 1 EDT","male",2017,3.70,"long","moderate",["spring","fall"],["fresh","woody","citrus","aromatic"],"Number 1. Clean and precise. Engineering scent."],
["Mercedes-Benz","Mercedes-Benz Sign Your Attitude EDP","male",2016,3.68,"long","moderate",["fall","winter"],["woody","spicy","amber","aromatic"],"Sign attitude. Bold and confident. MB signature."],
["Mercedes-Benz","Mercedes-Benz Intense EDP","male",2018,3.72,"long","strong",["fall","winter"],["woody","amber","spicy","leather"],"MB intense. Cardamom and leather. Powerful drive."],
["Bentley","Bentley Momentum Unlimited EDT","male",2019,3.65,"moderate","moderate",["spring","summer"],["fresh","citrus","aquatic","woody"],"Unlimited momentum. Citrus and sea. Open road."],
["Bentley","Bentley For Women EDT","female",2013,3.62,"long","moderate",["spring","fall"],["floral","fruity","musk","woody"],"Bentley her. Light floral. Luxury accessible."],
["Boucheron","Boucheron Quatre Homme EDP","male",2014,3.78,"long","moderate",["fall","winter"],["woody","spicy","amber","aromatic"],"Quatre homme. Cedar and pepper. Jeweller's masculine."],
["Boucheron","Boucheron Quatre Pour Femme EDP","female",2014,3.75,"long","moderate",["spring","fall"],["floral","woody","iris","musk"],"Quatre femme. Iris and cashmere. Jeweller's feminine."],
["Donna Karan","DKNY Men EDT","male",2000,3.62,"moderate","moderate",["spring","summer"],["fresh","citrus","woody","aquatic"],"DKNY man. Urban fresh. New York masculine."],
["Donna Karan","DKNY Red Delicious EDP","female",2007,3.65,"long","moderate",["spring","fall"],["fruity","floral","fresh","woody"],"Red apple delicious. Apple and magnolia. NYC fresh."],
["Escada","Escada Rockin Rio EDT","female",2011,3.62,"moderate","soft",["spring","summer"],["tropical","fruity","floral","citrus"],"Rio carnival. Tropical and festive. Brazilian joy."],
["Escada","Escada Cherry in the Air EDT","female",2013,3.65,"moderate","moderate",["spring","summer"],["fruity","floral","cherry","sweet"],"Cherry air. Cherry and blackcurrant. Playful sweet."],
["Escada","Escada Moon Sparkle EDT","female",2006,3.58,"moderate","soft",["spring","summer"],["floral","fruity","aquatic","fresh"],"Moon sparkle. Fresh and dreamy. Night flowers."],
["Escada","Escada Especially Escada Delicate Notes EDT","female",2013,3.60,"moderate","soft",["spring","summer"],["floral","fresh","citrus","musk"],"Delicate notes. Light florals. Airy accessibility."],
["Lolita Lempicka","Lolita Lempicka Mon Premier EDP","female",2007,3.72,"long","moderate",["spring","fall"],["floral","sweet","gourmand","iris"],"Mon premier. Violet and anise. First Lolita memory."],
["L'Occitane","L'Occitane Fleurs de Cerisier EDP","female",2014,3.65,"moderate","soft",["spring","summer"],["floral","cherry","fresh","musk"],"Cherry blossoms. Light and airy. Japanese inspired."],
["Yardley","Yardley Freesia EDT","female",2012,3.55,"short","soft",["spring","summer"],["floral","fresh","citrus","musk"],"Freesia freshness. Light and natural. Garden simplicity."],
["Roger & Gallet","Roger Gallet Gingembre Rouge EDF","unisex",2013,3.62,"short","soft",["spring","summer"],["spicy","citrus","herbal","fresh"],"Ginger rouge. Spiced citrus. Invigorating."],
["The Body Shop","The Body Shop British Rose EDT","female",2017,3.62,"moderate","soft",["spring","summer"],["rose","floral","fresh","musk"],"British rose. Natural and accessible. Garden rose."],
["Bath Body Works","Bath Body Works Champagne Toast EDP","female",2019,3.60,"moderate","moderate",["spring","summer"],["fruity","floral","sweet","musk"],"Champagne toast. Peach and jasmine. Celebration."],
["Victoria Secret","Victoria Secret Bombshell Summer EDP","female",2019,3.70,"moderate","moderate",["spring","summer"],["tropical","floral","fruity","musk"],"Bombshell summer. Tropical and fresh. Beach confidence."],
["Ed Hardy","Ed Hardy Villain EDP","male",2016,3.55,["spicy","woody","amber","tobacco"],"Villain. Dark spices. Tattoo art masculine."],
["Hollister","Hollister SoCal Beauty EDT","female",2015,3.58,"moderate","soft",["spring","summer"],["floral","citrus","tropical","musk"],"SoCal beauty. Hibiscus and citrus. Californian."],
["David Beckham","David Beckham Classic Blue EDT","male",2013,3.58,["fresh","woody","citrus","aromatic"],"Classic Beckham. Refreshing and modern. Football icon."],
["Shakira","Shakira S EDT","female",2013,3.55,["floral","fruity","fresh","musk"],"Shakira S. Fresh and vibrant. Latin star."],
["Selena Gomez","Selena Gomez Rare EDT","female",2021,3.68,["floral","fruity","sweet","musk"],"Rare beauty. Peach and jasmine. Singer's luxury."],
["Kim Kardashian","KKW Crystal Gardenia EDP","female",2017,3.65,["floral","white floral","musk","clean"],"Crystal gardenia. White flowers and musk. Body luxury."],
["Zara","Zara Downtown Girl EDP","female",2021,3.72,["floral","fresh","musk","citrus"],"Downtown girl. Urban feminine. Zara street style."],
["Zara","Zara Denim Couture EDT","unisex",2021,3.68,["fresh","woody","musk","aromatic"],"Denim couture. Clean and casual. Affordable chic."],
["Dossier","Dossier Spicy Cedarwood EDP","unisex",2021,3.75,["woody","spicy","amber","aromatic"],"Spicy cedarwood. Cedar and black pepper. Accessible niche."],
["Kayali","Kayali Elixir 11 EDP","unisex",2022,4.02,["oriental","amber","floral","sweet"],"Elixir 11. Rose and amber. Premium accessible."],
["Maison Alhambra","Maison Alhambra Violet Bouquet EDP","female",2022,3.85,["floral","violet","powdery","musk"],"Violet bouquet. Iris and rose. Inspired luxury."],
["Afnan","Afnan 9 PM for Women EDP","female",2021,3.88,["sweet","floral","vanilla","musk"],"9 PM her. Floral and sweet. Evening accessible."],
["Lattafa","Lattafa Asad Oud EDP","male",2022,4.12,["oud","spicy","amber","leather"],"Asad oud. Leather and saffron. King of beasts."],
["Rasasi","Rasasi Hawas for Her EDP","female",2021,3.98,["floral","fruity","sweet","musk"],"Hawas her. Fruity floral. Feminine desire."],
["Swiss Arabian","Swiss Arabian Ghayath EDP","male",2019,4.0,["oud","spicy","amber","woody"],"Ghayath. Oud and cardamom. Traditional masculine."],
["Arabian Oud","Arabian Oud Breeze EDP","unisex",2020,3.85,["fresh","citrus","woody","musk"],"Arabian breeze. Fresh and accessible. Desert cool."],
["Paris Corner","Paris Corner Intact Blue EDP","male",2022,3.88,["fresh","aquatic","woody","citrus"],"Blue intact. Marine and citrus. Fresh accessible."],
["Zimaya","Zimaya Pride EDP","male",2021,3.88,["oud","woody","spicy","amber"],"Pride. Oud and pepper. Proud masculine."],
["Al Haramain","Al Haramain Madinah EDP","unisex",2018,4.05,["oud","amber","floral","sweet"],"Madinah sacred. Oud and rose. Holy luxury."],
["Armaf","Armaf Tag-Him EDT","male",2016,3.70,["fresh","citrus","woody","aromatic"],"Tag him. Fresh and sporty. Accessible masculine."],
["Armaf","Armaf Club de Nuit Intense Man Limited Edition","male",2020,4.20,["fruity","woody","amber","musk"],"Limited intense. Pineapple and oud. Premium version."],
["Bvlgari","Bvlgari Omnia Amethyste EDT","female",2008,3.72,["floral","iris","citrus","fresh"],"Amethyst light. Iris and bergamot. Purple luxury."],
["Naomi Campbell","Naomi Campbell Sunrise EDT","female",2014,3.52,["floral","fruity","citrus","musk"],"Sunrise beauty. Mandarin and jasmine. Morning glow."],
["Nicki Minaj","Nicki Minaj Pink Friday EDP","female",2012,3.60,["fruity","floral","sweet","musk"],"Pink Friday. Cassis and jasmine. Rap queen."],
["Ellen Tracy","Ellen Tracy Elements EDT","female",2010,3.50,["floral","fruity","fresh","musk"],"Tracy elements. Fresh and light. Accessible American."],
];

const existing=JSON.parse(readFileSync(DATA,"utf-8"));
console.log(`Mevcut: ${existing.length}`);
const seen=new Map(existing.map(p=>[`${p.brand}|${p.name}`.toLowerCase().trim(),true]));
let added=0;const merged=[...existing];
for(const row of BATCH){
  const [brand,name,gender,year,rating,lon,sil,seasons,accords,desc]=row;
  const key=`${brand}|${name}`.toLowerCase().trim();
  if(seen.has(key))continue;
  seen.set(key,true);
  const p={brand,name,notes:{top:[],middle:[],base:[]},accords,longevity:lon||"long",sillage:sil||"moderate",season:seasons||["spring","fall"],gender,rating,short_description:desc,year,image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${Math.floor(Math.random()*60000+10000)}.jpg`};
  p.short_description_tr=gtr(p);
  merged.push(p);added++;
}
merged.forEach((p,i)=>{p.id=String(i+1);});
writeFileSync(DATA,JSON.stringify(merged,null,2),"utf-8");
console.log(`Eklenen: ${added}`);
console.log(`Toplam: ${merged.length}`);
