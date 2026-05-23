<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Seed the application's database with luxury cosmetics products.
     */
    public function run(): void
    {
        $brands = Brand::all()->keyBy('slug');
        $categories = Category::all()->keyBy('slug');

        $products = [
            // ── PERFUMES ─────────────────────────────────────────
            [
                'brand' => 'dior', 'category' => 'perfumes',
                'name' => 'Sauvage Eau de Parfum',
                'short_description' => 'A bold, magnetic fragrance inspired by wide-open spaces.',
                'description' => "Sauvage Eau de Parfum is a powerful, noble trail with raw, refined ingredients. A new fragrance from Dior inspired by wide-open spaces, a sky as heated as a blazing desert. Sauvage is a radical act: a fragrance that takes note of the strength found in nature.\n\nWith Calabrian bergamot, Sichuan pepper, and star anise enveloped by ambroxan and vanilla absolute, Sauvage EDP is magnetic, enduring, and unmistakably sophisticated.",
                'price' => 130.00, 'sale_price' => null, 'sku' => 'LP-DIOR-SAU-EDP',
                'stock_quantity' => 45, 'gender' => 'men', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'dior', 'category' => 'perfumes',
                'name' => 'J\'adore Eau de Parfum',
                'short_description' => 'An iconic feminine fragrance, a gold symphony of flowers.',
                'description' => "J'adore is a modern, glamorous fragrance that has become a timeless symbol of femininity. This Eau de Parfum opens with a fresh burst of magnolia and then unfolds into a heart of Grasse rose and Indian jasmine sambac.\n\nThe sensual woody base creates a trail that is both luminous and sophisticated, embodying the absolute femininity of a modern goddess.",
                'price' => 152.00, 'sale_price' => null, 'sku' => 'LP-DIOR-JAD-EDP',
                'stock_quantity' => 38, 'gender' => 'women', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'dior', 'category' => 'perfumes',
                'name' => 'Miss Dior Blooming Bouquet',
                'short_description' => 'A tender floral fragrance, a bouquet of happiness.',
                'description' => "Miss Dior Blooming Bouquet is a delicate and sparkling Eau de Toilette celebrating love and spring. A tender composition of peony, damascena rose, and white musk creates an airy, joyful scent.\n\nLike a fresh bouquet of flowers, this fragrance captures the carefree spirit of a woman in love, leaving a trail of optimism and grace.",
                'price' => 112.00, 'sale_price' => 95.00, 'sku' => 'LP-DIOR-MDB-EDT',
                'stock_quantity' => 52, 'gender' => 'women', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'chanel', 'category' => 'perfumes',
                'name' => 'N°5 Eau de Parfum',
                'short_description' => 'The iconic fragrance. A floral-aldehyde masterpiece since 1921.',
                'description' => "Chanel N°5 needs no introduction. Created in 1921 by Ernest Beaux for Coco Chanel, it remains the most famous fragrance in the world. An abstract floral bouquet of aldehydes, ylang-ylang, neroli, jasmine, and rose at its heart.\n\nThe base of sandalwood, vetiver, and vanilla creates a trail that is at once powdery, elegant, and eternally modern. A legend that has never gone out of style.",
                'price' => 152.00, 'sale_price' => null, 'sku' => 'LP-CHAN-N5-EDP',
                'stock_quantity' => 30, 'gender' => 'women', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'chanel', 'category' => 'perfumes',
                'name' => 'Bleu de Chanel Eau de Parfum',
                'short_description' => 'A woody, aromatic fragrance for the man who defies convention.',
                'description' => "Bleu de Chanel is a woody aromatic fragrance that embodies freedom and determination. New Mint and dry cedar notes meld with the suave warmth of sandalwood and a vibrant incense accord.\n\nAn incredibly versatile and sophisticated scent that reveals different facets throughout the day, Bleu de Chanel is the fragrance of a man who refuses to be defined.",
                'price' => 145.00, 'sale_price' => null, 'sku' => 'LP-CHAN-BDC-EDP',
                'stock_quantity' => 40, 'gender' => 'men', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1594035910387-fbd1a485b12e?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'chanel', 'category' => 'perfumes',
                'name' => 'Coco Mademoiselle Eau de Parfum',
                'short_description' => 'An irresistibly fresh oriental fragrance for the free-spirited woman.',
                'description' => "Coco Mademoiselle is a fresh oriental fragrance with a strong personality. The sparkling freshness of orange is followed by the sensuality of rose and jasmine petals.\n\nA vibrant and addictive trail of patchouli and vetiver creates a bold, confident scent that captures the spirit of a young Coco Chanel — irreverent, passionate, and utterly free.",
                'price' => 142.00, 'sale_price' => null, 'sku' => 'LP-CHAN-CCM-EDP',
                'stock_quantity' => 35, 'gender' => 'women', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'tom-ford', 'category' => 'perfumes',
                'name' => 'Black Orchid Eau de Parfum',
                'short_description' => 'A luxurious, dark, and sensual fragrance. Utterly unique.',
                'description' => "Tom Ford Black Orchid is a luxurious and sensual fragrance of rich, dark accords and an alluring potion of black orchids and spice. A lush black truffle and ylang-ylang heart gives way to an unctuous base of patchouli, sandalwood, and dark chocolate.\n\nThis was the first fragrance launched by Tom Ford and remains one of the most daring and seductive scents ever created. Unisex, mysterious, and absolutely unforgettable.",
                'price' => 145.00, 'sale_price' => null, 'sku' => 'LP-TFOR-BO-EDP',
                'stock_quantity' => 25, 'gender' => 'unisex', 'volume' => '50ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'tom-ford', 'category' => 'perfumes',
                'name' => 'Oud Wood Eau de Parfum',
                'short_description' => 'Exotic oud wood blended with rare rosewood and cardamom.',
                'description' => "Oud Wood is one of Tom Ford's most prized Private Blend fragrances. Rare oud wood is blended with rosewood, cardamom, sandalwood, and vetiver in an exquisitely smooth composition.\n\nThe warm amber and tonka bean base gives this fragrance an intoxicating, smoky sophistication that lingers beautifully on the skin. A modern interpretation of one of the world's oldest and most precious ingredients.",
                'price' => 265.00, 'sale_price' => 225.00, 'sku' => 'LP-TFOR-OW-EDP',
                'stock_quantity' => 18, 'gender' => 'unisex', 'volume' => '50ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'yves-saint-laurent', 'category' => 'perfumes',
                'name' => 'Libre Eau de Parfum',
                'short_description' => 'The scent of freedom. Lavender and orange blossom in bold contrast.',
                'description' => "YSL Libre is the fragrance of freedom — a daring floral lavender that contrasts the coolness of lavender with the heat of Moroccan orange blossom. This unexpected combination creates a scent that is both masculine and feminine.\n\nWith a base of vanilla and musk, Libre is a modern manifesto of a free, bold woman who lives by her own rules.",
                'price' => 125.00, 'sale_price' => null, 'sku' => 'LP-YSL-LIB-EDP',
                'stock_quantity' => 42, 'gender' => 'women', 'volume' => '90ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'yves-saint-laurent', 'category' => 'perfumes',
                'name' => 'La Nuit de L\'Homme',
                'short_description' => 'A magnetic, mysterious fragrance for the seductive man.',
                'description' => "La Nuit de L'Homme is a bold, seductive fragrance that captures the intensity of the night. Fresh cardamom meets the dark tension of cedar and the sensuality of lavender.\n\nA fragrance that plays with contrasts — freshness and warmth, light and dark — creating an irresistible, magnetic trail that embodies modern masculine seduction.",
                'price' => 98.00, 'sale_price' => 85.00, 'sku' => 'LP-YSL-NDH-EDT',
                'stock_quantity' => 55, 'gender' => 'men', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1595425959632-34f2822322ce?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'guerlain', 'category' => 'perfumes',
                'name' => 'Shalimar Eau de Parfum',
                'short_description' => 'The legendary oriental fragrance, a timeless masterpiece since 1925.',
                'description' => "Shalimar is Guerlain's legendary oriental fragrance, created in 1925 and inspired by the passionate love story of Emperor Shah Jahan and Mumtaz Mahal. A sensual blend of bergamot, iris, jasmine, rose, and vanilla.\n\nWith its iconic smoky, leathery trail, Shalimar is a fragrance that has seduced generations of women with its timeless, opulent beauty.",
                'price' => 118.00, 'sale_price' => null, 'sku' => 'LP-GUER-SHA-EDP',
                'stock_quantity' => 28, 'gender' => 'women', 'volume' => '90ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1592842232655-e5d345cbc2e0?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'hermes', 'category' => 'perfumes',
                'name' => 'Terre d\'Hermès Eau de Parfum',
                'short_description' => 'An earthy, mineral fragrance connecting man to the earth.',
                'description' => "Terre d'Hermès is a metaphor drawing a journey from earth to sky, matter to light. A woody, earthy, mineral fragrance built around cedar and vetiver, with vibrant orange and pepper notes.\n\nThe flint accord gives this fragrance its distinctive mineral character — a scent that is both grounded and transcendent, capturing the essence of a man connected to his earth.",
                'price' => 135.00, 'sale_price' => null, 'sku' => 'LP-HERM-TDH-EDP',
                'stock_quantity' => 32, 'gender' => 'men', 'volume' => '75ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'creed', 'category' => 'perfumes',
                'name' => 'Aventus Eau de Parfum',
                'short_description' => 'The legendary scent of success, power, and ambition.',
                'description' => "Creed Aventus is inspired by the dramatic life of a historic emperor. A rich, fruity opening of pineapple, bergamot, and blackcurrant leads into a heart of birch, patchouli, and Moroccan jasmine.\n\nThe dry down of musk, oakmoss, ambergris, and vanilla creates a powerful, long-lasting trail that has become a modern classic. Often imitated, never duplicated.",
                'price' => 385.00, 'sale_price' => null, 'sku' => 'LP-CREE-AVE-EDP',
                'stock_quantity' => 15, 'gender' => 'men', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1595535873420-a599195b3f4a?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'jo-malone', 'category' => 'perfumes',
                'name' => 'English Pear & Freesia Cologne',
                'short_description' => 'The essence of autumn\'s beauty captured in a bottle.',
                'description' => "A fragrance that captures the luscious freshness of just-ripe pears, wrapped in a bouquet of white freesias and subtly underpinned with amber, patchouli, and woods.\n\nThis Jo Malone classic is quintessentially English — understated, elegant, and effortlessly beautiful. Perfect for layering with other Jo Malone colognes.",
                'price' => 115.00, 'sale_price' => null, 'sku' => 'LP-JOMA-EPF-COL',
                'stock_quantity' => 48, 'gender' => 'women', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1588514912908-3fb355e4dca0?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'louis-vuitton', 'category' => 'perfumes',
                'name' => 'Ombre Nomade Eau de Parfum',
                'short_description' => 'A journey through the desert with the rarest oud wood.',
                'description' => "Ombre Nomade captures the essence of a night spent under the desert stars. Master Perfumer Jacques Cavallier Belletrud selected the finest oud wood from Laos, enhanced with a powerful raspberry accord and a smoky incense note.\n\nThe result is an addictive, enveloping fragrance that transports you to distant lands — warm, mysterious, and utterly luxurious.",
                'price' => 390.00, 'sale_price' => null, 'sku' => 'LP-LV-ON-EDP',
                'stock_quantity' => 12, 'gender' => 'unisex', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'versace', 'category' => 'perfumes',
                'name' => 'Eros Eau de Toilette',
                'short_description' => 'A vibrant, sensual fragrance inspired by the Greek god of love.',
                'description' => "Versace Eros is named after the Greek god of love. A vibrant, fresh, and sensual fragrance that opens with mint oil, Italian lemon, and green apple. The heart reveals tonka bean, ambroxan, and geranium.\n\nThe warm base of Madagascar vanilla, vetiver, oakmoss, and cedarwood creates a powerful, masculine trail that embodies passionate strength and desire.",
                'price' => 88.00, 'sale_price' => 75.00, 'sku' => 'LP-VERS-ERO-EDT',
                'stock_quantity' => 60, 'gender' => 'men', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1600612253971-422b1bfce04f?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'givenchy', 'category' => 'perfumes',
                'name' => 'L\'Interdit Eau de Parfum',
                'short_description' => 'The thrill of the forbidden. A daring white floral.',
                'description' => "L'Interdit by Givenchy is an audacious white floral fragrance. A shot of bright tuberose meets a dark, mysterious accord of vetiver and patchouli, creating a captivating tension between light and shadow.\n\nOriginally created for Audrey Hepburn in 1957, this modern reinvention captures the same daring spirit — the thrill of crossing boundaries and embracing the forbidden.",
                'price' => 108.00, 'sale_price' => null, 'sku' => 'LP-GIV-LIN-EDP',
                'stock_quantity' => 36, 'gender' => 'women', 'volume' => '80ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'bulgari', 'category' => 'perfumes',
                'name' => 'Man in Black Eau de Parfum',
                'short_description' => 'A bold, charismatic oriental fragrance for the modern man.',
                'description' => "Bulgari Man in Black is a bold, neo-oriental fragrance that embodies the essence of a charismatic man with magnetic charm. Rich rum accord and tuberose open into a spicy heart of iris and leather.\n\nBenzoin and tonka bean in the base create a warm, addictive trail that is at once sophisticated and rebellious — a fragrance for the man who makes his own rules.",
                'price' => 95.00, 'sale_price' => null, 'sku' => 'LP-BULG-MIB-EDP',
                'stock_quantity' => 44, 'gender' => 'men', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1594035910387-fbd1a485b12e?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'lancome', 'category' => 'perfumes',
                'name' => 'La Vie Est Belle Eau de Parfum',
                'short_description' => 'Life is beautiful. A sweet iris gourmand fragrance.',
                'description' => "La Vie Est Belle is an ode to happiness and the beauty of life. A unique iris gourmand composition featuring iris, patchouli, and a blend of praline and vanilla.\n\nThis iconic fragrance from Lancôme has become one of the best-selling perfumes in the world, beloved for its warm, sweet, and utterly joyful trail.",
                'price' => 120.00, 'sale_price' => 102.00, 'sku' => 'LP-LANC-LVEB-EDP',
                'stock_quantity' => 50, 'gender' => 'women', 'volume' => '100ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1605366437899-6ccd56d1bbb9?w=600',
                'is_featured' => false,
            ],

            // ── MAKEUP ─────────────────────────────────────────────
            [
                'brand' => 'charlotte-tilbury', 'category' => 'makeup',
                'name' => 'Pillow Talk Matte Revolution Lipstick',
                'short_description' => 'The iconic nude-pink lipstick loved by celebrities worldwide.',
                'description' => "Pillow Talk is the iconic nude-pink lipstick shade that looks gorgeous on every skin tone. This award-winning Matte Revolution formula is enriched with a 3D pigment complex and a special lip-smoothing lipstick tree extract.\n\nThe square-tipped design allows for precise application, building from a sheer wash to a full matte coverage. A red-carpet favorite that flatters absolutely everyone.",
                'price' => 35.00, 'sale_price' => null, 'sku' => 'LP-CHTL-PTL-MRL',
                'stock_quantity' => 80, 'gender' => 'women', 'volume' => '3.5g', 'type' => 'makeup',
                'image_url' => 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'charlotte-tilbury', 'category' => 'makeup',
                'name' => 'Hollywood Flawless Filter',
                'short_description' => 'A complexion booster for a lit-from-within Hollywood glow.',
                'description' => "Hollywood Flawless Filter is a complexion booster that can be used as a primer, mixed with foundation, or applied on top for a gorgeous, candlelit glow. Light-diffusing microspheres blur the appearance of pores and fine lines.\n\nThis best-selling product gives you that coveted Hollywood red-carpet radiance in an instant. Available in shades to complement every skin tone.",
                'price' => 46.00, 'sale_price' => null, 'sku' => 'LP-CHTL-HFF-FND',
                'stock_quantity' => 65, 'gender' => 'women', 'volume' => '33ml', 'type' => 'makeup',
                'image_url' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'dior', 'category' => 'makeup',
                'name' => 'Rouge Dior Lipstick — 999 Velvet',
                'short_description' => 'The iconic Dior lipstick in the maison\'s signature red.',
                'description' => "Rouge Dior 999 is the House of Dior's iconic red — a shade that has become the symbol of couture beauty. This new-generation lipstick delivers 16 hours of comfort and an ultra-pigmented, velvet finish.\n\nEnriched with floral lip care and a refillable design, Rouge Dior combines luxury, performance, and sustainability. The perfect red for every woman.",
                'price' => 44.00, 'sale_price' => null, 'sku' => 'LP-DIOR-RD999-VEL',
                'stock_quantity' => 70, 'gender' => 'women', 'volume' => '3.5g', 'type' => 'makeup',
                'image_url' => 'https://images.unsplash.com/photo-1631214500115-598fc2cb8ada?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'chanel', 'category' => 'makeup',
                'name' => 'Les Beiges Healthy Glow Foundation',
                'short_description' => 'A lightweight, natural-finish foundation for effortless beauty.',
                'description' => "Les Beiges Healthy Glow Foundation delivers a natural, luminous finish that enhances skin rather than masking it. The lightweight, fluid texture melts into the skin, providing buildable coverage and a fresh, healthy-looking glow.\n\nWith skin-caring ingredients and Chanel's signature elegance, this foundation is the epitome of no-makeup makeup — looking like yourself, only better.",
                'price' => 65.00, 'sale_price' => null, 'sku' => 'LP-CHAN-LBHG-FND',
                'stock_quantity' => 55, 'gender' => 'women', 'volume' => '30ml', 'type' => 'makeup',
                'image_url' => 'https://images.unsplash.com/photo-1631214524115-4da29d843e7f?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'tom-ford', 'category' => 'makeup',
                'name' => 'Lip Color Matte — Velvet Cherry',
                'short_description' => 'Ultra-rich, creamy matte lipstick in a deep, dramatic cherry.',
                'description' => "Tom Ford Lip Color Matte delivers intense, full coverage in a smooth matte finish that is never dry or cakey. Velvet Cherry is a deep, wine-red shade that exudes glamour and sophistication.\n\nFormulated with rare ingredients including soja seed extract and Brazilian murumuru butter, this lipstick nourishes and softens lips while delivering Tom Ford's signature intense pigmentation.",
                'price' => 58.00, 'sale_price' => null, 'sku' => 'LP-TFOR-LCM-VC',
                'stock_quantity' => 40, 'gender' => 'women', 'volume' => '3g', 'type' => 'makeup',
                'image_url' => 'https://images.unsplash.com/photo-1608979048467-6194a4f69420?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'yves-saint-laurent', 'category' => 'makeup',
                'name' => 'Touche Éclat Le Teint Foundation',
                'short_description' => 'A luminous, medium-coverage foundation with a radiant finish.',
                'description' => "Touche Éclat Le Teint is YSL's iconic radiant foundation that gives skin a luminous, fresh-faced glow. Enriched with biotin, a skin-loving vitamin, it improves skin quality over time.\n\nThe buildable, medium coverage formula creates a natural, lit-from-within effect that has made this product a cult favorite among makeup artists and beauty lovers worldwide.",
                'price' => 52.00, 'sale_price' => null, 'sku' => 'LP-YSL-TELT-FND',
                'stock_quantity' => 48, 'gender' => 'women', 'volume' => '25ml', 'type' => 'makeup',
                'image_url' => 'https://images.unsplash.com/photo-1614159869072-254de09c5382?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'lancome', 'category' => 'makeup',
                'name' => 'Lash Idôle Mascara',
                'short_description' => 'Lift, lengthen, and volumize with the limitless lash look.',
                'description' => "Lash Idôle is Lancôme's award-winning mascara that delivers maximum length, lift, and volume without clumping or flaking. The innovative micro-precision brush fans out every single lash.\n\nFormulated with rose extract and a defining polymer complex, this mascara creates a limitless lash look that lasts up to 24 hours. The perfect mascara for wide-open, doll-like eyes.",
                'price' => 29.00, 'sale_price' => null, 'sku' => 'LP-LANC-LI-MSC',
                'stock_quantity' => 90, 'gender' => 'women', 'volume' => '10ml', 'type' => 'makeup',
                'image_url' => 'https://images.unsplash.com/photo-1631214500115-598fc2cb8ada?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'givenchy', 'category' => 'makeup',
                'name' => 'Prisme Libre Loose Powder',
                'short_description' => 'A luminous, color-correcting loose powder for a flawless finish.',
                'description' => "Prisme Libre is Givenchy's iconic loose powder featuring four color-correcting shades that blend together to illuminate, mattify, and perfect the complexion.\n\nThe ultra-fine, lightweight formula sets makeup for all-day wear while maintaining skin's natural radiance. A backstage beauty secret that has been a cult favorite since its creation.",
                'price' => 52.00, 'sale_price' => 44.00, 'sku' => 'LP-GIV-PL-PWD',
                'stock_quantity' => 42, 'gender' => 'women', 'volume' => '20g', 'type' => 'makeup',
                'image_url' => 'https://images.unsplash.com/photo-1599733594230-6b823276abcc?w=600',
                'is_featured' => false,
            ],

            // ── SKINCARE ─────────────────────────────────────────
            [
                'brand' => 'la-mer', 'category' => 'skincare',
                'name' => 'Crème de la Mer Moisturizing Cream',
                'short_description' => 'The legendary moisturizer with cell-renewing Miracle Broth™.',
                'description' => "Crème de la Mer is the legendary moisturizer that has achieved cult status in the world of luxury skincare. At its heart lies the proprietary Miracle Broth™, a cell-renewing elixir that took twelve years to develop.\n\nSea kelp, vitamins, minerals, and other nutrients are fermented for three to four months to create this powerful healing compound. The rich, luxurious cream visibly transforms skin — softening, smoothing, and energizing for a vibrant, healthy radiance.\n\nThis 60ml jar represents the ultimate in skincare luxury.",
                'price' => 350.00, 'sale_price' => null, 'sku' => 'LP-LAME-CDM-60',
                'stock_quantity' => 20, 'gender' => 'unisex', 'volume' => '60ml', 'type' => 'skincare',
                'image_url' => 'https://images.unsplash.com/photo-1570194065650-d99fb4a38c5f?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'la-mer', 'category' => 'skincare',
                'name' => 'The Concentrate Serum',
                'short_description' => 'A barrier-strengthening treatment serum for sensitive skin.',
                'description' => "The Concentrate is La Mer's most potent serum, created for skin that needs extra care and healing. A highly concentrated dose of Miracle Broth™ combined with a Lime Tea Concentrate soothes visible irritation and strengthens the skin's natural barrier.\n\nThis luxurious serum transforms the look of redness, sensitivity, and post-procedure skin, delivering visible results that are nothing short of miraculous.",
                'price' => 475.00, 'sale_price' => null, 'sku' => 'LP-LAME-TCN-SRM',
                'stock_quantity' => 10, 'gender' => 'unisex', 'volume' => '50ml', 'type' => 'skincare',
                'image_url' => 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'chanel', 'category' => 'skincare',
                'name' => 'Le Lift Pro Concentré Contours',
                'short_description' => 'A targeted concentrate for defining and sculpting facial contours.',
                'description' => "Le Lift Pro Concentré Contours is a targeted treatment that helps redefine and sculpt facial contours. Enriched with active botanical ingredients, this concentrated formula works to visibly lift and firm the skin.\n\nA lightweight, fast-absorbing texture melts into the skin, delivering Chanel's advanced skincare science directly where it's needed most.",
                'price' => 195.00, 'sale_price' => null, 'sku' => 'LP-CHAN-LLPC-SRM',
                'stock_quantity' => 22, 'gender' => 'women', 'volume' => '30ml', 'type' => 'skincare',
                'image_url' => 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'dior', 'category' => 'skincare',
                'name' => 'Capture Totale Super Potent Serum',
                'short_description' => 'An anti-aging serum that firms, corrects, and plumps.',
                'description' => "Capture Totale Super Potent Serum is Dior's most powerful anti-aging serum. Concentrated with 90% natural-origin ingredients, including longoza flower, hyaluronic acid, and a complex of 50 bio-revitalizing signals.\n\nThe rich, silky texture penetrates deeply to visibly reduce wrinkles, firm skin, and restore a youthful, radiant glow. Results are visible from the very first application.",
                'price' => 155.00, 'sale_price' => 132.00, 'sku' => 'LP-DIOR-CTSP-SRM',
                'stock_quantity' => 30, 'gender' => 'women', 'volume' => '50ml', 'type' => 'skincare',
                'image_url' => 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'guerlain', 'category' => 'skincare',
                'name' => 'Abeille Royale Youth Watery Oil',
                'short_description' => 'A silky oil-in-water texture that firms and illuminates.',
                'description' => "Abeille Royale Youth Watery Oil combines the power of bee products — Ouessant Black Bee Honey and Royal Jelly — in a revolutionary oil-in-water texture. The formula penetrates quickly to deliver deep hydration and visible firming.\n\nSkin appears visibly younger, smoother, and more radiant. An innovative and luxurious skincare experience from the House of Guerlain.",
                'price' => 85.00, 'sale_price' => null, 'sku' => 'LP-GUER-ARYO-OIL',
                'stock_quantity' => 35, 'gender' => 'women', 'volume' => '50ml', 'type' => 'skincare',
                'image_url' => 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600',
                'is_featured' => false,
            ],

            // ── JEWELRY ──────────────────────────────────────────
            [
                'brand' => 'cartier', 'category' => 'jewelry',
                'name' => 'Love Bracelet — Yellow Gold',
                'short_description' => 'The iconic symbol of enduring love and commitment.',
                'description' => "The Cartier Love Bracelet is one of the most iconic pieces of jewelry ever created. Designed in 1969 in New York by Aldo Cipullo, the Love bracelet is a symbol of everlasting love — a bracelet that fastens with a special screwdriver, symbolizing a bond that cannot be broken.\n\nCrafted in 18K yellow gold with the signature screw motifs, this timeless piece transcends trends and has been worn by the most stylish people in the world for over five decades.",
                'price' => 6900.00, 'sale_price' => null, 'sku' => 'LP-CART-LOVE-YG',
                'stock_quantity' => 5, 'gender' => 'unisex', 'volume' => null, 'type' => 'jewelry',
                'image_url' => 'https://images.unsplash.com/photo-1515562141589-67f0d569b6fc?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'cartier', 'category' => 'jewelry',
                'name' => 'Juste un Clou Bracelet — Rose Gold',
                'short_description' => 'A rebellious design icon — a nail transformed into fine jewelry.',
                'description' => "Juste un Clou is Cartier at its most daring — a simple nail, transformed into a piece of high jewelry. Originally designed in the 1970s, this bracelet embodies the rebellious spirit of New York City.\n\nCrafted in 18K rose gold, Juste un Clou is an unconventional take on luxury — proof that the most beautiful objects can come from the most unexpected sources.",
                'price' => 7500.00, 'sale_price' => null, 'sku' => 'LP-CART-JUN-RG',
                'stock_quantity' => 3, 'gender' => 'unisex', 'volume' => null, 'type' => 'jewelry',
                'image_url' => 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'bulgari', 'category' => 'jewelry',
                'name' => 'Serpenti Viper Necklace — White Gold & Diamonds',
                'short_description' => 'A sinuous jewel inspired by the seductive power of the snake.',
                'description' => "The Serpenti Viper necklace captures the sinuous beauty and mesmerizing power of the serpent — Bulgari's most iconic symbol. Crafted in 18K white gold and set with pavé diamonds.\n\nThe fluid, scale-like design wraps around the neck with a sensual, elegant grace that embodies Italian glamour at its finest. A statement piece for the bold and the beautiful.",
                'price' => 12500.00, 'sale_price' => null, 'sku' => 'LP-BULG-SVN-WGD',
                'stock_quantity' => 2, 'gender' => 'women', 'volume' => null, 'type' => 'jewelry',
                'image_url' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
                'is_featured' => true,
            ],

            // ── ACCESSORIES ─────────────────────────────────────
            [
                'brand' => 'dior', 'category' => 'accessories',
                'name' => 'DiorBlackSuit S11I Sunglasses',
                'short_description' => 'Iconic rectangular sunglasses with the Dior Oblique motif.',
                'description' => "The DiorBlackSuit S11I sunglasses feature a bold rectangular shape with the iconic Dior Oblique pattern on the temples. A sophisticated accessory that combines Italian craftsmanship with Dior's unmistakable design language.\n\nThese sunglasses are perfect for the man who appreciates both style and substance — offering full UV protection with luxury aesthetics.",
                'price' => 420.00, 'sale_price' => 357.00, 'sku' => 'LP-DIOR-DBS-SNG',
                'stock_quantity' => 15, 'gender' => 'men', 'volume' => null, 'type' => 'accessory',
                'image_url' => 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'hermes', 'category' => 'accessories',
                'name' => 'Carré 90 Silk Scarf — Brides de Gala',
                'short_description' => 'The iconic Hermès silk scarf in the legendary Brides de Gala print.',
                'description' => "The Brides de Gala is one of Hermès' most iconic scarf designs, first created in 1957 by Hugo Grygkar. This 90cm x 90cm carré is crafted from the finest twill silk, hand-rolled and hand-printed.\n\nEach scarf requires up to 750 hours of engraving work and is printed using the silk-screen technique with up to 45 separate screens. A wearable work of art that defines effortless French elegance.",
                'price' => 495.00, 'sale_price' => null, 'sku' => 'LP-HERM-C90-BDG',
                'stock_quantity' => 8, 'gender' => 'women', 'volume' => '90x90cm', 'type' => 'accessory',
                'image_url' => 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600',
                'is_featured' => true,
            ],

            // ── GIFT SETS ───────────────────────────────────────
            [
                'brand' => 'dior', 'category' => 'gift-sets',
                'name' => 'J\'adore Gift Set — EDP + Body Milk + Travel Spray',
                'short_description' => 'The complete J\'adore luxury gift set in an iconic presentation box.',
                'description' => "This exquisite Dior J'adore gift set contains: J'adore Eau de Parfum (100ml), J'adore Beautifying Body Milk (75ml), and J'adore Eau de Parfum Travel Spray (10ml).\n\nPresented in Dior's signature white and gold gift box, this set is the perfect luxury gift for someone special — or a beautiful way to complete your own J'adore collection.",
                'price' => 185.00, 'sale_price' => 165.00, 'sku' => 'LP-DIOR-JAD-GS',
                'stock_quantity' => 25, 'gender' => 'women', 'volume' => '100ml + 75ml + 10ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=600',
                'is_featured' => true,
            ],
            [
                'brand' => 'chanel', 'category' => 'gift-sets',
                'name' => 'Bleu de Chanel Gift Set — EDP + Shower Gel',
                'short_description' => 'A refined gift set featuring Bleu de Chanel essentials.',
                'description' => "This Chanel gift set includes Bleu de Chanel Eau de Parfum (100ml) and Bleu de Chanel Shower Gel (200ml). The perfect combination for the sophisticated modern man.\n\nPresented in Chanel's iconic black and white packaging, this set makes an impressive and luxurious gift.",
                'price' => 172.00, 'sale_price' => null, 'sku' => 'LP-CHAN-BDC-GS',
                'stock_quantity' => 20, 'gender' => 'men', 'volume' => '100ml + 200ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'tom-ford', 'category' => 'gift-sets',
                'name' => 'Private Blend Discovery Set',
                'short_description' => 'A curated collection of Tom Ford\'s most iconic Private Blend scents.',
                'description' => "Discover the world of Tom Ford Private Blend with this luxurious discovery set. Contains six 4ml miniatures of the most iconic scents: Black Orchid, Oud Wood, Tobacco Vanille, Lost Cherry, Bitter Peach, and Neroli Portofino.\n\nThe perfect introduction to the Private Blend collection, presented in a sleek black and gold case that embodies Tom Ford's obsessive attention to detail.",
                'price' => 95.00, 'sale_price' => null, 'sku' => 'LP-TFOR-PBD-SET',
                'stock_quantity' => 30, 'gender' => 'unisex', 'volume' => '6x4ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600',
                'is_featured' => true,
            ],

            // ── MORE SKINCARE ─────────────────────────────────
            [
                'brand' => 'lancome', 'category' => 'skincare',
                'name' => 'Advanced Génifique Youth Activating Serum',
                'short_description' => 'A fast-acting serum for visibly younger, radiant skin.',
                'description' => "Advanced Génifique is Lancôme's #1 anti-aging serum. Its patented formula features a unique probiotic complex that strengthens skin's microbiome for a visibly younger, more resilient complexion.\n\nJust one drop is enough to see a visible transformation — stronger, smoother, more luminous skin within just 7 days. Suitable for all skin types and ages.",
                'price' => 115.00, 'sale_price' => 98.00, 'sku' => 'LP-LANC-AG-SRM',
                'stock_quantity' => 40, 'gender' => 'women', 'volume' => '50ml', 'type' => 'skincare',
                'image_url' => 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600',
                'is_featured' => false,
            ],

            // ── MORE PERFUMES ─────────────────────────────────
            [
                'brand' => 'tom-ford', 'category' => 'perfumes',
                'name' => 'Tobacco Vanille Eau de Parfum',
                'short_description' => 'Opulent, warm, and spicy — a modern classic.',
                'description' => "Tobacco Vanille is a luxurious, warm, and addictive fragrance from Tom Ford's Private Blend collection. Rich tobacco leaf and aromatic spices are softened by creamy tonka bean, vanilla, cocoa, dried fruits, and sweet wood sap.\n\nThis is one of the most beloved fragrances in the world — a cozy, enveloping scent that evokes the warmth of a gentlemen's club. Unisex, distinctive, and utterly addictive.",
                'price' => 285.00, 'sale_price' => null, 'sku' => 'LP-TFOR-TV-EDP',
                'stock_quantity' => 20, 'gender' => 'unisex', 'volume' => '50ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'tom-ford', 'category' => 'perfumes',
                'name' => 'Lost Cherry Eau de Parfum',
                'short_description' => 'A provocative, liqueur-like scent of black cherry and almond.',
                'description' => "Lost Cherry is an intoxicating gourmand fragrance that plays on the idea of the forbidden. A luscious black cherry is enhanced by bitter almond and liqueur accords, creating a scent that is at once sweet and sensual.\n\nTurkish rose and jasmine sambac add floral depth, while a base of sandalwood, vetiver, and roasted tonka bean creates a warm, addictive trail. Provocative and utterly irresistible.",
                'price' => 295.00, 'sale_price' => 250.00, 'sku' => 'LP-TFOR-LC-EDP',
                'stock_quantity' => 16, 'gender' => 'unisex', 'volume' => '50ml', 'type' => 'perfume',
                'image_url' => 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=600',
                'is_featured' => false,
            ],

            // ── MORE MAKEUP ─────────────────────────────────
            [
                'brand' => 'charlotte-tilbury', 'category' => 'makeup',
                'name' => 'Luxury Palette — The Dolce Vita',
                'short_description' => 'A warm, romantic eyeshadow palette for seductive, smoky eyes.',
                'description' => "The Dolce Vita is Charlotte Tilbury's dreamy, warm-toned eyeshadow palette inspired by la dolce vita — the sweet life. Four coordinating shades in matte and shimmer finishes create a mesmerizing, smoky eye look.\n\nWith Charlotte's signature 3-step application guide, even makeup novices can achieve a professional, red-carpet-worthy eye look in minutes.",
                'price' => 53.00, 'sale_price' => null, 'sku' => 'LP-CHTL-LP-DV',
                'stock_quantity' => 50, 'gender' => 'women', 'volume' => '5.2g', 'type' => 'makeup',
                'image_url' => 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600',
                'is_featured' => false,
            ],
            [
                'brand' => 'dior', 'category' => 'makeup',
                'name' => 'Dior Backstage Face & Body Foundation',
                'short_description' => 'A professional, water-resistant foundation for all skin types.',
                'description' => "Dior Backstage Face & Body Foundation is the professional, buildable foundation used backstage at Dior fashion shows. A weightless, water-resistant formula that delivers natural, skin-like coverage.\n\nAvailable in 40 shades, this foundation adapts to all skin types and is perfect for both everyday wear and special occasions. Applied by hand, sponge, or brush for customizable coverage.",
                'price' => 42.00, 'sale_price' => null, 'sku' => 'LP-DIOR-DBFB-FND',
                'stock_quantity' => 60, 'gender' => 'unisex', 'volume' => '50ml', 'type' => 'makeup',
                'image_url' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
                'is_featured' => false,
            ],

            // ── MORE JEWELRY ─────────────────────────────────
            [
                'brand' => 'cartier', 'category' => 'jewelry',
                'name' => 'Trinity Ring — Classic',
                'short_description' => 'Three intertwined bands of gold — a symbol of eternal connection.',
                'description' => "The Cartier Trinity Ring is one of the maison's most beloved creations, designed in 1924 by Louis Cartier. Three interlocking bands of white, yellow, and rose gold represent friendship, fidelity, and love.\n\nThis timeless piece is simultaneously minimalist and meaningful — a perfect daily wear piece that carries deep symbolism. Worn by icons from Jean Cocteau to Grace Kelly.",
                'price' => 1150.00, 'sale_price' => null, 'sku' => 'LP-CART-TRI-CL',
                'stock_quantity' => 10, 'gender' => 'unisex', 'volume' => null, 'type' => 'jewelry',
                'image_url' => 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
                'is_featured' => false,
            ],
        ];

        $skuCounter = 1;

        foreach ($products as $productData) {
            $brandSlug = $productData['brand'];
            $categorySlug = $productData['category'];

            unset($productData['brand'], $productData['category']);

            $productData['brand_id'] = $brands[$brandSlug]->id;
            $productData['category_id'] = $categories[$categorySlug]->id;
            $productData['slug'] = Str::slug($productData['name']);

            // Ensure slug uniqueness
            $existingCount = Product::where('slug', $productData['slug'])->count();
            if ($existingCount > 0) {
                $productData['slug'] .= '-' . $skuCounter++;
            }

            Product::create($productData);
        }
    }
}
