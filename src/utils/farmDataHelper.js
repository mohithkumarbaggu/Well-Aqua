// Helper utilities to initialize and manage authentic farm data for newly registered farmers
import { MOCK_POND_BATCHES, MOCK_LAB_BOOKINGS } from '../data/mockData';

export function generateInitialFarmerPonds(farmer) {
  if (!farmer) return MOCK_POND_BATCHES;

  const pondCount = Math.max(1, parseInt(farmer.totalPondsCount || 2, 10));
  const totalAcres = parseFloat(farmer.totalAreaAcres || 4.0);
  const acresPerPond = parseFloat((totalAcres / pondCount).toFixed(1));
  const hectaresPerPond = parseFloat((acresPerPond / 2.471).toFixed(2));
  const species = farmer.primarySpecies || 'L. vannamei (Pacific White)';
  const farmName = farmer.farmName || 'My Aqua Farm';

  const newPonds = [];
  for (let i = 1; i <= pondCount; i++) {
    const defaultSeedCount = Math.round(acresPerPond * 40000 * 2.5); // ~100k PL per acre standard density
    newPonds.push({
      id: `pond-${farmer.id || 'farmer'}-${i}`,
      name: `Pond #${i} (${farmName.split(' ')[0]})`,
      species: species,
      areaHectares: hectaresPerPond,
      areaAcres: acresPerPond,
      stockingDate: new Date().toISOString().split('T')[0],
      doc: 1, // New batch day 1
      isNewBatch: true,
      hasCustomReport: false,
      hasRecordedWaterParams: false,
      stockedPL: defaultSeedCount,
      densityPL_m2: 50,
      currentAvgWeightGrams: 0,
      targetHarvestWeightGrams: 28.0,
      estimatedSurvivalRate: 0,
      estimatedBiomassKg: 0,
      totalFeedGivenKg: 0,
      fcr: 0,
      adg: 0,
      waterParameters: {
        temperature: null,
        phMorning: null,
        phEvening: null,
        doMorning: null,
        doEvening: null,
        salinity: null,
        alkalinity: null,
        tan: null,
        no2: null,
        waterColor: 'Awaiting farmer / lab entry'
      },
      historicalDOC: [
        { doc: 1, weight: 0.05, fcr: 1.0, do: 5.4, biomass: 0 }
      ],
      financials: {
        seedCost: Math.round(acresPerPond * 25000),
        feedCost: 0,
        probioticsMineralsCost: 0,
        electricityFuelCost: 0,
        laborMiscCost: 0,
        totalInvestment: Math.round(acresPerPond * 25000),
        projectedRevenue: 0,
        projectedNetProfit: 0,
        roiPercent: 0
      }
    });
  }
  return newPonds;
}

export function getFarmerPonds(farmer) {
  if (!farmer) return MOCK_POND_BATCHES;
  
  // Demo account uses full rich mock dataset
  if (farmer.id === 'farmer_01') {
    return MOCK_POND_BATCHES;
  }

  try {
    const saved = localStorage.getItem(`well_aqua_ponds_${farmer.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading saved ponds:', e);
  }

  // Generate authentic ponds tailored to user's registered parameters
  const initial = generateInitialFarmerPonds(farmer);
  try {
    localStorage.setItem(`well_aqua_ponds_${farmer.id}`, JSON.stringify(initial));
  } catch (e) {}
  return initial;
}

export function getFarmerBookings(farmer) {
  if (!farmer) return [];
  if (farmer.id === 'farmer_01') {
    return MOCK_LAB_BOOKINGS;
  }
  try {
    const saved = localStorage.getItem(`well_aqua_bookings_${farmer.id}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  return []; // Clean empty bookings for newly registered farmers
}
