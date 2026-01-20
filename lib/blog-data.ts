export interface BlogPost {
  id: number;
  slug: string;
  date: string;
  readTime: string;
  title: string;
  description: string;
  image: string;
  category: string;
  content: ContentBlock[];
}

export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'image' | 'list';
  text?: string;
  items?: string[];
  src?: string;
  alt?: string;
  author?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'would-you-rather-eat-this-or-that',
    date: 'Jul 19, 2025',
    readTime: '4 min read',
    title: 'Would You Rather Eat This or That?',
    description:
      "It's a foodie's version of a personality test. On one side, you're standing on a neon-lit street in Bangkok, a mango sticky rice in one hand. On the other, you're sinking into a leather chair in Paris, your waiter placing a delicate soufflé on the table.",
    image: '/images/blog.jpg',
    category: 'Food Culture',
    content: [
      {
        type: 'paragraph',
        text: '"Would you rather eat this or that?" It\'s a foodie\'s version of a personality test.',
      },
      {
        type: 'paragraph',
        text: "On one side, you're standing on a neon-lit street in Bangkok, a mango sticky rice in one hand, the smell of grilled satay in the air. On the other hand, you're sinking into a leather chair in Paris, your waiter placing a delicate soufflé on the table like it's a Fabergé egg.",
      },
      {
        type: 'paragraph',
        text: "I've spent 20+ years chasing flavors across continents, and here's what I've realized: food is never just about taste. It's about energy, culture, and the story behind every bite. So let's jet-set together, stopping at street stalls in Delhi and dining rooms in New York to finally settle this delicious debate.",
      },
      {
        type: 'heading',
        text: '1. The Vibe: Raw Chaos vs Curated Calm',
      },
      {
        type: 'paragraph',
        text: 'Street Food: Where the Streets Come Alive',
      },
      {
        type: 'paragraph',
        text: "Picture this: Hanoi at sunrise. Locals perch on plastic stools, slurping steaming bowls of pho. Scooters whiz by. A vendor tosses fresh herbs into your broth with a practiced flick of the wrist. The energy is infectious.",
      },
      {
        type: 'paragraph',
        text: "Or take Mexico City's tacos al pastor, stand music blaring, meat spinning on the spit, pineapple juices dripping down. You're not just eating; you're part of the city's heartbeat.",
      },
      {
        type: 'paragraph',
        text: 'Restaurant: A Symphony of Calm',
      },
      {
        type: 'paragraph',
        text: "Now shift to Tokyo's Ginza district. You walk into a minimalist sushi bar. The chef greets you softly. He crafts your nigiri like an artist painting brushstrokes of rice, wasabi, and fish, perfection. Here, food isn't rushed; it's revered.",
      },
      {
        type: 'paragraph',
        text: "Restaurants are havens of order and intention. A place to pause while the world spins outside.",
      },
      {
        type: 'quote',
        text: "Whether you're craving that spicy buka food from a trusted vendor or searching for an elegant dining experience, LocalBuka's Easy Discovery feature helps you find both in seconds. Just open the app and let it guide you to whatever vibe matches your mood.",
        author: 'How LocalBuka Helps',
      },
      {
        type: 'heading',
        text: '2. Cost: Cheap Thrills vs Culinary Investments',
      },
      {
        type: 'paragraph',
        text: 'Street Food: A Feast for Your Wallet',
      },
      {
        type: 'paragraph',
        text: 'In Istanbul, I handed over a few lira for a simit a sesame-crusted bread ring still warm from the oven. In Bangkok, 30 baht got me a spicy pad kra pao topped with a runny egg.',
      },
      {
        type: 'paragraph',
        text: "Street food is where magic meets affordability. For locals, it's fuel. For travelers, it's an adventure on a budget.",
      },
      {
        type: 'paragraph',
        text: 'Restaurant: Paying for Perfection',
      },
      {
        type: 'paragraph',
        text: "Contrast that with the time I dined at Eleven Madison Park in New York. A 12-course tasting menu that left both my stomach and credit card full. Was it expensive? Absolutely. But every dish felt like theater, each bite a masterclass in balance and creativity.",
      },
      {
        type: 'heading',
        text: '3. Flavor: Wild & Free vs Perfectly Polished',
      },
      {
        type: 'paragraph',
        text: 'Street Food: Bold, Untamed, Unapologetic',
      },
      {
        type: 'paragraph',
        text: 'In Mumbai, I watched a pani puri vendor punch holes in crisp puris and fill them with spicy water. The flavors hit like fireworks—sweet, sour, spicy, all at once.',
      },
      {
        type: 'paragraph',
        text: 'In Seoul, a stall owner handed me tteokbokki—chewy rice cakes swimming in fiery gochujang sauce. My tongue burned. I smiled anyway.',
      },
      {
        type: 'paragraph',
        text: 'Street vendors experiment fearlessly. Flavors evolve on the street, responding to customers in real time.',
      },
      {
        type: 'paragraph',
        text: 'Restaurant: Discipline on a Plate',
      },
      {
        type: 'paragraph',
        text: "At a vineyard restaurant in Tuscany, I was served hand-rolled pici pasta with truffle butter. Every strand was perfectly coated. The chef explained how they tested the sauce for weeks to balance richness and earthiness.",
      },
      {
        type: 'paragraph',
        text: "Restaurants offer consistency. You don't have to wonder if your next bite will surprise you — it won't. That's the point.",
      },
      {
        type: 'heading',
        text: '4. Whose Tale Are You Tasting?',
      },
      {
        type: 'paragraph',
        text: "Street Food: Generations on a Plate. That mole in Oaxaca? The vendor's grandmother's recipe. He told me how she stirred it for hours every Sunday, her wooden spoon carving stories into the pot. With every bite, you taste family, culture, and history.",
      },
      {
        type: 'paragraph',
        text: "Restaurant: A Chef's Vision. In contrast, a restaurant chef tells their story. The foie gras terrine I tried in Paris wasn't just food, it was the chef's love letter to autumn in the French countryside.",
      },
      {
        type: 'heading',
        text: 'So, Would You Rather Eat This or That?',
      },
      {
        type: 'paragraph',
        text: 'Choose street food for the rush of spontaneity, vibrant flavors, and wallet-friendly fun.',
      },
      {
        type: 'paragraph',
        text: 'Choose restaurants for crafted experiences, flawless service, and moments to remember.',
      },
      {
        type: 'quote',
        text: "With LocalBuka, you don't have to choose between \"this\" or \"that.\" You get both effortlessly.",
        author: 'LocalBuka',
      },
    ],
  },
  {
    id: 2,
    slug: 'nigerias-culinary-adventure-street-food-gems-to-fine-dining',
    date: 'Mar 18, 2025',
    readTime: '4 min read',
    title: "Nigeria's Culinary Adventure: Street Food Gems to Fine Dining Bliss",
    description:
      "Discover the best Nigerian cuisine — from sizzling street food to luxurious fine dining. Picture this: the sizzle of suya skewers over an open flame, a Lagos vendor shouting prices over honking horns, the air thick with spice and hustle.",
    image: '/images/blog2.jpg',
    category: 'Nigerian Cuisine',
    content: [
      {
        type: 'paragraph',
        text: 'Discover the best Nigerian cuisine — from sizzling street food to luxurious fine dining.',
      },
      {
        type: 'paragraph',
        text: "Yay! Welcome back Bukaterians! We're still buzzing from your epic love on our last post, Pure fire! You're the reason we're back with more Nigerian food goodness to make your taste buds dance.",
      },
      {
        type: 'paragraph',
        text: "Picture this: the sizzle of suya skewers over an open flame, a Lagos vendor shouting prices over honking horns, the air thick with spice and hustle.",
      },
      {
        type: 'paragraph',
        text: "Welcome to Nigeria's food scene, a wild ride from gritty street eats to sleek fine dining spots that could rival any global hotspot. Whether you're craving the chaos of a hidden roadside buka or the elegance of a Victoria Island restaurant, this country's flavors tell a story of culture, grit, and innovation.",
      },
      {
        type: 'heading',
        text: "Best Nigerian Street Foods You Can't-Miss",
      },
      {
        type: 'paragraph',
        text: "Nigeria's streets are a food lover's playground. Forget fancy plates, these dishes come wrapped in newspaper or slapped on a plastic tray, bursting with flavor. Here's what you need to try:",
      },
      {
        type: 'list',
        items: [
          "Suya: Smoky, spicy, and downright addictive, these grilled meat skewers are a late-night staple. Pro tip: Ask for extra pepper if you're brave.",
          'Jollof Rice: The king of West African cuisine, still sparking Nigeria-Ghana debates online. It\'s smoky, tomato-rich, and everywhere from roadside stalls to weddings.',
          'Akara: These fried bean cakes are breakfast gold, crispy outside, soft inside, and usually paired with pap or bread.',
        ],
      },
      {
        type: 'paragraph',
        text: "The street food game isn't all rosy, though. Power cuts force vendors to improvise with charcoal or kerosene, and the hustle gets messy: spilled stew, dodging okadas, the works. But that's the charm: raw, unfiltered, and unforgettable.",
      },
      {
        type: 'heading',
        text: 'Why Fine Dining in Nigeria Is Booming',
      },
      {
        type: 'paragraph',
        text: "Then there's the upscale flip. Nigeria's fine dining scene, where chefs are turning local ingredients into art. Spots like Nok by Alara in Lagos or RSVP Lagos in Abuja are redefining Naija cuisine. Think pounded yam swallow or egusi soup deconstructed on a sleek white plate.",
      },
      {
        type: 'paragraph',
        text: "Gen Z foodies are flooding Instagram with pics, and expats are craving home flavors with a twist. Chefs are pushing boundaries, pairing suya spice with French techniques. But it's not cheap, dinner for two can hit ₦50,000, a stretch when fuel prices are spiking again. Still, the vibe? Electric.",
      },
      {
        type: 'heading',
        text: 'The Culinary Soul of Nigeria',
      },
      {
        type: 'paragraph',
        text: "From the smoky grills of a buka to the polished tables of upscale eateries, Nigeria's food scene mirrors its people, bold, diverse, and a little chaotic. Street vendors fight power outages with grit; fine dining chefs remix tradition with swagger.",
      },
      {
        type: 'quote',
        text: "Finding the perfect meal should be effortless! LocalBuka is your go-to food discovery platform, helping you explore top-rated restaurants and bukas based on budget, location, and cuisine preferences.",
        author: 'Bridging the Gap with LocalBuka',
      },
      {
        type: 'paragraph',
        text: "What's your favorite Nigerian dish? Drop it below, I'm craving ideas for my next meal!",
      },
    ],
  },
  {
    id: 3,
    slug: 'food-photography-tips-mouthwatering-photos-with-phone',
    date: 'Apr 4, 2025',
    readTime: '6 min read',
    title: 'Food Photography Tips: How to Take Mouthwatering Photos with Your Phone',
    description:
      "The difference between a photo that makes people hungry and one that makes them go, \"What happened here?\" is lighting, angles, and simple tricks. Let's make your food photos as mouthwatering as the meals themselves.",
    image: '/images/blog.jpg',
    category: 'Tips & Tricks',
    content: [
      {
        type: 'paragraph',
        text: "Heyo Bukaterians! Welcome back! Last time, we took a delicious journey through Nigeria's rich culinary scene. But here's the thing: what's the point of experiencing all that greatness if your photos don't do it justice?",
      },
      {
        type: 'paragraph',
        text: 'The difference between a photo that makes people hungry and one that makes them go, "What happened here?" is lighting, angles, and simple tricks.',
      },
      {
        type: 'heading',
        text: "1. Lighting: The Main Difference Between 'Appetizing' and 'Are You Okay?'",
      },
      {
        type: 'paragraph',
        text: "The best option? Natural light. Open a window. Stand near the sun. If you must use artificial light, avoid those harsh shadows that make your food look like it's starring in a horror film.",
      },
      {
        type: 'paragraph',
        text: "Pro tip: If the lighting is bad, you can use another phone's flashlight with a napkin to make it softer and more natural.",
      },
      {
        type: 'heading',
        text: '2. Angles: Your Food Deserves a Good Side Too',
      },
      {
        type: 'paragraph',
        text: 'Top-down shots work best for flat foods like pizza. A slight side angle is perfect for stacked foods like burgers. A plate of suya? Try a close-up to highlight those spices.',
      },
      {
        type: 'heading',
        text: '3. Composition: Keep It Simple, Chef!',
      },
      {
        type: 'list',
        items: [
          'Rule of Thirds: Place your main subject at one of the grid intersecting points instead of dead center.',
          'Negative Space: Sometimes, leaving space around your food makes it pop even more.',
          'Leading Lines: Use utensils, table edges, or hands to create a natural flow in the image.',
        ],
      },
      {
        type: 'heading',
        text: '4. Focus: Make the Food the Star',
      },
      {
        type: 'paragraph',
        text: "Blur the background and let the food take center stage. Think of it like setting up a date, nobody cares about the restaurant decor if the main attraction looks bad.",
      },
      {
        type: 'heading',
        text: '5. Texture: The Secret Ingredient of a Good Photo',
      },
      {
        type: 'paragraph',
        text: 'Nobody wants to see a dry-looking cake. Highlight the fluffiness of the bread, the juiciness of the meat, and the glossiness of the pepper stew. You want people to feel like they can almost taste it through the screen.',
      },
      {
        type: 'heading',
        text: '6. Editing: Sometimes Your Food Needs a Little Makeup',
      },
      {
        type: 'list',
        items: [
          'Brightness & Contrast: Make sure the food is well-lit but not too harsh.',
          'Color Balance: Avoid filters that make food look fake. Keep colors true to life.',
          'Sharpness & Clarity: A little sharpening makes details stand out.',
        ],
      },
      {
        type: 'heading',
        text: '7. Add The Human Touch',
      },
      {
        type: 'paragraph',
        text: 'Adding a hand makes the image feel more personal and inviting. Try capturing someone reaching for a piece of meat, a fork twirling spaghetti, or a hand dipping puff-puff into sauce.',
      },
      {
        type: 'quote',
        text: "Don't Overthink It! Some of the best food photos happen when you're just having fun. Play around, take a lot of shots, and if all else fails, remember, the food still tastes good.",
        author: 'Conclusion',
      },
    ],
  },
  {
    id: 4,
    slug: 'culinary-adventures-lagos-top-10-must-try-eateries',
    date: 'Apr 15, 2025',
    readTime: '7 min read',
    title: 'Culinary Adventures — Lagos: Top 10 Must-Try Eateries That Changed My Life',
    description:
      "A personal food journey through Lagos by Tobi Adeyemi, Creative Director and self-proclaimed foodie. How Lagos Food Scenes Fuel My Creative Process.",
    image: '/images/blog2.jpg',
    category: 'Restaurant Reviews',
    content: [
      {
        type: 'paragraph',
        text: "A personal food journey through Lagos by Tobi Adeyemi, Creative Director and self-proclaimed foodie.",
      },
      {
        type: 'paragraph',
        text: "As a creative director constantly chasing the next big idea, I've discovered that Lagos isn't just Nigeria's bustling commercial hub; it's a vibrant tapestry of flavors waiting to inspire.",
      },
      {
        type: 'paragraph',
        text: "When I first downloaded the LocalBuka app, I didn't realize it would completely transform my relationship with Lagos food. Let me take you through the 10 restaurants that have not only satisfied my appetite but have also sparked some of my most creative campaigns.",
      },
      {
        type: 'heading',
        text: '1. Ẹlẹ́gbẹ̀dé: Where Traditional Flavors Meet Modern Imagination (Ikoyi)',
      },
      {
        type: 'paragraph',
        text: "There's something magical about walking into Ẹlẹ́gbẹ̀dé after a long day of client presentations. The moment that smooth pounded yam and richly flavored egusi soup hit my taste buds, I felt my creative batteries recharging.",
      },
      {
        type: 'heading',
        text: '2. The Yellow Chilli: The Client-Pleaser That Never Fails (Victoria Island)',
      },
      {
        type: 'paragraph',
        text: "The Yellow Chilli is my secret weapon when important clients visit from abroad. I still smile remembering how my skeptical German client ended up ordering a second serving of Chef Fregz's seafood okra.",
      },
      {
        type: 'heading',
        text: '3. Nok by Alara: Where Art Meets Gastronomy (Victoria Island)',
      },
      {
        type: 'paragraph',
        text: "As someone who lives at the intersection of visual arts and communication, Nok by Alara speaks directly to my creative soul. The jollof arancini, a brilliant Nigerian-Italian fusion, sparked the concept for an award-winning campaign.",
      },
      {
        type: 'heading',
        text: '4. Craft Gourmet: My Creative Reset Button (Victoria Island)',
      },
      {
        type: 'paragraph',
        text: "Some Wednesday mornings, when the creative well feels dry, I schedule my team meetings at Craft Gourmet. Their Mediterranean-Nigerian fusion breakfast clears mental blocks.",
      },
      {
        type: 'heading',
        text: '5. Ịsẹ́ Ọlọ́run: Authentic Inspiration in Surulere',
      },
      {
        type: 'paragraph',
        text: "Not all creative inspiration comes from polished establishments. Some of my best ideas emerged after meals at this humble buka that serves amala so perfect it would make my grandmother weep with joy.",
      },
      {
        type: 'heading',
        text: '6-10: More Lagos Gems',
      },
      {
        type: 'list',
        items: [
          'Seafood Palace (Lekki): Where Creative Blocks Go to Die',
          'Orchid Bistro (Ikeja): Quiet Corner for Creative Contemplation',
          "Iya Oyo's Kitchen (Yaba): Street Wisdom and Creative Authenticity",
          'Terra Kulture (Victoria Island): Where Nigerian Arts Fuel Creative Fusion',
          'Z Kitchen (Ikoyi): Celebrating Creative Milestones',
        ],
      },
      {
        type: 'quote',
        text: "Before discovering the LocalBuka app, finding these culinary gems often relied on industry word-of-mouth or expensive disappointments. Now, authentic reviews from real customers guide my food adventures.",
        author: 'How LocalBuka Transformed My Lagos Food Discoveries',
      },
      {
        type: 'paragraph',
        text: "Whether you're a fellow creative seeking inspiration, a business traveler wanting authentic experiences, or simply a food lover exploring Lagos, these restaurants offer more than meals; they offer moments of connection, inspiration, and joy.",
      },
    ],
  },
  {
    id: 5,
    slug: 'should-you-stop-eating-instant-noodles',
    date: 'May 2, 2025',
    readTime: '3 min read',
    title: 'Should You STOP Eating Instant Noodles?',
    description:
      "The Truth About Instant Noodles: Are They Healthy or Not? It was 2 a.m. on a rainy Tuesday when Jason, a university student, slammed his laptop shut after hours of studying. His stomach growled, the fridge was empty, but his pantry wasn't.",
    image: '/images/blog.jpg',
    category: 'Health & Food Science',
    content: [
      {
        type: 'paragraph',
        text: "The Truth About Instant Noodles: Are They Healthy or Not? This blog's content is categorized as Health and Food Science.",
      },
      {
        type: 'paragraph',
        text: "A Story We All Know Too Well. It was 2 a.m. on a rainy Tuesday when Jason, a university student, slammed his laptop shut after hours of studying. His stomach growled, the fridge was empty, but his pantry wasn't. One quick tear, a boil of water, and three minutes later, salvation: instant noodles.",
      },
      {
        type: 'paragraph',
        text: 'He slurped them gratefully. Fast, filling, and warm. But as he sat back, he wondered, How bad is this stuff?',
      },
      {
        type: 'heading',
        text: 'Unwrapping the Truth: Inside Your Instant Noodle Cup',
      },
      {
        type: 'list',
        items: [
          'Refined Wheat Flour: Cheap and shelf-stable but stripped of nutrients and fiber.',
          'Palm Oil or Hydrogenated Fats: Long shelf life, but high in saturated fats.',
          'Salt (and lots of it): Some brands pack up to 1,800mg of sodium — 80% of the daily recommended limit.',
          'Flavor Packets: Often loaded with MSG, artificial flavors, and preservatives.',
        ],
      },
      {
        type: 'heading',
        text: 'Research Revelations: How Instant Noodles Affect Your Body',
      },
      {
        type: 'list',
        items: [
          'Heart Health Risks: High sodium levels can lead to elevated blood pressure and cardiovascular issues.',
          'Metabolic Syndrome: A 2014 Journal of Nutrition study linked frequent consumption to increased risk of obesity, high cholesterol, and insulin resistance.',
          'Digestive Slowdown: Research shows that instant noodles can take longer to digest, potentially stressing the gut.',
        ],
      },
      {
        type: 'heading',
        text: 'Smart Slurping: How to Make Instant Noodles Healthier',
      },
      {
        type: 'list',
        items: [
          'Add real veggies like bok choy, mushrooms, or carrots.',
          'Mix in a boiled egg, tofu, or shredded chicken for protein.',
          'Use only half (or none) of the seasoning packet.',
          'Choose "healthier" brands with low-sodium, air-dried, or whole-grain versions.',
        ],
      },
      {
        type: 'quote',
        text: "They're engineered for taste and convenience, not nutrition. Used sparingly and creatively, they can still fit into a healthy lifestyle. But eaten too often, they can quietly impact your heart, waistline, and energy levels.",
        author: 'The Bottom Line: Finding Balance in the Bowl',
      },
    ],
  },
  {
    id: 6,
    slug: 'african-inspired-sustainable-dining-revolutionizing-food-culture',
    date: 'May 10, 2025',
    readTime: '6 min read',
    title: 'Taste of Tomorrow: How African-Inspired Sustainable Dining is Revolutionizing Food Culture',
    description:
      "Discover how traditional African food wisdom leads the global sustainable food movement and how LocalBuka connects conscious eaters with authentic, eco-friendly dining experiences.",
    image: '/images/blog2.jpg',
    category: 'Sustainability',
    content: [
      {
        type: 'paragraph',
        text: "Discover how traditional African food wisdom leads the global sustainable food movement and how LocalBuka connects conscious eaters with authentic, eco-friendly dining experiences.",
      },
      {
        type: 'heading',
        text: 'The Soul of Sustainable Eating: An African Perspective',
      },
      {
        type: 'paragraph',
        text: "When my grandmother in Lagos would shop for our family meals, she didn't call it \"sustainable eating\"; she called it wisdom. She knew exactly which local farmers grew the best yams, when okra was in season, and how to transform every part of a plantain into something delicious. Nothing went to waste.",
      },
      {
        type: 'paragraph',
        text: "Today, as climate concerns grow increasingly urgent, the world is turning to indigenous food systems like those across Africa that have prioritized sustainability for generations. What's old is new again.",
      },
      {
        type: 'heading',
        text: 'When Food Becomes Climate Action: Why Your Plate Matters',
      },
      {
        type: 'list',
        items: [
          "Reduces your carbon footprint through locally-sourced ingredients",
          "Supports ethical food systems that pay farmers fairly",
          "Celebrates biodiversity by featuring varied, seasonal foods",
          "Preserves water and soil by supporting regenerative farming",
          "Connects you to cultural heritage by valuing traditional food knowledge",
        ],
      },
      {
        type: 'heading',
        text: 'The Green Restaurant Revolution',
      },
      {
        type: 'list',
        items: [
          "Community-Connected Sourcing: Restaurants that know the names of their farmers",
          "Plant-Forward Philosophy: Menus that celebrate vegetables as stars",
          "Zero-Waste Mentality: Operations designed to eliminate food waste",
          "Cultural Respect and Innovation: Approaches that honor food traditions",
          "Human Dignity: Fair wages for everyone in the food chain",
        ],
      },
      {
        type: 'heading',
        text: 'From Followers to Leaders: How Africa is Shaping Global Food Futures',
      },
      {
        type: 'paragraph',
        text: "Consider the traditional Ethiopian practice of communal dining from a single plate that minimizes dishware waste. Or Nigerian food preservation techniques that extend shelf life without refrigeration. Or South African indigenous knowledge about drought-resistant crops.",
      },
      {
        type: 'quote',
        text: "The future of food isn't being invented in Silicon Valley test kitchens! It's being remembered and revitalized in communities that never forgot how to eat in harmony with the earth.",
        author: 'LocalBuka',
      },
    ],
  },
  {
    id: 7,
    slug: 'what-kind-of-food-do-you-categorize-as-street-food',
    date: 'Jul 3, 2025',
    readTime: '2 min read',
    title: 'What Kind Of Food Do You Categorize As Street Food?',
    description:
      "Picture this: sizzling dumplings in a Shanghai alley, aromatic spice clouds from a Mumbai chaat cart, the satisfying crunch of Korean hotteok fresh off the griddle. Street food isn't just sustenance, it's edible storytelling.",
    image: '/images/blog.jpg',
    category: 'Food Culture',
    content: [
      {
        type: 'paragraph',
        text: "Picture this: sizzling dumplings in a Shanghai alley, aromatic spice clouds from a Mumbai chaat cart, the satisfying crunch of Korean hotteok fresh off the griddle. Street food isn't just sustenance, it's edible storytelling and pure human connection served on a paper plate.",
      },
      {
        type: 'paragraph',
        text: 'But here\'s the fascinating question: What exactly makes food "street food"? Is it the location? The price? The preparation style? Or something deeper, like the soul of a community expressed through generations of vendor recipes?',
      },
      {
        type: 'paragraph',
        text: 'Consider a $3 taco from Mexico City versus a $15 "street-style" taco from a Brooklyn food truck. Both delicious, but in the same category? What about Singapore\'s hawker centers in government buildings?',
      },
      {
        type: 'paragraph',
        text: "Street food defies neat definitions because it's inherently rebellious, born from necessity and creativity. It's home for immigrants, salvation for night owls, affordable luxury for budget foodies, and a cultural bridge connecting strangers through shared flavors.",
      },
      {
        type: 'paragraph',
        text: "From Vietnamese pho on plastic stools to New York hot dogs, from Japanese takoyaki to Ethiopian injera wraps, street food represents democracy in action where vendor skill trumps pedigree, innovation springs from necessity, and your best meal might cost less than morning coffee.",
      },
      {
        type: 'quote',
        text: "Join us today for this delicious debate. Bring your stories, definitions, and hungry curiosity. Whether you've eaten scorpions in Thailand or consider food trucks exotic, your perspective matters.",
        author: 'LocalBuka',
      },
    ],
  },
  {
    id: 8,
    slug: 'budget-friendly-eating-your-wallet-deserves-a-smile',
    date: 'Sep 29, 2025',
    readTime: '3 min read',
    title: 'Budget-Friendly Eating: Because Your Wallet Deserves a Smile Too',
    description:
      "Let's be honest, food is not just fuel; it's therapy. It's the pat on the back after a long day, the hug you need when Netflix drops another emotional cliffhanger. But is good food always expensive? Not really.",
    image: '/images/blog2.jpg',
    category: 'Budget Tips',
    content: [
      {
        type: 'paragraph',
        text: "Let's be honest, food is not just fuel; it's therapy. It's the pat on the back after a long day, the hug you need when Netflix drops another emotional cliffhanger, and the silent best friend that never talks back (except when it's too spicy).",
      },
      {
        type: 'paragraph',
        text: "But here's the catch: eating well often comes with a heavy price tag. At least, that's what we've been made to believe. But is good food always expensive? Not really.",
      },
      {
        type: 'heading',
        text: '1. The Psychology of "Expensive = Better"',
      },
      {
        type: 'paragraph',
        text: "Our brains are funny creatures. The moment we see a fancy price tag, we instantly assume the food is tastier. It's called the placebo effect. Just because that pasta is plated on a marble countertop doesn't mean it's better than the spicy noodles from your neighbourhood stall.",
      },
      {
        type: 'heading',
        text: '2. Street Food: The Real Budget-Friendly Hero',
      },
      {
        type: 'paragraph',
        text: "Street food has always been proof that delicious doesn't mean expensive. A plate of piping hot vada pav, crunchy samosas, or tangy chaat can make you happier than a gourmet three-course meal, at literally 1/10th the price.",
      },
      {
        type: 'heading',
        text: '3. The Emotional Angle: Why Budget Food Feels Better',
      },
      {
        type: 'paragraph',
        text: "Here's the thing: when food doesn't burn a hole in your wallet, you enjoy it more freely. There's no guilt tax. Psychologically, this satisfaction boosts your dopamine, making budget-friendly food just as happiness-inducing.",
      },
      {
        type: 'heading',
        text: '4. Enter LocalBuka: Your Pocket-Friendly Food Buddy',
      },
      {
        type: 'paragraph',
        text: "Now imagine if you could explore the best budget-friendly options near you, without wandering aimlessly or falling into Instagram's \"overpriced food traps.\" That's exactly what LocalBuka does.",
      },
      {
        type: 'quote',
        text: "Because good food shouldn't mean emptying your wallet, it should mean filling your stomach and your heart. So the next time hunger strikes, skip the overpriced \"fancy fusion dish\" and let LocalBuka guide you to where real happiness is cooked — on a budget, with love.",
        author: 'LocalBuka',
      },
    ],
  },
  {
    id: 9,
    slug: 'world-food-day-2025-hand-in-hand-for-better-future',
    date: 'Oct 15, 2025',
    readTime: '3 min read',
    title: 'World Food Day 2025: Hand in Hand for Better Food and a Better Future',
    description:
      "Food is more than just sustenance; it's a bridge that connects people, cultures, and communities across the globe. Yet, even today, millions struggle to access nutritious food every day.",
    image: '/images/blog.jpg',
    category: 'Events',
    content: [
      {
        type: 'paragraph',
        text: "Food is more than just sustenance; it's a bridge that connects people, cultures, and communities across the globe. Yet, even today, millions struggle to access nutritious food every day.",
      },
      {
        type: 'paragraph',
        text: 'This year, the Food and Agriculture Organisation (FAO) of the United Nations has announced the theme: "Hand in Hand for Better Food and a Better Future."',
      },
      {
        type: 'heading',
        text: 'The Meaning Behind the Theme',
      },
      {
        type: 'list',
        items: [
          '"Hand in Hand" highlights the need for global cooperation and collective action.',
          '"Better Food" reminds us of the need to improve both the quality and accessibility of what we eat.',
          '"Better Future" calls on us to build resilient and sustainable food systems for future generations.',
        ],
      },
      {
        type: 'heading',
        text: "The Localbuka World Food Day Event",
      },
      {
        type: 'paragraph',
        text: 'In alignment with this year\'s global theme, Localbuka is hosting a special live event on X @Localbuka titled: "Food as Medicine — Healing Starts from Your Plate" on 16th October, 8:00 pm WAT.',
      },
      {
        type: 'heading',
        text: "Localbuka's Role in Driving Change",
      },
      {
        type: 'paragraph',
        text: "At Localbuka, we believe that transformation starts locally. By supporting local producers, promoting mindful consumption, and educating communities, we're building a movement that connects people to better food and a healthier future.",
      },
      {
        type: 'heading',
        text: 'How You Can Contribute',
      },
      {
        type: 'list',
        items: [
          'Buy local — Support nearby farmers and producers.',
          'Waste less — Plan meals wisely and compost leftovers.',
          'Choose sustainable foods — Opt for foods that are both healthy and eco-friendly.',
          'Spread awareness — Share insights about food security and sustainability.',
        ],
      },
      {
        type: 'quote',
        text: "World Food Day 2025 reminds us that solving global hunger starts with collaboration. When we work hand in hand, every step — big or small — moves us closer to a world where everyone can thrive.",
        author: 'LocalBuka',
      },
    ],
  },
  {
    id: 10,
    slug: 'the-day-mama-ngozis-buka-almost-disappeared',
    date: 'Dec 5, 2025',
    readTime: '4 min read',
    title: "The Day Mama Ngozi's Buka Almost Disappeared",
    description:
      "There's a woman in Lagos named Ngozi. For fourteen years, she's been running a small buka in Yaba. Every morning at 5 a.m., she's there, preparing meals that taste like home for people who might be far from theirs.",
    image: '/images/blog2.jpg',
    category: 'Stories',
    content: [
      {
        type: 'paragraph',
        text: "There's a woman in Lagos named Ngozi. For fourteen years, she's been running a small buka in Yaba. Every morning at 5 a.m., she's there, preparing meals that taste like home for people who might be far from theirs.",
      },
      {
        type: 'paragraph',
        text: "Her regulars call her Mama. They come for her egusi soup that tastes exactly like their mother's recipe. They come because in a city of twenty million people, her buka feels like the one place where they're known.",
      },
      {
        type: 'paragraph',
        text: "But three months ago, Mama Ngozi almost closed her doors forever. Not because her food wasn't good enough. But because in a world that's constantly scrolling, her buka had become invisible.",
      },
      {
        type: 'heading',
        text: 'The Moment That Changed Everything',
      },
      {
        type: 'paragraph',
        text: 'It was a Tuesday when we walked past and noticed her buka was empty. She was sitting alone, staring at her phone, looking at food delivery apps where bigger restaurants were getting hundreds of orders.',
      },
      {
        type: 'quote',
        text: '"Nobody knows we\'re here anymore," she said quietly. "They walk right past. I cook the same way I always have. But somehow, that\'s not enough now."',
        author: 'Mama Ngozi',
      },
      {
        type: 'paragraph',
        text: "That conversation haunted us because Mama Ngozi isn't alone. Across Lagos, Accra, Nairobi, and beyond, there are thousands like her. People who pour their souls into every plate.",
      },
      {
        type: 'heading',
        text: 'What If It Didn\'t Have To Be This Way?',
      },
      {
        type: 'paragraph',
        text: "Imagine this: A young woman new to Lagos opens her phone at lunchtime. She finds LocalBuka and sees Mama Ngozi's story, her warm smile, and how her egusi recipe came from her grandmother.",
      },
      {
        type: 'paragraph',
        text: "Something feels real. Human. She tries it. The food tastes like a memory she didn't know she had. She posts about it. Three friends see it and go the next day. Within a month, Mama Ngozi's buka isn't just surviving. It's thriving.",
      },
      {
        type: 'heading',
        text: 'The Impact We\'re Creating',
      },
      {
        type: 'list',
        items: [
          'Stories create discovery. When people know the story behind the food, they choose differently.',
          "Visibility creates sustainability. Local vendors can't afford influencer marketing. But if we tell their stories for them, they get to keep doing what they do best.",
          'Connection creates legacy. These recipes are cultural heritage. If we celebrate them, they live on.',
        ],
      },
      {
        type: 'heading',
        text: 'The Beginning',
      },
      {
        type: 'paragraph',
        text: "Mama Ngozi is still cooking in Yaba. After that conversation, we became regulars. We brought friends. We told her story to anyone who'd listen.",
      },
      {
        type: 'quote',
        text: "We're creating a world where Mama Ngozi's buka never has to worry about being invisible again. And we're inviting you to build it with us. Because the revolution starts before the app does. It starts with us.",
        author: 'LocalBuka',
      },
    ],
  },
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};

export const getSimilarPosts = (currentSlug: string, count: number = 3): BlogPost[] => {
  return blogPosts.filter((post) => post.slug !== currentSlug).slice(0, count);
};
