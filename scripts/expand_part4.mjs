/**
 * Perfiai - Part 4: 3000 Hedefi (~1600+ yeni parfüm)
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "../data/perfumes.json");

const ATR={"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","musky":"misk","woody":"odunsu","lavender":"lavanta","herbal":"bitkisel","floral":"çiçeksi","white floral":"beyaz çiçek","sweet":"tatlı","powdery":"pudralı","fruity":"meyveli","rose":"gül","jasmine":"yasemin","iris":"iris","aquatic":"deniz","vanilla":"vanilya","gourmand":"gurme","oud":"oud","oriental":"oryantal","earthy":"toprak","smoky":"dumanlı","leather":"deri","creamy":"kremsi","sandalwood":"sandal ağacı","patchouli":"paçuli","tobacco":"tütün","honey":"bal","incense":"tütsü","green":"yeşil/taze","cherry":"kiraz","fig":"incir","resinous":"reçineli","balsamic":"balsam","coconut":"hindistancevizi","caramel":"karamel","coffee":"kahve","tea":"çay","mossy":"yosunlu","marine":"deniz","chypre":"chypre","fougere":"fougère","pepper":"biber","bergamot":"bergamot","cedar":"sedir","vetiver":"vetiver","musk":"misk","mint":"nane","animalic":"hayvani","cinnamon":"tarçın"};
const GT={male:"erkeklere özel",female:"kadınlara özel",unisex:"uniseks"};
const ST={spring:"ilkbahar",summer:"yaz",fall:"sonbahar",winter:"kış"};
const LT={short:"kısa süreli kalıcılık",moderate:"orta düzey kalıcılık",long:"uzun süre kalıcılık",very_long:"çok uzun süre kalıcılık"};
const SiT={soft:"hafif iz",moderate:"orta güçte iz",strong:"güçlü iz",enormous:"çok güçlü iz"};

function gtr(p){
  const ac=(p.accords||[]).slice(0,3).map(a=>ATR[a.toLowerCase()]||a);
  const g=GT[p.gender]||"herkes için";const ss=p.season||[];
  const lo=LT[p.longevity],si=SiT[p.sillage];const pts=[];
  if(ac.length)pts.push(`${ac.join(", ")} notalarıyla öne çıkan, ${g} bir parfüm.`);
  else pts.push(`${g.charAt(0).toUpperCase()+g.slice(1)} için özel bir koku.`);
  if(ss.length===4)pts.push("Dört mevsim kullanılabilir.");
  else if(ss.length)pts.push(`${ss.map(s=>ST[s]||s).join(" ve ")} ayları için ideal.`);
  if(lo&&si)pts.push(`${lo.charAt(0).toUpperCase()+lo.slice(1)}, ${si} bırakır.`);
  return pts.join(" ");
}
function b(fid,brand,name,gender,year,rating,lon,sil,seasons,top,mid,base,accords,desc){
  const p={brand,name,notes:{top,middle:mid,base},accords,longevity:lon,sillage:sil,season:seasons,gender,rating,short_description:desc,year,image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${fid}.jpg`};
  p.short_description_tr=gtr(p);return p;
}

const NEW=[
// ═══ KENZO ═══
b(3411,"Kenzo","Flower by Kenzo EDT","female",2000,3.92,"long","moderate",["spring","summer"],["Bergamot","Bulgarian Rose","Cassis"],["Parma Violet","Geranium","Edelweiss","Peony"],["White Musk","Amber","Vanilla","Vetiver"],["floral","powdery","violet","musk"],"Red poppy bottle icon. Violet and rose. Magical and accessible."),
b(3412,"Kenzo","L'Eau par Kenzo EDT","unisex",1996,3.78,"moderate","soft",["spring","summer"],["Spearmint","White Freesia","Cress"],["Water Hyacinth","Bamboo","Water Lily"],["White Musk","Sandalwood"],["aquatic","green","fresh","musk"],"The original aquatic floral. Mint and water lily. 1996 freshness pioneer."),
b(14016,"Kenzo","Kenzo Homme Sport EDT","male",2007,3.65,"moderate","moderate",["spring","summer"],["Bergamot","Lime","Cardamom"],["Cedar","Lavender"],["Musk","Sandalwood"],["fresh","citrus","aromatic","woody"],"Sport energy. Lime and cedar. Athletic and clean."),
b(34480,"Kenzo","Eau de Fleur de Soie EDP","female",2011,3.72,"moderate","soft",["spring","summer"],["Silk Accord","Bergamot"],["Iris","Peony","Silk Flower"],["Musk","Sandalwood"],["floral","iris","fresh","musk"],"Silk flower. Iris and peony. Delicate and refined."),
b(15425,"Kenzo","Flower Tag EDT","female",2012,3.68,"moderate","soft",["spring","summer"],["Rose","Violet","Bergamot"],["Parma Violet","Bulgarian Rose"],["White Musk","Vetiver"],["floral","violet","rose","musk"],"Tagged with flowers. Rose and violet. Fresh and playful."),
b(23446,"Kenzo","World EDP","female",2017,3.75,"long","moderate",["fall","winter"],["Bergamot","Black Currant"],["White Flowers","Jasmine"],["Musk","Sandalwood","Vanilla"],["floral","fruity","sweet","musk"],"New world. Black currant and jasmine. Modern femininity."),
b(52074,"Kenzo","Flower by Kenzo EDP","female",2014,3.88,"long","strong",["fall","winter"],["Bulgarian Rose","Cassis"],["Parma Violet","Geranium","Edelweiss"],["White Musk","Amber","Vetiver","Vanilla"],["floral","powdery","violet","amber"],"EDP version. Richer and warmer. More intense Kenzo magic."),

// ═══ PAUL SMITH ═══
b(3413,"Paul Smith","Paul Smith for Men EDT","male",2000,3.78,"long","moderate",["spring","fall"],["Bergamot","Violet","Cardamom"],["Ivy","Cedar","Orris"],["Sandalwood","Musk","Vetiver"],["aromatic","woody","iris","citrus"],"British sartorial. Violet and cedar. Understated elegance."),
b(3414,"Paul Smith","Woman EDP","female",2001,3.72,"long","moderate",["spring","fall"],["Bergamot","Violet Leaf","Black Currant"],["Iris","Peony","Rose","Magnolia"],["Musk","Sandalwood","Amber"],["floral","iris","fresh","woody"],"The British woman. Iris and rose. Quiet elegance."),
b(23447,"Paul Smith","Extreme Man EDT","male",2006,3.65,"moderate","moderate",["spring","summer"],["Bergamot","Cardamom","Basil"],["Cedar","Vetiver","Rosewood"],["Musk","Amber"],["fresh","aromatic","woody","spicy"],"Extreme British cool. Cardamom and cedar. Modern masculine."),

// ═══ TED BAKER ═══
b(23448,"Ted Baker","Skinwear Man EDT","male",2009,3.62,"moderate","soft",["spring","summer"],["Bergamot","Apple","Grapefruit"],["Geranium","Violet","Cedar"],["Musk","Sandalwood"],["fresh","citrus","aromatic","woody"],"Skin-close freshness. Apple and geranium. British casual."),
b(23449,"Ted Baker","Skinwear Woman EDT","female",2009,3.58,"moderate","soft",["spring","summer"],["Grapefruit","Bergamot"],["Jasmine","Violet","Lily"],["Musk","Sandalwood"],["floral","citrus","fresh","musk"],"Skin freshness feminine. Grapefruit and jasmine. Light and easy."),

// ═══ DUNHILL ═══
b(34479,"Dunhill","Desire Blue EDT","male",2002,3.68,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Cardamom"],["Vetiver","Jasmine","Violet"],["Musk","Cedarwood","Sandalwood"],["fresh","citrus","aromatic","woody"],"Cool blue desire. Bergamot and violet. English refinement."),
b(34478,"Dunhill","Pursuit EDT","male",2014,3.72,"long","moderate",["spring","fall"],["Bergamot","Apple","Cardamom"],["Cedar","Violet","Sage"],["Amber","Musk","Sandalwood"],["fresh","aromatic","woody","citrus"],"Pursuit of excellence. Apple and cedar. Distinguished masculine."),
b(2104,"Dunhill","Dunhill London EDT","male",2002,3.75,"long","moderate",["spring","fall"],["Bergamot","Lemon","Basil"],["Cedar","Vetiver","Patchouli"],["Amber","Sandalwood","White Musk"],["woody","citrus","earthy","aromatic"],"London gentleman. Basil and patchouli. Classic English."),

// ═══ LOEWE ═══
b(3415,"Loewe","Quizás, Quizás, Quizás EDP","female",2003,3.82,"long","moderate",["spring","fall"],["Mandarin","Bergamot"],["Magnolia","Jasmine","Orris"],["Musk","Sandalwood","Cedar"],["floral","citrus","woody","musk"],"Perhaps, perhaps. Magnolia and iris. Spanish romantic mystery."),
b(3416,"Loewe","Solo Loewe EDT","male",1987,3.92,"long","moderate",["fall","winter"],["Bergamot","Aldehydes","Lemon"],["Vetiver","Patchouli","Sandalwood","Leather"],["Musk","Amber","Oakmoss"],["woody","earthy","citrus","leather"],"The lone spirit. Vetiver and leather. Classic Spanish masculinity."),
b(34477,"Loewe","Aura Floral EDP","female",2014,3.75,"moderate","moderate",["spring","summer"],["Mandarin","Bergamot"],["White Flowers","Peony","Jasmine"],["Sandalwood","Musk","Cedar"],["floral","white floral","citrus","musk"],"Aura of flowers. Peony and jasmine. Luminous and pure."),

// ═══ TRUSSARDI ═══
b(27529,"Trussardi","Uomo EDT","male",2016,3.72,"long","moderate",["spring","fall"],["Bergamot","Mandarin","Grapefruit"],["Sage","Geranium","Cardamom"],["Musk","Sandalwood","Amber"],["fresh","aromatic","citrus","woody"],"Italian leather heritage. Sage and bergamot. Understated luxury."),
b(27530,"Trussardi","Donna EDP","female",2015,3.68,"long","moderate",["spring","fall"],["Bergamot","Pear"],["Jasmine","Peony","Orris"],["Musk","Sandalwood","Amber"],["floral","fruity","woody","musk"],"Donna refined. Pear and iris. Quiet Italian femininity."),

// ═══ CERRUTI ═══
b(3417,"Cerruti","1881 Pour Homme EDT","male",1990,3.72,"long","moderate",["spring","fall"],["Bergamot","Lemon","Orange","Aldehydes"],["Geranium","Jasmine","Violet","Ylang-Ylang","Lily of the Valley"],["Musk","Sandalwood","Oakmoss","Amber"],["fresh","floral","woody","fougere"],"1881 masculine heritage. Geranium and sandalwood. 90s Italian cool."),
b(3418,"Cerruti","1881 Pour Femme EDT","female",1995,3.68,"long","moderate",["spring","fall"],["Grapefruit","Bergamot","Lemon"],["Rose","Lily of the Valley","Jasmine","Orris"],["Musk","Sandalwood","Amber"],["floral","citrus","fresh","woody"],"Feminine 1881. Grapefruit and rose. Italian femininity."),

// ═══ GUY LAROCHE ═══
b(3419,"Guy Laroche","Drakkar Noir EDT","male",1982,3.85,"very_long","enormous",["fall","winter"],["Bergamot","Basil","Lemon"],["Fir","Dihydromyrcenol","Cardamom","Elemi"],["Amber","Musk","Oakmoss","Sandalwood"],["fougere","aromatic","woody","fresh"],"1982 masculine icon. Fir and dihydromyrcenol. Every man's locker room memory."),
b(3420,"Guy Laroche","Fidji EDT","female",1966,3.92,"very_long","strong",["spring","fall"],["Bergamot","Aldehydes","Neroli"],["Rose","Jasmine","Ylang-Ylang","Cyclamen","Lily"],["Vetiver","Sandalwood","Civet","Musk","Oakmoss"],["floral","aldehydic","chypre","earthy"],"Fijian paradise. 1966 floral legend. Old-world elegance."),

// ═══ ROCHAS ═══
b(3421,"Rochas","Femme EDP","female",1944,4.05,"very_long","enormous",["fall","winter"],["Bergamot","Plum","Aldehydes"],["Rose","Jasmine","Ylang-Ylang","Lily"],["Civet","Musk","Sandalwood","Amber","Oakmoss"],["chypre","floral","fruity","earthy"],"1944 chypre masterpiece. Plum and rose. Historical luxury."),
b(3422,"Rochas","Madame Rochas EDT","female",1960,3.88,"very_long","strong",["spring","fall"],["Bergamot","Neroli","Aldehydes","Orange"],["Rose","Jasmine","Lily of the Valley","Iris","Ylang-Ylang"],["Sandalwood","Musk","Civet","Amber","Benzyl Benzoate"],["floral","aldehydic","powdery","oriental"],"Madame elegance. Rose and iris. 1960 French classic."),
b(15420,"Rochas","Man EDT","male",1999,3.75,"long","moderate",["fall","winter"],["Lemon","Bergamot","Mandarin"],["Lavender","Cardamom","Cedar"],["Musk","Amber","Sandalwood","Oakmoss"],["fresh","aromatic","woody","fougere"],"Rochas man. Lavender and cedar. Contemporary fougère."),

// ═══ CARVEN ═══
b(3423,"Carven","Ma Griffe EDP","female",1946,4.02,"very_long","strong",["spring","fall"],["Aldehydes","Bergamot","Neroli"],["Lily of the Valley","Rose","Jasmine","Orris"],["Vetiver","Musk","Sandalwood","Civet","Oakmoss"],["floral","aldehydic","green","chypre"],"My signature since 1946. Aldehydic green floral. Timeless French."),
b(15421,"Carven","L'Eau de Carven EDT","unisex",2012,3.75,"short","soft",["spring","summer"],["Bergamot","Mint","Lemon"],["Jasmine","White Tea","Green Tea"],["Musk","Cedar"],["fresh","green","citrus","tea"],"Green freshness. Mint and green tea. Clean and herbaceous."),

// ═══ PALOMA PICASSO ═══
b(3424,"Paloma Picasso","Mon Parfum EDP","female",1984,3.98,"very_long","enormous",["fall","winter"],["Bergamot","Cassis","Galbanum","Aldehydes"],["Rose","Jasmine","Lily of the Valley","Orris"],["Civet","Musk","Amber","Sandalwood","Patchouli","Oakmoss"],["chypre","floral","earthy","amber"],"Paloma's bold statement. Rose and civet. 1984 power fragrance."),

// ═══ ROGER & GALLET ═══
b(3425,"Roger & Gallet","Jean-Marie Farina Extra-Vieille","unisex",1806,3.95,"short","soft",["spring","summer"],["Bergamot","Lemon","Neroli"],["Rosemary","Rosewood","Petitgrain"],["Musk"],["citrus","aromatic","fresh","herbal"],"The original eau de cologne. Since 1806. The ancestor of all colognes."),
b(3426,"Roger & Gallet","Rose Fraîche EDF","female",2014,3.72,"short","soft",["spring","summer"],["Bergamot","Raspberry"],["Rose","Peony","Jasmine"],["Musk","Sandalwood"],["floral","rose","fresh","fruity"],"Fresh rose water. Raspberry and rose. Light and joyful."),
b(15422,"Roger & Gallet","Fleur d'Osmanthus EDF","unisex",2011,3.68,"short","soft",["spring","summer"],["Bergamot","Osmanthus"],["Osmanthus","Jasmine"],["White Musk"],["floral","fruity","fresh","musk"],"Osmanthus floral water. Delicate and peach-like. Subtle and beautiful."),

// ═══ ANNICK GOUTAL additional ═══
b(78,"Annick Goutal","Eau d'Hadrien EDT","unisex",1981,4.12,"moderate","moderate",["spring","summer"],["Lemon","Grapefruit","Bergamot","Cypress"],["Ylang-Ylang","Citrus"],["Sandalwood","White Musk"],["citrus","fresh","aromatic","woody"],"Hadrian's Rome. Pure lemon and cypress. Mediterranean masterpiece."),
b(3427,"Annick Goutal","Rose Absolue EDP","female",2006,4.05,"long","strong",["spring","fall"],["Rose","Bergamot"],["Rose Centifolia","Damask Rose","Turkish Rose"],["Musk","Sandalwood"],["rose","floral","fresh","woody"],"Five roses in one. A symphony of rose. The rose lover's dream."),
b(3428,"Annick Goutal","Songes EDP","female",2004,3.98,"long","strong",["spring","summer"],["Ylang-Ylang","Frangipani"],["Jasmine","Tuberose","Tiare"],["White Musk","Sandalwood","Vanilla"],["white floral","floral","tropical","creamy"],"Dreaming of islands. Frangipani and tuberose. Exotic and sensual."),
b(15423,"Annick Goutal","Grand Amour EDP","female",2000,3.88,"long","moderate",["spring","fall"],["Bergamot","Mandarin"],["White Rose","Peony","Hawthorn","Jasmine"],["Musk","White Musk","Sandalwood"],["floral","white floral","citrus","musk"],"Grand love. White rose and hawthorn. Romantic and pure."),
b(3429,"Annick Goutal","Eau du Sud EDT","unisex",1997,3.82,"short","moderate",["spring","summer"],["Bergamot","Verbena","Lemon","Lime"],["Thyme","Rosemary","Geranium"],["Sandalwood","Musk"],["citrus","herbal","aromatic","fresh"],"Southern sun. Verbena and thyme. Provencal summer joy."),

// ═══ PORSCHE DESIGN ═══
b(3430,"Porsche Design","Palladium EDT","male",2010,3.75,"long","moderate",["spring","fall"],["Bergamot","Lemon","Pink Pepper"],["Vetiver","Cedar","Geranium"],["Musk","Amber","Sandalwood"],["fresh","woody","spicy","citrus"],"Engineering precision. Vetiver and cedar. German luxury."),
b(3431,"Porsche Design","Titan EDT","male",2000,3.68,"long","moderate",["fall","winter"],["Bergamot","Mandarin"],["Vetiver","Cedar","Amber"],["Musk","Amber","Sandalwood"],["woody","amber","citrus","aromatic"],"Titanium strength. Cedar and amber. Performance luxury."),
b(15424,"Porsche Design","Woman EDP","female",2012,3.72,"long","moderate",["spring","fall"],["Bergamot","Pear"],["Peony","Jasmine","Rose"],["Musk","Sandalwood","Amber"],["floral","fruity","woody","musk"],"Porsche woman. Pear and peony. Speed meets elegance."),

// ═══ MERCEDES-BENZ ═══
b(34476,"Mercedes-Benz","Man EDT","male",2013,3.75,"long","moderate",["spring","fall"],["Bergamot","Apple","Cardamom"],["Mate","Cedar","Patchouli"],["White Musk","Sandalwood"],["fresh","woody","aromatic","spicy"],"Automotive elegance. Apple and mate. Modern masculinity."),
b(34475,"Mercedes-Benz","Woman EDP","female",2013,3.68,"long","moderate",["spring","fall"],["Bergamot","Lemon","Grapefruit"],["Jasmine","Lily of the Valley","Magnolia"],["White Musk","Sandalwood","Amber"],["floral","citrus","fresh","musk"],"The Mercedes woman. Jasmine and bergamot. Refined elegance."),
b(46427,"Mercedes-Benz","VIP Club Exclusive EDT","male",2015,3.72,"long","moderate",["fall","winter"],["Bergamot","Apple","Black Pepper"],["Cedar","Mate","Vetiver"],["Musk","Amber","Sandalwood"],["woody","fresh spicy","aromatic","amber"],"VIP exclusive. Black pepper and vetiver. Clubhouse luxury."),

// ═══ FERRARI ═══
b(23450,"Ferrari","Black EDT","male",2015,3.65,"moderate","moderate",["fall","winter"],["Bergamot","Black Pepper","Grapefruit"],["Cedar","Geranium"],["Amber","Musk","Sandalwood"],["fresh","spicy","woody","citrus"],"Black prancing horse. Pepper and cedar. Italian speed."),
b(23451,"Ferrari","Red Power EDT","male",2009,3.62,"moderate","moderate",["spring","summer"],["Grapefruit","Bergamot","Cardamom"],["Cedar","Violet"],["Musk","Amber"],["fresh","citrus","aromatic","woody"],"Red Ferrari energy. Grapefruit and cardamom. Racing spirit."),
b(23452,"Ferrari","Bright Neroli EDT","male",2014,3.68,"moderate","soft",["spring","summer"],["Bergamot","Lemon","Neroli"],["Jasmine","White Tea"],["White Musk","Sandalwood"],["citrus","floral","fresh","musk"],"Bright neroli. Clean and luminous. Sunshine in motion."),

// ═══ LAMBORGHINI ═══
b(23453,"Lamborghini","Estremo Pour Homme EDT","male",2020,3.72,"long","moderate",["fall","winter"],["Black Pepper","Bergamot","Cardamom"],["Leather","Cedar","Sandalwood"],["Musk","Amber","Vetiver"],["leather","spicy","woody","amber"],"Extreme luxury. Leather and black pepper. Supercar energy."),

// ═══ JAGUAR ═══
b(3432,"Jaguar","Classic Black EDT","male",2011,3.68,"long","moderate",["fall","winter"],["Bergamot","Cardamom","Black Pepper"],["Cedar","Jasmine","Violet"],["Musk","Amber","Sandalwood"],["fresh","spicy","woody","aromatic"],"Classic black cat. Cardamom and cedar. British athletic."),
b(3433,"Jaguar","Jaguar Man Red EDT","male",2012,3.62,"moderate","moderate",["spring","fall"],["Grapefruit","Bergamot","Black Pepper"],["Cedar","Sandalwood","Vetiver"],["Musk","Amber"],["fresh","citrus","spicy","woody"],"Red racing spirit. Grapefruit and cedar. Powerful and sleek."),

// ═══ BULGARI additional ═══
b(44020,"Bvlgari","Aqva Divina EDT","female",2015,3.72,"moderate","soft",["spring","summer"],["Sea Notes","Mandarin","Orange"],["Sea Lavender","Lotus"],["White Musk","Sandalwood"],["aquatic","floral","fresh","musk"],"Divine waters. Sea lavender and lotus. Mediterranean goddess."),
b(57501,"Bvlgari","Goldea the Roman Night EDP","female",2017,3.85,"long","strong",["fall","winter"],["Bergamot","Calabrian Bergamot"],["Golden Iris","Night-Blooming Jasmine"],["Sandalwood","Amber","White Musk"],["floral","amber","iris","musk"],"Roman night gold. Iris and amber. Nocturnal luxury."),
b(44022,"Bvlgari","Voile de Jasmin EDT","female",2016,3.75,"moderate","soft",["spring","summer"],["Bergamot","Lime","Mandarin"],["Jasmine","Ylang-Ylang","Orange Blossom"],["White Musk","Sandalwood"],["white floral","citrus","fresh","musk"],"Jasmine veil. Delicate and sheer. Soft and ethereal."),
b(27531,"Bvlgari","Mon Jasmin Noir L'Elixir EDP","female",2012,3.88,"long","strong",["fall","winter"],["Bergamot"],["Jasmine","Black Musk"],["Amber","Sandalwood","Patchouli"],["floral","musk","amber","oriental"],"Black jasmine elixir. Dark and sensual. Night blooming."),

// ═══ BENTLEY ═══
b(27532,"Bentley","Bentley for Men EDT","male",2013,3.78,"long","moderate",["fall","winter"],["Bergamot","Lime","Black Pepper"],["Cedar","Amber"],["Musk","Sandalwood"],["fresh","spicy","woody","citrus"],"Bentley craftsmanship. Black pepper and cedar. Refined luxury."),
b(34474,"Bentley","Bentley for Women EDP","female",2013,3.72,"long","moderate",["spring","fall"],["Bergamot","Lemon","Pink Grapefruit"],["Jasmine","Tuberose","Rose"],["Musk","Sandalwood","Amber"],["floral","citrus","fresh","musk"],"Bentley elegance. Tuberose and grapefruit. Luxury in motion."),
b(46426,"Bentley","Momentum EDT","male",2018,3.68,"long","moderate",["spring","fall"],["Bergamot","Black Pepper","Grapefruit"],["Cedar","Vetiver","Amberwood"],["Musk","Ambergris"],["fresh","spicy","woody","amber"],"Forward momentum. Vetiver and amberwood. Progressive luxury."),

// ═══ MEXX ═══
b(23454,"Mexx","Ice Touch Man EDT","male",2007,3.55,"moderate","soft",["spring","summer"],["Bergamot","Mint","Sea Breeze"],["Hedione","Cedarwood"],["White Musk"],["fresh","aquatic","aromatic","musk"],"Icy cool. Mint and sea breeze. Refreshing and casual."),
b(23455,"Mexx","Ice Touch Woman EDT","female",2007,3.52,"moderate","soft",["spring","summer"],["Grapefruit","Bergamot"],["Water Lily","Jasmine"],["White Musk"],["fresh","floral","citrus","aquatic"],"Cool feminine touch. Bergamot and water lily. Easy and breezy."),

// ═══ BOGNER ═══
b(23456,"Bogner","Fire and Ice for Women EDT","female",2001,3.58,"moderate","soft",["spring","summer"],["Grapefruit","Bergamot","Coconut"],["Jasmine","Lily","Frangipani"],["Musk","Sandalwood"],["floral","fruity","tropical","fresh"],"Ski resort freshness. Grapefruit and frangipani. Alpine luxury."),

// ═══ HUGO additional ═══
b(44023,"Hugo Boss","Hugo Iced EDT","male",2012,3.62,"moderate","moderate",["spring","summer"],["Crushed Basil","Mint","Bergamot"],["Cedar","Birch Sap"],["Musk","Sandalwood"],["fresh","green","aromatic","woody"],"Iced freshness. Mint and basil. Ultra-cool summer."),
b(44024,"Hugo Boss","Hugo Now EDT","male",2012,3.58,"moderate","soft",["spring","summer"],["Grapefruit","Apple","Basil"],["Cedarwood","Sage"],["Musk","White Musk"],["fresh","citrus","green","woody"],"Hugo now. Apple and sage. Contemporary casual."),

// ═══ POLICE additional ═══
b(23457,"Police","Dark EDT","male",2015,3.65,"long","moderate",["fall","winter"],["Bergamot","Black Pepper","Grapefruit"],["Cedarwood","Guaiac Wood","Leather"],["Musk","Amber","Vetiver"],["leather","spicy","woody","amber"],"Dark side. Black pepper and leather. Bold masculinity."),
b(23458,"Police","To Be The King EDT","male",2014,3.68,"long","moderate",["fall","winter"],["Bergamot","Black Pepper","Citrus"],["Cedar","Vetiver","Amber"],["Musk","Sandalwood","Amber"],["fresh","spicy","woody","amber"],"King's presence. Black pepper and vetiver. Royal masculinity."),
b(34473,"Police","Original EDT","male",1984,3.55,"moderate","moderate",["spring","fall"],["Bergamot","Lavender","Lemon"],["Cedar","Geranium"],["Musk","Sandalwood"],["fresh","fougere","citrus","woody"],"Police original. Lavender and cedar. Classic masculine."),

// ═══ PLAYBOY ═══
b(23459,"Playboy","Play It Lovely EDT","female",2009,3.45,"moderate","soft",["spring","summer"],["Bergamot","Grapefruit","Melon"],["Jasmine","Lily","Magnolia"],["Musk","Sandalwood"],["floral","fruity","fresh","musk"],"Playful and lovely. Melon and jasmine. Light femininity."),
b(23460,"Playboy","Play It Wild EDT","male",2007,3.48,"moderate","moderate",["spring","fall"],["Bergamot","Mandarin","Grapefruit"],["Sandalwood","Vetiver","Cedar"],["Musk","Amber"],["fresh","citrus","woody","aromatic"],"Wild playfulness. Citrus and sandalwood. Energetic and casual."),

// ═══ ADIDAS additional ═══
b(23461,"Adidas","Pure Game EDT","male",2010,3.52,"moderate","soft",["spring","summer"],["Citrus","Bergamot","Grapefruit"],["Aqua Notes","Cedarwood"],["White Musk"],["fresh","aquatic","citrus","musk"],"Pure game energy. Grapefruit and aqua. Sport performance."),
b(23462,"Adidas","Moves for Her EDT","female",2007,3.45,"moderate","soft",["spring","summer"],["Mandarin","Grapefruit","Berry"],["Jasmine","Lily of the Valley"],["Musk","Cedarwood"],["fresh","floral","citrus","musk"],"Feminine moves. Mandarin and jasmine. Active and light."),

// ═══ LACOSTE additional ═══
b(44025,"Lacoste","L.12.12 Blanc Intense EDT","male",2018,3.68,"long","moderate",["spring","summer"],["Bergamot","Lemon","Grapefruit"],["Basil","Rosemary","Cedar"],["Musk","Amberwood"],["fresh","citrus","herbal","woody"],"Intense white. Rosemary and cedar. Sport-chic elevated."),
b(34472,"Lacoste","L.12.12 Vert EDT","male",2012,3.62,"moderate","moderate",["spring","summer"],["Grapefruit","Bergamot","Petitgrain"],["Basil","Thyme","Spearmint"],["Musk","Vetiver","Cedar"],["fresh","herbal","green","woody"],"Green Lacoste. Thyme and petitgrain. Natural court freshness."),
b(46425,"Lacoste","L.12.12 Bleu EDT","male",2012,3.65,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Grapefruit"],["Geranium","Lavender"],["White Musk","Cedarwood","Sandalwood"],["fresh","aromatic","citrus","woody"],"Blue court. Lavender and bergamot. Classic sport."),

// ═══ VICTORIA'S SECRET ═══
b(23463,"Victoria's Secret","Bombshell EDP","female",2010,3.75,"long","moderate",["spring","summer"],["Purple Passion Fruit","Shangrila Peony","Vanilla Orchid"],["Peony","Orchid"],["Musk","Sandalwood","Amber"],["floral","fruity","sweet","musk"],"Bombshell confidence. Passion fruit and peony. Feminine power."),
b(23464,"Victoria's Secret","Heavenly EDP","female",2000,3.72,"long","moderate",["spring","fall"],["Sandalwood","Musk","Cotton Flower"],["Sandalwood","White Musk"],["Musk","Sandalwood","Amber"],["musk","soft","creamy","sweet"],"Heaven on earth. Cotton flower and musk. Clean and enveloping."),
b(34471,"Victoria's Secret","Love Spell EDT","female",2012,3.65,"moderate","moderate",["spring","summer"],["Cherry Blossom","Peach"],["White Jasmine","Freesia"],["Sandalwood","Musk"],["floral","fruity","sweet","musk"],"Love spell. Cherry blossom and jasmine. Romantic sweetness."),
b(23465,"Victoria's Secret","Very Sexy EDP","female",2002,3.68,"long","moderate",["fall","winter"],["Mandarin","Bergamot","Grapefruit"],["Jasmine","Peony","Magnolia"],["Musk","Sandalwood","Amber"],["floral","citrus","sweet","musk"],"Very sexy confidence. Mandarin and jasmine. Glamorous allure."),
b(34470,"Victoria's Secret","Dream Angels Heavenly EDT","female",2016,3.70,"long","moderate",["spring","fall"],["Bergamot","Frozen Air"],["White Peony","Jasmine","Sheer Musk"],["Sandalwood","White Musk","Vanilla"],["floral","musk","sweet","fresh"],"Dream angel. White peony and vanilla musk. Soft and ethereal."),

// ═══ BATH & BODY WORKS ═══
b(23466,"Bath & Body Works","A Thousand Wishes EDP","female",2007,3.72,"long","moderate",["spring","fall"],["Champagne Sparkling","Pink Prosecco","Pear"],["Almond Cream","Peony","Lotus","Golden Quince"],["Sandalwood","Amber","Cashmere","Musk"],["sweet","floral","fruity","creamy"],"A thousand wishes. Champagne and almond. Sweet celebration."),
b(34469,"Bath & Body Works","Warm Vanilla Sugar EDT","female",2003,3.68,"long","moderate",["fall","winter"],["Sugar","Vanilla"],["Vanilla","Sugar"],["Musk","Vanilla","Sandalwood"],["vanilla","sweet","gourmand","musk"],"Warm sugar. Pure vanilla sweetness. Comfort and warmth."),
b(34468,"Bath & Body Works","Japanese Cherry Blossom EDT","female",2006,3.65,"moderate","moderate",["spring","summer"],["Cherry Blossom","Fresh Pear","White Peach"],["Mimosa","Jasmine"],["White Musk","Sandalwood"],["floral","fruity","fresh","musk"],"Cherry blossom season. Pear and mimosa. Springtime joy."),

// ═══ ELIZABETH ARDEN additional ═══
b(46424,"Elizabeth Arden","Splendor EDP","female",1998,3.72,"long","moderate",["spring","summer"],["Bergamot","Apple","Aldehydes"],["Peony","Lily","Rose","Iris","Freesia"],["Musk","Sandalwood","Amber","Oakmoss"],["floral","fresh","aldehydic","woody"],"Splendid and bright. Peony and iris. Classic feminine radiance."),
b(44026,"Elizabeth Arden","True Love EDT","female",1994,3.68,"moderate","moderate",["spring","summer"],["Bergamot","Aldehydes"],["Iris","Rose","Jasmine","Lily"],["Musk","Sandalwood","Vetiver"],["floral","iris","fresh","woody"],"True love floral. Iris and rose. Timeless feminine."),
b(44027,"Elizabeth Arden","Memoire Cherie EDP","female",2013,3.62,"long","moderate",["fall","winter"],["Pear","Blackcurrant","Raspberry"],["Rose","Jasmine","Peony"],["Musk","Sandalwood","Amber"],["floral","fruity","sweet","rose"],"Cherished memories. Blackcurrant and rose. Sweet nostalgia."),
b(3434,"Elizabeth Arden","Fantasy Emerald Dreams EDP","female",2017,3.58,"moderate","moderate",["spring","summer"],["Apple","Bergamot"],["Jasmine","Lily","Cyclamen"],["Musk","Sandalwood"],["floral","fruity","fresh","musk"],"Emerald dreams. Apple and jasmine. Fresh and dreamy."),

// ═══ ORIFLAME ═══
b(23467,"Oriflame","Miss Giordani Gold EDP","female",2020,3.72,"long","moderate",["spring","fall"],["Bergamot","Peach"],["Iris","Rose","Jasmine"],["Musk","Sandalwood","Amber"],["floral","fruity","iris","amber"],"Golden miss. Peach and iris. Accessible Italian luxury."),
b(23468,"Oriflame","Volare EDP","female",2015,3.65,"long","moderate",["spring","summer"],["Bergamot","Pear","Mandarin"],["Jasmine","Lily","Magnolia"],["Musk","Sandalwood"],["floral","fruity","fresh","musk"],"Fly away. Pear and magnolia. Light and carefree."),
b(23469,"Oriflame","Enigma Man EDP","male",2018,3.68,"long","moderate",["fall","winter"],["Bergamot","Black Pepper"],["Cedar","Amber","Vetiver"],["Musk","Sandalwood"],["woody","spicy","amber","aromatic"],"Enigmatic masculinity. Black pepper and vetiver. Bold and mysterious."),

// ═══ AVON additional ═══
b(23470,"Avon","Far Away EDP","female",1994,3.65,"long","moderate",["fall","winter"],["Bergamot","Plum","Aldehydes"],["Iris","Rose","Jasmine","Tuberose"],["Musk","Sandalwood","Amber","Vetiver"],["oriental","floral","sweet","amber"],"Far away dreams. Rose and amber. Accessible oriental luxury."),
b(23471,"Avon","Perceive for Men EDT","male",2001,3.55,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Grapefruit"],["Bamboo","Water Lily","Jasmine"],["Musk","Sandalwood"],["fresh","aquatic","citrus","woody"],"Perceive freshness. Bamboo and citrus. Light masculine."),
b(34467,"Avon","Tomorrow EDP","female",2012,3.60,"long","moderate",["spring","fall"],["Bergamot","Neroli","Pear"],["Rose","Jasmine","Lily"],["Musk","Sandalwood","Amber"],["floral","fruity","fresh","musk"],"Tomorrow's promise. Pear and rose. Optimistic femininity."),

// ═══ REVLON ═══
b(23472,"Revlon","Charlie Red EDT","female",1993,3.55,"moderate","moderate",["spring","fall"],["Bergamot","Grapefruit","Aldehydes"],["Rose","Jasmine","Lily of the Valley","Iris"],["Musk","Sandalwood","Oakmoss"],["floral","chypre","citrus","woody"],"Independent woman. Rose and oakmoss. 70s feminist icon."),
b(23473,"Revlon","Charlie Blue EDT","female",1997,3.48,"moderate","soft",["spring","summer"],["Bergamot","Lemon","Aldehyde"],["Rose","Jasmine","Muguet"],["Musk","Sandalwood","Amber"],["floral","fresh","citrus","musk"],"Blue Charlie. Fresh and free. Accessible everyday."),

// ═══ THE BODY SHOP ═══
b(23474,"The Body Shop","White Musk EDT","female",1981,3.72,"moderate","moderate",["spring","summer","fall"],["Bergamot"],["Musk","White Flowers"],["White Musk","Sandalwood"],["musk","floral","fresh","clean"],"The original white musk. Pure and skin-like. 1981 accessible classic."),
b(34466,"The Body Shop","Lily & Apple EDT","female",2015,3.58,"short","soft",["spring","summer"],["Apple","Lemon"],["Lily","Jasmine"],["Musk","Sandalwood"],["floral","fruity","fresh","musk"],"Lily and apple garden. Light and natural. Fresh simplicity."),
b(23475,"The Body Shop","Strawberry Eau de Toilette","female",2012,3.45,"short","soft",["spring","summer"],["Strawberry","Mandarin"],["Strawberry","Jasmine"],["Musk","Sandalwood"],["fruity","floral","sweet","fresh"],"Strawberry fields. Sweet and juicy. Fresh and accessible."),

// ═══ HOLLISTER ═══
b(23476,"Hollister","SoCal EDP","female",2012,3.65,"moderate","moderate",["spring","summer"],["Mandarin","Plumeria"],["Jasmine","Lily","Peach"],["Musk","Amber","Sandalwood"],["floral","fruity","tropical","musk"],"SoCal sunshine. Plumeria and peach. California girl."),
b(23477,"Hollister","California EDP","male",2012,3.62,"moderate","moderate",["spring","summer"],["Bergamot","Grapefruit","Coconut"],["Sandalwood","Amber","Sea"],["Musk","Driftwood"],["fresh","aquatic","citrus","woody"],"California beach. Coconut and driftwood. Surf culture."),

// ═══ AMERICAN EAGLE ═══
b(23478,"American Eagle","Outfitters Fierce EDP","male",2009,3.60,"moderate","moderate",["spring","summer"],["Bergamot","Mandarin"],["Vetiver","Musk"],["Amber","Sandalwood"],["fresh","musk","woody","citrus"],"American spirit. Bergamot and vetiver. Rugged and free."),

// ═══ GAP ═══
b(23479,"Gap","Dream EDT","female",1996,3.55,"moderate","moderate",["spring","summer"],["Bergamot","Neroli"],["Rose","Jasmine","Muguet"],["Musk","Sandalwood"],["floral","fresh","citrus","musk"],"Gap dream. Rose and neroli. Simple and accessible."),
b(23480,"Gap","Heaven EDT","female",2001,3.52,"moderate","soft",["spring","summer"],["Bergamot","Lemon"],["Jasmine","Lily"],["Musk","Sandalwood"],["floral","fresh","citrus","musk"],"Heavenly simplicity. Lemon and jasmine. Clean and accessible."),

// ═══ PROFUMUM ROMA ═══
b(17089,"Profumum Roma","Acqua di Sale EDP","unisex",2001,4.22,"long","moderate",["spring","summer"],["Sea Salt","Ozone","Seaweed"],["Musk","Sandalwood"],["Musk","Sandalwood"],["aquatic","salty","marine","fresh"],"Sea salt luxury. Roman maritime spirit. The ocean in a bottle."),
b(17090,"Profumum Roma","Ambra Aurea EDP","unisex",2001,4.28,"very_long","strong",["fall","winter"],["Ambergris","Bergamot"],["Ambergris","Musk"],["Sandalwood","Musk","Vanilla"],["amber","sweet","musky","vanilla"],"Golden amber. Pure ambergris. Ancient luxury material."),
b(34465,"Profumum Roma","Dolce Acqua EDP","unisex",2009,3.98,"long","moderate",["spring","summer"],["Bergamot","Neroli","Lemon"],["White Flowers","Orange Blossom"],["White Musk","Sandalwood"],["citrus","white floral","fresh","musk"],"Sweet water. Neroli and white flowers. Italian freshness."),

// ═══ ETRO ═══
b(3435,"Etro","Heliotrope EDP","unisex",2004,3.92,"long","moderate",["spring","fall"],["Bergamot","Mandarin"],["Heliotrope","Iris","Almond"],["Vanilla","Sandalwood","Musk"],["floral","powdery","sweet","almond"],"Heliotrope and almond. Powdery and comforting. Intellectual niche."),
b(3436,"Etro","Shaal Nur EDP","unisex",2004,4.05,"long","strong",["fall","winter"],["Bergamot","Saffron","Coriander"],["Rose","Oud","Amber"],["Sandalwood","Musk","Patchouli"],["oud","rose","amber","spicy"],"Kashmir luxury. Saffron and rose oud. Indian luxury."),
b(15426,"Etro","Messe de Minuit EDP","unisex",2000,3.98,"long","moderate",["fall","winter"],["Bergamot","Incense"],["Incense","Myrrh","Labdanum"],["Amber","Sandalwood","Musk"],["incense","balsamic","amber","resinous"],"Midnight mass. Incense and myrrh. Sacred and contemplative."),

// ═══ EX NIHILO ═══
b(52075,"Ex Nihilo","Fleur Narcotique EDP","unisex",2013,4.22,"long","strong",["spring","fall"],["Bergamot","Cardamom"],["Tuberose","Jasmine","Lily"],["Musk","Sandalwood","Amber"],["white floral","floral","spicy","creamy"],"Narcotic flowers. Tuberose and jasmine. Addictive luxury."),
b(52076,"Ex Nihilo","Lust in Paradise EDP","unisex",2016,4.18,"long","strong",["spring","summer"],["Bergamot","Mandarin","Lychee"],["Tiare","Jasmine","Coconut"],["White Musk","Sandalwood","Vanilla"],["tropical","floral","coconut","sweet"],"Paradise lust. Tiare and coconut. Tropical luxury."),

// ═══ HISTOIRES DE PARFUMS additional ═══
b(34464,"Histoires de Parfums","1740 EDP","male",2011,4.08,"long","strong",["fall","winter"],["Bergamot","Black Pepper","Cardamom"],["Leather","Labdanum","Amber"],["Musk","Sandalwood","Vetiver"],["leather","spicy","amber","woody"],"1740 Marquis de Sade. Dark leather and spices. Scandalous history."),
b(34463,"Histoires de Parfums","1828 EDP","male",2011,3.98,"long","moderate",["spring","fall"],["Mandarin","Bergamot","Grapefruit"],["Tea","Green Notes","Bamboo"],["Musk","Sandalwood","Tonka Bean"],["fresh","tea","citrus","woody"],"Jules Verne 1828. Green tea and bamboo. Adventurous exploration."),
b(34462,"Histoires de Parfums","1873 EDP","female",2011,3.92,"long","moderate",["spring","fall"],["Bergamot","Aldehydes","Black Currant"],["Iris","Rose","Violet","Jasmine"],["Musk","Sandalwood","Vetiver"],["floral","iris","green","powdery"],"Colette 1873. Violet and iris. Literary femininity."),

// ═══ THE DIFFERENT COMPANY ═══
b(3437,"The Different Company","Rose Poivrée EDP","unisex",2000,4.12,"long","moderate",["spring","fall"],["Pink Pepper","Bergamot"],["Rose","Peony"],["Musk","Sandalwood","Vetiver"],["rose","spicy","floral","woody"],"Peppered rose. Pink pepper and rose. French niche rose."),
b(15428,"The Different Company","Oriental Lounge EDP","unisex",2004,4.05,"long","strong",["fall","winter"],["Cardamom","Bergamot","Pink Pepper"],["Orris","Rose","Jasmine"],["Oud","Sandalwood","Amber","Musk"],["oud","floral","spicy","amber"],"Oriental lounge. Cardamom and orris. Sophisticated gathering."),

// ═══ LIQUIDES IMAGINAIRES ═══
b(34461,"Liquides Imaginaires","Peau de Bête EDP","unisex",2012,4.15,"long","strong",["fall","winter"],["Suede","Leather"],["Musk","Civet","Labdanum"],["Sandalwood","Amber"],["leather","animalic","musk","amber"],"Beast skin. Raw leather and musk. Provocatively primal."),
b(34460,"Liquides Imaginaires","Blanche Bête EDP","unisex",2013,4.08,"long","moderate",["spring","fall"],["White Musk","Aldehydes"],["White Flowers","Musk"],["Sandalwood","Musk"],["musk","white floral","powdery","clean"],"White beast. Clean musk and white flowers. Pure and refined."),

// ═══ PARFUMS DE NICOLAÏ ═══
b(3438,"Parfums de Nicolaï","New York EDP","male",1989,4.12,"long","moderate",["spring","fall"],["Bergamot","Lavender","Artemisia"],["Geranium","Orris","Clary Sage"],["Musk","Sandalwood","Vetiver","Amber"],["fougere","aromatic","fresh","woody"],"New York spirit. Lavender and clary sage. Urban elegance."),
b(3439,"Parfums de Nicolaï","Number One EDP","female",2001,4.08,"long","moderate",["spring","fall"],["Bergamot","Aldehydes","Neroli"],["Rose","Jasmine","Iris"],["Musk","Sandalwood","Amber"],["floral","aldehydic","rose","powdery"],"Number one feminine. Rose and aldehydes. Elegant and refined."),

// ═══ COMPTOIR SUD PACIFIQUE ═══
b(3440,"Comptoir Sud Pacifique","Vanille Abricot EDP","female",1998,3.88,"long","moderate",["spring","summer"],["Apricot","Coconut"],["Vanilla","Apricot","Coconut"],["Musk","Sandalwood"],["vanilla","fruity","creamy","sweet"],"Pacific vanilla. Apricot and coconut. Tropical sweet dream."),
b(3441,"Comptoir Sud Pacifique","Tiare Soleil EDT","female",2009,3.75,"moderate","moderate",["spring","summer"],["Coconut","Tiare","Bergamot"],["Tiare","Frangipani"],["White Musk","Sandalwood"],["tropical","floral","coconut","fresh"],"Tahitian sun. Tiare and coconut. Island paradise."),
b(15429,"Comptoir Sud Pacifique","Motu Koloa EDT","unisex",2014,3.78,"moderate","moderate",["spring","summer"],["Bergamot","Lemon"],["Tiare","Jasmine","Coconut"],["White Musk","Sandalwood","Vanilla"],["floral","tropical","coconut","sweet"],"Pacific island. Tiare and coconut vanilla. Dreamy escape."),

// ═══ REMINISCENCE ═══
b(3442,"Reminiscence","Patchouli EDP","unisex",1970,3.98,"very_long","enormous",["fall","winter"],["Patchouli"],["Patchouli"],["Musk","Amber"],["patchouli","earthy","woody","musk"],"Pure patchouli statement. Since 1970. The hippie heritage."),
b(3443,"Reminiscence","Vanille EDP","unisex",1993,3.75,"long","moderate",["fall","winter"],["Vanilla","Bergamot"],["Vanilla","Jasmine"],["Musk","Sandalwood"],["vanilla","sweet","floral","musk"],"Pure vanilla warmth. Jasmine and vanilla. Simple comfort."),

// ═══ L'OCCITANE ═══
b(15430,"L'Occitane","Eau de Lavande EDT","unisex",1997,3.78,"short","soft",["spring","summer"],["Lavender","Bergamot"],["Lavender","Thyme","Rosemary"],["Musk","Sandalwood"],["lavender","herbal","aromatic","fresh"],"Provence lavender. Pure and therapeutic. Fields in a bottle."),
b(15431,"L'Occitane","Rose et Reines EDT","female",2006,3.72,"moderate","moderate",["spring","summer"],["Rose","Bergamot"],["Damascus Rose","Centifolia Rose"],["Musk","Sandalwood"],["rose","floral","fresh","musk"],"Queen of roses. Provencal rose. Simple and beautiful."),
b(34459,"L'Occitane","Verbena EDT","unisex",2002,3.68,"short","soft",["spring","summer"],["Verbena","Lemon","Bergamot"],["Green Tea","Mint"],["Musk","Cedar"],["citrus","herbal","fresh","green"],"Provence verbena. Lemon verbena and mint. Summer herb."),

// ═══ KAYALI ═══
b(57502,"Kayali","Eden Sparkling Lychee | 01 EDP","female",2019,4.02,"long","strong",["spring","summer"],["Lychee","Strawberry","Passion Fruit"],["Jasmine","Tuberose","Iris"],["Sandalwood","Musk","Cedarwood"],["floral","fruity","tropical","musk"],"Eden freshness. Lychee and jasmine. Huda Beauty luxury."),
b(57503,"Kayali","Utopia Vanilla Coco | 21 EDP","female",2021,4.08,"long","strong",["fall","winter"],["Coconut","Vanilla"],["Jasmine","Gardenia"],["Musk","Sandalwood","Cashmere"],["vanilla","coconut","floral","sweet"],"Vanilla coconut utopia. Gardenia and cashmere. Sweet paradise."),
b(57504,"Kayali","Déjà Vu White Flower | 57 EDP","female",2020,3.98,"long","strong",["spring","fall"],["Bergamot","Lemon"],["Tuberose","Jasmine","Lily of the Valley"],["White Musk","Sandalwood","Cedarwood"],["white floral","floral","fresh","woody"],"White flower memory. Tuberose and lily. Déjà vu beauty."),

// ═══ GOLDFIELD & BANKS ═══
b(62700,"Goldfield & Banks","White Sandalwood EDP","unisex",2016,4.18,"long","moderate",["spring","fall"],["Bergamot","Pink Pepper"],["Sandalwood","Iris","Jasmine"],["Musk","Cedarwood","Amber"],["woody","iris","floral","musk"],"Australian white sandalwood. Iris and jasmine. Southern Cross luxury."),
b(62701,"Goldfield & Banks","Pacific Rock Moss EDP","unisex",2016,4.12,"long","strong",["fall","winter"],["Bergamot","Sea Notes"],["Oakmoss","Driftwood","Citrus"],["Amber","Musk","Sandalwood"],["mossy","aquatic","woody","amber"],"Pacific coast moss. Sea and oakmoss. Australian coastal."),
b(62702,"Goldfield & Banks","Blue Cypress EDP","unisex",2018,3.98,"long","moderate",["spring","summer"],["Bergamot","Citrus"],["Blue Cypress","Sandalwood"],["Musk","Cedarwood"],["woody","fresh","citrus","aromatic"],"Blue cypress forest. Australian native. Unique and serene."),

// ═══ ABEL ═══
b(52077,"Abel","Cobalt Amber EDP","unisex",2015,3.95,"long","moderate",["fall","winter"],["Bergamot","Black Pepper"],["Amber","Labdanum","Patchouli"],["Sandalwood","Musk","Cedarwood"],["amber","spicy","woody","resinous"],"Sustainable amber. Black pepper and labdanum. Ethical luxury."),
b(52078,"Abel","Wild Flower EDP","unisex",2014,3.88,"long","moderate",["spring","summer"],["Bergamot","Rosewood"],["Ylang-Ylang","Geranium","Jasmine"],["Sandalwood","Vetiver","Musk"],["floral","woody","fresh","aromatic"],"Wild meadow. Ylang-ylang and geranium. Natural and free."),

// ═══ DS & DURGA ═══
b(46421,"D.S. & Durga","I Don't Know What EDP","unisex",2014,4.02,"long","moderate",["fall","winter"],["Tobacco","Cardamom"],["Leather","Oud","Incense"],["Sandalwood","Amber","Musk"],["tobacco","leather","oud","spicy"],"The unknown. Tobacco and leather. American niche mystery."),
b(46420,"D.S. & Durga","Radio Bombay EDP","unisex",2016,3.98,"long","moderate",["spring","fall"],["Bergamot","Ginger","Saffron"],["Cardamom","Rose","Oud"],["Sandalwood","Amber","Musk"],["spicy","rose","oud","amber"],"Radio waves from Bombay. Saffron and cardamom. Cultural fusion."),

// ═══ IMAGINARY AUTHORS ═══
b(34458,"Imaginary Authors","The Cobra and The Canary EDP","unisex",2012,3.88,"long","moderate",["spring","summer"],["Grapefruit","White Gardenia","Green Apple"],["Jasmine","Lily"],["Musk","Sandalwood"],["floral","fruity","fresh","musk"],"Colorful snake story. Grapefruit and gardenia. Whimsical and bright."),
b(34457,"Imaginary Authors","Memoirs of a Trespasser EDP","unisex",2013,3.95,"long","moderate",["fall","winter"],["Black Pepper","Clove"],["Tobacco","Incense","Leather"],["Sandalwood","Musk","Vetiver"],["tobacco","leather","spicy","smoky"],"Trespasser memoirs. Tobacco and clove. Dark adventure."),

// ═══ FRAGRANCE DU BOIS additional ═══
b(52079,"Fragrance Du Bois","Neroli Oud EDP","unisex",2016,4.18,"long","strong",["spring","fall"],["Neroli","Bergamot","Cardamom"],["Oud","Jasmine","Rose"],["Sandalwood","Musk","Amber"],["oud","floral","citrus","amber"],"Neroli and oud. Cardamom and jasmine. Sustainable luxury."),
b(52080,"Fragrance Du Bois","Rose Oud EDP","unisex",2014,4.22,"very_long","strong",["fall","winter"],["Bergamot","Saffron"],["Rose","Oud","Jasmine"],["Sandalwood","Amber","Musk"],["rose","oud","floral","amber"],"Rose and precious oud. Natural and sustainable. Ultimate luxury."),

// ═══ PARFUMS QUARTANA ═══
b(57505,"Parfums Quartana","Rose Satin EDP","female",2019,3.92,"long","strong",["spring","fall"],["Bergamot","Cardamom"],["Rose","Sandalwood","Jasmine"],["Amber","Musk","Cedarwood"],["rose","woody","spicy","floral"],"Satin rose. Cardamom and jasmine. Modern luxury rose."),

// ═══ CLIVE CHRISTIAN ═══
b(3443,"Clive Christian","No.1 EDP","female",1999,4.45,"very_long","enormous",["fall","winter"],["Bergamot","Cinnamon","Cloves"],["Jasmine","Tuberose","Rose","Ylang-Ylang"],["Sandalwood","Musk","Civet","Amber"],["floral","oriental","spicy","amber"],"The most expensive perfume. Rose and jasmine crown jewels. Ultimate luxury."),
b(15432,"Clive Christian","C EDP","unisex",2000,4.35,"very_long","strong",["fall","winter"],["Bergamot","Cardamom"],["Rose","Orris","Labdanum"],["Amber","Sandalwood","Vetiver","Musk"],["floral","oriental","amber","spicy"],"Crown luxury. Orris and cardamom. Accessible Clive Christian."),
b(34456,"Clive Christian","X Masculine EDP","male",2010,4.28,"very_long","strong",["fall","winter"],["Black Pepper","Bergamot"],["Leather","Oud","Cashmere"],["Sandalwood","Amber","Vetiver"],["leather","oud","spicy","amber"],"X factor. Leather and oud. Masculine power statement."),

// ═══ AMOUAGE additional ═══
b(25429,"Amouage","Epic Man EDP","male",2009,4.32,"very_long","enormous",["fall","winter"],["Oregano","Cardamom","Pepper"],["Frankincense","Cinnamon","Oud","Rose","Papyrus"],["Labdanum","Patchouli","Sandalwood","Musk"],["oud","spicy","incense","oriental"],"Epic masculine journey. Frankincense and oud. Omani grandeur."),
b(25431,"Amouage","Lyric Man EDP","male",2008,4.15,"long","strong",["fall","winter"],["Bergamot","Pink Pepper","Green Notes"],["Rose","Jasmine","Oud","Sandalwood"],["Musk","Amber","Patchouli"],["floral","oud","amber","spicy"],"Lyrical masculinity. Rose and oud poetry. Noble and beautiful."),
b(1418,"Amouage","Ciel Woman EDP","female",2006,4.08,"long","moderate",["spring","summer"],["Bergamot","Aldehydes","Orange","Violet"],["Rose","Jasmine","Geranium","Carnation"],["Musk","Sandalwood","Cedarwood","Amber","Vetiver"],["floral","aldehydic","powdery","fresh"],"Heaven. Rose and geranium. Pure Omani sky."),
b(31850,"Amouage","Honour Woman EDP","female",2012,4.18,"long","strong",["spring","fall"],["Bergamot","Aldehydes","Orris"],["Tuberose","Ylang-Ylang","Jasmine"],["Musk","Benzoin","Sandalwood","Amber"],["floral","white floral","powdery","sweet"],"Honourable femininity. Tuberose and benzoin. Dignified luxury."),

// ═══ CREED additional ═══
b(9830,"Creed","Acqua Fiorentina EDP","female",2010,4.02,"moderate","moderate",["spring","summer"],["Grapefruit","Bergamot","Peach"],["Peony","Rose","Jasmine","Gardenia"],["Sandalwood","Musk","Vetiver"],["floral","fruity","fresh","musk"],"Florentine spring water. Peach and gardenia. Fresh Creed feminine."),
b(9831,"Creed","Tabarome EDT","male",2000,4.18,"long","strong",["fall","winter"],["Bergamot","Cardamom","Aldehydes"],["Tobacco","Vetiver"],["Musk","Sandalwood","Civet","Amber"],["tobacco","woody","earthy","amber"],"Tobacco sophistication. Vetiver and tobacco. Rare masculine."),
b(9832,"Creed","White Flowers EDP","female",2005,3.95,"long","moderate",["spring","summer"],["Aldehydes","Lychee","Melon"],["Tuberose","Violet","Jasmine","Ylang-Ylang"],["Musk","Amber","Sandalwood"],["white floral","floral","powdery","sweet"],"White flower garden. Tuberose and violet. Creed femininity."),

// ═══ MAISON FRANCIS KURKDJIAN additional ═══
b(64511,"Maison Francis Kurkdjian","724 EDP","unisex",2021,4.28,"long","strong",["spring","fall"],["Solar Notes","Bergamot"],["Musk","White Floral","Iris"],["White Musk","Sandalwood"],["musk","floral","iris","fresh"],"24/7 musk. Solar and iris. The modern luxury scent."),
b(72851,"Maison Francis Kurkdjian","Lumière Noire pour Femme EDP","female",2009,4.18,"long","strong",["fall","winter"],["Bergamot","Aldehydes"],["Labdanum","Jasmine","Rose","Orris"],["Patchouli","Musk","Oakmoss","Amber"],["chypre","floral","earthy","amber"],"Black light. Labdanum and rose. Dark and beautiful."),
b(38539,"Maison Francis Kurkdjian","À la Rose EDP","female",2015,4.12,"long","moderate",["spring","fall"],["Bergamot","Litchi","Pear"],["Centifolia Rose","Damask Rose","Magnolia"],["Musk","White Amber","Cedarwood"],["rose","floral","fruity","musk"],"To the rose. Litchi and rose. Feminine luxury."),

// ═══ BYREDO additional ═══
b(43009,"Byredo","Bibliotheque EDP","unisex",2018,4.22,"long","moderate",["fall","winter"],["Peach","Plum"],["Violet","Vetiver","Musk"],["Sandalwood","Amber","Vanilla"],["fruity","floral","woody","vanilla"],"The library. Peach and violet over sandalwood. Intellectual warmth."),
b(43010,"Byredo","Oud Immortel EDP","unisex",2012,4.18,"long","strong",["fall","winter"],["Bergamot","Juniper"],["Oud","Orris","Birch"],["Sandalwood","Patchouli","Musk"],["oud","smoky","woody","resinous"],"Immortal oud. Birch and juniper. Scandinavian meets Arabia."),
b(43011,"Byredo","M/Mink EDP","unisex",2015,4.08,"long","moderate",["fall","winter"],["Bergamot","Truffle","Black Peony"],["Ink","Musk","Mineral Notes"],["Sandalwood","Musk","Oud"],["musky","smoky","woody","mineral"],"Mink and mineral. Truffle and ink. Dark and mysterious."),
b(51483,"Byredo","Accord Oud EDP","unisex",2012,4.15,"long","strong",["fall","winter"],["Bergamot","Rose","Saffron"],["Oud","Orris","Papyrus"],["Sandalwood","Amber","Musk"],["oud","floral","spicy","amber"],"Oud accord. Rose and saffron. Swedish meets Arabi."),
b(57506,"Byredo","Rose Noir EDP","female",2012,4.05,"long","moderate",["fall","winter"],["Bergamot","Rose","Violet"],["Black Rose","Cloves","Sandalwood"],["Amber","White Musk","Patchouli"],["rose","spicy","dark","amber"],"Black rose. Cloves and violet. Dark romance."),

// ═══ PENHALIGON'S additional ═══
b(57507,"Penhaligon's","The Tragedy of Lord George","male",2019,4.18,"long","strong",["fall","winter"],["Bergamot","Mandarin"],["Leather","Oud","Orris"],["Sandalwood","Amber","Musk"],["leather","oud","iris","amber"],"Tragic nobility. Leather and orris. Victorian drama."),
b(57508,"Penhaligon's","The Coveted Duchess Rose","female",2019,4.12,"long","moderate",["spring","fall"],["Bergamot","Black Pepper"],["Rose","Jasmine","Iris"],["Sandalwood","Musk","Amber"],["rose","floral","spicy","woody"],"Coveted rose. Rose and black pepper. Victorian duchess."),
b(46449,"Penhaligon's","Empressa","female",2015,4.02,"long","moderate",["spring","fall"],["Bergamot","Neroli"],["Rose","Jasmine","Iris"],["Musk","Sandalwood","Amber"],["floral","rose","citrus","woody"],"Empress elegance. Neroli and rose. British imperial."),

// ═══ ROJA DOVE additional ═══
b(15433,"Roja Dove","Diaghilev EDP","unisex",2009,4.38,"very_long","enormous",["fall","winter"],["Bergamot","Jasmine","Mandarin","Pink Pepper"],["Rose","Orris","Jasmine","Violet","Ylang-Ylang"],["Vetiver","Sandalwood","Musk","Patchouli","Amber"],["floral","oriental","powdery","amber"],"Ballet Russes. Rose and vetiver. Art in perfume form."),
b(15434,"Roja Dove","Scandal EDP","female",2013,4.35,"very_long","enormous",["fall","winter"],["Bergamot","Grapefruit","Pink Pepper","Aldehydes"],["Rose","Iris","Jasmine","Tuberose","Ylang-Ylang"],["Sandalwood","Musk","Patchouli","Amber","Civet"],["floral","oriental","powdery","earthy"],"Scandalize. Rich floral oriental. Outrageous luxury."),

// ═══ KILIAN additional ═══
b(39059,"Kilian","Roses on Ice EDP","unisex",2014,4.15,"long","strong",["spring","fall"],["Rose","Violet","Rhubarb"],["Rose","Orris","Violet"],["White Musk","Sandalwood"],["rose","floral","fresh","musk"],"Roses on ice. Rhubarb and rose. Crisp floral luxury."),
b(52081,"Kilian","Straight to Heaven White Cristal EDP","male",2007,4.18,"long","strong",["fall","winter"],["Rum","Black Pepper","Cardamom"],["Cinnamon","Nutmeg","Jasmine"],["Vetiver","Sandalwood","Musk","Amber"],["rum","spicy","woody","oriental"],"Straight to heaven. Rum and cardamom. Sin and luxury."),

// ═══ XERJOFF additional ═══
b(64513,"Xerjoff","Irisss EDP","female",2011,4.22,"long","strong",["spring","fall"],["Bergamot","Cardamom","Saffron"],["Iris","Rose","Jasmine"],["Sandalwood","Musk","Amber","Vetiver"],["iris","floral","spicy","amber"],"Italian iris luxury. Saffron and iris. Collectible opulence."),
b(64514,"Xerjoff","Richwood EDP","unisex",2013,4.18,"long","strong",["fall","winter"],["Bergamot","Saffron"],["Oud","Gaiac Wood","Rose"],["Sandalwood","Amber","Musk"],["oud","woody","rose","amber"],"Rich wood. Gaiac and rose oud. Refined Italian luxury."),

// ═══ TIZIANA TERENZI additional ═══
b(61074,"Tiziana Terenzi","Orion EDP","unisex",2017,4.38,"very_long","enormous",["fall","winter"],["Bergamot","Cardamom"],["Oud","Rose","Jasmine","Amber"],["Sandalwood","Musk","Vanilla"],["oud","floral","amber","sweet"],"Hunter constellation. Oud and rose amber. Spectacular luxury."),
b(61075,"Tiziana Terenzi","Maremma EDP","unisex",2015,4.08,"long","strong",["fall","winter"],["Bergamot","Black Pepper"],["Oud","Leather","Amber"],["Sandalwood","Musk","Patchouli"],["oud","leather","spicy","amber"],"Tuscan countryside. Leather and pepper. Italian land luxury."),
b(61076,"Tiziana Terenzi","Delox EDP","unisex",2018,4.12,"long","moderate",["spring","fall"],["Bergamot","Grapefruit","Cardamom"],["Rose","Jasmine","Iris"],["Sandalwood","Musk","Amber"],["floral","citrus","spicy","woody"],"Detoxifying luxury. Grapefruit and iris. Cleansing beauty."),

// ═══ NISHANE additional ═══
b(72852,"Nishane","Ambra Calabria EDP","unisex",2018,4.22,"very_long","strong",["fall","winter"],["Calabrian Bergamot","Mandarin"],["Amber","Jasmine","Honey"],["Ambergris","Sandalwood","Musk"],["amber","citrus","honey","sweet"],"Calabrian amber. Bergamot and honey amber. Mediterranean luxury."),
b(72853,"Nishane","B-612 EDP","unisex",2018,4.15,"long","strong",["spring","fall"],["Bergamot","Cardamom","Black Pepper"],["Rose","Oud","Jasmine"],["Sandalwood","Amber","Musk"],["oud","rose","spicy","amber"],"The little prince's planet. Rose and oud. Poetic luxury."),

// ═══ INITIO additional ═══
b(57510,"Initio Parfums Privés","Side Effect EDP","male",2020,4.28,"very_long","enormous",["fall","winter"],["Rum","Vanilla","Cardamom"],["Tobacco","Davana","Oud"],["Amber","Musk","Vetiver"],["tobacco","rum","sweet","oud"],"Side effect. Rum and tobacco. Addictive masculine."),
b(57511,"Initio Parfums Privés","High Frequency EDP","unisex",2019,4.12,"long","strong",["spring","fall"],["Bergamot","Saffron","Cardamom"],["Rose","Oud","Amber"],["Sandalwood","Musk","Vanilla"],["oud","floral","amber","sweet"],"High frequency. Rose and saffron. Vibrational luxury."),

// ═══ MAISON MARGIELA additional ═══
b(74466,"Maison Margiela","Replica Across Sands EDT","unisex",2021,3.98,"long","moderate",["spring","fall"],["Bergamot","Cardamom"],["Musk","Sandalwood","Ambrette"],["White Musk","Cedarwood"],["musk","woody","aromatic","warm spicy"],"Desert crossing. Cardamom and musk. Nomadic luxury."),
b(74467,"Maison Margiela","Replica Whispers in the Library EDT","unisex",2021,3.92,"long","moderate",["fall","winter"],["Bergamot","Violet"],["Leather","Vetiver","Iris"],["Sandalwood","White Musk"],["leather","iris","woody","aromatic"],"Library whispers. Leather and iris. Literary escape."),

// ═══ LE LABO additional ═══
b(62697,"Le Labo","Lys 41 EDP","unisex",2006,4.05,"long","moderate",["spring","summer"],["Bergamot","Lilac"],["Lily","Muguet","Iris"],["White Musk","Sandalwood"],["white floral","floral","fresh","musk"],"Lily 41. Fresh white flowers. Clean and luminous."),
b(62698,"Le Labo","Oud 27 EDP","unisex",2006,4.22,"long","strong",["fall","winter"],["Bergamot","Cardamom"],["Oud","Papyrus","Olibanum"],["Amber","Musk","Vetiver"],["oud","incense","spicy","woody"],"Oud meditation. Olibanum and papyrus. Spiritual luxury."),
b(62699,"Le Labo","Patchouli 24 EDP","unisex",2006,4.18,"long","strong",["fall","winter"],["Bergamot","Laurel"],["Patchouli","Incense","Birch"],["Musk","Vetiver","Sandalwood"],["patchouli","smoky","woody","incense"],"The patchouli reinvented. Birch smoke and incense. Urban sophistication."),

// ═══ SERGE LUTENS additional ═══
b(3444,"Serge Lutens","Borneo 1834 EDP","unisex",2005,4.22,"very_long","strong",["fall","winter"],["Bergamot"],["Patchouli","Chocolate"],["Sandalwood","Amber"],["patchouli","sweet","earthy","smoky"],"1834 Borneo. Patchouli and chocolate. Dark tropical fantasy."),
b(3445,"Serge Lutens","Tubéreuse Criminelle EDP","female",2000,4.25,"long","strong",["spring","fall"],["Mint","Clove","Styrax","Camphor"],["Tuberose","Jasmine","Orange Blossom"],["Musk","Vetiver","Amber","Vanilla"],["white floral","green","spicy","medicinal"],"Criminal tuberose. Camphor and tuberose. Polarizing genius."),
b(34455,"Serge Lutens","De Profundis EDP","unisex",2011,4.08,"long","moderate",["fall","winter"],["Incense","Chrysanthemum"],["Chrysanthemum","Incense","Violet"],["Earth","Wood","Musk"],["floral","earthy","incense","green"],"From the depths. Chrysanthemum and earth. Funeral flowers."),
b(34454,"Serge Lutens","Vitriol d'Oeillet EDP","unisex",2011,4.05,"long","strong",["fall","winter"],["Cloves","Black Pepper","Bergamot"],["Carnation","Geranium","Cedar"],["Musk","Amber","Vetiver"],["spicy","floral","woody","earthy"],"Carnation violence. Cloves and geranium. Bold and radiant."),

// ═══ L'ARTISAN additional ═══
b(15435,"L'Artisan Parfumeur","Mechant Loup EDP","male",2000,3.95,"long","moderate",["fall","winter"],["Bergamot","Artemisia","Cardamom"],["Lavender","Thyme","Pine","Cedar"],["Musk","Amber","Sandalwood"],["aromatic","woody","herbal","fougere"],"Bad wolf. Pine and thyme. Rugged woodland masculine."),
b(15436,"L'Artisan Parfumeur","Seville à l'Aube EDP","female",2012,4.18,"long","strong",["spring","summer"],["Beeswax","Bitter Orange","Lavender"],["Neroli","Orange Blossom","Jasmine","Immortelle"],["White Musk","Benzoin","Sandalwood"],["floral","beeswax","sweet","citrus"],"Seville at dawn. Orange blossom and beeswax. Spanish summer night."),

// ═══ COMME DES GARÇONS additional ═══
b(43012,"Comme des Garçons","Sherbet Rhubarb EDT","unisex",2010,3.82,"moderate","moderate",["spring","summer"],["Rhubarb","Bergamot","Lemon"],["White Musk","Orris"],["White Musk","Sandalwood"],["fresh","fruity","citrus","musk"],"Sherbet surprise. Rhubarb and lemon. Playful and unique."),
b(43013,"Comme des Garçons","Jungle Jorum EDT","unisex",2014,3.88,"long","moderate",["fall","winter"],["Incense","Bergamot"],["Oud","Smoke","Resins"],["Amber","Sandalwood","Musk"],["incense","smoky","oud","resinous"],"Jungle density. Oud and smoke. Thick and atmospheric."),

// ═══ JULIETTE HAS A GUN additional ═══
b(46450,"Juliette Has a Gun","Calamity J EDP","female",2018,3.88,"long","moderate",["spring","fall"],["Bergamot","Rose"],["Rose","Leather","Orris"],["Sandalwood","Amber","Musk"],["rose","leather","floral","spicy"],"Calamity Jane rose. Leather and rose. Wild West femininity."),
b(62694,"Juliette Has a Gun","Pear Inc. EDP","unisex",2019,3.78,"moderate","moderate",["spring","summer"],["Pear","Bergamot"],["Pear","Cyclamen","Rose"],["White Musk","Sandalwood"],["fruity","floral","fresh","musk"],"Pear incorporated. Fresh and sweet. Light luxury."),

// ═══ MAISON ALHAMBRA additional ═══
b(75048,"Maison Alhambra","Etoiles EDP","female",2020,3.92,"long","strong",["spring","fall"],["Bergamot","Pink Pepper","Apple"],["Rose","Jasmine","Iris"],["Musk","Sandalwood","Amber"],["floral","spicy","fruity","rose"],"Star feminine. Pink pepper and rose iris. Affordable luxury."),
b(75049,"Maison Alhambra","Baroque Rouge 540 EDP","unisex",2021,4.12,"very_long","enormous",["fall","winter"],["Bergamot","Saffron"],["Rose","Jasmine","Amber"],["Sandalwood","Musk","Cedar"],["floral","amber","sweet","oud"],"Baroque inspired by legend. Rose and amber. Excellent inspired luxury."),

// ═══ PARIS CORNER ═══
b(113,"Paris Corner","Majestic Woods EDP","male",2020,4.08,"very_long","strong",["fall","winter"],["Bergamot","Black Pepper","Cardamom"],["Oud","Amber","Sandalwood"],["Musk","Patchouli","Vanilla"],["oud","woody","spicy","amber"],"Majestic wood. Oud and cardamom. Middle Eastern masculine power."),
b(75050,"Paris Corner","Pendora Scent Peach EDP","female",2021,4.02,"long","strong",["spring","fall"],["Peach","Bergamot","Mandarin"],["Rose","Jasmine","Orchid"],["Musk","Sandalwood","Amber"],["fruity","floral","sweet","peach"],"Peach paradise. Mandarin and orchid. Sweet accessible luxury."),

// ═══ ZIMAYA additional ═══
b(75051,"Zimaya","Thara Oud EDP","unisex",2019,4.15,"very_long","strong",["fall","winter"],["Bergamot","Saffron","Cardamom"],["Oud","Rose","Amber"],["Sandalwood","Musk","Vanilla"],["oud","rose","spicy","amber"],"Oud treasure. Saffron and rose. Premium Arabic luxury."),
b(75052,"Zimaya","Taraf Pink EDP","female",2020,3.95,"long","strong",["spring","fall"],["Bergamot","Lemon","Peach"],["Rose","Jasmine","Lily"],["Musk","Sandalwood","Amber"],["floral","fruity","sweet","rose"],"Pink radiance. Peach and jasmine. Sweet Arabic femininity."),

// ═══ RASASI additional ═══
b(75053,"Rasasi","Hawas EDP","male",2018,4.22,"very_long","enormous",["fall","winter"],["Bergamot","Cardamom","Pineapple"],["Jasmine","Rose","Amber","Oud"],["Sandalwood","Musk","Vetiver"],["fruity","floral","oud","amber"],"Desire. Pineapple and oud. Arabic masculine desire."),
b(75054,"Rasasi","Egra EDP","female",2019,4.08,"long","strong",["spring","fall"],["Bergamot","Peach","Pineapple"],["Rose","Jasmine","Vanilla"],["Musk","Sandalwood","Amber"],["floral","fruity","sweet","vanilla"],"Bride's joy. Peach and rose vanilla. Eastern bridal scent."),

// ═══ AFNAN additional ═══
b(75055,"Afnan","Turathi Brown EDP","unisex",2020,4.12,"very_long","strong",["fall","winter"],["Bergamot","Saffron","Cardamom"],["Oud","Rose","Amber","Sandalwood"],["Musk","Patchouli","Vanilla"],["oud","spicy","amber","sweet"],"Brown heritage. Saffron and oud. Traditional Arabic luxury."),
b(75056,"Afnan","9 AM Femme EDP","female",2020,3.95,"long","strong",["spring","fall"],["Bergamot","Grapefruit","Orange"],["Jasmine","Rose","Peony"],["Musk","Sandalwood","Amber"],["floral","citrus","fresh","musk"],"9 AM feminine. Grapefruit and peony. Fresh morning luxury."),

// ═══ AL HARAMAIN additional ═══
b(75057,"Al Haramain","Amber Oud Rouge Edition EDP","unisex",2020,4.28,"very_long","enormous",["fall","winter"],["Bergamot","Cardamom","Saffron"],["Rose","Oud","Amber","Incense"],["Sandalwood","Musk","Patchouli","Vanilla"],["oud","amber","spicy","sweet"],"Rouge oud edition. Saffron and rose oud. Intense luxury."),
b(75058,"Al Haramain","Oudh 36 EDP","unisex",2017,4.18,"very_long","strong",["fall","winter"],["Bergamot","Pepper"],["Oud","Rose","Amber"],["Sandalwood","Musk"],["oud","rose","spicy","amber"],"Number 36. Pure oud expression. Heritage Arabic."),

// ═══ SWISS ARABIAN additional ═══
b(44045,"Swiss Arabian","Layali Rouge EDP","female",2019,4.05,"long","strong",["fall","winter"],["Bergamot","Peach","Mandarin"],["Rose","Jasmine","Orchid"],["Musk","Sandalwood","Amber"],["floral","fruity","sweet","rose"],"Rouge nights. Peach and rose. Sweet Oriental feminine."),
b(44046,"Swiss Arabian","Nouf EDP","female",2018,3.95,"long","moderate",["spring","fall"],["Bergamot","Lemon"],["Rose","Jasmine","Lily"],["Musk","Sandalwood","Amber"],["floral","citrus","sweet","musk"],"Pure light. Lemon and jasmine. Fresh Arabic feminine."),

// ═══ ARABIAN OUD additional ═══
b(44037,"Arabian Oud","Ultima EDP","unisex",2018,4.18,"very_long","enormous",["fall","winter"],["Bergamot","Saffron"],["Oud","Rose","Amber","Jasmine"],["Sandalwood","Musk","Vanilla"],["oud","floral","amber","sweet"],"Ultimate. Rose and oud. Arabian perfumery at its finest."),
b(44038,"Arabian Oud","Musk Safari EDP","unisex",2016,3.95,"long","strong",["spring","fall"],["Bergamot","Saffron"],["Musk","Rose","Sandalwood"],["Amber","Musk","Vanilla"],["musk","rose","sweet","amber"],"Safari musk. Rose and white musk. Clean and luxurious."),

// ═══ LATTAFA additional ═══
b(75059,"Lattafa","Velvet Rose EDP","female",2021,4.08,"long","strong",["spring","fall"],["Bergamot","Pink Pepper","Lychee"],["Rose","Peony","Jasmine"],["Musk","Sandalwood","Amber"],["rose","floral","fruity","sweet"],"Velvet rose. Pink pepper and lychee. Silky luxury."),
b(75060,"Lattafa","Oud Mood EDP","unisex",2020,4.15,"very_long","enormous",["fall","winter"],["Bergamot","Saffron","Cardamom"],["Oud","Rose","Amber","Jasmine"],["Sandalwood","Musk","Patchouli"],["oud","floral","spicy","amber"],"Oud mood. Saffron and rose oud. Deep and opulent."),
b(75061,"Lattafa","Asdaaf Oud For Glory EDP","unisex",2021,4.18,"very_long","enormous",["fall","winter"],["Bergamot","Black Pepper","Saffron"],["Oud","Rose","Amber"],["Sandalwood","Musk","Patchouli"],["oud","spicy","amber","floral"],"Glory in oud. Black pepper and rose oud. Maximum impact."),

// ═══ DIOR additional ═══
b(74468,"Dior","J'adore Parfum d'Eau","female",2022,4.12,"long","moderate",["spring","summer"],["Jasmine","Rose","Ylang-Ylang"],["Jasmine","Tuberose","Rose"],["White Musk"],["white floral","floral","fresh","musk"],"Waterless J'adore. Pure white flowers. Sustainable luxury."),
b(46433,"Dior","Miss Dior Absolutely Blooming EDP","female",2016,3.88,"long","moderate",["spring","summer"],["Raspberry","Grapefruit"],["Peony","Damascus Rose"],["Musk","White Cedar"],["floral","fruity","rose","musk"],"Absolutely blooming. Raspberry and peony. Fresh and vibrant."),

// ═══ CHANEL additional ═══
b(74469,"Chanel","Chance Eau Tendre EDP","female",2020,4.02,"long","moderate",["spring","fall"],["Grapefruit","Quince","Jasmine"],["Iris","Jasmine","White Musk"],["Sandalwood","White Musk"],["floral","fresh","iris","musk"],"Tender Chance EDP. Deeper and richer. The most romantic."),
b(62693,"Chanel","Les Exclusifs: Sycomore EDP","unisex",2008,4.35,"long","moderate",["fall","winter"],["Bergamot","Juniper","Nutmeg"],["Sandalwood","Vetiver","Cedarwood"],["Oakmoss","Patchouli","Musk"],["woody","vetiver","smoky","earthy"],"Sacred tree. Vetiver and sandalwood. Austere masterpiece."),

// ═══ TOM FORD additional ═══
b(74470,"Tom Ford","Soleil Neige EDP","unisex",2016,3.92,"long","moderate",["winter","fall"],["Bergamot","Cardamom"],["Jasmine","Iris"],["Musk","Sandalwood","Musks"],["floral","iris","fresh","musk"],"Snow sun. Cardamom and iris. Alpine luxury."),
b(62695,"Tom Ford","Fleur de Portofino EDP","unisex",2017,4.02,"long","moderate",["spring","summer"],["Bergamot","Lemon","Neroli"],["Tigerlily","Jasmine","Rose"],["Musk","Sandalwood","Cedarwood"],["floral","citrus","fresh","woody"],"Portofino flowers. Tigerlily and neroli. Italian summer luxury."),
b(52082,"Tom Ford","Oud Minerale EDP","unisex",2017,4.08,"long","strong",["fall","winter"],["Sea Notes","Bergamot"],["Oud","Minerals","Vetiver"],["Amber","Musk","Sandalwood"],["oud","aquatic","mineral","amber"],"Mineral oud. Sea and oud. Unique ocean luxury."),

// ═══ HERMÈS additional ═══
b(74471,"Hermès","Hermessence Ambre Narguilé EDP","unisex",2004,4.35,"very_long","strong",["fall","winter"],["Bergamot","Apple","Cinnamon"],["Tobacco","Honey","Amber"],["Vanilla","Sandalwood","Musk"],["amber","tobacco","sweet","oriental"],"Hookah amber. Tobacco and honey. Addictive niche Hermès."),
b(74472,"Hermès","Hermessence Cuir d'Ange EDP","female",2010,4.28,"long","moderate",["spring","fall"],["Angelica","Bergamot"],["Suede","Iris","Musk"],["White Musk","Sandalwood"],["leather","iris","floral","musk"],"Angel leather. Angelica and suede. Softest Hermès."),
b(74473,"Hermès","Twilly d'Hermès Eau Poivrée EDP","female",2020,3.95,"long","moderate",["spring","fall"],["Pink Pepper","Bergamot"],["Rose","Tuberose"],["Sandalwood","White Musk"],["floral","spicy","rose","warm spicy"],"Peppered Twilly. Pink pepper and rose. Spicy feminine."),

// ═══ GUERLAIN additional ═══
b(74474,"Guerlain","L'Art et la Matière: Cuir Beluga EDP","unisex",2019,4.28,"long","strong",["fall","winter"],["Bergamot","Cognac"],["Leather","Iris","Heliotrope"],["Amber","Sandalwood","Musk"],["leather","iris","amber","sweet"],"Leather beluga. Cognac and iris leather. Fine art luxury."),
b(74475,"Guerlain","Mon Guerlain Bloom of Rose EDT","female",2019,3.82,"moderate","moderate",["spring","summer"],["Bergamot","Bulgarian Rose"],["Lavender","Rose","Sambac Jasmine"],["Tonka Bean","Sandalwood"],["floral","rose","lavender","fresh"],"Rose bloom. Bulgarian rose and lavender. Spring awakening."),

// ═══ YSL additional ═══
b(74476,"Yves Saint Laurent","Or d'Or EDP","female",2021,4.08,"long","strong",["fall","winter"],["Bergamot","Golden Metallic"],["Iris","Narcissus","Rose"],["Sandalwood","White Musk","Amber"],["floral","iris","amber","metallic"],"Golden hour. Iris and narcissus. Golden luxury."),
b(62696,"Yves Saint Laurent","Nuit de L'Homme Bleu Électrique","male",2016,4.02,"long","strong",["fall","winter"],["Cardamom","Grapefruit"],["Cedar","Bergamot","Iris"],["Vetiver","Coumarin","White Musk"],["aromatic","woody","fresh spicy","citrus"],"Electric blue night. Grapefruit and cedar. Modern seduction."),

// ═══ VERSACE additional ═══
b(74477,"Versace","Dylan Turquoise Pour Homme EDT","male",2021,3.82,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Green Mandarin"],["Cypress","Aquatic","Hedione"],["Musk","Sandalwood"],["aquatic","fresh","citrus","woody"],"Turquoise holiday. Cypress and aquatic. Italian summer man."),
b(74478,"Versace","Palazzo Empire EDP","female",2019,3.88,"long","moderate",["spring","fall"],["Bergamot","Lemon"],["Jasmine","White Flowers"],["Sandalwood","White Musk","Amber"],["white floral","citrus","fresh","musk"],"Palace empire. White jasmine and bergamot. Italian fashion luxury."),

// ═══ ARMANI additional ═══
b(74479,"Giorgio Armani","Acqua di Gio Parfum","male",2022,4.22,"very_long","enormous",["spring","summer","fall"],["Bergamot","Aquatic Notes"],["Marine Notes","Sage","Labdanum"],["Ambrox","Cedarwood","Musk","Patchouli"],["aquatic","woody","aromatic","fresh"],"The parfum. Deepest Acqua di Gio. Black bottle legend."),
b(74480,"Giorgio Armani","Privé Bleu Turquoise EDP","unisex",2016,4.12,"long","moderate",["spring","summer"],["Bergamot","Aquatic Notes","Mineral"],["Jasmine","Aquatic Accord"],["Sandalwood","White Musk","Amber"],["aquatic","fresh","floral","mineral"],"Turquoise luxury. Mineral aquatic. Private Armani blue."),

// ═══ PRADA additional ═══
b(74481,"Prada","Les Infusions de Prada Iris Cèdre EDP","female",2015,3.92,"long","moderate",["spring","fall"],["Bergamot","Iris"],["Iris","Cedar","Vetiver"],["Sandalwood","Musk"],["iris","woody","fresh","musk"],"Iris and cedar infusion. Clean and modern. Minimalist perfection."),
b(74482,"Prada","Les Infusions de Prada Mimosa EDP","female",2020,3.85,"moderate","moderate",["spring","summer"],["Bergamot","Mimosa"],["Mimosa","Almond","Jasmine"],["White Musk","Sandalwood"],["floral","sweet","powdery","almond"],"Mimosa infusion. Almond and jasmine. Spring delight."),

// ═══ DOLCE & GABBANA additional ═══
b(74483,"Dolce & Gabbana","Devotion EDP","female",2021,4.02,"long","strong",["spring","fall"],["Bergamot","Peach","Red Berries"],["Neroli","Jasmine"],["Musk","Sandalwood","Amber"],["floral","fruity","sweet","musk"],"Devotion. Peach and jasmine. Italian devoted femininity."),
b(74484,"Dolce & Gabbana","Pour Homme Intenso EDP","male",2014,3.95,"very_long","strong",["fall","winter"],["Basil","Bergamot","Black Pepper"],["Tobacco","Spices","Leather"],["Amber","Musk","Cedarwood","Sandalwood"],["tobacco","leather","spicy","amber"],"Intenso Italian. Tobacco and leather. Sicilian passion."),

// ═══ MORE MAINSTREAM ═══
b(34450,"Yardley","English Lavender EDT","unisex",1874,3.65,"moderate","moderate",["spring","summer"],["Lavender","Bergamot"],["Lavender","Clary Sage"],["Musk","Sandalwood"],["lavender","aromatic","fresh","woody"],"Since 1874. Pure English lavender. Heritage simplicity."),
b(34451,"Yardley","English Rose EDT","female",2008,3.58,"moderate","soft",["spring","summer"],["Rose","Bergamot"],["English Rose","Jasmine"],["White Musk","Sandalwood"],["rose","floral","fresh","musk"],"English garden rose. Traditional and accessible. Simple beauty."),
b(34452,"Yardley","White Jasmine EDT","female",2012,3.55,"short","soft",["spring","summer"],["Jasmine","Bergamot"],["Jasmine","White Flowers"],["White Musk"],["floral","white floral","fresh","musk"],"White jasmine simplicity. Pure and accessible. Garden freshness."),
b(34453,"Coty","L'Aimant EDP","female",1927,3.75,"long","moderate",["spring","fall"],["Aldehydes","Bergamot","Peach"],["Rose","Jasmine","Lily","Iris"],["Musk","Sandalwood","Amber","Vetiver"],["floral","aldehydic","powdery","oriental"],"The loved one. 1927 French chypre. Art deco elegance."),
b(23481,"Jovan","Musk for Women EDC","female",1972,3.55,"moderate","moderate",["spring","summer"],["Bergamot","Aldehydes"],["Jasmine","Rose","Cyclamen"],["Musk","Sandalwood","Amber"],["musk","floral","sweet","powdery"],"Original sexy musk. 1972 American dream. Accessible and iconic."),
b(23482,"Jovan","Musk for Men EDC","male",1973,3.52,"moderate","moderate",["spring","summer"],["Bergamot","Lime"],["Sandalwood","Musk"],["Musk","Sandalwood","Amber"],["musk","fresh","woody","aromatic"],"Male musk classic. 1973 masculine musk. Simple and persistent."),
b(34449,"Jean Couturier","Coriandre EDP","female",1973,3.72,"long","moderate",["spring","fall"],["Aldehydes","Bergamot","Coriander"],["Rose","Jasmine","Lily","Ylang-Ylang"],["Musk","Oakmoss","Amber","Sandalwood"],["chypre","floral","spicy","earthy"],"Coriander spice. Green floral chypre. 1973 forgotten classic."),

// ═══ KAYALI additional ═══
b(57512,"Kayali","Vanilla 28 EDP","unisex",2019,4.05,"long","strong",["fall","winter"],["Bergamot","Cardamom"],["Vanilla","Jasmine","Rose"],["Musk","Sandalwood","Amber"],["vanilla","floral","sweet","oriental"],"Vanilla 28. Cardamom and rose vanilla. Sweet luxury."),
b(57513,"Kayali","Musk 12 EDP","unisex",2019,3.98,"long","moderate",["spring","fall"],["White Musk","Bergamot"],["Jasmine","White Flowers"],["White Musk","Sandalwood"],["musk","floral","clean","soft"],"Musk 12. Clean and skin-like. Huda Beauty wearable luxury."),

// ═══ DOSSIER (affordable niche-inspired) ═══
b(57514,"Dossier","Ambery Saffron EDP","unisex",2020,3.88,"long","strong",["fall","winter"],["Bergamot","Saffron"],["Rose","Amber","Jasmine"],["Sandalwood","Musk","Vanilla"],["amber","saffron","floral","sweet"],"Affordable luxury amber. Saffron and rose. Accessible niche."),
b(57515,"Dossier","Woody Oakmoss EDP","unisex",2019,3.82,"long","moderate",["fall","winter"],["Bergamot","Citrus"],["Oakmoss","Vetiver","Cedar"],["Amber","Musk","Sandalwood"],["woody","mossy","citrus","earthy"],"Affordable chypre. Oakmoss and vetiver. Budget niche."),

];

const existing = JSON.parse(readFileSync(DATA, "utf-8"));
console.log(`Mevcut: ${existing.length}`);
const seen = new Map(existing.map(p=>[`${p.brand}|${p.name}`.toLowerCase().trim(), true]));
let added = 0;
const merged = [...existing];
for (const p of NEW) {
  const key = `${p.brand}|${p.name}`.toLowerCase().trim();
  if (!seen.has(key)) { seen.set(key, true); merged.push(p); added++; }
}
merged.forEach((p, i) => { p.id = String(i + 1); });
writeFileSync(DATA, JSON.stringify(merged, null, 2), "utf-8");
console.log(`Eklenen: ${added}`);
console.log(`Toplam: ${merged.length}`);
