// Mock database for Admin Portal - Comprehensive Multi-Farm Roster
export const INITIAL_ADMIN_FARMERS = [
  {
    id: 'farmer_01',
    name: 'Mohith Kumar Baggu',
    farmName: 'Srimannarayana Coastal Aqua Farm',
    phone: '+91 98480 12345',
    email: 'mohith.baggu@wellaqua.farm',
    location: 'Bhimavaram, West Godavari District, Andhra Pradesh',
    caaRegNo: 'CAA/2024/AP/WG/48291',
    mpedaId: 'MPEDA-IND-AP-9921',
    totalPondsCount: 3,
    totalAreaAcres: 6.5,
    primarySpecies: 'L. vannamei (Pacific White)',
    status: 'Verified',
    joinedDate: '2024-03-15',
    lastActive: 'Just now',
    criticalAlertsCount: 0
  },
  {
    id: 'farmer_02',
    name: 'Venkata Ramana Raju',
    farmName: 'Godavari Sunrise Prawn Hatcheries',
    phone: '+91 94401 55678',
    email: 'v.raju@godavarisunrise.in',
    location: 'Kaikaluru, Eluru District, Andhra Pradesh',
    caaRegNo: 'CAA/2023/AP/EL/11294',
    mpedaId: 'MPEDA-IND-AP-8840',
    totalPondsCount: 4,
    totalAreaAcres: 9.0,
    primarySpecies: 'L. vannamei (Pacific White)',
    status: 'Verified',
    joinedDate: '2024-01-20',
    lastActive: '12 mins ago',
    criticalAlertsCount: 1 // Low DO alert
  },
  {
    id: 'farmer_03',
    name: 'K. Subrahmanyam Chowdary',
    farmName: 'Sri Venkateswara Coastal Farms',
    phone: '+91 98492 77412',
    email: 'ksc.aqua@gmail.com',
    location: 'Machilipatnam, Krishna District, Andhra Pradesh',
    caaRegNo: 'CAA/2024/AP/KR/98124',
    mpedaId: 'MPEDA-IND-AP-7321',
    totalPondsCount: 5,
    totalAreaAcres: 12.5,
    primarySpecies: 'P. monodon (Black Tiger)',
    status: 'Verified',
    joinedDate: '2024-04-02',
    lastActive: '1 hour ago',
    criticalAlertsCount: 0
  },
  {
    id: 'farmer_04',
    name: 'B. Jagadeesh Reddy',
    farmName: 'Penna River Estuary Aqua Park',
    phone: '+91 99890 33411',
    email: 'jagadeesh.reddy@pennaaqua.com',
    location: 'Indukurpet, Nellore District, Andhra Pradesh',
    caaRegNo: 'CAA/2023/AP/NL/44819',
    mpedaId: 'MPEDA-IND-AP-6612',
    totalPondsCount: 6,
    totalAreaAcres: 16.0,
    primarySpecies: 'L. vannamei (Pacific White)',
    status: 'Verified',
    joinedDate: '2023-11-18',
    lastActive: '25 mins ago',
    criticalAlertsCount: 1 // High Ammonia alert
  },
  {
    id: 'farmer_05',
    name: 'M. Satyanarayana Murthy',
    farmName: 'Konaseema Biofloc & Tilapia Farm',
    phone: '+91 98488 22109',
    email: 'satya.murthy@konaseema.farm',
    location: 'Amalapuram, Konaseema District, Andhra Pradesh',
    caaRegNo: 'CAA/2025/AP/KS/10482',
    mpedaId: 'MPEDA-IND-AP-9014',
    totalPondsCount: 2,
    totalAreaAcres: 4.0,
    primarySpecies: 'GIFT Tilapia',
    status: 'Pending Verification',
    joinedDate: '2026-01-10',
    lastActive: '2 hours ago',
    criticalAlertsCount: 0
  },
  {
    id: 'farmer_06',
    name: 'G. Lakshmi Narayana',
    farmName: 'Kakinada Coringa Mangrove Prawns',
    phone: '+91 94412 88765',
    email: 'g.lakshmi@coringaprawns.in',
    location: 'Yanam Border, Kakinada District, Andhra Pradesh',
    caaRegNo: 'CAA/2024/AP/KK/55198',
    mpedaId: 'MPEDA-IND-AP-8120',
    totalPondsCount: 3,
    totalAreaAcres: 7.2,
    primarySpecies: 'P. monodon (Black Tiger)',
    status: 'Verified',
    joinedDate: '2024-06-12',
    lastActive: '4 hours ago',
    criticalAlertsCount: 0
  }
];

