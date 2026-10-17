// Well Aqua - Comprehensive Aquaculture Knowledge, Lab & Store Data

export const SPECIES_GUIDES = [
  {
    id: 'vannamei',
    name: 'Pacific White Shrimp (L. vannamei)',
    category: 'Shrimp',
    icon: '🦐',
    tagline: 'High-density, fast-growing marine & brackish water shrimp',
    optimumTemp: '28°C - 32°C',
    optimumSalinity: '10 - 25 ppt (adaptable 2 - 35 ppt)',
    optimumPH: '7.5 - 8.5',
    optimumDO: '> 4.5 mg/L (min 3.5 mg/L)',
    stockingDensity: '40 - 60 PL/m² (Intensive)',
    cropDuration: '90 - 110 Days',
    targetHarvestSize: '25 - 35 grams (30-40 count)',
    stages: [
      {
        stage: 'Pond Preparation (Day -20 to 0)',
        tasks: [
          'Drain pond completely and sun-dry pond bottom until soil cracks (1-2 cm depth).',
          'Remove black sludge and organic waste from previous harvest.',
          'Apply agricultural lime (CaCO3) @ 500-1000 kg/ha based on soil pH.',
          'Fill filtered seawater/creek water through 60-mesh double-layered bag filter.',
          'Disinfect with Bleaching powder (30-35 ppm) or BKC 80% to eradicate wild pathogens.',
          'Develop natural plankton bloom using fermented rice bran/yeast probiotic blend 4 days before stocking.'
        ],
        proTip: 'Ensure mineral balance before stocking: Magnesium to Calcium ratio should be ideally 3:1.'
      },
      {
        stage: 'Seed Stocking & Acclimatization (Day 1)',
        tasks: [
          'Source only SPF (Specific Pathogen Free) PCR-tested post larvae (PL 10-12).',
          'Check seed health: Gut fullness > 80%, active swimming against current, clean carapace.',
          'Float seed bags on pond surface for 30 minutes to equalize water temperature.',
          'Gradually mix pond water into bags over 45 minutes to adapt salinity (< 2 ppt change/hour).',
          'Stock during cool hours (6:00 AM - 8:00 AM or late evening).'
        ],
        proTip: 'Apply 5 kg/ha Vitamin C + electroltyes 2 hours before seed release to minimize transport shock.'
      },
      {
        stage: 'Nursery & Early Grow-Out (Day 1 - 30)',
        tasks: [
          'Feed high-protein crumble feed (38-40% CP) 3-4 times daily.',
          'Install feed check trays (4 trays per acre) by Day 15 to monitor appetite.',
          'Run paddle wheel aerators for 8-12 hours daily, mostly during night (10 PM to 6 AM).',
          'Apply soil probiotics (Bacillus subtilis) once every 7 days to digest unconsumed feed.'
        ],
        proTip: 'Check-tray clearance time should be around 90-120 minutes during Day 20-30.'
      },
      {
        stage: 'Intensive Grow-Out & Molting Care (Day 31 - 75)',
        tasks: [
          'Monitor lunar cycle: Shrimp molt heavily during New Moon & Full Moon phases.',
          'Supply extra minerals (K+, Mg++, Ca++) 2 days prior to and 2 days after molting.',
          'Keep Dissolved Oxygen strictly above 4.5 ppm to prevent molting failure and suffocation.',
          'Test Total Ammonia Nitrogen (TAN) and Nitrite (NO2) twice weekly.',
          'Run aerators 16-20 hours/day as biomass exceeds 2,500 kg/ha.'
        ],
        proTip: 'Alkalinity must stay above 120-150 ppm for rapid shell hardening post-molt.'
      },
      {
        stage: 'Pre-Harvest & Quality Finishing (Day 76 - 100+)',
        tasks: [
          'Check for soft shell percentage (< 3% ideal before harvest).',
          'Cease feeding 12-24 hours prior to harvest to ensure clear gut tract.',
          'Avoid harvesting within 3 days of a molt cycle to ensure premium market grading.',
          'Prepare crushed ice (1:1 ratio with harvest biomass) for immediate chilling shock and freshness retention.'
        ],
        proTip: 'Chill shrimp immediately to < 4°C in slurry ice within 5 minutes of net catch.'
      }
    ]
  },
  {
    id: 'tiger_prawn',
    name: 'Black Tiger Prawn (Penaeus monodon)',
    category: 'Shrimp',
    icon: '🦐',
    tagline: 'Premium giant tiger prawn, high market export value',
    optimumTemp: '27°C - 31°C',
    optimumSalinity: '15 - 28 ppt',
    optimumPH: '7.8 - 8.4',
    optimumDO: '> 4.0 mg/L',
    stockingDensity: '15 - 25 PL/m² (Semi-Intensive)',
    cropDuration: '120 - 150 Days',
    targetHarvestSize: '35 - 50 grams (15-25 count)',
    stages: [
      {
        stage: 'Pond Preparation & Liming',
        tasks: [
          'Deep plowing and drying of bottom sediment to oxidize sulfides.',
          'Liming with quicklime (CaO) @ 300 kg/ha followed by dolomite @ 400 kg/ha.',
          'Maintain stable green/brown diatom bloom (Secchi disc visibility 30-40 cm).'
        ],
        proTip: 'Monodon requires deeper pond water (1.2 to 1.5 meters) compared to vannamei.'
      },
      {
        stage: 'Stocking & Feed Regimen',
        tasks: [
          'Use PL15-PL20 tested negative for WSSV, MBV, and HPV viruses.',
          'Feed pellets with high squid and fish meal content (40-42% crude protein).',
          'Feed check tray inspection: 4 times daily (6:00, 11:00, 17:00, 22:00).'
        ],
        proTip: 'Tiger shrimp prefer benthic feeding; maintain pristine pond bottom with Rhodococcus probiotics.'
      },
      {
        stage: 'Grow-Out & Water Maintenance',
        tasks: [
          'Maintain water exchange @ 10-15% weekly after DOC 60.',
          'Keep alkalinity at 140 - 180 ppm to sustain strong pigmentation and hard carapace.'
        ],
        proTip: 'Add Astaxanthin or spirulina to feed at DOC 80+ to achieve bright tiger stripes.'
      }
    ]
  },
  {
    id: 'tilapia',
    name: 'GIFT Tilapia / Oreochromis niloticus',
    category: 'Fish',
    icon: '🐟',
    tagline: 'Hardy freshwater/brackish fish with excellent feed conversion',
    optimumTemp: '26°C - 32°C',
    optimumSalinity: '0 - 15 ppt (fresh or low brackish)',
    optimumPH: '6.8 - 8.2',
    optimumDO: '> 3.0 mg/L (tolerates low DO briefly)',
    stockingDensity: '3 - 5 fingerlings/m² (Pond) or 20-30/m³ (Biofloc)',
    cropDuration: '120 - 150 Days',
    targetHarvestSize: '500 - 800 grams',
    stages: [
      {
        stage: 'Pond / Tank Preparation',
        tasks: [
          'Apply cow dung or poultry manure compost @ 1500 kg/ha or inoculate biofloc starters.',
          'Ensure bird netting and predator exclusion fencing.',
          'Maintain water depth 1.2 to 1.5 meters.'
        ],
        proTip: 'In Biofloc systems, maintain Floc Volume (FV) at 15-25 ml/L using Imhoff cone tests.'
      },
      {
        stage: 'Fingerling Stocking',
        tasks: [
          'Stock 100% all-male monosex fingerlings (10-15 grams) to prevent in-pond breeding.',
          'Bath treatment in 2-3% salt water dip for 2 minutes before stocking to eliminate external parasites.'
        ],
        proTip: 'Avoid mixed sex fingerlings which result in stunted growth due to overpopulation.'
      },
      {
        stage: 'Feeding & Grow-Out',
        tasks: [
          'Use floating extruded pellets (28-32% CP) to monitor feeding activity.',
          'Feed 3-5% of body weight daily divided into 2-3 rations.',
          'Sample fish weights bi-weekly to adjust daily feeding table.'
        ],
        proTip: 'Tilapia are enthusiastic surface feeders; uneaten feed sinking indicates water quality issues.'
      }
    ]
  },
  {
    id: 'rohu_catla',
    name: 'Indian Major Carps (Rohu & Catla)',
    category: 'Fish',
    icon: '🐠',
    tagline: 'Traditional composite polyculture for high total biomass yield',
    optimumTemp: '25°C - 32°C',
    optimumSalinity: '0 - 2 ppt (Strict Freshwater)',
    optimumPH: '7.2 - 8.2',
    optimumDO: '> 4.0 mg/L',
    stockingDensity: '5,000 - 8,000 fingerlings/ha (Polyculture ratio: 40% Catla, 30% Rohu, 30% Mrigal)',
    cropDuration: '240 - 300 Days',
    targetHarvestSize: '1.2 - 2.0 kg per fish',
    stages: [
      {
        stage: 'Ecosystem Pond Preparation',
        tasks: [
          'Clear weed and predatory fish using Mahua oil cake @ 2500 kg/ha or Bleaching powder.',
          'Apply Single Super Phosphate (SSP) @ 50 kg/ha and Urea @ 25 kg/ha.',
          'Stock fingerlings (minimum 50-80 grams size for high survival rate).'
        ],
        proTip: 'Catla is a surface feeder, Rohu is a column feeder, and Mrigal is a bottom feeder – zero food competition.'
      },
      {
        stage: 'Feeding & Organic Water Care',
        tasks: [
          'Supplement with De-oiled Rice Bran (DORB) + Groundnut Oilcake (GNOC) 1:1 mixture.',
          'Add monthly dose of CIFAX @ 1 liter/ha to protect from Epizootic Ulcerative Syndrome.'
        ],
        proTip: 'Aeration in early morning hours (3:00 AM - 6:00 AM) prevents gasping at surface.'
      }
    ]
  }
];

