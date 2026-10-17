// Comprehensive Live Aquaculture Market Spot Prices Data for Coastal Mandis
export const MARKET_LOCATIONS = [
  { id: 'bhimavaram', name: 'Bhimavaram (West Godavari, AP)', district: 'West Godavari', state: 'Andhra Pradesh', isBenchmark: true },
  { id: 'nellore', name: 'Nellore (Nellore, AP)', district: 'SPSR Nellore', state: 'Andhra Pradesh', isBenchmark: false },
  { id: 'kakinada', name: 'Kakinada (Kakinada, AP)', district: 'Kakinada', state: 'Andhra Pradesh', isBenchmark: false },
  { id: 'amalapuram', name: 'Amalapuram (Konaseema, AP)', district: 'Konaseema', state: 'Andhra Pradesh', isBenchmark: false },
  { id: 'machilipatnam', name: 'Machilipatnam (Krishna, AP)', district: 'Krishna', state: 'Andhra Pradesh', isBenchmark: false },
  { id: 'bapatla', name: 'Bapatla / Repalle (Bapatla, AP)', district: 'Bapatla', state: 'Andhra Pradesh', isBenchmark: false },
  { id: 'ongole', name: 'Ongole / Chirala (Prakasam, AP)', district: 'Prakasam', state: 'Andhra Pradesh', isBenchmark: false },
  { id: 'visakhapatnam', name: 'Visakhapatnam / Srikakulam', district: 'Visakhapatnam', state: 'Andhra Pradesh', isBenchmark: false },
  { id: 'balasore', name: 'Balasore / Chandipur (Odisha)', district: 'Balasore', state: 'Odisha', isBenchmark: false },
  { id: 'surat', name: 'Surat / Navsari (Gujarat)', district: 'Surat', state: 'Gujarat', isBenchmark: false },
  { id: 'kochi', name: 'Kochi / Alappuzha (Kerala)', district: 'Ernakulam', state: 'Kerala', isBenchmark: false }
];

