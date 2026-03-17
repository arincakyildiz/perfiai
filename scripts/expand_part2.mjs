/**
 * Perfiai - Part 2 Expansion (~600 yeni parfüm)
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "../data/perfumes.json");

const ACCORD_TR = {"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","musky":"misk","musk":"misk","woody":"odunsu","lavender":"lavanta","herbal":"bitkisel","floral":"çiçeksi","white floral":"beyaz çiçek","sweet":"tatlı","powdery":"pudralı","fruity":"meyveli","rose":"gül","jasmine":"yasemin","iris":"iris","tuberose":"sümbülteber","aquatic":"deniz","marine":"deniz","green":"yeşil/taze","vanilla":"vanilya","gourmand":"gurme","oud":"oud","oriental":"oryantal","earthy":"toprak","smoky":"dumanlı","leather":"deri","creamy":"kremsi","sandalwood":"sandal ağacı","patchouli":"paçuli","animalic":"hayvani","balsamic":"balsam","incense":"tütsü","tobacco":"tütün","honey":"bal","caramel":"karamel","coconut":"hindistancevizi","almond":"badem","cinnamon":"tarçın","pepper":"biber","bergamot":"bergamot","cedar":"sedir","vetiver":"vetiver","cashmeran":"keşmir","soapy":"sabunsu","mossy":"yosunlu","chypre":"chypre","fougere":"fougère","cherry":"kiraz","fig":"incir","nut":"fındık","resinous":"reçineli"};
const GENDER_TR = { male:"erkeklere özel", female:"kadınlara özel", unisex:"uniseks" };
const SEASON_TR = { spring:"ilkbahar", summer:"yaz", fall:"sonbahar", winter:"kış" };
const LON_TR = { short:"kısa süreli kalıcılık", moderate:"orta düzey kalıcılık", long:"uzun süre kalıcılık", very_long:"çok uzun süre kalıcılık" };
const SIL_TR = { soft:"hafif iz", moderate:"orta güçte iz", strong:"güçlü iz", enormous:"çok güçlü iz" };

function genTR(p) {
  const accords = (p.accords||[]).slice(0,3).map(a=>ACCORD_TR[a.toLowerCase()]||a);
  const gender = GENDER_TR[p.gender]||"herkes için";
  const seasons = p.season||[];
  const lon = LON_TR[p.longevity];
  const sil = SIL_TR[p.sillage];
  const parts = [];
  if (accords.length) parts.push(`${accords.join(", ")} notalarıyla öne çıkan, ${gender} bir parfüm.`);
  else parts.push(`${gender.charAt(0).toUpperCase()+gender.slice(1)} için özel bir koku.`);
  if (seasons.length===4) parts.push("Dört mevsim kullanılabilir.");
  else if (seasons.length) parts.push(`${seasons.map(s=>SEASON_TR[s]||s).join(" ve ")} ayları için ideal.`);
  if (lon&&sil) parts.push(`${lon.charAt(0).toUpperCase()+lon.slice(1)}, ${sil} bırakır.`);
  return parts.join(" ");
}

function b(fid, brand, name, gender, year, rating, lon, sil, seasons, top, mid, base, accords, desc) {
  const p = { brand, name, notes:{top, middle:mid, base}, accords, longevity:lon, sillage:sil, season:seasons, gender, rating, short_description:desc, year, image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${fid}.jpg` };
  p.short_description_tr = genTR(p);
  return p;
}

const NEW = [

  // ═══ DIOR – ek seriler ═══
  b(205,"Dior","Poison EDP","female",1985,3.88,"very_long","enormous",["fall","winter"],["Aldehydes","Bergamot","Orange"],["Tuberose","Plum","Coriander","Rose"],["Musk","Sandalwood","Vetiver","Civet","Oakmoss"],["floral","oriental","tuberose","sweet"],"The original poison. Tuberose and oakmoss. Provocative and legendary."),
  b(204,"Dior","Hypnotic Poison EDP","female",2014,4.05,"long","strong",["fall","winter"],["Coconut","Apricot","Plum","Almond"],["Jasmine","Sandalwood"],["Musk","Vanilla","Sandalwood"],["sweet","almond","oriental","vanilla"],"Addictive almond vanilla. Coconut and plum. A hypnotic seduction."),
  b(11954,"Dior","Midnight Poison EDP","female",2006,3.85,"long","strong",["fall","winter"],["Bergamot","Mandarin"],["Rose","Patchouli"],["Amber","Vanilla","Musk"],["floral","oriental","sweet","amber"],"Dark and mysterious rose. Patchouli and amber. Night-time sorcery."),
  b(11951,"Dior","Pure Poison EDP","female",2004,3.78,"long","strong",["spring","fall"],["Neroli","Bergamot"],["White Musk","Jasmine Sambac","Gardenia","Orange Blossom"],["Musk","Patchouli","Sandalwood"],["white floral","musky","sweet","floral"],"Innocent white flowers turned dangerous. Jasmine and patchouli. Seductive purity."),
  b(3407,"Dior","Dune EDT","female",1991,3.95,"long","moderate",["spring","summer"],["Aldehydes","Bergamot","Rosewood"],["Peony","Cyclamen","Wallflower","Lily"],["Amber","Sandalwood","Civet","Oakmoss","Vetiver"],["floral","aldehydic","amber","woody"],"Windswept dunes. Classic 90s feminine elegance. Timeless and sophisticated."),
  b(11948,"Dior","Miss Dior Chérie","female",2005,3.82,"long","moderate",["spring","summer"],["Strawberry","Watermelon","Green Accord"],["Caramelized Popcorn","Magnolia","Jasmine"],["Patchouli","White Musk"],["floral","fruity","sweet","patchouli"],"Youthful and playful. Strawberry and patchouli. A modern Dior love story."),
  b(72839,"Dior","Sauvage Very Cool Spray","male",2017,3.95,"moderate","strong",["spring","summer"],["Bergamot","Mint","Pepper"],["Lavender"],["Ambroxan","Cedarwood"],["fresh","citrus","aromatic","fresh spicy"],"Coolest Sauvage variant. Mint and bergamot. Hot weather hero."),
  b(38543,"Dior","Fahrenheit Parfum","male",2022,4.15,"very_long","strong",["fall","winter"],["Black Pepper","Bergamot"],["Violet","Nutmeg"],["Vetiver","Amber","Leather"],["leather","woody","spicy","amber"],"Modern reinterpretation of Fahrenheit. Spicier and darker. For bold men."),

  // ═══ CHANEL – ek seriler ═══
  b(213,"Chanel","No.19 EDP","female",1971,4.18,"long","strong",["spring","fall"],["Bergamot","Neroli","Galbanum"],["Iris","Rose","Lily of the Valley","Jasmine"],["Vetiver","Musk","Sandalwood","Oakmoss"],["floral","green","iris","chypre"],"Mademoiselle Chanel's own scent. Galbanum and iris. Austere and magnificent."),
  b(201,"Chanel","Coco EDP","female",1984,4.12,"very_long","strong",["fall","winter"],["Aldehydes","Coriander","Bergamot","Mandarin"],["Jasmine","Mimosa","Cloves","Rose","Lily of the Valley"],["Opoponax","Civet","Amber","Sandalwood","Benzyl Benzoate"],["oriental","floral","spicy","amber"],"The original Coco. Rich oriental with florals. Warmer and more complex than Mademoiselle."),
  b(214,"Chanel","Cristalle EDT","female",1974,4.08,"moderate","moderate",["spring","summer"],["Aldehydes","Bergamot","Lemon"],["Jasmine","Ylang-Ylang","Lily of the Valley","Neroli","Rose"],["Vetiver","Oakmoss","Amber"],["floral","chypre","green","citrus"],"Crisp and luminous chypre. The most classic Chanel. Timeless refinement."),
  b(215,"Chanel","Égoïste EDT","male",1990,4.22,"long","strong",["fall","winter"],["Neroli","Coriander","Orange","Lemon"],["Sandalwood","Rose","Carnation","Cinnamon","Rosewood"],["Amber","Musk","Vetiver","Oakmoss"],["woody","spicy","oriental","aromatic"],"Noble sandalwood masculine. Coriander and carnation. A forgotten masterpiece."),
  b(9099,"Chanel","Bleu de Chanel EDP","male",2014,4.32,"long","strong",["spring","fall","winter"],["Grapefruit","Bergamot","Lemon"],["Labdanum","Jasmine","Dry Cedar"],["Incense","Vetiver","Sandalwood","White Musk","Amber"],["citrus","aromatic","woody","amber"],"The most popular Bleu formulation. Incense and vetiver over citrus. Iconic."),
  b(3401,"Chanel","Chance Eau Vive EDT","female",2015,3.68,"moderate","soft",["spring","summer"],["Grapefruit","Blood Orange"],["Jasmine","Water Hyacinth","Iris"],["White Musk"],["citrus","floral","fresh","iris"],"The most vivacious Chance. Sparkling grapefruit and iris. Carefree and bright."),
  b(46441,"Chanel","Les Exclusifs: 31 Rue Cambon","female",2007,4.28,"long","moderate",["spring","fall"],["Aldehydes","Bergamot"],["Iris","Labdanum","Ylang-Ylang"],["Sandalwood","Musk","Vetiver"],["iris","chypre","floral","powdery"],"The Chanel boutique in a bottle. Iris and labdanum. Quiet luxury."),
  b(46439,"Chanel","Les Exclusifs: Coromandel EDP","unisex",2007,4.35,"long","strong",["fall","winter"],["Bergamot","Orange","Lemon"],["Patchouli","Orris","Benzyl Benzoate"],["Labdanum","White Musk","Amber","Vanilla","Sandalwood"],["oriental","patchouli","sweet","amber"],"Inspired by Coco Chanel's lacquered screens. Patchouli and sandalwood. Opulent."),
  b(46438,"Chanel","Les Exclusifs: Beige EDP","female",2008,4.12,"long","moderate",["spring","summer"],["Freesia","Aldehydes"],["Freesia","Ylang-Ylang","Tonka Bean"],["White Musk","Sandalwood"],["floral","white floral","powdery","sweet"],"Softest Chanel exclusive. Freesia and tonka. Luminous beige poetry."),

  // ═══ YSL – ek seriler ═══
  b(81,"Yves Saint Laurent","Opium EDP","female",1977,4.08,"very_long","enormous",["fall","winter"],["Aldehydes","Bergamot","Mandarin","Plum","Pepper","Cloves"],["Jasmine","Rose","Orchid","Coriander","Lily of the Valley"],["Vetiver","Sandalwood","Cedarwood","Opoponax","Tolu Balsam","Oakmoss"],["oriental","floral","spicy","amber"],"The most controversial oriental. Opulent spices and flowers. A perfume monument."),
  b(82,"Yves Saint Laurent","Paris EDP","female",1983,4.05,"long","strong",["spring","summer"],["Violet","Bergamot"],["Rose","Mimosa","Violet","Peony","Marigold"],["Musk","Sandalwood","Iris","Cedarwood"],["floral","rose","powdery","violet"],"Paris captured in a rose. Violet and rose. Romantic Parisian ideal."),
  b(5522,"Yves Saint Laurent","L'Homme EDT","male",2006,3.85,"long","moderate",["spring","fall"],["Ginger","Bergamot","Lemon"],["Basil","Violet","Ginger"],["White Musk","Cedarwood","Tonka Bean"],["fresh spicy","aromatic","citrus","woody"],"Modern French masculinity. Basil and violet. Understated elegance."),
  b(17134,"Yves Saint Laurent","Manifesto EDP","female",2012,3.75,"long","moderate",["spring","fall"],["Bergamot","Raspberry","Mandarin"],["Rose","Lily","Iris","Jasmine"],["Vetiver","Musk","Amber"],["floral","fruity","rose","fresh"],"Bold femininity. Rose and raspberry. Empowering signature scent."),

  // ═══ GUERLAIN – ek seriler ═══
  b(15,"Guerlain","Shalimar Parfum Initial","female",2011,3.92,"long","strong",["fall","winter"],["Bergamot","Mandarin"],["Iris","Jasmine","Rose"],["Vanilla","Amber","Musk"],["oriental","floral","vanilla","amber"],"Lighter interpretation of Shalimar. Rose and vanilla. Modern luxury."),
  b(2753,"Guerlain","Insolence EDP","female",2008,3.88,"long","strong",["fall","winter"],["Bergamot","Violet","Raspberry"],["Violet","Iris","Rose"],["Sandalwood","Musk","Vetiver"],["floral","violet","sweet","fruity"],"Insolently violet. Berry and iris. Playfully provocative."),
  b(2756,"Guerlain","Champs-Élysées EDP","female",1996,3.78,"long","moderate",["spring","summer"],["Mimosa","Black Currant","Bergamot","Lemon","Anise"],["Mimosa","Peony","Rose","Almond Tree","Magnolia"],["Sandalwood","Vanilla","Tonka Bean","White Musk"],["floral","sweet","powdery","almond"],"Strolling the most beautiful avenue. Mimosa and almond. French poetic joy."),
  b(1419,"Guerlain","Idylle EDP","female",2009,3.82,"long","moderate",["spring","summer"],["Peach","Lychee","Rose"],["Lily of the Valley","Rose","Jasmine"],["Musk","Sandalwood","White Cedar"],["floral","fruity","rose","fresh"],"Ethereal and romantic. Rose and peach. First love captured."),
  b(3410,"Guerlain","Aqua Allegoria Bergamote Calabria EDT","unisex",2019,3.75,"short","soft",["spring","summer"],["Calabrian Bergamot","Lemon","Orange"],["White Musk"],["White Musk"],["citrus","fresh","aromatic","musk"],"Purest bergamot expression. Sunny and luminous. Simple and beautiful."),
  b(47,"Guerlain","Mitsouko EDP","female",1919,4.35,"very_long","strong",["fall","winter"],["Aldehydes","Bergamot","Lemon"],["Peach","Jasmine","Rose","Ylang-Ylang","Lily of the Valley"],["Vetiver","Oakmoss","Benzyl Benzoate","Labdanum","Sandalwood"],["chypre","floral","peach","earthy"],"One of the greatest perfumes ever made. Peach chypre. A century of genius."),

  // ═══ LANCÔME – ek seriler ═══
  b(3414,"Lancôme","Hypnôse EDP","female",2005,3.88,"long","strong",["fall","winter"],["Bergamot","Citrus"],["Jasmine","Lily","Rose","Amber"],["Vanilla","Patchouli","Vetiver"],["floral","oriental","sweet","amber"],"Hypnotically romantic. Jasmine and vanilla. Opulent feminine seduction."),
  b(2103,"Lancôme","Miracle EDP","female",2000,3.75,"long","moderate",["spring","summer"],["Lychee","Ginger","Freesia"],["Jasmine","Magnolia","Lily of the Valley"],["Musk","Sandalwood","Pepper"],["floral","fruity","fresh","spicy"],"A miracle of optimism. Lychee and jasmine. Radiant and joyful."),
  b(87,"Lancôme","Magie Noire EDT","female",1978,3.98,"very_long","enormous",["fall","winter"],["Hyacinth","Bergamot","Aldehydes"],["Rose","Jasmine","Ylang-Ylang","Lily","Orris"],["Civet","Amber","Vetiver","Benzyl Benzoate","Musk"],["floral","oriental","earthy","amber"],"Dark magic. Rich oriental floral. One of the great classic feminines."),
  b(74454,"Lancôme","Idôle Le Parfum","female",2021,4.0,"long","strong",["fall","winter"],["Bergamot","Rose Centifolia"],["Rose","Woody Accord"],["Cedarwood","White Musk","Sandalwood"],["floral","rose","woody","amber"],"Concentrated Idôle. Deeper rose with cedar. Confident and strong."),
  b(66514,"Lancôme","La Vie est Belle en Rose EDT","female",2021,3.72,"moderate","moderate",["spring","summer"],["Strawberry","Peach"],["Rose","Peony","Jasmine"],["White Musk"],["floral","fruity","fresh","rose"],"Rosé version of La Vie. Lighter and more playful. Summer feminity."),

  // ═══ GIVENCHY – ek seriler ═══
  b(92,"Givenchy","Amarige EDT","female",1991,3.85,"very_long","enormous",["spring","summer"],["Violet","Neroli","Bergamot","Mandarin"],["Ylang-Ylang","Rose","Jasmine","Mimosa","Carnation"],["Vetiver","Sandalwood","Civet","Musk"],["floral","white floral","sweet","animalic"],"Exuberant white floral. Mimosa and ylang-ylang. Joyful excess."),
  b(91,"Givenchy","Ysatis EDT","female",1984,3.95,"very_long","enormous",["fall","winter"],["Aldehydes","Bergamot","Jasmine","Ylang-Ylang"],["Rose","Carnation","Orris","Jasmine"],["Civet","Amber","Musk","Sandalwood","Vetiver"],["floral","oriental","earthy","amber"],"Dramatic oriental floral. Carnation and civet. Unforgettable and bold."),
  b(27519,"Givenchy","Gentlemen Only EDT","male",2013,3.75,"long","moderate",["spring","fall"],["Bergamot","Mandarin"],["Lavandin","Iris","Patchouli","Cardamom"],["Cedarwood","Vetiver","White Musk"],["aromatic","iris","woody","fresh"],"Accessible Gentleman. Fresh and modern masculine. Easy elegance."),
  b(5526,"Givenchy","Ange ou Démon Le Secret EDT","female",2009,3.82,"long","moderate",["spring","fall"],["Bergamot","Orange","Lily"],["White Peach","Rose","Jasmine"],["White Musk","Amber","Sandalwood"],["floral","fruity","sweet","white floral"],"Lighter Ange ou Démon. Peach and rose. Day-time luminosity."),
  b(62716,"Givenchy","Live Irrésistible Blossom Crush EDT","female",2018,3.68,"moderate","soft",["spring","summer"],["Grapefruit","Raspberry","Peach"],["Peony","Rose","Jasmine"],["Musk","Sandalwood"],["floral","fruity","fresh","sweet"],"Fresh and playful. Peach blossom and peony. Light and carefree."),

  // ═══ HERMÈS – ek seriler ═══
  b(83,"Hermès","24 Faubourg EDP","female",1995,4.12,"long","strong",["spring","fall"],["Bergamot","Orange Blossom","Hyacinth","Aldehydes"],["Jasmine","Ylang-Ylang","Iris","Peach"],["Amber","Sandalwood","White Musk","Benzyl Benzoate"],["floral","white floral","powdery","amber"],"The address of luxury. Orange blossom and jasmine. Hermès femininity at its finest."),
  b(8601,"Hermès","Voyage d'Hermès EDT","male",2010,4.0,"long","moderate",["spring","summer","fall"],["Pepper","Bergamot","Cardamom"],["Boronia","Vetiver","Incense"],["Patchouli","Amber","Musk","White Musk"],["woody","aromatic","fresh spicy","citrus"],"The ultimate travel companion. Pepper and vetiver. Sophisticated wanderlust."),
  b(2605,"Hermès","Un Jardin sur le Nil EDT","unisex",2005,4.05,"moderate","moderate",["spring","summer"],["Grapefruit","Green Mango"],["Lotus","Calamus","Bulrush"],["Incense","Sycamore","Iris Pallida","White Musk"],["green","aquatic","fresh","woody"],"Nile garden. Green mango and lotus. Serene and exotic."),
  b(2604,"Hermès","Un Jardin en Méditerranée EDT","unisex",2003,3.92,"moderate","moderate",["spring","summer"],["Lemon","Grapefruit","Cypress"],["Fig","Iris","Cypress"],["Sandalwood","White Cedar","Amber"],["green","citrus","fresh","fig"],"Mediterranean garden. Fig and cypress. Summery and contemplative."),
  b(13009,"Hermès","Un Jardin sur la Mousson EDT","unisex",2008,3.88,"moderate","soft",["spring","summer"],["Green Mango","Coriander","Ginger"],["Spices","Vegetable Notes","Carrot"],["White Musk","Sandalwood"],["green","fresh","spicy","earthy"],"Monsoon season. Wet earth and green mango. Unique and evocative."),
  b(6010,"Hermès","Kelly Calèche EDT","female",2007,4.02,"long","moderate",["spring","fall"],["Iris","Bergamot","Grapefruit"],["Iris","Rose","Jasmine","Orris"],["Leather","Vetiver","Sandalwood","White Musk"],["iris","leather","floral","woody"],"The Kelly bag in perfume form. Iris and leather. Understated Hermès luxury."),
  b(15,"Hermès","Equipage EDT","male",1970,4.25,"very_long","strong",["fall","winter"],["Aldehydes","Bergamot","Galbanum"],["Vetiver","Patchouli","Rose","Jasmine","Carnation"],["Oakmoss","Civet","Sandalwood","Musk","Amber"],["fougere","earthy","aromatic","woody"],"Classic equestrian masculine. Galbanum and vetiver. Heritage and tradition."),

  // ═══ JO MALONE – ek seriler ═══
  b(1520,"Jo Malone London","Pomegranate Noir Cologne","unisex",2003,4.1,"moderate","moderate",["fall","winter"],["Pomegranate","Raspberry","Pink Pepper"],["Orchid","Spicy Notes","Lily"],["Frankincense","Patchouli","Birch","Guaiac Wood"],["fruity","woody","spicy","resinous"],"Dark and mysterious. Pomegranate and frankincense. Autumn luxury."),
  b(1518,"Jo Malone London","Red Roses Cologne","female",2000,3.88,"moderate","soft",["spring","summer"],["Lemon","Violet","Bay Leaves"],["Red Rose"],["Sandalwood","Musk"],["rose","floral","fresh","citrus"],"Quintessential English rose. Fresh dew-covered rose. Simply beautiful."),
  b(1522,"Jo Malone London","Orange Blossom Cologne","unisex",2000,3.95,"moderate","soft",["spring","summer"],["Clementine","Lemon","Orange"],["Orange Blossom","White Lilac","Lily of the Valley"],["Musk","Woody Notes"],["floral","citrus","fresh","white floral"],"Pure orange blossom joy. Sunny and radiant. Perfect simplicity."),
  b(1521,"Jo Malone London","Nectarine Blossom & Honey Cologne","unisex",2003,4.02,"moderate","moderate",["spring","summer"],["Nectarine","Black Currant"],["Peach Blossom","Osmanthus"],["Acacia","Honey","Vetiver"],["fruity","floral","honey","sweet"],"Golden orchard honey. Nectarine and honey. Warm and radiant."),
  b(34513,"Jo Malone London","Myrrh & Tonka Cologne Intense","unisex",2016,4.28,"long","strong",["fall","winter"],["Lavender","Almond"],["Tonka Bean","Musk"],["Myrrh","Vanilla","Sandalwood"],["oriental","sweet","balsamic","warm spicy"],"Cozy and enveloping. Tonka and myrrh. The cosiest Jo Malone."),
  b(9049,"Jo Malone London","Mimosa & Cardamom Cologne","unisex",2014,3.92,"moderate","moderate",["spring","fall"],["Cardamom","Bergamot"],["Mimosa","Jasmine"],["Sandalwood","Amber"],["floral","spicy","warm spicy","woody"],"Spring spice. Mimosa and cardamom. Unexpected and charming."),
  b(51481,"Jo Malone London","Velvet Rose & Oud Cologne Intense","unisex",2012,4.15,"long","strong",["fall","winter"],["Aldehyde","Cloves"],["Turkish Rose","Oud"],["Sandalwood","Patchouli","Vetiver"],["rose","oud","woody","spicy"],"Jo Malone's most intense. Turkish rose and oud. Rich luxury."),

  // ═══ LE LABO ═══
  b(34515,"Le Labo","Santal 33 EDP","unisex",2011,4.38,"long","strong",["fall","winter","spring"],["Violet","Cardamom","Iris"],["Sandalwood","Papyrus","Cedarwood"],["Leather","Musk","Ambergris"],["woody","leather","iris","smoky"],"The cult unisex. Sandalwood and leather with smoke. Everyone in Brooklyn wears it."),
  b(34523,"Le Labo","Rose 31 EDP","unisex",2006,4.25,"long","strong",["spring","fall"],["Rose","Oud","Cumin"],["Cedar","Gaiac Wood","Vetiver"],["Amber","Musk"],["rose","woody","spicy","oud"],"Rose for people who hate roses. Cumin and cedar. Unisex rose done right."),
  b(34514,"Le Labo","Bergamote 22 EDP","unisex",2006,4.05,"moderate","moderate",["spring","summer"],["Bergamot","Neroli","Grapefruit"],["Amber","Musk","Vetiver"],["Amber","Musk","Vetiver"],["citrus","fresh","amber","woody"],"Citrus elevated to art. Bergamot and amber. Urban sophistication."),
  b(34518,"Le Labo","Another 13 EDP","unisex",2010,4.32,"long","strong",["spring","fall"],["Ambrox","Jasmine","Moss"],["Ambrox","Musk","Vetiver"],["Musk","Ambrox","Vetiver"],["musky","floral","amber","woody"],"The sexy skin scent. Ambrox and jasmine. Modern sensuality."),
  b(34516,"Le Labo","Thé Noir 29 EDP","unisex",2006,4.08,"long","moderate",["fall","winter"],["Fig","Tea","Bergamot"],["Vetiver","Smoked Tea","Cedar"],["Musk","Amber"],["smoky","green","woody","earthy"],"Smoky tea and fig. Meditative and contemplative. Intellectual luxury."),
  b(62713,"Le Labo","Mousse de Chêne 30 EDP","unisex",2020,4.22,"long","moderate",["fall","winter"],["Oakmoss","Vetiver"],["Iris","Ambrox"],["Sandalwood","Musk"],["mossy","woody","iris","earthy"],"Forest floor luxury. Oakmoss and iris. Quiet and contemplative."),

  // ═══ SERGE LUTENS ═══
  b(1395,"Serge Lutens","Ambre Sultan EDP","unisex",2000,4.28,"very_long","strong",["fall","winter"],["Coriander","Oregano","Myrtle","Bay"],["Benzoin","Amber","Patchouli"],["Vanilla","Sandalwood","Musk"],["amber","balsamic","oriental","sweet"],"The amber masterpiece. Resins and spices. Complex and meditative."),
  b(1398,"Serge Lutens","Chergui EDP","unisex",2001,4.35,"very_long","enormous",["fall","winter"],["Hay","Honey","Iris"],["Musk","Amber","Tobacco"],["Oud","Sandalwood","Vanilla"],["tobacco","honey","oriental","sweet"],"Hot Moroccan wind. Hay and tobacco with honey. Unforgettable."),
  b(1399,"Serge Lutens","Féminité du Bois EDP","female",1992,4.15,"long","strong",["fall","winter"],["Plum","Peach","Orange","Bergamot"],["Cedar","Cardamom","Cinnamon","Cloves","Rose"],["Musk","Sandalwood","Amber","Vanilla","Benzyl Benzoate"],["woody","fruity","spicy","cedar"],"Femininity of wood. Cedar and plum. Revolutionary and timeless."),
  b(1401,"Serge Lutens","Un Bois Vanille EDP","female",2003,4.08,"very_long","enormous",["fall","winter"],["Coconut","Vanilla","Sandalwood"],["Benzoin"],["Musk","Vanilla"],["vanilla","sweet","creamy","coconut"],"Ultimate vanilla luxury. Coconut and benzoin. Irresistibly gourmand."),
  b(34506,"Serge Lutens","La Fille de Berlin EDP","female",2013,4.18,"long","strong",["spring","fall"],["Black Currant"],["Rose","Pepper"],["Patchouli","Ambrette"],["rose","spicy","fruity","woody"],"Berlin rose with attitude. Black currant and pepper. Edgy elegance."),
  b(1402,"Serge Lutens","Fleurs d'Oranger EDP","female",2003,4.0,"long","moderate",["spring","summer"],["Bergamot","Neroli"],["Orange Blossom","Jasmine","Cumin"],["White Musk","Sandalwood"],["white floral","floral","spicy","citrus"],"Orange blossoms in heat. Cumin adds unexpected spice. Sensual and beautiful."),

  // ═══ L'ARTISAN PARFUMEUR ═══
  b(1428,"L'Artisan Parfumeur","Premier Figuier EDP","unisex",1994,4.12,"moderate","moderate",["spring","summer"],["Fig","Green Notes","Sap"],["Fig","Coconut","Milk"],["Sandalwood","Musk","Vanilla"],["fig","green","creamy","fresh"],"The first great fig perfume. Green and milky. Contemplative luxury."),
  b(1429,"L'Artisan Parfumeur","Mûre et Musc EDT","female",1978,4.02,"moderate","moderate",["spring","summer"],["Bergamot","Lemon"],["Blackberry","Raspberry"],["Musk","White Musk","Sandalwood"],["fruity","musk","fresh","sweet"],"Blackberry and musk poetry. Classic and accessible. Beloved since 1978."),
  b(1430,"L'Artisan Parfumeur","Passage d'Enfer EDP","unisex",1999,4.15,"long","moderate",["fall","winter"],["Lily","Incense"],["Lily","White Musk"],["White Musk","Incense","Sandalwood"],["floral","incense","white floral","woody"],"Sacred passage. Lily and incense. Spiritual and enveloping."),
  b(15438,"L'Artisan Parfumeur","Tea for Two EDP","unisex",1999,4.05,"long","moderate",["fall","winter"],["Bergamot","Spices","Lychee"],["Smoked Tea","Honey"],["Musk","Amber","Sandalwood"],["smoky","tea","sweet","oriental"],"Tea ceremony meets bonfire. Smoked tea and honey. Addictive and cozy."),

  // ═══ ATELIER COLOGNE ═══
  b(17090,"Atelier Cologne","Orange Sanguine Cologne Absolue","unisex",2009,4.12,"moderate","moderate",["spring","summer"],["Blood Orange","Orange","Bergamot"],["Orange Blossom","Jasmine"],["White Musk","Amber","Sandalwood"],["citrus","floral","fresh","woody"],"Purest blood orange. Vibrant and uplifting. The reference citrus cologne."),
  b(27512,"Atelier Cologne","Clémentine California Cologne Absolue","unisex",2012,3.95,"moderate","soft",["spring","summer"],["Clementine","Yuzu","Pink Pepper"],["White Musk","Jasmine"],["White Cedar","Oakmoss","White Musk"],["citrus","fresh","floral","woody"],"California in a bottle. Clementine and jasmine. Pure sunshine."),
  b(38041,"Atelier Cologne","Oud Saphir Cologne Absolue","unisex",2014,4.08,"long","strong",["fall","winter"],["Bergamot","Black Pepper"],["Oud","Iris","Rose"],["Amber","Musk","Patchouli"],["oud","rose","spicy","amber"],"Sapphire-blue oud. Iris and bergamot. Wearable luxury oud."),
  b(39053,"Atelier Cologne","Café Tuberosa Cologne Absolue","female",2016,4.02,"long","moderate",["fall","winter"],["Coffee","Bergamot"],["Tuberose","Jasmine"],["Sandalwood","Musk"],["floral","coffee","sweet","woody"],"Coffee and tuberose in unexpected harmony. Rich and addictive. Morning luxury."),

  // ═══ FREDERIC MALLE ═══
  b(3416,"Frederic Malle","Carnal Flower EDP","unisex",2005,4.45,"long","strong",["spring","summer"],["Eucalyptus","Melon"],["Tuberose","Jasmine","Salicylates"],["Musk","Sandalwood","Coconut","Beeswax"],["white floral","tuberose","creamy","floral"],"The greatest tuberose ever made. Rich and indolic. Unmistakably luxurious."),
  b(3415,"Frederic Malle","Portrait of a Lady EDP","female",2010,4.42,"very_long","enormous",["fall","winter"],["Blackcurrant","Raspberry"],["Turkish Rose","Patchouli","Sandalwood"],["Musk","Vetiver","Benzyl Benzoate"],["rose","patchouli","fruity","woody"],"Turkish rose and black patchouli. Dark and complex. A masterpiece of femininity."),
  b(3417,"Frederic Malle","Musc Ravageur EDP","unisex",2000,4.32,"very_long","enormous",["fall","winter"],["Bergamot","Lavender","Cinnamon"],["Cloves","Sandalwood","Amber"],["Musk","Vanilla","Musk"],["musky","oriental","sweet","spicy"],"Wild musk. Cinnamon and musk. Animalistic and addictive."),
  b(37033,"Frederic Malle","Dries Van Noten EDP","unisex",2013,4.22,"long","strong",["fall","winter"],["Bergamot","Mandarin","Pepper"],["Sandalwood","Incense","Vetiver"],["Amber","Musk","Patchouli"],["woody","incense","amber","spicy"],"Deconstructed fougère. Sandalwood and incense. Intellectual luxury."),

  // ═══ DIPTYQUE – ek seriler ═══
  b(57483,"Diptyque","Eau Rose EDT","female",2016,3.95,"moderate","soft",["spring","summer"],["Pink Berries","Lemon"],["Rose","Peony","Geranium"],["White Musk"],["floral","rose","fresh","citrus"],"Fresh and natural rose. Peony and pink berries. Light and charming."),
  b(38046,"Diptyque","Florabellio EDT","unisex",2013,3.88,"moderate","moderate",["spring","summer"],["Apple","Eucalyptus","Elemi"],["Coffee Flower","Jasmine"],["Sandalwood","Musk","Vetiver"],["floral","fresh","green","woody"],"Coffee blossom paradise. Apple and jasmine. Surprising and beautiful."),
  b(62712,"Diptyque","Eau des Sens EDT","unisex",2018,3.92,"moderate","moderate",["spring","summer"],["Bergamot","Orange"],["Juniper","Angelica"],["Patchouli","Amber","Sandalwood"],["fresh","woody","citrus","spicy"],"Nature walked through. Orange and juniper. Botanical and beautiful."),
  b(17078,"Diptyque","Ofresia EDT","unisex",2010,3.85,"moderate","soft",["spring","summer"],["Bergamot","Freesia","Peach"],["Freesia","Rose"],["White Musk","Sandalwood"],["floral","fruity","fresh","musk"],"Freesia and peach. Delicate and joyful. Light spring femininity."),

  // ═══ MAISON MARGIELA – ek seriler ═══
  b(31856,"Maison Margiela","Replica Coffee Break EDT","unisex",2017,3.98,"moderate","moderate",["fall","winter"],["Bergamot","Cardamom","Coffee"],["Creamy Coffee","Jasmine"],["Sandalwood","Musk","Cashmeran"],["coffee","sweet","creamy","woody"],"Morning coffee break. Cardamom and creamy coffee. Comfort in a bottle."),
  b(57493,"Maison Margiela","Replica On A Date EDT","unisex",2020,3.88,"moderate","moderate",["spring","fall"],["Bergamot","Iris"],["Rose","White Musk","Iris"],["Sandalwood","Vetiver","White Musk"],["iris","floral","powdery","fresh"],"First date nerves. Iris and rose. Romantic and hopeful."),
  b(57494,"Maison Margiela","Replica Under the Lemon Trees EDT","unisex",2020,3.82,"short","soft",["spring","summer"],["Lemon","Neroli","Bergamot"],["White Tea","Jasmine"],["Musk","Sandalwood"],["citrus","floral","fresh","tea"],"Under a lemon tree in summer. Neroli and lemon. Pure Mediterranean happiness."),
  b(74457,"Maison Margiela","Replica Flower Market EDT","female",2020,3.75,"moderate","moderate",["spring","summer"],["Peony","Pear"],["Rose","Freesia","Peony"],["White Musk","Cedar"],["floral","fruity","fresh","rose"],"Sunday market flowers. Peony and pear. Romantic and fresh."),
  b(31857,"Maison Margiela","Replica Springtime in a Park EDT","unisex",2015,3.78,"moderate","soft",["spring","summer"],["Pear","Bergamot","Lily of the Valley"],["Jasmine","Magnolia","Peony"],["White Musk","Sandalwood","Green Accord"],["floral","fresh","fruity","green"],"First warm spring day. Lily of the valley and green notes. Carefree and pure."),

  // ═══ JULIETTE HAS A GUN ═══
  b(9050,"Juliette Has a Gun","Not a Perfume EDP","unisex",2010,4.15,"long","moderate",["spring","summer","fall"],["Ambrette Seed"],["Ambrette Seed"],["Ambrette Seed"],["musk","sweet","creamy","floral"],"A perfume that isn't a perfume. Pure ambrette. Skin-like and addictive."),
  b(9051,"Juliette Has a Gun","Lady Vengeance EDP","female",2006,3.88,"long","strong",["fall","winter"],["Patchouli","Rose","Black Currant"],["Rose","Patchouli"],["Amber","White Musk","Sandalwood"],["rose","patchouli","floral","sweet"],"Femme fatale. Rose and patchouli. Dangerous femininity."),
  b(9052,"Juliette Has a Gun","Miss Charming EDT","female",2013,3.75,"moderate","moderate",["spring","summer"],["Raspberry","Lemon","Bergamot"],["Rose","Peony","Jasmine"],["Musk","White Musk","Sandalwood"],["floral","fruity","fresh","rose"],"Charming and playful. Raspberry and rose. Fun femininity."),
  b(34504,"Juliette Has a Gun","Romantina EDT","female",2011,3.72,"moderate","moderate",["spring","summer"],["Pink Pepper","Bergamot"],["Peony","Magnolia","Rose"],["Musk","Amber","Patchouli"],["floral","spicy","sweet","fresh"],"Playful romance. Pink pepper and peony. Flirtatious and bright."),

  // ═══ COMME DES GARÇONS ═══
  b(2764,"Comme des Garçons","Black EDT","unisex",2004,4.12,"long","moderate",["fall","winter"],["Incense","Metal","Gasoline"],["Incense","Vetiver","Rose"],["Benzoin","Labdanum","Musk"],["smoky","incense","woody","leather"],"Industrial poetry. Incense and metal. For those who dare."),
  b(14017,"Comme des Garçons","Wonderwood EDP","unisex",2010,4.05,"long","moderate",["fall","winter"],["Sandalwood","Cedarwood"],["Oud","Guaiac Wood","Papyrus"],["Patchouli","Ambergris","Labdanum"],["woody","smoky","earthy","resinous"],"A forest of woods. Complex and contemplative. For true wood lovers."),
  b(17087,"Comme des Garçons","Amazingreen EDT","unisex",2013,3.88,"moderate","moderate",["spring","summer"],["Fig","Nettle","Grass","Petitgrain"],["Mate Tea","Pepper"],["Driftwood","Musk"],["green","earthy","fresh","woody"],"Radical green. Grass and fig. The most botanical fragrance."),
  b(1543,"Comme des Garçons","Comme des Garçons 2 EDT","unisex",1999,4.22,"moderate","moderate",["fall","winter"],["Ink","Metallic"],["Incense","Cedarwood"],["Amber","Oakmoss","Benzoin"],["smoky","woody","incense","leather"],"Ink and incense. Conceptual and beautiful. Art house fragrance."),

  // ═══ ETAT LIBRE D'ORANGE ═══
  b(2766,"Etat Libre d'Orange","Sécrétions Magnifiques EDP","unisex",2006,3.15,"moderate","moderate",["spring","summer"],["Seawater","Adrenaline"],["Iodine","Milk","Blood","Iris"],["Sandalwood","White Musk"],["aquatic","floral","fresh","animalic"],"The most controversial fragrance ever made. Blood and seawater. For the brave only."),
  b(34521,"Etat Libre d'Orange","You or Someone Like You EDP","unisex",2011,3.92,"long","moderate",["spring","fall"],["Grapefruit","Fig"],["Tea","Violet","Rose"],["Amber","Musk","Sandalwood"],["fresh","floral","tea","green"],"Sophisticated and literary. Tea and violet. Intelligent fragrance."),

  // ═══ NASOMATTO ═══
  b(14011,"Nasomatto","Black Afgano EDP","unisex",2009,4.28,"very_long","enormous",["fall","winter"],["Hashish"],["Cannabis","Coffee","Oud"],["Sandalwood","Resin"],["earthy","smoky","oud","tobacco"],"The most illegal-smelling legal fragrance. Cannabis and oud. Controversial cult."),
  b(14010,"Nasomatto","Duro EDP","male",2009,4.05,"long","strong",["fall","winter"],["Oud","Woody Notes"],["Amber","Resin"],["Musk","Sandalwood"],["woody","oud","resinous","amber"],"Hard and noble. Dark woods and resins. For strong personalities only."),
  b(14013,"Nasomatto","Narcotic Venus EDP","female",2010,4.18,"long","strong",["fall","winter"],["Tuberose","Musk"],["Coconut","Musk"],["White Musk","Sandalwood"],["white floral","musky","creamy","sweet"],"Venus incarnate. Tuberose and coconut musk. Hypnotically feminine."),
  b(14014,"Nasomatto","Pardon EDP","male",2012,4.12,"long","strong",["fall","winter"],["Oud","Resin"],["Amber","Leather"],["Sandalwood","Musk"],["oud","leather","amber","resinous"],"Dark and brooding. Oud and leather. Masculine power statement."),

  // ═══ INITIO PARFUMS PRIVÉS ═══
  b(57485,"Initio Parfums Privés","Oud for Greatness EDP","unisex",2018,4.38,"very_long","enormous",["fall","winter"],["Oud","Saffron","Cardamom"],["Oud","Leather","Spices"],["Musk","Ambergris"],["oud","spicy","leather","amber"],"Oud for legends only. Saffron and leather. Maximum luxury impact."),
  b(57487,"Initio Parfums Privés","Magnetic Blend 7 EDP","unisex",2019,4.22,"long","strong",["fall","winter"],["Musk","Ambrox"],["Sandalwood","Vetiver"],["Musk","Ambergris"],["musky","woody","amber","sensual"],"Magnetic attraction. Pure ambrox and musk. Irresistible skin scent."),
  b(57489,"Initio Parfums Privés","Rehab EDP","unisex",2015,4.15,"long","strong",["fall","winter"],["Grapefruit","Bergamot"],["Tobacco","Oakmoss","Vetiver"],["Tonka Bean","Sandalwood","Musk"],["tobacco","woody","fresh","amber"],"Breaking the addiction. Tobacco and oakmoss. Noble and complex."),
  b(62708,"Initio Parfums Privés","Black Gold Project EDP","unisex",2018,4.18,"very_long","enormous",["fall","winter"],["Saffron","Cardamom"],["Oud","Leather","Amber"],["Musk","Vanilla","Sandalwood"],["oud","amber","spicy","sweet"],"Liquid gold. Saffron and oud. The most opulent in the line."),

  // ═══ TIZIANA TERENZI ═══
  b(52057,"Tiziana Terenzi","Kirke EDP","unisex",2016,4.35,"very_long","enormous",["spring","summer"],["Bergamot","Coconut","Peach"],["Tuberose","Jasmine","Rose"],["Musk","Amber","Vanilla","Sandalwood"],["floral","fruity","creamy","sweet"],"Tropical white floral luxury. Coconut and tuberose. Sunkissed opulence."),
  b(52055,"Tiziana Terenzi","Guido EDP","unisex",2016,4.18,"long","strong",["fall","winter"],["Oud","Patchouli"],["Spices","Amber"],["Musk","Sandalwood","Vetiver"],["oud","woody","spicy","amber"],"Oud and spices in Italian luxury. Complex and sophisticated."),
  b(52053,"Tiziana Terenzi","Casanova EDP","unisex",2016,4.22,"very_long","strong",["fall","winter"],["Bergamot","Pink Pepper","Rose"],["Rose","Oud","Amber"],["Musk","Sandalwood","Patchouli"],["rose","oud","spicy","amber"],"The legendary seducer. Rose and oud. Italian romantic luxury."),
  b(61073,"Tiziana Terenzi","Tabit EDP","unisex",2018,4.42,"very_long","enormous",["fall","winter"],["Saffron","Cardamom","Bergamot"],["Oud","Rose","Amber"],["Sandalwood","Musk","Vanilla"],["oud","rose","amber","sweet"],"Among the finest from the house. Saffron and oud with rose. Spectacular."),

  // ═══ NISHANE ═══
  b(52060,"Nishane","Hacivat EDP","unisex",2017,4.42,"very_long","enormous",["spring","summer","fall"],["Bergamot","Cinnamon","Grapefruit","Pineapple"],["Oakmoss","Jasmine","Agarwood"],["Ambergris","Musk","Sandalwood","Patchouli"],["fruity","woody","fresh spicy","amber"],"Turkish shadow theatre. Pineapple and oakmoss. Loved by all."),
  b(66517,"Nishane","Ani EDP","unisex",2018,4.28,"very_long","strong",["fall","winter"],["Bergamot","Cardamom","Saffron"],["Rose","Oud","Jasmine"],["Sandalwood","Amber","Musk"],["oud","rose","amber","spicy"],"Inspired by ancient Anatolia. Rose and oud with saffron. Majestic."),
  b(67556,"Nishane","Wulong Cha EDP","unisex",2019,4.18,"long","moderate",["spring","fall"],["Bergamot","White Tea"],["White Tea","Oolong Tea","Sandalwood"],["Sandalwood","Musk","Cedarwood"],["tea","woody","fresh","aromatic"],"Oolong ceremony. Tea and sandalwood. Serene and meditative luxury."),
  b(72845,"Nishane","Fan Your Flames EDP","unisex",2019,4.32,"very_long","strong",["fall","winter"],["Saffron","Bergamot"],["Rose","Oud","Amber"],["Sandalwood","Musk","Patchouli"],["oud","rose","spicy","amber"],"The Turkish rose statement. Saffron and oud with precious rose. Spectacular."),

  // ═══ ARMAF ═══
  b(35507,"Armaf","Club de Nuit Intense Man EDP","male",2015,4.32,"very_long","enormous",["fall","winter"],["Bergamot","Apple","Blackcurrant","Pineapple"],["Birch","Jasmine","Rose"],["Sandalwood","Musk","Ambergris","Vanilla"],["fruity","woody","fresh","amber"],"Best Aventus alternative. Pineapple and birch smoke. Exceptional value."),
  b(35508,"Armaf","Club de Nuit Intense Woman EDP","female",2016,4.05,"long","strong",["spring","fall"],["Peach","Pink Pepper","Raspberry"],["Jasmine","Rose","Lily"],["Musk","Vanilla","Sandalwood"],["floral","fruity","sweet","musk"],"Feminine powerhouse. Peach and rose. Budget luxury."),
  b(35506,"Armaf","Tres Nuit EDP","male",2016,3.92,"long","strong",["spring","fall"],["Bergamot","Lemon","Apple"],["Cardamom","Sage","Lavender"],["Cedar","Musk","Amber"],["fresh","aromatic","citrus","woody"],"Fresh and elegant. Lavender and cedar. Excellent value signature."),
  b(52062,"Armaf","Niche Oud EDP","unisex",2017,4.08,"very_long","strong",["fall","winter"],["Saffron","Bergamot"],["Oud","Rose","Incense"],["Sandalwood","Amber","Musk"],["oud","rose","incense","amber"],"Accessible luxury oud. Rose and incense. Niche quality at accessible price."),

  // ═══ FLORIS ═══
  b(3404,"Floris","No. 89 EDT","male",1951,4.08,"long","moderate",["spring","fall"],["Bergamot","Neroli","Lavender","Petitgrain"],["Rose","Jasmine","Iris","Carnation"],["Oakmoss","Vetiver","Musk","Amber"],["fougere","aromatic","floral","woody"],"The royal barber. English fougère since 1951. Worn by royalty."),
  b(3405,"Floris","Rose Absolute EDP","female",1960,4.12,"long","moderate",["spring","summer"],["Bergamot","Lemon"],["Rose Absolute","Orris"],["Musk","Cedarwood","Sandalwood"],["rose","floral","powdery","woody"],"English rose perfection. Pure rose absolute. Timeless Mayfair luxury."),

  // ═══ ACQUA DI PARMA – ek seriler ═══
  b(8602,"Acqua di Parma","Colonia Intensa EDP","male",2010,4.15,"long","moderate",["fall","winter","spring"],["Bergamot","Lemon","Orange"],["Pepper","Labdanum","Vetiver"],["Amber","Oakmoss","Patchouli","White Musk"],["citrus","aromatic","amber","woody"],"Intense Colonia. Deeper and more resinous. Dressed elegance."),
  b(19010,"Acqua di Parma","Assoluta di Colonia EDT","unisex",2012,3.95,"moderate","moderate",["spring","summer"],["Lemon","Bergamot","Petitgrain"],["Roses","Jasmine","Neroli"],["Vetiver","Amber","Sandalwood"],["citrus","floral","woody","aromatic"],"Summer absolute. The lightest Colonia. Pure Italian elegance."),
  b(46444,"Acqua di Parma","Peonia Nobile EDP","female",2010,3.92,"long","moderate",["spring","summer"],["Bergamot","Citrus"],["Peony","Narcissus","Jasmine"],["Sandalwood","Musk","White Cedar"],["floral","white floral","citrus","woody"],"Italian peony. Soft and radiant. Noble femininity."),
  b(46445,"Acqua di Parma","Magnolia Nobile EDP","female",2013,3.88,"long","moderate",["spring","summer"],["Bergamot","Lemon","Rosewood"],["Magnolia","Orange Blossom","Iris"],["Amber","Musk","Sandalwood"],["floral","white floral","fresh","woody"],"Italian magnolia. Fresh and joyful. Spring in bloom."),

  // ═══ PENHALIGON'S – ek seriler ═══
  b(2758,"Penhaligon's","Blenheim Bouquet EDT","male",1902,4.15,"moderate","moderate",["spring","summer","fall"],["Lemon","Lime","Pine","Pepper"],["Lavender","Thyme"],["Oakmoss","Musk","Sandalwood"],["citrus","aromatic","fresh","woody"],"Over a century of elegance. Citrus and lavender. The Churchill favourite."),
  b(15450,"Penhaligon's","Sartorial EDT","male",2010,4.08,"long","moderate",["spring","fall"],["Bergamot","Honey"],["Beeswax","Iris","Saffron"],["Musk","Sandalwood","Vetiver"],["aromatic","honey","iris","woody"],"Savile Row in a bottle. Beeswax and iris. Perfectly tailored."),
  b(15451,"Penhaligon's","Endymion Cologne","male",2004,4.02,"long","moderate",["spring","fall"],["Bergamot","Cardamom"],["Lavender","Blackcurrant","Violet"],["Vetiver","Sandalwood","Musk"],["aromatic","citrus","lavender","woody"],"English garden. Lavender and cardamom. Quintessentially British."),

  // ═══ CREED – ek seriler ═══
  b(27514,"Creed","Spice and Wood EDP","unisex",2009,4.18,"long","strong",["fall","winter"],["Bergamot","Nutmeg","Cinnamon"],["Sandalwood","Cedarwood","Guaiac Wood","Oud"],["Musk","Vetiver","Amber"],["woody","spicy","warm spicy","oud"],"Warm spiced woods. Cinnamon and sandalwood. Opulent Creed warmth."),
  b(27513,"Creed","Original Santal EDP","unisex",2005,4.12,"long","moderate",["spring","fall"],["Bergamot","Cardamom"],["Papyrus","Sandalwood","Santal","Amyris"],["Musk","Amber"],["woody","creamy","citrus","spicy"],"Pure sandalwood luxury. Cardamom and amber. Understated and rich."),
  b(9829,"Creed","Spring Flower EDP","female",2009,4.05,"long","moderate",["spring","summer"],["Apricot","Peach","Cashmeran"],["Freesia","Jasmine Sambac","Rose"],["Musk","Sandalwood"],["floral","fruity","fresh","musky"],"Feminine flower garden. Apricot and jasmine. Light and radiant."),

  // ═══ PARFUMS DE MARLY – ek seriler ═══
  b(67553,"Parfums de Marly","Althair EDP","male",2017,4.12,"long","strong",["spring","fall"],["Bergamot","Cardamom","Black Pepper"],["Tonka Bean","Musk","Leather"],["Sandalwood","Musk"],["spicy","leather","sweet","woody"],"Leather and spice in French luxury. Cardamom and tonka. Discreet power."),
  b(64508,"Parfums de Marly","Sedley EDP","male",2018,4.08,"moderate","moderate",["spring","summer"],["Grapefruit","Spearmint"],["Geranium","Lavender","Violet"],["Musk","Cedarwood","Cashmeran"],["fresh","aromatic","green","woody"],"English garden freshness. Spearmint and geranium. The summer PDM."),
  b(64509,"Parfums de Marly","Valaya EDP","female",2018,4.05,"long","strong",["spring","fall"],["Bergamot","Blackcurrant"],["Iris","Lily","Jasmine"],["Sandalwood","Musk","Cashmeran"],["floral","iris","fresh","woody"],"Elegant and refined feminine. Iris and blackcurrant. Subtle luxury."),
  b(72846,"Parfums de Marly","Delina Exclusif EDP","female",2019,4.38,"long","strong",["spring","fall"],["Rhubarb","Lychee","Bergamot"],["Rose","Magnolia","Litchi"],["Musk","Cashmeran","Sandalwood"],["floral","fruity","rose","creamy"],"The richer, deeper Delina. More creamy and rose-forward. Dream feminine."),

  // ═══ XERJOFF – ek seriler ═══
  b(64506,"Xerjoff","Cruz del Sur II EDP","unisex",2017,4.18,"long","strong",["fall","winter"],["Saffron","Pink Pepper","Bergamot"],["Oud","Amber","Rose"],["Musk","Sandalwood","Patchouli"],["oud","spicy","rose","amber"],"Southern Cross constellation. Oud and rose in Italian luxury. Stellar."),
  b(52054,"Xerjoff","Alexandria II EDP","unisex",2015,4.35,"very_long","enormous",["fall","winter"],["Bergamot","Mandarin","Black Pepper"],["Rose","Oud","Amber"],["Sandalwood","Vanilla","Musk","Patchouli"],["oud","rose","amber","sweet"],"Library of Alexandria. Rose and oud with vanilla. Legendary."),
  b(70791,"Xerjoff","Aqua Regia EDP","unisex",2018,4.02,"long","moderate",["spring","summer"],["Bergamot","Neroli","Citrus"],["Jasmine","Heliotrope","Iris"],["Musk","Sandalwood","Ambergris"],["citrus","floral","fresh","musk"],"Noble water. Citrus and jasmine. Summer Italian luxury."),

  // ═══ AMOUAGE – ek seriler ═══
  b(1416,"Amouage","Reflection Woman EDP","female",2007,4.12,"long","strong",["spring","fall"],["Neroli","Bergamot"],["Rose","Jasmine","Ylang-Ylang","Magnolia"],["Vetiver","Sandalwood","Musk"],["floral","white floral","fresh","citrus"],"Purest white flowers. Rose and jasmine in Omani luxury. Refined."),
  b(25430,"Amouage","Beach Hut Man EDP","male",2013,4.08,"long","moderate",["spring","summer"],["Grapefruit","Bergamot","Cardamom"],["Coconut","Jasmine","Tiare"],["Musk","Sandalwood","Amber"],["fresh","citrus","coconut","woody"],"Sun-drenched beach. Grapefruit and coconut. Amouage's most accessible."),
  b(31849,"Amouage","Journey Man EDP","male",2014,4.28,"long","strong",["fall","winter"],["Bergamot","Grapefruit","Elemi"],["Cypriol","Lavender","Incense"],["Sandalwood","Vetiver","Amber"],["woody","incense","aromatic","spicy"],"The wanderer's scent. Elemi and incense. Complex and rewarding."),
  b(72844,"Amouage","Portrayal Man EDP","male",2020,4.18,"long","strong",["fall","winter"],["Bergamot","Pink Pepper"],["Oud","Amber","Patchouli","Rose"],["Sandalwood","Musk","Vetiver"],["oud","spicy","amber","woody"],"Self-portrait in oud. Pink pepper and patchouli. Contemporary Amouage."),

  // ═══ KILIAN – ek seriler ═══
  b(39057,"Kilian","Black Phantom Memento Mori EDP","unisex",2015,4.38,"very_long","enormous",["fall","winter"],["Rum","Brown Sugar"],["Coffee","Caramel","Jasmine"],["Sandalwood","Tonka Bean","Vanilla","Vetiver"],["gourmand","rum","sweet","tobacco"],"Death-themed rum and coffee. Dark and addictive. Memento mori luxury."),
  b(34522,"Kilian","Good Girl Gone Bad EDP","female",2012,4.28,"long","strong",["spring","fall"],["Magnolia","Tuberose","Neroli","Jasmine"],["May Rose","Lily of the Valley"],["White Musk"],["white floral","floral","fresh","sweet"],"White bouquet explosion. Tuberose chorus. Feminine power."),
  b(17086,"Kilian","Love","female",2007,4.15,"long","strong",["spring","fall"],["Cinnamon","Iris"],["White Flowers","Honey"],["Ambergris","Vanilla","Suede"],["floral","honey","sweet","warm spicy"],"Love in luxury. Honey and iris over suede. Addictive romance."),
  b(57486,"Kilian","Apple Brandy on the Rocks EDP","unisex",2016,4.12,"long","strong",["fall","winter"],["Apple","Cognac","Calvados"],["Cinnamon","Tobacco","Cardamom"],["Sandalwood","Vanilla","Amber"],["fruity","tobacco","sweet","warm spicy"],"Apple brandy luxury. Calvados and tobacco. Autumn in a glass."),

  // ═══ BULGARI – ek seriler ═══
  b(27518,"Bvlgari","Man in Black EDP","male",2014,4.08,"long","strong",["fall","winter"],["Tobacco","Rum","Spices"],["Iris","Benzyl Salicylate"],["Guaiac Wood","Amber","Leather"],["tobacco","warm spicy","leather","amber"],"Dark Italian masculinity. Rum and tobacco. Modern classic."),
  b(57484,"Bvlgari","Man Wood Essence EDP","male",2017,3.92,"long","moderate",["spring","fall"],["Bergamot","Kalamansi","Pepper"],["Vetiver","Iso E Super","Papyrus"],["Vetiver","Musk","Sandalwood"],["woody","citrus","fresh","aromatic"],"Woody Italian masculinity. Vetiver and sandalwood. Natural and refined."),
  b(23435,"Bvlgari","Man Extreme EDT","male",2011,3.75,"moderate","moderate",["spring","summer"],["Bergamot","Grapefruit","Aquatic Notes"],["White Musk","Vetiver","Tobacco"],["Musk","Sandalwood"],["aquatic","fresh","woody","tobacco"],"Active and sporty. Fresh aquatics and light tobacco. Modern energy."),
  b(39056,"Bvlgari","Rose Goldea EDP","female",2015,3.82,"long","moderate",["spring","fall"],["Jasmine","Bergamot"],["Rose","Peach","Tuberose"],["Musk","Sandalwood","White Musk"],["floral","rose","fruity","musk"],"Liquid gold rose. Rose and peach. Italian glamour."),

  // ═══ CARTIER – ek seriler ═══
  b(34503,"Cartier","La Panthère EDP","female",2014,3.98,"long","strong",["spring","fall"],["Gardenia","Civet"],["Chypre Accord","White Musk","Gardenia"],["Oakmoss","White Musk"],["floral","chypre","musk","animalic"],"The panther's grace. Gardenia and civet. Modern chypre icon."),
  b(46422,"Cartier","Carat EDP","female",2018,3.85,"long","moderate",["spring","summer"],["Tuberose"],["White Flowers","Tuberose","Diamond Accord"],["White Musk","Sandalwood"],["white floral","floral","powdery","musk"],"Diamond clarity. Tuberose and white flowers. Luxury luminosity."),
  b(15439,"Cartier","Baiser Volé EDP","female",2011,3.78,"long","moderate",["spring","summer"],["Lily Blossom","Magnolia"],["Lily","White Musk"],["White Musk","Sandalwood"],["white floral","floral","fresh","musk"],"Stolen kiss. Pure lily. Simple and beautiful."),
  b(48021,"Cartier","L'Envol EDP","male",2016,4.08,"long","moderate",["fall","winter","spring"],["Bourbon Geranium","Bergamot"],["Honey","Labdanum","Rum"],["Sandalwood","Musk","Amber"],["honey","sweet","spicy","woody"],"Honey and rum masculinity. Geranium and labdanum. Unusual and beautiful."),

  // ═══ SALVATORE FERRAGAMO ═══
  b(23432,"Salvatore Ferragamo","Signorina EDP","female",2013,3.72,"long","moderate",["spring","summer"],["Currant","Peony","Jasmine"],["Peony","Jasmine","Lily"],["White Musk","Sandalwood"],["floral","fruity","sweet","musk"],"Italian signature. Peony and currant. Fresh and fashionable."),
  b(34502,"Salvatore Ferragamo","Signorina Eleganza EDP","female",2015,3.78,"long","moderate",["spring","fall"],["Bergamot","Pear"],["Iris","Jasmine","Rose"],["Musk","Sandalwood","Amber"],["floral","iris","elegant","woody"],"More elegant Signorina. Iris and pear. Italian refinement."),
  b(15445,"Salvatore Ferragamo","F for Fascinating Night EDP","female",2011,3.68,"long","moderate",["fall","winter"],["Lychee","Mandarin"],["Peony","Iris","Jasmine"],["White Musk","Amber","Sandalwood"],["floral","fruity","sweet","amber"],"Fascinating nights. Lychee and peony. Italian feminine glamour."),
  b(52066,"Salvatore Ferragamo","Amo EDP","female",2017,3.75,"long","moderate",["spring","fall"],["Lemon","Peach","Plum"],["Tuberose","Rose","Lily of the Valley"],["Musk","Sandalwood","Vetiver"],["floral","fruity","sweet","white floral"],"Love letter in a bottle. Rose and peach. Romantic Italian style."),

  // ═══ ROBERTO CAVALLI ═══
  b(7013,"Roberto Cavalli","Roberto Cavalli EDP","female",2012,3.72,"long","moderate",["fall","winter"],["Bergamot","Raspberry"],["Tuberose","Orange Blossom","Iris"],["White Musk","Sandalwood","Heliotrope"],["floral","fruity","sweet","white floral"],"Wild Italian luxury. Tuberose and raspberry. Animal print in perfume."),
  b(3411,"Roberto Cavalli","Just Cavalli Her EDT","female",2011,3.65,"moderate","moderate",["spring","summer"],["Bergamot","Apple","Bamboo"],["Peony","Jasmine","Magnolia"],["Musk","Vetiver","Amber"],["floral","fruity","fresh","woody"],"Young and wild. Apple and peony. Fashion-forward freshness."),

  // ═══ LACOSTE – ek seriler ═══
  b(44017,"Lacoste","Eau de Lacoste EDT","male",2018,3.68,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Orange"],["Jasmine","Violet"],["White Musk","Sandalwood"],["fresh","citrus","floral","woody"],"Clean sport casual. Citrus and jasmine. Tennis court freshness."),
  b(23437,"Lacoste","Touch of Sun EDT","female",2006,3.58,"short","soft",["spring","summer"],["Pineapple","Orange","Apricot"],["Jasmine","Rose"],["Musk","Sandalwood"],["fruity","floral","fresh","sweet"],"Sunshine in a bottle. Tropical fruits and jasmine. Summer happiness."),

  // ═══ POLICE ═══
  b(34499,"Police","To Be EDT","male",2012,3.62,"long","moderate",["fall","winter"],["Bergamot","Lemon","Cardamom"],["Jasmine","Tonka Bean","Patchouli"],["Cedarwood","Musk","Amber"],["aromatic","warm spicy","sweet","woody"],"Accessible and seductive. Cardamom and tonka. Budget crowd-pleaser."),

  // ═══ PACO RABANNE – ek seriler ═══
  b(7017,"Paco Rabanne","1 Million Lucky EDT","male",2018,3.78,"long","moderate",["fall","winter"],["Plum","Fresh Notes","Hazelnut"],["Clary Sage","Apple"],["Vetiver","Patchouli"],["fresh","fruity","woody","fougere"],"Lucky twist on 1 Million. Fresh plum and hazelnut. More wearable."),
  b(62710,"Paco Rabanne","Fame EDP","female",2022,3.95,"long","moderate",["spring","fall"],["Mango","Jasmine"],["Jasmine","Ambrette"],["White Musks","Cedarwood"],["floral","fruity","musk","woody"],"Metallic and modern. Mango and jasmine. Millennial icon."),
  b(44021,"Paco Rabanne","Black XS for Her EDT","female",2011,3.72,"moderate","moderate",["fall","winter"],["Raspberry","Black Pepper"],["Black Rose","Jasmine"],["White Musk","Patchouli"],["floral","spicy","fruity","sweet"],"Rock chic femininity. Raspberry and black rose. Edgy and fun."),

  // ═══ JEAN-PAUL GAULTIER – ek seriler ═══
  b(2432,"Jean Paul Gaultier","Classique EDT","female",1993,3.98,"long","strong",["spring","fall"],["Mandarin","Rose","Bergamot","Cardamom"],["Iris","Rose","Ginger","Orange Flower"],["Vanilla","Musk","Amber","Benzyl Benzoate"],["floral","oriental","powdery","sweet"],"The legendary corseted bottle. Rose and vanilla. 90s icon."),
  b(2433,"Jean Paul Gaultier","Fleur du Mâle EDT","male",2007,3.78,"long","strong",["spring","summer"],["Neroli","Anise","Cardamom"],["Orange Blossom","Lavender","Lily of the Valley"],["Sandalwood","White Musk"],["floral","fresh","sweet","aromatic"],"Flower of the male. Orange blossom and lavender. Unexpectedly gentle."),

  // ═══ CAROLINA HERRERA – ek seriler ═══
  b(23430,"Carolina Herrera","Good Girl Supreme EDP","female",2020,3.88,"long","strong",["fall","winter"],["Tonka Bean","Jasmine","Tuberose"],["Tonka Bean","Patchouli"],["Cocoa","Musk","Amber"],["floral","gourmand","sweet","warm spicy"],"Supreme Good Girl. Richer tonka and tuberose. Maximum luxury."),
  b(3403,"Carolina Herrera","212 Sexy Men EDT","male",2005,3.68,"long","moderate",["fall","winter"],["Bergamot","Leather","Violet"],["Palo Santo","Musk"],["Leather","White Musk","Sandalwood"],["leather","aromatic","woody","musky"],"NYC sexy masculinity. Leather and violet. Urban and sophisticated."),
  b(3402,"Carolina Herrera","212 EDT","female",2012,3.72,"moderate","soft",["spring","summer"],["Camellia","Musk","Woody Notes"],["Magnolia","Camellia","Musk"],["White Musk","Sandalwood","Cedar"],["floral","musk","fresh","woody"],"Manhattan girl. Clean florals and musk. Everyday New York chic."),

  // ═══ MONT BLANC – ek seriler ═══
  b(64511,"Montblanc","Explorer Platinum EDP","male",2021,3.92,"long","strong",["spring","fall"],["Bergamot","Black Pepper","Haitian Vetiver"],["Papyrus","Sandalwood"],["Amberwood","Musk","Oakmoss"],["woody","fresh spicy","earthy","citrus"],"Arctic explorer. Vetiver and black pepper. Cold and noble."),
  b(27521,"Hugo Boss","Boss Jour EDP","female",2012,3.65,"long","moderate",["spring","summer"],["Bergamot","Lemon"],["White Jasmine","White Peach","White Rose"],["White Musk","Blonde Wood"],["white floral","citrus","fresh","musk"],"Pure white flowers. Jasmine and musk. Bright femininity."),
  b(33042,"Hugo Boss","Ma Vie EDP","female",2014,3.68,"long","moderate",["spring","summer"],["Jasmine"],["Freesia","Peony"],["Sandalwood","Musk"],["floral","fresh","musk","woody"],"French lifestyle feminine. Jasmine and peony. Easy and elegant."),

  // ═══ DOLCE & GABBANA – ek seriler ═══
  b(2627,"Dolce & Gabbana","Sicily EDT","female",1999,3.72,"long","moderate",["spring","summer"],["Lemon","Mandarin","Bergamot"],["Neroli","Jasmine","Orange Blossom"],["Amber","Musk","Sandalwood"],["citrus","floral","fresh","oriental"],"Sicilian summer. Lemon and neroli. Mediterranean elegance."),
  b(3413,"Dolce & Gabbana","Velvet Desire EDP","female",2014,3.88,"long","strong",["spring","fall"],["Rose","Oud"],["Rose","Peony","Lily"],["Musk","Sandalwood","Amber"],["floral","rose","oud","woody"],"Velvet rose luxury. Rose and oud. Italian opulence."),
  b(3412,"Dolce & Gabbana","Dolce EDP","female",2014,3.82,"long","moderate",["spring","summer"],["Neroli","Papaya"],["Narcissus","Amaryllis","Cassia","White Lily"],["Sandalwood","White Musk","Cashmeran"],["white floral","floral","fresh","citrus"],"Italian white flowers. Narcissus and lily. Pure and innocent."),

  // ═══ VALENTINO – ek seriler ═══
  b(74449,"Valentino","Voce Viva EDP","female",2021,3.98,"long","strong",["spring","fall"],["Bergamot","Blood Orange"],["White Currant","Tuberose","Jasmine"],["Sandalwood","Ambergris","Musk","Vetiver"],["floral","fruity","white floral","woody"],"Couture femininity. Tuberose and white currant. Fashion-forward luxury."),
  b(62726,"Valentino","Born in Roma Uomo EDT","male",2019,3.88,"long","strong",["fall","winter"],["Cardamom","Bergamot","Vetiver"],["Vetiver","Oakwood","Amber"],["Sandalwood","Musk"],["woody","aromatic","spicy","earthy"],"Roman masculine sophistication. Vetiver and cardamom. Modern gladiator."),

  // ═══ VERSACE – ek seriler ═══
  b(23042,"Versace","Versense EDT","female",2009,3.65,"moderate","soft",["spring","summer"],["Sea Breeze","Orange","Green Tea","Citrus"],["Jasmine","Neroli","Lily"],["Musk","Sandalwood"],["aquatic","fresh","floral","citrus"],"Mediterranean sea breeze. Citrus and jasmine. Summer freshness."),
  b(34498,"Versace","Yellow Diamond EDT","female",2011,3.72,"moderate","soft",["spring","summer"],["Neroli","Bergamot","Lemon"],["Water Lily","Peach","Rose","Freesia"],["Amber","Cashmere Wood","Musk","Guaiac Wood"],["floral","fresh","fruity","woody"],"Sparkling sunshine. Neroli and water lily. Bright and feminine."),
  b(34497,"Versace","Bright Crystal Absolu EDP","female",2013,3.82,"long","moderate",["spring","fall"],["Yuzu","Pomegranate","Peony"],["Peony","Magnolia","Lotus"],["Musk","Amber","Mahogany"],["floral","fruity","sweet","musk"],"More intense Bright Crystal. Deeper and more lasting. Feminine warmth."),
  b(62711,"Versace","Pour Femme Dylan Blue EDP","female",2017,3.85,"long","moderate",["spring","summer"],["Cassis","Pineapple","Bergamot"],["Cyclamen","Chinese Osmanthus","Lotus"],["Patchouli","Musk","Woody Notes"],["floral","fruity","fresh","woody"],"Female Blue. Cassis and cyclamen. Modern Italian femininity."),

  // ═══ BURBERRY – ek seriler ═══
  b(33040,"Burberry","Body Rose Gold EDP","female",2014,3.68,"long","moderate",["spring","fall"],["Rose","Peach","Bergamot"],["Heliotrope","Peony","Orris"],["Amber","Musk","Sandalwood","Cashmere"],["floral","rose","powdery","amber"],"Rose gold edition. Peach and rose. Luxurious British femininity."),
  b(27522,"Burberry","My Burberry EDP","female",2014,3.88,"long","strong",["spring","fall"],["Bergamot","Candied Lemon Peel"],["Freesia","Rose","Geranium"],["Patchouli","Suede","Golden Amber"],["floral","citrus","chypre","woody"],"The Burberry woman. Freesia and patchouli. London garden in rain."),
  b(51479,"Burberry","London for Men EDP","male",2006,3.72,"long","moderate",["fall","winter"],["Bergamot","Cardamom","Nutmeg"],["Leather","Tobacco","Vetiver"],["Amber","Sandalwood","Oakmoss"],["tobacco","leather","warm spicy","woody"],"Rainy London masculinity. Tobacco and leather. Classic British gent."),

  // ═══ NARCISO RODRIGUEZ – ek seriler ═══
  b(74448,"Narciso Rodriguez","Narciso Pure Musc EDP","female",2019,4.08,"long","strong",["spring","fall"],["Bergamot","Jasmine"],["Rose","Peony","Jasmine Sambac"],["White Musk","Sandalwood"],["musk","white floral","floral","fresh"],"The purest musk. White flowers on skin. Ultimate clean luxury."),
  b(62709,"Narciso Rodriguez","Narciso Rouge EDP","female",2018,3.88,"long","moderate",["fall","winter"],["Bergamot","Rose"],["Rose","Peony","Jasmine"],["Musk","Cedarwood","Sandalwood","Patchouli"],["rose","floral","woody","musk"],"Rouge version. Deeper rose and cedarwood. More intense femininity."),

  // ═══ MICHAEL KORS – ek seriler ═══
  b(44042,"Michael Kors","Sparkling Blush EDP","female",2018,3.75,"long","moderate",["spring","summer"],["Grapefruit","Yuzu"],["Peony","Rose","Jasmine"],["Sandalwood","White Musk"],["floral","fruity","fresh","musk"],"Sparkling and playful. Grapefruit and peony. Glamorous freshness."),
  b(34495,"Michael Kors","Gold Luxe Edition EDP","female",2012,3.68,"long","moderate",["fall","winter"],["Bergamot","Lemon"],["Orange Blossom","Jasmine","Tuberose"],["Musk","Sandalwood","Amber"],["floral","white floral","citrus","amber"],"Golden glamour. Tuberose and orange blossom. Luxurious occasions."),

  // ═══ CHLOE – ek seriler ═══
  b(47771,"Chloé","Fleur de Parfum EDP","female",2016,3.75,"long","moderate",["spring","summer"],["Peach","Bergamot"],["Magnolia","Peony","Rose"],["Sandalwood","Musk","Vetiver"],["floral","fruity","rose","woody"],"Garden of flowers. Magnolia and peach. Fresh and romantic."),

  // ═══ COACH – ek seriler ═══
  b(57491,"Coach","Dreams EDT","female",2021,3.72,"moderate","soft",["spring","summer"],["Sugared Orange","Sparkling Water"],["Water Lily","White Tea"],["Musk","Woody Notes"],["fresh","aquatic","floral","musk"],"Daydreamer freshness. Orange and water lily. Young and free."),

  // ═══ DKNY – ek seriler ═══
  b(2620,"DKNY","Be Delicious Men EDT","male",2005,3.62,"moderate","moderate",["spring","summer"],["Bergamot","Grapefruit","Apple","Cucumber"],["Violet","Jasmine","Cedar"],["Musk","White Musk","Sandalwood"],["fresh","citrus","green","woody"],"Manhattan fresh masculine. Green apple and cucumber. Urban cool."),
  b(41046,"DKNY","Nectar Love EDP","female",2016,3.68,"moderate","moderate",["spring","summer"],["Tangerine","Apricot"],["Peony","Magnolia","Jasmine"],["Amber","Sandalwood","Musk"],["floral","fruity","sweet","amber"],"Nectar sweetness. Apricot and peony. Sweet urban femininity."),

  // ═══ LANCÔME – ek seriler ═══
  b(74453,"Lancôme","La Vie est Belle en Éclat EDT","female",2022,3.82,"moderate","moderate",["spring","summer"],["Grapefruit","Peach","Blackcurrant"],["Magnolia","Peony","Rose"],["White Musk","Sandalwood"],["floral","fruity","fresh","musk"],"Sparkling happiness. Grapefruit and peony. Joyful and bright."),
  b(3415,"Lancôme","Ô de Lancôme EDT","female",1969,4.05,"short","soft",["spring","summer"],["Bergamot","Lemon","Neroli","Aldehydes"],["Jasmine","Lily of the Valley","Orris"],["Musk","Sandalwood","Vetiver"],["citrus","floral","fresh","aldehydic"],"Grandmother of fresh feminines. Citrus and flowers. 1969 perfumery art."),

  // ═══ EK NİŞ MARKALAR ═══
  b(46423,"Juliette Has a Gun","Mmmm...","unisex",2012,3.92,"long","strong",["fall","winter"],["Musk","Ambrette","Orris"],["Musk","Ambrette"],["Musk","Ambrette","Cedarwood"],["musky","woody","sweet","powdery"],"Minimalist musk luxury. Pure skin-like warmth. Quiet but unforgettable."),
  b(41048,"Orto Parisi","Seminalis EDP","unisex",2014,4.12,"long","strong",["fall","winter"],["Benzaldehyde","Civet"],["Musk","Civet","Costus"],["Sandalwood","Amber","Vetiver"],["animalic","earthy","musk","woody"],"The most extreme skin scent. Raw and primal. Conceptual provocation."),
  b(34519,"Histoires de Parfums","1899 EDP","unisex",2000,4.02,"long","moderate",["fall","winter"],["Bergamot","Patchouli","Black Pepper"],["Smoked Wood","Vetiver","Black Tea"],["Sandalwood","Amber","Musk"],["smoky","woody","tea","spicy"],"Victorian era captured. Smoked wood and black tea. Mysterious."),
  b(38047,"Miller Harris","Lumière Dorée EDP","unisex",2012,3.92,"long","moderate",["spring","fall"],["Bergamot","Aldehyde","Rose"],["Peach","Orris","Ylang-Ylang"],["Vetiver","Sandalwood","Amber"],["floral","powdery","peach","amber"],"Golden light. Peach and rose. English artisan luxury."),
  b(15452,"Commodity","Vetiver EDP","unisex",2015,3.88,"long","moderate",["spring","fall"],["Bergamot","Vetiver","Lime"],["Vetiver","Sandalwood"],["Musk","Amber"],["woody","earthy","citrus","aromatic"],"Minimal vetiver luxury. Clean and modern. Understated perfection."),
  b(15453,"Commodity","Moss EDP","unisex",2015,3.92,"long","moderate",["fall","winter"],["Bergamot","Patchouli"],["Oakmoss","Vetiver"],["Musk","Amber","Sandalwood"],["mossy","earthy","woody","aromatic"],"Urban green luxury. Oakmoss and patchouli. Quiet and beautiful."),

  // ═══ LATTAFA – ek seriler ═══
  b(75041,"Lattafa","Fakhar For Men EDP","male",2019,4.12,"very_long","enormous",["fall","winter"],["Bergamot","Mandarin","Cardamom","Saffron"],["Oud","Rose","Geranium"],["Amber","Musk","Patchouli"],["oud","warm spicy","amber","floral"],"Proud and majestic. Saffron and oud. Eastern luxury powerhouse."),
  b(75042,"Lattafa","Tamuh EDP","unisex",2020,4.08,"very_long","strong",["fall","winter"],["Bergamot","Black Pepper"],["Oud","Amber","Rose"],["Sandalwood","Musk","Patchouli"],["oud","amber","spicy","floral"],"Ambition in a bottle. Oud and black pepper. Strong and confident."),
  b(75043,"Lattafa","Hayaati EDP","unisex",2020,4.05,"long","strong",["spring","fall"],["Bergamot","Grapefruit","Peach"],["Rose","Oud","Saffron"],["Amber","Sandalwood","Musk"],["floral","oud","fruity","amber"],"My life in scent. Peach and rose oud. Eastern romantic."),

  // ═══ RASASI – ek seriler ═══
  b(75042,"Rasasi","Layl EDP","unisex",2019,4.18,"very_long","strong",["fall","winter"],["Bergamot","Saffron","Rose"],["Oud","Amber","Jasmine"],["Sandalwood","Musk","Vanilla"],["oud","floral","amber","sweet"],"Night of luxury. Rose and oud with saffron. Arabian night dreams."),
  b(75043,"Rasasi","Chastity Man EDP","male",2012,3.98,"long","strong",["fall","winter"],["Bergamot","Cardamom"],["Oud","Sandalwood","Amber"],["Musk","Vanilla"],["oud","woody","warm spicy","amber"],"Noble masculinity. Cardamom and oud. Eastern gentleman."),

  // ═══ SWISS ARABIAN – ek seriler ═══
  b(44039,"Swiss Arabian","Amaali EDP","unisex",2020,4.08,"very_long","strong",["fall","winter"],["Bergamot","Saffron"],["Rose","Oud","Sandalwood"],["Amber","Musk","Vanilla"],["oud","rose","sweet","amber"],"Hope and aspiration. Rose and oud. Arabian hope."),
  b(44040,"Swiss Arabian","Oud 24 Hours EDP","unisex",2018,4.15,"very_long","enormous",["fall","winter"],["Bergamot"],["Oud","Amber"],["Sandalwood","Musk","Vanilla"],["oud","amber","woody","sweet"],"24-hour longevity oud. Pure and long-lasting. True dedication to oud."),

  // ═══ ZIMAYA ═══
  b(75044,"Zimaya","Hawwa EDP","female",2019,4.12,"long","strong",["spring","fall"],["Bergamot","Peach","Plum"],["Rose","Jasmine","Lily"],["Musk","Amber","Vanilla"],["floral","fruity","sweet","amber"],"Garden of Eve. Rose and peach. Sweet Eastern femininity."),
  b(75045,"Zimaya","Ameer Al Oud Special EDP","unisex",2018,4.18,"very_long","enormous",["fall","winter"],["Saffron","Cardamom"],["Oud","Amber"],["Sandalwood","Musk","Vanilla"],["oud","warm spicy","amber","sweet"],"Prince of oud. Saffron and pure oud. Royal Arabian statement."),

  // ═══ ARABIAN OUD ═══
  b(44035,"Arabian Oud","Kalemat EDP","unisex",2018,4.22,"very_long","enormous",["fall","winter"],["Bergamot","Saffron","Rose"],["Oud","Amber","Jasmine"],["Sandalwood","Musk","Vanilla"],["oud","floral","amber","sweet"],"Words of Arabic poetry. Rose and oud. Middle Eastern masterpiece."),
  b(44036,"Arabian Oud","Mukhallat Malaki EDP","unisex",2015,4.15,"very_long","strong",["fall","winter"],["Bergamot","Saffron"],["Rose","Oud","Incense"],["Amber","Sandalwood","Musk"],["oud","rose","incense","amber"],"Royal blend. Oud and incense. Regal Arabian luxury."),

  // ═══ GUCCI – ek seriler ═══
  b(23041,"Gucci","Bamboo EDP","female",2015,3.72,"long","moderate",["spring","summer"],["Cassis","Pink Pepper","Tahitian Vanilla"],["Cashmere Wood","Orchid","Rose","Ylang-Ylang"],["Sandalwood","White Musk"],["floral","fruity","woody","sweet"],"Natural femininity. Orchid and cassis. Fresh Italian elegance."),
  b(39265,"Gucci","Flora Gorgeous Gardenia EDP","female",2021,3.88,"long","moderate",["spring","summer"],["Red Berries","Pear"],["Gardenia","Frangipani","Rose"],["Patchouli","Brown Sugar","Sandalwood"],["floral","fruity","sweet","woody"],"Garden beauty. Gardenia and red berries. Modern romantic."),
  b(39266,"Gucci","Memoire d'une Odeur EDP","unisex",2019,3.98,"long","moderate",["spring","fall"],["Roman Chamomile","Coral Jasmine","Muguet"],["Sandalwood","Cashmeran"],["White Musk","Musk"],["floral","woody","musk","fresh"],"Memory of a smell. Chamomile and musk. Unexpected and gentle."),

  // ═══ ARMANI – ek seriler ═══
  b(66512,"Giorgio Armani","Acqua di Gio Profondo EDP","male",2021,4.18,"long","strong",["spring","summer"],["Bergamot","Green Mandarin","Marine Notes"],["Sage","Labdanum","Mineral Notes"],["Ambroxan","Sandalwood","Musk"],["aquatic","fresh","woody","mineral"],"Deep ocean masculinity. Marine and labdanum. Modern aquatic icon."),
  b(72837,"Giorgio Armani","Code Absolu EDP","male",2022,4.12,"long","strong",["fall","winter"],["Cardamom","Mandarin"],["Tonka Bean","Orange Blossom","Hazelnut"],["Vetiver","Sandalwood"],["warm spicy","sweet","floral","woody"],"Absolute seduction. Hazelnut and tonka. Sophisticated and addictive."),
  b(37038,"Giorgio Armani","Sì Intense EDP","female",2015,4.05,"long","strong",["fall","winter"],["Blackcurrant","Bergamot","Freesia"],["Rose","Neroli","Lily"],["Amberwood","Patchouli","Vanilla"],["floral","fruity","amber","vanilla"],"More intense Sì. Deeper and warmer. Evening sophistication."),

  // ═══ PRADA – ek seriler ═══
  b(3396,"Prada","Amber EDP","female",2004,3.88,"long","strong",["fall","winter"],["Bergamot","Mandarin","Bitter Orange"],["Labdanum","Benzyl Salicylate","Tonka Bean"],["Amber","Patchouli","Vetiver","Sandalwood"],["oriental","amber","powdery","woody"],"The iconic amber. Labdanum and patchouli. Prada's heritage fragrance."),
  b(15441,"Prada","Infusion d'Iris Absolue EDP","female",2009,4.08,"long","strong",["spring","fall"],["Bergamot","Mandarin","Petitgrain"],["Iris Absolute","Galbanum"],["Sandalwood","Benzoin","Vetiver","Labdanum"],["iris","floral","powdery","woody"],"Deeper and more intense Iris. Absolute iris concentration. Ultimate luxury."),
  b(52065,"Prada","Luna Rossa Carbon EDT","male",2017,3.82,"long","strong",["spring","fall"],["Bergamot","Citrus","Lavender"],["Lavender","Carbon","Metallic"],["White Musk","Amberwood"],["fresh","aromatic","metallic","woody"],"Carbon fiber masculinity. Lavender and metallic. Sports performance."),
  b(57487,"Prada","Olfactories Infusion de Vétiver EDP","unisex",2019,4.12,"long","moderate",["spring","fall"],["Bergamot","Vetiver Leaf","Elemi"],["Vetiver","Galbanum"],["Vetiver","Sandalwood","Ambergris"],["woody","vetiver","earthy","green"],"Pure vetiver meditation. Elemi and galbanum. Austere beauty."),

  // ═══ CHANEL – exclusive additions ═══
  b(4938,"Chanel","Les Exclusifs: 28 La Pausa EDP","unisex",2007,4.18,"long","moderate",["spring","summer"],["Bergamot","Iris"],["Iris","White Musk"],["Sandalwood","White Musk"],["iris","floral","powdery","musk"],"Coco's Riviera villa. Pure iris. Restrained French elegance."),
  b(4939,"Chanel","Les Exclusifs: N°22 EDP","female",1922,4.22,"long","strong",["spring","fall"],["Aldehydes","Orange","Bergamot"],["Iris","Rose","Jasmine","Ylang-Ylang"],["Musk","Civet","Sandalwood","Amber"],["floral","aldehydic","powdery","oriental"],"1922 heritage. Rich aldehydic floral. Chanel before No.5."),
  b(216,"Chanel","Antaeus EDP","male",1981,4.28,"very_long","enormous",["fall","winter"],["Bergamot","Lemon","Petit Grain"],["Oakmoss","Rose","Jasmine","Geranium","Carnation"],["Civet","Labdanum","Sandalwood","Vetiver","Oakmoss"],["fougere","aromatic","earthy","animalic"],"The raw masculine power. Oakmoss and civet. Testosterone in perfume form."),

  // ═══ VERSACE Les Rêves ═══
  b(62715,"Versace","Palazzo Versailles EDP","unisex",2021,3.92,"long","strong",["fall","winter"],["Bergamot","Cardamom"],["Oud","Amber","Iris"],["Sandalwood","Musk","Patchouli"],["oud","iris","amber","spicy"],"Italian palace luxury. Oud and iris. Grandiose statement."),

  // ═══ ISSEY MIYAKE – ek seriler ═══
  b(3413,"Issey Miyake","Nuit d'Issey EDT","male",2014,3.85,"long","moderate",["fall","winter"],["Bergamot","Cardamom","Vetiver"],["Leather","Oud","Cedar"],["Musk","Amber","Patchouli"],["leather","woody","amber","spicy"],"The dark side of L'Eau. Leather and oud. Seductive evening masculine."),
  b(34500,"Issey Miyake","L'Eau Majeure d'Issey EDT","male",2018,3.72,"moderate","moderate",["spring","summer"],["Lemon","Bergamot","Calone"],["Jasmine","Vetiver","Sage"],["Amber","Cedarwood","Musk"],["aquatic","fresh","woody","aromatic"],"Major water. Calone and lemon. Expansive freshness."),
  b(51476,"Issey Miyake","Pleats Please EDP","female",2012,3.78,"long","moderate",["spring","fall"],["Bergamot","Peach","Mandarin"],["Magnolia","Freesia","Peony"],["White Musk","Sandalwood","Amber"],["floral","fruity","sweet","musk"],"Pleated elegance. Magnolia and peach. Japanese-French fusion."),

  // ═══ RALPH LAUREN – ek seriler ═══
  b(2077,"Ralph Lauren","Polo Sport EDT","male",1994,3.58,"moderate","moderate",["spring","summer"],["Grapefruit","Green Accord","Spearmint","Basil"],["Water Lily","Cypress","Rosemary"],["Musk","Sandalwood","Cedarwood"],["fresh","aquatic","green","aromatic"],"Athletic classic. Grapefruit and spearmint. Sports-inspired."),
  b(2083,"Ralph Lauren","Romance Silver EDT","male",2017,3.65,"moderate","moderate",["spring","summer"],["Ozone","Bergamot","Eucalyptus"],["Clary Sage","Iris"],["Sandalwood","White Musk"],["fresh","aquatic","aromatic","woody"],"Silver romance. Cool and clean. Modern interpretation."),
  b(3408,"Ralph Lauren","Polo Explorer EDT","male",2019,3.72,"moderate","moderate",["spring","summer"],["Bergamot","Grapefruit","Juniper Berry","Blue Cypress"],["Sage","Cedarwood","Vetiver"],["Musk","Tonka Bean"],["fresh","woody","citrus","aromatic"],"Explorer edition. Juniper and sage. Adventurous and clean."),

  // ═══ EK KOKU SERİLERİ ═══
  b(34496,"Penhaligon's","Castile EDP","unisex",2016,3.88,"long","moderate",["fall","winter"],["Bergamot","Elemi"],["Labdanum","Leather","Cedarwood"],["Ambergris","Musk","Sandalwood"],["leather","woody","resinous","amber"],"Castilian leather. Labdanum and leather. Warm and aristocratic."),
  b(46420,"Fragrance Du Bois","Oud Jaune Intense","unisex",2015,4.28,"very_long","strong",["fall","winter"],["Bergamot","Saffron"],["Oud","Rose","Sandalwood"],["Amber","Musk","Patchouli"],["oud","rose","amber","woody"],"Sustainable oud luxury. Rose and saffron. Premium responsible luxury."),
  b(62707,"Stephane Humbert Lucas","Mortal Skin EDP","unisex",2017,4.22,"long","strong",["fall","winter"],["Bergamot","Cardamom"],["Leather","Tobacco","Oud"],["Sandalwood","Amber","Musk"],["leather","tobacco","oud","spicy"],"Skin and death. Tobacco and leather. Niche power statement."),

];

// ─── Merge ────────────────────────────────────────────────────────────────────
const existing = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
console.log(`Mevcut: ${existing.length}`);

const seen = new Map();
for (const p of existing) seen.set(`${p.brand}|${p.name}`.toLowerCase().trim(), true);

let added = 0;
const merged = [...existing];
for (const p of NEW) {
  const key = `${p.brand}|${p.name}`.toLowerCase().trim();
  if (!seen.has(key)) {
    seen.set(key, true);
    merged.push(p);
    added++;
  }
}
merged.forEach((p, i) => { p.id = String(i + 1); });

writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2), "utf-8");
console.log(`Eklenen: ${added}`);
console.log(`Toplam: ${merged.length}`);
