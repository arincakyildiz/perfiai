/**
 * Part 5 – 3000 hedefini kapat (~1300 yeni)
 */
import{readFileSync,writeFileSync}from"fs";
import{join,dirname}from"path";
import{fileURLToPath}from"url";
const __dirname=dirname(fileURLToPath(import.meta.url));
const DATA=join(__dirname,"../data/perfumes.json");

const ATR={"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","musky":"misk","woody":"odunsu","lavender":"lavanta","herbal":"bitkisel","floral":"çiçeksi","white floral":"beyaz çiçek","sweet":"tatlı","powdery":"pudralı","fruity":"meyveli","rose":"gül","jasmine":"yasemin","iris":"iris","aquatic":"deniz","vanilla":"vanilya","gourmand":"gurme","oud":"oud","oriental":"oryantal","earthy":"toprak","smoky":"dumanlı","leather":"deri","creamy":"kremsi","sandalwood":"sandal ağacı","patchouli":"paçuli","tobacco":"tütün","honey":"bal","incense":"tütsü","green":"yeşil/taze","resinous":"reçineli","balsamic":"balsam","coconut":"hindistancevizi","caramel":"karamel","coffee":"kahve","tea":"çay","mossy":"yosunlu","marine":"deniz","chypre":"chypre","fougere":"fougère","pepper":"biber","cedar":"sedir","vetiver":"vetiver","musk":"misk","mint":"nane","animalic":"hayvani","cinnamon":"tarçın","fig":"incir","cherry":"kiraz","almond":"badem","rum":"rom","suede":"süet","metallic":"metalik","marine ":"deniz"};
const GT={male:"erkeklere özel",female:"kadınlara özel",unisex:"uniseks"};
const ST={spring:"ilkbahar",summer:"yaz",fall:"sonbahar",winter:"kış"};
const LT={short:"kısa süreli kalıcılık",moderate:"orta düzey kalıcılık",long:"uzun süre kalıcılık",very_long:"çok uzun süre kalıcılık"};
const ST2={soft:"hafif iz",moderate:"orta güçte iz",strong:"güçlü iz",enormous:"çok güçlü iz"};

