import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  FlaskConical, 
  Scale, 
  Calendar, 
  Droplets, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Waves
} from 'lucide-react';

export default function FarmReportModal({ 
  isOpen, 
  onClose, 
  activePond, 
  onSaveReport 
}) {
  if (!isOpen || !activePond) return null;

  const [formData, setFormData] = useState({
    name: activePond.name || 'Pond #1',
    species: activePond.species || 'L. vannamei (Pacific White)',
    stockingDate: activePond.stockingDate || new Date().toISOString().split('T')[0],
    doc: activePond.doc || 1,
    stockedPL: activePond.stockedPL || 100000,
    areaAcres: activePond.areaAcres || (activePond.areaHectares ? Math.round(activePond.areaHectares * 2.471 * 10) / 10 : 2.0),
    currentAvgWeightGrams: activePond.currentAvgWeightGrams > 0 ? activePond.currentAvgWeightGrams : '',
    targetHarvestWeightGrams: activePond.targetHarvestWeightGrams || 28.0,
    estimatedSurvivalRate: activePond.estimatedSurvivalRate > 0 ? activePond.estimatedSurvivalRate : '',
    totalFeedGivenKg: activePond.totalFeedGivenKg > 0 ? activePond.totalFeedGivenKg : '',
    // Water parameters
    phMorning: activePond.waterParameters?.phMorning != null ? activePond.waterParameters.phMorning : '',
    phEvening: activePond.waterParameters?.phEvening != null ? activePond.waterParameters.phEvening : '',
    doMorning: activePond.waterParameters?.doMorning != null ? activePond.waterParameters.doMorning : '',
    doEvening: activePond.waterParameters?.doEvening != null ? activePond.waterParameters.doEvening : '',
    salinity: activePond.waterParameters?.salinity != null ? activePond.waterParameters.salinity : '',
    alkalinity: activePond.waterParameters?.alkalinity != null ? activePond.waterParameters.alkalinity : '',
    tan: activePond.waterParameters?.tan != null ? activePond.waterParameters.tan : '',
    temperature: activePond.waterParameters?.temperature != null ? activePond.waterParameters.temperature : '',
    waterColor: activePond.waterParameters?.waterColor || 'Light Green (Healthy Bloom)',
    // Financials
    totalInvestment: activePond.financials?.totalInvestment || ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const stockedCount = Number(formData.stockedPL) || 0;
    const survivalPct = formData.estimatedSurvivalRate !== '' ? Number(formData.estimatedSurvivalRate) : 85;
    const avgWeight = formData.currentAvgWeightGrams !== '' ? Number(formData.currentAvgWeightGrams) : 1;
    const feedKg = Number(formData.totalFeedGivenKg) || 0;

    // Calculate biomass: (Surviving count * weight in grams) / 1000
    const survivingCount = Math.round(stockedCount * (survivalPct / 100));
    const estimatedBiomassKg = Math.round((survivingCount * avgWeight) / 1000);
    const fcr = estimatedBiomassKg > 0 && feedKg > 0 
      ? parseFloat((feedKg / estimatedBiomassKg).toFixed(2)) 
      : 1.15;

    const acres = Number(formData.areaAcres) || 2.0;
    const hectares = parseFloat((acres / 2.471).toFixed(2));
    const densityPL = Math.round(stockedCount / (hectares * 10000)) || 50;

    const updatedPond = {
      ...activePond,
      name: formData.name,
      species: formData.species,
      stockingDate: formData.stockingDate,
      doc: Number(formData.doc) || 1,
      hasCustomReport: true,
      hasRecordedWaterParams: formData.phMorning !== '' || formData.doMorning !== '',
      isNewBatch: false,
      areaAcres: acres,
      areaHectares: hectares,
      stockedPL: stockedCount,
      densityPL_m2: densityPL,
      currentAvgWeightGrams: avgWeight,
      targetHarvestWeightGrams: Number(formData.targetHarvestWeightGrams) || 28,
      estimatedSurvivalRate: survivalPct,
      estimatedBiomassKg: estimatedBiomassKg,
      totalFeedGivenKg: feedKg,
      fcr: fcr,
      waterParameters: {
        temperature: formData.temperature !== '' ? Number(formData.temperature) : null,
        phMorning: formData.phMorning !== '' ? Number(formData.phMorning) : null,
        phEvening: formData.phEvening !== '' ? Number(formData.phEvening) : null,
        doMorning: formData.doMorning !== '' ? Number(formData.doMorning) : null,
        doEvening: formData.doEvening !== '' ? Number(formData.doEvening) : null,
        salinity: formData.salinity !== '' ? Number(formData.salinity) : null,
        alkalinity: formData.alkalinity !== '' ? Number(formData.alkalinity) : null,
        tan: formData.tan !== '' ? Number(formData.tan) : null,
        no2: 0.02,
        waterColor: formData.waterColor || 'Light Green (Healthy Bloom)'
      },
      financials: {
        ...activePond.financials,
        totalInvestment: Number(formData.totalInvestment) || 50000,
        feedCost: Math.round(feedKg * 85),
        projectedRevenue: Math.round(estimatedBiomassKg * 340),
        projectedNetProfit: Math.max(0, Math.round(estimatedBiomassKg * 340) - (Number(formData.totalInvestment) || 50000))
      }
    };

    onSaveReport(updatedPond);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '680px', 
          maxHeight: '90vh', 
          overflowY: 'auto',
          padding: '28px',
          borderRadius: '20px',
          background: '#ffffff'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>Pond Telemetry & Log</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>మీ చెరువు వివరాలు నమోదు చేయండి</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Log Real Farm Report Data (చెరువు రిపోర్ట్)
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Update {activePond.name} with your actual water test values, stocking counts, and feeding records.
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '8px', color: 'var(--text-muted)' }}
            title="Close"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* SECTION 1: POND & BATCH IDENTITY */}
          <div style={{ background: 'rgba(2, 132, 199, 0.04)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(2, 132, 199, 0.12)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--cyan)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Waves size={16} />
              <span>1. Pond & Crop Batch Information</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Pond Name:
                </label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.86rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Species Cultivated:
                </label>
                <select 
                  value={formData.species}
                  onChange={(e) => handleChange('species', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.86rem' }}
                >
                  <option value="L. vannamei (Pacific White)">L. vannamei (White Shrimp / వెన్నామి)</option>
                  <option value="P. monodon (Black Tiger)">P. monodon (Black Tiger / బ్లాక్ టైగర్)</option>
                  <option value="GIFT Tilapia">GIFT Tilapia (తిలాపియా)</option>
                  <option value="Indian Major Carps (Rohu/Catla)">Indian Major Carps (రోహు / బొచ్చ)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Pond Size (Acres / ఎకరాలు):
                </label>
                <input 
                  type="number"
                  step="0.1"
                  value={formData.areaAcres}
                  onChange={(e) => handleChange('areaAcres', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.86rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Days of Culture (DOC / సాగు రోజులు):
                </label>
                <input 
                  type="number"
                  value={formData.doc}
                  onChange={(e) => handleChange('doc', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.86rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Stocked Seed (PL Count / సీడ్ సంఖ్య):
                </label>
                <input 
                  type="number"
                  value={formData.stockedPL}
                  onChange={(e) => handleChange('stockedPL', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.86rem' }}
                  placeholder="e.g. 150000"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Stocking Date:
                </label>
                <input 
                  type="date"
                  value={formData.stockingDate}
                  onChange={(e) => handleChange('stockingDate', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.86rem' }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: TODAY'S WATER QUALITY PARAMETERS */}
          <div style={{ background: 'rgba(16, 185, 129, 0.04)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FlaskConical size={16} />
              <span>2. Today's Water Quality Test Results (నీటి నాణ్యత పారామితులు)</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  DO Morning 6 AM (ppm):
                </label>
                <input 
                  type="number"
                  step="0.1"
                  value={formData.doMorning}
                  onChange={(e) => handleChange('doMorning', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                  placeholder="e.g. 5.2 (Safe > 4.5)"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  DO Evening (ppm):
                </label>
                <input 
                  type="number"
                  step="0.1"
                  value={formData.doEvening}
                  onChange={(e) => handleChange('doEvening', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  pH Morning (7 AM):
                </label>
                <input 
                  type="number"
                  step="0.1"
                  value={formData.phMorning}
                  onChange={(e) => handleChange('phMorning', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                  placeholder="e.g. 7.8 (Optimal 7.5 - 8.5)"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  pH Evening (4 PM):
                </label>
                <input 
                  type="number"
                  step="0.1"
                  value={formData.phEvening}
                  onChange={(e) => handleChange('phEvening', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                  placeholder="e.g. 8.2"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Salinity (ppt / ఉప్పుదనం):
                </label>
                <input 
                  type="number"
                  step="0.5"
                  value={formData.salinity}
                  onChange={(e) => handleChange('salinity', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                  placeholder="e.g. 15.0 ppt"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Alkalinity (ppm):
                </label>
                <input 
                  type="number"
                  value={formData.alkalinity}
                  onChange={(e) => handleChange('alkalinity', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                  placeholder="e.g. 130 ppm"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Ammonia / TAN (mg/L):
                </label>
                <input 
                  type="number"
                  step="0.05"
                  value={formData.tan}
                  onChange={(e) => handleChange('tan', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                  placeholder="e.g. 0.05 mg/L"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Water Temperature (°C):
                </label>
                <input 
                  type="number"
                  step="0.5"
                  value={formData.temperature}
                  onChange={(e) => handleChange('temperature', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                  placeholder="e.g. 29.0 °C"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: GROWTH, FEED & FINANCIALS */}
          <div style={{ background: 'rgba(245, 158, 11, 0.04)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#d97706', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scale size={16} />
              <span>3. Shrimp Growth & Feed Status</span>
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Current Avg Weight (grams):
                </label>
                <input 
                  type="number"
                  step="0.1"
                  value={formData.currentAvgWeightGrams}
                  onChange={(e) => handleChange('currentAvgWeightGrams', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Est. Survival Rate (%):
                </label>
                <input 
                  type="number"
                  step="0.5"
                  value={formData.estimatedSurvivalRate}
                  onChange={(e) => handleChange('estimatedSurvivalRate', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Total Feed Given to Date (kg):
                </label>
                <input 
                  type="number"
                  value={formData.totalFeedGivenKg}
                  onChange={(e) => handleChange('totalFeedGivenKg', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                  Total Crop Investment Spent (₹):
                </label>
                <input 
                  type="number"
                  value={formData.totalInvestment}
                  onChange={(e) => handleChange('totalInvestment', e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', fontSize: '0.86rem' }}
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
            <button 
              type="button"
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              Cancel
            </button>

            <button 
              type="submit"
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Save size={16} />
              <span>Save & Update Dashboard</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