export const INITIAL_ADMIN_LAB_ORDERS = [
  {
    id: 'LAB-2026-8812',
    farmerName: 'Mohith Kumar Baggu',
    farmName: 'Srimannarayana Coastal Aqua Farm',
    pondName: 'Pond #1 (North Dykes)',
    serviceTitle: 'Comprehensive 12-Parameter Water Quality Lab Panel',
    labName: 'AquaCare Advanced Diagnostic Lab & PCR Center',
    date: '2026-10-18',
    timeSlot: '07:30 AM - 09:00 AM',
    mode: 'Doorstep Farm Collection',
    status: 'Sample Collection Scheduled',
    statusStep: 1,
    assignedTechnician: 'Ramesh Naidu (+91 98481 99201)',
    price: 650,
    phone: '+91 98480 12345',
    notes: 'Early morning DO and ammonia check tray correlation.'
  },
  {
    id: 'LAB-2026-7945',
    farmerName: 'Mohith Kumar Baggu',
    farmName: 'Srimannarayana Coastal Aqua Farm',
    pondName: 'Pond #2 (South Basin)',
    serviceTitle: 'Seed PCR Pathogen Screening (SPF Verification)',
    labName: 'National Marine Bio-Analytics Facility',
    date: '2026-10-14',
    timeSlot: '11:00 AM - 01:00 PM',
    mode: 'Direct Drop-Off',
    status: 'Report Ready (Clean / Passed)',
    statusStep: 4,
    assignedTechnician: 'Dr. Swaminathan (Senior Virologist)',
    price: 1800,
    phone: '+91 98480 12345',
    hasReport: true
  },
  {
    id: 'LAB-2026-9041',
    farmerName: 'Venkata Ramana Raju',
    farmName: 'Godavari Sunrise Prawn Hatcheries',
    pondName: 'Pond #3 (Creek Side)',
    serviceTitle: 'Vibrio Colony Count & Luminescent Bacteria Agar Screen',
    labName: 'AquaCare Advanced Diagnostic Lab',
    date: '2026-10-18',
    timeSlot: '06:30 AM - 08:00 AM',
    mode: 'Doorstep Farm Collection',
    status: 'Testing in Progress',
    statusStep: 3,
    assignedTechnician: 'K. Subba Rao (+91 98492 88123)',
    price: 850,
    phone: '+91 94401 55678',
    notes: 'Suspected green colony vibrio bloom on TCBS agar.'
  },
  {
    id: 'LAB-2026-9182',
    farmerName: 'B. Jagadeesh Reddy',
    farmName: 'Penna River Estuary Aqua Park',
    pondName: 'Pond #4 (Intensive Basin)',
    serviceTitle: 'Pond Bottom Black Sludge & Soil Chemistry Analysis',
    labName: 'Coastal Soil & Water Research Station, Nellore',
    date: '2026-10-19',
    timeSlot: '08:00 AM - 09:30 AM',
    mode: 'Doorstep Farm Collection',
    status: 'Sample Collection Scheduled',
    statusStep: 1,
    assignedTechnician: 'M. Suresh Kumar (+91 99480 11200)',
    price: 550,
    phone: '+91 99890 33411',
    notes: 'Organic carbon and redox potential measurement.'
  }
];

export const INITIAL_ADMIN_PHARMACY_ORDERS = [
  {
    orderId: 'ORD-WA-2026-441',
    farmerName: 'Mohith Kumar Baggu',
    farmName: 'Srimannarayana Coastal Aqua Farm',
    phone: '+91 98480 12345',
    items: [
      { name: 'AquaMin Pro - Chelated Mineral Mix (25kg)', qty: 3, price: 1850 },
      { name: 'Gut-Pro Supreme - Bacillus Probiotic (1kg)', qty: 2, price: 1200 }
    ],
    totalAmount: 7950,
    paymentStatus: 'Paid (UPI / PhonePe)',
    orderStatus: 'Dispatched (Out for Delivery)',
    orderDate: '2026-10-16',
    deliveryAddress: 'Bhimavaram North Dyke Road, West Godavari',
    deliveryPartner: 'Well Aqua Express Field Delivery'
  },
  {
    orderId: 'ORD-WA-2026-398',
    farmerName: 'K. Subrahmanyam Chowdary',
    farmName: 'Sri Venkateswara Coastal Farms',
    phone: '+91 98492 77412',
    items: [
      { name: 'Oxy-Burst Active - DO Emergency Granules (10kg)', qty: 4, price: 1450 },
      { name: 'Yucca-Clean 80% - Ammonia Binder (5L)', qty: 2, price: 1650 }
    ],
    totalAmount: 9100,
    paymentStatus: 'Cash on Delivery',
    orderStatus: 'Processing at Bhimavaram Hub',
    orderDate: '2026-10-17',
    deliveryAddress: 'Machilipatnam Coastal Canal Gate #4, Krishna District',
    deliveryPartner: 'Well Aqua Express Field Delivery'
  }
];

