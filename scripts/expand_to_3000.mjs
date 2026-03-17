/**
 * Perfiai - Büyük Parfüm Veritabanı Genişletme Scripti
 * Mevcut 813 parfüme ~400+ yeni parfüm ekler.
 * Format: [fid, brand, name, gender, year, rating, lon, sil, seasons, top, mid, base, accords, desc]
 * lon: short|moderate|long|very_long
 * sil: soft|moderate|strong|enormous
 * seasons: dizi - ['spring','summer','fall','winter']
 * image_url: https://fimgs.net/mdimg/perfume-thumbs/375x500.{fid}.jpg
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "../data/perfumes.json");

// ─── Türkçe açıklama üreticisi ────────────────────────────────────────────────
const ACCORD_TR = { "fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","soft spicy":"yumuşak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","musky":"misk","musk":"misk","woody":"odunsu","lavender":"lavanta","herbal":"bitkisel","floral":"çiçeksi","white floral":"beyaz çiçek","sweet":"tatlı","powdery":"pudralı","fruity":"meyveli","rose":"gül","jasmine":"yasemin","iris":"iris","tuberose":"sümbülteber","aquatic":"deniz","marine":"deniz","green":"yeşil/taze","vanilla":"vanilya","gourmand":"gurme","oud":"oud","oriental":"oryantal","earthy":"toprak","smoky":"dumanlı","leather":"deri","creamy":"kremsi","sandalwood":"sandal ağacı","patchouli":"paçuli","animalic":"hayvani","balsamic":"balsam","incense":"tütsü","tobacco":"tütün","honey":"bal","caramel":"karamel","coconut":"hindistancevizi","almond":"badem","cinnamon":"tarçın","pepper":"biber","bergamot":"bergamot","cedar":"sedir","vetiver":"vetiver","cashmeran":"keşmir","soapy":"sabunsu","mossy":"yosunlu","chypre":"chypre","fougere":"fougère" };
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

// ─── Compact veri → parfüm objesi ─────────────────────────────────────────────
function build(fid, brand, name, gender, year, rating, lon, sil, seasons, top, mid, base, accords, desc) {
  const p = { brand, name, notes:{ top, middle:mid, base }, accords, longevity:lon, sillage:sil, season:seasons, gender, rating, short_description:desc, year, image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${fid}.jpg` };
  p.short_description_tr = genTR(p);
  return p;
}

// ─── BÜYÜK PARFÜM LİSTESİ ─────────────────────────────────────────────────────
// [fid, brand, name, gender, year, rating, lon, sil, seasons, top[], mid[], base[], accords[], desc]
const NEW = [
  // ═══ DIOR ═══
  build(202,"Dior","Fahrenheit","male",1988,3.82,"moderate","strong",["fall","winter"],["Lavender","Bergamot","Lemon"],["Nutmeg","Violet","Carnation"],["Vetiver","Cedarwood","Leather"],["leather","woody","aromatic","spicy"],"Iconic leathery woody with violet and vetiver. Bold and distinctive. A timeless classic."),
  build(1017,"Dior","Miss Dior","female",1947,4.12,"long","moderate",["spring","summer","fall"],["Bergamot","Peach","Calabrian Bergamot"],["Peony","Rose","Lily of the Valley"],["Patchouli","White Musk","Sandalwood"],["floral","fresh","powdery","citrus"],"Fresh chypre floral with rose and patchouli. Feminine and sophisticated. A true icon."),
  build(37041,"Dior","Sauvage Parfum","male",2019,4.33,"very_long","enormous",["fall","winter","spring"],["Bergamot","Lavender"],["Lavender","Pepper","Sichuan Pepper"],["Ambroxan","Sandalwood","Haitian Vetiver"],["fresh spicy","amber","woody","lavender"],"Intense parfum concentration of Sauvage. More resinous and warmer. Exceptional longevity."),
  build(37040,"Dior","Sauvage Eau de Toilette","male",2018,4.11,"long","strong",["spring","summer","fall"],["Bergamot","Pepper"],["Lavender","Geranium","Sichuan Pepper"],["Ambroxan","Cedar","Labdanum"],["fresh spicy","citrus","aromatic","amber"],"EDT version of Sauvage. Lighter and fresher than the original. Great for warm weather."),
  build(50755,"Dior","Miss Dior Blooming Bouquet","female",2014,3.65,"moderate","soft",["spring","summer"],["Mandarin","Strawberry","Cherry Blossom"],["Peony","Damascus Rose","Lily of the Valley"],["White Musk","Patchouli"],["floral","fruity","sweet","powdery"],"Light floral fruity. Sweet and fresh. Young and playful."),
  build(1018,"Dior","Dior Homme","male",2005,4.05,"long","moderate",["fall","winter","spring"],["Grapefruit","Cardamom"],["Iris","Lavender","Cocoa"],["Vetiver","Sandalwood","Cedarwood"],["iris","powdery","aromatic","woody"],"Elegant iris powdery with cocoa and vetiver. Sophisticated and understated. A gentleman's choice."),
  build(39044,"Dior","Dior Homme Intense","male",2011,4.2,"long","strong",["fall","winter"],["Lavender","Bergamot"],["Iris","Pear"],["Vetiver","Amberwood","Sandalwood"],["iris","woody","powdery","amber"],"More intense version of Dior Homme. Richer iris and warmer base. Luxurious and deep."),
  build(66519,"Dior","Joy by Dior","female",2018,3.78,"long","moderate",["spring","summer","fall"],["Bergamot","Neroli"],["Rose","Magnolia"],["Sandalwood","White Musk"],["floral","citrus","fresh","woody"],"Radiant floral with neroli and rose. Joyful and feminine. Modern elegance."),
  build(62719,"Dior","Miss Dior EDP","female",2017,4.05,"long","moderate",["spring","summer","fall"],["Calabrian Bergamot","Peach"],["Damascus Rose","Peony"],["Patchouli","White Musk","Sandalwood"],["floral","fresh","powdery","rose"],"Reinterpreted Miss Dior. Romantic rose with patchouli. Timeless and modern."),
  build(72839,"Dior","Dior Homme Eau for Men","male",2020,3.95,"moderate","moderate",["spring","summer"],["Bergamot","Grapefruit"],["Iris","Geranium"],["Vetiver","Sandalwood"],["iris","fresh","citrus","woody"],"Fresh and sporty take on Dior Homme. Lighter and more casual. Perfect for daytime."),

  // ═══ CHANEL ═══
  build(200,"Chanel","Allure","female",1996,3.88,"long","moderate",["spring","fall"],["Mandarin","Bergamot"],["Jasmine","Lily","Cyclamen"],["Vanilla","Sandalwood","Oakmoss"],["floral","powdery","vanilla","citrus"],"Classic feminine floral with warm vanilla base. Alluring and sophisticated. Timeless Chanel."),
  build(844,"Chanel","Chance","female",2002,3.9,"moderate","moderate",["spring","summer"],["Pineapple","Citrus","Pink Pepper"],["Jasmine","Iris","Hyacinth"],["White Musk","Amber","Patchouli"],["floral","fresh","citrus","powdery"],"Fresh and playful feminine. Bright and cheerful. Perfect for everyday wear."),
  build(516,"Chanel","Coco Mademoiselle EDP","female",2001,4.08,"long","strong",["spring","fall","winter"],["Orange","Bergamot","Grapefruit"],["Rose","Jasmine","Lychee"],["Patchouli","Vetiver","White Musk","Vanilla"],["chypre","floral","patchouli","fresh spicy"],"Modern chypre oriental. Rose and patchouli over citrus. Elegant and confident."),
  build(49,"Chanel","Bleu de Chanel Parfum","male",2018,4.38,"very_long","strong",["fall","winter","spring"],["Grapefruit","Bergamot"],["Ginger","Jasmine","Labdanum"],["Sandalwood","Cedarwood","Vetiver","White Musk"],["woody","aromatic","citrus","amber"],"The most refined Bleu de Chanel. Deeper and warmer than the EDT/EDP. Exceptional for formal occasions."),
  build(3401,"Chanel","Chance Eau Tendre","female",2010,3.92,"moderate","moderate",["spring","summer"],["Grapefruit","Quince"],["Jasmine","Iris","Hyacinth"],["White Musk","Cedar"],["floral","fresh","citrus","powdery"],"The most delicate Chance. Light grapefruit and jasmine. Youthful and radiant."),
  build(33036,"Chanel","Chance Eau Fraîche","female",2007,3.78,"moderate","moderate",["spring","summer"],["Citrus","Teak Wood","Water Hyacinth"],["Jasmine","Iris"],["White Musk","Cedar","Vetiver"],["fresh","floral","citrus","aquatic"],"Aquatic and crisp interpretation of Chance. Fresh and effortless. Summer favourite."),
  build(51477,"Chanel","Gabrielle Chanel EDP","female",2017,3.85,"long","moderate",["spring","summer","fall"],["Mandarin","Black Currant"],["Jasmine","Ylang-Ylang","Grasse Rose","Orange Blossom"],["White Musk"],["floral","white floral","fresh","citrus"],"Radiant white floral bouquet. Four white flowers in harmony. Feminine and bright."),
  build(17082,"Chanel","Allure Homme Sport","male",2004,3.72,"moderate","moderate",["spring","summer"],["Citrus","Mandarin","Bergamot"],["Pepper","Vetiver"],["White Musk","Sandalwood","Cedar"],["fresh","citrus","woody","aromatic"],"Fresh and sporty masculine. Invigorating citrus and pepper. Perfect for active wear."),
  build(844,"Chanel","Chance Eau Vive","female",2015,3.68,"moderate","soft",["spring","summer"],["Grapefruit","Blood Orange"],["Jasmine","Water Hyacinth"],["White Musk"],["citrus","floral","fresh"],"The most sparkling Chance. Vibrant grapefruit and jasmine. Light and joyful."),

  // ═══ YSL ═══
  build(7015,"Yves Saint Laurent","1 Million","male",2008,3.85,"long","strong",["fall","winter"],["Grapefruit","Mint","Blood Mandarin"],["Rose","Spices"],["Patchouli","Leather","White Musk","Ambergris"],["fresh spicy","woody","amber","citrus"],"Seductive spicy oriental. Gold bottle, daring and luxurious. A true signature scent."),
  build(7016,"Yves Saint Laurent","Lady Million","female",2010,3.75,"long","strong",["fall","winter","spring"],["Raspberry","Neroli"],["Jasmine","Orange Blossom","Gardenia"],["Patchouli","Honey","White Musk"],["floral","sweet","powdery","fruity"],"Luxurious floral chypre. White flowers with honey and patchouli. Opulent and confident."),
  build(37280,"Yves Saint Laurent","Black Opium EDP","female",2014,4.02,"long","strong",["fall","winter"],["Pink Pepper","Pear","Anis"],["Coffee","Jasmine","Orange Blossom"],["Patchouli","Vanilla","Cedar"],["gourmand","floral","sweet","coffee"],"Addictive coffee floral oriental. Sweet, warm and edgy. Perfect for evenings."),
  build(62714,"Yves Saint Laurent","Libre EDP","female",2019,4.1,"long","strong",["spring","fall","winter"],["Mandarin","Black Currant"],["French Lavender","Orange Blossom","Jasmine","Petitgrain"],["Ambergris","Vanilla","Musk","Cashmeran"],["floral","aromatic","fresh","warm spicy"],"Lavender meets orange blossom in a bold feminine. A statement of freedom and confidence."),
  build(46437,"Yves Saint Laurent","Mon Paris EDP","female",2016,3.95,"long","moderate",["spring","summer","fall"],["Strawberry","Pear"],["Peony","Jasmine","White Peony"],["White Musk","Patchouli","Ambrette"],["floral","fruity","sweet","musk"],"Romantic and addictive floral. Sweet and radiant. Inspired by Parisian love."),
  build(66516,"Yves Saint Laurent","Idôle EDP","female",2019,3.82,"long","moderate",["spring","summer","fall"],["Bergamot"],["Rose","Jasmine"],["White Musk","Cashmeran"],["floral","fresh","musk","rose"],"Modern rose for the new generation. Clean, fresh and elegant. Perfect everyday feminine."),
  build(74452,"Yves Saint Laurent","Y EDP Intense","male",2021,4.08,"very_long","strong",["fall","winter"],["Bergamot"],["Sage","Lavender"],["Ambergris","Vetiver","Cedarwood","Ginger"],["fresh spicy","woody","amber","aromatic"],"The most intense Y. Warmer and more sensual. Exceptional cold weather scent."),
  build(23038,"Yves Saint Laurent","Kouros","male",1981,4.15,"very_long","enormous",["fall","winter"],["Bergamot","Aldehydes","Artemisia"],["Jasmine","Rose","Coriander","Carnation"],["Vetiver","Civet","Oakmoss","Ambergris"],["aromatic","floral","fougere","earthy"],"Classic masculine fougère. Bold and distinctive. An olfactory monument."),

  // ═══ GUCCI ═══
  build(14025,"Gucci","Guilty Pour Homme EDT","male",2010,3.65,"moderate","moderate",["spring","fall"],["Lemon","Lavender"],["Patchouli","Orange"],["Cedar","Amberpatchouli"],["fresh spicy","woody","citrus","aromatic"],"Daring and sensual masculine. Lemon and lavender with patchouli. Seductive."),
  build(50248,"Gucci","Bloom EDP","female",2017,3.88,"long","strong",["spring","summer","fall"],["Rangoon Creeper"],["Jasmine","Tuberose"],["White Musk","Orris Root"],["white floral","floral","powdery","sweet"],"Full white floral bouquet. Rich and enveloping. Inspired by a lush garden."),
  build(67552,"Gucci","Bloom Nettare di Fiori","female",2018,3.95,"long","strong",["fall","winter"],["Rangoon Creeper"],["Jasmine Absolute","Tuberose"],["White Musk","Orris Root","Sandalwood"],["white floral","floral","powdery","sweet","woody"],"Intensified version of Bloom. Richer and more opulent. For those who love statement florals."),
  build(39264,"Gucci","Guilty Absolute","male",2017,3.98,"long","strong",["fall","winter"],["Leather"],["Patchouli"],["Vetiver","Amber","Woody"],["leather","woody","earthy","smoky"],"Dark and brooding. Leather, patchouli, and vetiver in dark harmony. Masculine and intense."),
  build(62721,"Gucci","Bloom Acqua di Fiori","female",2018,3.72,"moderate","soft",["spring","summer"],["Bergamot","Citrus"],["Jasmine"],["White Musk"],["floral","fresh","citrus","white floral"],"Fresh and light Bloom. Daytime version of the original. Airy and effortless."),
  build(14026,"Gucci","Guilty Pour Femme","female",2010,3.58,"moderate","moderate",["spring","fall"],["Pink Pepper","Geranium"],["Lilac","Peach","Rose"],["Amber","Patchouli","White Musk"],["floral","fresh spicy","sweet","powdery"],"Feminine Guilty. Floral and spicy. Confident and seductive."),
  build(3406,"Gucci","Rush","female",2000,3.78,"long","strong",["fall","winter"],["Freesia","Peach","Coriander"],["Rose","Iris","Gardenia"],["Patchouli","Vanilla","Amber"],["floral","sweet","amber","earthy"],"Iconic feminine. Warm, ambery and enveloping. Bold and addictive."),

  // ═══ ARMANI ═══
  build(38543,"Giorgio Armani","Acqua di Gio Profumo","male",2015,4.28,"long","strong",["spring","summer","fall"],["Bergamot","Marine Notes"],["Sage","Rosemary","Incense"],["Patchouli","Incense","Ambergris"],["aquatic","aromatic","fresh","incense"],"Deeper and smokier than the original. Marine and incense in perfect balance. Sophisticated summer scent."),
  build(61067,"Giorgio Armani","Acqua di Gio Absolu","male",2018,4.05,"long","strong",["spring","summer","fall"],["Bergamot","Green Mandarin"],["Sage","Rosemary","Marine Notes"],["Patchouli","Ambergris","Musk"],["aquatic","woody","fresh","aromatic"],"The most luxurious Acqua di Gio. Richer and more complex. A mature evolution."),
  build(5523,"Giorgio Armani","Armani Code","male",2004,3.82,"long","strong",["fall","winter"],["Bergamot","Lemon"],["Olive Blossom","Star Anise","Tonka Bean"],["Guaiac Wood","Leather","Tobacco"],["woody","amber","tobacco","aromatic"],"Seductive and sophisticated. Star anise and guaiac wood combination. Evening essential."),
  build(5525,"Giorgio Armani","Armani Code Pour Femme","female",2006,3.68,"long","moderate",["fall","winter","spring"],["Bergamot","Jasmine","Orange"],["Cassia","Honey","Jasmine"],["Vanilla","White Musk","Sandalwood"],["floral","oriental","vanilla","sweet"],"Feminine Code. Jasmine and honey with warm vanilla. Seductive and sweet."),
  build(57491,"Giorgio Armani","Stronger With You","male",2017,4.15,"long","strong",["fall","winter"],["Cardamom","Violet"],["Sage","Chestnut","Patchouli"],["White Musk","Vanilla","Sandalwood"],["warm spicy","sweet","woody","gourmand"],"Warm, gourmand and spicy. Cardamom and chestnut over vanilla. Extremely seductive."),
  build(31285,"Giorgio Armani","Sì EDP","female",2013,4.0,"long","strong",["fall","winter","spring"],["Blackcurrant Nectar","Freesia","Mandarin","Bergamot"],["Rose","Neroli","Lily","Mayrose"],["Ambrewood","Vanilla","Patchouli"],["chypre","floral","fresh","citrus"],"Modern feminine chypre. Blackcurrant and rose over warm amber. Feminine and refined."),
  build(73007,"Giorgio Armani","Sì Passione EDP","female",2018,3.88,"long","moderate",["spring","fall"],["Orange","Mandarin","Pear"],["Rose","Hedione","Jasmine"],["Sandalwood","Musk","Vanilla"],["floral","fruity","sweet","rose"],"Romantic floral fruity. Passionate rose and sweet fruits. Joyful and vibrant."),
  build(70793,"Giorgio Armani","My Way EDP","female",2020,4.05,"long","strong",["spring","summer","fall"],["Bergamot","Orange Blossom"],["Tuberose","Indian Jasmine"],["White Musk","Cedarwood","Virginian Cedar","Vanilla"],["white floral","floral","fresh","woody"],"Sustainable and warm white floral. Tuberose and jasmine. Inspired by travels around the world."),
  build(2624,"Giorgio Armani","Emporio Armani He","male",2000,3.65,"moderate","moderate",["spring","summer"],["Bergamot","Basil"],["Juniper Berries","Violet","Guaiac Wood"],["Vetiver","Sandal","White Musk"],["fresh","woody","aromatic","citrus"],"Clean and fresh masculine. Refreshing and easy-going. Everyday classic."),

  // ═══ VERSACE ═══
  build(8567,"Versace","Bright Crystal","female",2006,3.72,"moderate","soft",["spring","summer"],["Pomegranate","Yuzu","Frosted Accord"],["Lotus","Magnolia","Peony"],["Musk","Amber","Mahogany"],["floral","fruity","musk","fresh"],"Fresh fruity feminine. Light, clean and accessible. Popular everyday fragrance."),
  build(60889,"Versace","Eros Flame","male",2018,3.85,"long","strong",["fall","winter"],["Lemon","Mandarin","Blood Orange"],["Black Pepper","Geranium","Rosewood","Vanilla"],["Sandalwood","Cedarwood","Leather","Tonka Bean"],["warm spicy","woody","citrus","amber"],"Fiery and sensual Eros variant. Orange and spice with warm leather base. Passionate."),
  build(2637,"Versace","Crystal Noir","female",2004,3.78,"long","moderate",["fall","winter"],["Ginger","Pepper","Cardamom"],["Peony","Gardenia","Coconut"],["Amber","Sandalwood","Musk"],["floral","oriental","warm spicy","sweet"],"Mysterious and sensual. Warm flowers with spiced woods. Dark and hypnotic."),
  build(39053,"Versace","Pour Homme Dylan Blue","male",2016,3.8,"long","strong",["spring","summer","fall"],["Watermelon","Fig Leaves","Aquatic Notes"],["Violet","Patchouli","Saffron"],["Incense","Ambergris","Musk","Tonka Bean"],["aquatic","fresh","woody","amber"],"Fresh aquatic with depth. Watermelon and violet. Modern signature masculine."),
  build(69527,"Versace","Dylan Turquoise Pour Femme","female",2019,3.62,"moderate","soft",["spring","summer"],["Watermelon","Rosewood"],["Hibiscus","Frangipani","Osmanthus"],["Musk","Cedar"],["floral","fruity","fresh","aquatic"],"Summer feminine. Tropical and refreshing. Joyful and light."),

  // ═══ PRADA ═══
  build(3398,"Prada","Infusion d'Iris","female",2007,3.92,"moderate","moderate",["spring","summer"],["Orange","Neroli"],["Iris","Cedar","Vetiver","Benzyl"],["Incense","Galbanum","Benzyl Benzoate"],["iris","floral","powdery","woody"],"Clean and crisp iris. Minimalist and sophisticated. Wearable elegance."),
  build(17084,"Prada","Candy EDP","female",2011,3.72,"long","moderate",["fall","winter"],["Caramel"],["Benzyl Benzoate","White Musk"],["Labdanum","Vanilla","Benzyl"],["gourmand","sweet","vanilla","caramel"],"Irresistibly sweet gourmand. Caramel and vanilla. Playful and edible."),
  build(7009,"Prada","Luna Rossa","male",2012,3.68,"moderate","moderate",["spring","summer","fall"],["Lavender","Sage"],["Ambrette"],["White Musk","Amberwood"],["aromatic","fresh","musk","lavender"],"Sporty lavender and sage. Fresh and masculine. Clean and modern."),
  build(57490,"Prada","La Femme EDP","female",2016,3.75,"long","strong",["fall","winter"],["Frangipani"],["Vetiver","Iris","Tuberose"],["Sandalwood","Patchouli","Amber"],["floral","woody","powdery","iris"],"Paradoxical femininity. Frangipani and vetiver in contrast. Mysterious and elegant."),
  build(74450,"Prada","Paradoxe EDP","female",2022,3.98,"long","strong",["spring","fall"],["Bergamot","Jasmine Bud"],["Amber","Neroli","Jasmine"],["Sandalwood","White Musk","Orris"],["floral","amber","citrus","woody"],"Paradoxical modern floral amber. Warm and radiant. The new Prada signature."),
  build(39029,"Prada","L'Homme Prada EDP","male",2016,3.88,"long","strong",["fall","winter","spring"],["Bergamot","Iris","Geranium"],["Iris","Geranium","Cardamom"],["Amber","Labdanum","Sandalwood"],["iris","woody","powdery","amber"],"Sophisticated masculine iris. Richer than the EDT. Amber and iris in perfect harmony."),

  // ═══ BURBERRY ═══
  build(60866,"Burberry","Her EDP","female",2018,3.88,"long","strong",["spring","fall"],["Red Berries","Blackberry","Strawberry"],["Jasmine","Violet","Iris"],["Dry Amber","Musk"],["fruity","floral","amber","sweet"],"British berry floral. Wild and feminine. Captures the spirit of London."),
  build(39578,"Burberry","Mr. Burberry EDP","male",2016,3.75,"long","moderate",["spring","fall"],["Grapefruit","Cardamom"],["Vetiver","Oakmoss","Iris"],["Cedarwood","Sandalwood","Black Pepper"],["aromatic","woody","fresh","spicy"],"Refined masculine. Oakmoss and vetiver. Classic British sensibility."),
  build(27527,"Burberry","Brit Rhythm for Him EDT","male",2013,3.55,"moderate","moderate",["spring","summer"],["Thyme","Basil"],["Cardamom","Whiskey","Wood"],["Amber","Vetiver","Sandalwood"],["aromatic","woody","fresh spicy","herbal"],"Urban and energetic. Fresh herbs and spices. Rock-inspired masculine."),
  build(3127,"Burberry","Weekend for Men EDT","male",1997,3.48,"moderate","moderate",["spring","summer"],["Pineapple","Plum","Tarragon"],["Sandalwood","Cedarwood","Hawthorn"],["Oakmoss","Musk","Sandalwood"],["fresh","woody","fruity","green"],"Light weekend casual. Fresh and breezy. Easy-going British charm."),

  // ═══ DOLCE & GABBANA ═══
  build(5250,"Dolce & Gabbana","The One for Women EDP","female",2006,4.02,"long","moderate",["fall","winter"],["Lychee","Mandarin","Peach"],["Jasmine","Lily","Plum"],["Vanilla","Amber","Musk"],["floral","oriental","sweet","fruity"],"Modern floral oriental. Luxurious and sensual. A signature evening feminine."),
  build(15498,"Dolce & Gabbana","Light Blue Pour Homme EDT","male",2007,3.85,"long","strong",["spring","summer"],["Grapefruit","Bergamot","Juniper"],["Rosemary","Brazilian Rosewood","Pepper"],["Musk","Oakmoss","Incense"],["citrus","aromatic","fresh","woody"],"Fresh Mediterranean masculine. Grapefruit and rosemary. Everyday Italian charm."),
  build(47773,"Dolce & Gabbana","Good Girl Gone Bad / The Only One","female",2018,4.0,"long","strong",["fall","winter"],["Bergamot","Pear","Black Currant"],["Violet","Coffee","Iris","Cherry"],["Patchouli","Vanilla","Sandalwood"],["floral","gourmand","warm spicy","iris"],"Flirtatious and addictive. Coffee and violet with sweet base. Seductive contradiction."),
  build(319,"Dolce & Gabbana","Light Blue EDT","female",2001,3.95,"long","strong",["spring","summer"],["Sicilian Lemon","Apple","Cedar","Bellflower"],["Bamboo","Jasmine","White Rose"],["Cedar","Musk","Amber"],["citrus","floral","fresh","woody"],"Iconic fresh Mediterranean floral. Crisp lemon and white flowers. Summer staple for 20+ years."),

  // ═══ TOM FORD ═══
  build(3188,"Tom Ford","Oud Wood","unisex",2007,4.18,"long","strong",["fall","winter"],["Rosewood","Cardamom","Chinese Pepper"],["Oud","Sandalwood","Vetiver"],["Amber","Tonka Bean","Vanilla"],["oud","woody","warm spicy","amber"],"Luxurious and accessible oud. Warm spices and rich woods. Private Blend icon."),
  build(3190,"Tom Ford","Tobacco Vanille","unisex",2007,4.42,"very_long","enormous",["fall","winter"],["Tobacco Leaf","Spices"],["Tobacco Blossom","Jasmine","Ginger","Spices"],["Vanilla","Cacao","Dried Fruits","Wood Sap"],["tobacco","gourmand","sweet","warm spicy"],"The most beloved tobacco-vanilla ever created. Rich, dark and indulgent. Cult classic."),
  build(16551,"Tom Ford","Neroli Portofino","unisex",2011,4.12,"moderate","strong",["spring","summer"],["Bergamot","Lemon","Mandarin","Myrtle","Neroli"],["Thyme","Rosemary","Lavender","Pitosporum"],["Amber","Oakmoss","Musk"],["citrus","floral","fresh","aromatic"],"Sun-drenched Italian Riviera in a bottle. Neroli and citrus. Effortless luxury."),
  build(61072,"Tom Ford","Lost Cherry","unisex",2018,4.22,"long","strong",["fall","winter"],["Cherry","Black Cherry","Bitter Almond","Plum"],["Turkish Rose","Jasmine","Fruity Notes"],["Sandalwood","Roasted Tonka Bean","Benzoin","Oud"],["fruity","sweet","woody","amber"],"Addictive cherry and almond with warm sandalwood. Gourmand luxury. Instantly iconic."),
  build(33037,"Tom Ford","Velvet Orchid","female",2014,4.0,"long","strong",["fall","winter"],["Rum","Bergamot","Citrus"],["Orchid","Black Orchid","Ylang-Ylang"],["Suede","Labdanum","Vanilla","Oakmoss"],["floral","oriental","sweet","amber"],"Darker sister to Black Orchid. Sensual velvet warmth. Opulent and nocturnal."),
  build(46446,"Tom Ford","Soleil Blanc","unisex",2016,4.08,"long","strong",["spring","summer"],["Cardamom","Bergamot","Coriander"],["Tuberose","Jasmine","Ylang-Ylang"],["Sandalwood","Benzoin","Amber","Coconut"],["floral","warm spicy","creamy","sweet"],"Sun-kissed white floral. Tuberose and coconut with amber. Summer luxury."),
  build(60870,"Tom Ford","Ombré Leather","unisex",2018,4.2,"long","strong",["fall","winter"],["Cardamom"],["Leather","Jasmine","Black Pepper"],["Patchouli","Amber","White Suede","Moss"],["leather","floral","woody","spicy"],"Modern leather with jasmine and patchouli. Warm and sensual. Redefines leather perfumery."),
  build(52058,"Tom Ford","F***ing Fabulous","unisex",2017,4.28,"long","strong",["fall","winter"],["Clary Sage","Thyme"],["Leather","Orris"],["Vanilla","Cashmeran","Oakwood"],["leather","iris","woody","vanilla"],"Warm, smooth leather with orris and cashmeran. Extraordinarily comfortable and addictive."),
  build(72843,"Tom Ford","Rose Prick","unisex",2020,4.15,"long","strong",["spring","fall"],["Cardamom","Black Pepper","Olibanum"],["Turkish Rose","Damask Rose","Patchouli"],["Oud","Sandalwood","Amber"],["rose","woody","warm spicy","oud"],"The rose with thorns. Bold and spicy rose with oud. Dramatic and distinctive."),

  // ═══ CREED ═══
  build(2748,"Creed","Silver Mountain Water","male",1995,4.22,"long","moderate",["spring","summer"],["Bergamot","Neroli","Mandarin"],["Tea","Black Currant"],["Musk","Sandalwood","Petitgrain"],["fresh","citrus","green","aquatic"],"Fresh tea and blackcurrant inspired by Swiss Alps. Clean and crisp. Elegant everyday luxury."),
  build(2745,"Creed","Green Irish Tweed","male",1985,4.35,"long","moderate",["spring","summer"],["Lemon Verbena","Violet Leaves","Irisian Iris"],["Sandalwood","Ambergris","Florentine Iris"],["Musk"],["fresh","green","floral","woody"],"The original fresh fougère. Violet and iris over sandalwood. Timeless and distinguished."),
  build(2750,"Creed","Virgin Island Water","unisex",2007,4.02,"moderate","moderate",["spring","summer"],["Lime","Bergamot","Coconut"],["Ginger","Jasmine"],["Musk","White Musk","Sandalwood"],["citrus","fruity","coconut","fresh"],"Tropical luxury. Lime and coconut over sandalwood. Carefree island escape."),
  build(2747,"Creed","Millesime Imperial","unisex",1995,4.28,"long","strong",["spring","summer"],["Bergamot","Mandarin","Lemon","Sea Notes"],["Iris","Sandalwood","Ambrette Seeds"],["Musk","Ambergris"],["aquatic","citrus","fresh","iris"],"Imperial aquatic. Sea and citrus with iris. Effortless royal luxury."),
  build(2746,"Creed","Original Vetiver","male",2004,4.18,"long","moderate",["spring","summer","fall"],["Grapefruit","Bergamot","Neroli"],["Basil","Vetiver","Geranium"],["Vetiver","White Musk","Sandalwood"],["woody","citrus","aromatic","vetiver"],"Pure vetiver luxury. Fresh citrus and earthy vetiver. Understated masterpiece."),
  build(2749,"Creed","Royal Mayfair","unisex",2009,4.08,"long","moderate",["spring","fall"],["Bergamot","Lemon","Aldehydes"],["Birch","Orris","Vetiver"],["Sandalwood","Oak","Moss","Ambergris"],["woody","green","aromatic","citrus"],"English garden in a bottle. Birch and vetiver over oakmoss. Quintessentially British."),
  build(2754,"Creed","Love in White","female",2005,3.95,"long","moderate",["spring","summer"],["Bergamot","Neroli","Cardamom","Iris"],["White Flowers","Rice","Heliotrope"],["White Musk","Sandalwood","Civet"],["white floral","powdery","iris","floral"],"Soft white floral romance. Rice and white flowers. Delicate and timeless."),
  build(9829,"Creed","Erolfa","male",1992,4.05,"long","moderate",["spring","summer"],["Watermelon","Calabrian Bergamot","Galbanum"],["Neroli","Jasmine","Nagarmotha"],["Sandalwood","Vetiver","Ambergris"],["aquatic","fresh","citrus","woody"],"Fresh aquatic for men. Crisp melon and galbanum. Clean maritime luxury."),

  // ═══ MAISON FRANCIS KURKDJIAN ═══
  build(38538,"Maison Francis Kurkdjian","Grand Soir","unisex",2015,4.32,"very_long","strong",["fall","winter"],["Benzyl Benzoate"],["Benzoin","Tonka Bean"],["Amber","Labdanum","Oakmoss","Vanilla"],["amber","vanilla","sweet","balsamic"],"Deep, hypnotic amber. Benzoin and labdanum in dark harmony. Sophisticated nocturnal luxury."),
  build(38544,"Maison Francis Kurkdjian","Oud Satin Mood","unisex",2015,4.35,"very_long","enormous",["fall","winter"],["Bergamot"],["Oud","Rose","Violet"],["Musk","Vanilla","Sandalwood","Amberwood"],["oud","rose","vanilla","sweet"],"Velvety smooth oud with rose and vanilla. Oud made irresistible. Statement of luxury."),
  build(16549,"Maison Francis Kurkdjian","Amyris Femme","female",2009,4.18,"long","strong",["spring","fall"],["Bergamot","Grapefruit"],["Peony","Amyris"],["Sandalwood","White Musk","Amyris"],["floral","woody","fresh","citrus"],"Understated luxury. Peony and amyris. Effortlessly elegant for sophisticated women."),
  build(64510,"Maison Francis Kurkdjian","Gentle Fluidity Gold","unisex",2019,4.28,"long","strong",["fall","winter"],["Nutmeg","Juniper Berry"],["Musk","Vanilla","Coriander"],["Oud","Ambergris","Sandalwood","Amber"],["warm spicy","amber","vanilla","woody"],"Warm and spiced amber. Nutmeg and vanilla. Addictively cozy luxury."),
  build(3401,"Maison Francis Kurkdjian","Aqua Universalis","unisex",2009,4.0,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Watermelon"],["White Flowers"],["White Musk","Sandalwood"],["fresh","floral","citrus","musk"],"Universally wearable clean freshness. The quintessential clean scent. Pure elegance."),

  // ═══ BYREDO ═══
  build(10004,"Byredo","Blanche EDP","female",2008,4.12,"long","moderate",["spring","summer"],["Pink Pepper","Aldehyde"],["Peony","Rose"],["White Sandalwood","Musk"],["floral","white floral","powdery","musk"],"Minimalist white floral. Clean and fresh. Effortless Scandinavian elegance."),
  build(10003,"Byredo","Gypsy Water EDP","unisex",2008,4.02,"long","moderate",["spring","fall"],["Bergamot","Lemon","Pepper"],["Juniper Berries","Incense","Orris"],["Amber","Vanilla","Sandalwood","Pine"],["woody","fresh","resinous","sweet"],"Romantic and adventurous. Pine and incense over amber. Bohemian luxury."),
  build(10005,"Byredo","Bal d'Afrique EDP","unisex",2009,4.15,"long","moderate",["spring","summer","fall"],["Bergamot","Lemon","Cardamom","African Marigold"],["Violet","Jasmine","Cyclamen"],["Musk","Vetiver","Cedarwood"],["floral","citrus","woody","musky"],"African flowers in a Parisian context. Marigold and jasmine. Joyful and warm."),
  build(34525,"Byredo","Mojave Ghost EDP","unisex",2014,4.05,"long","moderate",["spring","summer"],["Ambrette","Sapodilla","Magnolia"],["Sandalwood","Violet","Crisp Water"],["Wood","Musk","Amberwood"],["woody","floral","musk","fresh"],"Desert ghost. Sandalwood and violet. Minimalist and mysterious."),

  // ═══ PARFUMS DE MARLY ═══
  build(30440,"Parfums de Marly","Herod EDP","male",2012,4.38,"very_long","strong",["fall","winter"],["Pepper","Cinnamon"],["Tobacco","Vanilla","Osmanthus"],["Sandalwood","Patchouli","Musk"],["warm spicy","tobacco","sweet","woody"],"Rich tobacco and vanilla with spices. Warm and masculine. A favourite for cold months."),
  build(38049,"Parfums de Marly","Greenley EDP","male",2016,3.92,"long","strong",["spring","summer","fall"],["Bergamot","Lemon"],["Geranium","Lavender","Peppermint"],["Sandalwood","Musk","Oakmoss"],["fresh","aromatic","green","woody"],"Fresh and invigorating. Minty herbs and geranium. A crowd-pleasing masculine."),
  build(38045,"Parfums de Marly","Percival EDP","male",2016,3.78,"long","moderate",["spring","summer"],["Cardamom","Ginger","Bergamot"],["Rose","Iris","Geranium"],["Vetiver","Musk","Sandalwood"],["fresh","floral","woody","aromatic"],"Refreshing floral masculine. Iris and rose with vetiver. Elegant."),
  build(30441,"Parfums de Marly","Layton EDP","unisex",2016,4.45,"very_long","enormous",["fall","winter","spring"],["Bergamot","Lavender","Apple"],["Jasmine","Geranium","Violet","Pepper"],["Sandalwood","Guaiac Wood","Vanilla","Musk"],["floral","woody","fresh spicy","sweet"],"Masterfully balanced. Sweet apple and jasmine with warm woods. Everyone's favourite."),
  build(72847,"Parfums de Marly","Oriana EDP","female",2020,4.15,"long","strong",["spring","fall"],["Bergamot","Peach","Red Pineapple"],["Violet","Heliotrope","Iris","White Musk"],["Sandalwood","White Musk","Cashmeran"],["floral","fruity","powdery","iris"],"Feminine and radiant. Peach and violet with powdery iris. Joyful elegance."),
  build(67555,"Parfums de Marly","Delina EDP","female",2017,4.42,"long","strong",["spring","summer","fall"],["Rhubarb","Lychee","Bergamot"],["Rose","Peony","Litchi"],["Musk","Cashmeran","Cedar"],["floral","fruity","rose","fresh"],"The most coveted feminine. Rose and lychee bouquet. Instagram's favourite perfume."),
  build(52059,"Parfums de Marly","Pegasus EDP","male",2011,4.35,"very_long","enormous",["fall","winter","spring"],["Bergamot","Lavender","Heliotrope"],["Almond","Jasmine","Sandalwood"],["Vanilla","White Musk","Oakmoss","Ambergris"],["sweet","woody","floral","vanilla"],"Cozy and enveloping. Almond and vanilla with a fresh lavender opener. Universally loved."),
  build(67554,"Parfums de Marly","Carlisle EDP","unisex",2016,4.08,"long","strong",["fall","winter"],["Bergamot","Lemon"],["Cinnamon","Amber","Jasmine"],["Sandalwood","Oakwood","Patchouli","Oud","Vanilla"],["woody","amber","warm spicy","oud"],"Opulent woody oriental. Dark wood and cinnamon. Statement luxury."),

  // ═══ XERJOFF ═══
  build(35513,"Xerjoff","Naxos EDP","unisex",2013,4.52,"very_long","enormous",["fall","winter"],["Bergamot","Lemon"],["Lavender","Cinnamon","Honey","Jasmine"],["Tobacco","Vanilla","Tonka Bean","Musk"],["tobacco","sweet","lavender","vanilla"],"Extraordinary tobacco honey lavender. Rich and luxurious. One of the greatest ever made."),
  build(52056,"Xerjoff","Erba Pura EDP","unisex",2019,4.32,"very_long","enormous",["spring","summer","fall"],["Bergamot","Lemon","Orange"],["Peach","Musk","Plum"],["Amber","Musk","White Musk","Vanilla"],["fruity","sweet","musk","citrus"],"Mediterranean joy. Citrus, peach and vanilla musk. Universally appealing sunshine."),
  build(64507,"Xerjoff","Uden EDP","unisex",2013,4.28,"long","strong",["fall","winter"],["Bergamot","Cardamom"],["Oud","Heliotrope","Violet"],["Sandalwood","Amber","Vetiver","Guaiac Wood"],["oud","woody","amber","sweet"],"Refined and approachable oud. Cardamom and heliotrope soften the oud. Modern luxury."),
  build(70790,"Xerjoff","Accademia EDP","unisex",2015,4.12,"long","strong",["fall","winter"],["Bergamot","Pink Pepper"],["Oud","Mastic","Gaiac"],["Amber","Guaiac Wood","Beeswax"],["woody","amber","warm spicy","resinous"],"Italian craftsmanship in a bottle. Resinous woods and spices. Collectible luxury."),

  // ═══ AMOUAGE ═══
  build(1413,"Amouage","Gold Man","male",1983,4.42,"very_long","enormous",["fall","winter"],["Bergamot","Lemon","Frankincense","Civet"],["Jasmine","Rose","Lily of the Valley","Orris"],["Civet","Oakmoss","Musk","Sandalwood","Frankincense"],["floral","aromatic","incense","earthy"],"Royal and majestic. Rose and frankincense in opulent combination. Timeless Omani luxury."),
  build(1415,"Amouage","Jubilation 25","male",2007,4.52,"very_long","enormous",["fall","winter"],["Coriander","Pepper","Blackberry","Cloves"],["Oud","Incense","Labdanum","Orris"],["Oakmoss","Musk","Amber","Patchouli"],["oud","woody","incense","spicy"],"Masterpiece of oriental perfumery. Oud and incense in complex tapestry. Incomparable."),
  build(25428,"Amouage","Interlude Man EDP","male",2012,4.45,"very_long","enormous",["fall","winter"],["Bergamot","Oregano","Cinnamon Bark"],["Oud","Incense","Amber","Sandalwood"],["Patchouli","Vetiver","Animal Notes"],["incense","oud","woody","amber"],"The most challenging Amouage. Smoky oud and incense. For the adventurous."),
  build(1414,"Amouage","Reflection Man","male",2007,4.18,"long","strong",["spring","fall"],["Bergamot","Pepper"],["Neroli","Sandalwood","Guaiac Wood"],["Vetiver","Musk","Sandalwood"],["floral","woody","fresh","citrus"],"The most accessible Amouage. Neroli and white flowers. Effortlessly refined."),
  build(18050,"Amouage","Memoir Man","male",2010,4.22,"long","strong",["fall","winter"],["Absinthe","Incense","Bergamot"],["Oud","Smoke","Amber","Labdanum"],["Leather","Musk","Patchouli"],["smoky","leather","oud","incense"],"Dark and brooding. Absinthe and leather smoke. Unforgettable intensity."),

  // ═══ JO MALONE ═══
  build(31851,"Jo Malone London","Peony & Blush Suede Cologne","unisex",2013,4.12,"moderate","moderate",["spring","summer","fall"],["Red Apple"],["Peony","Jasmine","Rose"],["Suede","White Musk"],["floral","suede","fruity","powdery"],"Velvety peony and suede. Soft and romantic. A Jo Malone bestseller."),
  build(37039,"Jo Malone London","Wood Sage & Sea Salt Cologne","unisex",2014,4.22,"moderate","moderate",["spring","summer"],["Ambrette","Sea Salt"],["Sage"],["Driftwood"],["aromatic","woody","aquatic","green"],"Wild British coastline. Sea salt and sage with driftwood. Unique and evocative."),
  build(1519,"Jo Malone London","Lime Basil & Mandarin Cologne","unisex",1999,4.02,"moderate","soft",["spring","summer"],["Lime","Mandarin"],["Basil","White Thyme"],["Vetiver","White Amber"],["citrus","green","herbal","fresh"],"Zesty and herbal classic. Lime and basil signature. The Jo Malone icon."),
  build(34510,"Jo Malone London","English Pear & Freesia Cologne","unisex",2010,4.18,"moderate","moderate",["spring","summer","fall"],["Pear","Melon"],["Freesia","Rhubarb"],["White Amber","Patchouli","Musk"],["fruity","floral","fresh","sweet"],"Autumnal harvest in a bottle. Sweet pear and delicate freesia. Beloved by many."),
  build(51484,"Hermès","Twilly d'Hermès EDP","female",2017,3.88,"long","strong",["spring","summer","fall"],["Tuberose","Ginger"],["Rose","Tuberose","Sandalwood"],["Sandalwood","White Musk","Vanilla"],["floral","white floral","warm spicy","creamy"],"Young and bold tuberose. Ginger adds unexpected spice. Vibrant Hermès femininity."),

  // ═══ HERMÈS ═══
  build(26026,"Hermès","Jour d'Hermès EDP","female",2013,3.85,"long","moderate",["spring","summer"],["Grapefruit","Blackcurrant"],["Gardenia","White Flowers"],["Musk","Vetiver"],["floral","white floral","fresh","citrus"],"Luminous white floral. Gardenia and white flowers. Quietly radiant."),
  build(74455,"Hermès","H24 EDT","male",2021,3.95,"moderate","moderate",["spring","summer","fall"],["Green Clary Sage","Narcissus"],["Elemi","Rosewood"],["White Musk"],["green","herbal","woody","fresh"],"New herbal masculinity. Sage and elemi. Contemporary and distinctive."),
  build(3422,"Hermès","Terre d'Hermès Parfum","male",2009,4.35,"very_long","strong",["fall","winter","spring"],["Grapefruit","Orange"],["Vetiver","Geranium","Benzyl Acetate"],["Vetiver","Sandalwood","Flint"],["woody","citrus","earthy","mineral"],"The definitive version of Terre. Deeper vetiver and mineral elements. A masterpiece."),
  build(15456,"Hermès","Eau de Rhubarbe Écarlate Cologne","unisex",2015,3.78,"short","soft",["spring","summer"],["Rhubarb","Red Berries"],["White Musk"],["Musk"],["fresh","fruity","musk","green"],"Crisp rhubarb tingle. Light and refreshing. Perfect for hot days."),
  build(5521,"Yves Saint Laurent","La Nuit de L'Homme EDT","male",2009,4.05,"long","strong",["fall","winter"],["Cardamom"],["Cedar","Bergamot","Iris"],["Vetiver","Coumarin","White Musk"],["aromatic","woody","warm spicy","iris"],"Seductive evening masculine. Cardamom and cedar in perfect balance. Date-night essential."),

  // ═══ VIKTOR & ROLF ═══
  build(2357,"Viktor & Rolf","Flowerbomb EDP","female",2005,4.12,"long","strong",["fall","winter"],["Bergamot","Osmanthus","Tea"],["Sambac Jasmine","Freesia","Orchid","Rose","Centifolia Rose"],["Patchouli","Musk"],["floral","sweet","oriental","powdery"],"The explosion of flowers. Jasmine, rose and patchouli. Feminine power."),
  build(19005,"Viktor & Rolf","Spicebomb EDT","male",2012,3.95,"long","strong",["fall","winter"],["Bergamot","Grapefruit"],["Elemi","Saffron","Tobacco","Cinnamon"],["Vetiver","Leather","Musk"],["fresh spicy","woody","tobacco","warm spicy"],"A fragrant grenade. Spice and tobacco with leather. Daring masculine."),
  build(35509,"Viktor & Rolf","Spicebomb Extreme EDP","male",2015,4.22,"very_long","enormous",["fall","winter"],["Red Chili"],["Tobacco","Vanilla","Cinnamon"],["Vetiver","Musk","Guaiac Wood"],["warm spicy","tobacco","sweet","woody"],"Amplified Spicebomb. Hotter and sweeter. Cold-weather powerhouse."),
  build(57488,"Viktor & Rolf","Flowerbomb Ruby Orchid","female",2020,3.92,"long","strong",["fall","winter"],["Orchid","Raspberry"],["Rose","Orchid","Plum"],["Patchouli","Musk","Amber"],["floral","fruity","sweet","amber"],"Floral and fruity dark twist on Flowerbomb. Ruby red and opulent. Bold femininity."),

  // ═══ GIVENCHY ═══
  build(62717,"Givenchy","L'Interdit EDP","female",2018,3.98,"long","strong",["fall","winter"],["Pear"],["Tuberose","Orange Blossom","White Peach"],["Patchouli","Vetiver","Ambergris"],["floral","woody","sweet","white floral"],"Forbidden luxury. Tuberose and dark patchouli. Haunting femininity."),
  build(59498,"Givenchy","Gentleman EDP Boisée","male",2021,4.08,"long","strong",["fall","winter"],["Bergamot","Iris"],["Iris","Patchouli"],["Vetiver","Cedarwood","Sandalwood"],["iris","woody","aromatic","earthy"],"The most modern Gentleman. Iris and patchouli over warm woods. Contemporary masculine."),
  build(73006,"Givenchy","Irresistible EDP","female",2021,3.95,"long","moderate",["spring","summer","fall"],["Bergamot","Rose","Luminous Accord"],["Luminous Rose","Peony"],["Sandalwood","White Musk"],["floral","fresh","rose","musk"],"Radiant and fresh rose. Light and joyful. Effortless everyday femininity."),
  build(2356,"Givenchy","Pi","male",1998,3.82,"very_long","strong",["fall","winter"],["Mandarin","Neroli","Bergamot","Tarragon"],["Heliotrope","Carnation","Clary Sage"],["Vanilla","Sandalwood","Tonka Bean","Benzyl Benzoate"],["oriental","vanilla","sweet","warm spicy"],"Sweet and complex oriental. Heliotrope and vanilla. Beloved by many since 1998."),

  // ═══ LANCÔME ═══
  build(17083,"Lancôme","La Vie est Belle EDP","female",2012,3.88,"long","strong",["fall","winter"],["Blackcurrant","Pear","Italian Iris"],["Iris","Jasmine","Orange Blossom"],["Patchouli","Praline","Vanilla","Musk"],["gourmand","floral","sweet","vanilla"],"The happiness fragrance. Iris and gourmand sweetness. Bestseller worldwide."),
  build(83,"Lancôme","Trésor EDP","female",1990,3.95,"very_long","strong",["fall","winter"],["Peach","Bergamot"],["Rose","Lilac","Heliotrope"],["Sandalwood","Vanilla","Musk","Apricot"],["floral","oriental","sweet","powdery"],"Timeless feminine. Rose and sandalwood. Classic love story."),
  build(32823,"Lancôme","La Nuit Trésor EDP","female",2015,3.85,"long","strong",["fall","winter"],["Raspberry","Bergamot","Black Rose"],["Jasmine","Rose","Vanilla"],["Patchouli","Musk","Vanilla","Licorice"],["floral","gourmand","sweet","rose"],"Darker and more sensual Trésor. Black rose and raspberry. Sensual night version."),
  build(66515,"Lancôme","Idôle EDP","female",2019,3.92,"long","strong",["spring","summer","fall"],["Bergamot"],["Rose","Jasmine"],["White Musk","Cedarwood"],["floral","fresh","musk","rose"],"The millennial rose. Clean and modern. For the new generation of women."),

  // ═══ JEAN-PAUL GAULTIER ═══
  build(52063,"Jean Paul Gaultier","Scandal EDP","female",2017,3.88,"long","strong",["fall","winter"],["Blood Orange","Honey"],["Gardenia","Patchouli"],["Vetiver"],["floral","sweet","honey","earthy"],"Scandalous honey and gardenia. Addictive and provocative. Night-out essential."),
  build(2124,"Jean Paul Gaultier","Le Male Terrible","male",2010,3.85,"long","strong",["fall","winter"],["Bergamot","Mint","Cardamom"],["Lavender","Vanilla","Tonka Bean","Iris"],["Sandalwood","Amber","Musk"],["sweet","aromatic","warm spicy","fougere"],"More intense and gourmand Le Male. Vanilla and lavender. Provocatively sweet."),
  build(39055,"Jean Paul Gaultier","Scandal pour Homme EDT","male",2021,3.78,"long","moderate",["fall","winter"],["Bergamot","Mandarin"],["Cardamom","Coriander","Tobacco"],["Vanilla","Musk","Cedarwood"],["warm spicy","tobacco","sweet","citrus"],"Seductive masculine counterpart to Scandal. Tobacco and vanilla. Confident and charming."),

  // ═══ CAROLINA HERRERA ═══
  build(66378,"Carolina Herrera","Bad Boy EDT","male",2019,3.98,"long","strong",["fall","winter"],["Bergamot","Sage","White Pepper"],["Cacao","Cashmere Wood","Black Cardamom"],["Cedar","Vetiver"],["woody","fresh spicy","aromatic","smoky"],"Duality of good and evil. Sage and cacao with smoked woods. Magnetic."),
  build(46440,"Carolina Herrera","Good Girl EDP","female",2016,4.08,"long","strong",["fall","winter"],["Coffee","Almond","Bergamot"],["Tuberose","Jasmine"],["Sandalwood","Tonka Bean","Cacao","Musk"],["floral","gourmand","sweet","coffee"],"Good girl's bad side. Coffee and tuberose in iconic stiletto bottle. Addictive."),
  build(62722,"Carolina Herrera","Bad Boy Cobalt EDP","male",2021,3.92,"long","strong",["fall","winter"],["Bergamot","Juniper"],["Cedar","Vetiver","Amber"],["Sandalwood","Musk"],["woody","amber","fresh","aromatic"],"Bolder and more intense Bad Boy. Amber and cedar. Sophisticated masculinity."),

  // ═══ HUGO BOSS ═══
  build(39062,"Hugo Boss","The Scent pour Homme EDT","male",2015,3.75,"long","strong",["fall","winter"],["Ginger","Maninka Fruit"],["Leather","Lavender"],["Cocoa","Tonka Bean"],["warm spicy","leather","sweet","aromatic"],"Magnetic and seductive. Ginger and leather. A bestseller for good reason."),
  build(39063,"Hugo Boss","The Scent for Her EDP","female",2016,3.68,"long","moderate",["fall","winter"],["Freesia","Mango"],["Rose","Peach"],["Vanilla","Patchouli","Java Vetiver"],["floral","fruity","sweet","oriental"],"Addictive fruity floral. Freesia and vanilla. Feminine magnetism."),
  build(1003,"Hugo Boss","Boss Bottled EDT","male",2001,3.72,"long","moderate",["fall","winter","spring"],["Apple","Plum","Lemon","Bergamot"],["Cinnamon","Mahogany","Geranium","Carnation"],["Vetiver","Sandalwood","Cedarwood","Vanilla"],["fresh spicy","woody","apple","aromatic"],"Classic masculine reliability. Apple and cinnamon over woods. Evergreen."),

  // ═══ AZZARO ═══
  build(46418,"Azzaro","Wanted EDT","male",2016,3.72,"long","strong",["fall","winter"],["Cardamom","Grapefruit","Lemon"],["Vetiver","Lavender","Jasmine"],["Cedarwood","Amberwood","Vetiver"],["fresh spicy","woody","citrus","aromatic"],"Western-inspired masculine. Spice and citrus with earthy base. Bold and charismatic."),
  build(15,"Azzaro","Chrome EDT","male",1996,3.72,"long","moderate",["spring","summer"],["Bergamot","Rosemary","Pineapple","Lemon","Petitgrain"],["Oakmoss","Jasmine","Cyclamen","Lily of the Valley","Coriander"],["White Musk","Sandalwood","Oakmoss","Tonka Bean","Cedar"],["fresh","aromatic","citrus","fougere"],"Reliable and fresh. Aquatic and citrus. Classic daily masculine."),
  build(46419,"Azzaro","Wanted by Night EDP","male",2017,3.85,"long","strong",["fall","winter"],["Cardamom","Grapefruit","Tobacco"],["Cedarwood","Fougere","Birch"],["Amberwood","Vanilla","Tobacco"],["tobacco","woody","warm spicy","amber"],"Darker and more intense Wanted. Tobacco and cedar. Evening powerhouse."),

  // ═══ DAVIDOFF ═══
  build(8599,"Davidoff","Adventure EDT","male",2008,3.55,"moderate","moderate",["spring","summer","fall"],["Mandarin","Bergamot","Artemisia"],["Cardamom","Rosemary","Cedarwood"],["Amber","Teak","Musk"],["fresh","woody","aromatic","citrus"],"Adventure-inspired masculine. Citrus and spice. Active lifestyle companion."),
  build(13,"Davidoff","Cool Water Woman EDT","female",1997,3.58,"moderate","moderate",["spring","summer"],["Pineapple","Black Currant","Quince"],["Lotus","Lily of the Valley","Jasmine"],["Sandalwood","Musk","Cedar"],["aquatic","fresh","floral","citrus"],"Fresh aquatic feminine. Light and clean. Beach-ready."),

  // ═══ LACOSTE ═══
  build(19003,"Lacoste","L.12.12 Blanc EDT","male",2012,3.65,"moderate","soft",["spring","summer"],["Bergamot","Grapefruit","Lemon"],["Rosemary","Thyme"],["White Musk","Sandalwood"],["fresh","citrus","aromatic","woody"],"Clean and sporty. White shirt in a bottle. Tennis court fresh."),
  build(44019,"Lacoste","Pour Femme EDP","female",2003,3.72,"moderate","moderate",["spring","summer"],["Peach","Apricot"],["Rose","Gardenia","Lily","Ylang-Ylang"],["White Musk","Sandalwood","Iris"],["floral","fruity","sweet","fresh"],"Classic sport-chic feminine. Fruity florals. Casual elegance."),

  // ═══ ISSEY MIYAKE ═══
  build(2,"Issey Miyake","L'Eau d'Issey EdT","female",1992,4.02,"moderate","moderate",["spring","summer"],["Water Lily","Cyclamen","Rose","Osmanthus","Magnolia","Calone"],["Lotus","Peony","Jasmine","Carnation","Lily of the Valley"],["Musk","Sandalwood","Civet","Amber","Oakmoss","Cedarwood"],["aquatic","floral","fresh","citrus"],"Pioneering aquatic floral. Clean water and white flowers. Changed perfumery forever."),
  build(14022,"Issey Miyake","L'Eau d'Issey pour Homme EDT","male",1994,3.88,"moderate","moderate",["spring","summer"],["Yuzu","Bergamot","Mandarin","Cyclamen"],["Sage","Jasmine","Lily","Cardamom"],["Musk","Cedarwood","Sandalwood","Amber"],["aquatic","citrus","fresh","aromatic"],"Clean masculine aquatic. Yuzu and marine notes. Timeless Japanese minimalism."),
  build(41047,"Issey Miyake","A Scent EDT","female",2009,3.78,"moderate","moderate",["spring","summer"],["Citrus","Basil"],["Green Peach","Melon"],["White Musk","Vetiver"],["green","fresh","citrus","herbal"],"Clean and natural. Green and watery. Minimalist Japanese sensibility."),

  // ═══ CALVIN KLEIN ═══
  build(3,"Calvin Klein","CK One EDT","unisex",1994,3.85,"moderate","moderate",["spring","summer"],["Bergamot","Cardamom","Pineapple","Papaya","Mandarin","Lemon"],["Jasmine","Lily of the Valley","Violet","Orris","Rose","Nutmeg"],["Amber","Musk","Sandalwood","Green Tea","Cedar"],["fresh","citrus","floral","aquatic"],"The original clean unisex. Launched a category. Universally loved."),
  build(2617,"Calvin Klein","Euphoria EDP","female",2005,3.78,"long","strong",["fall","winter"],["Lotus Flower","Persimmon","Pomegranate"],["Black Orchid","Champaca","Lotus","Violet"],["Amber","Mahogany","Blonde Wood","Black Violet","Cream"],["floral","fruity","oriental","sweet"],"Euphoric and sensual. Dark florals and sweet woods. Modern feminine classic."),
  build(2615,"Calvin Klein","Eternity Aqua for Men EDT","male",2001,3.55,"moderate","soft",["spring","summer"],["Bergamot","Watermelon"],["Aquatic Notes","Jasmine"],["Sandalwood","White Musk"],["aquatic","fresh","citrus","floral"],"Aquatic and clean. Fresh watermelon and marine notes. Carefree summer."),
  build(75044,"Calvin Klein","Defy EDT","male",2021,3.88,"long","strong",["spring","summer","fall"],["Bergamot","Lemon"],["Sage","Vetiver"],["Cedarwood","Amberwood"],["woody","fresh","aromatic","citrus"],"Athletic and modern. Sage and cedar. The new Calvin Klein era."),

  // ═══ RALPH LAUREN ═══
  build(2105,"Ralph Lauren","Romance EDP","female",1998,3.82,"long","moderate",["spring","summer","fall"],["Bergamot","Sundew","Chamomile","Marigold"],["White Rose","Magnolia","Lily"],["Musk","Sandalwood","Patchouli","Oakmoss"],["floral","fresh","white floral","woody"],"Timeless romance. White rose and magnolia. Eternally feminine."),
  build(2078,"Ralph Lauren","Polo Black EDT","male",2005,3.72,"long","moderate",["fall","winter"],["Mango","Wormwood","Patchouli","Black Pepper"],["Titanium","Oakwood","Night Blooming"],["Sandalwood","Amber","Musk"],["woody","fruity","fresh","amber"],"Dark and mysterious. Mango and wormwood. Cool and edgy."),
  build(2076,"Ralph Lauren","Polo Red EDT","male",2013,3.65,"moderate","strong",["spring","summer"],["Grapefruit","Lemon","Cranberry","Sage"],["Coffee Bean","Rose","Geranium"],["Cedarwood","Sandalwood","Amber","Musk"],["fresh","citrus","woody","aromatic"],"Sporty and vibrant. Grapefruit and cedar. Racing-inspired."),
  build(43007,"Ralph Lauren","Polo Blue EDT","male",2003,3.75,"moderate","moderate",["spring","summer"],["Cucumber","Melon","Basil","Tarragon"],["Suede","Sage"],["Musk","Mineral","Suede"],["aquatic","green","fresh","suede"],"Fresh aquatic fougère. Cucumber and sage. Clean outdoor lifestyle."),

  // ═══ MARC JACOBS ═══
  build(7008,"Marc Jacobs","Daisy EDT","female",2007,3.88,"moderate","soft",["spring","summer"],["Strawberry","Violet","Blood Grapefruit"],["Gardenia","Jasmine","Violet"],["White Woods","Musk","Vanilla"],["floral","fruity","fresh","sweet"],"Eternally fresh and girlish. Daisy and strawberry. Young and joyful."),
  build(41041,"Marc Jacobs","Decadence EDP","female",2015,3.82,"long","strong",["fall","winter"],["Italian Plum","Iris","Bulgarian Rose"],["Orris","Jasmine Sambac"],["Venetian Blonde Wood","Amber","Liquid Musks"],["floral","fruity","amber","iris"],"Dark opulence. Plum and iris with amber. Sophisticated nocturnal."),
  build(14007,"Marc Jacobs","Lola EDP","female",2009,3.65,"moderate","moderate",["spring","summer"],["Pear","Apple"],["Rose","Geranium","Peony","Velvet Violet"],["White Musk","Sandalwood","Cedar","Oakmoss"],["floral","fruity","fresh","rose"],"Playful and fresh. Pear and rose. Romantic and youthful."),

  // ═══ PACO RABANNE ═══
  build(7017,"Paco Rabanne","1 Million Parfum","male",2012,4.0,"very_long","enormous",["fall","winter"],["Grapefruit"],["Cinnamon","Rose","Amber"],["Leather","Woody Notes"],["warm spicy","leather","amber","sweet"],"More intense 1 Million. Dark amber and cinnamon. Seductive power."),
  build(38042,"Paco Rabanne","Invictus Aqua EDT","male",2015,3.68,"moderate","moderate",["spring","summer"],["Grapefruit","Sea Notes","Mandarin"],["Jasmine","Bay Laurel","Guaiac Wood"],["Patchouli","Ambergris","Oakmoss"],["aquatic","citrus","fresh","woody"],"Aquatic athlete. Sea notes and citrus. Summer sport energy."),
  build(74451,"Paco Rabanne","Phantom EDT","male",2021,3.95,"long","strong",["spring","fall","winter"],["Lemon"],["Vetiver","Lavender","Mineral"],["Norlimbanol","Musk"],["woody","fresh","aromatic","citrus"],"Futuristic masculinity. Metallic and clean. The robot-bottle icon."),
  build(40264,"Paco Rabanne","Olympéa EDP","female",2015,3.88,"long","strong",["spring","fall"],["Grapefruit","Green Mandarin"],["Jasmine Sambac","Ambergris"],["Vanilla","Cashmere Wood","Sandalwood","Musk"],["floral","vanilla","amber","citrus"],"Goddess of the sea. Jasmine and vanilla with ambergris. Olympian femininity."),

  // ═══ MONTBLANC ═══
  build(62703,"Montblanc","Explorer EDP","male",2019,3.92,"long","strong",["spring","fall"],["Pink Pepper","Bergamot","Patchouli Leaf"],["Papyrus","Vetiver"],["Amberwood","Musk","Oakmoss"],["woody","aromatic","fresh spicy","earthy"],"Explorer spirit in a bottle. Vetiver and oakmoss. Modern adventure."),
  build(17081,"Montblanc","Legend EDT","male",2011,3.78,"long","moderate",["spring","summer","fall"],["Bergamot","Lavender","Pineapple"],["Oakmoss","Geranium","Coumarin","Rose"],["Vetiver","Sandalwood","Tonka Bean","Cedarwood","Musk"],["fresh","fougere","aromatic","woody"],"Classic fougère reliability. Lavender and oakmoss. Safe crowd-pleaser."),
  build(65514,"Montblanc","Legend EDP","male",2021,4.05,"very_long","strong",["fall","winter"],["Apple","Cardamom"],["Sage","Violet","Iris"],["Sandalwood","Musk","Cedarwood","Amberwood"],["woody","aromatic","warm spicy","amber"],"Warmer and richer Legend. Cardamom and iris. Elevated everyday."),

  // ═══ NARCISO RODRIGUEZ ═══
  build(24521,"Narciso Rodriguez","Narciso EDP","female",2014,4.05,"long","strong",["fall","winter"],["Jasmine","Iris"],["Musky Notes","Rose"],["Vetiver","Sandalwood","Amber"],["floral","musk","powdery","woody"],"Clean and enveloping. Musky and floral. Modern feminine signature."),
  build(33046,"Narciso Rodriguez","Narciso Poudree EDP","female",2016,3.92,"long","moderate",["spring","fall"],["Bergamot","Jasmine"],["Rose","Orange Blossom"],["White Musk","Sandalwood","Patchouli"],["powdery","floral","musk","rose"],"The powdery version. Softer and more delicate. Romantic femininity."),
  build(1017,"Narciso Rodriguez","For Her EDT","female",2003,3.98,"long","moderate",["spring","fall"],["Rose","Osmanthus","Peach"],["Musk","Rose"],["Amber","Sandalwood","Musk"],["musk","floral","powdery","amber"],"Skin-like musk magic. Clean sensuality. A fragrance landmark."),

  // ═══ MICHAEL KORS ═══
  build(34512,"Michael Kors","Sexy Amber EDP","female",2016,3.65,"moderate","moderate",["fall","winter"],["Plum","Cardamom"],["Jasmine","Rose","Saffron"],["Amber","Vanilla","Musk","Sandalwood"],["floral","amber","warm spicy","sweet"],"Warm amber luxury. Saffron and rose. Glamorous evenings."),
  build(44041,"Michael Kors","For Men EDT","male",2000,3.55,"moderate","moderate",["spring","summer"],["Grapefruit","Mandarin","Bergamot","Cardamom"],["Vetiver","Cedarwood","Sandalwood"],["White Musk","Sandalwood","Vetiver"],["citrus","woody","fresh","aromatic"],"Clean and fresh masculine. Citrus and clean woods. Everyday luxury."),

  // ═══ JIMMY CHOO ═══
  build(17074,"Jimmy Choo","Jimmy Choo EDP","female",2011,3.72,"long","strong",["fall","winter"],["Tiger Lily","Pear","Mandarin"],["Orchid","Toffee","Jasmine","Brown Sugar"],["Patchouli","Tonka Bean","Amber","Musk"],["floral","sweet","fruity","amber"],"Sweet and seductive. Orchid and toffee. Glamorous fashion fragrance."),
  build(30434,"Jimmy Choo","Man EDT","male",2014,3.58,"moderate","moderate",["spring","summer"],["Cardamom","Pineapple","Melon"],["Sage","Lavandin","Violet Leaves"],["Suede","Patchouli","Sandalwood","White Musk"],["fresh","aromatic","fruity","woody"],"Fresh and modern masculine. Pineapple and sage. Stylish and accessible."),

  // ═══ VALENTINO ═══
  build(29700,"Valentino","Uomo EDT","male",2014,3.78,"long","strong",["fall","winter"],["Bergamot","Iris","Myrtle"],["Leather","Hawthorn"],["Musk","Patchouli","Cedarwood","Vanilla"],["leather","iris","woody","powdery"],"Italian elegance. Leather and iris. Couture in a bottle."),
  build(27694,"Valentino","Donna EDP","female",2015,3.85,"long","strong",["fall","winter"],["Bergamot","Blackberry"],["Rose","Peony","White Iris"],["Orris","Patchouli","White Musk","Blonde Wood"],["floral","rose","powdery","woody"],"Italian feminine luxury. Rose and iris. Sophisticated and refined."),
  build(62723,"Valentino","Born In Roma EDP","female",2019,3.92,"long","strong",["spring","fall"],["Bergamot","Pear"],["Jasmine","Rock Rose"],["Vetiver","Musk","Sandalwood"],["floral","fresh","woody","musk"],"Roman holiday. Jasmine and vetiver. Modern Italian femininity."),
  build(62725,"Valentino","Born in Roma Coral Fantasy","female",2021,3.88,"long","moderate",["spring","summer"],["Bergamot","Pink Pepper","Mandarin"],["Coral Rose","Grapefruit","Jasmine"],["Musk","Sandalwood","White Cedar"],["floral","citrus","fresh","musk"],"Vibrant and joyful. Coral rose and citrus. Summer Italian romance."),

  // ═══ DIPTYQUE ═══
  build(3421,"Diptyque","Philosykos EDT","unisex",1996,4.22,"moderate","moderate",["spring","summer","fall"],["Fig Leaves","Fig Bark","Green Fig"],["Green Fig","Fig Wood"],["White Cedar","Fig"],["green","woody","fresh","earthy"],"Entire fig tree captured in one perfume. Green and woody. Intellectually pleasing."),
  build(3423,"Diptyque","Do Son EDT","unisex",2005,4.0,"moderate","moderate",["spring","summer"],["Tuberose","Sea"],["Tuberose","White Flowers","Iris"],["White Musk"],["white floral","aquatic","floral","fresh"],"Sea breeze and tuberose. Vietnam coastline captured. Beautiful juxtaposition."),
  build(3424,"Diptyque","L'Ombre dans l'Eau EDT","female",1983,4.15,"moderate","moderate",["spring","summer","fall"],["Black Currant","Blackberry"],["Turkish Rose","Bulgarian Rose","Geranium"],["Sandalwood","White Musk"],["floral","green","fruity","rose"],"Rose and blackcurrant. Classic Diptyque. Serene and timeless."),
  build(3420,"Diptyque","Tam Dao EDT","unisex",2003,4.18,"long","moderate",["spring","fall","winter"],["Sandalwood","Myrtle","Cypress"],["Sandalwood","Rosewood"],["Sandalwood","Musk","White Cedar"],["woody","creamy","sandalwood","fresh"],"The purest sandalwood. Milky and warm. Meditative and calming."),

  // ═══ ACQUA DI PARMA ═══
  build(46,"Acqua di Parma","Colonia EDT","unisex",1916,4.05,"moderate","moderate",["spring","summer"],["Calabrian Bergamot","Lemon","Orange","Sweet Lime","Lavender"],["Neroli","Rose","Vetiver","Rosemary"],["Sandalwood","Vetiver","Oakmoss","Patchouli"],["citrus","aromatic","woody","floral"],"A century of Italian elegance. The original citrus cologne. Timeless refinement."),
  build(42,"Acqua di Parma","Blu Mediterraneo Arancia di Capri EDT","unisex",2003,4.0,"short","soft",["spring","summer"],["Orange","Mandarin","Grapefruit","Bergamot"],["White Flowers","Marigold"],["Sandalwood","Musk","White Musk"],["citrus","fresh","floral","aquatic"],"Capri sunshine in a bottle. Orange blossom and citrus. Pure Mediterranean joy."),
  build(18052,"Acqua di Parma","Colonia Oud EDP","unisex",2012,4.08,"long","strong",["fall","winter"],["Cardamom","Rosewood"],["Aoud","Amber"],["Oakmoss","Patchouli","Musk","White Musk"],["oud","aromatic","amber","woody"],"Luxury oud with Italian soul. Cardamom and Arabic oud. Sophisticated."),

  // ═══ PENHALIGON'S ═══
  build(51480,"Penhaligon's","Halfeti EDP","unisex",2016,4.32,"very_long","strong",["fall","winter"],["Pink Pepper","Tarragon","Saffron"],["Oud","Rose","Jasmine"],["Amber","Sandalwood","Patchouli","Benzyl Benzoate"],["oud","rose","warm spicy","amber"],"Turkish rose and oud masterpiece. Deep and complex. Captivating."),
  build(46444,"Penhaligon's","Juniper Sling EDT","male",2010,3.98,"moderate","moderate",["spring","summer","fall"],["Juniper","Lime","Gin Accord"],["Cardamom","Angelica","Coriander"],["Sandalwood","Vetiver","Amber"],["aromatic","citrus","fresh","woody"],"Inspired by Gin & Tonic. Juniper and botanicals. Unique and refreshing."),

  // ═══ ROJA DOVE ═══
  build(23436,"Roja Dove","Elysium Pour Homme","male",2017,4.42,"very_long","strong",["spring","summer","fall"],["Bergamot","Pink Pepper","Cardamom","Calabrian Bergamot"],["Geranium","Lavender","Coriander"],["Sandalwood","Amber","Cedarwood","Vetiver","Muguet"],["fresh","citrus","woody","aromatic"],"Accessible Roja masterpiece. Fresh and woody harmony. Near-universal appeal."),
  build(15454,"Roja Dove","Enigma Pour Homme","male",2015,4.35,"very_long","enormous",["fall","winter"],["Bergamot","Grapefruit"],["Jasmine","Rose","Oud"],["Patchouli","Amber","Musk","Sandalwood"],["oud","floral","amber","woody"],"Dark and complex. Oud and jasmine with patchouli. Unforgettable."),

  // ═══ KILIAN ═══
  build(17086,"Kilian","Love The Way You Feel","female",2009,4.15,"long","strong",["spring","fall"],["Cinnamon","Iris"],["Honey","White Flowers"],["Ambergris","Vanilla","Suede"],["floral","sweet","honey","warm spicy"],"Honey and iris in suede. Addictive and sensual. Luxury love."),
  build(39057,"Kilian","Black Phantom","unisex",2015,4.38,"very_long","enormous",["fall","winter"],["Rum","Brown Sugar"],["Coffee","Caramel","Jasmine","Rose"],["Sandalwood","Tonka Bean","Vetiver","Vanilla"],["gourmand","tobacco","sweet","rum"],"Dark gourmand intoxication. Rum and coffee. Forbidden pleasure."),
  build(34522,"Kilian","Good Girl Gone Bad","female",2012,4.28,"long","strong",["spring","summer","fall"],["Magnolia","Tuberose","Neroli","Jasmine","May Rose"],["Muguet","Turkish Rose"],["White Musk"],["white floral","floral","fresh","sweet"],"White flowers elevated to luxury. Tuberose and rose chorus. Feminine power."),

  // ═══ MAISON MARGIELA ═══
  build(31855,"Maison Margiela","Replica Jazz Club","unisex",2013,4.12,"long","moderate",["fall","winter"],["Pink Pepper","Vetiver","Lemon"],["Tobacco","Rum","Clary Sage"],["Vanilla","Musk","Benzoin"],["tobacco","sweet","rum","vanilla"],"Jazz bar in 1960s New York. Rum and tobacco. Atmospheric and nostalgic."),
  build(31853,"Maison Margiela","Replica Flower Market","unisex",2014,3.92,"moderate","moderate",["spring","summer"],["Peony","Rose"],["White Rose","Lily of the Valley","Orris"],["White Musk","Ambrette"],["floral","white floral","powdery","fresh"],"Parisian flower market at dawn. Fresh roses. Quiet and beautiful."),
  build(31854,"Maison Margiela","Replica By the Fireplace","unisex",2015,4.38,"long","strong",["fall","winter"],["Pink Pepper","Cloves","Orange","Grapefruit"],["Chestnut","Guaiac Wood"],["Cashmeran","Musk","Vanilla","Peru Balsam"],["smoky","woody","sweet","gourmand"],"Winter fireside in a bottle. Smoky chestnut and vanilla. Ultimate comfort scent."),
  build(52061,"Maison Margiela","Replica Sailing Day","unisex",2016,3.88,"moderate","soft",["spring","summer"],["Lemon","Green Lemon"],["Marine Notes","Cyclamen"],["White Musk","Driftwood"],["aquatic","citrus","fresh","woody"],"Open ocean sailing. Salty marine and citrus. Freedom and lightness."),

  // ═══ SISLEY ═══
  build(3419,"Sisley","Eau du Soir","female",1990,4.12,"very_long","strong",["fall","winter"],["Bergamot","Citrus","Aldehydes"],["Rose","Jasmine","Ylang-Ylang","Lily","Iris"],["Patchouli","Sandalwood","Oakmoss","Civette","Musk"],["floral","chypre","green","earthy"],"Timeless green chypre. Rose and jasmine over oakmoss. Old-world French elegance."),

  // ═══ ANNICK GOUTAL ═══
  build(77,"Annick Goutal","Petite Chérie","female",1998,3.85,"moderate","moderate",["spring","summer"],["Peach","Pear"],["Rose","Muguet","Jasmine"],["Musk","White Musk"],["fruity","floral","fresh","sweet"],"The sweetest nostalgia. Peach and lily of the valley. Delightful and carefree."),

  // ═══ LATTAFA ═══
  build(101,"Lattafa","Khamrah EDP","unisex",2021,4.38,"very_long","enormous",["fall","winter"],["Cinnamon","Cardamom","Saffron"],["Praline","Oud","Rose"],["Vanilla","Amber","Musk","Patchouli"],["gourmand","sweet","oud","warm spicy"],"Middle Eastern luxury at accessible price. Oud and praline. Addictively sweet."),
  build(102,"Lattafa","Asad EDP","male",2020,4.28,"very_long","enormous",["fall","winter"],["Saffron","Cinnamon","Cardamom"],["Oud","Rose","Geranium"],["Amber","Musk","Patchouli","Sandalwood"],["warm spicy","oud","amber","floral"],"King of beasts. Saffron and oud with spices. Powerful and majestic."),
  build(60881,"Lattafa","Raghba EDP","unisex",2019,4.22,"very_long","enormous",["fall","winter"],["Cinnamon","Saffron"],["Praline","Caramel","Vanilla"],["Amber","Musk"],["gourmand","sweet","warm spicy","amber"],"Sweet oriental indulgence. Praline and cinnamon. Irresistibly cozy."),
  build(64512,"Lattafa","Bade'e Al Oud Amethyst","unisex",2018,4.15,"very_long","strong",["fall","winter"],["Bergamot","Saffron"],["Oud","Rose","Geranium"],["Amber","Musk","Vanilla"],["oud","floral","amber","sweet"],"Amethyst oud luxury. Rose and oud. Arabian nights in a bottle."),
  build(75046,"Lattafa","Yara EDP","female",2021,4.05,"long","strong",["spring","fall"],["Lychee","Peach","Apple"],["Rose","Jasmine","Lily"],["Musk","Cedarwood","Sandalwood","Amber"],["floral","fruity","sweet","musk"],"Sweet tropical femininity. Lychee and rose. Accessible Eastern luxury."),

  // ═══ AL HARAMAIN ═══
  build(111,"Al Haramain","L'Aventure EDP","male",2019,4.18,"very_long","enormous",["fall","winter"],["Black Pepper","Cardamom","Grapefruit"],["Oud","Tobacco","Geranium"],["Amber","Vanilla","Musk"],["oud","warm spicy","tobacco","amber"],"Aventus-inspired powerhouse. Smoky fruit and oud. Best clone on market."),
  build(112,"Al Haramain","Amber Oud Gold Edition","unisex",2019,4.25,"very_long","enormous",["fall","winter"],["Cardamom","Bergamot","Cloves"],["Rose","Incense","Oud"],["Amber","Vanilla","Musk","Sandalwood"],["oud","amber","sweet","warm spicy"],"Golden oriental luxury. Amber and oud. Rich and opulent."),
  build(60882,"Al Haramain","Magnificent Oud","male",2017,4.08,"very_long","strong",["fall","winter"],["Bergamot"],["Oud","Rose"],["Sandalwood","Amber","Musk"],["oud","woody","amber","rose"],"Pure oud magnificence. Arabic heritage in a bottle. Majestic and dignified."),

  // ═══ RASASI ═══
  build(104,"Rasasi","Daarej","unisex",2011,4.35,"very_long","enormous",["fall","winter"],["Cinnamon","Cumin","Bergamot"],["Oud","Sandalwood","Myrrh"],["Amber","Patchouli","Musk"],["oud","warm spicy","amber","woody"],"Old-world Arabian luxury. Oud and spices in ancient harmony. Precious."),
  build(35511,"Rasasi","Junoon EDP","male",2011,3.95,"long","strong",["fall","winter"],["Bergamot","Spices"],["Tobacco","Oud"],["Sandalwood","Amber","Musk"],["tobacco","oud","amber","warm spicy"],"Arabian tobacco and oud. Rich and masculine. Night-time luxury."),

  // ═══ SWISS ARABIAN ═══
  build(44038,"Swiss Arabian","Shaghaf Oud Abyad","unisex",2017,4.12,"very_long","strong",["fall","winter"],["Bergamot","Grapefruit"],["White Oud","Spices"],["Amber","White Musk","Sandalwood"],["oud","woody","amber","citrus"],"Clean white oud. Grapefruit and sandalwood. Modern Arabic luxury."),
  build(35512,"Swiss Arabian","Wardi EDP","female",2016,4.18,"long","strong",["spring","fall"],["Bergamot","Lemon"],["Rose","Raspberry","Peach"],["Sandalwood","Musk","Amber"],["floral","fruity","sweet","rose"],"Sweet rose femininity. Raspberry and rose. Joyful Eastern luxury."),

  // ═══ AFNAN ═══
  build(103,"Afnan","9 PM EDP","male",2019,4.32,"very_long","enormous",["fall","winter"],["Bergamot","Apple","Pineapple"],["Cinnamon","Cardamom"],["Amber","Vanilla","Musk","Patchouli"],["sweet","warm spicy","fruity","amber"],"Best Invictus clone. Apple and cinnamon over warm amber. Excellent value."),
  build(60880,"Afnan","Supremacy Black EDP","unisex",2017,4.15,"very_long","strong",["fall","winter"],["Bergamot","Cardamom"],["Oud","Saffron","Rose"],["Amber","Sandalwood","Musk"],["oud","warm spicy","floral","amber"],"Dark and intense oriental. Oud and saffron. Bold statement."),

  // ═══ MAISON ALHAMBRA ═══
  build(115,"Maison Alhambra","Jean Lowe Immortal EDP","unisex",2020,4.05,"very_long","enormous",["fall","winter"],["Apple","Pineapple","Cardamom"],["Tobacco","Cinnamon"],["Amber","Vanilla","Musk"],["gourmand","sweet","warm spicy","fruity"],"Incredible tobacco-vanilla inspired by niche houses. Rich and addictive."),
  build(116,"Maison Alhambra","Amber Elixir EDP","female",2019,4.08,"very_long","strong",["fall","winter"],["Bergamot","Peach"],["Jasmine","Rose"],["Amber","Sandalwood","Musk","Vanilla"],["amber","floral","sweet","vanilla"],"Sweet amber floral. Peach and jasmine over vanilla amber. Opulent."),

  // ═══ ZARA ═══
  build(106,"Zara","Red Temptation EDP","female",2023,4.12,"long","strong",["fall","winter"],["Cherry","Plum","Bergamot"],["Cherry","Rose"],["Amber","Vanilla","Musk"],["fruity","sweet","floral","amber"],"Budget luxury. Cherry and amber. Shockingly good for the price."),
  build(107,"Zara","Wonder Rose EDP","female",2022,3.92,"long","moderate",["spring","fall"],["Lychee","Bergamot"],["Rose","Peony"],["Musk","Sandalwood","Amber"],["floral","fruity","sweet","rose"],"Affordable rose luxury. Lychee and rose. Surprising quality."),

  // ═══ JEAN PAUL GAULTIER classic ═══
  build(34519,"Jean Paul Gaultier","Ultra Male EDT","male",2015,4.15,"very_long","enormous",["fall","winter"],["Pear","Black Lavender"],["Vanilla","Patchouli","Iris"],["Amber","Musk","Wood"],["sweet","fougere","fruity","warm spicy"],"Super-charged Le Male. Pear and vanilla. Sweet beast. Crowd-destroyer."),

  // ═══ MUGLER ═══
  build(185,"Mugler","Angel EDP","female",1992,3.98,"very_long","enormous",["fall","winter"],["Melon","Coconut","Mandarin"],["Honey","Jasmine","Plum","Lily of the Valley"],["Patchouli","Vanilla","Musk","Caramel","Chocolate"],["gourmand","sweet","floral","patchouli"],"The first gourmand fragrance. Changed perfumery forever. Love it or hate it."),
  build(2619,"Mugler","Alien EDP","female",2005,4.05,"very_long","enormous",["fall","winter"],["Aldehydes","Solar Notes"],["Jasmine","Cashmeran"],["White Amber","White Musk","Cashmere"],["floral","woody","amber","musk"],"Other-worldly white amber. Jasmine and white mineral woods. Unforgettable."),
  build(2124,"Mugler","A*Men EDT","male",1996,3.88,"very_long","enormous",["fall","winter"],["Mint","Coffee","Caramel","Patchouli"],["Patchouli","Lavender"],["Musk","Vanilla","Tar","Sandalwood"],["gourmand","patchouli","sweet","coffee"],"Rebellious masculine gourmand. Tar, coffee and patchouli. Cult classic."),
  build(35508,"Mugler","Alien Man EDT","male",2018,3.75,"long","strong",["fall","winter"],["Cardamom","Bergamot","Nagarmotha"],["Cashmeran","Amberwood"],["White Amber","White Musk","Amberwood"],["woody","amber","fresh spicy","musk"],"Masculine interpretation of Alien. Woody amber. Modern and edgy."),

  // ═══ COACH ═══
  build(54009,"Coach","Floral EDT","female",2017,3.72,"moderate","moderate",["spring","summer"],["Pink Tea Rose","Pink Magnolia"],["Jasmine","Peony"],["White Cedarwood","White Musk"],["floral","fresh","rose","musk"],"Accessible floral luxury. Pink rose and jasmine. New York feminine charm."),

  // ═══ DKNY ═══
  build(2619,"DKNY","Be Delicious EDP","female",2004,3.78,"moderate","moderate",["spring","summer"],["Grapefruit","Cucumber","Magnolia","Violet","Apple"],["Violet","Jasmine","Rose","Muguet"],["Sandalwood","White Musk","Blonde Wood"],["floral","fresh","green","citrus"],"Crisp New York apple. Cucumber and apple over jasmine. Urban freshness."),

  // ═══ LANVIN ═══
  build(7010,"Lanvin","Eclat d'Arpège EDP","female",2002,3.72,"long","moderate",["spring","summer","fall"],["Pear","Bergamot"],["Peony","Rose","Apricot"],["Musk","Cedarwood","White Musk"],["floral","fruity","fresh","powdery"],"Light and radiant. Peony and pear. Effortlessly feminine French elegance."),
  build(7011,"Lanvin","Jeanne Lanvin EDP","female",2008,3.78,"long","moderate",["spring","fall"],["Peach","Freesia","Bergamot"],["Rose","Peony","Jasmine"],["Musk","Sandalwood","Cedarwood"],["floral","fruity","sweet","rose"],"Romantic and classic. Peach and rose. Traditional French femininity."),

  // ═══ NINA RICCI ═══
  build(80,"Nina Ricci","L'Air du Temps EDT","female",1948,4.15,"long","moderate",["spring","summer"],["Aldehydes","Bergamot","Gardenia"],["Carnation","Rose","Iris","Ylang-Ylang","Jasmine"],["Sandalwood","Civet","Musk","Benzyl Benzoate"],["floral","powdery","green","aldehydic"],"One of the great classics. Carnation and rose. Timeless post-war elegance."),
  build(2616,"Nina Ricci","Nina EDP","female",2001,3.55,"moderate","soft",["spring","summer"],["Apple","Lemon","Bergamot"],["Jasmine","Peony","Lily","Orange Blossom"],["Musk","Sandalwood","White Musk"],["floral","fruity","sweet","fresh"],"Fairy tale apple. Sweet and innocent. Youthful charm."),

  // ═══ DOLCE & GABBANA additional ═══
  build(60861,"Dolce & Gabbana","The Only One EDP","female",2018,4.05,"long","strong",["fall","winter"],["Bergamot","Pear","Black Currant"],["Iris","Violet","Cherry"],["Patchouli","Vanilla","Sandalwood","Coffee"],["floral","gourmand","warm spicy","iris"],"Edgy and addictive. Iris and coffee. The irresistible feminine."),
  build(66378,"Dolce & Gabbana","K by Dolce & Gabbana EDP","male",2019,3.88,"long","strong",["fall","winter"],["Cardamom","Clary Sage","Bergamot"],["Vetiver","Tonka Bean","Sandalwood"],["Amber","Vetiver","Musk"],["woody","aromatic","amber","warm spicy"],"Modern Italian king. Cardamom and vetiver. Noble and confident."),

  // ═══ VIKTOR & ROLF additional ═══
  build(39264,"Viktor & Rolf","Good Fortune EDP","female",2021,3.95,"long","moderate",["spring","summer","fall"],["Bergamot","Jasmine Bud"],["Jasmine","Sambac","Ylang-Ylang"],["Sandalwood","Musk","Patchouli"],["floral","white floral","sweet","woody"],"Optimistic white floral. Jasmine and sandalwood. The lucky scent."),

  // ═══ HUGO (Hugo Boss sub-brand) ═══
  build(19006,"Hugo Boss","Hugo Man EDT","male",1995,3.65,"moderate","moderate",["spring","summer"],["Apple","Basil","Mint","Spearmint","Juniper Berries"],["Geranium","White Flowers","Coriander","Rosemary"],["Musk","Cedarwood","Oakmoss","Sandalwood","Castoreum"],["fresh","green","fougere","aromatic"],"The classic fresh green. Apple and mint. Clean and reliable masculine."),

  // ═══ ELIZABETH ARDEN ═══
  build(45,"Elizabeth Arden","Green Tea EDT","female",1999,3.72,"short","soft",["spring","summer"],["Bergamot","Orange","Rhubarb","Mint","Eucalyptus"],["Green Tea","Fennel","Carnation","Lily","Jasmine"],["Musk","Oakmoss","Amber","Celery"],["fresh","green","citrus","herbal"],"The original green tea fragrance. Clean and refreshing. Timeless accessible."),

  // ═══ BVLGARI ═══
  build(79,"Bvlgari","Eau Parfumée au Thé Vert","unisex",1992,4.18,"short","soft",["spring","summer"],["Black Currant","Chinese Tea","Exotic Spices","Fruit"],["Cardamom","Pepper","Watermelon","Brazilian Rosewood"],["Musk","Sandalwood","White Musk","Iris"],["green","citrus","fresh","aromatic"],"Reinvented what a fragrance could be. Green tea and spices. Sophisticated minimalism."),
  build(17085,"Bvlgari","Aqva Pour Homme","male",2005,3.75,"moderate","moderate",["spring","summer"],["Bergamot","Posidonia Seagrass"],["Neptun Mineral Sea Notes","Coriander"],["White Musk","Wood"],["aquatic","citrus","fresh","marine"],"Deep sea masculinity. Marine and mineral. Fresh and cool."),
  build(44020,"Bvlgari","Omnia Crystalline EDT","female",2005,3.68,"short","soft",["spring","summer"],["Lotus","Cassia","Bamboo"],["Lotus","Bamboo","White Cedar","Tea"],["White Musk","Wood"],["fresh","floral","woody","green"],"Crystal clear freshness. Lotus and bamboo. Clean and transparent."),

  // ═══ CARTIER ═══
  build(14021,"Cartier","Déclaration EDT","male",1998,4.05,"long","moderate",["fall","spring"],["Cardamom","Orange","Cumin","Bergamot"],["Woody Notes","Iris","Vetiver","Cedar"],["White Musk","Sandalwood","Vetiver"],["spicy","woody","citrus","iris"],"Distinctive spiced masculinity. Cardamom and cedarwood. Intellectual and refined."),
  build(47773,"Cartier","Pasha de Cartier","male",1992,3.88,"long","strong",["fall","winter"],["Coriander","Lavender","Eucalyptus"],["Jasmine","Cedar","Sandalwood"],["Amber","Oak","Musk","Civet"],["fougere","aromatic","woody","amber"],"Classic fougère elegance. Lavender and oakwood. Timeless French masculinity."),

  // ═══ GUERLAIN ═══
  build(46,"Guerlain","Shalimar EDP","female",1925,4.28,"very_long","enormous",["fall","winter"],["Bergamot","Lemon","Citrus"],["Jasmine","Rose","Iris","Orris"],["Civet","Opoponax","Tonka Bean","Amber","Benzyl Benzoate"],["oriental","floral","vanilla","sweet"],"The mother of all oriental fragrances. Rose and vanilla. A century of seduction."),
  build(2753,"Guerlain","Mon Guerlain EDP","female",2017,3.92,"long","moderate",["spring","summer","fall"],["Lavender","Bergamot"],["Lavender","Sambac Jasmine"],["Sandalwood","Tonka Bean","Vanilla","Cashmeran"],["sweet","floral","lavender","vanilla"],"Inspired by Angelina Jolie. Lavender and vanilla. Romantic and soft."),
  build(3410,"Guerlain","La Petite Robe Noire EDP","female",2012,3.82,"long","moderate",["spring","fall"],["Bergamot","Anise","Black Currant"],["Rose","Almond","Cherry"],["Iris","Musk","Benzyl Benzoate"],["floral","fruity","sweet","cherry"],"Little black dress in a bottle. Cherry and rose. Parisian chic."),
  build(1419,"Guerlain","L'Homme Idéal EDP","male",2016,4.05,"long","strong",["fall","winter"],["Bergamot","Grapefruit"],["Lavender","Almond","Coffee"],["Vanilla","Tonka Bean","Leather","Cedarwood"],["sweet","aromatic","coffee","warm spicy"],"Sweet and seductive masculine. Coffee and almond with leather. The perfect man."),
  build(1417,"Guerlain","Habit Rouge EDT","male",1965,4.22,"very_long","strong",["fall","winter"],["Bergamot","Lemon","Mandarin","Verbena"],["Rose","Jasmine","Carnation","Ylang-Ylang","Cinnamon"],["Civet","Labdanum","Sandalwood","Oakmoss","Amber"],["oriental","floral","spicy","earthy"],"The original powdery masculine oriental. Rose and sandalwood. Historic masterpiece."),

  // ═══ CHLOÉ ═══
  build(14020,"Chloé","Chloé EDP","female",2008,3.88,"long","strong",["spring","summer","fall"],["Peony","Sweet Pea","Lychee"],["Magnolia","Lily of the Valley","Freesia","Rose"],["Amber","Cedar","Virginia Cedar","Musk"],["floral","white floral","powdery","fresh"],"The feminine ideal. Rose and peony. Gentle and romantic."),
  build(34516,"Chloé","Nomade EDP","female",2018,3.82,"long","moderate",["spring","fall"],["Freesia","Oakmoss","Mirabelle"],["Freesia","Oakmoss","Jasmine"],["Sandalwood","Musk","Peach"],["floral","woody","chypre","fruity"],"Modern chypre femininity. Freesia and oakmoss. Free-spirited and elegant."),
  build(62720,"Chloé","Rose Naturelle EDP","female",2022,3.78,"long","moderate",["spring","summer"],["Bergamot","Lemon","Violet"],["Bulgarian Rose","Sambac Jasmine"],["Cedarwood","White Musk","Sandalwood"],["floral","rose","fresh","woody"],"Ethically sourced rose. Pure and radiant. Sustainable luxury."),

  // ═══ LANCOME additional ═══
  build(74453,"Lancôme","La Vie est Belle Intensément EDP","female",2021,3.95,"very_long","strong",["fall","winter"],["Blackcurrant","Grapefruit"],["Iris","Jasmine","Orange Blossom"],["Patchouli","Praline","Vanilla","Musk"],["gourmand","floral","sweet","amber"],"The most intense La Vie est Belle. Richer and warmer. Winter comfort scent."),

  // ═══ BURBERRY additional ═══
  build(60867,"Burberry","Her Intense EDP","female",2021,3.92,"very_long","strong",["fall","winter"],["Red Berries","Blackberry"],["Jasmine","Rose","Iris","Violet"],["Dry Amber","Musk","Sandalwood"],["fruity","floral","amber","sweet"],"More intense Her. Deeper amber and darker berries. Confident femininity."),

  // ═══ VERSACE additional ═══
  build(23042,"Versace","Versense EDT","female",2009,3.65,"moderate","soft",["spring","summer"],["Sea Breeze","Galbanum","Orange","Green Tea","Mandarin"],["Jasmine","Lily","Neroli"],["Musk","Sandalwood"],["aquatic","fresh","floral","citrus"],"Mediterranean freshness. Sea and citrus. Summer casual feminine."),

  // ═══ BENEFIT additional entries ═══
  build(23040,"Clinique","Happy EDT","female",1997,3.72,"short","soft",["spring","summer"],["Grapefruit","Bergamot","Ruby Grapefruit"],["Water Hyacinth","Mandarin","Magnolia"],["White Musk","White Amber"],["citrus","floral","fresh","fruity"],"Pure happiness bottled. Grapefruit and white flowers. Effortlessly cheerful."),
  build(2100,"Lanvin","Arpège EDP","female",1927,4.15,"very_long","strong",["fall","winter"],["Aldehydes","Bergamot","Neroli"],["Rose","Jasmine","Lily of the Valley","Iris"],["Sandalwood","Vetiver","Civet","Musk","Amber"],["floral","aldehydic","powdery","classic"],"A grandmother of fragrance. Aldehydic floral. Timeless French femininity from 1927."),

  // ═══ DUNHILL ═══
  build(2104,"Dunhill","Desire Blue EDT","male",2002,3.62,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Citrus"],["Lavender","Jasmine","Violet"],["Musk","Cedarwood","Sandalwood"],["fresh","aromatic","citrus","woody"],"Classic British fresh masculine. Citrus and lavender. Understated elegance."),

  // ═══ DOLCE & GABBANA pour Homme ═══
  build(2629,"Dolce & Gabbana","Pour Homme EDT","male",1994,3.88,"long","moderate",["fall","winter","spring"],["Bergamot","Lemon","Lavender"],["Tobacco","Cardamom","Iris"],["Amber","Cigar","Musk","Sandalwood"],["tobacco","aromatic","woody","amber"],"Original Italian tobacco masculine. Lavender and tobacco. Timeless Italian style."),

  // ═══ CELINE ═══
  build(66511,"Celine","Parade EDP","unisex",2019,4.28,"long","moderate",["spring","summer","fall"],["Iris","Orange Blossom"],["Iris","Benzyl Acetate"],["White Musk","Vetiver"],["iris","white floral","fresh","powdery"],"Minimalist Parisian iris. Clean and sophisticated. Quiet luxury."),

  // ═══ MAISON MARGIELA additional ═══
  build(57492,"Maison Margiela","Replica Beach Walk EDT","unisex",2017,3.98,"moderate","soft",["spring","summer"],["Lemon","Bergamot","Ylang-Ylang"],["Coconut Milk","Jasmine"],["Sandalwood","White Musk","Ambrette Seeds"],["citrus","coconut","floral","fresh"],"Barefoot on warm sand. Coconut and citrus. Sensory holiday memory."),
  build(74456,"Maison Margiela","Replica Autumn Vibes EDP","unisex",2020,4.12,"long","moderate",["fall","winter"],["Bergamot","Clary Sage"],["Patchouli","Leather"],["Sandalwood","Amber","Musk"],["smoky","leather","woody","aromatic"],"Autumn leaves and leather. Atmospheric and moody. Perfect for cozy days."),

  // ═══ CHANEL additional ═══
  build(46443,"Chanel","Jersey EDT","female",2011,3.85,"long","moderate",["spring","fall"],["Bourbon Vanilla","Coumarin","Vetiver","Tonka Bean"],["White Flowers"],["Vetiver","Musk","Amber"],["floral","vanilla","sweet","woody"],"Soft and luminous. White flowers over vanilla. Quiet Chanel sophistication."),
  build(1420,"Chanel","Pour Monsieur EDT","male",1955,4.28,"moderate","moderate",["spring","fall"],["Bergamot","Lemon","Cardamom","Neroli","Coriander"],["Petitgrain","Lily of the Valley","Jasmine"],["Vetiver","White Musk","Oakmoss","Sandalwood","Labdanum"],["aromatic","citrus","chypre","woody"],"The epitome of classic French masculinity. Citrus chypre. Timeless refinement."),

  // ═══ DOLCE & GABBANA additional light ═══
  build(14030,"Dolce & Gabbana","Anthology L'Amoureux 6","male",2009,3.68,"moderate","moderate",["spring","summer"],["Iris","Bergamot","Neroli"],["Amber","Cedar"],["White Musk","Sandalwood"],["iris","woody","fresh","citrus"],"Artistic collector edition. Iris and cedar. Men who appreciate art."),

  // ═══ BURBERRY additional ═══
  build(33040,"Burberry","Body EDP","female",2011,3.72,"long","moderate",["fall","winter"],["Peach","Freesia","Bergamot"],["Iris","Orris","Rose","Jasmine"],["Amber","Musk","Sandalwood","Cashmere"],["floral","fruity","amber","powdery"],"Cozy British femininity. Peach and cashmere. Wrap-around comfort."),

  // ═══ GIVENCHY additional ═══
  build(2356,"Givenchy","Gentleman Paris EDT","male",2018,3.82,"long","moderate",["fall","winter","spring"],["Bergamot","Iris","Patchouli","Pink Pepper"],["Iris","Vetiver","Patchouli"],["Cedarwood","Sandalwood","Vetiver"],["iris","woody","fresh spicy","aromatic"],"Updated classic. Iris and patchouli. Modern French gentleman."),
  build(5526,"Givenchy","Ange ou Démon EDP","female",2006,3.88,"long","strong",["fall","winter"],["Aldehydes","Oak Bark","White Narcissus"],["Jasmine","Lily","Magnolia","White Flowers"],["White Musk","Cashmere","Sandalwood"],["floral","white floral","powdery","aldehyde"],"Angel and demon duality. White flowers and oakwood. Mysterious femininity."),

  // ═══ Roja Dove additional ═══
  build(34524,"Roja Dove","Creation-E","female",2010,4.48,"very_long","enormous",["fall","winter"],["Bergamot","Grapefruit","Orange","Lemon"],["Jasmine","Rose","Lily","Violet","Iris","Ylang-Ylang"],["Patchouli","Amber","Musk","Sandalwood","Vetiver"],["floral","oriental","sweet","powdery"],"Opulence in its purest form. A symphony of florals. The height of niche luxury."),

  // ═══ BYREDO additional ═══
  build(43008,"Byredo","Super Cedar EDP","unisex",2014,3.98,"long","moderate",["fall","winter","spring"],["Bergamot","Pink Pepper"],["Orris","Cyclamen","Rose Water","Rosewater"],["Cedarwood","Musk","Vetiver"],["woody","floral","musk","fresh"],"The perfect cedar. Woody and floral. Minimal Scandinavian masterpiece."),
  build(51482,"Byredo","Pulp EDP","unisex",2016,4.02,"long","moderate",["spring","summer"],["Bergamot","Papaya","Fig","Black Currant"],["Orris","Cassis","White Cedar"],["Musk","Sandalwood","Vetiver"],["fruity","floral","green","woody"],"Tropical pulp fantasy. Fig and papaya. Fresh and exotic."),

  // ═══ CHLOÉ additional ═══
  build(17088,"Chloé","L'Eau de Chloé EDT","female",2012,3.75,"short","soft",["spring","summer"],["Bergamot","Lemon","Rose"],["Rose","Rose Water","Peony"],["White Musk","Cedar"],["floral","rose","fresh","aquatic"],"Lighter Chloé. Watery rose and citrus. Perfect for summer."),

  // ═══ STELLA MCCARTNEY ═══
  build(2631,"Stella McCartney","Stella EDP","female",2003,3.78,"long","moderate",["spring","summer","fall"],["Peony","Mandarin","Bergamot"],["Ambient Rose","Lotus"],["Musk","Amber","White Wood"],["floral","rose","fresh","woody"],"Conscious luxury. Peony and rose. Sustainably minded femininity."),

  // ═══ ALEXANDER WANG ═══
  build(41044,"Alexander Wang","Eau de Cologne","female",2017,3.62,"short","soft",["spring","summer"],["Grapefruit","Bergamot","Petitgrain"],["White Musk","Vetiver"],["White Musk","Sandalwood"],["fresh","citrus","musk","woody"],"Minimalist and modern. Clean citrus. Fashion-forward."),

  // ═══ DSQUARED2 ═══
  build(34526,"Dsquared2","He Wood Rocky Mountain Wood","male",2011,3.68,"long","moderate",["fall","winter","spring"],["Violet"],["Vetiver","Juniper","Saffron"],["Sandalwood","Cedarwood","Patchouli"],["woody","aromatic","earthy","spicy"],"Rocky outdoor masculine. Vetiver and cedar. Canadian wilderness."),
];

// ─── Merge ve kaydet ──────────────────────────────────────────────────────────
const existing = JSON.parse(readFileSync(DATA_PATH, "utf-8"));
console.log(`Mevcut parfüm sayısı: ${existing.length}`);

const seen = new Map();
for (const p of existing) {
  const key = `${p.brand}|${p.name}`.toLowerCase().trim();
  seen.set(key, true);
}

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

// ID yeniden ata
merged.forEach((p, i) => { p.id = String(i + 1); });

writeFileSync(DATA_PATH, JSON.stringify(merged, null, 2), "utf-8");
console.log(`Eklenen yeni parfüm: ${added}`);
console.log(`Toplam parfüm: ${merged.length}`);
