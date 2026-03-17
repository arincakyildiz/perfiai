import{readFileSync,writeFileSync}from"fs";import{join,dirname}from"path";import{fileURLToPath}from"url";
const __dirname=dirname(fileURLToPath(import.meta.url));const DATA=join(__dirname,"../data/perfumes.json");
const ATR={"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","musky":"misk","woody":"odunsu","floral":"çiçeksi","sweet":"tatlı","fruity":"meyveli","rose":"gül","vanilla":"vanilya","oud":"oud","musk":"misk","leather":"deri","tobacco":"tütün","incense":"tütsü","powdery":"pudralı","gourmand":"gurme","aquatic":"deniz","oriental":"oryantal","iris":"iris","patchouli":"paçuli","sandalwood":"sandal ağacı","smoky":"dumanlı","green":"yeşil","jasmine":"yasemin","honey":"bal","balsamic":"balsam","mossy":"yosunlu","resinous":"reçineli","creamy":"kremsi","almond":"badem","coconut":"hindistancevizi","tea":"çay","coffee":"kahve","herbal":"bitkisel","marine":"deniz","chypre":"chypre","fougere":"fougère","lavender":"lavanta","suede":"süet","animalic":"hayvani","white floral":"beyaz çiçek","caramel":"karamel","rum":"rom","cinnamon":"tarçın","pepper":"biber","cedar":"sedir","vetiver":"vetiver","cashmeran":"keşmir","fig":"incir","cherry":"kiraz"};
const GT={male:"erkeklere özel",female:"kadınlara özel",unisex:"uniseks"};
const ST={spring:"ilkbahar",summer:"yaz",fall:"sonbahar",winter:"kış"};
const LT={short:"kısa süreli kalıcılık",moderate:"orta düzey kalıcılık",long:"uzun süre kalıcılık",very_long:"çok uzun süre kalıcılık"};
const ST2={soft:"hafif iz",moderate:"orta güçte iz",strong:"güçlü iz",enormous:"çok güçlü iz"};
function gtr(p){const ac=(p.accords||[]).slice(0,3).map(a=>ATR[a.toLowerCase()]||a);const g=GT[p.gender]||"herkes için";const ss=p.season||[];const lo=LT[p.longevity],si=ST2[p.sillage];const pts=[];if(ac.length)pts.push(`${ac.join(", ")} notalarıyla öne çıkan, ${g} bir parfüm.`);else pts.push(`${g.charAt(0).toUpperCase()+g.slice(1)} için özel bir koku.`);if(ss.length===4)pts.push("Dört mevsim kullanılabilir.");else if(ss.length)pts.push(`${ss.map(s=>ST[s]||s).join(" ve ")} ayları için ideal.`);if(lo&&si)pts.push(`${lo.charAt(0).toUpperCase()+lo.slice(1)}, ${si} bırakır.`);return pts.join(" ");}
function m(brand,name,g,y,r,lon,sil,ss,acc,desc){const p={brand,name,notes:{top:[],middle:[],base:[]},accords:acc,longevity:lon,sillage:sil,season:ss,gender:g,rating:r,short_description:desc,year:y,image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${10000+Math.abs(brand.charCodeAt(0)*name.charCodeAt(0)+y*100)%55000}.jpg`};p.short_description_tr=gtr(p);return p;}

const NEW=[
// ═══ VALENTINO (eksikler) ═══
m("Valentino","Valentino Donna Acqua EDT","female",2019,3.75,"moderate","soft",["spring","summer"],["aquatic","floral","fresh","musk"],"Aqua Valentino. Light floral water. Italian summer."),
m("Valentino","Valentino Rock'n Rose EDP","female",2006,3.82,"long","moderate",["spring","fall"],["floral","rose","spicy","woody"],"Rock and rose. Spiced rose. Fashion icon."),
m("Valentino","Valentino Glamourous EDP","female",2009,3.75,"long","moderate",["spring","fall"],["floral","woody","musk","sweet"],"Glamorous Valentino. Peony and orchid. Red carpet."),
m("Valentino","Valentino Uomo Legend EDP","male",2021,3.88,"long","moderate",["fall","winter"],["woody","spicy","amber","citrus"],"Legend homme. Bergamot and tobacco. Italian legend."),
m("Valentino","Valentino Black EDP","unisex",2022,4.02,"long","strong",["fall","winter"],["leather","oud","smoky","amber"],"Black Valentino. Leather and oud. Dark luxury."),
// ═══ CARTIER (eksikler) ═══
m("Cartier","Cartier Les Heures de Parfum Oud EDT","unisex",2011,4.18,"long","strong",["fall","winter"],["oud","incense","amber","spicy"],"Cartier oud hours. Incense and amber. Sacred luxury."),
m("Cartier","Cartier Pasha EDT","male",1992,3.78,"very_long","strong",["fall","winter"],["fougere","aromatic","amber","woody"],"Pasha classic. 1992 fougère. Timeless French."),
m("Cartier","Cartier Santos EDT","male",1981,3.75,"very_long","strong",["fall","winter"],["fougere","woody","herbal","amber"],"Santos de Cartier. Lavender and fir. Aviator."),
m("Cartier","Cartier Delices EDP","female",2006,3.72,"long","moderate",["spring","fall"],["floral","fruity","woody","musk"],"Delices. Cardamom and magnolia. French pleasure."),
m("Cartier","Cartier La Panthère Légère EDP","female",2020,3.82,"long","moderate",["spring","fall"],["floral","musky","chypre","fresh"],"Lighter panther. Fresh and accessible. Day elegance."),
// ═══ BVLGARI (eksikler) ═══
m("Bvlgari","Bvlgari Black EDP","unisex",1998,4.12,"long","strong",["fall","winter"],["rubber","smoky","woody","tea"],"The black bottle. Rubber and tea. Futuristic 1998."),
m("Bvlgari","Bvlgari Jasmin Noir L'Essence EDP","female",2012,3.88,"long","strong",["fall","winter"],["jasmine","woody","musky","spicy"],"Jasmin noir essence. Deeper jasmine. Dark flower."),
m("Bvlgari","Bvlgari Le Gemme Ambero EDP","unisex",2015,4.05,"long","strong",["fall","winter"],["amber","resinous","oriental","balsamic"],"Ambero gem. Pure amber. BVLGARI collection."),
m("Bvlgari","Bvlgari Le Gemme Imperiali Coronam EDP","unisex",2019,4.12,"very_long","strong",["fall","winter"],["amber","oud","spicy","rose"],"Coronam oud. Royal amber. Crown jewel."),
// ═══ GIVENCHY (eksikler) ═══
m("Givenchy","Givenchy Eaudemoiselle EDT","female",2012,3.72,"moderate","moderate",["spring","summer"],["floral","citrus","fresh","musk"],"Mademoiselle. Fresh and youthful. Light charm."),
m("Givenchy","Givenchy Gentlemen Only Absolute EDP","male",2018,3.88,"long","strong",["fall","winter"],["leather","woody","spicy","iris"],"Absolute gentleman. Leather and iris. Most refined."),
m("Givenchy","Givenchy Pour Homme EDP","male",2003,3.82,"long","strong",["fall","winter"],["woody","spicy","citrus","amber"],"Pour homme classic. Bergamot and oakwood. Heritage."),
m("Givenchy","Givenchy Monsieur de Givenchy EDP","male",1959,3.95,"very_long","strong",["fall","winter"],["fougere","aromatic","earthy","woody"],"Monsieur. 1959 classic. Heritage fougère."),
// ═══ LANCÔME (eksikler) ═══
m("Lancôme","Lancôme Mille et Une Roses EDP","female",2013,3.85,"long","moderate",["spring","fall"],["rose","floral","powdery","musk"],"Thousand roses. Rose and iris. Garden luxury."),
m("Lancôme","Lancôme Magnifique EDP","female",2008,3.72,"long","moderate",["spring","fall"],["floral","fruity","woody","musk"],"Magnifique. Rose and magnolia. French radiance."),
m("Lancôme","Lancôme Attraction EDP","female",2011,3.65,"long","moderate",["spring","fall"],["floral","fruity","fresh","musk"],"Attraction. Bergamot and peony. Magnetic draw."),
// ═══ PACO RABANNE (eksikler) ═══
m("Paco Rabanne","Paco Rabanne Black XS EDT","male",2005,3.75,"long","moderate",["fall","winter"],["spicy","leather","woody","fresh"],"Black XS. Leather and elemi. Rock masculine."),
m("Paco Rabanne","Paco Rabanne Lady Million Lucky EDP","female",2018,3.78,"long","moderate",["spring","fall"],["floral","fruity","fresh","musk"],"Lucky million. Hazelnut and rose. Fortunate lady."),
m("Paco Rabanne","Paco Rabanne Pure XS EDT","male",2017,3.85,"long","strong",["fall","winter"],["spicy","sweet","vanilla","amber"],"Pure excess. Ginger and vanilla. Excess luxury."),
m("Paco Rabanne","Paco Rabanne Pure XS Night EDP","female",2018,3.82,"long","strong",["fall","winter"],["sweet","floral","amber","musk"],"Pure XS night. Vanilla and flowers. Night luxury."),
// ═══ DIOR (eksikler) ═══
m("Dior","Christian Dior Diorissimo EDT","female",1956,4.12,"long","strong",["spring","summer"],["floral","white floral","green","aldehydic"],"Lily of the valley masterpiece. 1956 classic. Immaculate."),
m("Dior","Christian Dior Dioressence EDP","female",1969,3.95,"very_long","strong",["fall","winter"],["oriental","floral","earthy","amber"],"Dioressence. 1969 oriental. Primal luxury."),
m("Dior","Dior Privée Oud Ispahan EDP","unisex",2012,4.45,"very_long","enormous",["fall","winter"],["oud","rose","amber","oriental"],"Ispahan masterpiece. Damascus rose and oud. Legendary."),
m("Dior","Dior Poison Girl EDP","female",2016,3.85,"long","strong",["fall","winter"],["sweet","floral","gourmand","vanilla"],"Poison girl. Rose and vanilla. Young toxin."),
m("Dior","Dior Addict Shine EDP","female",2019,3.78,"long","moderate",["spring","fall"],["floral","sweet","vanilla","musk"],"Addict shine. Rose and Bourbon vanilla. Brilliant."),
// ═══ CHANEL (eksikler) ═══
m("Chanel","Chanel Coco Mademoiselle L'Eau Privée","female",2020,4.08,"long","moderate",["spring","fall"],["chypre","floral","patchouli","musk"],"Privée version. Deeper and warmer. Intimate Mademoiselle."),
m("Chanel","Chanel Bleu de Chanel Eau de Parfum","male",2014,4.32,"long","strong",["fall","winter"],["citrus","woody","amber","aromatic"],"EDP Bleu. The most popular. Refined amber."),
m("Chanel","Chanel N°5 Eau de Toilette","female",1921,4.15,"long","strong",["spring","fall"],["aldehydic","floral","powdery","musk"],"N5 EDT. The classic. 1921 revolution."),
// ═══ TOM FORD (eksikler) ═══
m("Tom Ford","Tom Ford Oud Wood Intense EDP","unisex",2020,4.38,"very_long","enormous",["fall","winter"],["oud","woody","spicy","amber"],"Intense oud wood. More concentrated. Maximum luxury."),
m("Tom Ford","Tom Ford Private Blend Venetian Bergamot EDP","unisex",2020,4.05,"long","moderate",["spring","summer"],["citrus","aromatic","woody","fresh"],"Venetian bergamot. Bergamot and herbs. Italian luxury."),
m("Tom Ford","Tom Ford Mandarino di Amalfi EDP","unisex",2014,4.0,"moderate","moderate",["spring","summer"],["citrus","floral","fresh","woody"],"Amalfi mandarin. Sun and sea. Italian brightness."),
// ═══ GUERLAIN (eksikler) ═══
m("Guerlain","Guerlain L'Homme Idéal Cologne","male",2019,3.85,"moderate","moderate",["spring","summer"],["citrus","fougere","aromatic","woody"],"Ideal cologne. Lighter and fresher. Day version."),
m("Guerlain","Guerlain Mon Guerlain Bloom of Roses EDT","female",2018,3.78,"moderate","moderate",["spring","summer"],["rose","floral","fresh","musk"],"Bloom EDT. Light rose water. Garden freshness."),
m("Guerlain","Guerlain Aqua Allegoria Mandarine Basilic Forte","unisex",2022,3.82,"long","moderate",["spring","summer"],["citrus","herbal","fresh","musk"],"Forte version. Stronger mandarin. More lasting citrus."),
// ═══ YSL (eksikler) ═══
m("Yves Saint Laurent","YSL Opium Pour Homme EDT","male",1995,3.88,"very_long","strong",["fall","winter"],["spicy","oriental","fougere","amber"],"Male Opium. Spiced fougere. Dark masculine."),
m("Yves Saint Laurent","YSL Live Jazz EDT","male",1998,3.75,"long","moderate",["spring","fall"],["aromatic","fougere","citrus","woody"],"Live jazz. Bergamot and sandalwood. Cool musician."),
m("Yves Saint Laurent","YSL M7 Oud Absolu EDT","male",2011,4.08,"long","strong",["fall","winter"],["oud","cedar","incense","spicy"],"M7 oud. Cedar and incense. Masculine oud."),
// ═══ HERMÈS (eksikler) ═══
m("Hermès","Hermès Hiris EDT","female",1999,4.0,"long","moderate",["spring","fall"],["iris","floral","powdery","woody"],"Hiris iris. Pure powdery iris. Hermès femininity."),
m("Hermès","Hermès Rouge EDT","female",2000,3.78,"moderate","moderate",["spring","fall"],["floral","fruity","citrus","musk"],"Hermès rouge. Orange blossom and berry. Bright."),
m("Hermès","Hermès Calèche EDT","female",1961,3.92,"very_long","strong",["fall","winter"],["floral","aldehydic","chypre","woody"],"1961 Calèche. Carriage elegance. Classic French."),
// ═══ VERSACE (eksikler) ═══
m("Versace","Versace The Dreamer EDT","male",1996,3.85,"long","moderate",["fall","winter"],["aromatic","fougere","floral","woody"],"The dreamer. Tobacco and iris. Artistic masculine."),
m("Versace","Versace Pour Homme Oud Noir EDP","male",2014,3.88,"long","strong",["fall","winter"],["oud","woody","spicy","amber"],"Oud noir. Dark and intense. Versace depth."),
m("Versace","Versace Man EDT","male",2003,3.72,"long","moderate",["spring","fall"],["citrus","aquatic","aromatic","woody"],"Versace man. Fresh maritime. Classic Italian."),
// ═══ GIORGIO ARMANI (eksikler) ═══
m("Giorgio Armani","Armani Privé Cuir Bois EDP","unisex",2012,4.18,"long","strong",["fall","winter"],["leather","woody","cedar","spicy"],"Cuir Bois. Suede and cedar. Privé leather."),
m("Giorgio Armani","Armani Si Intense EDP","female",2021,4.05,"long","strong",["fall","winter"],["amber","floral","fruity","patchouli"],"Sì intense update. Deeper and bolder. Statement."),
m("Giorgio Armani","Armani Code Parfum","male",2021,4.12,"very_long","strong",["fall","winter"],["woody","spicy","sweet","amber"],"Code parfum. Concentrated code. Maximum attraction."),
// ═══ NICHE (eksik markalar) ═══
m("Henry Rose","Henry Rose The One That Got Away EDP","unisex",2020,3.95,"long","moderate",["spring","fall"],["floral","musk","woody","clean"],"Transparent fragrance. Clean musk. Sustainable luxury."),
m("Henry Rose","Henry Rose Torn EDP","unisex",2020,3.88,"long","moderate",["fall","winter"],["amber","musk","woody","spicy"],"Torn between. Woody amber. Ethical luxury."),
m("Phlur","Phlur Missing Person EDP","unisex",2021,4.12,"long","moderate",["spring","fall"],["musk","floral","woody","clean"],"Missing person. Clean musk. Viral luxury."),
m("Phlur","Phlur Hanami EDP","female",2019,3.92,"long","moderate",["spring","summer"],["floral","cherry","fresh","musk"],"Hanami blooming. Cherry blossom and musk. Spring viral."),
m("DS & Durga","D.S. & Durga Bowmakers EDP","male",2016,3.88,"long","moderate",["fall","winter"],["woody","aromatic","tobacco","amber"],"Bowmakers. Cedarwood and tobacco. Artisan masculine."),
m("DS & Durga","D.S. & Durga Concrete After Lightning EDP","unisex",2014,3.82,"long","moderate",["spring","fall"],["earthy","petrichor","woody","green"],"Concrete petrichor. Rain on cement. Urban nature."),
m("CLEAN Beauty","CLEAN Reserve Rain EDP","unisex",2015,3.75,"moderate","moderate",["spring","summer"],["aquatic","fresh","musk","clean"],"Clean rain. Aquatic and musk. Transparent freshness."),
m("CLEAN Beauty","CLEAN Reserve Sueded Oud EDP","unisex",2017,3.88,"long","moderate",["fall","winter"],["suede","oud","amber","musk"],"Suede oud. Clean luxury. Approachable oud."),
m("Malin + Goetz","Malin Goetz Dark Rum EDP","unisex",2017,3.85,"long","moderate",["fall","winter"],["rum","tobacco","sweet","woody"],"Dark rum. Tobacco and rum. Artisan luxury."),
m("Malin + Goetz","Malin Goetz Cannabis EDP","unisex",2014,3.82,"long","moderate",["fall","winter"],["herbal","woody","earthy","musk"],"Cannabis EDP. Herbal and woody. Brooklyn artisan."),
m("Boy Smells","Boy Smells Cashmere Kush EDP","unisex",2017,3.92,"long","moderate",["fall","winter"],["musk","woody","sweet","vanilla"],"Cashmere kush. Soft musk and woods. Gender-free luxury."),
m("Boy Smells","Boy Smells Tantrum EDP","unisex",2018,3.85,"long","moderate",["spring","fall"],["floral","fruity","musk","fresh"],"Tantrum. Peach and musk. Playful premium."),
m("Commodity","Commodity Whiskey EDP","male",2016,3.88,"long","moderate",["fall","winter"],["tobacco","woody","spicy","amber"],"Whiskey barrel. Tobacco and cedar. Masculine artisan."),
m("Commodity","Commodity Leather EDP","unisex",2016,3.85,"long","moderate",["fall","winter"],["leather","woody","spicy","amber"],"Pure leather. Cedar and incense. Artisan signature."),
m("Imaginary Authors","Imaginary Authors The Cobra and The Canary EDP","unisex",2012,3.85,"long","moderate",["spring","summer"],["floral","fruity","green","musk"],"Cobra canary story. Gardenia and apple. Whimsical art."),
// ═══ MÜZİSYEN/SANATÇI ═══
m("Jay-Z","Jay-Z Gold EDP","male",2013,3.55,"moderate","moderate",["fall","winter"],["fresh","citrus","woody","amber"],"Jay-Z gold. Fresh and accessible. Hip-hop luxury."),
m("Usher","Usher He EDP","male",2007,3.52,"moderate","moderate",["spring","fall"],["fresh","spicy","woody","amber"],"Usher he. Fresh and dynamic. R&B masculine."),
m("Usher","Usher She EDP","female",2007,3.52,"moderate","moderate",["spring","fall"],["floral","fruity","sweet","musk"],"Usher she. Berry and jasmine. R&B feminine."),
m("50 Cent","50 Cent Power EDP","male",2010,3.45,"moderate","moderate",["fall","winter"],["woody","amber","spicy","citrus"],"Power fifty. Bold and accessible. Hip-hop."),
m("Lil Wayne","Lil Wayne Rebirth EDP","male",2013,3.48,"moderate","moderate",["fall","winter"],["woody","spicy","amber","aromatic"],"Wayne rebirth. Dark and bold. Rock hip-hop."),
m("Mariah Carey","Mariah Carey Forever EDP","female",2009,3.58,"long","moderate",["spring","fall"],["floral","fruity","sweet","musk"],"Mariah forever. Rose and musk. Vocal luxury."),
m("Mariah Carey","Mariah Carey M EDP","female",2007,3.55,"long","moderate",["spring","fall"],["floral","fruity","vanilla","musk"],"Mariah M. Floral and vanilla. Superstar signature."),
m("Sean John","Sean John Unforgivable EDP","male",2005,3.72,"long","moderate",["fall","winter"],["fresh","woody","spicy","musk"],"Unforgivable. Cardamom and leather. Sean's luxury."),
m("Sean John","Sean John I Am King EDP","male",2009,3.62,"long","moderate",["fall","winter"],["fresh","woody","amber","citrus"],"I am king. Bergamot and vetiver. Royal masculine."),
m("Jennifer Aniston","Jennifer Aniston Lolavie EDT","female",2010,3.65,"moderate","moderate",["spring","summer"],["floral","fruity","fresh","musk"],"Lolavie. Bergamot and rose. Hollywood fresh."),
m("Halle Berry","Halle by Halle Berry EDP","female",2009,3.58,"long","moderate",["spring","fall"],["floral","fruity","sweet","musk"],"Halle's scent. Berry and rose. Actress luxury."),
m("Elizabeth Taylor","Passion Flower EDT","female",1992,3.55,"moderate","moderate",["spring","fall"],["floral","fresh","musk","citrus"],"Passion flower. Light and accessible. Elizabeth lighter."),
m("Antonio Banderas","Antonio Banderas The Golden Secret EDT","male",2011,3.60,"long","moderate",["spring","fall"],["fresh","spicy","woody","amber"],"Golden secret. Citrus and cedar. Latin masculine."),
m("Antonio Banderas","Antonio Banderas Blue Seduction EDT","male",2007,3.58,"moderate","moderate",["spring","summer"],["aquatic","fresh","citrus","woody"],"Blue seduction. Bergamot and aquatic. Accessible fresh."),
m("Antonio Banderas","Antonio Banderas Queen of Seduction EDP","female",2012,3.55,"long","moderate",["spring","fall"],["floral","fruity","sweet","musk"],"Queen seduction. Peach and rose. Latin feminine."),
m("Hilary Duff","Hilary Duff With Love EDP","female",2006,3.50,"moderate","moderate",["spring","summer"],["floral","fruity","sweet","musk"],"With love. Magnolia and musk. Pop princess."),
m("Sarah Jessica Parker","NYC EDP","female",2011,3.65,"long","moderate",["fall","winter"],["floral","amber","musk","sweet"],"NYC. Urban and warm. Manhattan signature."),
m("Sarah Jessica Parker","SJP Stash EDP","unisex",2015,3.68,"long","moderate",["fall","winter"],["woody","amber","tobacco","spicy"],"Stash. Tobacco and cedar. Private collection."),
// ═══ MORE SPORTSWEAR ═══
m("Adidas","Adidas Vibes EDT","male",2015,3.52,"moderate","soft",["spring","summer"],["fresh","citrus","aquatic","musk"],"Vibes. Fresh and light. Sport lifestyle."),
m("Adidas","Adidas Respect EDT","male",2009,3.50,"moderate","soft",["spring","summer"],["fresh","citrus","woody","musk"],"Respect. Clean and sporty. Daily active."),
m("Nike","Nike Sport EDT","male",2008,3.48,"moderate","soft",["spring","summer"],["fresh","aquatic","citrus","musk"],"Nike sport. Just do it fresh. Athletic freshness."),
m("Puma","Puma Ultra Purple EDT","female",2011,3.45,"short","soft",["spring","summer"],["floral","fruity","fresh","musk"],"Puma purple. Light and accessible. Active feminine."),
m("Puma","Puma No Rules EDP","male",2011,3.48,"moderate","soft",["spring","summer"],["fresh","woody","citrus","aromatic"],"No rules. Bold and energetic. Sport free."),
m("Under Armour","Under Armour Connected for Him EDP","male",2017,3.52,"moderate","moderate",["spring","summer"],["fresh","citrus","woody","aquatic"],"Connected. Fresh and active. Athletic luxury."),
// ═══ MORE FASHION BRANDS ═══
m("Stella McCartney","Stella McCartney Pop EDP","female",2017,3.75,"long","moderate",["spring","fall"],["floral","fruity","fresh","musk"],"Pop energy. Peony and fresh. Fashion pop."),
m("Alexander McQueen","Alexander McQueen Kingdom EDP","female",2003,3.82,"very_long","enormous",["fall","winter"],["animalic","floral","musk","earthy"],"Dark kingdom. Civet and rose. Provocative luxury."),
m("Alexander McQueen","Alexander McQueen My Queen EDP","female",2005,3.72,"long","moderate",["spring","fall"],["floral","rose","musk","woody"],"My queen. Rose and musk. Fashion royalty."),
m("Alexander Wang","Alexander Wang Dust EDP","unisex",2018,3.68,"long","moderate",["fall","winter"],["musk","woody","earthy","clean"],"Dust musk. Clean and minimal. Fashion minimalism."),
m("Balenciaga","Balenciaga Florabotanica EDP","female",2012,3.88,"long","moderate",["spring","fall"],["floral","spicy","green","woody"],"Flora botanica. Carnation and spice. Unusual beauty."),
m("Balenciaga","Balenciaga B. Balenciaga EDP","female",2014,3.75,"long","moderate",["spring","fall"],["floral","woody","iris","musk"],"B fragrance. Iris and orris. Fashion house icon."),
m("Balmain","Balmain Ivoire EDP","female",1979,3.85,"very_long","strong",["spring","fall"],["floral","green","chypre","woody"],"Ivory Balmain. Green florals. 1979 Parisian classic."),
m("Balmain","Balmain Ambre Gris EDP","unisex",2016,4.02,"long","strong",["fall","winter"],["amber","incense","woody","musk"],"Grey amber. Dark and warm. Modern Balmain."),
m("Fendi","Fendi Fan di Fendi EDP","female",2010,3.72,"long","moderate",["spring","fall"],["floral","fruity","woody","musk"],"Fan di Fendi. Bergamot and violet. Italian fashion."),
m("Fendi","Fendi L'Acquarossa EDP","female",2012,3.75,"long","moderate",["spring","fall"],["floral","fruity","fresh","musk"],"Acquarossa. Flowers and red fruits. Italian garden."),
m("Bottega Veneta","Bottega Veneta EDP","female",2011,3.92,"long","strong",["fall","winter"],["leather","chypre","floral","earthy"],"BV signature. Leather and iris. Italian craft."),
m("Bottega Veneta","Bottega Veneta Pour Homme EDT","male",2013,3.88,"long","moderate",["fall","winter"],["woody","aromatic","spicy","leather"],"BV homme. Juniper and leather. Crafted masculinity."),
m("Karl Lagerfeld","Karl Lagerfeld Classic EDT","male",1978,3.75,"long","moderate",["fall","winter"],["fougere","aromatic","woody","citrus"],"Karl classic. 1978 fougere. Lagerfeld heritage."),
m("Karl Lagerfeld","Karl Lagerfeld Paradise Bay EDP","female",2014,3.65,"long","moderate",["spring","summer"],["floral","tropical","fresh","musk"],"Paradise bay. Tropical flowers. Lagerfeld beach."),
m("Missoni","Missoni EDP","female",2015,3.72,"long","moderate",["spring","fall"],["floral","fruity","woody","musk"],"Missoni. Bergamot and rose. Italian pattern."),
m("Roberto Cavalli","Roberto Cavalli Gold EDT","female",2016,3.68,"long","moderate",["spring","fall"],["floral","woody","amber","musk"],"Cavalli gold. Rose and amber. Wild elegance."),
m("Roberto Cavalli","Roberto Cavalli Nero Assoluto EDP","unisex",2015,3.82,"long","strong",["fall","winter"],["smoky","leather","woody","amber"],"Nero assoluto. Dark leather. Wild darkness."),
m("Moschino","Moschino Toy 2 EDP","female",2018,3.72,"long","moderate",["spring","summer"],["floral","fruity","fresh","musk"],"Toy 2. Peony and lemon. Playful sequel."),
m("Moschino","Moschino Funny EDT","female",2007,3.65,"moderate","moderate",["spring","summer"],["citrus","fruity","floral","musk"],"Funny girl. Lemon and jasmine. Playful fashion."),
m("Diesel","Diesel Spirit of the Brave EDT","male",2019,3.72,"long","moderate",["fall","winter"],["amber","woody","spicy","leather"],"Spirit brave. Amber and leather. Bold diesel."),
m("Diesel","Diesel Sound of the Brave EDT","male",2020,3.68,"long","moderate",["fall","winter"],["fresh","citrus","woody","aromatic"],"Sound brave. Bergamot and vetiver. Modern bold."),
m("Dsquared2","Dsquared2 Wood for Him EDT","male",2009,3.75,"long","moderate",["fall","winter"],["woody","aromatic","spicy","citrus"],"D² wood. Cedar and juniper. Italian Canadian."),
m("Dsquared2","Dsquared2 Potion for Him EDT","male",2013,3.72,"long","moderate",["fall","winter"],["spicy","woody","amber","citrus"],"D² potion. Saffron and cedar. Magic masculine."),
// ═══ MORE ARABIC EXTENDED ═══
m("Al Haramain","Al Haramain Musk Malaki EDP","unisex",2019,3.95,"long","moderate",["spring","fall"],["musk","floral","sweet","fresh"],"Royal musk. Soft and enveloping. Elevated clean."),
m("Al Haramain","Al Haramain Junaid EDP","male",2018,3.98,"long","strong",["fall","winter"],["oud","woody","spicy","amber"],"Junaid. Oud and spice. Traditional Arabic man."),
m("Al Haramain","Al Haramain Platinum Oud EDP","unisex",2020,4.08,"very_long","strong",["fall","winter"],["oud","amber","floral","sweet"],"Platinum oud. Gold standard. Premium Arabic."),
m("Rasasi","Rasasi Hawas Black EDP","male",2019,4.02,"very_long","strong",["fall","winter"],["oud","spicy","amber","tobacco"],"Black hawas. Dark desire. Intense masculine."),
m("Rasasi","Rasasi Egra Pink EDP","female",2020,3.88,"long","moderate",["spring","fall"],["floral","rose","sweet","musk"],"Pink joy. Rose and musk. Arabic feminine delight."),
m("Afnan","Afnan Signature EDP","unisex",2019,3.92,"long","strong",["fall","winter"],["amber","oud","spicy","sweet"],"Afnan signature. Amber and saffron. Distinguished."),
m("Afnan","Afnan Inara Black EDP","male",2019,3.88,"long","strong",["fall","winter"],["oud","tobacco","spicy","amber"],"Inara black. Dark tobacco oud. Strong masculine."),
m("Lattafa","Lattafa Kashkha EDP","male",2022,4.05,"very_long","enormous",["fall","winter"],["oud","spicy","amber","leather"],"Kashkha power. Oud and leather. King's presence."),
m("Lattafa","Lattafa Ana Abiyedh Rouge EDP","female",2021,3.95,"long","strong",["spring","fall"],["rose","floral","sweet","musk"],"I am red white. Rose and musk. Feminine duality."),
m("Lattafa","Lattafa Lail Maleki EDP","unisex",2020,4.08,"very_long","strong",["fall","winter"],["oud","amber","incense","spicy"],"Royal nights. Oud and incense. Nighttime luxury."),
m("Swiss Arabian","Swiss Arabian Hashimi EDP","male",2018,3.95,"long","strong",["fall","winter"],["oud","amber","woody","citrus"],"Hashimi. Cedar and oud. Heritage Bedouin."),
m("Swiss Arabian","Swiss Arabian Layali EDP","female",2017,3.88,"long","moderate",["spring","fall"],["floral","rose","sweet","musk"],"Layali nights. Rose and musk. Arabic nights."),
m("Zimaya","Zimaya Hayat Pink EDP","female",2021,3.85,"long","moderate",["spring","fall"],["floral","fruity","rose","musk"],"Life pink. Rose and berries. Sweet Arabic life."),
m("Arabian Oud","Arabian Oud Bakhoor Misk EDP","unisex",2020,3.98,"long","strong",["fall","winter"],["musk","incense","oud","amber"],"Bakhoor musk. Incense and musk. Ritual Arabic."),
m("Arabian Oud","Arabian Oud Special 60ml EDP","unisex",2015,4.05,"very_long","strong",["fall","winter"],["oud","amber","sweet","floral"],"Special oud. Premium blend. Arabian signature."),
m("Paris Corner","Paris Corner Encanto EDP","female",2021,3.82,"long","moderate",["spring","fall"],["floral","fruity","sweet","musk"],"Enchantment. Rose and peach. Eastern femininity."),
m("Paris Corner","Paris Corner Hawas Blue EDP","male",2022,3.88,"long","strong",["fall","winter"],["oud","citrus","spicy","amber"],"Blue desire. Oud and bergamot. Arabic masculine."),
m("Armaf","Armaf Club de Nuit Man Intense Parfum","male",2021,4.25,"very_long","enormous",["fall","winter"],["fruity","woody","amber","musk"],"Club parfum. Most intense. Premium Armaf."),
m("Armaf","Armaf Perfume Body Mist Club de Nuit","male",2018,3.65,"short","soft",["spring","summer"],["fresh","fruity","citrus","musk"],"Club mist. Fresh spray. Accessible daily."),
m("Maison Alhambra","Maison Alhambra Shaghaf Oud Rose EDP","female",2022,3.92,"long","strong",["spring","fall"],["rose","oud","floral","sweet"],"Rose oud. Feminine oud. Arabic rose luxury."),
m("Maison Alhambra","Maison Alhambra Mon Desir EDP","female",2022,3.88,"long","moderate",["spring","fall"],["floral","rose","sweet","musk"],"My desire. Rose and jasmine. Elegant inspired."),
// ═══ EKLENMEMİŞ DESİGNER ═══
m("Dunhill","Dunhill Desire Red EDT","male",2007,3.65,"moderate","moderate",["fall","winter"],["spicy","woody","amber","citrus"],"Desire red. Bergamot and spice. Bold English."),
m("Dunhill","Dunhill Green EDT","male",2010,3.60,"moderate","moderate",["spring","summer"],["fresh","green","citrus","woody"],"Dunhill green. Fresh herbs. Countryside English."),
m("Cerruti","Cerruti 1881 Femme EDT","female",2001,3.68,"long","moderate",["spring","fall"],["floral","fruity","fresh","musk"],"Cerruti femme. Bergamot and rose. Italian class."),
m("Guy Laroche","Guy Laroche Clandestine EDP","female",1986,3.75,"long","moderate",["fall","winter"],["floral","oriental","spicy","amber"],"Clandestine. Spiced floral. Secret French luxury."),
m("Loewe","Loewe Esencia EDT","male",1988,3.85,"very_long","strong",["fall","winter"],["aromatic","fougere","woody","amber"],"Loewe esencia. Rosemary and oakwood. Spanish heritage."),
m("Loewe","Loewe 001 Man EDT","male",2015,3.72,"long","moderate",["spring","fall"],["woody","citrus","aromatic","amber"],"Loewe 001. Clean and precise. Spanish minimalism."),
m("Paul Smith","Paul Smith Story EDP","female",2010,3.68,"long","moderate",["spring","fall"],["floral","rose","fresh","musk"],"Smith story. Rose and jasmine. British narrative."),
m("Ted Baker","Ted Baker Porcelain EDT","female",2013,3.60,"moderate","soft",["spring","summer"],["floral","fresh","citrus","musk"],"Porcelain ted. Delicate and fresh. British ceramic."),
m("Ted Baker","Ted Baker Tonic EDP","male",2015,3.62,"long","moderate",["spring","fall"],["fresh","citrus","woody","aromatic"],"Tonic masculine. Citrus and cedar. British refresh."),
m("Trussardi","Trussardi Pure EDP","unisex",2020,3.68,"long","moderate",["spring","fall"],["floral","musk","fresh","woody"],"Trussardi pure. Clean and fresh. Italian pure."),
m("Trussardi","Trussardi Riflesso EDP","male",2021,3.72,"long","moderate",["fall","winter"],["woody","spicy","amber","citrus"],"Reflection. Bergamot and pepper. Italian reflection."),
m("Bogner","Bogner Mountain EDT","male",2009,3.55,"moderate","soft",["spring","summer"],["fresh","herbal","citrus","woody"],"Alpine mountain. Herbs and citrus. Mountain luxury."),
// ═══ MORE SPECIFIC FILLS ═══
m("Bulgari","Bvlgari Goldea Roman Night Absolute EDP","female",2018,3.92,"long","strong",["fall","winter"],["floral","amber","musk","oriental"],"Roman night absolute. Deeper and darker. More intense."),
m("Bulgari","Bvlgari Aqva Pour Homme Atlantiqve EDT","male",2016,3.72,"moderate","moderate",["spring","summer"],["aquatic","fresh","citrus","woody"],"Atlantic aqua. Sea and cedar. Deep ocean."),
m("Bulgari","Bvlgari Soir de Jasmine EDT","female",2018,3.75,"moderate","moderate",["spring","summer"],["jasmine","floral","white floral","musk"],"Jasmine evening. Delicate and soft. Twilight flowers."),
m("Cartier","Cartier Rêves d'Ailleurs EDP","female",2021,4.05,"long","moderate",["spring","fall"],["floral","woody","musk","fresh"],"Dreams elsewhere. Iris and sandalwood. Elegant escape."),
m("Cartier","Cartier Carat EDP","female",2019,3.88,"long","moderate",["spring","summer"],["white floral","tuberose","powdery","musk"],"Diamond carat. White flowers. Gem luxury."),
m("Boucheron","Boucheron Jaipur Homme EDP","male",1995,3.82,"long","strong",["fall","winter"],["spicy","oriental","amber","woody"],"Jaipur homme. Spiced oriental. Indian-French luxury."),
m("Boucheron","Boucheron Quatre Red Edition EDP","unisex",2018,3.85,"long","moderate",["fall","winter"],["spicy","floral","amber","woody"],"Red edition. Spiced and warm. Ruby luxury."),
m("Jimmy Choo","Jimmy Choo L'Eau EDT","female",2015,3.65,"moderate","soft",["spring","summer"],["floral","fruity","citrus","fresh"],"L'Eau Jimmy. Light and fresh. Shoe luxury."),
m("Jimmy Choo","Jimmy Choo Fever EDP","female",2016,3.72,"long","moderate",["fall","winter"],["floral","fruity","sweet","amber"],"Fever. Peach and gardenia. Night temperature."),
m("Jimmy Choo","Jimmy Choo Illicit EDP","female",2015,3.75,"long","moderate",["fall","winter"],["floral","sweet","amber","vanilla"],"Illicit. Peach and orchid. Secret pleasure."),
m("Michael Kors","Michael Kors Wonderlust Sensual Essence EDP","female",2018,3.78,"long","strong",["fall","winter"],["floral","oriental","amber","woody"],"Sensual essence. Almond blossom and amber. Deep luxury."),
m("Michael Kors","Michael Kors Midnight Shimmer EDP","female",2019,3.72,"long","moderate",["fall","winter"],["floral","sweet","vanilla","amber"],"Midnight shimmer. Jasmine and vanilla. Night gold."),
m("Michael Kors","Michael Kors Collection 24K Brilliant Gold EDP","female",2020,3.68,"long","moderate",["spring","fall"],["floral","citrus","fresh","woody"],"24K gold. Fresh and luminous. Golden luxury."),  
m("Victoria's Secret","Victoria's Secret Bombshell Intense EDP","female",2021,3.78,"long","strong",["fall","winter"],["floral","fruity","vanilla","sweet"],"Bombshell intense. Deeper fruits and vanilla. Maximum confidence."),
m("Victoria's Secret","Victoria's Secret Bare Vanilla Noir EDP","female",2021,3.75,"long","moderate",["fall","winter"],["vanilla","musk","woody","sweet"],"Vanilla noir. Dark and sweet. Night vanilla."),
m("Kayali","Kayali Candy 23 EDP","female",2022,3.95,"long","moderate",["spring","fall"],["sweet","fruity","vanilla","musk"],"Candy 23. Pear and musk. Sweet luxury 23."),
m("Kayali","Kayali Flora 33 EDP","female",2023,3.92,"long","moderate",["spring","summer"],["floral","fresh","musk","citrus"],"Flora 33. White flowers and musk. Garden luxury."),
m("Dossier","Dossier Woody Sandalwood EDP","unisex",2021,3.72,"long","moderate",["fall","winter"],["sandalwood","woody","creamy","musk"],"Sandalwood accessible. Creamy and warm. Budget niche."),
m("Dossier","Dossier Oriental Myrrh EDP","unisex",2022,3.75,"long","moderate",["fall","winter"],["resinous","oriental","amber","incense"],"Myrrh orient. Incense and amber. Affordable resin."),
m("Maison Alhambra","Maison Alhambra Amberfall EDP","unisex",2023,3.85,"long","strong",["fall","winter"],["amber","sweet","oud","spicy"],"Amber fall. Amber and oud. Seasonal luxury."),
m("Lattafa","Lattafa Velvet Love EDP","female",2022,4.05,"very_long","enormous",["fall","winter"],["floral","musk","vanilla","sweet"],"Velvet love. Rose and vanilla musk. Popular accessible."),
m("Lattafa","Lattafa Maahir EDP","unisex",2021,4.08,"very_long","strong",["fall","winter"],["oud","amber","spicy","floral"],"Maahir. Skillful blend. Oud and saffron mastery."),
m("Rasasi","Rasasi Qasamat Mohabba EDP","female",2021,3.92,"long","moderate",["spring","fall"],["floral","sweet","musk","rose"],"Oath of love. Rose and musk. Arabic love pledge."),
m("Afnan","Afnan Ornament EDP","unisex",2020,3.88,"long","strong",["fall","winter"],["oud","amber","floral","sweet"],"Ornament. Oud and rose amber. Decorated luxury."),
m("Swiss Arabian","Swiss Arabian Oud & Roses EDP","unisex",2019,4.08,"very_long","strong",["fall","winter"],["oud","rose","floral","amber"],"Oud and roses. Classic combination. Perfect harmony."),
m("Arabian Oud","Arabian Oud Mecca Bkhour EDP","unisex",2018,3.95,"very_long","strong",["fall","winter"],["oud","incense","amber","balsamic"],"Mecca sacred. Oud and bakhoor. Holy pilgrimage."),
m("Paris Corner","Paris Corner Pocket Scent EDP","unisex",2022,3.78,"moderate","moderate",["spring","fall"],["fresh","musk","floral","clean"],"Pocket freshness. Clean and accessible. Daily use."),
m("Zimaya","Zimaya Oud for Glory EDP","unisex",2022,4.12,"very_long","enormous",["fall","winter"],["oud","spicy","amber","sweet"],"Oud glory. Saffron and rose oud. Arabian crown."),
m("Armaf","Armaf Perfume Niche Italiano EDP","unisex",2020,3.88,"long","moderate",["fall","winter"],["floral","musk","woody","iris"],"Niche italiano. Clean and refined. Premium Armaf."),
m("Armaf","Armaf Club de Nuit Women EDP","female",2018,3.82,"long","moderate",["spring","fall"],["floral","fruity","musk","fresh"],"Club women. Elegant and accessible. Feminine club."),
m("Zara","Zara Man Gold Oud EDP","male",2022,3.85,"long","strong",["fall","winter"],["oud","amber","spicy","woody"],"Gold oud zara. Amber and oud. Affordable Eastern."),
m("Zara","Zara Woman Crystal Black EDP","female",2022,3.82,"long","moderate",["fall","winter"],["floral","musk","amber","sweet"],"Crystal black. Deep floral. Zara night."),
m("Zara","Zara Black Amber EDP","unisex",2021,3.75,"long","moderate",["fall","winter"],["amber","woody","sweet","musk"],"Black amber. Warm and accessible. Zara niche inspired."),
m("Zara","Zara Applejuice EDP","female",2021,3.68,"moderate","moderate",["spring","summer"],["fruity","floral","fresh","musk"],"Apple juice. Fresh and playful. Zara summer."),
m("Zara","Zara Iris EDP","unisex",2022,3.72,"long","moderate",["spring","fall"],["iris","powdery","floral","musk"],"Iris zara. Clean iris. Affordable chic."),
];

const existing=JSON.parse(readFileSync(DATA,"utf-8"));
console.log(`Mevcut: ${existing.length}`);
const seen=new Map(existing.map(p=>[`${p.brand}|${p.name}`.toLowerCase().trim(),true]));
let added=0;const merged=[...existing];
for(const p of NEW){
  const key=`${p.brand}|${p.name}`.toLowerCase().trim();
  if(!seen.has(key)){seen.set(key,true);merged.push(p);added++;}
}
merged.forEach((p,i)=>{p.id=String(i+1);});
writeFileSync(DATA,JSON.stringify(merged,null,2),"utf-8");
console.log(`Eklenen: ${added}`);
console.log(`Toplam: ${merged.length}`);