export const DISEASE_CATALOG = [
  {
    id: 'wssv',
    name: 'White Spot Syndrome Virus (WSSV)',
    species: 'Shrimp (Vannamei & Monodon)',
    severity: 'CRITICAL',
    badgeColor: '#ef4444',
    symptoms: [
      'Distinct white circular spots (0.5 to 2 mm) inside the carapace and cuticle',
      'Sudden reduction in feed consumption (empty gut in check trays)',
      'Shrimp lethargic, swimming erratically near pond dykes/edges',
      'Rapid mortality rate up to 90-100% within 3-7 days of onset'
    ],
    causes: 'Infected seed, carrier crabs/birds, sudden drop in water temperature (< 26°C), salinity stress.',
    immediateActions: [
      'Stop feeding immediately to reduce organic load.',
      'Do NOT discharge water to neighboring farms (emergency biosecurity quarantine).',
      'Increase aeration to maximum capacity.',
      'Consult lab for emergency PCR confirmation; if positive and shrimp > 18g, plan emergency harvest.'
    ],
    recommendedMedicines: ['BioIodine 20% Disinfectant', 'Spirulina Immunity Booster', 'Vitamin C Stress Relief']
  },
  {
    id: 'ehp',
    name: 'Enterocytozoon hepatopenaei (EHP)',
    species: 'Shrimp (Vannamei)',
    severity: 'HIGH',
    badgeColor: '#f97316',
    symptoms: [
      'Severe growth retardation and high size variation across the pond',
      'Shrimp eat well but fail to gain weight (FCR skyrockets past 1.8)',
      'White gut / white feces observed floating on surface downwind',
      'Soft shell and opaque hepatopancreas'
    ],
    causes: 'Microsporidian spore ingestion through live polychaetes, infected hatchery seed, unpasteurized pond bottom.',
    immediateActions: [
      'Disinfect check trays and feeding boats with caustic soda (pH > 12) to kill spores.',
      'Incorporate gut-acidifiers (organic acids) and specialized herbal gut protectors into feed.',
      'Apply heavy bottom-soil probiotics (Bacillus subtilis + licheniformis) to break down spore carriers.'
    ],
    recommendedMedicines: ['GutShield Herbal Protectant', 'Pond Doxer Bottom Probiotic', 'AquaMin Pro Mineral Mix']
  },
  {
    id: 'ammonia_toxicity',
    name: 'Ammonia & Nitrite Toxicity (TAN / NO2-)',
    species: 'All Shrimp & Fish',
    severity: 'HIGH',
    badgeColor: '#eab308',
    symptoms: [
      'Shrimp swimming near surface gasping for air; fish crowding aerator waves',
      'Reddish pigmentation on shrimp tail and antennae',
      'Brown blood disease in fish (methemoglobinemia - gills turn chocolate brown)',
      'Sudden mortality after heavy night feeding'
    ],
    causes: 'Overfeeding, unconsumed feed decomposition, pH > 8.5 shifting NH4+ into toxic NH3 gas, insufficient nitrifying bacteria.',
    immediateActions: [
      'Immediately reduce feed by 50-70%.',
      'Turn on all paddle-wheel aerators 24/7 to volatilize ammonia gas.',
      'Apply Nitromax nitrifying probiotic and Yucca schidigera extract.',
      'Broadcast Zeolite powder @ 40-50 kg/acre to adsorb free ammonium ions.'
    ],
    recommendedMedicines: ['Nitromax Ammonia Reducer', 'Zeolite Pond Cleanser', 'OxyPlus DO Generator']
  },
  {
    id: 'black_gill',
    name: 'Black Gill / Brown Gill Disease',
    species: 'Shrimp',
    severity: 'MEDIUM',
    badgeColor: '#3b82f6',
    symptoms: [
      'Gill filaments turn brown, dark grey, or completely black',
      'Loss of appetite and lethargy due to impaired oxygen exchange',
      'Shrimp die in check trays during hot afternoons'
    ],
    causes: 'High organic silt, fungal infection (Fusarium), heavy metal precipitation, or acidic bottom soil.',
    immediateActions: [
      'Apply water conditioner / EDTA @ 5-10 kg/ha to chelate metals.',
      'Dose BKC 80% or sanitized Copper Sulphate under technical supervision.',
      'Siphon black sludge from the central drainage sump.'
    ],
    recommendedMedicines: ['OxyClean BKC-80', 'EDTA Water Conditioner', 'Pond Doxer Bottom Probiotic']
  },
  {
    id: 'dropsy_fin_rot',
    name: 'Bacterial Fin Rot & Dropsy',
    species: 'Fish (Tilapia, Carps, Catfish)',
    severity: 'MEDIUM',
    badgeColor: '#8b5cf6',
    symptoms: [
      'Frayed, rotting fins with white edges and hemorrhages',
      'Abdominal swelling (Dropsy) and protruding pine-cone scales',
      'Bulging eyes (Exophthalmia) and sluggish swimming'
    ],
    causes: 'Aeromonas / Pseudomonas bacterial proliferation due to rough handling or poor water sanitation.',
    immediateActions: [
      'Dip affected fish in 1 ppm Potassium Permanganate (KMnO4) bath.',
      'Mix Oxytetracycline or florfenicol equivalent with feed binder for 5-7 days under vet prescription.',
      'Exchange 20% fresh water to reduce bacterial count.'
    ],
    recommendedMedicines: ['BioIodine 20% Disinfectant', 'AquaGrowth Enzyme Tonic', 'Vitamin C Stress Relief']
  }
];

