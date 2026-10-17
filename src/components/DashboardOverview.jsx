import React, { useState, useEffect } from 'react';
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  ShieldAlert, 
  Sparkles, 
  FlaskConical, 
  Pill, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Activity, 
  Droplets,
  Scale,
  Clock,
  Compass,
  ChevronDown,
  Radio,
  X
} from 'lucide-react';
import { INITIAL_ADMIN_BROADCASTS } from '../data/mockAdminData';

export default function DashboardOverview({ 
  activePond, 
  setCurrentTab, 
  bookings, 
  t,
  onOpenGuide,
  user,
  onOpenReportModal
}) {
  const params = activePond?.waterParameters || {};
  const financials = activePond?.financials || {};

  // Real-time status checks
  const isDOLow = (params.doMorning || 5) < 4.0;
  const isAmmoniaHigh = (params.tan || 0.1) > 0.5;

  const [showMoltingDetails, setShowMoltingDetails] = useState(false);
  const [dismissedBroadcastIds, setDismissedBroadcastIds] = useState(() => {
    try {
      const saved = localStorage.getItem('well_aqua_dismissed_broadcasts');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Read broadcasts dynamically and filter out old mock advisories
  const [broadcasts, setBroadcasts] = useState(() => {
    try {
      const saved = localStorage.getItem('well_aqua_admin_broadcasts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(
            b => b.id !== 'BC-2026-101' && 
                 b.id !== 'BC-2026-102' && 
                 b.id !== 'BC-2026-103' && 
                 !b.title?.toLowerCase().includes('white spot') && 
                 !b.title?.toLowerCase().includes('export subsidy')
          );
          localStorage.setItem('well_aqua_admin_broadcasts', JSON.stringify(cleaned));
          return cleaned;
        }
      }
    } catch (e) {}
    return INITIAL_ADMIN_BROADCASTS;
  });

  const activeBroadcasts = broadcasts.filter(b => b.active && !dismissedBroadcastIds.includes(b.id));

  const handleDismissBroadcast = (id) => {
    const updated = [...dismissedBroadcastIds, id];
    setDismissedBroadcastIds(updated);
    try {
      localStorage.setItem('well_aqua_dismissed_broadcasts', JSON.stringify(updated));
    } catch (e) {}
  };

  const farmerName = user?.name || 'Mohith Kumar Baggu';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Simple Bold Greeting */}
      <div style={{ padding: '4px 2px 0' }}>
        <h1 style={{ 
          fontSize: '1.95rem', 
          fontWeight: 900, 
          color: 'var(--text-main)', 
          margin: 0, 
          letterSpacing: '-0.025em',
          lineHeight: 1.2
        }}>
          Namaste, {farmerName}! 👋
        </h1>
      </div>

      {/* Official Admin Broadcast Advisories */}
      {activeBroadcasts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {activeBroadcasts.map(bc => {
            const isUrgent = bc.priority === 'Urgent';
            return (
              <div
                key={bc.id}
                style={{
                  background: isUrgent 
                    ? 'linear-gradient(135deg, rgba(225, 29, 72, 0.08) 0%, rgba(244, 63, 94, 0.04) 100%)' 
                    : 'linear-gradient(135deg, rgba(217, 119, 6, 0.08) 0%, rgba(245, 158, 11, 0.04) 100%)',
                  border: isUrgent ? '1px solid #fecdd3' : '1px solid #fde68a',
                  borderLeft: isUrgent ? '5px solid #e11d48' : '5px solid #d97706',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: isUrgent ? '#fee2e2' : '#fef3c7',
                    color: isUrgent ? '#e11d48' : '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}>
                    <Radio size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="badge" style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        background: isUrgent ? '#e11d48' : '#d97706',
                        color: '#ffffff',
                        padding: '2px 7px',
                        borderRadius: '4px'
                      }}>
                        {bc.priority} OFFICIAL ADVISORY
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Target: <strong>{bc.targetDistrict}</strong> • {bc.category}
                      </span>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)', marginTop: '4px' }}>
                      {bc.title}
                    </div>

                    <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginTop: '4px', lineHeight: 1.5 }}>
                      {bc.content}
                    </div>

                    <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                      Dispatched by {bc.author || 'Well Aqua Command'} on {bc.date} at {bc.time}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDismissBroadcast(bc.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px'
                  }}
                  title="Dismiss notification"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Notice for new account without custom report data */}
      {(!activePond.hasCustomReport && user?.id !== 'farmer_01') && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.4rem' }}>📝</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                New Batch Ready for {activePond.name}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Enter your real pond water test parameters, stocking counts, and daily feed records to generate live farm charts.
              </div>
            </div>
          </div>

          <button
            onClick={onOpenReportModal}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
          >
            <span>+ Enter My Farm Report Data</span>
          </button>
        </div>
      )}

      {/* 🌕 Upcoming Molting & Lunar Advisory Card (High Priority at Top) */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '16px 20px', 
          background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.45) 0%, #ffffff 100%)',
          border: '1px solid #fde68a',
          borderLeft: '5px solid #d97706',
          borderRadius: '16px',
          boxShadow: '0 4px 18px rgba(217, 119, 6, 0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.15)',
              flexShrink: 0
            }}>
              🌕
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#92400e', margin: 0 }}>
                  Upcoming Molting Phase (Full Moon in 3 Days)
                </h3>
                <span className="badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontSize: '0.7rem', fontWeight: 700 }}>
                  పౌర్ణమి హెచ్చరిక
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#78350f', margin: '2px 0 0 0', fontWeight: 500 }}>
                High mineral demand expected for shell formation.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowMoltingDetails(!showMoltingDetails)}
              style={{
                padding: '7px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#92400e',
                background: '#ffffff',
                border: '1px solid #fde68a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(217, 119, 6, 0.08)'
              }}
            >
              <span>{showMoltingDetails ? 'View Less Details' : 'View More Details'}</span>
              <ChevronDown 
                size={15} 
                style={{ 
                  transform: showMoltingDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} 
              />
            </button>

            <button
              onClick={() => setCurrentTab('pharmacy')}
              className="btn-primary"
              style={{
                padding: '7px 14px',
                fontSize: '0.82rem',
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                border: 'none',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.2)'
              }}
            >
              <Pill size={14} />
              <span>Order Minerals (మందులు)</span>
            </button>
          </div>
        </div>

        {/* Collapsible Action Grid */}
        {showMoltingDetails && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
            gap: '12px',
            paddingTop: '14px',
            marginTop: '14px',
            borderTop: '1px solid rgba(217, 119, 6, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #fef3c7' }}>
              <span style={{ fontSize: '1.1rem', marginTop: '1px' }}>💊</span>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                <strong>Broadcast Minerals:</strong> Apply <strong>AquaMin Pro (15 kg/acre)</strong> 24 hours prior to molting cycle.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #fef3c7' }}>
              <span style={{ fontSize: '1.1rem', marginTop: '1px' }}>⚡</span>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                <strong>Dissolved Oxygen:</strong> Maintain DO above <strong>5.0 ppm overnight</strong>; do not skip aerator hours.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#ffffff', padding: '10px 14px', borderRadius: '10px', border: '1px solid #fef3c7' }}>
              <span style={{ fontSize: '1.1rem', marginTop: '1px' }}>🛡️</span>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                <strong>Handling Caution:</strong> Avoid net sampling or harsh chemical treatments during active molting.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pond Header Card */}
      <div className="glass-panel" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          right: '-20px',
          top: '-20px',
          fontSize: '9rem',
          opacity: 0.05,
          userSelect: 'none',
          pointerEvents: 'none'
        }}>
          🦐
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.9rem', margin: 0 }}>{activePond.name}</h1>
              {activePond.hasCustomReport && (
                <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                  ✓ Live Farm Data
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Area: <strong style={{ color: 'var(--text-main)' }}>{activePond.areaHectares} Hectares ({Math.round(activePond.areaHectares * 2.471)} Acres)</strong> | 
              Stocking Density: <strong style={{ color: 'var(--text-main)' }}>{activePond.densityPL_m2} PL/m²</strong> | 
              Total Seed: <strong style={{ color: 'var(--text-main)' }}>{activePond.stockedPL.toLocaleString()} PL</strong>
            </p>
          </div>

          <div className="pond-header-actions" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={onOpenReportModal}
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #059669, #0284c7)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Enter your authentic pond water test numbers, stocking seed, and feeding data"
            >
              <span>📝 Log Farm Report Data</span>
            </button>
            <button 
              onClick={() => setCurrentTab('lab')} 
              className="btn-secondary"
            >
              <FlaskConical size={16} />
              <span>{t.bookSlotBtn}</span>
            </button>
            <button 
              onClick={() => setCurrentTab('pharmacy')} 
              className="btn-secondary"
            >
              <Pill size={16} />
              <span>{t.orderMedsBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {/* FCR */}
        <div className="glass-panel kpi-card emerald">
          <div className="kpi-title">
            <span>{t.fcr}</span>
            <Scale size={16} color="var(--emerald)" />
          </div>
          <div className="kpi-value">{activePond.fcr}</div>
          <div className="kpi-subtitle">
            <span style={{ color: '#34d399', fontWeight: 600 }}>★ Excellent</span> (Industry avg: 1.45)
          </div>
        </div>

        {/* Survival Rate */}
        <div className="glass-panel kpi-card">
          <div className="kpi-title">
            <span>{t.survivalRate}</span>
            <Activity size={16} color="var(--cyan)" />
          </div>
          <div className="kpi-value">{activePond.estimatedSurvivalRate}%</div>
          <div className="kpi-subtitle">
            Est. Surviving Count: {Math.round(activePond.stockedPL * (activePond.estimatedSurvivalRate / 100)).toLocaleString()}
          </div>
        </div>

        {/* Estimated Biomass */}
        <div className="glass-panel kpi-card">
          <div className="kpi-title">
            <span>{t.biomass}</span>
            <Droplets size={16} color="var(--cyan)" />
          </div>
          <div className="kpi-value">{activePond.estimatedBiomassKg.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 500 }}>kg</span></div>
          <div className="kpi-subtitle">
            Total Feed Given: {activePond.totalFeedGivenKg.toLocaleString()} kg
          </div>
        </div>

        {/* Average Body Weight & ADG */}
        <div className="glass-panel kpi-card amber">
          <div className="kpi-title">
            <span>{t.avgWeight}</span>
            <Sparkles size={16} color="var(--amber)" />
          </div>
          <div className="kpi-value">{activePond.currentAvgWeightGrams} <span style={{ fontSize: '1rem', fontWeight: 500 }}>g</span></div>
          <div className="kpi-subtitle">
            ADG: <strong style={{ color: 'var(--amber)' }}>+{activePond.adg} g/day</strong> | Target: {activePond.targetHarvestWeightGrams}g
          </div>
        </div>
      </div>

      {/* Two Column Layout: Water Chemistry Snapshot & Advisory / Quick Actions */}
      <div className="two-col-grid">
        
        {/* Water Chemistry Real-time Monitor */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FlaskConical size={20} color="var(--cyan)" />
              <h3 style={{ fontSize: '1.2rem' }}>Pond Water Parameters</h3>
            </div>
            <button 
              onClick={() => setCurrentTab('lab')}
              style={{ color: 'var(--cyan)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
            >
              Request Lab Verification <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="params-grid">
            
            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>pH (Morning)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{params.phMorning}</div>
              <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                <CheckCircle2 size={12} /> Optimal (7.5 - 8.5)
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DO (6:00 AM)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isDOLow ? '#f43f5e' : 'var(--text-main)', marginTop: '2px' }}>
                {params.doMorning} <span style={{ fontSize: '0.75rem' }}>ppm</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: isDOLow ? '#f43f5e' : '#10b981', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                {isDOLow ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                {isDOLow ? 'Low Oxygen!' : 'Safe Level (> 4.5)'}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Salinity</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                {params.salinity} <span style={{ fontSize: '0.75rem' }}>ppt</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                <CheckCircle2 size={12} /> Healthy Brackish
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alkalinity</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                {params.alkalinity} <span style={{ fontSize: '0.75rem' }}>ppm</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                <CheckCircle2 size={12} /> High Buffer Capacity
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ammonia (TAN)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: isAmmoniaHigh ? '#f43f5e' : 'var(--text-main)', marginTop: '2px' }}>
                {params.tan} <span style={{ fontSize: '0.75rem' }}>mg/L</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: isAmmoniaHigh ? '#f43f5e' : '#10b981', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                {isAmmoniaHigh ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                {isAmmoniaHigh ? 'Spike Detected' : 'Safe (< 0.5)'}
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nitrite (NO2-)</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                {params.no2} <span style={{ fontSize: '0.75rem' }}>mg/L</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
                <CheckCircle2 size={12} /> Non-toxic
              </div>
            </div>

          </div>

          <div style={{ marginTop: '18px', padding: '12px 16px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: '10px', borderLeft: '3px solid var(--cyan)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0 }}>
              <strong>Water Color & Plankton:</strong> {params.waterColor}. Secchi disc transparency measured at <strong>32 cm</strong>.
            </p>
          </div>
        </div>

        {/* Action Center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Quick Shortcuts */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Farmer Tools & Actions
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              
              <div 
                onClick={() => setCurrentTab('pharmacy')}
                style={{
                  padding: '14px',
                  background: 'var(--bg-surface)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  transition: 'var(--transition)'
                }}
                className="hover-card"
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>💊</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>Aqua Pharmacy Store</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Order probiotics, minerals & feed</div>
              </div>

              <div 
                onClick={() => setCurrentTab('pharmacy')}
                style={{
                  padding: '14px',
                  background: 'var(--bg-surface)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  transition: 'var(--transition)'
                }}
                className="hover-card"
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🧮</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>Dosage Calculator</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Auto-calculate probiotic by acre</div>
              </div>

              <div 
                onClick={() => setCurrentTab('lab')}
                style={{
                  padding: '14px',
                  background: 'var(--bg-surface)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  transition: 'var(--transition)'
                }}
                className="hover-card"
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🚚</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>Doorstep Lab Pickup</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Technician visits pond directly</div>
              </div>

              <div 
                onClick={() => setCurrentTab('performance')}
                style={{
                  padding: '14px',
                  background: 'var(--bg-surface)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  transition: 'var(--transition)'
                }}
                className="hover-card"
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>📊</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>Full Harvest Audit Report</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>P&L, Growth Curves & Grade</div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Active Lab Bookings Status Bar */}
      {bookings && bookings.length > 0 && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--cyan)" />
              Active Lab Tests & Bookings Status
            </h4>
            <button 
              onClick={() => setCurrentTab('lab')}
              style={{ color: 'var(--cyan)', fontSize: '0.85rem', fontWeight: 600 }}
            >
              Manage Bookings →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {bookings.map(b => (
              <div 
                key={b.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-surface)',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{b.serviceTitle}</span>
                    <span className="badge badge-cyan">{b.id}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {b.labName} • Scheduled: <strong>{b.date} ({b.timeSlot})</strong> • {b.mode}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge ${b.statusStep === 4 ? 'badge-emerald' : 'badge-amber'}`}>
                    {b.status}
                  </span>
                  <button 
                    onClick={() => setCurrentTab('lab')}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    Track Sample
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
