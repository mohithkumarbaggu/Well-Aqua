import React, { useState, useEffect } from 'react';
import { 
  Waves, 
  X, 
  Save, 
  Trash2, 
  Plus, 
  Edit3, 
  AlertCircle, 
  Sparkles, 
  Scale, 
  Calendar, 
  Droplets,
  CheckCircle2
} from 'lucide-react';

const COMMON_SPECIES = [
  { id: 'vannamei', name: 'L. vannamei (Pacific White)', type: 'Shrimp' },
  { id: 'tiger', name: 'Black Tiger Shrimp (P. monodon)', type: 'Shrimp' },
  { id: 'tilapia', name: 'GIFT Tilapia', type: 'Fish' },
  { id: 'scampi', name: 'Freshwater Scampi (M. rosenbergii)', type: 'Prawn' },
  { id: 'carps', name: 'Indian Major Carps (Rohu & Catla)', type: 'Fish' },
  { id: 'catfish', name: 'Pangasius / Murrel', type: 'Fish' }
];

export default function PondModal({ 
  isOpen, 
  onClose, 
  mode = 'add', // 'add' | 'edit'
  pondToEdit = null, 
  existingPondsCount = 3,
  onSavePond, 
  onDeletePond 
}) {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('L. vannamei (Pacific White)');
  const [areaAcres, setAreaAcres] = useState('2.5');
  const [areaHectares, setAreaHectares] = useState('1.01');
  const [doc, setDoc] = useState('45');
  const [stockingDate, setStockingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 45);
    return d.toISOString().split('T')[0];
  });
  const [densityPL, setDensityPL] = useState('50');
  const [stockedPL, setStockedPL] = useState('250000');
  const [currentWeight, setCurrentWeight] = useState('12.5');
  const [targetWeight, setTargetWeight] = useState('28.0');
  const [survivalRate, setSurvivalRate] = useState('85.0');
  const [waterDo, setWaterDo] = useState('5.2');
  const [waterPh, setWaterPh] = useState('7.9');
  const [waterSalinity, setWaterSalinity] = useState('15.0');
  const [waterColor, setWaterColor] = useState('Light Olive Green (Good diatom bloom)');

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync inputs when opening for edit or add
  useEffect(() => {
    if (!isOpen) {
      setConfirmDelete(false);
      setErrorMsg('');
      return;
    }

    if (mode === 'edit' && pondToEdit) {
      setName(pondToEdit.name || '');
      setSpecies(pondToEdit.species || 'L. vannamei (Pacific White)');
      const ha = pondToEdit.areaHectares || 1.0;
      const ac = pondToEdit.areaAcres || parseFloat((ha * 2.471).toFixed(1));
      setAreaHectares(ha.toString());
      setAreaAcres(ac.toString());
      setDoc(pondToEdit.doc ? pondToEdit.doc.toString() : '45');
      setStockingDate(pondToEdit.stockingDate || new Date().toISOString().split('T')[0]);
      setDensityPL(pondToEdit.densityPL_m2 ? pondToEdit.densityPL_m2.toString() : '50');
      setStockedPL(pondToEdit.stockedPL ? pondToEdit.stockedPL.toString() : '250000');
      setCurrentWeight(pondToEdit.currentAvgWeightGrams ? pondToEdit.currentAvgWeightGrams.toString() : '12.5');
      setTargetWeight(pondToEdit.targetHarvestWeightGrams ? pondToEdit.targetHarvestWeightGrams.toString() : '28.0');
      setSurvivalRate(pondToEdit.estimatedSurvivalRate ? pondToEdit.estimatedSurvivalRate.toString() : '85.0');
      
      const wp = pondToEdit.waterParameters || {};
      setWaterDo(wp.doMorning ? wp.doMorning.toString() : '5.2');
      setWaterPh(wp.phMorning ? wp.phMorning.toString() : '7.9');
      setWaterSalinity(wp.salinity ? wp.salinity.toString() : '15.0');
      setWaterColor(wp.waterColor || 'Light Olive Green (Good diatom bloom)');
    } else {
      // Add mode defaults
      const nextNum = existingPondsCount + 1;
      setName(`Pond #${nextNum}`);
      setSpecies('L. vannamei (Pacific White)');
      setAreaAcres('2.5');
      setAreaHectares('1.01');
      setDoc('1');
      setStockingDate(new Date().toISOString().split('T')[0]);
      setDensityPL('50');
      setStockedPL('250000');
      setCurrentWeight('0.05');
      setTargetWeight('28.0');
      setSurvivalRate('90.0');
      setWaterDo('5.4');
      setWaterPh('7.8');
      setWaterSalinity('15.0');
      setWaterColor('Clean Green (New batch preparation)');
    }
    setConfirmDelete(false);
    setErrorMsg('');
  }, [isOpen, mode, pondToEdit, existingPondsCount]);

  // Handle bidirectional sync between Acres and Hectares
  const handleAcresChange = (val) => {
    setAreaAcres(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const ha = (num / 2.471).toFixed(2);
      setAreaHectares(ha);
      const d = parseFloat(densityPL) || 50;
      setStockedPL(Math.round(num * 100000 * (d / 50)).toString());
    }
  };

  const handleHectaresChange = (val) => {
    setAreaHectares(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const ac = (num * 2.471).toFixed(1);
      setAreaAcres(ac);
      const d = parseFloat(densityPL) || 50;
      setStockedPL(Math.round(parseFloat(ac) * 100000 * (d / 50)).toString());
    }
  };

  const handleDensityChange = (val) => {
    setDensityPL(val);
    const d = parseFloat(val);
    const ac = parseFloat(areaAcres);
    if (!isNaN(d) && !isNaN(ac) && ac > 0 && d > 0) {
      setStockedPL(Math.round(ac * 100000 * (d / 50)).toString());
    }
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please specify a pond name or identifier.');
      return;
    }

    const ha = parseFloat(areaHectares) || 1.0;
    const ac = parseFloat(areaAcres) || parseFloat((ha * 2.471).toFixed(1));
    const docNum = parseInt(doc, 10) || 1;
    const plCount = parseInt(stockedPL, 10) || 200000;
    const dens = parseInt(densityPL, 10) || 50;
    const curWt = parseFloat(currentWeight) || 12.0;
    const tgtWt = parseFloat(targetWeight) || 28.0;
    const surv = parseFloat(survivalRate) || 85.0;

    // Biomass estimation = (stockedPL * survivalRate / 100) * (currentWeight / 1000)
    const survivingCount = Math.round(plCount * (surv / 100));
    const estBiomass = Math.round(survivingCount * (curWt / 1000));
    const estFeed = Math.round(estBiomass * 1.2);

    const updatedPondData = {
      ...(pondToEdit || {}),
      id: mode === 'edit' && pondToEdit?.id ? pondToEdit.id : `pond-custom-${Date.now()}`,
      name: name.trim(),
      species: species,
      areaHectares: ha,
      areaAcres: ac,
      stockingDate: stockingDate,
      doc: docNum,
      stockedPL: plCount,
      densityPL_m2: dens,
      currentAvgWeightGrams: curWt,
      targetHarvestWeightGrams: tgtWt,
      estimatedSurvivalRate: surv,
      estimatedBiomassKg: estBiomass,
      totalFeedGivenKg: estFeed,
      fcr: pondToEdit?.fcr || 1.18,
      adg: pondToEdit?.adg || 0.28,
      hasCustomReport: true,
      waterParameters: {
        ...(pondToEdit?.waterParameters || {}),
        temperature: pondToEdit?.waterParameters?.temperature || 29.5,
        phMorning: parseFloat(waterPh) || 7.8,
        phEvening: parseFloat((parseFloat(waterPh) + 0.5).toFixed(1)) || 8.3,
        doMorning: parseFloat(waterDo) || 5.2,
        doEvening: parseFloat((parseFloat(waterDo) + 1.6).toFixed(1)) || 6.8,
        salinity: parseFloat(waterSalinity) || 15.0,
        alkalinity: pondToEdit?.waterParameters?.alkalinity || 135,
        tan: pondToEdit?.waterParameters?.tan || 0.15,
        no2: pondToEdit?.waterParameters?.no2 || 0.03,
        waterColor: waterColor
      },
      historicalDOC: pondToEdit?.historicalDOC && pondToEdit.historicalDOC.length > 0
        ? pondToEdit.historicalDOC
        : [
            { doc: Math.max(1, Math.round(docNum * 0.25)), weight: Math.max(0.5, (curWt * 0.2).toFixed(1)), fcr: 1.05, do: 5.4, biomass: Math.round(estBiomass * 0.15) },
            { doc: Math.max(1, Math.round(docNum * 0.5)), weight: Math.max(1.0, (curWt * 0.5).toFixed(1)), fcr: 1.12, do: 5.1, biomass: Math.round(estBiomass * 0.45) },
            { doc: docNum, weight: curWt, fcr: 1.18, do: parseFloat(waterDo) || 5.2, biomass: estBiomass }
          ],
      financials: pondToEdit?.financials || {
        seedCost: Math.round(ac * 35000),
        feedCost: Math.round(estFeed * 85),
        probioticsMineralsCost: Math.round(ac * 22000),
        electricityFuelCost: Math.round(ac * 18000),
        laborMiscCost: Math.round(ac * 12000),
        totalInvestment: Math.round(ac * 35000 + estFeed * 85 + ac * 52000),
        projectedRevenue: Math.round(estBiomass * 320),
        projectedNetProfit: Math.round(estBiomass * 320 - (ac * 35000 + estFeed * 85 + ac * 52000)),
        roiPercent: 78.5
      }
    };

    onSavePond(updatedPondData, mode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(8px)',
        padding: '16px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.05) 0%, rgba(13, 148, 136, 0.05) 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: mode === 'edit' ? 'rgba(2, 132, 199, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              color: mode === 'edit' ? 'var(--cyan)' : 'var(--emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {mode === 'edit' ? <Edit3 size={22} /> : <Plus size={22} />}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {mode === 'edit' ? 'Edit Pond Details (చెరువు వివరాలు సవరణ)' : 'Add New Farm Pond (కొత్త చెరువు చేర్చండి)'}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {mode === 'edit' 
                  ? `Update parameters, dimensions, and targets for ${pondToEdit?.name || 'Pond'}`
                  : 'Register a new aquaculture pond batch for real-time monitoring & advisory'
                }
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              padding: '6px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--rose)',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Identification */}
          <div>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cyan)', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Waves size={15} />
              1. Pond Identity & Species (చెరువు గుర్తింపు & జాతి)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Pond Name / Tag *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pond #1 (North Dykes)"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    background: '#ffffff'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Cultured Species (సాగు చేయు జాతి)
                </label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    background: '#ffffff'
                  }}
                >
                  {COMMON_SPECIES.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.type})
                    </option>
                  ))}
                  <option value="Other Aquaculture Species">Other Aquaculture Species</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Area & Stocking Dimensions */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cyan)', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scale size={15} />
              2. Dimensions & Stocking Density (విస్తీర్ణం & సాంద్రత)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Area in Acres (ఎకరాలు)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={areaAcres}
                  onChange={(e) => handleAcresChange(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Area in Hectares (హెక్టార్లు)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.05"
                  max="40"
                  value={areaHectares}
                  onChange={(e) => handleHectaresChange(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Stocking Density (PL/m²)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="150"
                  value={densityPL}
                  onChange={(e) => handleDensityChange(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Total Seed Count (విత్తనం సంఖ్య)
                </label>
                <input
                  type="number"
                  step="5000"
                  min="5000"
                  value={stockedPL}
                  onChange={(e) => setStockedPL(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Culture Lifecycle & Growth Metrics */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cyan)', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} />
              3. Batch Lifecycle & Target Weights (సాగు పురోగతి)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  DOC (సాగు రోజులు)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  max="300"
                  value={doc}
                  onChange={(e) => setDoc(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Stocking Date (విత్తన తేదీ)
                </label>
                <input
                  type="date"
                  value={stockingDate}
                  onChange={(e) => setStockingDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Current ABW (సగటు బరువు g)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.01"
                  max="1000"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Target Harvest (లక్ష్య బరువు g)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="5"
                  max="2000"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-main)' }}>
                  Est. Survival Rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="30"
                  max="100"
                  value={survivalRate}
                  onChange={(e) => setSurvivalRate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Water Baseline Presets */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cyan)', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Droplets size={15} />
              4. Water Parameters Baseline (నీటి నాణ్యత ప్రాథమిక వివరాలు)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-muted)' }}>
                  Morning DO (ppm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={waterDo}
                  onChange={(e) => setWaterDo(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-muted)' }}>
                  Morning pH
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={waterPh}
                  onChange={(e) => setWaterPh(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-muted)' }}>
                  Salinity (ppt)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={waterSalinity}
                  onChange={(e) => setWaterSalinity(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-muted)' }}>
                  Water Color / Bloom Condition
                </label>
                <input
                  type="text"
                  value={waterColor}
                  onChange={(e) => setWaterColor(e.target.value)}
                  placeholder="e.g. Light Olive Green (Diatom bloom)"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}
                />
              </div>
            </div>
          </div>

          {/* Delete Confirmation Box (if triggered) */}
          {confirmDelete && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--rose)', fontWeight: 700, fontSize: '0.9rem' }}>
                <Trash2 size={18} />
                <span>Are you sure you want to delete {pondToEdit?.name}?</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                This action cannot be undone. All telemetry history, feeding records, and harvest forecasts for this pond will be permanently removed.
              </p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    background: '#ffffff',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeletePond(pondToEdit?.id);
                    onClose();
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'var(--rose)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px',
            marginTop: '8px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              {mode === 'edit' && !confirmDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    background: 'rgba(239, 68, 68, 0.06)',
                    color: 'var(--rose)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={16} />
                  <span>Delete Pond</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Cancel (రద్దు చేయండి)
              </button>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                <Save size={16} />
                <span>
                  {mode === 'edit' ? 'Save Changes (భద్రపరచు)' : 'Create Pond (చెరువు చేర్చు)'}
                </span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