// Base rates for benchmark location (Bhimavaram)
export const BASE_MARKET_PRODUCTS = [
  // --- Vannamei Shrimp ---
  {
    id: 'van-30',
    category: 'prawn',
    species: 'Vannamei Shrimp',
    speciesTelugu: 'రొయ్యలు (30 కౌంట్)',
    grade: '30 Count (33.3g)',
    count: 30,
    unit: 'kg',
    basePrice: 465,
    minPrice: 455,
    maxPrice: 475,
    change: 10,
    direction: 'up',
    demand: 'High Export Demand',
    description: 'Export grade head-on / shell-on premium large size.'
  },
  {
    id: 'van-40',
    category: 'prawn',
    species: 'Vannamei Shrimp',
    speciesTelugu: 'రొయ్యలు (40 కౌంట్)',
    grade: '40 Count (25.0g)',
    count: 40,
    unit: 'kg',
    basePrice: 410,
    minPrice: 400,
    maxPrice: 420,
    change: 5,
    direction: 'up',
    demand: 'Very High',
    description: 'Most popular export count for European and US processing.'
  },
  {
    id: 'van-50',
    category: 'prawn',
    species: 'Vannamei Shrimp',
    speciesTelugu: 'రొయ్యలు (50 కౌంట్)',
    grade: '50 Count (20.0g)',
    count: 50,
    unit: 'kg',
    basePrice: 365,
    minPrice: 355,
    maxPrice: 375,
    change: 0,
    direction: 'stable',
    demand: 'Steady',
    description: 'Standard fast-moving commercial crop grade.'
  },
  {
    id: 'van-60',
    category: 'prawn',
    species: 'Vannamei Shrimp',
    speciesTelugu: 'రొయ్యలు (60 కౌంట్)',
    grade: '60 Count (16.6g)',
    count: 60,
    unit: 'kg',
    basePrice: 325,
    minPrice: 315,
    maxPrice: 335,
    change: -5,
    direction: 'down',
    demand: 'Moderate',
    description: 'Intermediate crop size, active local and Asian export buyers.'
  },
  {
    id: 'van-70',
    category: 'prawn',
    species: 'Vannamei Shrimp',
    speciesTelugu: 'రొయ్యలు (70 కౌంట్)',
    grade: '70 Count (14.2g)',
    count: 70,
    unit: 'kg',
    basePrice: 290,
    minPrice: 280,
    maxPrice: 300,
    change: 0,
    direction: 'stable',
    demand: 'Steady',
    description: 'Common partial harvest count.'
  },
  {
    id: 'van-80',
    category: 'prawn',
    species: 'Vannamei Shrimp',
    speciesTelugu: 'రొయ్యలు (80 కౌంట్)',
    grade: '80 Count (12.5g)',
    count: 80,
    unit: 'kg',
    basePrice: 255,
    minPrice: 245,
    maxPrice: 265,
    change: 5,
    direction: 'up',
    demand: 'Moderate',
    description: 'Peeling and domestic catering grade.'
  },
  {
    id: 'van-100',
    category: 'prawn',
    species: 'Vannamei Shrimp',
    speciesTelugu: 'రొయ్యలు (100 కౌంట్)',
    grade: '100 Count (10.0g)',
    count: 100,
    unit: 'kg',
    basePrice: 220,
    minPrice: 210,
    maxPrice: 230,
    change: 0,
    direction: 'stable',
    demand: 'High Domestic Demand',
    description: 'Early thinning and emergency harvest grade.'
  },

  // --- Black Tiger Shrimp ---
  {
    id: 'bt-20',
    category: 'prawn',
    species: 'Black Tiger (P. monodon)',
    speciesTelugu: 'మోనోడాన్ టైగర్ (20 కౌంట్)',
    grade: '20 Count (50.0g)',
    count: 20,
    unit: 'kg',
    basePrice: 690,
    minPrice: 670,
    maxPrice: 715,
    change: 15,
    direction: 'up',
    demand: 'Very High (Japanese Export)',
    description: 'Giant Jumbo black tiger, premium luxury grading.'
  },
  {
    id: 'bt-30',
    category: 'prawn',
    species: 'Black Tiger (P. monodon)',
    speciesTelugu: 'మోనోడాన్ టైగర్ (30 కౌంట్)',
    grade: '30 Count (33.3g)',
    count: 30,
    unit: 'kg',
    basePrice: 570,
    minPrice: 550,
    maxPrice: 590,
    change: 10,
    direction: 'up',
    demand: 'Strong',
    description: 'High value tiger shrimp for export processors.'
  },
  {
    id: 'bt-40',
    category: 'prawn',
    species: 'Black Tiger (P. monodon)',
    speciesTelugu: 'మోనోడాన్ టైగర్ (40 కౌంట్)',
    grade: '40 Count (25.0g)',
    count: 40,
    unit: 'kg',
    basePrice: 485,
    minPrice: 470,
    maxPrice: 500,
    change: 5,
    direction: 'up',
    demand: 'Steady',
    description: 'Medium black tiger grade.'
  },

  // --- Commercial Fishes ---
  {
    id: 'fish-rohu',
    category: 'fish',
    species: 'Rohu / Bocha (L. rohita)',
    speciesTelugu: 'రోహు / బొచ్చె చేప (1.5 - 2.5 kg)',
    grade: '1.5 kg to 2.5 kg size',
    count: null,
    unit: 'kg',
    basePrice: 148,
    minPrice: 140,
    maxPrice: 155,
    change: 3,
    direction: 'up',
    demand: 'High Daily Consumption',
    description: 'Primary freshwater major carp, high demand in Kolkata/Delhi mandis.'
  },
  {
    id: 'fish-catla',
    category: 'fish',
    species: 'Catla / Thella Chepa (G. catla)',
    speciesTelugu: 'కట్ల / తెల్ల చేప (2.0 - 4.0 kg)',
    grade: '2.0 kg to 4.0 kg size',
    count: null,
    unit: 'kg',
    basePrice: 172,
    minPrice: 165,
    maxPrice: 180,
    change: 4,
    direction: 'up',
    demand: 'Very High',
    description: 'Large surface feeder carp, commanding premium price above 2 kg.'
  },
  {
    id: 'fish-seabass',
    category: 'fish',
    species: 'Asian Seabass / Barramundi (Pandugappa)',
    speciesTelugu: 'పండుగప్ప (1.0 - 2.5 kg)',
    grade: '1.0 kg to 2.5 kg size',
    count: null,
    unit: 'kg',
    basePrice: 495,
    minPrice: 475,
    maxPrice: 520,
    change: 15,
    direction: 'up',
    demand: 'Exceptional (Hotel & Export)',
    description: 'Top-tier carnivore white fish, high luxury demand in metro cities.'
  },
  {
    id: 'fish-murrel',
    category: 'fish',
    species: 'Murrel / Korrameenu (Snakehead)',
    speciesTelugu: 'కొర్రమీను / లైవ్ (500g - 1.2 kg)',
    grade: 'Live Fish (500g - 1.2 kg)',
    count: null,
    unit: 'kg',
    basePrice: 435,
    minPrice: 410,
    maxPrice: 460,
    change: 5,
    direction: 'up',
    demand: 'Peak Medical / Nutritional',
    description: 'Air-breathing live fish sold alive in regional retail markets.'
  },
  {
    id: 'fish-tilapia',
    category: 'fish',
    species: 'GIFT Tilapia / Roopchand',
    speciesTelugu: 'తిలాపియా / రూప్‌చంద్ (600g - 1.0 kg)',
    grade: '600g to 1.0 kg size',
    count: null,
    unit: 'kg',
    basePrice: 118,
    minPrice: 110,
    maxPrice: 125,
    change: -2,
    direction: 'down',
    demand: 'Steady Volume',
    description: 'Rapid turnaround freshwater & brackish culture fish.'
  },
  {
    id: 'fish-pangasius',
    category: 'fish',
    species: 'Pangasius / Basa (P. bocourti)',
    speciesTelugu: 'పంకాస్ / బాసా చేప (1.2 - 2.0 kg)',
    grade: '1.2 kg to 2.0 kg size',
    count: null,
    unit: 'kg',
    basePrice: 92,
    minPrice: 86,
    maxPrice: 98,
    change: 0,
    direction: 'stable',
    demand: 'Bulk Processing Demand',
    description: 'High biomass fish for fillet processing plants.'
  }
];

