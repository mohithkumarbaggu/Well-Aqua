import React, { useState } from 'react';
import { 
  SPECIES_GUIDES, 
  DISEASE_CATALOG 
} from '../data/mockData';
import { 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Info, 
  Search, 
  Thermometer, 
  Droplet, 
  Wind, 
  HelpCircle,
  ExternalLink,
  Pill,
  Calculator
} from 'lucide-react';

export default function GuidanceSection({ 
  setCurrentTab, 
  setSelectedProductForCart, 
  setIsCartOpen 
}) {
  const [selectedSpeciesId, setSelectedSpeciesId] = useState('vannamei');
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [diseaseSearchTerm, setDiseaseSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  
  // Aeration & Feed Calculator State
  const [calcBiomass, setCalcBiomass] = useState(5000);
  const [calcTemp, setCalcTemp] = useState(29);

  const currentSpecies = SPECIES_GUIDES.find(s => s.id === selectedSpeciesId) || SPECIES_GUIDES[0];

  // Filtering diseases
  const filteredDiseases = DISEASE_CATALOG.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(diseaseSearchTerm.toLowerCase()) ||
      d.symptoms.some(sym => sym.toLowerCase().includes(diseaseSearchTerm.toLowerCase())) ||
      d.causes.toLowerCase().includes(diseaseSearchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'ALL' || d.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  // Calculate Aerator HP Needed (Rule of thumb: 1 HP per 350-400 kg biomass for vannamei at 28-30°C)
  const requiredHP = Math.max(2, Math.round((calcBiomass / 380) * (calcTemp > 30 ? 1.15 : 1.0)));
  const dailyFeedKg = Math.round(calcBiomass * (calcBiomass < 2000 ? 0.045 : 0.028));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 17, 31, 0.9) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-cyan">Expert Aquaculture Advisory</span>
          <span className="badge badge-emerald">Scientifically Verified</span>
        </div>
        <h1 style={{ fontSize: '2.1rem', marginBottom: '8px' }}>Crop Cultivation Guidance & Disease Diagnosis</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '800px', fontSize: '0.98rem' }}>
          Comprehensive step-by-step SOPs (Standard Operating Procedures) for shrimp and fish farming. 
          Master water quality, feeding schedules, molting nutrition, and diagnose aquatic symptoms immediately.
        </p>
      </div>

      {/* Species Selector Tabs */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>
          Select Aquaculture Species:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {SPECIES_GUIDES.map(sp => {
            const isSelected = sp.id === selectedSpeciesId;
            return (
              <div
                key={sp.id}
                onClick={() => {
                  setSelectedSpeciesId(sp.id);
                  setActiveStageIndex(0);
                }}
                className="glass-panel"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--cyan)' : 'var(--border-subtle)',
                  background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-card)',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  boxShadow: isSelected ? 'var(--shadow-cyan)' : 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ fontSize: '2rem' }}>{sp.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: isSelected ? 'var(--cyan)' : 'var(--text-main)' }}>
                    {sp.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {sp.category} • {sp.cropDuration}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Water & Pond Optimum Thresholds for Current Species */}
      <div className="glass-panel" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--cyan)" />
          Optimum Water Quality Thresholds for {currentSpecies.name}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Optimum Temperature</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginTop: '2px' }}>{currentSpecies.optimumTemp}</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salinity Range</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--cyan)', marginTop: '2px' }}>{currentSpecies.optimumSalinity}</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target pH</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', marginTop: '2px' }}>{currentSpecies.optimumPH}</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dissolved Oxygen (DO)</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>{currentSpecies.optimumDO}</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stocking Density</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{currentSpecies.stockingDensity}</div>
          </div>
          <div style={{ background: 'var(--bg-surface)', padding: '12px 16px', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Harvest Size</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a78bfa', marginTop: '2px' }}>{currentSpecies.targetHarvestSize}</div>
          </div>
        </div>
      </div>

      {/* Stage-by-Stage Cultivation Protocols */}
      <div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Crop Stage SOPs & Checklist</h3>
        
        {/* Stage Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
          {currentSpecies.stages.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStageIndex(idx)}
              className={`nav-tab-btn ${activeStageIndex === idx ? 'active' : ''}`}
              style={{ whiteSpace: 'nowrap', padding: '10px 18px', fontSize: '0.88rem' }}
            >
              Stage {idx + 1}: {st.stage.split('(')[0]}
            </button>
          ))}
        </div>

        {/* Selected Stage Detail Card */}
        {currentSpecies.stages[activeStageIndex] && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h4 style={{ fontSize: '1.3rem', color: 'var(--cyan)' }}>
                {currentSpecies.stages[activeStageIndex].stage}
              </h4>
              <span className="badge badge-emerald">Mandatory Protocol</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {currentSpecies.stages[activeStageIndex].tasks.map((task, tIdx) => (
                <div 
                  key={tIdx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px', 
                    background: 'var(--bg-surface)', 
                    padding: '12px 16px', 
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <CheckCircle size={18} color="var(--emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{task}</span>
                </div>
              ))}
            </div>

            {/* Pro Tip Callout */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '10px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <Sparkles size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#fbbf24', fontSize: '0.9rem' }}>Agronomist & Scientist Pro-Tip:</strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '2px' }}>
                  {currentSpecies.stages[activeStageIndex].proTip}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Aeration & Feeding Calculator Widget */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '8px', borderRadius: '8px' }}>
            <Calculator size={22} color="var(--cyan)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Smart Aeration & Daily Feed Estimator</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Calculate paddle-wheel horsepower and feeding table based on actual biomass.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Estimated Pond Biomass: <strong style={{ color: 'var(--text-main)' }}>{calcBiomass.toLocaleString()} kg</strong>
              </label>
              <input 
                type="range" 
                min="500" 
                max="20000" 
                step="250"
                value={calcBiomass}
                onChange={(e) => setCalcBiomass(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--cyan)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Current Water Temperature: <strong style={{ color: 'var(--text-main)' }}>{calcTemp}°C</strong>
              </label>
              <input 
                type="range" 
                min="24" 
                max="36" 
                step="1"
                value={calcTemp}
                onChange={(e) => setCalcTemp(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--cyan)' }}
              />
            </div>
          </div>

          <div style={{ 
            background: 'var(--bg-surface)', 
            padding: '20px', 
            borderRadius: '12px', 
            border: '1px solid var(--border-glow)',
            display: 'flex',
            justifyContent: 'space-around',
            textAlign: 'center'
          }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Required Aeration</span>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--cyan)' }}>
                {requiredHP} <span style={{ fontSize: '1rem' }}>HP</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10b981' }}>{Math.ceil(requiredHP / 2)} Aerator units (2 HP each)</div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '20px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Estimated Daily Feed</span>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--emerald)' }}>
                {dailyFeedKg} <span style={{ fontSize: '1rem' }}>kg/day</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Split into 4 daily meals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Disease Diagnosis & Symptom Checker Section */}
      <div id="disease-diagnosis" style={{ paddingTop: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-rose">Diagnostic AI Assistant</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Instant Symptom Matcher</span>
            </div>
            <h2 style={{ fontSize: '1.6rem' }}>Aquatic Disease & Symptom Checker</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Notice abnormal swimming, empty gut, or spots? Search below for immediate technical countermeasures.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%', maxWidth: '520px' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input
                type="text"
                placeholder="Search symptom (e.g. white spot, empty gut, fin rot)..."
                value={diseaseSearchTerm}
                onChange={(e) => setDiseaseSearchTerm(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px' }}
              />
            </div>

            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="input-field"
              style={{ width: 'auto', cursor: 'pointer' }}
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
            </select>
          </div>
        </div>

        {/* Disease Cards Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredDiseases.length === 0 ? (
            <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No diseases found matching your search term. Try searching for "white spot", "ammonia", or "EHP".
            </div>
          ) : (
            filteredDiseases.map(disease => (
              <div 
                key={disease.id}
                className="glass-panel"
                style={{ 
                  padding: '24px', 
                  borderLeft: `5px solid ${disease.badgeColor}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span 
                        className="badge" 
                        style={{ 
                          background: `${disease.badgeColor}20`, 
                          color: disease.badgeColor,
                          border: `1px solid ${disease.badgeColor}50`
                        }}
                      >
                        {disease.severity} RISK
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Affected Species: <strong>{disease.species}</strong>
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)' }}>{disease.name}</h3>
                  </div>

                  <button 
                    onClick={() => setCurrentTab('lab')}
                    className="btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                  >
                    Confirm via PCR Test →
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                  {/* Symptoms */}
                  <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fb7185', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={15} /> Key Diagnostic Symptoms:
                    </div>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                      {disease.symptoms.map((sym, sIdx) => (
                        <li key={sIdx}>{sym}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Immediate Emergency Action */}
                  <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={15} /> Emergency Countermeasures:
                    </div>
                    <ul style={{ paddingLeft: '18px', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                      {disease.immediateActions.map((act, aIdx) => (
                        <li key={aIdx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended Treatments & Order Link */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  flexWrap: 'wrap', 
                  gap: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Recommended Medicines:</span>
                    {disease.recommendedMedicines.map((med, mIdx) => (
                      <span key={mIdx} className="badge badge-cyan" style={{ textTransform: 'none' }}>
                        {med}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => setCurrentTab('pharmacy')}
                    className="btn-primary"
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  >
                    <Pill size={14} />
                    <span>Order Medicines Now</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