export const INITIAL_ADMIN_BROADCASTS = [
  {
    id: 'BC-2026-101',
    title: '⚠️ Cyclone & Sudden Heavy Rainfall Advisory (West Godavari & Krishna Districts)',
    category: 'Weather & Monsoon Alert',
    priority: 'Urgent',
    targetDistrict: 'West Godavari & Krishna Districts',
    date: '2026-10-17',
    time: '09:30 AM',
    author: 'Admin Central Command',
    content: 'IMD reports cyclonic depression approaching Andhra coast. High runoff rainfall expected in Bhimavaram, Machilipatnam, and Kaikaluru. Actions: 1) Run aerators continuously to prevent thermocline and DO stratification. 2) Stop feeding during heavy downpours. 3) Apply 25kg Agricultural Lime per acre along pond dykes to neutralize acidic runoff rain.',
    readCount: 142,
    active: true
  },
  {
    id: 'BC-2026-102',
    title: '🦐 White Spot & EHP Bio-Security Protocol Update',
    category: 'Disease Prevention Advisory',
    priority: 'High',
    targetDistrict: 'All Coastal Andhra Districts',
    date: '2026-10-15',
    time: '02:15 PM',
    author: 'Chief Aquatic Pathologist',
    content: 'Early season temperature drops trigger dormant WSSV. Ensure all feed trays are inspected twice daily. Do not allow untreated canal water pumping during high tide if neighboring farms report sudden mortality. PCR testing available at doorstep through Well Aqua Diagnostic Labs.',
    readCount: 298,
    active: true
  },
  {
    id: 'BC-2026-103',
    title: '🏛️ MPEDA & CAA Export Subsidy Registration Deadline',
    category: 'Government Schemes & Compliance',
    priority: 'Standard',
    targetDistrict: 'All Registered Farmers',
    date: '2026-10-10',
    time: '11:00 AM',
    author: 'Compliance Officer',
    content: 'Farmers possessing valid CAA licenses are eligible for 40% capital subsidy on solar aerators and digital DO sensors under PMMSY scheme. Submit pond verification numbers before end of month.',
    readCount: 380,
    active: true
  }
];

export const INITIAL_DISPATCHED_LAB_READINGS = [
  {
    id: 'DISP-LAB-9921',
    farmerId: 'farmer_01',
    farmerName: 'Mohith Kumar Baggu',
    farmName: 'Srimannarayana Coastal Aqua Farm',
    pondId: 'pond-farmer_01-1',
    pondName: 'Pond #1 (North Dykes)',
    date: '2026-10-17',
    testedAt: '08:30 AM',
    technicianName: 'Dr. Ramesh Varma (Senior Microbiologist)',
    labFacility: 'Well Aqua Coastal Diagnostic Hub, Bhimavaram',
    waterParameters: {
      doMorning: 5.6,
      doEvening: 7.2,
      phMorning: 7.8,
      phEvening: 8.2,
      salinity: 16.0,
      alkalinity: 140,
      tan: 0.04,
      no2: 0.02,
      temperature: 29.5,
      waterColor: 'Planktonic Golden Brown'
    },
    soilParameters: {
      soilPh: 7.2,
      organicCarbonPct: 1.15,
      h2sPpm: 0.003,
      ironPpm: 'Normal / Trace',
      sludgeDepthCm: 3.2
    },
    recommendations: 'Water and soil chemistry is in optimal culture range. Maintain current feeding schedule. Dose 5kg probiotic per acre on Day 52.'
  }
];