// Regional price variance offsets by location
const LOCATION_PRICE_OFFSETS = {
  bhimavaram: { prawn: 0, fish: 0 },
  nellore: { prawn: 8, fish: -4 }, // Nellore premium on export shrimp
  kakinada: { prawn: 3, fish: 2 },
  amalapuram: { prawn: 2, fish: -2 },
  machilipatnam: { prawn: -2, fish: 3 },
  bapatla: { prawn: -3, fish: 0 },
  ongole: { prawn: 4, fish: -3 },
  visakhapatnam: { prawn: 5, fish: 6 },
  balasore: { prawn: -12, fish: 8 }, // Odisha freight difference
  surat: { prawn: 14, fish: 10 },    // Gujarat proximity to Mumbai
  kochi: { prawn: 10, fish: 18 }     // Kerala high local seafood consumption
};

// Calculate market products for a given location
export function getMarketPricesForLocation(locationId = 'bhimavaram') {
  const loc = MARKET_LOCATIONS.find(l => l.id === locationId) || MARKET_LOCATIONS[0];
  const offset = LOCATION_PRICE_OFFSETS[loc.id] || { prawn: 0, fish: 0 };

  return BASE_MARKET_PRODUCTS.map(product => {
    const diff = product.category === 'prawn' ? offset.prawn : offset.fish;
    const adjustedPrice = Math.max(50, product.basePrice + diff);
    const adjustedMin = Math.max(45, product.minPrice + diff);
    const adjustedMax = Math.max(55, product.maxPrice + diff);

    return {
      ...product,
      locationId: loc.id,
      locationName: loc.name,
      currentPrice: adjustedPrice,
      minPrice: adjustedMin,
      maxPrice: adjustedMax
    };
  });
}
