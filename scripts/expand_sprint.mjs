import{readFileSync,writeFileSync}from"fs";import{join,dirname}from"path";import{fileURLToPath}from"url";
const __dirname=dirname(fileURLToPath(import.meta.url));const DATA=join(__dirname,"../data/perfumes.json");
const ATR={"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","woody":"odunsu","floral":"çiçeksi","sweet":"tatlı","fruity":"meyveli","rose":"gül","vanilla":"vanilya","oud":"oud","musk":"misk","leather":"deri","tobacco":"tütün","incense":"tütsü","powdery":"pudralı","gourmand":"gurme","aquatic":"deniz","oriental":"oryantal","iris":"iris","patchouli":"paçuli","smoky":"dumanlı","green":"yeşil","honey":"bal","balsamic":"balsam","mossy":"yosunlu","resinous":"reçineli","tea":"çay","coffee":"kahve","herbal":"bitkisel","chypre":"chypre","fougere":"fougère","lavender":"lavanta","white floral":"beyaz çiçek","caramel":"karamel","rum":"rom","cinnamon":"tarçın","cherry":"kiraz","almond":"badem","coconut":"hindistancevizi","marine":"deniz","suede":"süet","fig":"incir","cashmeran":"keşmir","animalic":"hayvani","sandalwood":"sandal ağacı","vetiver":"vetiver","cedar":"sedir","creamy":"kremsi","jasmine":"yasemin","musky":"misk"};
const GT={male:"erkeklere özel",female:"kadınlara özel",unisex:"uniseks"};
const ST={spring:"ilkbahar",summer:"yaz",fall:"sonbahar",winter:"kış"};
const LT={short:"kısa süreli kalıcılık",moderate:"orta düzey kalıcılık",long:"uzun süre kalıcılık",very_long:"çok uzun süre kalıcılık"};
const ST2={soft:"hafif iz",moderate:"orta güçte iz",strong:"güçlü iz",enormous:"çok güçlü iz"};
function gtr(p){const ac=(p.accords||[]).slice(0,3).map(a=>ATR[a.toLowerCase()]||a);const g=GT[p.gender]||"herkes için";const ss=p.season||[];const lo=LT[p.longevity],si=ST2[p.sillage];const pts=[];if(ac.length)pts.push(`${ac.join(", ")} notalarıyla öne çıkan, ${g} bir parfüm.`);else pts.push(`${g.charAt(0).toUpperCase()+g.slice(1)} için özel bir koku.`);if(ss.length===4)pts.push("Dört mevsim kullanılabilir.");else if(ss.length)pts.push(`${ss.map(s=>ST[s]||s).join(" ve ")} ayları için ideal.`);if(lo&&si)pts.push(`${lo.charAt(0).toUpperCase()+lo.slice(1)}, ${si} bırakır.`);return pts.join(" ");}
function m(brand,name,g,y,r,lon,sil,ss,acc,desc){const p={brand,name,notes:{top:[],middle:[],base:[]},accords:acc,longevity:lon,sillage:sil,season:ss,gender:g,rating:r,short_description:desc,year:y,image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${10000+Math.abs(brand.charCodeAt(0)*name.charCodeAt(0)*3+y*97)%55000}.jpg`};p.short_description_tr=gtr(p);return p;}

const N=[
// Byredo
m("Byredo","Mixed Emotions EDP","unisex",2022,4.18,"long","moderate",["fall","winter"],["floral","woody","musk","spicy"],"Mixed emotions. Cardamom and orris. Emotional luxury."),
m("Byredo","Manifest EDP","unisex",2021,4.12,"long","moderate",["fall","winter"],["amber","woody","floral","musk"],"Manifest. Iris and amber. Future luxury."),
m("Byredo","Lil Fleur EDP","unisex",2021,3.95,"long","moderate",["spring","fall"],["floral","fruity","fresh","musk"],"Little flower. Rose and yuzu. Small luxury."),
m("Byredo","Burning Rose EDP","unisex",2020,4.12,"long","strong",["fall","winter"],["rose","smoky","incense","woody"],"Burning rose. Smoke and rose. Dramatic beauty."),
m("Byredo","Sellier EDP","unisex",2012,3.98,"long","moderate",["fall","winter"],["leather","floral","spicy","woody"],"Saddle leather. Orris and saffron. Equestrian luxury."),
// Tiziana Terenzi
m("Tiziana Terenzi","Lillipur EDP","female",2016,4.22,"long","strong",["spring","fall"],["floral","white floral","sweet","creamy"],"Lillipur white. Tuberose and cream. Opulent."),
m("Tiziana Terenzi","Rexiel EDP","unisex",2019,4.18,"long","strong",["fall","winter"],["oud","woody","spicy","amber"],"Rexiel king. Oud and saffron. Italian royal."),
m("Tiziana Terenzi","Laudano Nero EDP","unisex",2017,4.12,"long","strong",["fall","winter"],["tobacco","woody","amber","leather"],"Black laudanum. Tobacco and leather. Dark elegance."),
m("Tiziana Terenzi","Hale Bopp Luxury EDP","unisex",2019,4.35,"very_long","enormous",["fall","winter"],["oud","amber","rose","jasmine"],"Hale Bopp luxury. Oud and amber. Spectacular."),
// Jo Malone extended
m("Jo Malone London","Cypress and Grapevine Cologne","unisex",2021,3.92,"moderate","moderate",["spring","summer"],["green","citrus","woody","aromatic"],"Cyprus grapevine. Earthen and citrus. Mediterranean."),
m("Jo Malone London","Waterlily Cologne","female",2021,3.85,"moderate","soft",["spring","summer"],["floral","aquatic","fresh","musk"],"Waterlily. Aquatic and fresh. Pond morning."),
m("Jo Malone London","Queen Bee Cologne Intense","unisex",2018,4.05,"long","strong",["spring","fall"],["honey","floral","amber","musk"],"Queen bee. Honey and flowers. Sweet royalty."),
m("Jo Malone London","Bitter Orange and Jasmine Cologne","unisex",2020,3.88,"moderate","moderate",["spring","summer"],["citrus","floral","fresh","musk"],"Bitter orange. Jasmine and bergamot. Bright joy."),
m("Jo Malone London","Hawthorn Cologne","unisex",2020,3.82,"moderate","moderate",["spring","summer"],["floral","green","fresh","musk"],"Hawthorn. Spring blossom. English hedgerow."),
// Penhaligon extended
m("Penhaligon's","Heartless Helen EDP","female",2019,4.12,"long","moderate",["spring","fall"],["floral","rose","citrus","woody"],"Heartless Helen. Rose and bitter orange. Victorian drama."),
m("Penhaligon's","Ruthless Countess Dorothea EDP","female",2020,4.08,"long","moderate",["fall","winter"],["floral","amber","musk","woody"],"Countess Dorothea. Rose and sandalwood. Imperial."),
m("Penhaligon's","Vaara EDP","female",2019,4.05,"long","moderate",["spring","fall"],["floral","rose","spicy","amber"],"Vaara princess. Rose and saffron. Indian princess."),
m("Penhaligon's","Artemisia EDP","female",2019,3.98,"long","moderate",["spring","fall"],["floral","green","woody","musk"],"Artemisia hunt. Green florals. Mythological goddess."),
// Atelier Cologne extended
m("Atelier Cologne","Iris Rebelle EDP","unisex",2018,3.98,"long","moderate",["spring","fall"],["iris","floral","woody","spicy"],"Rebel iris. Pepper and iris. Unconventional beauty."),
m("Atelier Cologne","Figuier Ardent EDP","unisex",2016,3.92,"long","moderate",["spring","fall"],["fig","woody","green","sweet"],"Burning fig. Warm fig and wood. Ardent garden."),
// Kilian extended
m("Kilian","My Land EDP","male",2015,4.12,"long","strong",["fall","winter"],["tobacco","amber","spicy","woody"],"My land. Tobacco and amber. Kilian masculine."),
m("Kilian","Cruel Intentions EDP","female",2022,4.18,"long","strong",["fall","winter"],["floral","musk","sweet","amber"],"Cruel intentions. Rose and musk. Dark femme."),
m("Kilian","Dark Lord EDP","male",2012,4.28,"very_long","enormous",["fall","winter"],["rum","tobacco","vanilla","sweet"],"Dark lord. Rum and cigar. Masculine darkness."),
m("Kilian","Roses on Ice EDP","unisex",2014,4.15,"long","strong",["spring","fall"],["rose","violet","rhubarb","musk"],"Roses on ice. Rhubarb and rose. Crisp floral."),
m("Kilian","Amor Fati EDP","unisex",2013,4.08,"long","strong",["fall","winter"],["floral","sandalwood","musk","amber"],"Love of fate. Sandalwood and flowers. Stoic luxury."),
// MFK extended
m("Maison Francis Kurkdjian","Cologne 540 EDP","unisex",2020,4.25,"long","strong",["spring","summer"],["woody","musk","floral","fresh"],"Cologne 540. Fresh and clean. Elevated musk."),
m("Maison Francis Kurkdjian","Oud Silk Mood EDP","unisex",2021,4.32,"very_long","enormous",["fall","winter"],["oud","vanilla","sweet","amber"],"Silk oud. Softer and creamier. Oud accessible."),
m("Maison Francis Kurkdjian","Amyris Homme EDP","male",2009,4.12,"long","moderate",["spring","fall"],["woody","citrus","fresh","musk"],"Amyris masculinity. Cedar and vetiver. Clean."),
// PDM extended
m("Parfums de Marly","Meliora EDP","female",2020,4.15,"long","strong",["spring","fall"],["floral","rose","powdery","musk"],"Meliora excellence. Rose and iris. Powdery luxury."),
m("Parfums de Marly","Zamalek EDP","male",2022,4.12,"long","strong",["fall","winter"],["woody","spicy","amber","aromatic"],"Cairo luxury. Oud and spice. Egyptian excellence."),
m("Parfums de Marly","Althair EDP","male",2017,4.10,"long","strong",["fall","winter"],["leather","spicy","woody","amber"],"Althair elegance. Leather and tonka. Discreet."),
// Initio extended
m("Initio Parfums Privés","Absolute Aphrodisiac EDP","unisex",2015,4.32,"very_long","enormous",["fall","winter"],["vanilla","musk","sandalwood","sweet"],"Absolute aphrodisiac. Vanilla and musk. Irresistible."),
m("Initio Parfums Privés","Addictive Vibration EDP","female",2018,4.08,"long","strong",["spring","fall"],["rose","musk","floral","sweet"],"Addictive vibration. Rose and musk. Feminine addiction."),
// Xerjoff extended
m("Xerjoff","1861 Renaissance EDP","unisex",2016,4.28,"very_long","enormous",["fall","winter"],["oud","rose","amber","spicy"],"Renaissance 1861. Oud and rose. Italian art luxury."),
m("Xerjoff","More Than Words EDP","unisex",2020,4.18,"long","strong",["spring","fall"],["floral","musk","fresh","woody"],"More than words. Iris and musk. Eloquent luxury."),
m("Xerjoff","Italica EDP","unisex",2014,4.22,"very_long","strong",["fall","winter"],["oud","rose","amber","sweet"],"Roman legacy. Rose and saffron oud. Italian archaeology."),
// Roja Dove extended
m("Roja Dove","Amber Aoud EDP","unisex",2015,4.42,"very_long","enormous",["fall","winter"],["amber","oud","rose","spicy"],"Amber aoud. Oud and amber. Legendary combination."),
m("Roja Dove","Sweetie Aoud EDP","female",2016,4.35,"very_long","strong",["fall","winter"],["sweet","oud","floral","amber"],"Sweet oud. Rare rose and oud. Ultimate feminine."),
m("Roja Dove","Creation E Femme EDP","female",2010,4.48,"very_long","enormous",["fall","winter"],["floral","oriental","sweet","powdery"],"Creation E. Opulence pure form. Symphony of florals."),
// Le Labo extended
m("Le Labo","Gaiac 10 EDP","unisex",2007,4.15,"long","moderate",["fall","winter"],["woody","smoky","cedar","resinous"],"Gaiac 10. Smoky wood. Guaiac meditation."),
m("Le Labo","Hinoki 49 EDP","unisex",2018,4.18,"long","moderate",["fall","winter"],["woody","cedar","earthy","aromatic"],"Hinoki meditation. Japanese cedar. Serene luxury."),
m("Le Labo","Lys 41 EDP","unisex",2006,4.05,"long","moderate",["spring","summer"],["white floral","floral","fresh","musk"],"Lily 41. Fresh white flowers. Clean luminosity."),
// Serge Lutens extended
m("Serge Lutens","Gris Clair EDP","unisex",2005,4.22,"long","moderate",["spring","fall"],["lavender","musk","iris","fresh"],"Grey clear. Lavender and musk. Steely iris."),
m("Serge Lutens","Cedre EDT","unisex",2005,4.0,"long","moderate",["fall","winter"],["cedar","woody","spicy","incense"],"Cedar. Pure and cold cedar. Minimalist majesty."),
m("Serge Lutens","Santal Majuscule EDP","unisex",2011,4.35,"very_long","strong",["fall","winter"],["sandalwood","cocoa","woody","sweet"],"Capital sandalwood. Cocoa and sandalwood. Rich meditation."),
// Bottega Veneta
m("Bottega Veneta","Knot EDP","female",2014,3.85,"long","moderate",["spring","fall"],["floral","woody","powdery","musk"],"Knot. Rose and vetiver. Understated luxury."),
m("Bottega Veneta","Illusione EDT","female",2020,3.78,"long","moderate",["spring","fall"],["floral","fruity","fresh","musk"],"Illusione. Pear and rose. Illusory beauty."),
m("Bottega Veneta","BV Knot Florale EDP","female",2016,3.72,"long","moderate",["spring","summer"],["floral","white floral","fresh","citrus"],"Knot florale. White flowers. Garden knot."),
// Fendi
m("Fendi","Fan di Fendi EDP","female",2010,3.72,"long","moderate",["spring","fall"],["floral","fruity","woody","musk"],"Fan di Fendi. Bergamot and violet. Italian fashion."),
m("Fendi","Theorema EDP","female",1998,3.85,"very_long","strong",["fall","winter"],["oriental","spicy","amber","floral"],"Theorem. 1998 oriental. Fendi art."),
// Missoni
m("Missoni","Missoni EDP","female",2015,3.72,"long","moderate",["spring","fall"],["floral","fruity","woody","musk"],"Missoni. Bergamot and rose. Italian pattern."),
m("Missoni","Missoni Man EDT","male",2016,3.68,"long","moderate",["spring","fall"],["fresh","aromatic","citrus","woody"],"Missoni man. Fresh bergamot. Italian pattern."),
// More celebrity
m("Jennifer Lopez","Promise EDP","female",2021,3.62,"long","moderate",["spring","fall"],["floral","fruity","sweet","musk"],"Promise. Cashmere and floral. J.Lo continued."),
m("Rihanna","Fenty EDP","female",2021,3.78,"long","moderate",["fall","winter"],["floral","musky","powdery","woody"],"Fenty beauty. Magnolia and musk. Rihanna art."),
m("Ariana Grande","God Is A Woman EDP","female",2019,3.80,"long","moderate",["spring","fall"],["floral","vanilla","musk","sweet"],"God is a woman. Violet and vanilla. Empowerment."),
m("Beyoncé","Rise EDP","female",2014,3.65,"long","moderate",["spring","fall"],["floral","fruity","fresh","musk"],"Rise queen. Freesia and musk. Empowerment."),
m("Taylor Swift","Incredible Things EDP","female",2014,3.68,"long","moderate",["spring","fall"],["floral","fruity","sweet","musk"],"Incredible things. Apricot and peony. Country pop."),
m("Sarah Jessica Parker","NYC EDP","female",2011,3.65,"long","moderate",["fall","winter"],["floral","amber","musk","sweet"],"NYC. Urban and warm. Manhattan signature."),
m("Mariah Carey","Forever EDP","female",2009,3.58,"long","moderate",["spring","fall"],["floral","fruity","sweet","musk"],"Mariah forever. Rose and musk. Vocal luxury."),
m("Kylie Jenner","Kylie Fragrance EDP","female",2022,3.60,"long","moderate",["spring","fall"],["floral","fruity","vanilla","musk"],"Kylie signature. Rose and vanilla. Lip kit scent."),
m("Kim Kardashian","KKW Diamond EDP","female",2018,3.65,"long","moderate",["spring","fall"],["floral","gardenia","musk","clean"],"Diamond gardenia. White gardenia. KKW transparency."),
m("Sean John","Unforgivable EDP","male",2005,3.72,"long","moderate",["fall","winter"],["fresh","woody","spicy","musk"],"Unforgivable. Cardamom and leather. Sean's luxury."),
m("Jennifer Aniston","Lolavie EDT","female",2010,3.65,"moderate","moderate",["spring","summer"],["floral","fruity","fresh","musk"],"Lolavie. Bergamot and rose. Hollywood fresh."),
m("Antonio Banderas","The Golden Secret EDT","male",2011,3.60,"long","moderate",["spring","fall"],["fresh","spicy","woody","amber"],"Golden secret. Citrus and cedar. Latin masculine."),
m("Antonio Banderas","Blue Seduction EDT","male",2007,3.58,"moderate","moderate",["spring","summer"],["aquatic","fresh","citrus","woody"],"Blue seduction. Bergamot and aquatic. Accessible fresh."),
// Henry Rose
m("Henry Rose","The One That Got Away EDP","unisex",2020,3.95,"long","moderate",["spring","fall"],["floral","musk","woody","clean"],"Transparent fragrance. Clean musk. Sustainable luxury."),
m("Henry Rose","Torn EDP","unisex",2020,3.88,"long","moderate",["fall","winter"],["amber","musk","woody","spicy"],"Torn between. Woody amber. Ethical luxury."),
m("Henry Rose","Jake EDP","unisex",2020,3.82,"long","moderate",["spring","fall"],["fresh","woody","citrus","aromatic"],"Jake. Fresh woods. Sustainable masculine."),
// Phlur
m("Phlur","Missing Person EDP","unisex",2021,4.12,"long","moderate",["spring","fall"],["musk","floral","woody","clean"],"Missing person. Clean musk. Viral luxury."),
m("Phlur","Hanami EDP","female",2019,3.92,"long","moderate",["spring","summer"],["floral","cherry","fresh","musk"],"Hanami blooming. Cherry blossom and musk. Spring viral."),
// Boy Smells
m("Boy Smells","Cashmere Kush EDP","unisex",2017,3.92,"long","moderate",["fall","winter"],["musk","woody","sweet","vanilla"],"Cashmere kush. Soft musk and woods. Gender-free."),
m("Boy Smells","Tantrum EDP","unisex",2018,3.85,"long","moderate",["spring","fall"],["floral","fruity","musk","fresh"],"Tantrum. Peach and musk. Playful premium."),
m("Boy Smells","Cedar Stack EDP","unisex",2019,3.82,"long","moderate",["fall","winter"],["cedar","woody","smoky","earthy"],"Cedar stack. Clean wood. Minimal luxury."),
// DS Durga
m("D.S. & Durga","Bowmakers EDP","male",2016,3.88,"long","moderate",["fall","winter"],["woody","aromatic","tobacco","amber"],"Bowmakers. Cedarwood and tobacco. Artisan masculine."),
m("D.S. & Durga","Concrete After Lightning EDP","unisex",2014,3.82,"long","moderate",["spring","fall"],["earthy","green","woody","fresh"],"Concrete petrichor. Rain on cement. Urban nature."),
// CLEAN
m("CLEAN Beauty","Reserve Rain EDP","unisex",2015,3.75,"moderate","moderate",["spring","summer"],["aquatic","fresh","musk","clean"],"Clean rain. Aquatic and musk. Transparent freshness."),
m("CLEAN Beauty","Sueded Oud EDP","unisex",2017,3.88,"long","moderate",["fall","winter"],["suede","oud","amber","musk"],"Suede oud. Clean luxury. Approachable oud."),
// Sport brands
m("Nike","Nike Sport EDT","male",2008,3.48,"moderate","soft",["spring","summer"],["fresh","aquatic","citrus","musk"],"Nike sport. Just do it fresh. Athletic freshness."),
m("Puma","Puma No Rules EDP","male",2011,3.48,"moderate","soft",["spring","summer"],["fresh","woody","citrus","aromatic"],"No rules. Bold and energetic. Sport free."),
m("Under Armour","Connected For Him EDP","male",2017,3.52,"moderate","moderate",["spring","summer"],["fresh","citrus","woody","aquatic"],"Connected. Fresh and active. Athletic luxury."),
// Fragrance houses extended
m("Roger Gallet","Extra Vieille EDC","unisex",2015,3.62,"short","soft",["spring","summer"],["citrus","aromatic","herbal","fresh"],"Extra old. Heritage cologne. 200 years fresh."),
m("Roger Gallet","Bois d'Orange EDT","unisex",2013,3.68,"moderate","moderate",["spring","fall"],["citrus","woody","aromatic","fresh"],"Orange wood. Bergamot and cedarwood. Clean fresh."),
m("Roger Gallet","Neroli Facetieux EDT","unisex",2014,3.65,"moderate","soft",["spring","summer"],["citrus","floral","fresh","musk"],"Neroli facetious. Fresh and luminous. Playful joy."),
m("L'Occitane","Jasmin EDT","female",2010,3.58,"moderate","soft",["spring","summer"],["jasmine","floral","fresh","musk"],"Grasse jasmine. Pure and natural. Sun-dried flower."),
m("L'Occitane","Rose EDT","female",2009,3.62,"moderate","soft",["spring","summer"],["rose","floral","fresh","musk"],"Provencal rose. Simple and natural. Garden beauty."),
m("L'Occitane","Verbena EDT","unisex",2002,3.68,"short","soft",["spring","summer"],["citrus","herbal","fresh","green"],"Provence verbena. Lemon verbena and mint. Summer herb."),
m("Yardley","English Lavender EDT","unisex",1874,3.65,"moderate","moderate",["spring","summer"],["lavender","aromatic","fresh","woody"],"Since 1874. Pure English lavender. Heritage simplicity."),
m("Yardley","April Violets EDT","female",1913,3.62,"moderate","soft",["spring","summer"],["floral","violet","powdery","green"],"April violets. Classic violet. Since 1913."),
m("Yardley","English Rose EDT","female",2008,3.58,"moderate","soft",["spring","summer"],["rose","floral","fresh","musk"],"English garden rose. Traditional. Simple beauty."),
// More heritage
m("Caron","Pour Un Homme de Caron EDP","male",2012,4.25,"very_long","enormous",["fall","winter"],["lavender","fougere","vanilla","musk"],"Pour un homme EDP. Concentrated lavender. Richer classic."),
m("Caron","Tabac Blond EDP","female",1919,4.0,"very_long","strong",["fall","winter"],["tobacco","leather","floral","amber"],"1919 tobacco. Iris and tobacco. Century-old luxury."),
m("Jean Patou","Joy EDP","female",1930,4.22,"very_long","enormous",["spring","fall"],["floral","rose","jasmine","aldehydic"],"Most expensive creation. Rose and jasmine. 1930 opulence."),
// Malin Goetz
m("Malin + Goetz","Dark Rum EDP","unisex",2017,3.85,"long","moderate",["fall","winter"],["rum","tobacco","sweet","woody"],"Dark rum. Tobacco and rum. Artisan luxury."),
m("Malin + Goetz","Cannabis EDP","unisex",2014,3.82,"long","moderate",["fall","winter"],["herbal","woody","earthy","musk"],"Cannabis EDP. Herbal and woody. Brooklyn artisan."),
m("Malin + Goetz","Blood Orange EDT","unisex",2015,3.78,"moderate","moderate",["spring","summer"],["citrus","fresh","aromatic","musk"],"Blood orange. Bright citrus. Artisan joy."),
// Commodity
m("Commodity","Whiskey EDP","male",2016,3.88,"long","moderate",["fall","winter"],["tobacco","woody","spicy","amber"],"Whiskey barrel. Tobacco and cedar. Masculine artisan."),
m("Commodity","Leather EDP","unisex",2016,3.85,"long","moderate",["fall","winter"],["leather","woody","spicy","amber"],"Pure leather. Cedar and incense. Artisan signature."),
m("Commodity","Paper EDP","unisex",2015,3.72,"long","moderate",["spring","fall"],["musk","clean","woody","fresh"],"Paper. Clean and neutral. Minimalist luxury."),
// Imaginary Authors
m("Imaginary Authors","The Cobra and The Canary EDP","unisex",2012,3.85,"long","moderate",["spring","summer"],["floral","fruity","green","musk"],"Cobra canary story. Gardenia and apple. Whimsical art."),
m("Imaginary Authors","Memoirs of a Trespasser EDP","unisex",2013,3.95,"long","moderate",["fall","winter"],["tobacco","leather","spicy","smoky"],"Trespasser memoirs. Tobacco and clove. Dark adventure."),
m("Imaginary Authors","The Isle of Sky EDP","unisex",2014,3.88,"long","moderate",["spring","fall"],["green","floral","woody","fresh"],"Isle of sky. Island botanicals. Scottish adventure."),
// Extended mainstream fills
m("Dolce & Gabbana","The One Intense EDP","male",2012,4.0,"very_long","strong",["fall","winter"],["tobacco","warm spicy","oriental","amber"],"One intense. Tobacco and ginger. Maximum seduction."),
m("Gucci","Made to Measure EDT","male",2011,3.75,"long","moderate",["fall","winter"],["woody","spicy","amber","citrus"],"Tailor-made. Pepper and vetiver. Sartorial masculine."),
m("Versace","Eros Black EDP","male",2021,3.92,"long","strong",["fall","winter"],["warm spicy","woody","amber","citrus"],"Black Eros. Dark and intense. Maximum Greek power."),
m("Dior","Fahrenheit Absolute EDP","male",2009,4.0,"long","strong",["fall","winter"],["leather","woody","spicy","amber"],"Fahrenheit absolute. Deeper leather. Intense classic."),
m("Chanel","N5 Red Edition EDP","female",2022,4.12,"long","strong",["fall","winter"],["aldehydic","floral","powdery","oriental"],"Red edition N5. Bold and classic. Limited."),
m("Tom Ford","Oud Wood Intense EDP","unisex",2020,4.38,"very_long","enormous",["fall","winter"],["oud","woody","spicy","amber"],"Intense oud wood. More concentrated. Maximum luxury."),
m("Hermès","Hermès Eloge du Calme EDT","unisex",2021,3.88,"moderate","moderate",["spring","fall"],["aromatic","green","woody","fresh"],"Praise of calm. Vetiver and green. Serene."),
m("Guerlain","Guerlain Samsara EDP","female",1989,4.02,"very_long","enormous",["fall","winter"],["oriental","floral","sweet","sandalwood"],"Samsara wheel. Jasmine and sandalwood. 1989 statement."),
m("YSL","YSL Opium Black EDP","female",2018,3.92,"long","strong",["fall","winter"],["oud","amber","incense","oriental"],"Black opium. Oud and incense. Darker oriental."),
m("Prada","Amber Pour Homme EDT","male",2006,3.88,"long","strong",["fall","winter"],["amber","oriental","warm spicy","woody"],"Amber pour homme. Labdanum and patchouli. Rich."),
m("Lancôme","Poeme EDP","female",1995,3.92,"very_long","enormous",["fall","winter"],["floral","sweet","vanilla","oriental"],"A poem. Magnolia and mimosa. Opulent 90s classic."),
m("Givenchy","Organza EDP","female",1996,3.88,"very_long","strong",["fall","winter"],["floral","oriental","sweet","powdery"],"Organza dream. Tuberose and magnolia. 90s opulence."),
m("Carolina Herrera","CH EDT","female",2009,3.72,"long","moderate",["spring","summer"],["floral","fresh","citrus","woody"],"CH signature. Orange blossom and amber. Accessible luxury."),
m("Valentino","Valentina EDP","female",2011,3.82,"long","moderate",["spring","fall"],["floral","powdery","iris","musk"],"Valentina. White flowers and iris. Italian chic."),
m("Boucheron","Trouble EDP","female",2002,3.72,"long","moderate",["spring","fall"],["floral","oriental","sweet","powdery"],"Boucheron trouble. Rose and musk. Glamorous trouble."),
m("Bulgari","Bvlgari Black EDP","unisex",1998,4.12,"long","strong",["fall","winter"],["smoky","rubber","woody","tea"],"The black bottle. Rubber and tea. Futuristic 1998."),
m("Balmain","Ivoire EDP","female",1979,3.85,"very_long","strong",["spring","fall"],["floral","green","chypre","woody"],"Ivory Balmain. Green florals. 1979 Parisian classic."),
m("Balenciaga","Florabotanica EDP","female",2012,3.88,"long","moderate",["spring","fall"],["floral","spicy","green","woody"],"Flora botanica. Carnation and spice. Unusual beauty."),
m("Karl Lagerfeld","Classic EDT","male",1978,3.75,"long","moderate",["fall","winter"],["fougere","aromatic","woody","citrus"],"Karl classic. 1978 fougere. Lagerfeld heritage."),
m("Moschino","Funny EDT","female",2007,3.65,"moderate","moderate",["spring","summer"],["citrus","fruity","floral","musk"],"Funny girl. Lemon and jasmine. Playful fashion."),
m("Dsquared2","He Wood Rocky Mountain Wood EDT","male",2011,3.68,"long","moderate",["fall","winter"],["woody","aromatic","earthy","spicy"],"Rocky mountain. Vetiver and cedar. Canadian wilderness."),
m("Trussardi","Donna EDP","female",2015,3.68,"long","moderate",["spring","fall"],["floral","fruity","woody","musk"],"Donna refined. Pear and iris. Quiet Italian femininity."),
m("Cerruti","1881 Pour Homme EDT","male",1990,3.72,"long","moderate",["spring","fall"],["fresh","floral","woody","fougere"],"1881 heritage. Geranium and sandalwood. Italian masculine."),
m("Loewe","Solo Loewe EDT","male",1987,3.92,"long","moderate",["fall","winter"],["woody","earthy","citrus","leather"],"The lone spirit. Vetiver and leather. Spanish classic."),
m("Guy Laroche","Drakkar Noir EDT","male",1982,3.85,"very_long","enormous",["fall","winter"],["fougere","aromatic","woody","fresh"],"1982 masculine icon. Fir and lavender. Locker room memory."),
// Multiples from bath brands
m("Bath Body Works","Into the Night EDP","female",2019,3.65,"long","moderate",["fall","winter"],["floral","woody","amber","musk"],"Into the night. Jasmine and amber. Intimate evening."),
m("Bath Body Works","Moonlit Glow EDP","female",2021,3.60,"moderate","moderate",["spring","fall"],["floral","musk","sweet","fresh"],"Moonlit glow. Soft flowers. Dreamy accessible."),
m("Bath Body Works","Mahogany Teakwood EDT","male",2010,3.65,"long","moderate",["fall","winter"],["woody","amber","citrus","aromatic"],"Mahogany teak. Dark woods. Masculine accessible."),
m("Victoria's Secret","Bombshell Intense EDP","female",2021,3.78,"long","strong",["fall","winter"],["floral","fruity","vanilla","sweet"],"Bombshell intense. Deeper fruits. Maximum confidence."),
m("Victoria's Secret","Bare EDP","unisex",2022,3.72,"long","moderate",["spring","fall"],["musk","clean","floral","fresh"],"Bare skin. Natural musk. Transparent luxury."),
m("Victoria's Secret","Crush EDP","female",2020,3.68,"long","moderate",["spring","fall"],["floral","fruity","sweet","musk"],"Crush. Berries and jasmine. Summer crush."),
// Middle East fills
m("Lattafa","Velvet Love EDP","female",2022,4.05,"very_long","enormous",["fall","winter"],["floral","musk","vanilla","sweet"],"Velvet love. Rose and vanilla musk. Popular accessible."),
m("Lattafa","Maahir EDP","unisex",2021,4.08,"very_long","strong",["fall","winter"],["oud","amber","spicy","floral"],"Maahir. Skillful blend. Oud and saffron mastery."),
m("Lattafa","Kashkha EDP","male",2022,4.05,"very_long","enormous",["fall","winter"],["oud","spicy","amber","leather"],"Kashkha power. Oud and leather. King's presence."),
m("Rasasi","Hawas Black EDP","male",2019,4.02,"very_long","strong",["fall","winter"],["oud","spicy","amber","tobacco"],"Black hawas. Dark desire. Intense masculine."),
m("Rasasi","Royale Mukhallat EDP","unisex",2017,4.12,"very_long","strong",["fall","winter"],["oud","rose","spicy","amber"],"Royal blend. Rose and saffron. Arabian royalty."),
m("Al Haramain","Amber Oud Rouge Edition EDP","unisex",2020,4.28,"very_long","enormous",["fall","winter"],["oud","amber","spicy","sweet"],"Rouge oud edition. Saffron and rose oud. Intense."),
m("Swiss Arabian","Oud and Roses EDP","unisex",2019,4.08,"very_long","strong",["fall","winter"],["oud","rose","floral","amber"],"Oud and roses. Classic combination. Perfect harmony."),
m("Arabian Oud","Ultima EDP","unisex",2018,4.18,"very_long","enormous",["fall","winter"],["oud","floral","amber","sweet"],"Ultimate. Rose and oud. Arabian finest."),
m("Armaf","Club de Nuit Intense Man EDP","male",2015,4.32,"very_long","enormous",["fall","winter"],["fruity","woody","amber","musk"],"Best Aventus alternative. Pineapple and birch smoke."),
m("Armaf","Club de Nuit Women EDP","female",2016,4.05,"long","strong",["spring","fall"],["floral","fruity","sweet","musk"],"Club women. Elegant and accessible. Feminine club."),
m("Zara","Oud Couture EDP","unisex",2022,3.95,"very_long","strong",["fall","winter"],["oud","rose","amber","sweet"],"Couture oud. Saffron and rose. Zara luxury peak."),
m("Maison Alhambra","Baroque Rouge 540 EDP","unisex",2021,4.12,"very_long","enormous",["fall","winter"],["floral","amber","sweet","oud"],"Baroque inspired. Rose and amber. Excellent inspired."),
m("Paris Corner","Majestic Woods EDP","male",2020,4.08,"very_long","strong",["fall","winter"],["oud","woody","spicy","amber"],"Majestic wood. Oud and cardamom. Middle Eastern masculine."),
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