export const LAB_SERVICES = [
  {
    id: 'lab-water-comp',
    title: 'Comprehensive 12-Parameter Water Quality Lab Panel',
    category: 'Water Testing',
    price: 650,
    turnaround: 'Same Day (4 - 6 Hours)',
    badge: 'Most Popular',
    sampleType: '500ml pond water collected at 0.5m depth',
    parameters: [
      'pH (Morning 7 AM & Evening 4 PM)',
      'Salinity (ppt)',
      'Dissolved Oxygen (DO ppm)',
      'Total Ammonia Nitrogen (TAN mg/L)',
      'Toxic Free Ammonia (NH3 mg/L)',
      'Nitrite (NO2- mg/L)',
      'Nitrate (NO3- mg/L)',
      'Total Alkalinity (ppm as CaCO3)',
      'Total Hardness (ppm)',
      'Calcium (Ca++ ppm)',
      'Magnesium (Mg++ ppm)',
      'Ca:Mg Ratio Verification'
    ],
    description: 'Complete chemical balance evaluation crucial for molting, osmoregulation, and toxicity prevention.'
  },
  {
    id: 'lab-soil-chem',
    title: 'Pond Bottom Soil & Sediment Chemistry Panel',
    category: 'Soil Testing',
    price: 850,
    turnaround: '24 Hours',
    badge: 'Pre-Crop Essential',
    sampleType: '500g core soil composite from 5 pond points',
    parameters: [
      'Soil pH (1:2.5 water extract)',
      'Organic Carbon (% OC)',
      'Available Phosphorus (ppm)',
      'Available Nitrogen (ppm)',
      'Redox Potential (Eh in mV)',
      'Hydrogen Sulfide (H2S ppm)',
      'Iron / Acid Sulfate status',
      'Agricultural Lime Requirement (kg/ha)'
    ],
    description: 'Diagnoses anaerobic black sludge, toxic gas risks, and calculates exact liming dosage needed for your pond.'
  },
  {
    id: 'lab-pcr-seed',
    title: 'High-Sensitivity Real-Time PCR Pathogen Screening',
    category: 'Seed Testing',
    price: 1800,
    turnaround: '12 - 18 Hours',
    badge: 'Certified SPF',
    sampleType: '150 Post-Larvae (PL) alive in oxygen bag',
    parameters: [
      'WSSV (White Spot Syndrome Virus)',
      'EHP (Enterocytozoon hepatopenaei)',
      'IHHNV (Infectious Hypodermal Virus)',
      'IMNV (Infectious Myonecrosis Virus)',
      'Vp_AHPND (PirA / PirB Toxin Genes)',
      'Microscopic Gill & Gut Health Index'
    ],
    description: 'Gold standard molecular verification to guarantee your seed is 100% pathogen-free before releasing into ponds.'
  },
  {
    id: 'lab-vibrio-plate',
    title: 'Pond Microbiology & Vibrio Colony Plating (TCBS)',
    category: 'Microbiology',
    price: 500,
    turnaround: '24 Hours',
    badge: 'Biosecurity',
    sampleType: '100ml pond water & hepatopancreas swab',
    parameters: [
      'Total Viable Bacterial Count (TVC CFU/ml)',
      'Green Colony Vibrio count (V. parahaemolyticus / harveyi)',
      'Yellow Colony Vibrio count (V. alginolyticus)',
      'Green-to-Yellow Vibrio Ratio Assessment',
      'Beneficial Bacillus vs Pathogen Balance'
    ],
    description: 'Detects luminescent and pathogenic bacterial outbreaks before mass mortalities strike.'
  }
];

