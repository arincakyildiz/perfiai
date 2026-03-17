/**
 * Perfiai - Part 3: Ünlü Markalar (~700 yeni parfüm)
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, "../data/perfumes.json");

const ATR = {"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","musky":"misk","woody":"odunsu","lavender":"lavanta","herbal":"bitkisel","floral":"çiçeksi","white floral":"beyaz çiçek","sweet":"tatlı","powdery":"pudralı","fruity":"meyveli","rose":"gül","jasmine":"yasemin","iris":"iris","aquatic":"deniz","vanilla":"vanilya","gourmand":"gurme","oud":"oud","oriental":"oryantal","earthy":"toprak","smoky":"dumanlı","leather":"deri","creamy":"kremsi","sandalwood":"sandal ağacı","patchouli":"paçuli","tobacco":"tütün","honey":"bal","incense":"tütsü","green":"yeşil/taze","cherry":"kiraz","fig":"incir","resinous":"reçineli","balsamic":"balsam","coconut":"hindistancevizi","caramel":"karamel","coffee":"kahve","tea":"çay","mossy":"yosunlu","marine":"deniz","chypre":"chypre","fougere":"fougère"};
const GT = {male:"erkeklere özel",female:"kadınlara özel",unisex:"uniseks"};
const ST = {spring:"ilkbahar",summer:"yaz",fall:"sonbahar",winter:"kış"};
const LT = {short:"kısa süreli kalıcılık",moderate:"orta düzey kalıcılık",long:"uzun süre kalıcılık",very_long:"çok uzun süre kalıcılık"};
const SiT = {soft:"hafif iz",moderate:"orta güçte iz",strong:"güçlü iz",enormous:"çok güçlü iz"};

function tr(p){
  const ac=(p.accords||[]).slice(0,3).map(a=>ATR[a.toLowerCase()]||a);
  const g=GT[p.gender]||"herkes için";
  const ss=p.season||[];
  const lo=LT[p.longevity],si=SiT[p.sillage];
  const pts=[];
  if(ac.length)pts.push(`${ac.join(", ")} notalarıyla öne çıkan, ${g} bir parfüm.`);
  else pts.push(`${g.charAt(0).toUpperCase()+g.slice(1)} için özel bir koku.`);
  if(ss.length===4)pts.push("Dört mevsim kullanılabilir.");
  else if(ss.length)pts.push(`${ss.map(s=>ST[s]||s).join(" ve ")} ayları için ideal.`);
  if(lo&&si)pts.push(`${lo.charAt(0).toUpperCase()+lo.slice(1)}, ${si} bırakır.`);
  return pts.join(" ");
}
function b(fid,brand,name,gender,year,rating,lon,sil,seasons,top,mid,base,accords,desc){
  const p={brand,name,notes:{top,middle:mid,base},accords,longevity:lon,sillage:sil,season:seasons,gender,rating,short_description:desc,year,image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${fid}.jpg`};
  p.short_description_tr=tr(p);return p;
}

const NEW=[

// ══════════════════════════════════════════════════════
// DIOR – tüm seriler
// ══════════════════════════════════════════════════════
b(62718,"Dior","J'adore in Joy EDT","female",2017,3.72,"moderate","soft",["spring","summer"],["Magnolia","Ylang-Ylang"],["Jasmine","Peach"],["White Musk"],["floral","fresh","fruity","musk"],"Light and fresh J'adore. Magnolia and peach. Daytime elegance."),
b(3406,"Dior","Dior Addict EDP","female",2002,3.95,"long","strong",["fall","winter"],["Bergamot","Mandarin","Neroli"],["Bourbon Vanilla","Night-Blooming Jasmine"],["Sandalwood","Musk"],["floral","sweet","vanilla","oriental"],"The addictive feminine. Jasmine and vanilla. Irresistible and bold."),
b(50753,"Dior","Dior Addict EDP 2014","female",2014,3.88,"long","strong",["fall","winter"],["Lily","Neroli","Pink Pepper"],["Datura","Jasmine","Magnolia"],["Tonka Bean","White Musk","Sandalwood"],["floral","sweet","warm spicy","musk"],"Reformulated Addict. Datura and jasmine. Seductive and warm."),
b(1016,"Dior","Miss Dior Chérie L'Eau EDT","female",2007,3.65,"moderate","soft",["spring","summer"],["Italian Mandarin","Violet","Grapefruit"],["Peony","Rose"],["Musk","Cedarwood","Sandalwood"],["floral","citrus","fresh","musk"],"Lightest Miss Dior. Mandarin and peony. Summer freshness."),
b(46436,"Dior","The Collection Couturier Parfumeur: Milly-la-Forêt","unisex",2012,4.08,"long","moderate",["spring","summer"],["Mint","Thyme"],["Tomato Leaf","Bay"],["Incense","Musk"],["green","herbal","earthy","fresh"],"Dior's private garden. Mint and tomato leaf. Unexpected and beautiful."),
b(50756,"Dior","Eau Fraîche EDT","male",2007,3.75,"moderate","soft",["spring","summer"],["Lemon","Cedar","Bergamot"],["Vetiver","Coriander","Eggplant Flower"],["White Musk","Sandalwood"],["fresh","citrus","aromatic","woody"],"Light and easygoing. Lemon and vetiver. Everyday coolness."),
b(23039,"Dior","Homme Cologne","male",2013,3.88,"short","moderate",["spring","summer"],["Bergamot","Lavender","Grapefruit"],["Iris","Ambrette"],["White Musk"],["citrus","iris","fresh","musk"],"Cleanest Dior Homme. Bergamot and iris. Fresh masculinity."),

// ══════════════════════════════════════════════════════
// CHANEL – tüm seriler
// ══════════════════════════════════════════════════════
b(17081,"Chanel","Allure Homme Edition Blanche EDT","male",2008,4.0,"long","moderate",["spring","summer"],["Bergamot","White Musk"],["White Cedar","Sandalwood"],["White Musk","Sandalwood"],["fresh","woody","citrus","musk"],"The white version. Cleaner and crisper. Summer masculine elegance."),
b(216,"Chanel","Coco Noir EDP","female",2012,4.05,"long","strong",["fall","winter"],["Bergamot","Grapefruit","Jasmine"],["Rose","Sandalwood","Geranium"],["Patchouli","White Musk","Benzyl Benzoate","Incense"],["floral","woody","patchouli","citrus"],"Dark and mysterious Coco. Rose and patchouli with incense. Nocturnal beauty."),
b(36040,"Chanel","No.5 L'Eau EDT","female",2016,3.82,"moderate","moderate",["spring","summer"],["Lemon","Aldehydes","Orange"],["Jasmine","Rose","Ylang-Ylang","Lily of the Valley","Iris"],["Sandalwood","Musk","Vetiver"],["floral","fresh","aldehydic","citrus"],"Modern No.5. Lighter and fresher. The classic made contemporary."),
b(17083,"Chanel","Chance Eau Fraîche Eau de Toilette","female",2007,3.78,"moderate","soft",["spring","summer"],["Citrus","Teak Wood","Water Hyacinth"],["Iris","Jasmine","Cyclamen"],["White Musk","Cedar","Vetiver"],["fresh","citrus","floral","aquatic"],"Wateriest Chance. Aquatic and clean. Ultra-refreshing."),
b(9099,"Chanel","Allure Sensuelle EDP","female",2006,3.92,"long","moderate",["fall","winter"],["Bergamot","Mandarin","Aldehydes"],["Rose","Orchid","Jasmine"],["Amber","Vanilla","Benzyl Benzoate","Sandalwood"],["floral","oriental","sweet","amber"],"Sensual Allure. Warmer and more oriental. Evening feminine luxury."),
b(46442,"Chanel","Les Exclusifs: Cuir de Russie EDP","unisex",2007,4.38,"long","strong",["fall","winter"],["Bergamot","Neroli","Ylang-Ylang"],["Rose","Jasmine","Orris"],["Leather","Cedarwood","Sandalwood","Vetiver","Amber"],["leather","floral","woody","amber"],"Russian leather masterpiece. Rose and leather in perfect harmony. Iconic."),
b(46440,"Les Exclusifs de Chanel","N°22 Eau de Toilette","female",1922,4.18,"long","moderate",["spring","fall"],["Aldehydes","Rose","Ylang-Ylang"],["Iris","Lily of the Valley","Jasmine"],["Musk","Civet","Sandalwood","Amber"],["floral","powdery","aldehydic","sweet"],"Pre-No.5 Chanel. Powdery and rich. Heritage fragrance."),
b(4936,"Les Exclusifs de Chanel","Jersey EDP","female",2011,3.85,"long","moderate",["spring","fall"],["Bourbon Vanilla","Coumarin"],["White Flowers","Musky Notes"],["Vetiver","Musk","Amber"],["floral","vanilla","powdery","musk"],"Soft and feminine. Vanilla and white flowers. Understated luxury."),

// ══════════════════════════════════════════════════════
// TOM FORD – tüm seriler
// ══════════════════════════════════════════════════════
b(3189,"Tom Ford","Tuscan Leather EDP","unisex",2007,4.35,"very_long","strong",["fall","winter"],["Raspberry","Saffron"],["Thyme","Jasmine"],["Leather","Amber","Wood","Musk"],["leather","fruity","spicy","amber"],"Raspberry leather dream. Rich and sensual. Private Blend classic."),
b(16552,"Tom Ford","Champaca Absolute EDP","unisex",2008,4.18,"long","strong",["fall","winter"],["Bergamot","Black Pepper","Cardamom"],["Champaca","Sandalwood"],["Amber","Musk","Cedarwood"],["floral","spicy","woody","amber"],"The champaca flower. Cardamom and sandalwood. Exotic luxury."),
b(38040,"Tom Ford","Private Blend Jasmin Rouge EDP","female",2009,4.22,"long","strong",["spring","fall"],["Black Pepper","Cloves"],["Jasmine","Cistus"],["Labdanum","Patchouli","Sandalwood"],["floral","spicy","woody","leather"],"Dark jasmine. Spicy and mysterious. Private Blend femininity."),
b(23436,"Tom Ford","Santal Blush EDP","unisex",2011,4.12,"long","strong",["fall","winter"],["Cinnamon","Cardamom"],["Rose","Tuberose"],["Sandalwood","Vetiver","Amber"],["woody","spicy","floral","creamy"],"Blush-tinted sandalwood. Rose and cinnamon. Warm and sensual."),
b(34514,"Tom Ford","Italian Cypress EDP","unisex",2007,4.05,"long","moderate",["spring","fall"],["Lemon","Bergamot"],["Cypress","Juniper"],["Vetiver","Musk","Amber"],["green","woody","citrus","aromatic"],"Italian countryside. Cypress and juniper. Sunny and contemplative."),
b(38039,"Tom Ford","Shanghai Lily EDP","female",2011,3.98,"long","strong",["fall","winter"],["Magnolia","Red Pepper","Bergamot"],["Lily","Jasmine"],["Sandalwood","Amber","Patchouli"],["floral","spicy","woody","oriental"],"Shanghai exoticism. Lily and red pepper. Eastern luxury."),
b(34515,"Tom Ford","Café Rose EDP","unisex",2012,4.02,"long","strong",["spring","fall"],["Cardamom","Coffee","Saffron"],["Damascene Rose","Turkish Rose","Damask Rose"],["Patchouli","Amber","Sandalwood"],["rose","coffee","spicy","woody"],"Rose with coffee. Saffron and rose. The most original in the line."),
b(46447,"Tom Ford","White Suede EDP","unisex",2008,4.15,"long","moderate",["spring","fall"],["Pink Pepper","Magnolia"],["Rose","Iris"],["Suede","White Musk","Amber"],["suede","floral","powdery","musk"],"White suede luxury. Rose and iris with suede. Soft and sensual."),
b(62706,"Tom Ford","Eau de Soleil Blanc EDT","unisex",2018,3.95,"moderate","moderate",["spring","summer"],["Bergamot","Mandarin","Orange"],["Ylang-Ylang","Iris"],["Musk","Cedarwood","Amber"],["citrus","floral","fresh","musk"],"Lighter Soleil Blanc. Citrus and ylang-ylang. Summer luxury."),
b(72840,"Tom Ford","Noir Anthracite EDP","male",2021,4.12,"long","strong",["fall","winter"],["Bergamot","Violet","Coriander"],["Iris","Vetiver","Orris"],["Amber","Musk","Cedarwood","Patchouli"],["iris","woody","aromatic","amber"],"Dark and refined. Iris and vetiver. Sophisticated masculinity."),
b(52062,"Tom Ford","Ebène Fumé EDP","unisex",2021,4.18,"long","strong",["fall","winter"],["Smoky Notes","Bergamot"],["Ebony","Guaiac Wood","Leather"],["Amber","Musk","Cedarwood"],["smoky","woody","leather","amber"],"Smoked ebony. Dark woods and leather. Dramatic and complex."),
b(38038,"Tom Ford","Amber Absolute EDP","unisex",2007,4.28,"very_long","enormous",["fall","winter"],["Bergamot","Elemi","Coriander"],["Labdanum","Styrax","Cistus","Myrrh"],["Amber","Vetiver","Sandalwood","Musk"],["amber","balsamic","resinous","oriental"],"The absolute amber. Labdanum and myrrh. Olfactory amber masterpiece."),
b(38037,"Tom Ford","Bois Marocain EDP","unisex",2007,4.08,"long","strong",["fall","winter"],["Bergamot","Cedar","Coriander"],["Atlas Cedar","Vetiver","Labdanum"],["Sandalwood","Amber","Musk"],["woody","cedar","earthy","spicy"],"Moroccan cedarwood. Atlas cedar and vetiver. Earthy and warm."),
b(72841,"Tom Ford","Rose d'Amalfi EDP","female",2021,3.98,"long","moderate",["spring","summer"],["Bergamot","Lemon","Magnolia"],["Amalfi Rose","Jasmine"],["Cedarwood","Musk","Sandalwood"],["rose","floral","citrus","woody"],"Amalfi coast rose. Lemon and jasmine. Italian summer luxury."),
b(74449,"Tom Ford","Orris Tattoo EDP","unisex",2018,4.05,"long","strong",["fall","winter"],["Bergamot","Mandarin","Pink Pepper"],["Iris","Orris","Violet"],["Amber","Musk","Sandalwood"],["iris","spicy","powdery","woody"],"Tattooed iris. Pepper and orris. Bold and distinctive."),

// ══════════════════════════════════════════════════════
// GUERLAIN – tüm seriler
// ══════════════════════════════════════════════════════
b(15,"Guerlain","Jicky EDP","unisex",1889,4.25,"very_long","strong",["fall","winter"],["Bergamot","Lemon","Rosemary","Basil"],["Lavender","Jasmine","Rose","Orris"],["Tonka Bean","Civet","Sandalwood","Vetiver"],["aromatic","fougere","oriental","earthy"],"The world's first modern perfume. Lavender and civet. 1889 legend."),
b(1420,"Guerlain","Vol de Nuit EDP","female",1933,4.18,"very_long","strong",["fall","winter"],["Bergamot","Aldehydes","Basil"],["Jasmine","Orris","Neroli"],["Vanilla","Musk","Amber","Vetiver","Oakmoss"],["floral","oriental","aldehydic","amber"],"Night flight. Rich oriental floral. 1933 aviation-inspired classic."),
b(1421,"Guerlain","Heure Bleue EDP","female",1912,4.22,"very_long","strong",["fall","winter"],["Bergamot","Anise","Neroli"],["Carnation","Rose","Jasmine","Iris","Ylang-Ylang"],["Vanilla","Musk","Sandalwood","Vetiver"],["floral","powdery","oriental","animalic"],"The blue hour. Iris and carnation. 1912 twilight poetry."),
b(3409,"Guerlain","Guerlain Homme EDT","male",2008,3.78,"moderate","moderate",["spring","summer"],["Lime","Bergamot","Spearmint"],["Vetiver","Coriander"],["White Musk","Sandalwood"],["fresh","citrus","aromatic","woody"],"Fresh and modern. Lime and mint. Contemporary Guerlain masculinity."),
b(9051,"Guerlain","Vetiver EDT","male",1959,4.25,"long","strong",["spring","fall"],["Lemon","Bergamot","Neroli"],["Vetiver","Tobacco","Spices"],["Sandalwood","Oakmoss","Amber"],["vetiver","earthy","citrus","woody"],"The vetiver king. 1959 tobacco and vetiver. Enduring masculine icon."),
b(15,"Guerlain","Terracotta Le Parfum EDP","female",2020,3.88,"long","moderate",["spring","summer"],["Bergamot","Ylang-Ylang"],["Orange Blossom","White Musk"],["Sandalwood","Tonka Bean"],["floral","fresh","musk","woody"],"Sun-kissed skin. Orange blossom and sandalwood. Mediterranean warmth."),
b(74458,"Guerlain","Mon Guerlain Sparkling Bouquet EDP","female",2021,3.82,"long","moderate",["spring","summer"],["Bergamot","Lavender"],["Jasmine Sambac","Lily","Peony"],["Tonka Bean","Sandalwood","Vanilla"],["floral","lavender","fresh","sweet"],"Sparkling bouquet. Lily and lavender. Bright and feminine."),
b(46436,"Guerlain","Aqua Allegoria Pera Granita EDT","unisex",2020,3.75,"short","soft",["spring","summer"],["Pear","Ginger","Bergamot"],["White Musk"],["White Musk"],["citrus","fruity","fresh","musk"],"Pear granita. Fresh and icy. Summer refreshment."),
b(52067,"Guerlain","Spiritueuse Double Vanille EDP","unisex",2007,4.32,"very_long","enormous",["fall","winter"],["Aldehydes"],["Bourbon Vanilla","Tonka Bean"],["Sandalwood","Musk","White Musk"],["vanilla","sweet","creamy","oriental"],"Double vanilla luxury. Rich and enveloping. The ultimate vanilla."),
b(23437,"Guerlain","Encens Mythique d'Orient EDP","unisex",2013,4.15,"long","strong",["fall","winter"],["Bergamot","Lemon"],["Incense","Oud","Rose"],["Sandalwood","Amber","Musk"],["incense","oud","oriental","amber"],"Mythical incense. Oud and frankincense. Ancient ritual in a bottle."),

// ══════════════════════════════════════════════════════
// VERSACE – tüm seriler
// ══════════════════════════════════════════════════════
b(23040,"Versace","Versace Pour Femme EDT","female",2005,3.72,"long","moderate",["spring","summer"],["Ninfea Flower","Cyclamen","Bergamot"],["Peony","Rose","Jasmine"],["White Musk","Amber","Cashmere Wood"],["floral","fresh","citrus","musk"],"Feminine Versace grace. Ninfea and peony. Soft Italian luxury."),
b(44019,"Versace","Versace Man Eau Fraîche EDT","male",2006,3.75,"moderate","moderate",["spring","summer"],["Lemon","Bergamot","Rosewood"],["Sage","Sycamore","Amber"],["White Musk","Mineral Water"],["fresh","citrus","aromatic","aquatic"],"Mediterranean fresh. Lemon and sage. Cool Italian masculinity."),
b(34497,"Versace","Signature EDP","female",2004,3.78,"long","moderate",["spring","fall"],["Bergamot","Grapefruit","Cardamom"],["Iris","Violet","Camellia"],["Amber","Musk","Sandalwood"],["floral","iris","spicy","woody"],"Signature feminine elegance. Iris and camellia. Refined Italian style."),
b(15496,"Versace","Eros Pour Femme EDT","female",2014,3.88,"long","moderate",["spring","summer"],["Pomegranate","Lemon","Mandarin"],["Peony","Lotus Flower","Rose"],["Musk","Ambrette","Sandalwood","Woodsy Notes"],["floral","fruity","fresh","musk"],"Feminine Eros. Pomegranate and peony. Radiant Italian goddess."),
b(62715,"Versace","Pour Femme Dylan Blue EDP","female",2017,3.85,"long","moderate",["spring","summer"],["Cassis","Pineapple","Bergamot"],["Cyclamen","Osmanthus","Lotus","White Flowers"],["Patchouli","Musk","Woody Notes"],["floral","fruity","fresh","woody"],"Blue feminine. Cassis and cyclamen. Modern Italian signature."),

// ══════════════════════════════════════════════════════
// ARMANI – tüm seriler
// ══════════════════════════════════════════════════════
b(15437,"Giorgio Armani","Armani Privé Rose d'Arabie EDP","unisex",2006,4.22,"long","strong",["spring","fall"],["Rose","Blackcurrant"],["Jasmine","Oud"],["Sandalwood","Amber","Musk"],["rose","oud","floral","amber"],"Arabian rose luxury. Rose and oud. Armani at its most opulent."),
b(37037,"Giorgio Armani","Armani Code Absolu EDP","male",2022,4.12,"long","strong",["fall","winter"],["Cardamom","Mandarin"],["Hazelnut","Tonka Bean","Orange Blossom"],["Vetiver","Sandalwood"],["warm spicy","sweet","floral","woody"],"Absolute masculine code. Hazelnut and cardamom. Irresistibly addictive."),
b(7012,"Giorgio Armani","Emporio Armani Diamonds EDP","female",2006,3.78,"long","moderate",["spring","fall"],["Lychee","Raspberry"],["Rose","Peony"],["Patchouli","Vetiver"],["floral","fruity","rose","woody"],"Diamond brilliance. Lychee and rose. Sparkling feminine elegance."),
b(66513,"Giorgio Armani","Armani Code Profumo EDP","male",2016,4.05,"very_long","strong",["fall","winter"],["Cardamom","Bergamot"],["Lavender","Apple","Orange Blossom"],["Tonka Bean","Amberwood"],["sweet","aromatic","fresh","amber"],"Profumo intensity. Apple and tonka. The most sensual Code."),
b(2625,"Giorgio Armani","Emporio Armani She EDT","female",2000,3.68,"moderate","moderate",["spring","summer"],["Bergamot","White Grapefruit"],["Rose","Hyacinth","Freesia"],["Musk","Sandalwood"],["floral","fresh","citrus","musk"],"Emporio freshness. Bergamot and hyacinth. Modern and light."),
b(52067,"Giorgio Armani","Acqua di Gio pour Femme EDT","female",1995,3.78,"moderate","moderate",["spring","summer"],["Calabrian Bergamot","Sicilian Lemon","Orange","Jasmine"],["Peony","Cyclamen","Rose","Coriander"],["Musk","Amber","Sandalwood","Cedarwood"],["floral","fresh","citrus","aquatic"],"The original aquatic feminine. Calabrian bergamot and peach. Classic."),
b(74459,"Giorgio Armani","Terra Di Giò EDP","male",2021,4.08,"long","strong",["spring","fall"],["Calabrian Bergamot","Green Mandarin"],["Pepperwood","Sage"],["Sandalwood","Musk","Ambroxan"],["woody","fresh","aromatic","citrus"],"Sicilian earth. Calabrian bergamot and sage. Modern Mediterranean."),

// ══════════════════════════════════════════════════════
// PRADA – tüm seriler
// ══════════════════════════════════════════════════════
b(46448,"Prada","L'Homme L'Eau EDT","male",2020,3.82,"moderate","moderate",["spring","summer"],["Bergamot","Neroli","Iris"],["Iris","Vetiver","Geranium"],["White Musk"],["iris","fresh","citrus","musk"],"The lightest L'Homme. Iris and neroli. Clean and airy."),
b(27520,"Prada","Candy Florale EDT","female",2012,3.65,"moderate","soft",["spring","summer"],["Neroli"],["White Flowers","Benzyl Benzoate"],["White Musk","Sandalwood"],["floral","white floral","fresh","musk"],"Lightest Candy. Neroli and white flowers. Innocent sweetness."),
b(34494,"Prada","Candy Kiss EDT","female",2016,3.72,"moderate","moderate",["spring","fall"],["Neroli","Lily"],["Muguet","White Musk","Benzyl Benzoate"],["Musk","Sandalwood"],["floral","white floral","musk","fresh"],"Sweet kiss. Muguet and neroli. Tender and romantic."),
b(66520,"Prada","Prada Intense EDP","female",2020,3.88,"long","strong",["fall","winter"],["Bergamot"],["Iris","Amber","Ylang-Ylang"],["Vetiver","Patchouli","Sandalwood"],["iris","amber","floral","woody"],"Intense Prada for her. Deeper amber and iris. Sophisticated power."),
b(52068,"Prada","Olfactories Infusion de Mandarine EDT","unisex",2015,3.78,"short","soft",["spring","summer"],["Mandarin","Bergamot","Orange"],["Orange Blossom","Neroli"],["White Musk","Sandalwood"],["citrus","floral","fresh","musk"],"Pure mandarin. Orange blossom and neroli. Summer lightness."),
b(57496,"Prada","Les Infusions de Prada Fleur d'Oranger EDP","unisex",2017,3.92,"moderate","moderate",["spring","summer"],["Orange","Bergamot"],["Orange Blossom","Neroli","Mandarin"],["White Musk","Sandalwood","Vetiver"],["floral","citrus","fresh","musk"],"Orange blossom infusion. Sun-drenched flowers. Mediterranean joy."),
b(62705,"Prada","Luna Rossa Ocean EDP","male",2021,4.02,"long","strong",["spring","summer"],["Sea Notes","Bergamot"],["Vetiver","Sage","Iris"],["Ambroxan","White Musk","Cedarwood"],["aquatic","woody","iris","fresh"],"Ocean masculinity. Sea and vetiver. Athletic and refined."),

// ══════════════════════════════════════════════════════
// DOLCE & GABBANA – tüm seriler
// ══════════════════════════════════════════════════════
b(2628,"Dolce & Gabbana","Velvet Rose EDP","female",2011,3.88,"long","moderate",["spring","fall"],["Rose","Bergamot"],["Damask Rose","Black Rose"],["Musk","Amber","Sandalwood"],["rose","floral","woody","amber"],"Velvet rose luxury. Dark and light rose. Italian feminine opulence."),
b(15497,"Dolce & Gabbana","The One EDP","male",2010,4.05,"long","strong",["fall","winter"],["Bergamot","Coriander","Grapefruit"],["Ginger","Basil","Cardamom","Tobacco"],["Amber","Cedarwood","Musk"],["tobacco","warm spicy","aromatic","citrus"],"The masculine ideal. Tobacco and ginger. The man every woman wants."),
b(17079,"Dolce & Gabbana","Anthology L'Imperatrice 3 EDT","female",2009,3.75,"moderate","moderate",["spring","summer"],["Kiwi","Grapefruit","Crocus","Green Citrus"],["Lychee","Watermelon","White Musk"],["Sandalwood","White Musk"],["fruity","fresh","citrus","aquatic"],"Tropical imperial. Kiwi and lychee. Fresh and playful."),
b(23041,"Dolce & Gabbana","The One Gentleman EDT","male",2010,3.82,"long","moderate",["fall","winter"],["Grapefruit","Bergamot","Cardamom"],["Basil","Pepper","Violet"],["Tobacco","Amber","Cedarwood"],["aromatic","spicy","tobacco","woody"],"The Gentleman. Violet and tobacco. Noble and modern."),
b(46435,"Dolce & Gabbana","Dolce Rosa Excelsa EDP","female",2019,3.78,"long","moderate",["spring","fall"],["Bergamot","Yuzu"],["Rosa Excelsa","Peony"],["Sandalwood","Musk"],["rose","floral","citrus","woody"],"Rare rose luxury. Rosa Excelsa and yuzu. Exclusive beauty."),
b(50754,"Dolce & Gabbana","Anthology The Empress 3 EDT","female",2009,3.68,"moderate","soft",["spring","summer"],["Rose","Sandalwood","White Musk"],["Water Lily","Jasmine"],["Sandalwood","White Musk"],["floral","aquatic","fresh","musk"],"Empress water flowers. Water lily and jasmine. Serene and graceful."),

// ══════════════════════════════════════════════════════
// MONTALE
// ══════════════════════════════════════════════════════
b(7004,"Montale","Black Aoud EDP","unisex",2006,4.32,"very_long","enormous",["fall","winter"],["Rose","Oud"],["Oud","Patchouli","Rose"],["Musk","Sandalwood","Amber"],["oud","rose","patchouli","amber"],"The dark oud masterpiece. Rose and patchouli over oud. Intense luxury."),
b(7006,"Montale","Roses Musk EDP","unisex",2007,4.18,"long","strong",["spring","fall"],["Roses","Musk"],["Roses","Peony"],["Musk","White Musk"],["rose","musk","floral","sweet"],"Rose and musk purity. Peony and soft musk. Universally loved."),
b(23424,"Montale","Intense Café EDP","unisex",2012,4.28,"very_long","strong",["fall","winter"],["Coffee","Rose","Vanilla"],["Coffee","Rose","Bourbon"],["Musk","Sandalwood","Amber"],["coffee","rose","sweet","vanilla"],"Coffee and rose. Addictive and warm. The Montale icon."),
b(15427,"Montale","Dark Purple EDP","female",2012,4.05,"long","strong",["fall","winter"],["Plum","Violet","Raspberry"],["Oud","Rose"],["Musk","Sandalwood","Amber"],["floral","fruity","oud","sweet"],"Dark purple luxury. Plum and rose oud. Deep and beautiful."),
b(27509,"Montale","Cedrat Boisé EDP","unisex",2012,4.35,"very_long","enormous",["spring","summer","fall"],["Bergamot","Lemon","Cedar","Citrus"],["Sandalwood","Guaiac Wood","Cedar","Amber"],["Musk","Ambergris","Amber"],["citrus","woody","fresh","amber"],"Cedrat Boisé powerhouse. Cedar and citrus. Universally beloved."),
b(34492,"Montale","White Musk EDP","unisex",2009,3.95,"long","moderate",["spring","summer"],["Musk","Bergamot"],["Musk","Rose"],["White Musk","Sandalwood"],["musk","floral","fresh","woody"],"Pure white musk. Rose and clean musk. Simple and irresistible."),
b(34493,"Montale","Wild Pears EDP","unisex",2014,3.92,"moderate","moderate",["spring","summer"],["Pear","Bergamot","Lemon"],["Rose","Lily","Jasmine"],["Musk","Sandalwood"],["fruity","floral","fresh","musk"],"Wild orchard. Pear and jasmine. Joyful and natural."),
b(35504,"Montale","Aoud Forest EDP","unisex",2010,4.08,"long","strong",["fall","winter"],["Bergamot","Lemon"],["Oud","Sandalwood","Spices"],["Amber","Musk","Patchouli"],["oud","woody","spicy","amber"],"Forest oud. Spices and sandalwood. Rich and deep."),
b(46434,"Montale","Starry Nights EDP","unisex",2017,3.98,"long","strong",["fall","winter"],["Bergamot","Saffron"],["Rose","Oud","Amber"],["Sandalwood","Musk","Patchouli"],["oud","rose","amber","spicy"],"Starry Arabian nights. Rose and saffron oud. Romantic and exotic."),
b(46433,"Montale","Vanilla Extasy EDP","female",2010,4.02,"long","strong",["fall","winter"],["Vanilla","Rose","Orchid"],["Bourbon Vanilla","Rose","Orchid"],["White Musk","Sandalwood","Amber"],["vanilla","floral","sweet","creamy"],"Vanilla paradise. Rose and orchid with bourbon vanilla. Addictive."),
b(52069,"Montale","Golden Sand EDP","unisex",2016,3.88,"long","moderate",["spring","summer"],["Bergamot","Mandarin"],["Iris","Sandalwood","Amber"],["Amber","Musk","White Musk"],["amber","iris","citrus","musk"],"Golden dunes. Iris and amber. Warm Mediterranean luxury."),

// ══════════════════════════════════════════════════════
// MANCERA
// ══════════════════════════════════════════════════════
b(27509,"Mancera","Cedrat Boisé EDP","unisex",2011,4.38,"very_long","enormous",["spring","summer","fall"],["Bergamot","Cedrat","Grapefruit","Juniper"],["Leather","Sandalwood","Guaiac Wood"],["Musk","Amber","Beeswax","Ambergris"],["citrus","woody","leather","fresh"],"The Mancera legend. Cedrat and leather. Best citrus woody ever."),
b(35503,"Mancera","Red Tobacco EDP","unisex",2014,4.35,"very_long","enormous",["fall","winter"],["Bergamot","Lemon"],["Tobacco","Red Fruits","Rose"],["Amber","Musk","Sandalwood","Vanilla"],["tobacco","sweet","fruity","amber"],"Red tobacco luxury. Fruits and tobacco. Addictive and complex."),
b(27510,"Mancera","Roses Greedy EDP","unisex",2012,4.15,"long","strong",["spring","fall"],["Bergamot","Fruits"],["Roses","Caramel","Vanilla"],["Musk","Amber","Sandalwood"],["rose","sweet","caramel","fruity"],"Greedy for roses. Caramel and rose. Sweet and lush."),
b(27511,"Mancera","Royal Vanilla EDP","unisex",2015,4.18,"very_long","strong",["fall","winter"],["Bergamot","Orange"],["Vanilla","Orchid","Jasmine"],["Musk","Sandalwood","Amber"],["vanilla","floral","sweet","creamy"],"Royal vanilla richness. Orchid and vanilla. Opulent and warm."),
b(35502,"Mancera","Instant Crush EDP","unisex",2015,4.12,"long","strong",["spring","fall"],["Bergamot","Peach"],["Jasmine","Rose","Peach"],["Musk","Sandalwood","Amber","Patchouli"],["floral","fruity","rose","sweet"],"Instant attraction. Peach and jasmine. Romantic and fresh."),
b(46432,"Mancera","Aoud Carnation EDP","unisex",2010,4.08,"long","strong",["fall","winter"],["Bergamot","Saffron"],["Carnation","Oud","Rose"],["Musk","Sandalwood","Amber"],["oud","floral","spicy","amber"],"Carnation and oud. Spicy and rich. Sophisticated Eastern luxury."),
b(52070,"Mancera","Gold Incense EDP","unisex",2016,4.05,"long","strong",["fall","winter"],["Bergamot","Lemon"],["Incense","Labdanum","Oud"],["Amber","Sandalwood","Musk"],["incense","oud","amber","resinous"],"Golden sacred incense. Labdanum and oud. Spiritual luxury."),
b(57497,"Mancera","Hindu Kush EDP","unisex",2014,4.22,"very_long","strong",["fall","winter"],["Bergamot","Cardamom","Saffron"],["Oud","Amber","Jasmine"],["Sandalwood","Musk","Patchouli"],["oud","spicy","amber","floral"],"Hindu Kush mountains. Saffron and oud. Epic journey in a bottle."),

// ══════════════════════════════════════════════════════
// HUGO BOSS – tüm seriler
// ══════════════════════════════════════════════════════
b(72836,"Hugo Boss","Boss Alive EDP","female",2020,3.88,"long","moderate",["spring","fall"],["Tangerine","Bergamot","Black Currant"],["Jasmine","Vanilla","White Flowers"],["Sandalwood","Musk","Cedarwood"],["floral","fruity","sweet","woody"],"Alive and vibrant. Tangerine and jasmine. Modern Boss femininity."),
b(72837,"Hugo Boss","Boss Bottled Infinite EDP","male",2021,3.95,"long","strong",["fall","winter"],["Apple","Bergamot","Cardamom"],["Nutmeg","Cinnamon","Lavender"],["Amber","Sandalwood","Cedarwood","Musk"],["warm spicy","sweet","apple","woody"],"Infinite confidence. Cardamom and apple. Elevated Boss classic."),
b(3408,"Hugo Boss","Hugo Extreme EDP","male",2018,3.72,"long","moderate",["spring","fall"],["Apple","Bergamot","Lavender"],["Cinnamon","Geranium"],["White Musk","Sandalwood","Cedarwood"],["fresh","aromatic","apple","woody"],"Extreme version. Apple and cinnamon. More intense Hugo."),
b(3413,"Hugo Boss","Deep Red EDP","female",2001,3.78,"long","moderate",["fall","winter"],["Black Currant","Tangerine","Peach"],["Freesia","Jasmine","Rose"],["Musk","Amber","Cedarwood","Sandalwood"],["floral","fruity","sweet","amber"],"Deep crimson. Peach and rose. Warm and feminine."),
b(27521,"Hugo Boss","Boss Orange EDT","male",2011,3.65,"moderate","moderate",["spring","summer"],["Orange","Mandarin","Grapefruit"],["Vetiver","Cedarwood"],["White Musk","Sandalwood"],["citrus","fresh","woody","aromatic"],"Vibrant orange. Citrus and cedarwood. Active and energetic."),
b(33041,"Hugo Boss","Boss Nuit pour Femme EDP","female",2012,3.72,"long","moderate",["fall","winter"],["Bergamot","Lemon"],["Rose","Lily","Iris"],["White Musk","Vetiver","Sandalwood"],["floral","fresh","rose","woody"],"Boss night feminine. Rose and lily. Elegant evening wear."),

// ══════════════════════════════════════════════════════
// BURBERRY – tüm seriler
// ══════════════════════════════════════════════════════
b(74460,"Burberry","Goddess EDP","female",2023,4.12,"very_long","strong",["fall","winter"],["Black Currant"],["Lavender","Vanilla Absolute","Frangipani"],["Musk","Vetiver","Sandalwood"],["sweet","floral","lavender","vanilla"],"New Burberry goddess. Lavender and vanilla absolute. The new icon."),
b(60868,"Burberry","Her London Dream EDP","female",2020,3.85,"long","moderate",["spring","fall"],["Red Berries","Lemon"],["Jasmine","Violet","Peony"],["Dry Amber","Musk","Sandalwood"],["floral","fruity","amber","musk"],"London dream. Violet and red berries. Modern British femininity."),
b(51478,"Burberry","London for Women EDP","female",2006,3.78,"long","moderate",["spring","fall"],["Bergamot","Lemon"],["Peony","Violet Leaf","Jasmine"],["Patchouli","Amber","Sandalwood","White Cedar"],["floral","chypre","citrus","woody"],"Rainy London femininity. Peony and patchouli. Classic British."),
b(27523,"Burberry","Brit Sheer EDT","female",2003,3.65,"moderate","soft",["spring","summer"],["Grapefruit","Lemon","Bergamot"],["Almond Blossom","Peach Blossom","Jasmine"],["White Musk","Sandalwood"],["floral","citrus","fruity","fresh"],"Sheer British. Grapefruit and almond blossom. Light and fresh."),
b(15449,"Burberry","Sport for Women EDT","female",2010,3.62,"moderate","soft",["spring","summer"],["Grapefruit","Bergamot","Pink Pepper"],["Jasmine","Cyclamen","Rose"],["White Musk","Cedarwood"],["fresh","floral","citrus","spicy"],"Sport femininity. Grapefruit and cyclamen. Active and fresh."),

// ══════════════════════════════════════════════════════
// GIVENCHY – tüm seriler
// ══════════════════════════════════════════════════════
b(2355,"Givenchy","Very Irresistible EDT","female",2004,3.82,"long","moderate",["spring","summer"],["Anise","Peony","Watermelon","Rhubarb"],["Rose","Carnation"],["Musk","White Musk","Amber"],["floral","fruity","fresh","musk"],"Very fresh and irresistible. Rose and peony. Playfully feminine."),
b(57498,"Givenchy","Irresistible Givenchy Very Floral EDP","female",2021,3.78,"long","moderate",["spring","summer"],["Bergamot","Mandarin"],["Rose","Jasmine","Lily"],["Musk","Sandalwood"],["floral","fresh","rose","musk"],"Very floral. Rose and lily. Maximum garden bloom."),
b(23438,"Givenchy","Gentlemen Only Casual Chic EDT","male",2017,3.72,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Mandarin"],["Geranium","Vetiver","Lavender"],["Cedarwood","White Musk"],["fresh","citrus","aromatic","woody"],"Casual chic. Geranium and lemon. Effortless French style."),
b(34490,"Givenchy","Play EDT","male",2008,3.68,"moderate","moderate",["spring","summer"],["Bergamot","Hazelnut","Metal"],["Iris","Patchouli","Vetiver"],["Musk","Sandalwood"],["woody","citrus","aromatic","iris"],"Playful masculinity. Hazelnut and iris. Modern and interesting."),
b(15438,"Givenchy","Dahlia Divin EDP","female",2014,3.82,"long","moderate",["fall","winter"],["Bergamot","Pear","Neroli"],["Iris","Musk","White Flowers"],["Sandalwood","Vetiver","White Musk"],["floral","iris","fruity","woody"],"Divine dahlia. Iris and pear. Elegant and refined."),

// ══════════════════════════════════════════════════════
// ESCADA
// ══════════════════════════════════════════════════════
b(27520,"Escada","Especially Escada EDP","female",2011,3.72,"long","moderate",["spring","summer"],["Bergamot","Lemon","Black Currant"],["Peony","Rose","Jasmine"],["White Musk","Sandalwood","Cashmere"],["floral","citrus","sweet","musk"],"Especially feminine. Rose and peony. Fresh and elegant."),
b(22434,"Escada","Joyful EDP","female",2012,3.68,"long","moderate",["spring","summer"],["Lychee","Black Currant","Bergamot"],["Jasmine","Rose","Peach"],["White Musk","Sandalwood","Cedarwood"],["floral","fruity","fresh","musk"],"Pure joy. Lychee and jasmine. Carefree and bright."),
b(15443,"Escada","Sunset Heat EDT","female",2007,3.58,"moderate","soft",["spring","summer"],["Peach","Mango","Papaya"],["Lily","Ylang-Ylang","Jasmine"],["White Musk","Cedarwood"],["fruity","floral","tropical","sweet"],"Tropical sunset. Mango and jasmine. Summer holiday."),
b(22435,"Escada","Taj Sunset EDT","female",2013,3.62,"moderate","soft",["spring","summer"],["Citrus","Peach","Passion Fruit"],["Lotus","White Flowers"],["Musk","Sandalwood"],["fruity","floral","tropical","fresh"],"Indian sunset. Passion fruit and lotus. Exotic summer."),
b(34489,"Escada","Fairy Love EDT","female",2015,3.65,"moderate","soft",["spring","summer"],["Strawberry","Apple","Cherry","Pink Grapefruit"],["Peony","Jasmine","Rose"],["Musk","Amber","Sandalwood"],["fruity","floral","sweet","fresh"],"Fairy sweetness. Strawberry and peony. Young and magical."),

// ══════════════════════════════════════════════════════
// DAVIDOFF – tüm seriler
// ══════════════════════════════════════════════════════
b(2097,"Davidoff","Good Life EDT","male",1999,3.65,"moderate","moderate",["spring","summer"],["Bergamot","Mandarin","Grapefruit"],["Ginger","Vetiver","Sandalwood"],["White Musk","Amber","Cedarwood"],["fresh","citrus","woody","aromatic"],"Good life freshness. Grapefruit and ginger. Positive and energetic."),
b(2098,"Davidoff","Echo Men EDT","male",2004,3.58,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Orange"],["Sandalwood","Vetiver"],["Musk","Amber"],["fresh","woody","citrus","musk"],"Echo fresh. Citrus and sandalwood. Clean and accessible."),
b(23439,"Davidoff","Champion EDT","male",2010,3.62,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Cardamom","Mandarin"],["Patchouli","Geranium","Sage"],["Musk","Amber","Sandalwood"],["fresh","aromatic","citrus","woody"],"Champion's fresh. Cardamom and sage. Athletic and clean."),

// ══════════════════════════════════════════════════════
// JOOP!
// ══════════════════════════════════════════════════════
b(57,"Joop!","Joop! Homme EDT","male",1989,3.88,"very_long","enormous",["fall","winter"],["Bergamot","Pimento","Mandarin","Orange"],["Cinnamon","Jasmine","Lily of the Valley","Heliotrope","Orchid"],["Tonka Bean","Musk","Sandalwood","Oakmoss","Amber"],["sweet","oriental","floral","warm spicy"],"Classic sweet masculine. Orange and cinnamon. 1989 icon everyone knows."),
b(2094,"Joop!","Jump EDT","male",2005,3.75,"long","moderate",["spring","fall"],["Grapefruit","Cardamom","Calabrian Bergamot"],["Geranium","Cedarwood","Clary Sage"],["Musk","Tonka Bean","Sandalwood"],["fresh","aromatic","citrus","woody"],"Jump into freshness. Grapefruit and geranium. Modern and active."),
b(23440,"Joop!","Wild Life EDT","male",2014,3.65,"moderate","moderate",["spring","summer"],["Bergamot","Grapefruit","Mandarin"],["Lavender","Cedar","Geranium"],["Musk","Sandalwood","Amberwood"],["fresh","citrus","aromatic","woody"],"Wild outdoor. Grapefruit and lavender. Energetic and free."),

// ══════════════════════════════════════════════════════
// TOMMY HILFIGER
// ══════════════════════════════════════════════════════
b(1004,"Tommy Hilfiger","Tommy EDT","male",1995,3.72,"long","moderate",["spring","summer"],["Lavender","Peppermint","Bergamot","Lemon","Rosemary"],["Spearmint","Geranium","Apple","Marigold","Basil"],["Musk","Amber","Sandalwood","Oakmoss","Pine Tree"],["fresh","fougere","aromatic","citrus"],"American preppy. Mint and lavender. Classic collegiate freshness."),
b(1005,"Tommy Hilfiger","Tommy Girl EDT","female",1996,3.78,"moderate","moderate",["spring","summer"],["Tangerine","Lemon","Apple","Black Currant","Chamomile"],["Lily","Jasmine","Violet","Rose","Marigold"],["Musk","Sandalwood","Cedarwood"],["floral","fresh","citrus","fruity"],"American girl. Tangerine and violet. Young and carefree."),
b(1006,"Tommy Hilfiger","Tommy Freedom EDT","male",2000,3.62,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Orange","Juniper"],["Geranium","Ginger","Violet","Lavender"],["Musk","Amber","Sandalwood"],["fresh","aromatic","citrus","woody"],"Free spirit. Bergamot and ginger. American outdoor adventure."),
b(23441,"Tommy Hilfiger","Wet EDT","female",2001,3.55,"moderate","soft",["spring","summer"],["Grapefruit","Lemon"],["Lily of the Valley","Jasmine"],["Musk","Sandalwood"],["fresh","floral","citrus","aquatic"],"Wet freshness. Grapefruit and lily. Clean aquatic."),

// ══════════════════════════════════════════════════════
// NAUTICA
// ══════════════════════════════════════════════════════
b(2619,"Nautica","Voyage EDT","male",2006,3.92,"long","strong",["spring","summer"],["Leaf","Green Apple","Bergamot"],["Aquatic","Lotus","Mimosa"],["Musk","Oakmoss","Cedarwood"],["aquatic","fresh","green","woody"],"The most popular budget aquatic. Apple and lotus. Timeless and accessible."),
b(23442,"Nautica","Blue EDT","male",1992,3.75,"long","moderate",["spring","summer"],["Bergamot","Lemon","Mint"],["Geranium","Cyclamen","Aquatic"],["Amber","Musk","Cedar"],["aquatic","fresh","citrus","woody"],"Original Nautica Blue. Mint and marine. Nautical freshness since 1992."),

// ══════════════════════════════════════════════════════
// ABERCROMBIE & FITCH
// ══════════════════════════════════════════════════════
b(2096,"Abercrombie & Fitch","Fierce Cologne","male",2002,3.88,"long","strong",["spring","summer","fall"],["Ozone","Bergamot","Citrus"],["Musk","Sage","Rosemary"],["Amber","Musk","Sandalwood"],["fresh","aquatic","musk","woody"],"The mall's signature scent. Musk and citrus. Nostalgic 2000s icon."),

// ══════════════════════════════════════════════════════
// AERIN LAUDER
// ══════════════════════════════════════════════════════
b(27508,"Aerin","Rose de Grasse EDP","female",2013,3.95,"long","moderate",["spring","summer"],["Bergamot","Neroli"],["Rose de Grasse","Jasmine","Peony"],["Sandalwood","Musk","Amber"],["floral","rose","white floral","woody"],"Grasse rose luxury. Pure rose and jasmine. Understated beauty."),
b(34488,"Aerin","Amber Musk EDP","female",2014,3.88,"long","moderate",["fall","winter"],["Bergamot","Cassis"],["White Flowers","Musk"],["Sandalwood","Amber","White Musk"],["musk","amber","floral","woody"],"Warm amber and musk. Cassis and sandalwood. Subtle luxury."),

// ══════════════════════════════════════════════════════
// ESTÉE LAUDER
// ══════════════════════════════════════════════════════
b(88,"Estée Lauder","Youth Dew EDP","female",1953,4.05,"very_long","enormous",["fall","winter"],["Aldehydes","Bergamot","Cloves","Spices"],["Rose","Jasmine","Ylang-Ylang","Orris"],["Amber","Musk","Benzyl Benzoate","Labdanum"],["oriental","floral","spicy","amber"],"The original powerhouse. Spiced oriental. 1953 American luxury."),
b(89,"Estée Lauder","Beautiful EDP","female",1985,3.92,"very_long","strong",["spring","fall"],["Aldehydes","Rose","Orange"],["Tuberose","Jasmine","Rose","Lily","Carnation"],["Sandalwood","Musk","Amber","Vetiver","Oakmoss"],["floral","aldehydic","white floral","oriental"],"Beautiful in every sense. Tuberose and rose. The ultimate floral."),
b(2099,"Estée Lauder","Pleasures EDP","female",1995,3.85,"long","moderate",["spring","summer"],["Lily","Peony","Aldehydes"],["White Lily","Rose","White Peony","Jasmine"],["Sandalwood","Musk","Oakmoss","Amber"],["floral","white floral","fresh","woody"],"Simple pleasures. White lily and peony. Clean and joyful."),
b(2101,"Estée Lauder","White Linen EDP","female",1978,4.02,"long","strong",["spring","summer"],["Bergamot","Neroli","Aldehydes","Galbanum"],["Rose","Iris","Jasmine","Lily"],["Sandalwood","Musk","Vetiver","Cedarwood","Amber"],["floral","aldehydic","clean","powdery"],"Freshly laundered. Aldehydic floral. The 1978 clean classic."),
b(39264,"Estée Lauder","Sensuous EDP","female",2008,3.78,"long","moderate",["fall","winter"],["Black Pepper","Bergamot"],["Magnolia","White Flowers","Amber","Sandalwood"],["Musk","Oakwood","Amber"],["floral","woody","sweet","amber"],"Sensuous and warm. Magnolia and amber. Confident femininity."),

// ══════════════════════════════════════════════════════
// ELIZABETH TAYLOR
// ══════════════════════════════════════════════════════
b(93,"Elizabeth Taylor","White Diamonds EDT","female",1991,3.72,"long","moderate",["spring","fall"],["Aldehydes","Neroli","Tuberose","Lily"],["Iris","Rose","Jasmine","Lily of the Valley"],["Sandalwood","Amber","Patchouli","Musk","Oakmoss"],["floral","aldehydic","powdery","oriental"],"Hollywood diamonds. White florals. Celebrity perfume that became a classic."),
b(94,"Elizabeth Taylor","Passion EDP","female",1987,3.65,"long","strong",["fall","winter"],["Aldehydes","Bergamot"],["Rose","Orris","Jasmine"],["Musk","Civet","Amber","Sandalwood"],["floral","oriental","aldehydic","powdery"],"Elizabeth's passion. Rich oriental floral. Old Hollywood glamour."),

// ══════════════════════════════════════════════════════
// CELEBRITY FRAGRANCES
// ══════════════════════════════════════════════════════
b(7008,"Britney Spears","Fantasy EDP","female",2005,3.85,"long","strong",["fall","winter"],["Kiwi","Lychee","Quince","Lotus Flower"],["Jasmine","Orchid","Musk","White Chocolate"],["Musk","Orris","Amber","Sandalwood"],["fruity","sweet","floral","oriental"],"Fantasy come true. Kiwi and white chocolate. The bestselling celebrity scent."),
b(7009,"Britney Spears","Curious EDP","female",2004,3.72,"long","moderate",["spring","fall"],["Peach Nectar","Apple","Lotus Flower"],["Magnolia","Jasmine","Pink Cyclamen"],["Musk","Vanilla","Musk Accord","Sandalwood"],["floral","fruity","sweet","musk"],"Curious sweetness. Peach and jasmine. Young and playful."),
b(17072,"Britney Spears","Midnight Fantasy EDP","female",2006,3.78,"long","moderate",["fall","winter"],["Blackberry","Orchid"],["Black Raspberry","Plum","Orchid"],["Musk","Sandalwood","Vanilla"],["fruity","floral","sweet","musk"],"Midnight dreams. Blackberry and orchid. Dark and sweet."),
b(7010,"Britney Spears","In Control Curious EDP","female",2006,3.65,"moderate","moderate",["spring","summer"],["Green Apple","Pear","Citrus"],["Jasmine","Violet","Lily"],["Musk","Sandalwood"],["fruity","floral","fresh","musk"],"In control. Apple and violet. Fresh girly sweetness."),
b(7011,"Jennifer Lopez","Glow EDT","female",2002,3.72,"moderate","moderate",["spring","summer"],["Grapefruit","Bergamot","Neroli","Lemon"],["Jasmine","White Lily","Rose"],["Musk","Sandalwood","Amber"],["floral","fresh","citrus","musk"],"J.Lo's signature glow. Grapefruit and jasmine. The celebrity perfume pioneer."),
b(7012,"Jennifer Lopez","Live EDP","female",2004,3.68,"long","moderate",["fall","winter"],["Pink Grapefruit","Tangerine","Pink Pepper"],["Jasmine","Rose","Iris"],["Musk","Amber","Sandalwood"],["floral","fruity","citrus","musk"],"Live fully. Grapefruit and iris. J.Lo glamour."),
b(17073,"Jennifer Lopez","Love at First Glow EDT","female",2005,3.62,"moderate","soft",["spring","summer"],["Grapefruit","Bergamot","Mandarin"],["Gardenia","Jasmine"],["White Musk","Sandalwood"],["floral","citrus","fresh","musk"],"First love glow. Grapefruit and gardenia. Sweet and innocent."),
b(7013,"Jennifer Lopez","Still EDP","female",2003,3.75,"long","moderate",["fall","winter"],["Bergamot","Lemon","Cassia"],["Jasmine","Lily","Rose"],["Musk","Sandalwood","Amber"],["floral","citrus","sweet","musk"],"Still beautiful. Lily and jasmine. Warm and timeless."),
b(23443,"Beyoncé","Heat EDP","female",2010,3.78,"long","moderate",["fall","winter"],["Peach","Black Currant","Neroli"],["Magnolia","Honeysuckle","Almond"],["Musk","Amber","Tonka Bean"],["floral","fruity","sweet","oriental"],"Beyoncé's heat. Peach and honeysuckle. Warm and sensual."),
b(34487,"Beyoncé","Wild Orchid EDP","female",2012,3.65,"moderate","moderate",["spring","fall"],["Passion Fruit","Blood Orange","Bergamot"],["Orchid","Jasmine","Lily"],["Musk","Sandalwood","Amber"],["floral","fruity","tropical","sweet"],"Wild orchid. Passion fruit and orchid. Exotic and vibrant."),
b(7014,"Rihanna","Rebelle EDP","female",2012,3.72,"long","moderate",["fall","winter"],["Red Apple","Wild Berries","Gardenia"],["Jasmine","Magnolia","Peach"],["Musk","Vanilla","Sandalwood"],["fruity","floral","sweet","musk"],"Rebellious sweetness. Apple and gardenia. Bold femininity."),
b(7015,"Rihanna","Reb'l Fleur EDP","female",2011,3.65,"moderate","moderate",["spring","fall"],["Red Berries","Plum","Coconut"],["Tuberose","Iris","Hibiscus"],["Musk","Vanilla","Sandalwood"],["floral","fruity","tropical","sweet"],"Rebel flower. Coconut and tuberose. Island luxury."),
b(34486,"Ariana Grande","Cloud EDP","female",2018,4.12,"long","strong",["spring","fall"],["Lavender","Pear","Bergamot"],["Coconut","Praline","Vanilla","Whipped Cream"],["Musk","Cashmere","Blonde Woody Notes"],["sweet","gourmand","creamy","vanilla"],"Sweet cloud luxury. Lavender and vanilla praline. Everyone's obsession."),
b(7016,"Ariana Grande","Ari EDP","female",2015,3.75,"long","moderate",["spring","fall"],["Pink Grapefruit","Pear","Raspberry"],["Lily of the Valley","Rose","Peony","Jasmine"],["Musk","Sandalwood","Vanilla","Cashmere"],["floral","fruity","sweet","musk"],"Sweet and girly. Grapefruit and rose. Ariana's signature."),
b(46431,"Ariana Grande","Moonlight EDP","female",2016,3.72,"long","moderate",["fall","winter"],["Black Currant","Plum","Marshmallow"],["Peony","Jasmine","Lily of the Valley"],["Musk","Amber","Vanilla"],["floral","sweet","fruity","oriental"],"Moonlit dreams. Plum and peony. Sweet night fantasy."),
b(23444,"Katy Perry","Killer Queen EDP","female",2013,3.65,"long","moderate",["fall","winter"],["Bergamot","Dark Plum","Black Currant"],["Tiger Orchid","Peach","Jasmine"],["Musk","Amber","Patchouli"],["floral","fruity","oriental","sweet"],"Killer queen. Dark plum and orchid. Bold and dramatic."),
b(17074,"Katy Perry","Meow EDP","female",2011,3.62,"moderate","moderate",["spring","fall"],["Peach","Green Apple","Bergamot"],["Jasmine","Magnolia","Tangerine"],["Musk","Vanilla","Sandalwood"],["fruity","floral","sweet","musk"],"Playful kitten. Peach and magnolia. Young and fun."),
b(7017,"Paris Hilton","Can Can EDP","female",2010,3.58,"long","moderate",["spring","fall"],["Red Apple","Plum","Apricot"],["Tuberose","Honeysuckle","Jasmine"],["Musk","Sandalwood","Cashmere"],["fruity","floral","sweet","musk"],"Can-can dance. Apple and tuberose. Playful glamour."),
b(7018,"Paris Hilton","Siren EDP","female",2009,3.55,"moderate","moderate",["spring","summer"],["Passionfruit","Mangosteen","Lychee"],["Water Jasmine","Gardenia"],["Musk","Sandalwood","Coconut"],["fruity","floral","tropical","sweet"],"Siren call. Lychee and gardenia. Tropical allure."),
b(34485,"Justin Bieber","Someday EDP","unisex",2011,3.62,"moderate","moderate",["spring","summer"],["Pear","Wild Raspberry","Grapefruit"],["Jasmine","Vanilla Orchid","Star Jasmine"],["Musk","Amber","Sandalwood"],["fruity","floral","sweet","musk"],"Someday dream. Raspberry and jasmine. Sweet teen idol scent."),
b(23445,"Justin Bieber","Girlfriend EDP","female",2012,3.65,"moderate","moderate",["spring","summer"],["Juicy Pear","Candy Apple","Mandarin"],["White Florals","Sweet Pea"],["Musk","Sandalwood"],["fruity","floral","sweet","citrus"],"Girlfriend sweetness. Pear and sweet pea. Young love."),
b(34484,"Taylor Swift","Wonderstruck EDP","female",2011,3.75,"long","moderate",["spring","fall"],["Apple Blossom","Freesia","Honeysuckle"],["Peach","Raspberry","Dewberry","Jasmine"],["Sandalwood","Musk","Vanilla"],["floral","fruity","sweet","musk"],"Wonderstruck magic. Apple blossom and peach. Sweet fairy tale."),

// ══════════════════════════════════════════════════════
// OLD CLASSICS / HERITAGE
// ══════════════════════════════════════════════════════
b(55,"Old Spice","Original After Shave","male",1937,3.55,"moderate","moderate",["fall","winter"],["Orange","Lime","Lemon","Star Anise","Aldehydes"],["Nutmeg","Cinnamon","Carnation","Pimento","Geranium"],["Musk","Ambergris","Benzoin","Vanilla","Tonka Bean","Oakmoss"],["oriental","spicy","fougere","aromatic"],"The original. Spiced oriental since 1937. Grandfather's scent."),
b(56,"Brut","Original EDT","male",1964,3.52,"long","strong",["fall","winter"],["Bergamot","Anise","Lavender"],["Vetiver","Jasmine","Sandalwood"],["Oakmoss","Musk","Amber"],["fougere","aromatic","lavender","woody"],"Working class classic. Lavender and vetiver. Since 1964."),
b(66,"Caron","Pour Un Homme EDT","male",1934,4.28,"very_long","enormous",["fall","winter"],["Lavender","Bergamot"],["Lavender"],["Musk","Vanilla","Sandalwood"],["fougere","lavender","vanilla","sweet"],"The original lavender. Lavender and vanilla. Timeless masculinity since 1934."),
b(67,"Caron","Nuit de Noël EDP","female",1922,4.12,"very_long","strong",["fall","winter"],["Aldehydes","Rose","Jasmine"],["Rose","Jasmine","Orris","Lily"],["Civet","Sandalwood","Musk","Vetiver"],["floral","oriental","earthy","aldehydic"],"Christmas night. Rose and civet. 1922 French luxury."),
b(68,"Caron","Fleurs de Rocaille EDP","female",1933,4.05,"very_long","strong",["spring","fall"],["Aldehydes","Bergamot","Neroli"],["Violet","Rose","Jasmine","Iris"],["Sandalwood","Vetiver","Musk","Civet"],["floral","aldehydic","powdery","earthy"],"Rock flowers. Violet and rose. 1933 vintage elegance."),
b(86,"Molinard","Habanita EDP","female",1921,4.18,"very_long","enormous",["fall","winter"],["Bergamot","Aldehydes","Petitgrain"],["Jasmine","Ylang-Ylang","Rose","Orris","Lily"],["Benzoin","Amber","Musk","Civet","Vetiver","Sandalwood"],["oriental","floral","earthy","amber"],"1921 tobacco flower. Rose and civet. Vintage Riviera decadence."),
b(88,"Dana","Tabu EDP","female",1932,3.82,"very_long","enormous",["fall","winter"],["Bergamot","Orange","Petitgrain","Cloves"],["Rose","Jasmine","Ylang-Ylang","Orris"],["Civet","Musk","Amber","Sandalwood","Benzyl Benzoate"],["oriental","floral","spicy","earthy"],"Notorious 1932. Spiced oriental with civet. Scandalously beautiful."),
b(89,"Coty","Chypre de Coty EDP","female",1917,4.15,"very_long","strong",["fall","winter"],["Bergamot","Lemon"],["Rose","Jasmine","Labdanum"],["Oakmoss","Vetiver","Musk","Civet"],["chypre","floral","earthy","mossy"],"The original chypre. Bergamot and oakmoss. 1917 legendary creation."),

// ══════════════════════════════════════════════════════
// MODERN NICHE (RECENTES)
// ══════════════════════════════════════════════════════
b(62704,"Vilhelm Parfumerie","Basilico & Felice EDP","unisex",2016,4.05,"long","moderate",["spring","summer"],["Basil","Bergamot","Lemon"],["White Flowers","Jasmine","Green Notes"],["Musk","Sandalwood","White Musk"],["green","herbal","floral","citrus"],"Happy basil and flowers. Italian garden in Scandinavia. Radiant."),
b(57499,"Vilhelm Parfumerie","A Pipe Dream EDP","unisex",2018,4.08,"long","moderate",["fall","winter"],["Bergamot","Tobacco"],["Vanilla","Tobacco","Sandalwood"],["Musk","Amber","Cedarwood"],["tobacco","vanilla","sweet","woody"],"The pipe dream. Tobacco and vanilla. Intimate and nostalgic."),
b(62703,"Vilhelm Parfumerie","Dear Polly EDP","female",2015,3.98,"long","moderate",["spring","fall"],["Violet","Bergamot"],["Violet","Peony","Rose"],["Musk","Sandalwood","Amber"],["violet","floral","powdery","woody"],"Love letter in violet. Powdery and elegant. Parisian femininity."),
b(52071,"Zoologist Perfumes","Bee EDP","unisex",2014,4.12,"long","moderate",["spring","summer"],["Bergamot","Lemon"],["Beeswax","Honey","Jasmine","Pollen"],["Sandalwood","Musk","Vanilla"],["honey","floral","sweet","beeswax"],"Into the hive. Honey and pollen. Natural luxury artisan."),
b(52072,"Zoologist Perfumes","Hummingbird EDP","unisex",2019,3.98,"moderate","moderate",["spring","summer"],["Coconut","Bergamot","Lemon"],["Jasmine","Tropical Flowers","Orchid"],["Musk","Sandalwood"],["floral","tropical","coconut","fresh"],"Tropical nectar. Jasmine and coconut. Exotic garden."),
b(34509,"Memo Paris","Irish Leather EDP","unisex",2014,4.18,"long","strong",["fall","winter"],["Bergamot","Sea Breeze"],["Leather","Oud","Cedar"],["Amber","Musk","Vetiver"],["leather","oud","smoky","woody"],"Irish coast leather. Sea and leather. Atmospheric and evocative."),
b(34507,"Memo Paris","Marfa EDP","unisex",2013,4.08,"long","strong",["fall","winter"],["Bergamot","Black Pepper"],["Leather","Incense","Cedar"],["Amber","Musk","Sandalwood"],["leather","incense","spicy","woody"],"Texas desert. Leather and incense. Road trip luxury."),
b(74461,"Commodity","Bergamot","unisex",2015,3.92,"moderate","moderate",["spring","summer"],["Bergamot","Citrus","Green Tea"],["Musk","Vetiver"],["Sandalwood","Amber"],["citrus","fresh","woody","musk"],"Pure bergamot. Tea and musk. Minimal modern luxury."),
b(34510,"Commodity","Gold EDP","unisex",2015,3.88,"long","moderate",["fall","winter"],["Bergamot","Iris"],["Sandalwood","Amber","Musk"],["Musk","Amber","Sandalwood"],["amber","iris","woody","musk"],"Liquid gold. Iris and amber. Understated and refined."),

// ══════════════════════════════════════════════════════
// ADICIONALES DE GRANDES MARCAS
// ══════════════════════════════════════════════════════
b(27524,"Marc Jacobs","Honey EDP","female",2013,3.75,"long","moderate",["spring","summer"],["Pear","Mandarin","Honeysuckle"],["Peach","Orange Blossom","Jasmine"],["Honey","Sandalwood","White Musk","Vanilla"],["floral","fruity","honey","sweet"],"Sweet honey and pear. Honeysuckle and jasmine. Warm and radiant."),
b(46430,"Marc Jacobs","Dot EDP","female",2012,3.78,"moderate","moderate",["spring","summer"],["Strawberry","Red Berries","Dragon Fruit"],["Honeysuckle","Jasmine","Violet"],["Musk","Amber","Driftwood"],["fruity","floral","sweet","musk"],"Polka dot sweetness. Strawberry and jasmine. Young and vibrant."),
b(27525,"Calvin Klein","Beauty EDP","female",2010,3.72,"long","moderate",["spring","fall"],["Neroli"],["Neroli","White Flowers","Jasmine"],["Sandalwood","White Musk","Vetiver"],["white floral","floral","fresh","woody"],"Pure beauty. Neroli and white flowers. Simple elegance."),
b(34488,"Calvin Klein","Reveal EDP","female",2014,3.68,"long","moderate",["fall","winter"],["Karo Karounde","Bergamot"],["Iris","Amaranth","Jasmine"],["White Musk","Sandalwood","Vetiver"],["floral","iris","musk","woody"],"Reveal yourself. Iris and karo karounde. Mysterious femininity."),
b(46429,"Ralph Lauren","Polo Supreme Oud","male",2015,4.12,"very_long","strong",["fall","winter"],["Bergamot","Saffron"],["Oud","Rose","Amber"],["Sandalwood","Musk","Patchouli"],["oud","rose","amber","spicy"],"Supreme oud luxury. Polo meets Arabia. Grand statement."),
b(34487,"Ralph Lauren","Woman EDP","female",2017,3.88,"long","moderate",["spring","fall"],["Bergamot","Green Apple","Quince"],["Peony","Rose","Iris","Jasmine"],["Cashmeran","White Musk","Sandalwood"],["floral","fruity","rose","woody"],"The Ralph Lauren woman. Peony and iris. Modern femininity."),
b(27526,"Lacoste","L.12.12 Jaune EDT","male",2012,3.68,"moderate","soft",["spring","summer"],["Grapefruit","Lemon","Bergamot"],["Thyme","Basil","Black Tea"],["Musk","Sandalwood","Cedarwood"],["citrus","herbal","fresh","woody"],"Sunny yellow. Grapefruit and thyme. Tennis court energy."),
b(34486,"Lacoste","L.12.12 Rose EDT","female",2012,3.65,"moderate","soft",["spring","summer"],["Grapefruit","Lemon","Bergamot"],["Rosewood","Jasmine","White Musk"],["Sandalwood","Musk","Cedarwood"],["floral","citrus","fresh","musk"],"Rose L.12.12. Fresh and feminine. Sport-chic in pink."),
b(27527,"Azzaro","Chrome Legend EDT","male",2006,3.68,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Mint"],["Geranium","Violet"],["Musk","Cedarwood"],["fresh","aromatic","citrus","musk"],"Chrome legend. Bergamot and violet. Sporty classic."),
b(46428,"Azzaro","Chrome Sport EDT","male",2009,3.62,"moderate","soft",["spring","summer"],["Citrus","Bergamot","Cardamom"],["Hedione","Sandalwood"],["Musk","White Musk"],["fresh","citrus","aquatic","musk"],"Chrome in sport. Clean and athletic. Active freshness."),
b(34485,"Davidoff","Zino EDT","male",1986,3.88,"very_long","strong",["fall","winter"],["Bergamot","Lemon","Artemisia"],["Cedar","Jasmine","Coriander","Geranium"],["Musk","Sandalwood","Amber","Vetiver","Oakmoss"],["fougere","earthy","woody","aromatic"],"Davidoff's masterpiece. Cedar and oakmoss. 1986 masculine classic."),
b(34484,"Viktor & Rolf","Bonbon EDP","female",2014,3.88,"long","strong",["fall","winter"],["Caramel","Mandarin","Neroli"],["Peach","Orange Blossom","Caramel"],["Sandalwood","Musk","Vetiver","Tonka Bean"],["caramel","sweet","gourmand","floral"],"Sweet candy luxury. Caramel and peach. Deliciously feminine."),
b(57500,"Viktor & Rolf","Crystal Clear Parfum","female",2021,3.78,"long","moderate",["spring","summer"],["Bergamot","Mandarin"],["Peony","Jasmine","Lily"],["White Musk","Cedarwood","Sandalwood"],["floral","fresh","citrus","musk"],"Crystal clarity. Peony and mandarin. Pure and luminous."),

// ══════════════════════════════════════════════════════
// LATTAFA / ARABIAN ADDITIONS
// ══════════════════════════════════════════════════════
b(72848,"Lattafa","Oud for Glory EDP","unisex",2020,4.25,"very_long","enormous",["fall","winter"],["Saffron","Bergamot","Cardamom"],["Oud","Rose","Amber"],["Sandalwood","Musk","Patchouli"],["oud","spicy","rose","amber"],"Glory in oud. Saffron and rose oud. Maximum Eastern luxury."),
b(75046,"Lattafa","Ameer Al Oudh Intense Oud","unisex",2021,4.18,"very_long","enormous",["fall","winter"],["Bergamot","Saffron"],["Oud","Amber","Rose"],["Sandalwood","Musk","Vanilla"],["oud","amber","spicy","sweet"],"Prince of oud. Rich and opulent. The Lattafa crown jewel."),
b(72849,"Afnan","Supremacy Silver EDP","male",2021,4.05,"very_long","strong",["fall","winter"],["Bergamot","Cardamom"],["Oud","Sandalwood","Cedar"],["Amber","Musk"],["woody","oud","citrus","amber"],"Silver supremacy. Cedar and oud. Fresh and sophisticated."),
b(75047,"Rasasi","Royale Mukhallat EDP","unisex",2017,4.12,"very_long","strong",["fall","winter"],["Bergamot","Saffron","Cardamom"],["Rose","Oud","Jasmine"],["Sandalwood","Amber","Musk"],["oud","floral","spicy","amber"],"Royal blend. Rose and saffron. Arabian royalty in a bottle."),
b(44041,"Swiss Arabian","Shaghaf Oud EDP","unisex",2015,4.08,"very_long","strong",["fall","winter"],["Bergamot","Saffron"],["Oud","Spices"],["Amber","Musk","Sandalwood"],["oud","spicy","amber","woody"],"Passionate oud. Saffron and spices. Deep and captivating."),

// ══════════════════════════════════════════════════════
// MOSCHINO
// ══════════════════════════════════════════════════════
b(706,"Moschino","I Love Love EDT","female",2000,3.65,"moderate","moderate",["spring","summer"],["Lemon","Grapefruit","Orange"],["Jasmine","Lily","Rose"],["Musk","Amber","White Musk"],["citrus","floral","fresh","sweet"],"Love in a perfume bottle. Citrus and jasmine. Fun and accessible."),
b(708,"Moschino","Fresh Couture EDT","female",2016,3.72,"moderate","moderate",["spring","summer"],["Lemon","Bergamot"],["Water Lily","Peony","Jasmine"],["Musk","Sandalwood"],["floral","aquatic","fresh","citrus"],"Couture freshness. Water lily and bergamot. Light and stylish."),
b(709,"Moschino","Gold Fresh Couture EDP","female",2017,3.78,"long","moderate",["spring","fall"],["Bergamot","Lemon"],["Magnolia","Peony","Jasmine"],["Musk","Sandalwood","Amber"],["floral","fresh","citrus","amber"],"Golden couture. Magnolia and amber. Luxe version of Fresh."),

// ══════════════════════════════════════════════════════
// DIESEL
// ══════════════════════════════════════════════════════
b(724,"Diesel","Fuel for Life EDT","male",2007,3.72,"long","moderate",["spring","fall"],["Bergamot","Lavender","Heliotrope"],["Watery Notes","Tolu Balsam"],["Musk","Sandalwood","Amber"],["fresh","aromatic","sweet","woody"],"Fuel your life. Lavender and tolu balsam. Urban cool."),
b(725,"Diesel","Only The Brave EDT","male",2009,3.75,"long","moderate",["spring","fall"],["Lemon","Cardamom","Violet"],["Leather","Rubber","Cedarwood"],["Musk","Amber"],["fresh spicy","leather","woody","citrus"],"Only the brave. Lemon and leather. Iconic fist bottle."),
b(780,"Diesel","Loverdose EDP","female",2011,3.68,"long","moderate",["fall","winter"],["Starflower","Licorice"],["Anise","Jasmine","Tarragon"],["Vanilla","Tonka Bean","White Musk"],["sweet","licorice","floral","oriental"],"Overdose of love. Licorice and vanilla. Unusual and addictive."),
b(735,"Diesel","Diesel (Masculine) EDT","male",1996,3.62,"long","moderate",["fall","winter"],["Bergamot","Coriander","Cardamom"],["Cedar","Geranium","Violet"],["Musk","Amber","Sandalwood"],["aromatic","woody","spicy","musk"],"Diesel original. Coriander and cedar. 90s industrial cool."),

// ══════════════════════════════════════════════════════
// KENNETH COLE
// ══════════════════════════════════════════════════════
b(793,"Kenneth Cole","Mankind EDT","male",2009,3.62,"moderate","moderate",["spring","summer"],["Grapefruit","Bergamot","Mandarin"],["Violet","Cedar","Black Pepper"],["Vetiver","Sandalwood","Musk"],["fresh","citrus","woody","aromatic"],"Modern man. Grapefruit and violet. Accessible NYC masculinity."),
b(792,"Kenneth Cole","Reaction EDT","male",2003,3.58,"moderate","moderate",["spring","summer"],["Grapefruit","Bergamot","Mandarin","Thyme"],["Sage","Violet","Pepper","Geranium"],["Musk","Amber","Sandalwood","Vetiver"],["fresh","aromatic","citrus","woody"],"Chain reaction. Thyme and sage. Dynamic masculinity."),

// ══════════════════════════════════════════════════════
// VERA WANG
// ══════════════════════════════════════════════════════
b(800,"Vera Wang","Princess EDP","female",2006,3.72,"moderate","moderate",["spring","summer"],["Waterlily","Guava","Apricot","Mandarin"],["Tiare Flower","Jasmine","Princess Orchid"],["Wood","Amber","Musk"],["fruity","floral","sweet","musk"],"Princess sweetness. Guava and tiare. Youthful and feminine."),
b(799,"Vera Wang","Flower Princess EDT","female",2009,3.62,"moderate","soft",["spring","summer"],["Peach","Mandarin","Pear"],["Rose","Jasmine","Water Lily"],["Musk","Sandalwood"],["fruity","floral","fresh","musk"],"Flower princess. Peach and rose. Light and innocent."),
b(798,"Vera Wang","Lovestruck EDP","female",2011,3.65,"long","moderate",["spring","fall"],["Lychee","Starfruit","Mandarin"],["White Peach","Damask Rose","Nectarine"],["Sandalwood","Musk","Amber"],["fruity","floral","sweet","rose"],"Lovestruck. Lychee and rose. Romantic and fresh."),

// ══════════════════════════════════════════════════════
// JOHN VARVATOS
// ══════════════════════════════════════════════════════
b(797,"John Varvatos","Artisan EDT","male",2009,3.82,"long","moderate",["spring","summer"],["Bergamot","Tangerine","Grapefruit","Cardamom"],["Sea Coral","Jasmine","Water Hyacinth"],["White Musk","Guaiac Wood","Teak Wood"],["fresh","citrus","marine","woody"],"Artisan freshness. Coral and cardamom. Mediterranean artcraft."),
b(796,"John Varvatos","Vintage EDT","male",2006,3.88,"long","strong",["fall","winter"],["Suede","Bergamot","Cardamom"],["Black Plum","Tobacco","Saffron"],["Amber","Musk","Vetiver","Guaiac Wood"],["leather","tobacco","spicy","sweet"],"Vintage luxury. Suede and tobacco. Rock star elegance."),

// ══════════════════════════════════════════════════════
// CELINE (Hedi Slimane era)
// ══════════════════════════════════════════════════════
b(74462,"Celine","Reptile EDP","unisex",2019,4.22,"long","strong",["fall","winter"],["Bergamot","Pepper"],["Leather","Oud","Cedar"],["Sandalwood","Amber","Musk"],["leather","oud","spicy","woody"],"Reptilian luxury. Leather and oud. Hedi Slimane's dark vision."),
b(74463,"Celine","Black Tie EDP","unisex",2020,4.28,"long","strong",["fall","winter"],["Bergamot","Iris","Petitgrain"],["Iris","Vetiver","Patchouli"],["Musk","Cedarwood","Sandalwood"],["iris","woody","aromatic","musk"],"Black tie elegance. Iris and vetiver. Formal luxury."),
b(74464,"Celine","Dans Paris EDP","unisex",2019,4.12,"long","moderate",["spring","fall"],["Bergamot","Citrus"],["Heliotrope","Iris","Violet"],["Musk","Sandalwood","Cedarwood"],["floral","iris","powdery","woody"],"In Paris. Heliotrope and iris. Quintessential Parisian chic."),

// ══════════════════════════════════════════════════════
// VALENTINO additional
// ══════════════════════════════════════════════════════
b(62727,"Valentino","Uomo Intense EDP","male",2015,3.95,"long","strong",["fall","winter"],["Bergamot","Lemon","Sage"],["Iris","Leather","Myrrh"],["Musk","Vetiver","Amber"],["leather","iris","warm spicy","woody"],"Intense couture. Myrrh and iris. The darkest Valentino man."),
b(52073,"Valentino","Donna Born In Roma Intense EDP","female",2020,3.92,"long","strong",["fall","winter"],["Bergamot","Plum"],["Jasmine","Rock Rose"],["Vetiver","Musk","Sandalwood","Amber"],["floral","fruity","amber","woody"],"Roma intense. Plum and jasmine. Concentrated Roman luxury."),

// ══════════════════════════════════════════════════════
// PACO RABANNE additional
// ══════════════════════════════════════════════════════
b(39052,"Paco Rabanne","Invictus Victory EDP","male",2021,4.08,"very_long","enormous",["fall","winter"],["Bergamot","Cardamom"],["Guaiac Wood","Pepper","Cinnamon"],["Amber","Ambroxan","Musk"],["warm spicy","woody","amber","spicy"],"Victory invictus. Cardamom and guaiac wood. The champion's EDP."),
b(72850,"Paco Rabanne","Olympéa Aqua EDT","female",2021,3.78,"moderate","moderate",["spring","summer"],["Citrus","Grapefruit","Blackcurrant"],["Jasmine Sambac","Sea Notes"],["Cashmere Wood","Sandalwood","Musk"],["aquatic","floral","citrus","woody"],"Aquatic goddess. Sea and jasmine. Summer Olympia."),

// ══════════════════════════════════════════════════════
// YSL additional
// ══════════════════════════════════════════════════════
b(66517,"Yves Saint Laurent","Y Eau de Cologne","male",2019,3.78,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Basil"],["Ginger","Cardamom"],["Cedarwood","Ambergris","Musk"],["fresh","citrus","aromatic","spicy"],"The Y cologne. Crisp and light. Hot weather companion."),
b(74465,"Yves Saint Laurent","MYSLF EDP","male",2023,4.15,"long","strong",["spring","fall"],["Yuzu","Bergamot","Cardamom"],["Lavender","Amber","Orange Blossom"],["Cashmeran","Cedarwood","Musk"],["aromatic","fresh","citrus","amber"],"Be myself. Yuzu and lavender. The modern YSL man."),

];

// ─── Merge ────────────────────────────────────────────────────────────────────
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