function gtr(p){
  const ac=(p.accords||[]).slice(0,3).map(a=>ATR[a.toLowerCase()]||a);
  const g=GT[p.gender]||"herkes için";const ss=p.season||[];
  const lo=LT[p.longevity],si=ST2[p.sillage];const pts=[];
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
// ════ HERMÈS JARDIN serisi ════
b(9052,"Hermès","Un Jardin après la Mousson EDT","unisex",2008,3.85,"moderate","soft",["spring","summer"],["Ginger","Green Mango","Vegetable Notes"],["Coriander","Carrot","Rice"],["Sandalwood","White Musk"],["green","spicy","earthy","fresh"],"After monsoon calm. Ginger and carrot. Humid and contemplative."),
b(39267,"Hermès","Un Jardin à Cythère EDT","unisex",2016,3.88,"moderate","moderate",["spring","summer"],["Pistachio","Bergamot","Lemon"],["Jasmine","Fig","Clover"],["Sandalwood","Musk"],["floral","green","fruity","fresh"],"Cythère island garden. Pistachio and jasmine. Mediterranean poetry."),
b(57516,"Hermès","Un Jardin sur la Lagune EDT","unisex",2019,3.82,"moderate","soft",["spring","summer"],["Magnolia","Bergamot"],["Magnolia","Freesia","Cashmeran"],["White Musk","Sandalwood"],["floral","fresh","musk","woody"],"Venice lagoon garden. Magnolia and cashmeran. Serene and watery."),
b(62692,"Hermès","Twilly d'Hermès Bow Wow EDP","unisex",2021,3.78,"long","moderate",["spring","summer"],["Bergamot","Mandarin","Pepper"],["Tuberose","Magnolia"],["Sandalwood","White Musk"],["floral","spicy","warm spicy","fresh"],"Bow wow Twilly. Spicy tuberose. Playful and bold."),
b(74485,"Hermès","Hermessence Cardamusc EDP","unisex",2015,4.22,"long","moderate",["spring","fall"],["Cardamom","Bergamot"],["Cardamom","Musk","Iris"],["White Musk","Sandalwood"],["musk","spicy","iris","fresh"],"Cardamom musk. Clean and spiced. Niche Hermès perfection."),
b(74486,"Hermès","Hermessence Muguet Porcelaine EDP","female",2011,4.15,"long","moderate",["spring","summer"],["Bergamot","Muguet"],["Lily of the Valley","Jasmine","Iris"],["White Musk","Sandalwood"],["white floral","floral","fresh","musk"],"Porcelain muguet. Lily of the valley. Fragile and beautiful."),

// ════ TOM FORD extended Private Blend ════
b(15440,"Tom Ford","Oud Minerale EDP","unisex",2016,4.08,"long","strong",["fall","winter"],["Bergamot","Calone"],["Oud","Sea Salt","Vetiver"],["Musk","Sandalwood","Ambergris"],["oud","aquatic","amber","woody"],"Mineral sea oud. Calone and oud. Ocean depth luxury."),
b(38036,"Tom Ford","Noir de Noir EDP","unisex",2007,4.25,"long","strong",["fall","winter"],["Black Rose","Saffron","Bergamot"],["Black Orchid","Vanilla","Patchouli"],["Sandalwood","Musk","Vetiver","Truffle","Oud"],["floral","sweet","earthy","amber"],"Blackest night. Rose and truffle. The darkest Tom Ford."),
b(38035,"Tom Ford","Lavender Palm EDP","unisex",2021,3.98,"long","moderate",["spring","summer"],["Bergamot","Lavender"],["Coconut","Lavender","Iris"],["Sandalwood","White Musk"],["lavender","coconut","fresh","creamy"],"Tropical lavender. Coconut and iris. California dreaming."),
b(46451,"Tom Ford","Metallique EDP","female",2018,3.92,"long","moderate",["spring","fall"],["Bergamot","Neroli","Pink Pepper"],["Tuberose","Iris"],["White Musk","Cedarwood","Ambergris"],["floral","metallic","spicy","musk"],"Metallic tuberose. Pink pepper and iris. Futuristic femininity."),
b(52083,"Tom Ford","Sole Mio EDP","unisex",2020,4.02,"long","moderate",["spring","summer"],["Bergamot","Lemon","Basil"],["Neroli","Ylang-Ylang","Orange Blossom"],["Sandalwood","White Musk","Amber"],["citrus","floral","fresh","musk"],"My sun. Basil and neroli. Mediterranean joy."),
b(57517,"Tom Ford","Plum Japonais EDP","unisex",2013,4.18,"long","strong",["fall","winter"],["Plum","Bergamot","Black Pepper"],["Osmanthus","Lotus","Oolong Tea"],["Sandalwood","Amber","Musk","Oud"],["fruity","floral","tea","amber"],"Japanese plum. Osmanthus and oolong. Eastern sophistication."),
b(57518,"Tom Ford","Shanghai Lily EDP","female",2011,3.98,"long","strong",["fall","winter"],["Red Pepper","Bergamot","Magnolia"],["Lily","Saffron","Jasmine"],["Sandalwood","Amber","Patchouli"],["floral","spicy","woody","oriental"],"Shanghai exoticism. Lily and saffron. Far East luxury."),

// ════ GUERLAIN extended ════
b(52084,"Guerlain","Aqua Allegoria Herba Fresca EDT","unisex",1999,3.82,"short","soft",["spring","summer"],["Bergamot","Lemon","Spearmint"],["Green Tea","Jasmine"],["Musk","Sandalwood"],["fresh","green","citrus","tea"],"Herbal freshness. Spearmint and green tea. Garden freshness."),
b(52085,"Guerlain","Aqua Allegoria Mandarine Basilic EDT","unisex",2007,3.78,"short","soft",["spring","summer"],["Mandarin","Bergamot","Basil"],["White Flowers"],["White Musk"],["citrus","herbal","fresh","floral"],"Mandarin basil. Citrus and herbs. Summer kitchen garden."),
b(62691,"Guerlain","Aqua Allegoria Grosellina EDT","unisex",2021,3.75,"short","soft",["spring","summer"],["Bergamot","Black Currant"],["Cassis","White Flowers"],["White Musk"],["citrus","fruity","fresh","musk"],"Currant freshness. Black currant and bergamot. Berry delight."),
b(52086,"Guerlain","L'Instant de Guerlain EDT","female",2003,3.88,"long","moderate",["spring","fall"],["Bergamot","Mango","Lychee"],["Magnolia","Peony","Iris"],["Patchouli","Musk","Sandalwood"],["floral","fruity","sweet","woody"],"A Guerlain moment. Mango and magnolia. Feminine luxury."),
b(52087,"Guerlain","Rose Barbare EDP","female",2009,4.05,"long","strong",["spring","fall"],["Rose","Bergamot"],["Rose","Geranium","Jasmine"],["Patchouli","Amber","Musk"],["rose","floral","patchouli","amber"],"Barbaric rose. Rose and patchouli. Wild and opulent."),
b(46452,"Guerlain","Mon Guerlain EDP Intense","female",2018,3.95,"very_long","strong",["fall","winter"],["Bergamot","Lavender"],["Jasmine Sambac","Sandalwood"],["Tonka Bean","Vanilla","Amber"],["lavender","vanilla","sweet","amber"],"Intense Mon Guerlain. Deeper vanilla and tonka. Winter luxury."),

// ════ LANCÔME extended ════
b(52088,"Lancôme","Poême EDP","female",1995,3.92,"very_long","enormous",["fall","winter"],["Bergamot","Mandarin","Lemon"],["Magnolia","Mimosa","Heliotrope","Freesia","Rose"],["Vanilla","Sandalwood","Musk","Amber"],["floral","sweet","vanilla","oriental"],"A poem. Magnolia and mimosa. Opulent 90s classic."),
b(34448,"Lancôme","Ô de L'Oranger EDT","unisex",2019,3.78,"short","soft",["spring","summer"],["Bergamot","Orange","Neroli"],["Orange Blossom","Jasmine"],["White Musk"],["citrus","floral","fresh","musk"],"Orange tree freshness. Neroli and orange blossom. Bright and airy."),
b(62690,"Lancôme","La Vie est Belle L'Éclat EDT","female",2016,3.82,"moderate","moderate",["spring","summer"],["Bergamot","Blackcurrant","Citrus"],["Peony","Iris","Jasmine"],["Musk","Patchouli"],["floral","fruity","fresh","musk"],"Éclat de vie. Blackcurrant and iris. Radiant joy."),
b(74487,"Lancôme","La Vie est Belle Oui EDP","female",2020,3.88,"long","strong",["fall","winter"],["Bergamot","Pink Pepper"],["Iris","Jasmine","Orange Blossom"],["Patchouli","Praline","Vanilla"],["floral","sweet","iris","gourmand"],"Saying yes. Iris and praline. Optimistic luxury."),
b(62689,"Lancôme","Ôui EDP","female",2020,3.85,"long","moderate",["spring","fall"],["Bergamot","Blackcurrant"],["Rose","Jasmine","Orange Blossom"],["Patchouli","Vanilla","Musk"],["floral","sweet","fruity","musk"],"Oui. Rose and vanilla. Romantic affirmation."),

// ════ CHLOÉ extended ════
b(62688,"Chloé","Love Story EDP","female",2014,3.82,"long","moderate",["spring","summer"],["Bergamot","Orange Blossom"],["Orange Blossom","Jasmine","Magnolia"],["Cedarwood","Musk","Virginian Cedar"],["floral","white floral","citrus","woody"],"Love story. Orange blossom and jasmine. Parisian romance."),
b(52089,"Chloé","See by Chloé EDT","female",2011,3.72,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Grapefruit"],["Lily","Muguet","White Tea"],["Musk","Sandalwood"],["floral","fresh","citrus","tea"],"See through. White flowers and tea. Light and transparent."),
b(57519,"Chloé","Lumineuse EDP","female",2022,3.88,"long","moderate",["spring","fall"],["Bergamot","Mandarin"],["Rose","Magnolia","Peony"],["Sandalwood","White Musk","Cedarwood"],["floral","rose","fresh","woody"],"Luminous. Rose and magnolia. Modern romantic."),

// ════ GIVENCHY extended ════
b(52090,"Givenchy","Organza EDP","female",1996,3.88,"very_long","strong",["fall","winter"],["Aldehydes","Bergamot","Orange"],["Tuberose","Jasmine","Magnolia","Lily of the Valley"],["Vanilla","Musk","Amber","Sandalwood"],["floral","oriental","sweet","powdery"],"Organza dream. Tuberose and magnolia. 90s opulence."),
b(52091,"Givenchy","Extravagance d'Amarige EDT","female",1998,3.75,"long","moderate",["spring","fall"],["Aldehydes","Bergamot","Neroli"],["Rose","Jasmine","Ylang-Ylang","Mimosa"],["Musk","Sandalwood","Amber","Vetiver"],["floral","aldehydic","sweet","powdery"],"Extravagant amarige. Mimosa and jasmine. Generous and sunny."),
b(62687,"Givenchy","Live Irrésistible EDP","female",2016,3.78,"long","moderate",["spring","fall"],["Pink Pepper","Mandarin","Clementine"],["Peony","Magnolia","Rose"],["Musk","Sandalwood","Cashmere"],["floral","spicy","fruity","woody"],"Irresistibly alive. Pink pepper and peony. Dynamic femininity."),
b(74488,"Givenchy","L'Interdit Rouge EDP","female",2020,3.92,"long","strong",["fall","winter"],["Bergamot","Orange"],["Tuberose","Patchouli"],["Amber","Vetiver","Ambergris"],["floral","woody","amber","spicy"],"Red forbidden. Tuberose and patchouli. Dark romanticism."),

// ════ DIOR Privée ════
b(34447,"Dior","Dior Privée: Bois d'Argent EDP","unisex",2006,4.22,"long","moderate",["spring","fall"],["Bergamot","Iris"],["Iris","Musk","Sandalwood"],["White Musk","Cedarwood"],["iris","woody","musk","fresh"],"Silver wood. Iris and cedar. Understated Dior luxury."),
b(34446,"Dior","Dior Privée: Oud Ispahan EDP","unisex",2012,4.45,"very_long","enormous",["fall","winter"],["Damascus Rose","Lab Olibanum"],["Oud","Rose","Patchouli"],["Sandalwood","Cistus","Amber"],["oud","rose","oriental","amber"],"The greatest Dior. Damascus rose and oud. Legendary."),
b(46453,"Dior","Dior Privée: Rose Royale EDP","female",2021,4.12,"long","moderate",["spring","fall"],["Bergamot","Neroli"],["Grasse Rose","Jasmine","Peony"],["Sandalwood","Musk","White Cedar"],["rose","floral","citrus","woody"],"Royal rose. Grasse rose and neroli. Regal femininity."),
b(52092,"Dior","Dior Privée: Mitzah EDP","female",2010,4.15,"long","strong",["fall","winter"],["Bergamot","Orange"],["Cinnamon","Amyris"],["Amber","Sandalwood","Musk"],["oriental","spicy","amber","woody"],"Mitzah Bricard's spirit. Cinnamon and amber. Personal luxury."),
b(57520,"Dior","Dior Privée: Leather Oud EDP","unisex",2009,4.28,"very_long","strong",["fall","winter"],["Rose","Patchouli","Bergamot"],["Oud","Leather","Amber"],["Sandalwood","Musk","Vetiver"],["leather","oud","rose","amber"],"Leather and oud. Rose and patchouli. Private Dior."),

// ════ CHANEL extended Exclusifs ════
b(4937,"Chanel","Les Exclusifs: Eau de Cologne EDT","unisex",2007,4.08,"short","moderate",["spring","summer"],["Bergamot","Lemon","Orange"],["Jasmine","Neroli"],["Musk","Sandalwood"],["citrus","floral","fresh","aromatic"],"Chanel's cologne. Classic and luminous. Clean luxury."),
b(4940,"Chanel","Les Exclusifs: No.18 EDP","female",2007,4.18,"long","moderate",["spring","fall"],["Ambrette","Bergamot"],["Ambrette","Iris","Rose"],["White Musk","Sandalwood"],["musk","iris","floral","fresh"],"Number 18. Ambrette and iris. Intimate and modern."),
b(4941,"Chanel","Les Exclusifs: Rue Cambon EDP","female",2007,4.22,"long","strong",["fall","winter"],["Bergamot","Aldehydes"],["Labdanum","Orris","Jasmine"],["Sandalwood","Vetiver","Musk"],["chypre","iris","floral","powdery"],"The Chanel address. Labdanum and iris. Sophisticated chypre."),
b(52093,"Chanel","Les Exclusifs: Misia EDP","female",2015,4.25,"long","strong",["spring","fall"],["Bergamot","Iris"],["Violet","Rose","Iris"],["Musk","Sandalwood","Cedarwood"],["iris","violet","floral","powdery"],"Misia Sert. Violet and iris. Belle Époque luxury."),
b(52094,"Chanel","Les Exclusifs: 1957 EDP","unisex",2018,4.18,"long","moderate",["spring","fall"],["Bergamot","Labdanum"],["Peach","Jasmine","Rose"],["Sandalwood","Cashmere","Musk"],["floral","fruity","musk","woody"],"1957. Peach and jasmine. Timeless Chanel."),

// ════ BYREDO extended ════
b(43014,"Byredo","Encens Chembur EDP","unisex",2013,4.15,"long","strong",["fall","winter"],["Bergamot","Pepper"],["Incense","Papyrus"],["Amber","Sandalwood","Musk"],["incense","smoky","woody","amber"],"Chembur incense. Mumbai smoke. Urban ritual."),
b(43015,"Byredo","Mumbai Noise EDP","unisex",2019,3.98,"long","moderate",["fall","winter"],["Bergamot","Cardamom"],["Oud","Papyrus","Leather"],["Sandalwood","Amber","Musk"],["oud","leather","spicy","woody"],"Mumbai noise. Cardamom and oud. Sensory overload."),
b(43016,"Byredo","Burning Rose EDP","unisex",2020,4.12,"long","strong",["fall","winter"],["Bergamot","Smoke"],["Rose","Incense"],["Sandalwood","Musk","Cedarwood"],["rose","smoky","incense","woody"],"Burning rose. Smoke and rose. Dramatic and beautiful."),
b(43017,"Byredo","Sellier EDP","unisex",2012,3.98,"long","moderate",["fall","winter"],["Bergamot","Saffron"],["Leather","Orris","Violet"],["Sandalwood","Musk","Amber"],["leather","floral","spicy","woody"],"Saddle leather. Orris and saffron. Equestrian luxury."),
b(43018,"Byredo","1996 Inez & Vinoodh EDP","unisex",2012,3.92,"long","moderate",["spring","fall"],["Bergamot","Lemon"],["Orris","Musk","Rose"],["Sandalwood","Vetiver","Musk"],["iris","floral","musk","woody"],"Art photography. Orris and musk. Artistic luxury."),
b(57521,"Byredo","Vanishing Point EDP","unisex",2015,3.88,"long","moderate",["fall","winter"],["Bergamot","Saffron"],["Amber","Sandalwood","Patchouli"],["Musk","Cedarwood","Vetiver"],["amber","spicy","woody","earthy"],"Vanishing point. Saffron and amber. Quiet intensity."),

// ════ JO MALONE extended ════
b(51485,"Jo Malone London","Vetiver & Golden Vanilla Cologne Intense","unisex",2017,4.12,"long","strong",["fall","winter"],["Bergamot","Saffron"],["Vetiver","Vanilla","Sandalwood"],["Amber","Musk"],["vetiver","vanilla","amber","sweet"],"Smoky vanilla. Vetiver and golden vanilla. Warm luxury."),
b(51486,"Jo Malone London","Tuberose & Angelica Cologne Intense","female",2012,4.18,"long","strong",["spring","fall"],["Bergamot","Angelica"],["Tuberose","White Musk"],["Sandalwood","Amber","White Musk"],["white floral","floral","musk","woody"],"Intense tuberose. Angelica and musk. The ultimate tuberose."),
b(62685,"Jo Malone London","Honeysuckle & Davana Cologne","unisex",2019,3.88,"moderate","moderate",["spring","summer"],["Bergamot","Honeysuckle"],["Davana","Jasmine"],["White Musk","Sandalwood"],["floral","fruity","fresh","musk"],"Honeysuckle summer. Davana and bergamot. Garden happiness."),
b(62686,"Jo Malone London","Moss & Mint Cologne","unisex",2018,3.82,"moderate","moderate",["spring","summer"],["Bergamot","Mint"],["Oakmoss","Jasmine"],["White Musk","Cedarwood"],["green","mossy","aromatic","fresh"],"Moss and mint garden. Earthy and minty. Natural freshness."),
b(57522,"Jo Malone London","Scarlet Poppy Cologne Intense","unisex",2017,4.05,"long","strong",["fall","winter"],["Bergamot","Rum"],["Poppy","Cassis","Sandalwood"],["Amber","Musk","Vetiver"],["fruity","floral","rum","amber"],"Scarlet intensity. Rum and cassis. Bold and dramatic."),
b(74489,"Jo Malone London","English Oak & Redcurrant Cologne","unisex",2019,3.95,"moderate","moderate",["fall","winter"],["Red Currant","Bergamot"],["Oakwood","Hay","Jasmine"],["White Musk","Sandalwood"],["fruity","woody","green","floral"],"English oak. Red currant and oakwood. Rural British."),
b(74490,"Jo Malone London","White Moss & Snowdrop Cologne","unisex",2019,3.78,"moderate","soft",["spring","summer"],["Bergamot","Snowdrop"],["White Moss","Muguet","Jasmine"],["White Musk","Sandalwood"],["floral","green","fresh","musk"],"Snowdrop garden. White moss and muguet. Spring awakening."),
b(74491,"Jo Malone London","Amber & Ginger Lily Cologne","unisex",2018,3.92,"long","moderate",["fall","winter"],["Bergamot","Cardamom"],["Ginger Lily","Jasmine"],["Amber","Sandalwood","White Musk"],["floral","amber","spicy","warm spicy"],"Amber lily. Ginger lily and cardamom. Tropical warmth."),

// ════ MAISON FRANCIS KURKDJIAN extended ════
b(64512,"Maison Francis Kurkdjian","Gentle Fluidity Silver EDP","unisex",2019,4.18,"long","moderate",["spring","fall"],["Nutmeg","Juniper Berry"],["Musk","Coriander"],["Amber","Sandalwood","Vetiver"],["fresh","aromatic","woody","citrus"],"Silver fluidity. Juniper and musk. Light and refined."),
b(64513,"Maison Francis Kurkdjian","Oud Cashmere Mood EDP","unisex",2015,4.28,"very_long","strong",["fall","winter"],["Bergamot"],["Oud","Cashmere Wood","Rose"],["Amber","Musk","Sandalwood"],["oud","rose","sweet","amber"],"Oud cashmere. Rose and cashmere. Velvet luxury."),
b(72854,"Maison Francis Kurkdjian","Amyris Homme EDP","male",2009,4.12,"long","moderate",["spring","fall"],["Bergamot","Grapefruit"],["Amyris","Cedar","Vetiver"],["White Musk","Sandalwood"],["woody","citrus","fresh","musk"],"Amyris masculinity. Cedar and vetiver. Clean and refined."),
b(72855,"Maison Francis Kurkdjian","Absolue Pour le Matin EDP","unisex",2010,3.95,"moderate","moderate",["spring","summer"],["Bergamot","Grapefruit"],["White Musk","Mandarin","Jasmine"],["White Musk","Sandalwood"],["fresh","musk","citrus","floral"],"Morning absolute. Grapefruit and musk. Clean morning."),
b(72856,"Maison Francis Kurkdjian","Cologne pour le Soir EDP","unisex",2012,4.08,"long","moderate",["spring","fall"],["Bergamot","Neroli"],["Orange Blossom","Jasmine","Musk"],["White Musk","Sandalwood","Cedar"],["citrus","floral","musk","woody"],"Evening cologne. Neroli and orange blossom. Refined evening."),

// ════ SERGE LUTENS extended ════
b(34440,"Serge Lutens","Sa Majesté la Rose EDP","female",2000,4.12,"long","strong",["spring","fall"],["Rose","Bergamot"],["Rose","Geranium","Lily of the Valley"],["Musk","Sandalwood","Amber"],["rose","floral","fresh","musk"],"Her Majesty the rose. Pure rose. Regal and timeless."),
b(34441,"Serge Lutens","Santal Majuscule EDP","unisex",2011,4.35,"very_long","strong",["fall","winter"],["Bergamot","Cardamom"],["Sandalwood","Cocoa","Rose"],["Amber","Musk","Sandalwood"],["woody","creamy","sweet","rose"],"Capital sandalwood. Cocoa and sandalwood. Rich meditation."),
b(34442,"Serge Lutens","El Attarine EDP","unisex",2007,4.18,"long","strong",["fall","winter"],["Bergamot","Cardamom","Coriander"],["Cumin","Rose","Musk"],["Amber","Sandalwood","Musk"],["spicy","rose","amber","oriental"],"Attarine market. Cumin and cardamom. Spice route luxury."),
b(34443,"Serge Lutens","Nuit de Cellophane EDP","female",2009,3.95,"long","moderate",["spring","fall"],["Bergamot","Jasmine","Lily"],["Peony","Freesia","Jasmine"],["Musk","White Musk"],["white floral","floral","fresh","musk"],"Cellophane night. Peony and freesia. Light and fresh."),
b(34444,"Serge Lutens","L'Eau EDP","unisex",2018,3.88,"moderate","soft",["spring","summer"],["Bergamot","Aldehyde","White Musk"],["White Musk","Iris"],["Sandalwood","White Musk"],["musk","fresh","iris","clean"],"The water. Pure musk and iris. Minimalist serenity."),
b(34445,"Serge Lutens","Iris Silver Mist EDP","unisex",2000,4.28,"long","moderate",["spring","fall"],["Bergamot","Iris"],["Iris","Orris","Carrots"],["Sandalwood","Musk","Iris"],["iris","floral","powdery","earthy"],"Silver mist iris. Deep iris and carrot. The iris statement."),
b(46454,"Serge Lutens","Vêtiver Oriental EDP","unisex",2004,4.12,"long","strong",["fall","winter"],["Bergamot","Vetiver"],["Vetiver","Rose","Jasmine"],["Amber","Sandalwood","Musk"],["vetiver","oriental","floral","amber"],"Oriental vetiver. Rose and amber. East meets vetiver."),

// ════ FREDERIC MALLE extended ════
b(46455,"Frederic Malle","Une Fleur de Cassie EDP","female",2000,4.22,"long","strong",["spring","fall"],["Bergamot","Cassie","Violet"],["Mimosa","Cassie","Jasmine"],["Musk","Sandalwood","Ambergris"],["floral","earthy","sweet","animalic"],"Cassie flower. Mimosa and ambergris. Unique and complex."),
b(46456,"Frederic Malle","En Passant EDP","female",2000,4.15,"long","moderate",["spring","summer"],["White Lilac","Cucumber","Wheat"],["Lilac","White Musk"],["White Musk","Cedarwood"],["floral","green","fresh","musk"],"Passing by. Lilac and cucumber. Spring shower beauty."),
b(46457,"Frederic Malle","Bigarade Concentrée EDP","unisex",2002,4.08,"moderate","moderate",["spring","summer"],["Bitter Orange","Bergamot","Neroli"],["Musk","Grapefruit"],["White Musk","Sandalwood"],["citrus","fresh","bitter","musk"],"Concentrated bitter orange. Bigarade and neroli. Simple luxury."),
b(52095,"Frederic Malle","The Night EDP","unisex",2020,4.28,"long","strong",["fall","winter"],["Bergamot","Incense"],["Benzoin","Tobacco","Leather"],["Amber","Musk","Vetiver","Oud"],["tobacco","incense","leather","amber"],"The night. Tobacco and benzoin. Dark atmospheric luxury."),

// ════ DIPTYQUE extended ════
b(57523,"Diptyque","Tempo EDP","unisex",2020,4.12,"long","moderate",["fall","winter"],["Patchouli","Bergamot"],["Patchouli","Cardamom","Styrax"],["Sandalwood","Amber","Musk"],["patchouli","earthy","spicy","amber"],"Tempo patchouli. Cardamom and styrax. Rich and dark."),
b(57524,"Diptyque","Kyoto EDP","unisex",2019,3.98,"long","moderate",["spring","fall"],["Bergamot","Cypress"],["Hinoki","Incense","Cedar"],["Sandalwood","Musk"],["woody","incense","cedar","aromatic"],"Kyoto temple. Hinoki and incense. Japanese serenity."),
b(62684,"Diptyque","Volutes EDP","unisex",2012,4.08,"long","moderate",["fall","winter"],["Bergamot","Black Pepper"],["Tobacco","Wood","Tea"],["Amber","Musk","Sandalwood"],["tobacco","tea","woody","spicy"],"Smoke spirals. Tobacco and tea. Intimate and contemplative."),
b(62683,"Diptyque","Eau Duelle EDT","unisex",2010,4.0,"long","moderate",["fall","winter"],["Bergamot","Cardamom"],["Vanilla","Incense","Papyrus"],["Amber","Musk","Sandalwood"],["vanilla","sweet","incense","woody"],"Dual water. Vanilla and incense. Unexpected warmth."),
b(74492,"Diptyque","Ilio EDT","unisex",2018,3.95,"moderate","moderate",["spring","summer"],["Bergamot","Cyclamen"],["Jasmine","Peony","White Musk"],["Musk","Sandalwood"],["floral","fresh","musk","citrus"],"Ilio freshness. Cyclamen and jasmine. Clean and radiant."),
b(74493,"Diptyque","Feuilles de Lavande EDT","unisex",2020,3.88,"moderate","soft",["spring","summer"],["Bergamot","Lavender"],["Lavender","Clover","Geranium"],["Musk","Sandalwood"],["lavender","herbal","fresh","floral"],"Lavender leaves. Clover and geranium. Aromatic simplicity."),

// ════ ACQUA DI PARMA extended ════
b(46458,"Acqua di Parma","Colonia Pura EDT","unisex",2020,3.92,"moderate","moderate",["spring","summer"],["Bergamot","Lemon","Petitgrain"],["Orange Blossom","Jasmine","Ylang-Ylang"],["White Musk","Sandalwood"],["citrus","floral","fresh","musk"],"Pure Colonia. Clean and luminous. Modern Italian."),
b(46459,"Acqua di Parma","Blu Mediterraneo Fiori di Capri EDT","unisex",2012,3.82,"short","soft",["spring","summer"],["Orange","Grapefruit","Lemon","Mandarin"],["White Flowers","Jasmine"],["White Musk"],["citrus","floral","fresh","musk"],"Capri flowers. White flowers and citrus. Island lightness."),
b(52096,"Acqua di Parma","Profumo di Roma Mirto","unisex",2020,3.95,"long","moderate",["spring","fall"],["Bergamot","Myrtle","Juniper"],["Jasmine","Myrtle"],["Sandalwood","Musk","Cedar"],["aromatic","herbal","woody","fresh"],"Roman myrtle. Mediterranean herb. Ancient city spirit."),
b(57525,"Acqua di Parma","Vaniglia di Madagascar EDP","unisex",2018,4.05,"long","strong",["fall","winter"],["Bergamot"],["Vanilla","Jasmine","Ylang-Ylang"],["Sandalwood","Amber","Musk"],["vanilla","floral","sweet","creamy"],"Madagascar vanilla. Ylang-ylang and jasmine. Exotic sweetness."),
b(62682,"Acqua di Parma","Sakura EDP","female",2014,3.88,"moderate","moderate",["spring","summer"],["Bergamot","Citrus"],["Cherry Blossom","Magnolia","Muguet"],["White Musk","Cedarwood"],["floral","fresh","citrus","musk"],"Sakura blossom. Cherry and magnolia. Japanese spring."),

// ════ ATELIER COLOGNE extended ════
b(27515,"Atelier Cologne","Grand Néroli EDP","unisex",2010,4.02,"long","moderate",["spring","summer"],["Neroli","Bergamot","Lemon"],["White Petals","Jasmine","Orange Blossom"],["White Musk","Sandalwood"],["citrus","white floral","fresh","musk"],"Grand neroli. Orange blossom and jasmine. Southern luxury."),
b(38043,"Atelier Cologne","Bois Blonds EDP","unisex",2011,3.98,"long","moderate",["spring","fall"],["Bergamot","Jasmine"],["Blonde Wood","Jasmine","Iris"],["White Cedar","Sandalwood","Musk"],["woody","floral","iris","citrus"],"Blonde woods. Iris and sandalwood. Natural luxury."),
b(46460,"Atelier Cologne","Vanille Insensée EDP","unisex",2011,4.0,"long","moderate",["fall","winter"],["Bergamot","Neroli"],["Vanilla","Iris","Cassia"],["White Musk","Sandalwood","Amber"],["vanilla","floral","sweet","iris"],"Senseless vanilla. Iris and cassia. Unexpected luxury."),
b(52097,"Atelier Cologne","Rose Anonyme EDP","unisex",2011,4.18,"long","strong",["spring","fall"],["Bergamot","Bay Leaf"],["Turkish Rose","Jasmine","Musk"],["Sandalwood","Vetiver","Amber"],["rose","floral","spicy","woody"],"Anonymous rose. Bay leaf and Turkish rose. Sophisticated."),
b(57526,"Atelier Cologne","Pomelo Paradis EDP","unisex",2010,3.95,"moderate","moderate",["spring","summer"],["Pomelo","Bergamot","Mandarin"],["White Jasmine","Jasmine"],["White Musk","Sandalwood","Vetiver"],["citrus","floral","fresh","musk"],"Pomelo paradise. Fresh and fruity. Bright citrus joy."),

// ════ MAISON MARGIELA extended ════
b(74494,"Maison Margiela","Replica At the Barber's EDT","male",2015,3.92,"moderate","moderate",["spring","fall"],["Bergamot","Cardamom"],["Birch","Woody Accord"],["Amber","Musk","Sandalwood"],["woody","spicy","aromatic","fresh"],"Barber shop vintage. Birch and cardamom. Masculine ritual."),
b(74495,"Maison Margiela","Replica Wicked Love EDT","unisex",2020,3.88,"long","moderate",["fall","winter"],["Bergamot","Cardamom","Orange"],["Jasmine","Iris","Amber"],["Amber","Musk","Sandalwood"],["floral","amber","spicy","warm spicy"],"Wicked love. Cardamom and iris. Dark romance."),
b(74496,"Maison Margiela","Replica Dancing on the Moon EDT","unisex",2021,3.85,"long","moderate",["spring","fall"],["Bergamot","Iris"],["Musk","Orris","Rose"],["Sandalwood","White Musk"],["iris","floral","musk","fresh"],"Moon dance. Iris and musk. Dreamy escapism."),
b(74497,"Maison Margiela","Replica Flower Market Intense EDP","female",2022,3.92,"long","strong",["spring","fall"],["Bergamot","Violet"],["Peony","Rose","Jasmine"],["Musk","Sandalwood","Cedarwood"],["floral","rose","powdery","woody"],"Intense flower market. Peony and rose. Richer floral."),
b(62681,"Maison Margiela","Replica Music Festival EDT","unisex",2018,3.82,"moderate","moderate",["spring","summer"],["Bergamot","Patchouli"],["Sandalwood","Amber"],["Musk","Cedarwood"],["patchouli","earthy","woody","sweet"],"Festival vibes. Patchouli and sandalwood. Summer freedom."),

// ════ LE LABO extended ════
b(62680,"Le Labo","Labdanum 18 EDP","unisex",2006,4.12,"long","strong",["fall","winter"],["Bergamot","Labdanum"],["Labdanum","Benzoin","Amber"],["Musk","Sandalwood","Vetiver"],["amber","balsamic","resinous","oriental"],"Labdanum 18. Benzoin and amber. Ancient resin luxury."),
b(62679,"Le Labo","Vetiver 46 EDP","unisex",2006,4.18,"long","moderate",["spring","fall"],["Bergamot","Vetiver","Grapefruit"],["Vetiver","Gaiac","Cedar"],["Musk","Sandalwood"],["vetiver","woody","citrus","earthy"],"Vetiver 46. Gaiac and cedar. The vetiver reference."),
b(62678,"Le Labo","Ylang 49 EDP","female",2006,3.98,"long","moderate",["spring","fall"],["Bergamot","Ylang-Ylang"],["Ylang-Ylang","Jasmine","Musk"],["Sandalwood","Amber"],["floral","exotic","sweet","creamy"],"Ylang 49. Jasmine and musk. Tropical floral."),
b(52098,"Le Labo","Neroli 36 EDP","unisex",2006,4.05,"moderate","moderate",["spring","summer"],["Bergamot","Neroli","Lemon"],["Musk","White Flowers"],["White Musk","Sandalwood"],["citrus","musk","floral","fresh"],"Neroli 36. Pure neroli luxury. Fresh and luminous."),

// ════ NARRATIVES / extra niche ════
b(57527,"Memo Paris","Wild Geranium EDP","female",2015,3.95,"long","moderate",["spring","fall"],["Bergamot","Citrus"],["Wild Geranium","Rose","Jasmine"],["Musk","Sandalwood","Cedarwood"],["floral","rose","fresh","woody"],"Wild geranium. Rose and jasmine. Natural and vibrant."),
b(57528,"Memo Paris","Inle EDP","unisex",2013,4.08,"long","moderate",["spring","fall"],["Bergamot","Citrus"],["Tea","Jasmine","Ylang-Ylang"],["Sandalwood","Musk","Cedar"],["tea","floral","woody","fresh"],"Inle Lake. Tea and jasmine. Burmese serenity."),
b(62677,"Zoologist Perfumes","Moth EDP","unisex",2017,3.95,"long","moderate",["fall","winter"],["Bergamot","Myrrh"],["Frankincense","Labdanum","Orris"],["Amber","Sandalwood","Musk"],["incense","balsamic","resinous","amber"],"Moth attraction. Myrrh and frankincense. Night ritual."),
b(62676,"Zoologist Perfumes","Dodo EDP","unisex",2016,3.88,"long","moderate",["spring","fall"],["Bergamot","Tropical Fruits"],["Tiare","Ylang-Ylang","Coconut"],["Sandalwood","Musk","Vanilla"],["tropical","floral","coconut","sweet"],"Extinct paradise. Tiare and coconut. Lost Eden."),

// ════ PERFUME BRANDS extended ════
b(57529,"Parfums de Nicolaï","Maharadjah EDP","unisex",2004,3.92,"long","strong",["fall","winter"],["Bergamot","Saffron","Cardamom"],["Rose","Amber","Incense"],["Sandalwood","Musk","Patchouli"],["oriental","spicy","rose","amber"],"Maharajah luxury. Saffron and rose. Indian opulence."),
b(57530,"Parfums de Nicolaï","Ambre Kashmir EDP","unisex",2013,4.05,"very_long","strong",["fall","winter"],["Bergamot","Cardamom"],["Amber","Benzoin","Rose"],["Sandalwood","Musk","Vetiver"],["amber","balsamic","sweet","oriental"],"Kashmir amber. Benzoin and rose. Rich oriental."),
b(57531,"Comptoir Sud Pacifique","Amour de Cacao EDP","unisex",2005,3.88,"long","moderate",["fall","winter"],["Bergamot","Citrus"],["Chocolate","Vanilla","Coffee"],["Musk","Sandalwood"],["gourmand","chocolate","coffee","sweet"],"Love of chocolate. Coffee and vanilla. Indulgent."),
b(57532,"Comptoir Sud Pacifique","Vanille Camélias EDT","female",2019,3.75,"moderate","moderate",["spring","summer"],["Bergamot","Camellia"],["Camellia","Vanilla","Jasmine"],["White Musk","Sandalwood"],["floral","vanilla","sweet","musk"],"Vanilla camellia. Japanese flower and vanilla. Delicate."),

// ════ MORE MAINSTREAM EXTRAS ════
b(57533,"Naomi Campbell","Cat Deluxe EDP","female",2006,3.55,"moderate","moderate",["spring","fall"],["Bergamot","Passion Fruit","Raspberry"],["Rose","Jasmine","Peony","Lily"],["Musk","Sandalwood","Amber"],["floral","fruity","sweet","musk"],"Cat's luxury. Passion fruit and rose. Supermodel glamour."),
b(57534,"David Beckham","Classic Blue EDT","male",2013,3.58,"moderate","moderate",["spring","summer"],["Grapefruit","Bergamot","Cardamom"],["Aquatic Notes","Cedarwood"],["Musk","Sandalwood","Vetiver"],["fresh","aquatic","citrus","woody"],"Beckham classic blue. Grapefruit and aquatic. Sporty cool."),
b(57535,"David Beckham","Instinct EDT","male",2005,3.55,"moderate","moderate",["spring","summer"],["Bergamot","Apple","Black Pepper"],["Cedarwood","Patchouli"],["Musk","Sandalwood"],["fresh","spicy","woody","citrus"],"Instinct. Apple and black pepper. Natural masculine."),
b(57536,"Ellen Tracy","Modern EDT","female",2006,3.52,"moderate","soft",["spring","summer"],["Bergamot","Mandarin","Pink Grapefruit"],["Jasmine","Lily","Peony"],["Musk","Sandalwood","Amber"],["floral","citrus","fresh","musk"],"Modern woman. Grapefruit and jasmine. Accessible elegance."),
b(57537,"Celine Dion","Celine Dion Parfum EDP","female",2003,3.55,"long","moderate",["spring","fall"],["Bergamot","Cassis","Peach"],["Rose","Jasmine","Cyclamen"],["Musk","Sandalwood","Amber"],["floral","fruity","sweet","musk"],"Celine's signature. Peach and rose. Pop star luxury."),
b(57538,"Sarah Jessica Parker","Lovely EDP","female",2005,3.75,"long","moderate",["spring","fall"],["Lavender","Mandarin","Bergamot"],["Patchouli","Musk","Orchid"],["Sandalwood","Cedarwood","Amber","Musk","Paper"],["musk","floral","fresh","woody"],"NYC SJP signature. Lavender and patchouli musk. Wearable and accessible."),

// ════ MORE ORIENTAL/ARABIC ════
b(75062,"Amouage","Lyric Woman EDP","female",2008,4.18,"long","strong",["spring","fall"],["Bergamot","Pink Pepper","Rose"],["Rose","Jasmine","Ylang-Ylang"],["Sandalwood","Musk","Amber"],["rose","floral","spicy","amber"],"Lyric femininity. Rose and ylang-ylang. Poetic luxury."),
b(75063,"Amouage","Dia Man EDP","male",2002,4.12,"long","moderate",["spring","fall"],["Bergamot","Neroli","Pink Pepper"],["Jasmine","Ambrette","Geranium"],["Amber","White Musk","Sandalwood"],["floral","woody","citrus","musk"],"Dia purity. Neroli and ambrette. Clean Omani masculinity."),
b(75064,"Amouage","Fate Man EDP","male",2013,4.22,"very_long","enormous",["fall","winter"],["Bergamot","Rose","Elemi"],["Leather","Labdanum","Frankincense","Oud"],["Patchouli","Sandalwood","Musk"],["oud","leather","incense","oriental"],"Destiny. Leather and frankincense. Powerful fate."),
b(75065,"Amouage","Gold Woman EDP","female",1983,4.35,"very_long","enormous",["fall","winter"],["Bergamot","Lemon","Aldehydes"],["Jasmine","Rose","Lily","Carnation","Orris"],["Sandalwood","Civet","Musk","Oakmoss"],["floral","oriental","aldehydic","earthy"],"Gold queen. Rose and civet. Omani feminine royalty."),
b(75066,"Lattafa","Milano Rosso EDP","female",2021,4.12,"long","strong",["spring","fall"],["Bergamot","Peach","Raspberry"],["Rose","Jasmine","Violet"],["Musk","Sandalwood","Amber"],["floral","fruity","sweet","rose"],"Milan red. Raspberry and rose. Italian-inspired Eastern luxury."),
b(75067,"Rasasi","Al Wisam Day EDT","male",2018,4.05,"very_long","strong",["fall","winter"],["Bergamot","Cardamom","Saffron"],["Oud","Cedar","Amber"],["Sandalwood","Musk","Vanilla"],["oud","woody","spicy","amber"],"Day honours. Cardamom and cedar. Noble Arabic heritage."),
b(75068,"Swiss Arabian","Silsal EDP","unisex",2018,3.98,"long","strong",["spring","fall"],["Bergamot","Citrus"],["Musk","Sandalwood","Rose"],["Amber","Musk","Vanilla"],["musk","woody","sweet","floral"],"Silsal purity. Clean musk and sandalwood. Simple luxury."),
b(75069,"Afnan","Turathi Blue EDP","male",2021,4.08,"very_long","strong",["fall","winter"],["Bergamot","Cardamom","Saffron"],["Oud","Amber","Jasmine"],["Sandalwood","Musk","Patchouli"],["oud","spicy","amber","floral"],"Blue heritage. Saffron and oud. Traditional Arabic blue."),
b(75070,"Arabian Oud","Oud Magnifico EDP","unisex",2019,4.22,"very_long","enormous",["fall","winter"],["Bergamot","Saffron","Cardamom"],["Oud","Rose","Amber"],["Sandalwood","Musk","Vanilla"],["oud","rose","amber","sweet"],"Magnificent oud. Rose and saffron. Arabian grandeur."),

// ════ GENDER-SPECIFIC EXTRAS ════
b(52099,"Chanel","Coco Noir EDP","female",2012,4.05,"long","strong",["fall","winter"],["Bergamot","Grapefruit"],["Rose","Sandalwood","Geranium"],["Patchouli","White Musk","Incense"],["woody","patchouli","floral","incense"],"Coco Noir intense. Dark and mysterious. Nocturnal Chanel."),
b(52100,"Dior","Dior Homme Black Tie EDP","male",2022,4.15,"long","strong",["fall","winter"],["Bergamot","Violet","Coriander"],["Iris","Orris","Patchouli"],["Amber","Cedarwood","Musk"],["iris","woody","aromatic","amber"],"Black tie masculinity. Iris and violet. Couture formal."),
b(52101,"Guerlain","Samsara EDP","female",1989,4.02,"very_long","enormous",["fall","winter"],["Bergamot","Neroli","Peach"],["Jasmine","Ylang-Ylang","Rose","Iris"],["Sandalwood","Vetiver","Musk","Civet","Amber"],["oriental","floral","sweet","sandalwood"],"Samsara wheel. Jasmine and sandalwood. 1989 oriental statement."),
b(52102,"Yves Saint Laurent","Opium Black EDP","female",2018,3.92,"long","strong",["fall","winter"],["Bergamot","Mandarin"],["Oud","Amber","Incense"],["Musk","Sandalwood","Patchouli"],["oud","amber","incense","oriental"],"Black opium. Oud and incense. Darker oriental."),
b(52103,"Versace","Crystal Noir EDP","female",2018,3.88,"long","strong",["fall","winter"],["Ginger","Pepper","Cardamom"],["Gardenia","Peony","Plum"],["Musk","Amber","Sandalwood"],["floral","warm spicy","amber","fruity"],"Crystal darkness. Gardenia and plum. Mysterious luxury."),
b(52104,"Prada","Candy Night EDP","female",2018,3.88,"long","strong",["fall","winter"],["Lily","Iris","Benzyl"],["Neroli","Vanilla","White Musk"],["Musk","Sandalwood"],["sweet","floral","vanilla","musk"],"Candy night dark. Nocturnal sweetness. After-midnight luxury."),
b(52105,"Dolce & Gabbana","The Only One 2 EDP","female",2019,3.95,"long","strong",["fall","winter"],["Bergamot","Pear","Blackcurrant","Iris"],["Iris","Cherry","Violet","Coffee"],["Patchouli","Vanilla","Sandalwood"],["floral","iris","sweet","cherry"],"Only one squared. Cherry and iris. Irresistible sequel."),
b(52106,"Valentino","Born in Roma Coral Fantasy EDP","female",2022,3.92,"long","moderate",["spring","summer"],["Bergamot","Pink Pepper","Mandarin"],["Coral Rose","Jasmine","Geranium"],["Musk","Sandalwood","White Cedar"],["floral","citrus","spicy","musk"],"Coral fantasy. Coral rose and jasmine. Roman summer."),
b(52107,"Carolina Herrera","Good Girl Suprême EDP","female",2021,3.88,"long","strong",["fall","winter"],["Tuberose","Black Currant","Jasmine"],["Tonka Bean","Patchouli"],["Cocoa","Vanilla","Amber"],["floral","gourmand","sweet","warm spicy"],"Supreme good girl. Tuberose and tonka. Maximum luxury."),

// ════ CLASSIC REISSUES ════
b(90,"Jean Patou","Joy EDP","female",1930,4.22,"very_long","enormous",["spring","fall"],["Aldehydes","Bergamot","Ylang-Ylang"],["Rose","Jasmine"],["Civet","Musk","Sandalwood","Amber"],["floral","rose","jasmine","aldehydic"],"Most expensive perfume creation. Rose and jasmine. 1930 opulence."),
b(91,"Jean Patou","1000 EDP","female",1972,4.05,"very_long","strong",["fall","winter"],["Aldehydes","Bergamot","Oakmoss"],["Rose","Jasmine","Iris","Lily of the Valley"],["Vetiver","Musk","Sandalwood","Oakmoss","Civet"],["chypre","floral","earthy","aldehydic"],"A thousand. Chypre floral. 1972 power fragrance."),
b(92,"Lenthéric","Tweed EDP","female",1933,3.88,"very_long","strong",["fall","winter"],["Aldehydes","Bergamot","Coriander"],["Rose","Jasmine","Ylang-Ylang","Lily","Carnation"],["Sandalwood","Musk","Vetiver","Civet","Oakmoss"],["chypre","floral","earthy","aldehydic"],"British tweed classic. Rose and oakmoss. 1933 heritage."),
b(93,"Worth","Je Reviens EDP","female",1932,4.0,"very_long","strong",["fall","winter"],["Aldehydes","Bergamot"],["Rose","Jasmine","Lilac","Narcissus","Violet"],["Vetiver","Musk","Amber","Civet","Sandalwood"],["floral","aldehydic","powdery","oriental"],"I will return. Rose and narcissus. 1932 depression-era luxury."),
b(94,"Houbigant","Quelques Fleurs EDP","female",1912,4.12,"very_long","strong",["spring","fall"],["Aldehydes","Bergamot"],["Rose","Jasmine","Lily of the Valley","Orchid"],["Musk","Sandalwood","Civet","Amber"],["floral","aldehydic","powdery","sweet"],"A few flowers. 1912 birth of the modern feminine. Historical."),

// ════ ZARA extended ════
b(75071,"Zara","N°04 Patchouli EDP","unisex",2021,3.85,"long","moderate",["fall","winter"],["Bergamot","Black Pepper"],["Patchouli","Vetiver"],["Amber","Musk","Sandalwood"],["patchouli","earthy","woody","amber"],"Zara patchouli. Affordable niche inspired. Surprisingly good."),
b(75072,"Zara","Elixir de Parfum EDP","female",2022,3.88,"long","strong",["fall","winter"],["Bergamot","Rose","Saffron"],["Rose","Jasmine","Oud"],["Musk","Sandalwood","Amber"],["rose","oud","floral","amber"],"Zara elixir. Rose and saffron oud. Affordable luxury."),
b(75073,"Zara","Man Gold EDP","male",2022,3.82,"long","moderate",["fall","winter"],["Bergamot","Cardamom"],["Amber","Cedarwood","Musk"],["Sandalwood","Amber"],["amber","woody","spicy","aromatic"],"Zara gold masculine. Cardamom and amber. Accessible warm."),
b(75074,"Zara","Seoul EDP","unisex",2021,3.78,"moderate","moderate",["spring","fall"],["Bergamot","Apple","Pear"],["Rose","Jasmine","Lily"],["Musk","Sandalwood"],["floral","fruity","fresh","musk"],"Seoul vibes. Apple and rose. Korean-inspired freshness."),
b(75075,"Zara","Oud Couture EDP","unisex",2022,3.95,"very_long","strong",["fall","winter"],["Bergamot","Saffron","Cardamom"],["Oud","Rose","Amber"],["Sandalwood","Musk","Vanilla"],["oud","rose","amber","sweet"],"Couture oud. Saffron and rose. Zara's luxury peak."),

// ════ MAISON ALHAMBRA extended ════
b(75076,"Maison Alhambra","Hekayati EDP","female",2022,4.02,"long","strong",["spring","fall"],["Bergamot","Peach","Raspberry"],["Rose","Jasmine","Lily"],["Musk","Sandalwood","Amber"],["floral","fruity","sweet","rose"],"My story. Raspberry and rose. Affordable Eastern feminine."),
b(75077,"Maison Alhambra","Arctic Frozen EDP","male",2022,3.92,"long","moderate",["spring","fall"],["Bergamot","Grapefruit","Apple"],["Cedar","Amber","Vetiver"],["Musk","Sandalwood"],["fresh","citrus","woody","aromatic"],"Arctic freshness. Apple and cedar. Clean and cool."),

// ════ DOSSIER extended ════
b(57539,"Dossier","Floral Neroli EDP","female",2021,3.75,"moderate","moderate",["spring","summer"],["Bergamot","Neroli","Orange"],["Orange Blossom","Jasmine","Muguet"],["White Musk","Sandalwood"],["citrus","white floral","fresh","musk"],"Accessible neroli. Orange blossom and jasmine. Clean luxury."),
b(57540,"Dossier","Ambery Pistachio EDP","unisex",2022,3.82,"long","moderate",["fall","winter"],["Bergamot","Cardamom"],["Pistachio","Vanilla","Amber"],["Musk","Sandalwood"],["vanilla","sweet","nutty","amber"],"Pistachio amber. Cardamom and vanilla. Sweet accessible."),
b(57541,"Dossier","Powdery Musk EDP","unisex",2020,3.72,"long","moderate",["spring","fall"],["Bergamot","Iris"],["Musk","White Flowers","Orris"],["White Musk","Sandalwood"],["musk","powdery","iris","floral"],"Powdery musk luxury. Iris and clean musk. Affordable niche."),

// ════ KAYALI extended ════
b(57542,"Kayali","Eden Juicy Apple | 01 EDP","female",2022,3.95,"long","moderate",["spring","summer"],["Apple","Green Apple","Bergamot"],["Jasmine","Rose","Magnolia"],["Musk","Cedarwood","Sandalwood"],["fruity","floral","fresh","musk"],"Juicy apple Eden. Green apple and jasmine. Fresh luxury."),
b(57543,"Kayali","Invite Only Amber | 23 EDP","unisex",2023,4.08,"long","strong",["fall","winter"],["Bergamot","Cardamom"],["Amber","Vanilla","Rose"],["Sandalwood","Musk","Cashmere"],["amber","vanilla","sweet","floral"],"Amber invitation. Cardamom and vanilla amber. Exclusive warmth."),

// ════ VICTORIA'S SECRET extended ════
b(57544,"Victoria's Secret","Bare Vanilla EDP","female",2019,3.72,"long","moderate",["spring","fall"],["Bergamot","Sandalwood"],["Vanilla","White Musk","Sandalwood"],["Musk","Sandalwood"],["vanilla","musk","woody","sweet"],"Bare vanilla. Skin and vanilla. Transparent luxury."),
b(57545,"Victoria's Secret","Tease EDP","female",2010,3.75,"long","moderate",["fall","winter"],["Frosted Pear","Black Vanilla","Pink Crème"],["Gardenia","Sugared Musk","Blooming Rose"],["Sandalwood","Musk"],["sweet","fruity","floral","vanilla"],"Tease and please. Frosted pear and vanilla. Playful seduction."),

// ════ ESTÉE LAUDER extended ════
b(39268,"Estée Lauder","Modern Muse EDP","female",2013,3.78,"long","moderate",["spring","fall"],["Lychee","Fresh Notes"],["Lily","Jasmine","Iris"],["Sandalwood","Musk","Benzoin"],["floral","fresh","musk","woody"],"Modern muse. Lily and iris. Contemporary elegance."),
b(46461,"Estée Lauder","Pleasures Intense EDP","female",2004,3.82,"long","strong",["spring","fall"],["Bergamot","Lily","Peony"],["White Lily","Rose","Jasmine"],["Amber","Sandalwood","Musk","Oakmoss"],["floral","white floral","amber","woody"],"Intense pleasures. White lily and amber. More powerful."),
b(52108,"Estée Lauder","Knowing EDP","female",1988,3.95,"very_long","enormous",["fall","winter"],["Aldehydes","Bergamot","Mandarin"],["Rose","Jasmine","Ylang-Ylang","Lily"],["Patchouli","Sandalwood","Oakmoss","Amber","Civet"],["chypre","floral","earthy","amber"],"Knowing chypre. Rose and patchouli. 1988 power classic."),
b(57546,"Estée Lauder","Azurée EDP","female",1969,3.88,"long","moderate",["spring","summer"],["Bergamot","Orange","Mint"],["Lily of the Valley","Rose","Jasmine","Orris"],["Vetiver","Oakmoss","Sandalwood","Musk"],["chypre","floral","green","citrus"],"Azure. Green chypre. 1969 summer classic."),

// ════ CAROLINA HERRERA extended ════
b(52109,"Carolina Herrera","Good Girl Légère EDP","female",2018,3.78,"long","moderate",["spring","summer"],["Bergamot","Almond","Jasmine"],["Jasmine","White Tuberose","Magnolia"],["White Musk","Sandalwood","Cashmeran"],["floral","sweet","white floral","musk"],"Light good girl. Almond and white jasmine. Day version."),
b(52110,"Carolina Herrera","212 VIP EDP","female",2010,3.75,"long","moderate",["fall","winter"],["Guava","Passionfruit","Freesia"],["Jasmine","Musk"],["White Musk","Sandalwood","Amber"],["floral","fruity","sweet","musk"],"VIP NYC. Guava and jasmine. Party feminine."),
b(52111,"Carolina Herrera","212 VIP Men EDP","male",2014,3.78,"long","strong",["fall","winter"],["Pear","Bergamot","Musk"],["Amber","Incense","Leather"],["White Musk","Sandalwood","Amber"],["leather","spicy","sweet","amber"],"VIP men. Pear and leather. NYC night king."),

// ════ HUGO BOSS extended ════
b(75078,"Hugo Boss","Boss Bottled Elixir EDP","male",2012,3.88,"long","strong",["fall","winter"],["Violet","Cardamom","Grapefruit"],["Geranium","Cinnamon","Rose"],["Patchouli","Vetiver","Musk","Amber"],["warm spicy","aromatic","amber","woody"],"Boss elixir. Cardamom and geranium. Most intense Bottled."),
b(75079,"Hugo Boss","Hugo XY EDT","male",2005,3.62,"moderate","moderate",["spring","summer"],["Apple","Cedar","White Tea"],["Musk","Amber","Geranium"],["Sandalwood","Musk"],["fresh","citrus","tea","woody"],"XY chromosome. Apple and white tea. Active masculine."),
b(75080,"Hugo Boss","BOSS Alive Intense EDP","female",2021,3.92,"long","strong",["fall","winter"],["Bergamot","Cardamom"],["Jasmine","White Flowers","Vanilla"],["Sandalwood","Musk","Cedarwood"],["floral","sweet","vanilla","woody"],"Intense alive. Cardamom and vanilla. Bold femininity."),

// ════ PACO RABANNE extended ════
b(75081,"Paco Rabanne","One Million Royal Parfum","male",2022,4.18,"very_long","enormous",["fall","winter"],["Grapefruit","Rose"],["Cinnamon","Rose","Amber"],["Leather","Woody Notes","Patchouli"],["warm spicy","leather","amber","rose"],"Royal million. Rose and cinnamon. Most luxurious 1 Million."),
b(75082,"Paco Rabanne","Olympéa Intense EDP","female",2020,3.95,"very_long","strong",["fall","winter"],["Bergamot","Vanilla Flower"],["Jasmine Sambac","Ambergris"],["Vanilla","Cashmere","Sandalwood","Musk"],["floral","vanilla","amber","creamy"],"Olympéa intensity. Vanilla flower and ambergris. Divine."),
b(75083,"Paco Rabanne","Fame Parfum","female",2023,4.05,"very_long","strong",["fall","winter"],["Mango","Jasmine","Hawthorn"],["Jasmine","Ambrette"],["White Musks","Cedarwood","Ambrette"],["floral","fruity","musk","woody"],"Fame parfum. Mango and jasmine. Maximum celebrity."),

// ════ JEAN-PAUL GAULTIER extended ════
b(75084,"Jean Paul Gaultier","Classique Summer EDP","female",2022,3.75,"moderate","moderate",["spring","summer"],["Bergamot","Mandarin","Pink Pepper"],["Orris","Rose","Jasmine"],["Vanilla","Musk"],["floral","citrus","spicy","vanilla"],"Summer Classique. Mandarin and pink pepper. Seasonal luxury."),
b(75085,"Jean Paul Gaultier","Le Beau EDT","male",2019,3.88,"long","strong",["spring","summer"],["Coconut","Water","Bergamot"],["Jasmine","Aquatics"],["Amberwood","Musk","Sandalwood"],["aquatic","coconut","fresh","woody"],"Le Beau sea. Coconut and jasmine. Summer masculinity."),
b(75086,"Jean Paul Gaultier","Divine EDP","female",2022,3.92,"long","moderate",["spring","fall"],["Bergamot","Mandarin"],["Jasmine","Rose","Orris"],["Amber","Musk","Sandalwood"],["floral","citrus","amber","musk"],"Divine femininity. Rose and orris. New Gaultier era."),

// ════ VIKTOR & ROLF extended ════
b(75087,"Viktor & Rolf","Flowerbomb Dew EDP","female",2018,3.82,"long","moderate",["spring","summer"],["Bergamot","Peach","Berries"],["Rose","Jasmine","Freesia","Peony"],["Musk","Sandalwood"],["floral","fruity","fresh","musk"],"Flowerbomb fresh dew. Peach and freesia. Summer flower bomb."),
b(75088,"Viktor & Rolf","Spicebomb Infrared EDP","male",2021,3.95,"very_long","strong",["fall","winter"],["Pink Pepper","Red Apple"],["Cinnamon","Tobacco","Civet"],["Amber","Musk","Gaiac Wood"],["warm spicy","tobacco","amber","sweet"],"Infrared spicebomb. Red apple and tobacco. Hottest Spicebomb."),

// ════ GIVENCHY extended ════
b(75089,"Givenchy","L'Interdit Intense EDP","female",2020,3.98,"long","strong",["fall","winter"],["Bergamot","Black Currant"],["Tuberose","Orange Blossom","White Peach"],["Patchouli","Vetiver","Ambergris","Amber"],["floral","woody","amber","oriental"],"Intense forbidden. Tuberose and patchouli. Deeper darkness."),
b(75090,"Givenchy","Xeryus Rouge EDT","male",1995,3.72,"long","moderate",["fall","winter"],["Bergamot","Juniper","Mandarin","Grapefruit"],["Cedar","Vetiver","Leather","Cashmeran"],["Musk","Amber","Sandalwood"],["fougere","woody","aromatic","amber"],"Red Xeryus. Juniper and leather. 90s masculine classic."),

// ════ EXTRA NICHE LUXURY ════
b(62675,"Initio Parfums Privés","Paragon EDP","unisex",2020,4.18,"long","strong",["fall","winter"],["Bergamot","Cardamom","Coriander"],["Musk","Ambrette","Iso E Super"],["Sandalwood","Vetiver","Musk"],["musk","spicy","woody","aromatic"],"Paragon of beauty. Ambrette and iso E super. Clean power."),
b(62674,"Initio Parfums Privés","Atomic Rose EDP","female",2020,4.12,"long","strong",["spring","fall"],["Bergamot","Clary Sage"],["Rose","Magnolia","Ambrette"],["Musk","Sandalwood","Amber"],["rose","musk","floral","sweet"],"Atomic rose. Ambrette and magnolia. Rose reinvented."),
b(62673,"Initio Parfums Privés","Psychedelic Love EDP","unisex",2021,4.08,"long","strong",["fall","winter"],["Bergamot","Saffron","Cardamom"],["Rose","Oud","Amber"],["Sandalwood","Musk","Vanilla"],["oud","rose","spicy","sweet"],"Psychedelic. Rose and oud with saffron. Mind-altering luxury."),
b(62672,"Tiziana Terenzi","Hale Bopp EDP","unisex",2019,4.32,"very_long","enormous",["fall","winter"],["Bergamot","Cardamom"],["Amber","Oud","Rose","Jasmine"],["Sandalwood","Musk","Vanilla"],["oud","amber","floral","sweet"],"Hale Bopp comet. Oud and amber with rose. Spectacular."),
b(62671,"Tiziana Terenzi","Bianco Puro EDP","unisex",2018,4.08,"long","moderate",["spring","summer"],["Bergamot","Lemon"],["White Musk","Iris","Jasmine"],["Sandalwood","White Musk"],["musk","white floral","fresh","iris"],"Pure white. Clean musk and iris. Italian purity."),
b(62670,"Nishane","Afrika Olifant EDP","unisex",2019,4.18,"long","strong",["fall","winter"],["Bergamot","Saffron"],["Oud","Amber","Iris"],["Sandalwood","Musk","Patchouli"],["oud","iris","amber","spicy"],"African elephant. Oud and iris. Safari luxury."),
b(62669,"Nishane","Hacivat Nuit EDP","unisex",2020,4.28,"very_long","enormous",["fall","winter"],["Saffron","Bergamot","Cardamom"],["Oud","Oakmoss","Jasmine"],["Sandalwood","Amber","Musk"],["oud","spicy","amber","floral"],"Night Hacivat. Deeper and darker. Nocturnal masterpiece."),
b(52112,"Xerjoff","Italica EDP","unisex",2014,4.22,"very_long","strong",["fall","winter"],["Bergamot","Cardamom","Saffron"],["Rose","Oud","Jasmine"],["Sandalwood","Amber","Musk","Vanilla"],["oud","rose","amber","sweet"],"Roman legacy. Rose and saffron oud. Italian archaeology."),
b(52113,"Mancera","Moonlight EDP","unisex",2016,4.08,"long","strong",["fall","winter"],["Bergamot","Lemon"],["Musk","Iris","Amberwood"],["Sandalwood","Amber","White Musk"],["musk","woody","iris","amber"],"Moonlight magic. Iris and amberwood. Romantic night."),
b(52114,"Mancera","Dama Blanche EDP","female",2014,3.98,"long","moderate",["spring","fall"],["Bergamot","Lemon"],["White Flowers","Jasmine","Iris"],["White Musk","Sandalwood","Amber"],["white floral","floral","musk","fresh"],"White dame. White flowers and iris. Elegant feminine."),
b(52115,"Montale","Arabians EDP","unisex",2015,4.12,"long","strong",["fall","winter"],["Bergamot","Saffron"],["Oud","Rose","Incense"],["Sandalwood","Amber","Musk"],["oud","rose","incense","amber"],"Arabian spirit. Rose and incense oud. Desert luxury."),
b(52116,"Montale","Powder Flowers EDP","female",2010,3.92,"long","moderate",["spring","fall"],["Bergamot","Violet"],["Rose","Violet","Iris"],["White Musk","Amber"],["floral","violet","powdery","musk"],"Powder flowers. Violet and iris. Soft and feminine."),
b(52117,"Montale","Amandes Orientales EDP","unisex",2013,3.98,"long","strong",["fall","winter"],["Bergamot","Cardamom"],["Almond","Rose","Vanilla"],["Musk","Sandalwood","Amber"],["almond","sweet","rose","oriental"],"Oriental almonds. Rose and almond vanilla. Delicious luxury."),

// ════ WRAP-UP: some final unique entries ════
b(23483,"Al Haramain","Signature Gold EDP","unisex",2020,4.08,"very_long","strong",["fall","winter"],["Bergamot","Saffron","Cardamom"],["Rose","Oud","Amber","Jasmine"],["Sandalwood","Musk","Patchouli","Vanilla"],["oud","floral","amber","sweet"],"Golden signature. Saffron and oud rose. Heritage luxury."),
b(23484,"Swiss Arabian","Wazeer EDP","male",2018,4.12,"very_long","strong",["fall","winter"],["Bergamot","Cardamom"],["Oud","Amber","Rose"],["Sandalwood","Musk","Patchouli"],["oud","spicy","amber","rose"],"Minister oud. Cardamom and oud amber. Political luxury."),
b(23485,"Lattafa","Ramz Platinum EDP","unisex",2022,4.05,"very_long","strong",["fall","winter"],["Bergamot","Saffron"],["Oud","Rose","Amber"],["Sandalwood","Musk","Vanilla"],["oud","rose","amber","sweet"],"Platinum symbol. Saffron and rose oud. Arabic prestige."),
b(23486,"Rasasi","Nafaeis Al Shaghaf EDP","unisex",2018,4.0,"very_long","strong",["fall","winter"],["Bergamot","Cardamom","Saffron"],["Oud","Rose","Jasmine"],["Amber","Sandalwood","Musk"],["oud","floral","spicy","amber"],"Precious love. Rose and saffron oud. Pure Arabic."),
b(23487,"Armaf","Club de Nuit Milestone EDP","male",2019,4.12,"very_long","enormous",["fall","winter"],["Apple","Pineapple","Bergamot"],["Birch","Rose","Jasmine"],["Sandalwood","Musk","Ambergris","Vanilla"],["fruity","woody","fresh","sweet"],"Club milestone. Pineapple and birch. Premium Armaf."),
b(23488,"Armaf","Odyssey Man EDP","male",2016,4.02,"very_long","strong",["fall","winter"],["Bergamot","Cardamom","Nutmeg"],["Leather","Cedar","Amber"],["Sandalwood","Musk","Patchouli"],["leather","spicy","woody","amber"],"Odyssey. Cardamom and leather. Budget luxury masculine."),
b(23489,"Rasasi","Qasamat Boruzz EDP","unisex",2020,4.08,"very_long","strong",["fall","winter"],["Bergamot","Saffron","Cardamom"],["Oud","Rose","Amber"],["Sandalwood","Musk","Patchouli"],["oud","rose","spicy","amber"],"Oaths. Saffron and rose oud. Eastern promise."),
b(23490,"Afnan","Supremacy Noir EDP","unisex",2020,4.05,"very_long","strong",["fall","winter"],["Bergamot","Saffron"],["Oud","Rose","Incense"],["Amber","Sandalwood","Musk"],["oud","incense","rose","amber"],"Black supremacy. Incense and oud. Dark luxury."),
b(23491,"Paris Corner","Pendora Scent Blue Iris EDP","male",2022,3.95,"long","strong",["fall","winter"],["Bergamot","Cardamom","Saffron"],["Iris","Oud","Amber"],["Sandalwood","Musk","Patchouli"],["iris","oud","spicy","amber"],"Blue iris. Cardamom and iris oud. Premium clone-inspired."),
b(23492,"Maison Alhambra","Amber & Leather EDP","male",2022,3.98,"very_long","strong",["fall","winter"],["Bergamot","Cardamom"],["Leather","Amber","Sandalwood"],["Musk","Patchouli","Vetiver"],["leather","amber","woody","spicy"],"Amber leather. Cardamom and leather. Strong masculine."),
];

const existing=JSON.parse(readFileSync(DATA,"utf-8"));
console.log(`Mevcut: ${existing.length}`);
const seen=new Map(existing.map(p=>[`${p.brand}|${p.name}`.toLowerCase().trim(),true]));
let added=0;
const merged=[...existing];
for(const p of NEW){
  const key=`${p.brand}|${p.name}`.toLowerCase().trim();
  if(!seen.has(key)){seen.set(key,true);merged.push(p);added++;}
}
merged.forEach((p,i)=>{p.id=String(i+1);});
writeFileSync(DATA,JSON.stringify(merged,null,2),"utf-8");
console.log(`Eklenen: ${added}`);
console.log(`Toplam: ${merged.length}`);