export const CERTIFIED_LABS = [
  {
    id: 'lab-1',
    name: 'AquaCare Advanced Diagnostic Lab & PCR Center',
    address: 'Plot 42, Aquaculture Corridor, Bhimavaram, AP',
    distance: '3.8 km away',
    rating: 4.9,
    reviews: 248,
    phone: '+91 98480 23145',
    timings: '6:00 AM - 9:00 PM (All 7 Days)',
    doorstepPickup: true
  },
  {
    id: 'lab-2',
    name: 'Coastal Aqua Tech & Soil Testing Laboratory',
    address: 'Near Fish Market Bridge, Kakinada, AP',
    distance: '7.2 km away',
    rating: 4.8,
    reviews: 182,
    phone: '+91 94401 88721',
    timings: '6:30 AM - 8:00 PM',
    doorstepPickup: true
  },
  {
    id: 'lab-3',
    name: 'National Marine Bio-Analytics Facility',
    address: 'Nellore Coastal Highway, Gudur, AP',
    distance: '12.5 km away',
    rating: 4.95,
    reviews: 310,
    phone: '+91 98852 90123',
    timings: '24/7 Emergency PCR Support',
    doorstepPickup: true
  }
];

export const PHARMACY_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Nitromax Aqua Probiotic (TAN & NO2 Reducer)',
    category: 'Probiotics',
    manufacturer: 'BioAqua Genomics',
    packSize: '1 kg Foil Pack',
    price: 1450,
    originalPrice: 1750,
    rating: 4.9,
    reviews: 114,
    inStock: true,
    image: '🧪',
    badge: 'Bestseller',
    composition: 'Concentrated consortium of Nitrosomonas, Nitrobacter, Rhodococcus & Bacillus subtilis (50 Billion CFU/g).',
    indication: 'Rapidly eliminates toxic ammonia (NH3) and Nitrite (NO2), cleans black pond bottom sludge.',
    dosageRate: '1 kg per acre every 7-10 days, or 2 kg/acre during emergency ammonia spikes.'
  },
  {
    id: 'prod-2',
    name: 'AquaMin Pro Mineral Mix (Ca, Mg, K Balancer)',
    category: 'Minerals',
    manufacturer: 'Marine NutriChem',
    packSize: '25 kg Heavy Duty Bag',
    price: 1850,
    originalPrice: 2100,
    rating: 4.8,
    reviews: 230,
    inStock: true,
    image: '💎',
    badge: 'Molting Shield',
    composition: 'Bioavailable Magnesium (12%), Potassium (8%), Calcium (22%), Zinc, Copper, and Selenium.',
    indication: 'Enhances shell hardening within 12 hours of molting, prevents cramping, improves survival rate.',
    dosageRate: '10 kg per acre every 3-4 days post DOC 30, and 20 kg/acre on New Moon / Full Moon days.'
  },
  {
    id: 'prod-3',
    name: 'GutShield Herbal Probiotic & EHP Protector',
    category: 'Feed Supplements',
    manufacturer: 'Vannamei Health Solutions',
    packSize: '1 Liter Bottle',
    price: 1200,
    originalPrice: 1400,
    rating: 4.9,
    reviews: 89,
    inStock: true,
    image: '🌿',
    badge: 'Herbal Formula',
    composition: 'Plant extracts of Garlic, Turmeric, Phyllanthus niruri enriched with lactic acid bacteria and betaine.',
    indication: 'Prevents White Feces Syndrome (WFS), protects hepatopancreas from EHP microsporidia, boosts feed intake.',
    dosageRate: '10 to 15 ml per kg of feed mixed with binder, given in 2 meals daily for 7 days.'
  },
  {
    id: 'prod-4',
    name: 'OxyClean BKC-80% Water Sanitizer',
    category: 'Sanitizers',
    manufacturer: 'AquaCare Chemicals',
    packSize: '5 Liter Canister',
    price: 1650,
    originalPrice: 1950,
    rating: 4.7,
    reviews: 145,
    inStock: true,
    image: '🧴',
    badge: 'Broad Spectrum',
    composition: 'Benzalkonium Chloride 80% concentrated aquatic grade biocide.',
    indication: 'Controls pathogenic bacteria, Protozoan Zoothamnium, black gills, and sanitizes pond water.',
    dosageRate: '1.5 to 2.5 Liters per acre in sunny morning with aerators running.'
  },
  {
    id: 'prod-5',
    name: 'Spirulina Vital Boost Immunity Enhancer',
    category: 'Feed Supplements',
    manufacturer: 'BioNutrition Labs',
    packSize: '500g Tub',
    price: 890,
    originalPrice: 1100,
    rating: 4.85,
    reviews: 73,
    inStock: true,
    image: '🌱',
    badge: 'Premium Feed Mix',
    composition: 'Pure micro-algae Arthrospira platensis (65% protein, beta-carotene, phycocyanin).',
    indication: 'Boosts natural immunity against viral stressors, enhances radiant pigmentation and uniform growth.',
    dosageRate: '5g to 10g per kg of feed applied once daily.'
  },
  {
    id: 'prod-6',
    name: 'OxyPlus DO Oxygen Emergency Granules',
    category: 'Water Conditioners',
    manufacturer: 'AquaTech Rapid Chem',
    packSize: '10 kg Bucket',
    price: 1550,
    originalPrice: 1800,
    rating: 4.95,
    reviews: 162,
    inStock: true,
    image: '🫧',
    badge: 'Emergency DO',
    composition: 'Sodium Percarbonate coated granules with sustained oxygen release matrix.',
    indication: 'Emergency oxygen release during aerator power cuts, overcast rainy days, or sudden nocturnal DO drops.',
    dosageRate: '3 to 5 kg per acre broadcasted directly into water column; releases active DO within 10 minutes.'
  },
  {
    id: 'prod-7',
    name: 'Digital Waterproof DO & Temp Meter Pen',
    category: 'Testing Kits',
    manufacturer: 'SmartAqua Instruments',
    packSize: '1 Kit with Calibration Sol.',
    price: 4999,
    originalPrice: 6500,
    rating: 4.9,
    reviews: 67,
    inStock: true,
    image: '📟',
    badge: 'Precision Tool',
    composition: 'Electrochemical galvanic sensor with 0.01 mg/L resolution and LCD backlight display.',
    indication: 'Instant on-pond Dissolved Oxygen and Water Temperature measurement without chemicals.',
    dosageRate: 'Daily check at 6:00 AM and 4:00 PM.'
  },
  {
    id: 'prod-8',
    name: 'Optical Salinity Refractometer (0-100 ppt ATC)',
    category: 'Testing Kits',
    manufacturer: 'Precision Optical Lab',
    packSize: 'Cased Kit',
    price: 1699,
    originalPrice: 2200,
    rating: 4.8,
    reviews: 95,
    inStock: true,
    image: '🔍',
    badge: 'ATC Optics',
    composition: 'Automatic Temperature Compensation prism with dual scale (Salinity ppt & Specific Gravity).',
    indication: 'Accurate salinity monitoring during rainstorms or bore-water blending.',
    dosageRate: 'Calibrate with distilled water once a month.'
  }
];

