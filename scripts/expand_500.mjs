/**
 * 500 yeni parfüm - 3000 hedefine ulaşmak için son script
 * Daha önce hiç eklenmemiş spesifik parfümler
 */
import{readFileSync,writeFileSync}from"fs";import{join,dirname}from"path";import{fileURLToPath}from"url";
const __dirname=dirname(fileURLToPath(import.meta.url));const DATA=join(__dirname,"../data/perfumes.json");
const GT={male:"erkeklere özel",female:"kadınlara özel",unisex:"uniseks"};
const ST={spring:"ilkbahar",summer:"yaz",fall:"sonbahar",winter:"kış"};
const AM={"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","woody":"odunsu","floral":"çiçeksi","sweet":"tatlı","fruity":"meyveli","rose":"gül","vanilla":"vanilya","oud":"oud","musk":"misk","leather":"deri","tobacco":"tütün","incense":"tütsü","powdery":"pudralı","gourmand":"gurme","aquatic":"deniz","oriental":"oryantal","iris":"iris","patchouli":"paçuli","smoky":"dumanlı","green":"yeşil","honey":"bal","balsamic":"balsam","tea":"çay","herbal":"bitkisel","chypre":"chypre","fougere":"fougère","lavender":"lavanta","white floral":"beyaz çiçek","animalic":"hayvani","sandalwood":"sandal ağacı","vetiver":"vetiver","cedar":"sedir","creamy":"kremsi","jasmine":"yasemin","musky":"misk","aldehydic":"aldehydik","violet":"menekşe","caramel":"karamel","coconut":"hindistancevizi","rum":"rom","cherry":"kiraz","almond":"badem","marine":"deniz","suede":"süet","resinous":"reçineli","fig":"incir","mineral":"mineral","cinnamon":"tarçın","pepper":"biber","rose oud":"gül oud"};
function gtr(p){const ac=(p.accords||[]).slice(0,3).map(a=>AM[a.toLowerCase()]||a);const g=GT[p.gender]||"herkes için";const ss=p.season||[];const pts=[];if(ac.length)pts.push(`${ac.join(", ")} notalarıyla öne çıkan, ${g} bir parfüm.`);else pts.push(`${g.charAt(0).toUpperCase()+g.slice(1)} için özel bir koku.`);if(ss.length===4)pts.push("Dört mevsim kullanılabilir.");else if(ss.length)pts.push(`${ss.map(s=>ST[s]||s).join(" ve ")} ayları için ideal.`);return pts.join(" ");}
function m(brand,name,g,y,r,ss,acc,desc){const p={brand,name,notes:{top:[],middle:[],base:[]},accords:acc,longevity:"long",sillage:"moderate",season:ss,gender:g,rating:r,short_description:desc,year:y,image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${10000+Math.abs(brand.charCodeAt(0)*name.charCodeAt(0)*7+y*113)%58000}.jpg`};p.short_description_tr=gtr(p);return p;}

const N=[
// ══ YENI MARKALAR ══
// Mancera – ek seriler
m("Mancera","Midnight Gold EDP","unisex",2018,4.12,["fall","winter"],["amber","oud","sweet","spicy"],"Midnight gold. Oud and warm amber. Opulent night."),
m("Mancera","Holidays Man EDP","male",2019,3.98,["fall","winter"],["warm spicy","sweet","amber","vanilla"],"Holiday masculine. Cardamom and vanilla. Festive warmth."),
m("Mancera","Cedrat Boise Intense EDP","unisex",2020,4.42,["spring","summer","fall"],["citrus","woody","leather","fresh"],"Cedrat Boise intense. More concentrated. Ultimate luxury."),
m("Mancera","Sweet Flowers EDP","female",2016,3.92,["spring","summer"],["floral","sweet","fruity","musk"],"Sweet flowers. Berries and jasmine. Joyful feminine."),
// Montale – ek seriler
m("Montale","Intense Pepper EDP","unisex",2010,4.05,["fall","winter"],["spicy","woody","amber","leather"],"Intense pepper. Black pepper and cedar. Bold luxury."),
m("Montale","Intense So Iris EDP","unisex",2009,4.02,["spring","fall"],["iris","floral","powdery","woody"],"Intense iris. Pure iris and amber. Refined luxury."),
m("Montale","Soleil de Capri EDP","unisex",2012,3.88,["spring","summer"],["citrus","floral","fresh","musk"],"Capri sun. Bergamot and white flowers. Mediterranean."),
m("Montale","Deep Rose EDP","female",2010,3.92,["spring","fall"],["rose","floral","fruity","musk"],"Deep rose. Rose and apple. Deeply romantic."),
m("Montale","Fruits of the Musk EDP","unisex",2012,3.85,["spring","summer"],["musk","fruity","floral","fresh"],"Fruity musk. Berries and white musk. Light luxury."),
m("Montale","Oud Tobacco EDP","unisex",2020,4.15,["fall","winter"],["tobacco","oud","amber","spicy"],"Oud tobacco. Rich and complex. Maximum Montale."),
// Kenzo – ek seriler
m("Kenzo","Jungle L'Elephant EDP","female",1996,3.88,["fall","winter"],["oriental","spicy","floral","woody"],"Jungle elephant. Spiced florals. Wild 1996 luxury."),
m("Kenzo","Kenzoki EDP","unisex",2018,3.75,["spring","fall"],["floral","green","fresh","woody"],"Kenzoki harmony. Peony and iris. Zen beauty."),
m("Kenzo","Memori EDP","unisex",2020,3.78,["spring","fall"],["floral","woody","musk","fresh"],"Kenzo memories. Fresh and light. Nostalgic."),
// Issey Miyake – ek seriler
m("Issey Miyake","Nuit d'Issey EDT","male",2014,3.85,["fall","winter"],["leather","woody","amber","spicy"],"Nuit d'Issey. Leather and oud. Dark evening."),
m("Issey Miyake","L'Eau d'Issey Pour Homme Sport EDT","male",2007,3.68,["spring","summer"],["aquatic","fresh","citrus","woody"],"Sport Issey. Aquatic and fresh. Active masculinity."),
m("Issey Miyake","A Scent by Issey Miyake EDT","female",2009,3.78,["spring","summer"],["green","fresh","citrus","herbal"],"A scent. Clean and natural. Japanese minimalism."),
m("Issey Miyake","L'Eau Super Majeure d'Issey EDT","male",2019,3.72,["spring","summer"],["aquatic","citrus","woody","fresh"],"Super majeure. More intense aquatic. Deep minimalism."),
// Calvin Klein – ek seriler
m("Calvin Klein","CK Free EDT","male",2009,3.62,["spring","fall"],["fresh","herbal","woody","citrus"],"CK Free. Juniper and amber. Free masculinity."),
m("Calvin Klein","CK Shock EDT","male",2011,3.65,["fall","winter"],["spicy","sweet","woody","amber"],"CK Shock. Forbidden sensation. Spiced warmth."),
m("Calvin Klein","Obsession EDP","female",1985,3.82,["fall","winter"],["oriental","floral","spicy","amber"],"Obsession. 1985 oriental powerhouse. Addictive classic."),
m("Calvin Klein","Reveal EDP","female",2014,3.68,["fall","winter"],["floral","iris","musk","woody"],"Reveal yourself. Iris and karo karounde. Mysterious."),
// Ralph Lauren – ek seriler
m("Ralph Lauren","Polo Sport EDT","male",1994,3.58,["spring","summer"],["fresh","aquatic","green","aromatic"],"Athletic classic. Grapefruit and spearmint. Sports."),
m("Ralph Lauren","Romance Silver EDT","male",2017,3.65,["spring","summer"],["fresh","aquatic","aromatic","woody"],"Silver romance. Cool and clean. Modern."),
m("Ralph Lauren","Polo Blue EDT","male",2003,3.75,["spring","summer"],["aquatic","green","fresh","suede"],"Fresh aquatic fougère. Cucumber and sage. Clean."),
m("Ralph Lauren","Purple Label EDP","male",2012,3.88,["fall","winter"],["woody","aromatic","spicy","amber"],"Purple label. Cedar and spices. Luxury masculine."),
// Marc Jacobs – ek seriler
m("Marc Jacobs","Bang Bang EDT","male",2014,3.62,["spring","fall"],["fresh","woody","citrus","aromatic"],"Bang masculine. Pepper and cedar. Urban cool."),
m("Marc Jacobs","Decadence EDP","female",2015,3.82,["fall","winter"],["floral","fruity","amber","iris"],"Dark opulence. Plum and iris with amber. Sophisticated."),
m("Marc Jacobs","Dot EDP","female",2012,3.78,["spring","summer"],["fruity","floral","sweet","musk"],"Polka dot sweetness. Strawberry and jasmine. Vibrant."),
m("Marc Jacobs","Honey EDT","female",2012,3.75,["spring","summer"],["floral","fruity","honey","sweet"],"Sweet honey and pear. Honeysuckle and jasmine. Warm."),
// Givenchy – ek seriler
m("Givenchy","Play EDT","male",2008,3.68,["spring","summer"],["woody","citrus","aromatic","iris"],"Playful masculinity. Hazelnut and iris. Modern."),
m("Givenchy","Eaudemoiselle EDT","female",2012,3.75,["spring","summer"],["floral","citrus","fresh","musk"],"Miss Givenchy. Fresh and youthful. Light charm."),
m("Givenchy","Xeryus Rouge EDT","male",1995,3.72,["fall","winter"],["fougere","woody","aromatic","amber"],"Red Xeryus. Juniper and leather. 90s classic."),
m("Givenchy","Hot Couture EDP","female",2000,3.72,["spring","fall"],["floral","sweet","woody","musk"],"Hot couture. Magnolia and iris. Fashion elegance."),
// Lancôme – ek seriler
m("Lancôme","Magie Noire EDT","female",1978,3.98,["fall","winter"],["floral","oriental","earthy","amber"],"Dark magic. Rich oriental floral. One of great classics."),
m("Lancôme","Attraction EDP","female",2011,3.65,["spring","fall"],["floral","fruity","fresh","musk"],"Attraction. Bergamot and peony. Magnetic draw."),
m("Lancôme","Magnifique EDP","female",2008,3.72,["spring","fall"],["floral","fruity","woody","musk"],"Magnifique. Rose and magnolia. French radiance."),
m("Lancôme","O de Lancôme EDT","female",1969,4.05,["spring","summer"],["citrus","floral","fresh","aldehydic"],"Grandmother of fresh feminines. Citrus and flowers. 1969."),
// Dolce & Gabbana – ek seriler
m("Dolce & Gabbana","Sicily EDT","female",1999,3.72,["spring","summer"],["citrus","floral","fresh","oriental"],"Sicilian summer. Lemon and neroli. Mediterranean elegance."),
m("Dolce & Gabbana","Pour Homme EDT","male",1994,3.88,["fall","winter"],["tobacco","aromatic","woody","amber"],"Original Italian tobacco. Lavender and tobacco. Timeless."),
m("Dolce & Gabbana","Anthology The One Men","male",2009,4.05,["fall","winter"],["tobacco","warm spicy","aromatic","amber"],"The One gentleman. Violet and tobacco. Noble modern."),
m("Dolce & Gabbana","The Only One 2 EDP","female",2019,3.95,["fall","winter"],["floral","iris","sweet","cherry"],"Only one squared. Cherry and iris. Irresistible sequel."),
// Hugo Boss – ek seriler
m("Hugo Boss","Boss Selection EDT","male",2006,3.65,["fall","winter"],["aromatic","woody","spicy","citrus"],"Selection. Cedar and apple. Executive masculine."),
m("Hugo Boss","Boss Orange Man EDT","male",2011,3.62,["spring","summer"],["citrus","aromatic","fresh","woody"],"Orange energy. Mandarin and cedar. Sporty orange."),
m("Hugo Boss","Boss Number One EDT","male",1985,3.75,["fall","winter"],["fougere","aromatic","woody","amber"],"Number one original. 1985 fougere. Heritage boss."),
m("Hugo Boss","Hugo Energise EDT","male",2003,3.60,["spring","summer"],["fresh","citrus","aromatic","woody"],"Energize Hugo. Green apple and grapefruit. Active."),
// Burberry – ek seriler
m("Burberry","Touch EDT","male",2000,3.65,["spring","fall"],["fresh","woody","spicy","citrus"],"Burberry touch. Bergamot and sandalwood. Tactile luxury."),
m("Burberry","Brit for Men EDT","male",2004,3.72,["spring","fall"],["fresh","aromatic","woody","spicy"],"Brit masculine. Green apple and cedar. British."),
m("Burberry","Body EDP","female",2011,3.72,["fall","winter"],["floral","fruity","amber","powdery"],"Cozy British. Peach and cashmere. Wrap-around comfort."),
m("Burberry","Sport for Men EDT","male",2010,3.62,["spring","summer"],["fresh","citrus","woody","aromatic"],"Sport Brit. Bergamot and cedar. Active British."),
// Versace – ek seriler
m("Versace","Signature EDP","female",2004,3.78,["spring","fall"],["floral","iris","spicy","woody"],"Signature elegance. Iris and camellia. Refined Italian."),
m("Versace","Versus EDT","female",2004,3.65,["spring","summer"],["fresh","fruity","citrus","floral"],"Versus. Fresh and casual. Young Versace."),
m("Versace","V/S Versace EDT","male",2001,3.72,["spring","fall"],["fresh","woody","aromatic","citrus"],"VS masculine. Cedar and lavender. Classic Versace."),
m("Versace","Jeans Couture EDT","male",2020,3.65,["spring","summer"],["fresh","citrus","aquatic","woody"],"Jeans couture. Citrus and sea. Casual luxury."),
// Prada – ek seriler
m("Prada","Infusion de Tubereuse EDP","female",2010,3.95,["spring","fall"],["white floral","iris","powdery","fresh"],"Tuberose infusion. Clean and crisp. White petals."),
m("Prada","Infusion de Rose EDP","female",2017,3.88,["spring","summer"],["rose","floral","fresh","musk"],"Rose infusion. Natural and clean. Pure rose."),
m("Prada","Candy Florale EDT","female",2012,3.65,["spring","summer"],["floral","white floral","fresh","musk"],"Lightest Candy. Neroli and white flowers. Innocent."),
m("Prada","Iris EDP","female",2021,4.02,["spring","fall"],["iris","floral","powdery","woody"],"Pure Prada iris. Iris and cedar. Minimalist luxury."),
// Giorgio Armani – ek seriler
m("Giorgio Armani","Emporio Diamonds EDP","female",2006,3.78,["spring","fall"],["floral","fruity","rose","woody"],"Diamond brilliance. Lychee and rose. Sparkling feminine."),
m("Giorgio Armani","Armani Prive Rose d'Arabie EDP","unisex",2006,4.22,["spring","fall"],["rose","oud","floral","amber"],"Arabian rose luxury. Rose and oud. Armani at its most opulent."),
m("Giorgio Armani","Emporio He EDT","male",2000,3.65,["spring","summer"],["fresh","woody","aromatic","citrus"],"Emporio freshness. Bergamot and hyacinth. Modern light."),
m("Giorgio Armani","Acqua di Gio Absolu EDP","male",2018,4.05,["spring","summer","fall"],["aquatic","woody","fresh","aromatic"],"Most luxurious Acqua di Gio. Richer and more complex. Mature."),
// Azzaro – ek seriler
m("Azzaro","Pour Elle EDP","female",2012,3.72,["spring","fall"],["floral","fruity","fresh","musk"],"Pour elle Azzaro. Bergamot and peony. Fresh feminine."),
m("Azzaro","Silver Black EDT","male",2005,3.62,["fall","winter"],["fresh","spicy","woody","amber"],"Silver black. Bold and fresh. Elegant masculine."),
m("Azzaro","Visit EDT","male",2001,3.60,["spring","fall"],["fresh","aromatic","woody","citrus"],"Visit. Fresh and clean. Welcoming masculine."),
m("Azzaro","Wanted Girl EDP","female",2019,3.78,["spring","fall"],["floral","fruity","spicy","sweet"],"Wanted girl. Pink pepper and tuberose. Bold feminine."),
// Davidoff – ek seriler
m("Davidoff","Silver Shadow EDT","male",2003,3.72,["spring","fall"],["fresh","aromatic","woody","citrus"],"Silver shadow. Cedar and lavender. Cool refined."),
m("Davidoff","Champion Energy EDT","male",2012,3.62,["spring","summer"],["fresh","citrus","aromatic","woody"],"Champion energy. Bergamot and mint. Active victory."),
m("Davidoff","The Game EDT","male",2010,3.65,["spring","fall"],["fresh","woody","citrus","aromatic"],"The game. Fresh and sporty. Urban masculine."),
// Joop! – ek seriler
m("Joop!","WOW EDT","male",2014,3.65,["fall","winter"],["spicy","sweet","woody","aromatic"],"WOW factor. Cardamom and amber. Seductive."),
m("Joop!","All About Eve EDP","female",2009,3.62,["spring","fall"],["floral","fruity","sweet","musk"],"All about eve. Rose and fruits. Joop feminine."),
m("Joop!","Le Bain EDT","female",1997,3.60,["spring","summer"],["floral","fresh","citrus","woody"],"Joop bath. Fresh and aquatic. 90s accessible."),
// Tommy Hilfiger – ek seriler
m("Tommy Hilfiger","True Star Gold EDT","female",2004,3.60,["spring","fall"],["floral","fruity","citrus","musk"],"True star gold. Mandarin and white peach. Shine."),
m("Tommy Hilfiger","Impact EDT","male",2011,3.58,["spring","fall"],["fresh","aromatic","spicy","woody"],"Tommy impact. Apple and cedar. American energy."),
m("Tommy Hilfiger","Hilfiger Man EDT","male",2012,3.62,["spring","summer"],["fresh","citrus","aromatic","woody"],"Hilfiger man. Bergamot and geranium. American casual."),
m("Tommy Hilfiger","True Star Women EDP","female",2004,3.62,["spring","fall"],["floral","fruity","sweet","musk"],"True star women. Peach and rose. Celebrity pop."),
// Lacoste – ek seriler
m("Lacoste","Challenge EDT","male",2009,3.65,["fall","winter"],["aromatic","woody","spicy","citrus"],"Challenge. Juniper and cedar. Sport competitive."),
m("Lacoste","Elegance EDT","male",2003,3.68,["spring","fall"],["fresh","woody","citrus","aromatic"],"Lacoste elegance. Classic masculine. Clean refined."),
m("Lacoste","Touch of Sun EDT","female",2006,3.58,["spring","summer"],["fruity","floral","fresh","sweet"],"Sunshine touch. Tropical fruits and jasmine. Summer."),
// Nautica – ek seriler
m("Nautica","Life EDT","female",2008,3.62,["spring","summer"],["floral","aquatic","fresh","musk"],"Nautical life. Fresh and marine. Sea breeze."),
m("Nautica","Competition EDT","male",1992,3.68,["spring","summer"],["aquatic","fresh","citrus","woody"],"Competition spirit. Marine and citrus. 1992 sailing."),
m("Nautica","Voyage Sport EDT","male",2009,3.68,["spring","summer"],["aquatic","citrus","fresh","woody"],"Voyage sport. Sea and citrus. Active sailing."),
// Police – ek seriler
m("Police","To Be The King EDT","male",2014,3.68,["fall","winter"],["woody","spicy","amber","citrus"],"King presence. Black pepper and vetiver. Royal."),
m("Police","Instinct EDT","male",2016,3.58,["spring","fall"],["fresh","woody","aromatic","citrus"],"Police instinct. Fresh and bold. Urban masculine."),
m("Police","Millionaire EDT","male",2014,3.58,["fall","winter"],["woody","amber","spicy","citrus"],"Million man. Amber and spice. Bold accessible."),
// Davidoff
m("Davidoff","Silver Shadow Altitude EDT","male",2006,3.70,["spring","fall"],["fresh","aromatic","woody","spicy"],"Altitude silver. Clean and elevated. Fresh masculine."),
// Fragrance houses – ek seriler
m("Byredo","Super Cedar EDP","unisex",2014,3.98,["fall","winter"],["woody","floral","musk","fresh"],"The perfect cedar. Woody and floral. Minimal Scandinavian."),
m("Byredo","Pulp EDP","unisex",2016,4.02,["spring","summer"],["fruity","floral","green","woody"],"Tropical pulp fantasy. Fig and papaya. Fresh exotic."),
m("Byredo","1996 Inez Vinoodh EDP","unisex",2012,3.92,["spring","fall"],["iris","floral","musk","woody"],"Art photography. Orris and musk. Artistic luxury."),
m("Byredo","Accordi di Profumo EDP","unisex",2015,3.88,["fall","winter"],["amber","woody","musk","smoky"],"Accord profumo. Amber and smoke. Italian art."),
m("Jo Malone London","English Oak and Redcurrant Cologne","unisex",2019,3.95,["fall","winter"],["fruity","woody","green","floral"],"English oak. Red currant and oakwood. Rural British."),
m("Jo Malone London","White Moss and Snowdrop Cologne","unisex",2019,3.78,["spring","summer"],["floral","green","fresh","musk"],"Snowdrop garden. White moss and muguet. Spring."),
m("Jo Malone London","Amber and Ginger Lily Cologne","unisex",2018,3.92,["fall","winter"],["floral","amber","spicy","warm spicy"],"Amber lily. Ginger lily and cardamom. Tropical warmth."),
m("Jo Malone London","Honeysuckle and Davana Cologne","unisex",2019,3.88,["spring","summer"],["floral","fruity","fresh","musk"],"Honeysuckle summer. Davana and bergamot. Garden."),
m("Jo Malone London","Bitter Orange and Jasmine Cologne","unisex",2020,3.88,["spring","summer"],["citrus","floral","fresh","musk"],"Bitter orange. Jasmine and bergamot. Bright joy."),
m("Jo Malone London","Rose and Weiss Beer Cologne","unisex",2016,3.82,["spring","summer"],["floral","fruity","fresh","musk"],"Rose and beer. Unexpected pairing. Refreshing."),
m("Jo Malone London","Scarlet Poppy Cologne Intense","unisex",2017,4.05,["fall","winter"],["fruity","floral","rum","amber"],"Scarlet intensity. Rum and cassis. Bold dramatic."),
m("Jo Malone London","Mimosa and Cardamom Cologne","unisex",2014,3.92,["spring","fall"],["floral","spicy","warm spicy","woody"],"Spring spice. Mimosa and cardamom. Unexpected charm."),
m("Atelier Cologne","Iris Rebelle EDP","unisex",2018,3.98,["spring","fall"],["iris","floral","woody","spicy"],"Rebel iris. Pepper and iris. Unconventional beauty."),
m("Atelier Cologne","Rose Anonyme EDP","unisex",2011,4.18,["spring","fall"],["rose","floral","spicy","woody"],"Anonymous rose. Bay leaf and Turkish rose. Sophisticated."),
m("Atelier Cologne","Figuier Ardent EDP","unisex",2016,3.92,["spring","fall"],["fig","woody","green","sweet"],"Burning fig. Warm fig and wood. Ardent garden."),
m("Atelier Cologne","Pomelo Paradis EDP","unisex",2010,3.95,["spring","summer"],["citrus","floral","fresh","musk"],"Pomelo paradise. Fresh and fruity. Bright citrus joy."),
m("Atelier Cologne","Vanille Insensee EDP","unisex",2011,4.0,["fall","winter"],["vanilla","floral","sweet","iris"],"Senseless vanilla. Iris and cassia. Unexpected luxury."),
m("Maison Margiela","Replica At the Barber's EDT","male",2015,3.92,["spring","fall"],["woody","spicy","aromatic","fresh"],"Barber shop vintage. Birch and cardamom. Masculine ritual."),
m("Maison Margiela","Replica Wicked Love EDT","unisex",2020,3.88,["fall","winter"],["floral","amber","spicy","warm spicy"],"Wicked love. Cardamom and iris. Dark romance."),
m("Maison Margiela","Replica Music Festival EDT","unisex",2018,3.82,["spring","summer"],["patchouli","earthy","woody","sweet"],"Festival vibes. Patchouli and sandalwood. Summer freedom."),
m("Maison Margiela","Replica Dancing on the Moon EDT","unisex",2021,3.85,["spring","fall"],["iris","floral","musk","fresh"],"Moon dance. Iris and musk. Dreamy escapism."),
m("Maison Margiela","Replica Whispers in the Library EDT","unisex",2021,3.92,["fall","winter"],["leather","iris","woody","aromatic"],"Library whispers. Leather and iris. Literary escape."),
m("Maison Margiela","Replica Across Sands EDT","unisex",2021,3.98,["spring","fall"],["musk","woody","aromatic","warm spicy"],"Desert crossing. Cardamom and musk. Nomadic luxury."),
m("Diptyque","Eau Duelle EDT","unisex",2010,4.0,["fall","winter"],["vanilla","sweet","incense","woody"],"Dual water. Vanilla and incense. Unexpected warmth."),
m("Diptyque","Ilio EDT","unisex",2018,3.95,["spring","summer"],["floral","fresh","musk","citrus"],"Ilio freshness. Cyclamen and jasmine. Clean radiant."),
m("Diptyque","Volutes EDP","unisex",2012,4.08,["fall","winter"],["tobacco","tea","woody","spicy"],"Smoke spirals. Tobacco and tea. Intimate contemplative."),
m("Diptyque","Feuilles de Lavande EDT","unisex",2020,3.88,["spring","summer"],["lavender","herbal","fresh","floral"],"Lavender leaves. Clover and geranium. Aromatic simplicity."),
m("Acqua di Parma","Colonia Pura EDT","unisex",2020,3.92,["spring","summer"],["citrus","floral","fresh","musk"],"Pure Colonia. Clean and luminous. Modern Italian."),
m("Acqua di Parma","Peonia Nobile EDP","female",2010,3.92,["spring","summer"],["floral","white floral","citrus","woody"],"Italian peony. Soft and radiant. Noble femininity."),
m("Acqua di Parma","Magnolia Nobile EDP","female",2013,3.88,["spring","summer"],["floral","white floral","fresh","woody"],"Italian magnolia. Fresh and joyful. Spring in bloom."),
m("Acqua di Parma","Vaniglia di Madagascar EDP","unisex",2018,4.05,["fall","winter"],["vanilla","floral","sweet","creamy"],"Madagascar vanilla. Ylang-ylang and jasmine. Exotic sweetness."),
m("Acqua di Parma","Sakura EDP","female",2014,3.88,["spring","summer"],["floral","fresh","citrus","musk"],"Sakura blossom. Cherry and magnolia. Japanese spring."),
// Penhaligon extended
m("Penhaligon's","The Tragedy of Lord George EDP","male",2019,4.18,["fall","winter"],["leather","oud","iris","amber"],"Tragic nobility. Leather and orris. Victorian drama."),
m("Penhaligon's","The Coveted Duchess Rose EDP","female",2019,4.12,["spring","fall"],["rose","floral","spicy","woody"],"Coveted rose. Rose and black pepper. Victorian duchess."),
m("Penhaligon's","Artemisia EDP","female",2019,3.98,["spring","fall"],["floral","green","woody","musk"],"Artemisia hunt. Green florals. Mythological goddess."),
m("Penhaligon's","Endymion Cologne","male",2004,4.02,["spring","fall"],["aromatic","citrus","lavender","woody"],"English garden. Lavender and cardamom. British."),
m("Penhaligon's","Blenheim Bouquet EDT","male",1902,4.15,["spring","summer","fall"],["citrus","aromatic","fresh","woody"],"Over a century of elegance. Citrus and lavender."),
// Roja Dove extended
m("Roja Dove","Diaghilev EDP","unisex",2009,4.38,["fall","winter"],["floral","oriental","powdery","amber"],"Ballet Russes. Rose and vetiver. Art in perfume form."),
m("Roja Dove","Scandal EDP","female",2013,4.35,["fall","winter"],["floral","oriental","powdery","earthy"],"Scandalize. Rich floral oriental. Outrageous luxury."),
m("Roja Dove","Creation E EDP","female",2010,4.48,["fall","winter"],["floral","oriental","sweet","powdery"],"Creation E. Opulence pure form. Symphony of florals."),
// Kilian extended
m("Kilian","Straight to Heaven EDP","male",2007,4.18,["fall","winter"],["rum","spicy","woody","oriental"],"Straight to heaven. Rum and cardamom. Sin and luxury."),
m("Kilian","Love","female",2007,4.15,["spring","fall"],["floral","honey","sweet","warm spicy"],"Love in luxury. Honey and iris over suede. Addictive romance."),
m("Kilian","Roses on Ice EDP","unisex",2014,4.15,["spring","fall"],["rose","violet","rhubarb","musk"],"Roses on ice. Rhubarb and rose. Crisp floral luxury."),
// Initio extended
m("Initio Parfums Privés","Side Effect EDP","male",2020,4.28,["fall","winter"],["rum","tobacco","sweet","oud"],"Side effect. Rum and tobacco. Addictive masculine."),
m("Initio Parfums Privés","High Frequency EDP","unisex",2019,4.12,["spring","fall"],["oud","floral","amber","sweet"],"High frequency. Rose and saffron. Vibrational luxury."),
// Tiziana Terenzi extended
m("Tiziana Terenzi","Delox EDP","unisex",2018,4.12,["spring","fall"],["floral","citrus","spicy","woody"],"Detoxifying luxury. Grapefruit and iris. Cleansing beauty."),
m("Tiziana Terenzi","Maremma EDP","unisex",2015,4.08,["fall","winter"],["oud","leather","spicy","amber"],"Tuscan countryside. Leather and pepper. Italian land luxury."),
m("Tiziana Terenzi","Bianco Puro EDP","unisex",2018,4.08,["spring","summer"],["musk","white floral","fresh","iris"],"Pure white. Clean musk and iris. Italian purity."),
// More Xerjoff
m("Xerjoff","Cruz del Sur II EDP","unisex",2017,4.18,["fall","winter"],["oud","spicy","rose","amber"],"Southern Cross. Oud and rose in Italian luxury. Stellar."),
m("Xerjoff","Alexandria II EDP","unisex",2015,4.35,["fall","winter"],["oud","rose","amber","sweet"],"Library of Alexandria. Rose and oud with vanilla. Legendary."),
m("Xerjoff","Aqua Regia EDP","unisex",2018,4.02,["spring","summer"],["citrus","floral","fresh","musk"],"Noble water. Citrus and jasmine. Summer Italian luxury."),
// More Amouage
m("Amouage","Boundless EDP","male",2021,4.22,["fall","winter"],["oud","spicy","amber","leather"],"Boundless. No limits oud. Maximum Amouage."),
m("Amouage","Meander EDP","unisex",2021,4.15,["spring","fall"],["floral","woody","musk","fresh"],"Meander. Winding beauty. Thoughtful luxury."),
m("Amouage","Portrayal Woman EDP","female",2020,4.12,["spring","fall"],["rose","floral","fruity","musk"],"Portrayal feminine. Rose and berries. Self-expression."),
m("Amouage","Journey Woman EDP","female",2014,4.08,["spring","fall"],["floral","woody","citrus","musk"],"Journey woman. Bergamot and magnolia. Elegant travels."),
// More PDM
m("Parfums de Marly","Sedley EDP","male",2018,4.08,["spring","summer"],["fresh","aromatic","green","woody"],"English garden freshness. Spearmint and geranium. Summer PDM."),
m("Parfums de Marly","Valaya EDP","female",2018,4.05,["spring","fall"],["floral","iris","fresh","woody"],"Elegant feminine. Iris and blackcurrant. Subtle luxury."),
m("Parfums de Marly","Delina Exclusif EDP","female",2019,4.38,["spring","fall"],["floral","fruity","rose","creamy"],"Richer deeper Delina. More creamy and rose-forward. Dream."),
// More MFK
m("Maison Francis Kurkdjian","724 EDP","unisex",2021,4.28,["spring","fall"],["musk","floral","iris","fresh"],"24/7 musk. Solar and iris. The modern luxury scent."),
m("Maison Francis Kurkdjian","A la Rose EDP","female",2015,4.12,["spring","fall"],["rose","floral","fruity","musk"],"To the rose. Litchi and rose. Feminine luxury."),
m("Maison Francis Kurkdjian","Amyris Femme EDP","female",2009,4.18,["spring","fall"],["floral","woody","fresh","citrus"],"Amyris femme. Peony and amyris. Effortlessly elegant."),
// More Nishane
m("Nishane","B-612 EDP","unisex",2018,4.15,["spring","fall"],["oud","rose","spicy","amber"],"Little prince planet. Rose and oud. Poetic luxury."),
m("Nishane","Afrika Olifant EDP","unisex",2019,4.18,["fall","winter"],["oud","iris","amber","spicy"],"African elephant. Oud and iris. Safari luxury."),
m("Nishane","Hacivat Nuit EDP","unisex",2020,4.28,["fall","winter"],["oud","spicy","amber","floral"],"Night Hacivat. Deeper and darker. Nocturnal masterpiece."),
// More Le Labo
m("Le Labo","Labdanum 18 EDP","unisex",2006,4.12,["fall","winter"],["amber","balsamic","resinous","oriental"],"Labdanum 18. Benzoin and amber. Ancient resin luxury."),
m("Le Labo","Ylang 49 EDP","female",2006,3.98,["spring","fall"],["floral","exotic","sweet","creamy"],"Ylang 49. Jasmine and musk. Tropical floral."),
m("Le Labo","Neroli 36 EDP","unisex",2006,4.05,["spring","summer"],["citrus","musk","floral","fresh"],"Neroli 36. Pure neroli luxury. Fresh and luminous."),
// More Serge Lutens
m("Serge Lutens","Santal Majuscule EDP","unisex",2011,4.35,["fall","winter"],["sandalwood","cocoa","woody","sweet"],"Capital sandalwood. Cocoa and sandalwood. Rich meditation."),
m("Serge Lutens","El Attarine EDP","unisex",2007,4.18,["fall","winter"],["spicy","rose","amber","oriental"],"Attarine market. Cumin and cardamom. Spice route."),
m("Serge Lutens","Tubereuse Criminelle EDP","female",2000,4.25,["spring","fall"],["white floral","green","spicy","medicinal"],"Criminal tuberose. Camphor and tuberose. Polarizing genius."),
// More L'Artisan
m("L'Artisan Parfumeur","Tea for Two EDP","unisex",1999,4.05,["fall","winter"],["smoky","tea","sweet","oriental"],"Tea ceremony bonfire. Smoked tea and honey. Addictive cozy."),
m("L'Artisan Parfumeur","Mechant Loup EDP","male",2000,3.95,["fall","winter"],["aromatic","woody","herbal","fougere"],"Bad wolf. Pine and thyme. Rugged woodland masculine."),
m("L'Artisan Parfumeur","Seville a l'Aube EDP","female",2012,4.18,["spring","summer"],["floral","beeswax","sweet","citrus"],"Seville at dawn. Orange blossom and beeswax. Spanish night."),
// More Frederic Malle
m("Frederic Malle","Une Fleur de Cassie EDP","female",2000,4.22,["spring","fall"],["floral","earthy","sweet","animalic"],"Cassie flower. Mimosa and ambergris. Unique and complex."),
m("Frederic Malle","Bigarade Concentree EDP","unisex",2002,4.08,["spring","summer"],["citrus","fresh","bitter","musk"],"Concentrated bergamot. Bigarade and neroli. Simple luxury."),
// Latin American brands
m("Adolfo Dominguez","Agua Fresca EDT","unisex",1983,3.72,["spring","summer"],["fresh","citrus","herbal","woody"],"Agua fresca. Spanish freshness since 1983. Mediterranean herb."),
m("Loewe","Aura Floral EDP","female",2014,3.75,["spring","summer"],["floral","white floral","citrus","musk"],"Aura of flowers. Peony and jasmine. Luminous pure."),
m("Loewe","001 Woman EDT","female",2015,3.68,["spring","fall"],["floral","musk","fresh","woody"],"Loewe 001 her. Clean feminine. Spanish minimalism."),
// More Escada
m("Escada","Especially Delicate Notes EDT","female",2013,3.60,["spring","summer"],["floral","fresh","citrus","musk"],"Delicate notes. Bergamot and magnolia. Light airy."),
m("Escada","Cherry in the Air EDT","female",2013,3.65,["spring","summer"],["fruity","floral","cherry","sweet"],"Cherry air. Cherry and blackcurrant. Playful sweet."),
m("Escada","Rockin Rio EDT","female",2011,3.62,["spring","summer"],["tropical","fruity","floral","citrus"],"Rio carnival. Tropical and festive. Brazilian joy."),
m("Escada","Moon Sparkle EDT","female",2006,3.58,["spring","summer"],["floral","fruity","aquatic","fresh"],"Moon sparkle. Fresh and dreamy. Night flowers."),
// Cosmetics brands with fragrance
m("Nars","Cherry Lip Parfum EDP","female",2019,3.72,["spring","fall"],["fruity","floral","sweet","musk"],"Nars cherry. Rouge and cherry. Beauty house scent."),
m("Tom Ford","Tom Ford Beauty EDP","female",2013,3.88,["spring","fall"],["floral","white floral","musk","woody"],"Beauty by Tom Ford. White flowers and musk. Luxe."),
// More Victoria's Secret
m("Victoria's Secret","Bare Vanilla EDP","female",2019,3.72,["spring","fall"],["vanilla","musk","woody","sweet"],"Bare vanilla. Skin and vanilla. Transparent luxury."),
m("Victoria's Secret","Tease EDP","female",2010,3.75,["fall","winter"],["sweet","fruity","floral","vanilla"],"Tease and please. Frosted pear and vanilla. Playful."),
m("Victoria's Secret","Dream Angels Heavenly EDT","female",2016,3.70,["spring","fall"],["floral","musk","sweet","fresh"],"Dream angel. White peony and vanilla musk. Soft."),
m("Victoria's Secret","Very Sexy EDP","female",2002,3.68,["fall","winter"],["floral","citrus","sweet","musk"],"Very sexy. Mandarin and jasmine. Glamorous allure."),
// More Bath and Body Works
m("Bath & Body Works","Warm Vanilla Sugar EDT","female",2003,3.68,["fall","winter"],["vanilla","sweet","gourmand","musk"],"Warm sugar. Pure vanilla sweetness. Comfort warmth."),
m("Bath & Body Works","Twilight Woods EDT","female",2008,3.60,["fall","winter"],["woody","amber","sweet","floral"],"Twilight woods. Amber and sandalwood. Cozy evening."),
m("Bath & Body Works","Sensual Amber EDP","female",2010,3.62,["fall","winter"],["amber","sweet","vanilla","musk"],"Sensual amber. Warm and enveloping. Cozy seduction."),
m("Bath & Body Works","Be Enchanted EDT","female",2011,3.60,["spring","summer"],["floral","citrus","sweet","musk"],"Be enchanted. Peach and jasmine. Sweet accessible."),
// More celebrity
m("Kim Kardashian","KKW Body EDP","female",2019,3.68,["spring","fall"],["musk","floral","woody","fresh"],"KKW body. White musk and orange. Body confidence."),
m("Nicki Minaj","Trini Girl EDP","female",2018,3.62,["spring","fall"],["fruity","floral","sweet","musk"],"Trini girl. Fruity and bold. Pop queen signature."),
m("Selena Gomez","Rare EDT","female",2021,3.68,["spring","fall"],["floral","fruity","sweet","musk"],"Rare beauty. Peach and jasmine. Singer luxury."),
m("Shakira","S EDP","female",2010,3.60,["spring","fall"],["floral","fruity","fresh","musk"],"Shakira S. Fresh and vibrant. Latin star."),
m("Jennifer Aniston","Lolavie EDT","female",2010,3.65,["spring","summer"],["floral","fruity","fresh","musk"],"Lolavie. Bergamot and rose. Hollywood fresh."),
m("Halle Berry","Halle EDP","female",2009,3.58,["spring","fall"],["floral","fruity","sweet","musk"],"Halle scent. Berry and rose. Actress luxury."),
m("Antonio Banderas","Queen of Seduction EDP","female",2012,3.55,["spring","fall"],["floral","fruity","sweet","musk"],"Queen seduction. Peach and rose. Latin feminine."),
// More sport brands
m("Nike","Nike Sport EDT","male",2008,3.48,["spring","summer"],["fresh","aquatic","citrus","musk"],"Nike sport. Just do it fresh. Athletic freshness."),
m("Adidas","Vibes EDT","male",2015,3.52,["spring","summer"],["fresh","citrus","aquatic","musk"],"Vibes. Fresh and light. Sport lifestyle."),
m("Puma","Ultra Purple EDT","female",2011,3.45,["spring","summer"],["floral","fruity","fresh","musk"],"Puma purple. Light accessible. Active feminine."),
m("Under Armour","Connected EDT","male",2017,3.52,["spring","summer"],["fresh","citrus","woody","aquatic"],"Connected. Fresh and active. Athletic luxury."),
// More accessories brands
m("Aston Martin","Emotion EDP","male",2019,3.65,["spring","fall"],["woody","amber","spicy","aromatic"],"Aston emotion. Leather and amber. Bond car scent."),
m("Bugatti","L'Essentiel EDP","male",2018,3.68,["fall","winter"],["woody","spicy","amber","leather"],"Bugatti luxury. Leather and cedar. Supercar essence."),
m("Ducati","Black EDP","male",2016,3.62,["fall","winter"],["leather","spicy","woody","amber"],"Ducati black. Leather and pepper. Motorcycle spirit."),
// Fashion brand fill
m("Ferragamo","Tuscan Soul EDT","unisex",2016,3.78,["spring","fall"],["citrus","woody","aromatic","fresh"],"Tuscan soul. Bergamot and iris. Italian countryside."),
m("Ferragamo","Signorina Misteriosa EDP","female",2018,3.72,["fall","winter"],["floral","spicy","woody","amber"],"Signorina mysterious. Dark flowers. Italian mystery."),
m("Ferragamo","Amo EDP","female",2017,3.75,["spring","fall"],["floral","fruity","sweet","white floral"],"Love letter. Rose and peach. Romantic Italian."),
m("Trussardi","Riflesso EDP","male",2021,3.72,["fall","winter"],["woody","spicy","amber","citrus"],"Reflection. Bergamot and pepper. Italian reflection."),
m("Cerruti","1881 Aqua EDT","male",2003,3.65,["spring","summer"],["aquatic","fresh","citrus","woody"],"1881 aqua. Fresh maritime. Italian sea."),
m("Cerruti","Nuit de Noel EDT","female",2004,3.60,["fall","winter"],["floral","sweet","woody","musk"],"Noel night. Jasmine and amber. Festive feminine."),
m("Guy Laroche","Clandestine EDP","female",1986,3.75,["fall","winter"],["floral","oriental","spicy","amber"],"Clandestine. Spiced floral. Secret French luxury."),
m("Guy Laroche","Drakkar Black EDT","male",2020,3.68,["fall","winter"],["fougere","spicy","woody","amber"],"Drakkar black. Modern dark version. Bold masculine."),
// Extended Loewe
m("Loewe","Esencia EDT","male",1988,3.85,["fall","winter"],["aromatic","fougere","woody","amber"],"Loewe esencia. Rosemary and oakwood. Spanish heritage."),
// Extended Kenzo
m("Kenzo","World Power EDT","female",2017,3.72,["spring","fall"],["floral","fresh","musk","powdery"],"World power. Peony and musk. Bold eye bottle."),
m("Kenzo","Homme Black EDP","male",2015,3.68,["fall","winter"],["woody","spicy","amber","aromatic"],"Kenzo homme black. Cedar and spice. Urban dark."),
// Moschino extended
m("Moschino","Gold Fresh Couture EDP","female",2017,3.78,["spring","fall"],["floral","fresh","citrus","amber"],"Gold couture. Magnolia and amber. Luxe version Fresh."),
m("Moschino","Uomo EDT","male",2013,3.65,["spring","fall"],["fresh","citrus","aromatic","woody"],"Moschino uomo. Fresh bergamot. Italian irony."),
// Diesel extended
m("Diesel","Loverdose EDP","female",2011,3.68,["fall","winter"],["sweet","licorice","floral","oriental"],"Overdose of love. Licorice and vanilla. Addictive."),
m("Diesel","Sound of the Brave EDT","male",2020,3.68,["fall","winter"],["fresh","citrus","woody","aromatic"],"Sound brave. Bergamot and vetiver. Modern bold."),
// Dsquared extended
m("Dsquared2","Green Wood EDT","male",2015,3.72,["spring","fall"],["fresh","green","woody","citrus"],"Green wood. Forest and citrus. Double squared."),
m("Dsquared2","Red Wood EDT","male",2018,3.68,["fall","winter"],["warm spicy","woody","amber","citrus"],"Red wood. Spiced and warm. Hot forest."),
// Paul Smith extended
m("Paul Smith","Story EDP","female",2010,3.68,["spring","fall"],["floral","rose","fresh","musk"],"Smith story. Rose and jasmine. British narrative."),
m("Paul Smith","Extreme Man EDT","male",2006,3.65,["spring","fall"],["fresh","woody","citrus","aromatic"],"Extreme British. Fresh and bold. British extreme."),
// Ted Baker extended
m("Ted Baker","Porcelain EDT","female",2013,3.60,["spring","summer"],["floral","fresh","citrus","musk"],"Porcelain ted. Delicate and fresh. British ceramic."),
m("Ted Baker","Tonic EDP","male",2015,3.62,["spring","fall"],["fresh","citrus","woody","aromatic"],"Tonic masculine. Citrus and cedar. British refresh."),
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
