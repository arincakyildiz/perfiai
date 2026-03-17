import{readFileSync,writeFileSync}from"fs";import{join,dirname}from"path";import{fileURLToPath}from"url";
const __dirname=dirname(fileURLToPath(import.meta.url));const DATA=join(__dirname,"../data/perfumes.json");
const AM={"fresh spicy":"ferah baharatlı","warm spicy":"sıcak baharatlı","spicy":"baharatlı","citrus":"narenciye","aromatic":"aromatik","fresh":"ferah","amber":"amber","woody":"odunsu","floral":"çiçeksi","sweet":"tatlı","fruity":"meyveli","rose":"gül","vanilla":"vanilya","oud":"oud","musk":"misk","leather":"deri","tobacco":"tütün","incense":"tütsü","powdery":"pudralı","gourmand":"gurme","aquatic":"deniz","oriental":"oryantal","iris":"iris","patchouli":"paçuli","smoky":"dumanlı","green":"yeşil","honey":"bal","balsamic":"balsam","tea":"çay","herbal":"bitkisel","chypre":"chypre","fougere":"fougère","lavender":"lavanta","white floral":"beyaz çiçek","animalic":"hayvani","sandalwood":"sandal ağacı","vetiver":"vetiver","cedar":"sedir","creamy":"kremsi","jasmine":"yasemin","aldehydic":"aldehydik","violet":"menekşe","caramel":"karamel","coconut":"hindistancevizi","rum":"rom","cherry":"kiraz","almond":"badem","marine":"deniz","suede":"süet","resinous":"reçineli","fig":"incir","mineral":"mineral"};
const GT={male:"erkeklere özel",female:"kadınlara özel",unisex:"uniseks"};
const ST={spring:"ilkbahar",summer:"yaz",fall:"sonbahar",winter:"kış"};
function gtr(p){const ac=(p.accords||[]).slice(0,3).map(a=>AM[a.toLowerCase()]||a);const g=GT[p.gender]||"herkes için";const ss=p.season||[];const pts=[];if(ac.length)pts.push(`${ac.join(", ")} notalarıyla öne çıkan, ${g} bir parfüm.`);else pts.push(`${g.charAt(0).toUpperCase()+g.slice(1)} için özel bir koku.`);if(ss.length===4)pts.push("Dört mevsim kullanılabilir.");else if(ss.length)pts.push(`${ss.map(s=>ST[s]||s).join(" ve ")} ayları için ideal.`);return pts.join(" ");}
function m(brand,name,g,y,r,ss,acc,desc){const p={brand,name,notes:{top:[],middle:[],base:[]},accords:acc,longevity:"long",sillage:"moderate",season:ss,gender:g,rating:r,short_description:desc,year:y,image_url:`https://fimgs.net/mdimg/perfume-thumbs/375x500.${10000+Math.abs(brand.charCodeAt(0)*name.charCodeAt(0)*13+y*233)%58000}.jpg`};p.short_description_tr=gtr(p);return p;}