export const MOCK_POND_BATCHES = [
  {
    id: 'pond-1',
    name: 'Pond #1 (North Dykes)',
    species: 'L. vannamei (Pacific White)',
    areaHectares: 1.2,
    stockingDate: '2026-08-08',
    doc: 69,
    stockedPL: 600000,
    densityPL_m2: 50,
    currentAvgWeightGrams: 20.8,
    targetHarvestWeightGrams: 30.0,
    estimatedSurvivalRate: 85.5,
    estimatedBiomassKg: 10674,
    totalFeedGivenKg: 13342,
    fcr: 1.25,
    adg: 0.32,
    waterParameters: {
      temperature: 29.5,
      phMorning: 7.8,
      phEvening: 8.3,
      doMorning: 4.8,
      doEvening: 6.9,
      salinity: 16.5,
      alkalinity: 145,
      tan: 0.25,
      no2: 0.05,
      waterColor: 'Light Olive Green (Good diatom bloom)'
    },
    historicalDOC: [
      { doc: 15, weight: 1.5, fcr: 0.95, do: 5.5, biomass: 880 },
      { doc: 30, weight: 5.8, fcr: 1.08, do: 5.2, biomass: 3200 },
      { doc: 45, weight: 11.2, fcr: 1.15, do: 4.9, biomass: 6000 },
      { doc: 60, weight: 17.0, fcr: 1.21, do: 4.7, biomass: 8900 },
      { doc: 69, weight: 20.8, fcr: 1.25, do: 4.8, biomass: 10674 }
    ],
    financials: {
      seedCost: 180000,
      feedCost: 1134070, // ~85/kg
      probioticsMineralsCost: 145000,
      electricityFuelCost: 120000,
      laborMiscCost: 75000,
      totalInvestment: 1654070,
      projectedRevenue: 3415680, // 320/kg for 30-count
      projectedNetProfit: 1761610,
      roiPercent: 106.5
    }
  },
  {
    id: 'pond-2',
    name: 'Pond #2 (South Basin)',
    species: 'L. vannamei (Pacific White)',
    areaHectares: 0.9,
    stockingDate: '2026-09-01',
    doc: 45,
    stockedPL: 450000,
    densityPL_m2: 50,
    currentAvgWeightGrams: 11.6,
    targetHarvestWeightGrams: 28.0,
    estimatedSurvivalRate: 88.0,
    estimatedBiomassKg: 4593,
    totalFeedGivenKg: 5236,
    fcr: 1.14,
    adg: 0.28,
    waterParameters: {
      temperature: 30.1,
      phMorning: 7.9,
      phEvening: 8.4,
      doMorning: 5.1,
      doEvening: 7.2,
      salinity: 18.0,
      alkalinity: 155,
      tan: 0.18,
      no2: 0.03,
      waterColor: 'Golden Brown (Diatom dominant)'
    },
    historicalDOC: [
      { doc: 15, weight: 1.6, fcr: 0.92, do: 5.8, biomass: 690 },
      { doc: 30, weight: 6.1, fcr: 1.05, do: 5.4, biomass: 2500 },
      { doc: 45, weight: 11.6, fcr: 1.14, do: 5.1, biomass: 4593 }
    ],
    financials: {
      seedCost: 135000,
      feedCost: 445060,
      probioticsMineralsCost: 80000,
      electricityFuelCost: 65000,
      laborMiscCost: 45000,
      totalInvestment: 770060,
      projectedRevenue: 1561620,
      projectedNetProfit: 791560,
      roiPercent: 102.8
    }
  },
  {
    id: 'pond-3',
    name: 'Pond #3 (Tilapia Nursery)',
    species: 'GIFT Tilapia',
    areaHectares: 0.5,
    stockingDate: '2026-07-15',
    doc: 93,
    stockedPL: 25000, // fingerlings
    densityPL_m2: 5,
    currentAvgWeightGrams: 420.0,
    targetHarvestWeightGrams: 600.0,
    estimatedSurvivalRate: 91.0,
    estimatedBiomassKg: 9555,
    totalFeedGivenKg: 12899,
    fcr: 1.35,
    adg: 4.5,
    waterParameters: {
      temperature: 28.9,
      phMorning: 7.5,
      phEvening: 8.0,
      doMorning: 4.2,
      doEvening: 6.1,
      salinity: 2.0,
      alkalinity: 110,
      tan: 0.40,
      no2: 0.12,
      waterColor: 'Medium Green (Green algae)'
    },
    historicalDOC: [
      { doc: 30, weight: 95, fcr: 1.15, do: 4.8, biomass: 2200 },
      { doc: 60, weight: 240, fcr: 1.25, do: 4.5, biomass: 5500 },
      { doc: 93, weight: 420, fcr: 1.35, do: 4.2, biomass: 9555 }
    ],
    financials: {
      seedCost: 50000,
      feedCost: 644950,
      probioticsMineralsCost: 45000,
      electricityFuelCost: 40000,
      laborMiscCost: 35000,
      totalInvestment: 814950,
      projectedRevenue: 1433250, // 150/kg
      projectedNetProfit: 618300,
      roiPercent: 75.8
    }
  }
];

export const MOCK_LAB_BOOKINGS = [
  {
    id: 'LAB-2026-8812',
    serviceTitle: 'Comprehensive 12-Parameter Water Quality Lab Panel',
    pondName: 'Pond #1 (North Dykes)',
    labName: 'AquaCare Advanced Diagnostic Lab & PCR Center',
    date: '2026-10-18',
    timeSlot: '07:30 AM - 09:00 AM',
    mode: 'Doorstep Farm Collection',
    status: 'Sample Collection Scheduled',
    statusStep: 1, // 0: Booked, 1: Field Tech Assigned, 2: Sample Collected, 3: Lab Testing, 4: Report Verified
    assignedTechnician: 'Ramesh Naidu (+91 98481 99201)',
    price: 650,
    farmerNotes: 'Early morning DO and ammonia check tray correlation.'
  },
  {
    id: 'LAB-2026-7945',
    serviceTitle: 'Seed PCR Pathogen Screening (SPF Verification)',
    pondName: 'Pond #2 (South Basin)',
    labName: 'National Marine Bio-Analytics Facility',
    date: '2026-10-14',
    timeSlot: '11:00 AM - 01:00 PM',
    mode: 'Direct Drop-Off',
    status: 'Report Ready (Clean / Passed)',
    statusStep: 4,
    price: 1800,
    hasReport: true,
    reportSummary: {
      status: 'SAFE_TO_STOCK',
      conclusion: 'Seed sample is PCR NEGATIVE for WSSV, EHP, and IMNV. 100% SPF certified for stocking.',
      testedParameters: [
        { name: 'WSSV Viral DNA', result: 'NOT DETECTED (Negative)', status: 'normal' },
        { name: 'EHP Microsporidian Spores', result: 'NOT DETECTED (Negative)', status: 'normal' },
        { name: 'IHHNV Parvovirus', result: 'NOT DETECTED (Negative)', status: 'normal' },
        { name: 'AHPND PirA/PirB Toxins', result: 'NOT DETECTED (Negative)', status: 'normal' },
        { name: 'Hepatopancreas Tubule Lipid Index', result: 'Grade 4 (Excellent reserves)', status: 'normal' }
      ]
    }
  }
];