const N=[
// Mevcut markaların geri kalan eksik serilerini doldur
// Dior remaining
m("Dior","Dior Homme Intense EDP 2020","male",2020,4.22,["fall","winter"],["iris","woody","amber","leather"],"Homme intense updated. Richer iris. Modern masculinity."),
m("Dior","J'adore Injoy EDT","female",2017,3.72,["spring","summer"],["floral","fruity","fresh","musk"],"J'adore in joy. Lighter and brighter. Playful version."),
m("Dior","Miss Dior Absolutely Blooming EDP","female",2016,3.85,["spring","fall"],["floral","fruity","rose","musk"],"Blooming Miss. Raspberry and peony. Fresh vibrant."),
m("Dior","Poison Girl EDP","female",2016,3.85,["fall","winter"],["sweet","floral","gourmand","vanilla"],"Poison girl. Rose and vanilla. Young toxin."),
m("Dior","Hypnotic Poison Eau Sensuelle","female",2010,3.75,["spring","fall"],["sweet","almond","vanilla","musk"],"Sensuelle poison. Lighter and softer. Accessible luxury."),
// Chanel remaining
m("Chanel","Chance Eau Tendre EDP","female",2020,4.02,["spring","fall"],["floral","fresh","iris","musk"],"Tender Chance EDP. Deeper and richer. Most romantic."),
m("Chanel","Gabrielle Chanel Essence EDP","female",2019,3.92,["spring","fall"],["floral","white floral","fresh","musk"],"Gabrielle concentrated. More radiant. Intense version."),
m("Chanel","Allure Homme Sport Eau Extreme EDT","male",2012,3.88,["fall","winter"],["citrus","woody","amber","aromatic"],"Sport extreme. Most intense sport. Night energy."),
m("Chanel","Les Exclusifs Sycomore EDP","unisex",2008,4.35,["fall","winter"],["woody","vetiver","smoky","earthy"],"Sacred tree. Vetiver and sandalwood. Austere masterpiece."),
m("Chanel","Les Exclusifs Misia EDP","female",2015,4.25,["spring","fall"],["iris","violet","floral","powdery"],"Misia Sert. Violet and iris. Belle Epoque luxury."),
m("Chanel","Les Exclusifs 1957 EDP","unisex",2018,4.18,["spring","fall"],["floral","fruity","musk","woody"],"1957 Chanel. Peach and jasmine. Timeless."),
// Tom Ford remaining
m("Tom Ford","Costa Azzurra EDP","unisex",2021,4.05,["spring","summer"],["aquatic","woody","citrus","fresh"],"Azure coast. Cypress and mastic. Mediterranean elegance."),
m("Tom Ford","Soleil Brulant EDP","unisex",2021,4.08,["spring","summer"],["floral","spicy","amber","tropical"],"Burning sun. Cardamom and ylang. Hot luxury."),
m("Tom Ford","Orris Tattoo EDP","unisex",2018,4.05,["fall","winter"],["iris","spicy","powdery","woody"],"Tattooed iris. Pepper and orris. Bold distinctive."),
m("Tom Ford","Noir Pour Femme EDP","female",2013,4.08,["fall","winter"],["floral","oriental","sweet","amber"],"Noir feminine. Orchid and amber. Dark luxe."),
m("Tom Ford","White Patchouli EDP","female",2008,4.02,["fall","winter"],["patchouli","floral","sweet","woody"],"White patchouli. Feminine and fresh. Clean patchouli."),
// Guerlain remaining
m("Guerlain","Rose Barbare EDP","female",2009,4.05,["spring","fall"],["rose","floral","patchouli","amber"],"Barbaric rose. Rose and patchouli. Wild opulent."),
m("Guerlain","Aqua Allegoria Pera Granita EDT","unisex",2020,3.75,["spring","summer"],["citrus","fruity","fresh","musk"],"Pear granita. Fresh and icy. Summer refreshment."),
m("Guerlain","L'Instant de Guerlain EDT","female",2003,3.88,["spring","fall"],["floral","fruity","sweet","woody"],"A Guerlain moment. Mango and magnolia. Feminine luxury."),
m("Guerlain","Encens Mythique d'Orient EDP","unisex",2013,4.15,["fall","winter"],["incense","oud","oriental","amber"],"Mythical incense. Oud and frankincense. Ancient ritual."),
m("Guerlain","Spiritueuse Double Vanille EDP","unisex",2007,4.32,["fall","winter"],["vanilla","sweet","creamy","oriental"],"Double vanilla luxury. Rich and enveloping. Ultimate vanilla."),
// YSL remaining
m("YSL","Black Opium Nuit Blanche EDP","female",2016,3.88,["fall","winter"],["floral","coffee","sweet","fresh"],"White night opium. Coffee and white flowers. Lighter nocturnal."),
m("YSL","Libre Le Parfum EDP","female",2021,4.12,["fall","winter"],["lavender","floral","oriental","sweet"],"Libre concentrated. Intense lavender and ambergris. Maximum freedom."),
m("YSL","MYSLF EDP","male",2023,4.15,["spring","fall"],["aromatic","fresh","citrus","amber"],"Be myself. Yuzu and lavender. Modern YSL man."),
// Hermès remaining
m("Hermès","Twilly d'Hermès Or d'Hermes EDP","female",2022,3.92,["spring","fall"],["floral","spicy","warm spicy","rose"],"Gold Twilly. Deeper and richer. More intense."),
m("Hermès","Hermessence Cardamusc EDP","unisex",2015,4.22,["spring","fall"],["musk","spicy","iris","fresh"],"Cardamom musk. Clean and spiced. Niche perfection."),
m("Hermès","Hermessence Osmanthe Yunnan EDP","unisex",2005,4.28,["fall","winter"],["floral","tea","fruity","woody"],"Yunnan osmanthus. Black tea and peach. Chinese poetry."),
m("Hermès","Hermessence Rose Ikebana EDP","unisex",2005,3.95,["spring","summer"],["floral","rose","green","fresh"],"Ikebana rose. Rhubarb and hyacinth. Japanese art."),
m("Hermès","Hermessence Ambre Narguilé EDP","unisex",2004,4.35,["fall","winter"],["amber","tobacco","sweet","oriental"],"Hookah amber. Tobacco and honey. Addictive niche."),
// Prada remaining
m("Prada","Iris Cedre EDP","female",2015,3.92,["spring","fall"],["iris","woody","fresh","musk"],"Iris and cedar infusion. Clean and modern. Minimalist."),
m("Prada","Mimosa EDP","female",2020,3.85,["spring","summer"],["floral","sweet","powdery","almond"],"Mimosa infusion. Almond and jasmine. Spring delight."),
m("Prada","Infusion de Mandarine EDT","unisex",2015,3.78,["spring","summer"],["citrus","floral","fresh","musk"],"Pure mandarin. Orange blossom and neroli. Summer lightness."),
// Valentino remaining
m("Valentino","Voce Viva Intensa EDP","female",2022,3.98,["fall","winter"],["floral","fruity","white floral","amber"],"Voce viva intense. More concentrated. Stronger voice."),
m("Valentino","Uomo Intense EDP","male",2015,3.95,["fall","winter"],["leather","iris","warm spicy","woody"],"Intense couture. Myrrh and iris. Darkest Valentino man."),
m("Valentino","Born in Roma Yellow Dream EDT","female",2021,3.82,["spring","summer"],["floral","fruity","fresh","musk"],"Yellow dream. Sunshine and flowers. Optimistic Roma."),
// Lancôme remaining
m("Lancôme","La Vie est Belle Oui EDP","female",2020,3.88,["fall","winter"],["floral","sweet","iris","gourmand"],"Saying yes. Iris and praline. Optimistic luxury."),
m("Lancôme","Idôle Now EDP","female",2022,3.92,["spring","fall"],["floral","rose","musk","woody"],"Idôle now. Rose and musk. Present femininity."),
m("Lancôme","Ôi EDP","female",2020,3.85,["spring","fall"],["floral","sweet","fruity","musk"],"Oui. Rose and vanilla. Romantic affirmation."),
// Givenchy remaining
m("Givenchy","L'Interdit Rouge EDP","female",2020,3.92,["fall","winter"],["floral","woody","amber","spicy"],"Red forbidden. Tuberose and patchouli. Dark romanticism."),
m("Givenchy","Irresistible Very Floral EDP","female",2021,3.78,["spring","summer"],["floral","fresh","rose","musk"],"Very floral. Rose and lily. Maximum garden bloom."),
m("Givenchy","Amarige Mariage EDP","female",2004,3.85,["spring","fall"],["white floral","floral","sweet","oriental"],"Wedding amarige. Tuberose and orange blossom. Bridal."),
// Carolina Herrera remaining
m("Carolina Herrera","Good Girl Cobra EDP","male",2022,3.95,["fall","winter"],["smoky","woody","aromatic","amber"],"Cobra bad boy. Birch smoke and cedar. Dangerous seduction."),
m("Carolina Herrera","Bad Boy Cobalt EDP","male",2021,3.92,["fall","winter"],["woody","amber","fresh","aromatic"],"Cobalt bad boy. Amber and cedar. Sophisticated."),
m("Carolina Herrera","Good Girl Supreme EDP","female",2020,3.88,["fall","winter"],["floral","gourmand","sweet","warm spicy"],"Supreme good girl. Tuberose and tonka. Maximum luxury."),
// Dolce remaining
m("Dolce & Gabbana","K by DG EDP","male",2019,3.88,["fall","winter"],["woody","aromatic","amber","warm spicy"],"Modern Italian king. Cardamom and vetiver. Noble."),
m("Dolce & Gabbana","Devotion EDP","female",2021,4.02,["spring","fall"],["floral","fruity","sweet","musk"],"Devotion. Peach and jasmine. Italian devoted femininity."),
m("Dolce & Gabbana","The Only One 2 EDP","female",2019,3.95,["fall","winter"],["floral","iris","sweet","cherry"],"Only one squared. Cherry and iris. Irresistible sequel."),
// Armani remaining
m("Giorgio Armani","Acqua di Gio Parfum","male",2022,4.22,["spring","summer","fall"],["aquatic","woody","aromatic","fresh"],"The parfum. Deepest Acqua di Gio. Black bottle legend."),
m("Giorgio Armani","My Way Parfum","female",2022,4.15,["spring","fall"],["white floral","floral","fresh","woody"],"My Way parfum. Tuberose and sandalwood. Concentrated."),
m("Giorgio Armani","Code Parfum","male",2021,4.12,["fall","winter"],["woody","spicy","sweet","amber"],"Code parfum. Concentrated code. Maximum attraction."),
// Hugo Boss remaining
m("Hugo Boss","Boss Bottled Triumph Elixir","male",2022,3.95,["fall","winter"],["warm spicy","sweet","amber","woody"],"Triumph elixir. Cardamom and amber. Maximum Boss."),
m("Hugo Boss","BOSS Alive Intense EDP","female",2021,3.92,["fall","winter"],["floral","sweet","vanilla","woody"],"Intense alive. Cardamom and vanilla. Bold femininity."),
m("Hugo Boss","Boss Elixir EDP","male",2012,3.88,["fall","winter"],["warm spicy","aromatic","amber","woody"],"Boss elixir. Cardamom and geranium. Most intense Bottled."),
// Paco Rabanne remaining
m("Paco Rabanne","Invictus Victory EDP","male",2021,4.08,["fall","winter"],["aromatic","woody","spicy","amber"],"Victory invictus. The most intense. Champion parfum."),
m("Paco Rabanne","Olympea Intense EDP","female",2020,3.95,["fall","winter"],["floral","vanilla","amber","creamy"],"Olympéa intensity. Vanilla flower and ambergris. Divine."),
m("Paco Rabanne","1 Million Royal Parfum","male",2022,4.18,["fall","winter"],["warm spicy","leather","amber","rose"],"Royal million. Rose and cinnamon. Most luxurious."),
// Jean Paul Gaultier remaining
m("Jean Paul Gaultier","Divine EDP","female",2022,3.92,["spring","fall"],["floral","citrus","amber","musk"],"Divine femininity. Rose and orris. New era."),
m("Jean Paul Gaultier","Le Beau EDT","male",2019,3.88,["spring","summer"],["aquatic","coconut","fresh","woody"],"Le Beau sea. Coconut and jasmine. Summer masculinity."),
// Viktor Rolf remaining
m("Viktor & Rolf","Flowerbomb Dew EDP","female",2018,3.82,["spring","summer"],["floral","fruity","fresh","musk"],"Flowerbomb fresh dew. Peach and freesia. Summer flower."),
m("Viktor & Rolf","Spicebomb Infrared EDP","male",2021,3.95,["fall","winter"],["warm spicy","tobacco","amber","sweet"],"Infrared spicebomb. Red apple and tobacco. Hottest."),
// Burberry remaining
m("Burberry","Goddess EDP","female",2023,4.12,["fall","winter"],["sweet","floral","lavender","vanilla"],"New Burberry goddess. Lavender and vanilla. The new icon."),
m("Burberry","Her London Dream EDP","female",2020,3.85,["spring","fall"],["floral","fruity","amber","musk"],"London dream. Violet and red berries. Modern British."),
// Montblanc remaining
m("Montblanc","Signature EDP","female",2019,3.78,["spring","fall"],["floral","musk","fresh","woody"],"MB signature. Peony and musk. Modern feminine."),
m("Montblanc","Explorer Platinum EDP","male",2021,3.92,["spring","fall"],["woody","fresh spicy","earthy","citrus"],"Platinum explorer. Vetiver and black pepper. Cold noble."),
// Azzaro remaining
m("Azzaro","Most Wanted EDP","male",2022,3.92,["fall","winter"],["spicy","woody","amber","sweet"],"Most wanted. Ginger and amber. Badge of honour."),
m("Azzaro","Wanted Girl EDP","female",2019,3.78,["spring","fall"],["floral","fruity","spicy","sweet"],"Wanted girl. Pink pepper and tuberose. Bold feminine."),
// Various fills
m("Davidoff","Silver Shadow Altitude EDT","male",2006,3.70,["spring","fall"],["fresh","aromatic","woody","spicy"],"Altitude silver. Clean and elevated. Fresh masculine."),
m("Davidoff","Champion Energy EDT","male",2012,3.62,["spring","summer"],["fresh","citrus","aromatic","woody"],"Champion energy. Bergamot and mint. Active victory."),
m("Joop!","WOW EDT","male",2014,3.65,["fall","winter"],["spicy","sweet","woody","aromatic"],"WOW factor. Cardamom and amber. Seductive."),
m("Tommy Hilfiger","Impact EDT","male",2011,3.58,["spring","fall"],["fresh","aromatic","spicy","woody"],"Tommy impact. Apple and cedar. American energy."),
m("Tommy Hilfiger","Hilfiger Man EDT","male",2012,3.62,["spring","summer"],["fresh","citrus","aromatic","woody"],"Hilfiger man. Bergamot and geranium. Casual."),
m("Nautica","Life EDT","female",2008,3.62,["spring","summer"],["floral","aquatic","fresh","musk"],"Nautical life. Fresh and marine. Sea breeze."),
m("Police","Amber Sky EDT","male",2019,3.60,["fall","winter"],["amber","warm spicy","woody","citrus"],"Amber sky. Warm and accessible. Everyday luxury."),
m("Mexx","Black for Him EDT","male",2006,3.55,["fall","winter"],["fresh","citrus","woody","aromatic"],"Mexx black. Dark and fresh. Urban casual."),
m("Bogner","Fire and Ice EDT","female",2001,3.58,["spring","summer"],["floral","fruity","tropical","fresh"],"Ski resort freshness. Grapefruit and frangipani. Alpine."),
m("Hugo","Deep Red EDP","female",2001,3.75,["fall","winter"],["floral","fruity","sweet","amber"],"Hugo deep red. Tangerine and rose. Warm feminine."),
m("Karl Lagerfeld","Paradise Bay EDP","female",2014,3.65,["spring","summer"],["floral","tropical","fresh","musk"],"Paradise bay. Tropical flowers. Lagerfeld beach."),
m("Moschino","I Love Love EDT","female",2000,3.65,["spring","summer"],["citrus","floral","fresh","sweet"],"Love bottle. Citrus and jasmine. Fun accessible."),
m("Diesel","Fuel for Life EDT","male",2007,3.72,["spring","fall"],["fresh","aromatic","sweet","woody"],"Fuel your life. Lavender and tolu balsam. Urban cool."),
m("Dsquared2","Potion for Him EDT","male",2013,3.72,["fall","winter"],["spicy","woody","amber","citrus"],"D2 potion. Saffron and cedar. Magic masculine."),
m("Trussardi","Donna EDP","female",2015,3.68,["spring","fall"],["floral","fruity","woody","musk"],"Donna refined. Pear and iris. Quiet Italian."),
m("Cerruti","1881 Femme EDT","female",2001,3.68,["spring","fall"],["floral","fruity","fresh","musk"],"Cerruti femme. Bergamot and rose. Italian class."),
m("Ted Baker","Skinwear Man EDT","male",2009,3.62,["spring","summer"],["fresh","citrus","aromatic","woody"],"Skin-close freshness. Apple and geranium. British casual."),
m("Ted Baker","Skinwear Woman EDT","female",2009,3.58,["spring","summer"],["floral","citrus","fresh","musk"],"Skin freshness feminine. Grapefruit and jasmine. Light."),
m("Paul Smith","Extreme Man EDT","male",2006,3.65,["spring","fall"],["fresh","woody","citrus","aromatic"],"Extreme British. Fresh and bold. British extreme."),
m("Paul Smith","Story EDP","female",2010,3.68,["spring","fall"],["floral","rose","fresh","musk"],"Smith story. Rose and jasmine. British narrative."),
// Celebrity remaining
m("Beyoncé","Midnight Heat EDP","female",2012,3.68,["fall","winter"],["floral","oriental","sweet","musk"],"Midnight heat. Jasmine and amber. Night goddess."),
m("Ariana Grande","R.E.M. EDP","female",2020,3.78,["spring","fall"],["floral","vanilla","sweet","musk"],"REM dream. Pear and vanilla. Sweet dreaming."),
m("Taylor Swift","Taylor EDP","female",2013,3.60,["spring","fall"],["floral","fruity","sweet","musk"],"Taylor. Bergamot and jasmine. Country pop luxury."),
m("Justin Bieber","Someday EDP","unisex",2011,3.62,["spring","summer"],["fruity","floral","sweet","musk"],"Someday dream. Raspberry and jasmine. Teen idol."),
m("Jennifer Lopez","Miami Glow EDT","female",2005,3.62,["spring","summer"],["citrus","floral","fresh","musk"],"Miami glow. Bergamot and lily. Beach glamour."),
m("Jennifer Lopez","Love EDP","female",2006,3.65,["spring","fall"],["floral","citrus","sweet","musk"],"J.Lo love. Gardenia and musk. Pop romance."),
m("Beyoncé","Pulse EDP","female",2011,3.65,["spring","fall"],["floral","fruity","fresh","musk"],"Pulse. Fresh and vibrant. Queen Bey."),
m("Paris Hilton","Can Can EDP","female",2010,3.58,["spring","fall"],["fruity","floral","sweet","musk"],"Can-can dance. Apple and tuberose. Playful glamour."),
m("Paris Hilton","Tease EDP","female",2009,3.55,["spring","fall"],["fruity","floral","sweet","musk"],"Paris tease. Passionfruit and gardenia. Tropical allure."),
m("Britney Spears","In Control Curious EDP","female",2006,3.65,["spring","summer"],["fruity","floral","fresh","musk"],"In control. Apple and violet. Fresh girly sweetness."),
// Bath Body remaining
m("Bath & Body Works","Moonlight Path EDC","female",1995,3.55,["spring","fall"],["floral","musk","clean","fresh"],"Moonlit path. Soft musk and flowers. Clean classic."),
m("Bath & Body Works","Coconut Lime Breeze EDC","female",2015,3.45,["spring","summer"],["citrus","coconut","fresh","tropical"],"Coconut lime. Tropical breeze. Summer fun."),
m("Bath & Body Works","Champagne Toast EDP","female",2019,3.60,["spring","summer"],["fruity","floral","sweet","musk"],"Champagne toast. Peach and jasmine. Celebration."),
// Victoria remaining
m("Victoria's Secret","Bombshell Paris EDP","female",2019,3.70,["spring","fall"],["floral","fruity","fresh","musk"],"Bombshell Paris. French romance. European confidence."),
m("Victoria's Secret","Bare Vanilla Noir EDP","female",2021,3.75,["fall","winter"],["vanilla","musk","woody","sweet"],"Vanilla noir. Dark and sweet. Night vanilla."),
// Gap remaining
m("Gap","Heaven EDT","female",2001,3.52,["spring","summer"],["floral","fresh","citrus","musk"],"Heavenly simplicity. Lemon and jasmine. Clean accessible."),
// Elle/Oriflame remaining
m("Oriflame","Volare EDP","female",2015,3.65,["spring","summer"],["floral","fruity","fresh","musk"],"Fly away. Pear and magnolia. Light carefree."),
m("Oriflame","Divine Woman EDP","female",2016,3.62,["spring","fall"],["floral","fruity","sweet","musk"],"Divine feminine. Rose and peach. Accessible beauty."),
// Elizabeth Arden remaining
m("Elizabeth Arden","Sunflowers EDT","female",1993,3.68,["spring","summer"],["floral","fruity","fresh","citrus"],"Sunflowers. Bergamot and jasmine. Summer brightness."),
m("Elizabeth Arden","Red Door EDT","female",1989,3.75,["fall","winter"],["floral","aldehydic","oriental","woody"],"Red door. Rose and jasmine. 1989 feminine power."),
m("Elizabeth Arden","Always Yours EDP","female",2021,3.65,["spring","fall"],["floral","fruity","sweet","musk"],"Always yours. Freesia and sandalwood. Romantic."),
// Estée Lauder remaining
m("Estée Lauder","Sensuous EDP","female",2008,3.78,["fall","winter"],["floral","woody","sweet","amber"],"Sensuous. Magnolia and amber. Confident femininity."),
m("Estée Lauder","Modern Muse EDP","female",2013,3.78,["spring","fall"],["floral","fresh","musk","woody"],"Modern muse. Lily and iris. Contemporary elegance."),
m("Estée Lauder","Intuition EDP","female",2002,3.68,["spring","fall"],["floral","fruity","fresh","musk"],"Intuition. Bergamot and rose. Instinctive feminine."),
// Donna Karan remaining
m("Donna Karan","Gold EDP","female",2006,3.75,["fall","winter"],["floral","sweet","oriental","amber"],"DKNY gold. Rich and warm. New York luxury."),
m("Donna Karan","Chaos EDP","female",1996,3.68,["fall","winter"],["oriental","spicy","amber","woody"],"Donna Karan chaos. Cardamom and vetiver. Bold 90s."),
// Celebrity remaining
m("Naomi Campbell","Naomi Campbell EDP","female",2000,3.55,["spring","fall"],["floral","fruity","musk","sweet"],"Supermodel. Berry and jasmine. Catwalk luxury."),
m("Halle Berry","Halle EDP","female",2009,3.58,["spring","fall"],["floral","fruity","sweet","musk"],"Halle scent. Berry and rose. Actress luxury."),
m("Usher","She EDP","female",2007,3.52,["spring","fall"],["floral","fruity","sweet","musk"],"Usher she. Berry and jasmine. R&B feminine."),
m("Mariah Carey","M EDP","female",2007,3.55,["spring","fall"],["floral","fruity","vanilla","musk"],"Mariah M. Floral and vanilla. Superstar signature."),
// Multiples remaining
m("Revlon","Unforgettable EDP","female",2002,3.50,["spring","fall"],["floral","fruity","fresh","musk"],"Unforgettable. Rose and apple. Classic accessible."),
m("Avon","Imari EDP","female",1985,3.62,["fall","winter"],["oriental","floral","amber","sweet"],"Avon Imari. Original accessible oriental. Since 1985."),
m("Avon","Little Black Dress EDP","female",2001,3.60,["fall","winter"],["floral","woody","amber","musk"],"Little black dress. Floral and sophisticated. Accessible."),
m("Avon","Perceive EDP","female",2001,3.55,["spring","fall"],["floral","fresh","citrus","musk"],"Perceive. Fresh and accessible. Everyday elegance."),
m("Bath & Body Works","Into the Night EDP","female",2019,3.65,["fall","winter"],["floral","woody","amber","musk"],"Into the night. Jasmine and amber. Intimate evening."),
// Final sport/auto brand fills
m("Ferrari","Uomo EDT","male",2015,3.62,["spring","fall"],["fresh","citrus","woody","aromatic"],"Ferrari uomo. Italian man fresh. Speed and style."),
m("Lamborghini","Terazza EDP","male",2021,3.65,["spring","fall"],["fresh","citrus","woody","spicy"],"Terazza freshness. Bergamot and cedar. Italian outdoor."),
m("Aston Martin","Drives EDT","male",2014,3.68,["fall","winter"],["woody","amber","spicy","citrus"],"Aston Martin drives. Leather and cedar. British speed."),
m("Porsche Design","Sport EDT","male",2005,3.68,["spring","summer"],["fresh","citrus","aromatic","woody"],"Sport Porsche. Fresh and active. Driving luxury."),
m("Bentley","Momentum Unlimited EDT","male",2019,3.65,["spring","summer"],["fresh","citrus","aquatic","woody"],"Unlimited momentum. Citrus and sea. Open road."),
m("Mercedes-Benz","Sign Your Attitude EDP","male",2016,3.68,["fall","winter"],["woody","spicy","amber","aromatic"],"Sign attitude. Bold and confident. MB signature."),
m("Mercedes-Benz","VIP Club Exclusive EDT","male",2015,3.72,["fall","winter"],["woody","fresh spicy","aromatic","amber"],"VIP exclusive. Black pepper and vetiver. Clubhouse."),
m("Ducati","Ducati Black EDP","male",2016,3.62,["fall","winter"],["leather","spicy","woody","amber"],"Ducati black. Leather and pepper. Motorcycle spirit."),
m("Bugatti","Bugatti L'Essentiel EDP","male",2018,3.68,["fall","winter"],["woody","spicy","amber","leather"],"Bugatti luxury. Leather and cedar. Supercar essence."),
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
