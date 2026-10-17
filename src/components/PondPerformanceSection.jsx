import React, { useState } from 'react';
import { 
  TrendingUp, 
  Scale, 
  DollarSign, 
  PieChart, 
  Award, 
  Calendar, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Plus, 
  Save, 
  Sparkles,
  ArrowUpRight,
  Droplets
} from 'lucide-react';

export default function PondPerformanceSection({ 
  activePond, 
  setActivePond, 
  ponds 
}) {
  const [logs, setLogs] = useState([
    { date: '2026-10-16', time: '06:30 AM', doVal: 4.8, phVal: 7.8, feedCheck: 'Clean (100% consumed)', mortality: 0 },
    { date: '2026-10-15', time: '06:30 AM', doVal: 4.9, phVal: 7.9, feedCheck: 'Clean (100% consumed)', mortality: 0 },
    { date: '2026-10-14', time: '06:30 AM', doVal: 4.6, phVal: 7.7, feedCheck: 'Slight leftover (5%)', mortality: 2 },
    { date: '2026-10-13', time: '06:30 AM', doVal: 5.1, phVal: 8.0, feedCheck: 'Clean (100% consumed)', mortality: 0 }
  ]);

  // Daily Log Form State
  const [newDO, setNewDO] = useState('4.8');
  const [newPH, setNewPH] = useState('7.9');
  const [newCheckTray, setNewCheckTray] = useState('Clean (100% consumed)');
  const [newMortality, setNewMortality] = useState('0');
  const [logAddedSuccess, setLogAddedSuccess] = useState(false);

  const fin = activePond.financials;
  const history = activePond.historicalDOC;

  const handleAddLog = (e) => {
    e.preventDefault();
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      time: '07:00 AM',
      doVal: parseFloat(newDO),
      phVal: parseFloat(newPH),
      feedCheck: newCheckTray,
      mortality: parseInt(newMortality, 10) || 0
    };
    setLogs([newEntry, ...logs]);
    setLogAddedSuccess(true);
    setTimeout(() => setLogAddedSuccess(false), 3000);
  };

  const handlePrintAudit = () => {
    window.print();
  };

  // SVG Chart Dimensions & Coordinates
  const chartWidth = 620;
  const chartHeight = 220;
  const maxWeight = Math.max(...history.map(h => h.weight)) * 1.25;
  const maxDOC = Math.max(...history.map(h => h.doc)) * 1.15;

  const pointsActual = history.map(h => {
    const x = (h.doc / maxDOC) * (chartWidth - 60) + 40;
    const y = chartHeight - 30 - (h.weight / maxWeight) * (chartHeight - 60);
    return `${x},${y}`;
  }).join(' ');

  // Standard Target Curve (Benchmark for vannamei)
  const standardPoints = [
    { doc: 15, weight: 1.2 },
    { doc: 30, weight: 5.0 },
    { doc: 45, weight: 10.5 },
    { doc: 60, weight: 16.0 },
    { doc: 69, weight: 20.0 }
  ].map(s => {
    const x = (s.doc / maxDOC) * (chartWidth - 60) + 40;
    const y = chartHeight - 30 - (s.weight / maxWeight) * (chartHeight - 60);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 17, 31, 0.9) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-cyan">Crop Intelligence & Analytics</span>
              <span className="badge badge-emerald">Grade A+ High Yield Batch</span>
            </div>
            <h1 style={{ fontSize: '2.1rem', marginBottom: '8px' }}>Pond Performance & Harvest Intelligence</h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '750px', fontSize: '0.98rem' }}>
              Real-time Feed Conversion Ratio (FCR) tracking, Average Daily Growth (ADG), survival curves, 
              cost-benefit P&L forecasts, and comprehensive harvest audit documentation.
            </p>
          </div>

          <button 
            onClick={handlePrintAudit}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <Printer size={16} />
            <span>Print Performance Audit</span>
          </button>
        </div>
      </div>

      {/* Pond Selector Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Active Pond Batch:
        </span>
        {ponds.map(p => (
          <button
            key={p.id}
            onClick={() => setActivePond(p)}
            className={`nav-tab-btn ${activePond.id === p.id ? 'active' : ''}`}
            style={{ padding: '8px 18px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
          >
            {p.name} ({p.species.split(' ')[0]} • DOC {p.doc})
          </button>
        ))}
      </div>

      {/* KPI Performance Metrics */}
      <div className="kpi-grid">
        <div className="glass-panel kpi-card emerald">
          <div className="kpi-title">
            <span>Feed Conversion (FCR)</span>
            <Scale size={16} color="var(--emerald)" />
          </div>
          <div className="kpi-value">{activePond.fcr}</div>
          <div className="kpi-subtitle">
            <strong style={{ color: '#34d399' }}>Grade A Efficiency</strong> (Consuming {activePond.fcr} kg feed/kg meat)
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-title">
            <span>Survival Rate</span>
            <Activity size={16} color="var(--cyan)" />
          </div>
          <div className="kpi-value">{activePond.estimatedSurvivalRate}%</div>
          <div className="kpi-subtitle">
            Surviving count: {Math.round(activePond.stockedPL * (activePond.estimatedSurvivalRate / 100)).toLocaleString()} pcs
          </div>
        </div>

        <div className="glass-panel kpi-card">
          <div className="kpi-title">
            <span>Current Total Biomass</span>
            <Droplets size={16} color="var(--cyan)" />
          </div>
          <div className="kpi-value">{activePond.estimatedBiomassKg.toLocaleString()} <span style={{ fontSize: '1rem' }}>kg</span></div>
          <div className="kpi-subtitle">
            Stocking Density: {activePond.densityPL_m2} PL/m²
          </div>
        </div>

        <div className="glass-panel kpi-card amber">
          <div className="kpi-title">
            <span>Growth Rate (ADG)</span>
            <Sparkles size={16} color="var(--amber)" />
          </div>
          <div className="kpi-value">+{activePond.adg} <span style={{ fontSize: '1rem' }}>g/day</span></div>
          <div className="kpi-subtitle">
            Avg Body Weight: <strong style={{ color: 'var(--text-main)' }}>{activePond.currentAvgWeightGrams} grams</strong>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Growth Curve & Financial P&L Breakdown */}
      <div className="two-col-grid">
        
        {/* Dynamic Growth Curve Chart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={20} color="var(--cyan)" />
                Shrimp Growth Curve vs Benchmark
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Comparing pond actual sampling weight against standard growth model.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--cyan)' }}>
                ● Actual Pond
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8' }}>
                ┄ Standard Target
              </span>
            </div>
          </div>

          {/* SVG Vector Line Chart */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', background: 'var(--bg-deep)', borderRadius: '10px' }}>
              {/* Grid Lines */}
              <line x1="40" y1="30" x2={chartWidth - 20} y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="40" y1="85" x2={chartWidth - 20} y2="85" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="40" y1="140" x2={chartWidth - 20} y2="140" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="40" y1={chartHeight - 30} x2={chartWidth - 20} y2={chartHeight - 30} stroke="rgba(255,255,255,0.2)" />
              <line x1="40" y1="20" x2="40" y2={chartHeight - 30} stroke="rgba(255,255,255,0.2)" />

              {/* Y Axis Labels */}
              <text x="10" y="35" fill="var(--text-dim)" fontSize="10">25g</text>
              <text x="10" y="90" fill="var(--text-dim)" fontSize="10">15g</text>
              <text x="10" y="145" fill="var(--text-dim)" fontSize="10">8g</text>
              <text x="10" y={chartHeight - 30} fill="var(--text-dim)" fontSize="10">0g</text>

              {/* Benchmark Target Curve */}
              <polyline
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeDasharray="4 4"
                points={standardPoints}
              />

              {/* Actual Pond Curve with Glowing Area */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3.5"
                points={pointsActual}
              />

              {/* Data Point Dots */}
              {history.map((h, i) => {
                const cx = (h.doc / maxDOC) * (chartWidth - 60) + 40;
                const cy = chartHeight - 30 - (h.weight / maxWeight) * (chartHeight - 60);
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="5" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                    <text x={cx} y={cy - 10} fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle">
                      {h.weight}g
                    </text>
                    <text x={cx} y={chartHeight - 14} fill="var(--text-dim)" fontSize="10" textAnchor="middle">
                      DOC {h.doc}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>Stocking: <strong>Day 1 (PL 10)</strong></span>
            <span>Current: <strong style={{ color: 'var(--cyan)' }}>DOC {activePond.doc} ({activePond.currentAvgWeightGrams}g)</strong></span>
            <span>Target: <strong style={{ color: '#10b981' }}>{activePond.targetHarvestWeightGrams}g (~30 count)</strong></span>
          </div>
        </div>

        {/* Financial P&L & Harvest ROI Forecast */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={20} color="var(--emerald)" />
              Harvest Financials & ROI Intelligence
            </h3>
            <span className="badge badge-emerald">ROI +{fin.roiPercent}%</span>
          </div>

          {/* Revenue vs Investment Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Crop Investment</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                ₹{fin.totalInvestment.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Seed, feed, power, minerals</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Projected Harvest Revenue</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
                ₹{fin.projectedRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#34d399' }}>At ₹320/kg for 30 count</div>
            </div>
          </div>

          {/* Projected Net Profit Highlight */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Estimated Net Farmer Profit
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#10b981' }}>
                ₹{fin.projectedNetProfit.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.85rem' }}>
                Profit Margin: {Math.round((fin.projectedNetProfit / fin.projectedRevenue) * 100)}%
              </span>
            </div>
          </div>

          {/* Cost Distribution Breakdown */}
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Pellet Feed ({activePond.totalFeedGivenKg.toLocaleString()} kg):</span>
              <strong style={{ color: 'var(--text-main)' }}>₹{fin.feedCost.toLocaleString()} (68%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>SPF Seed Post-Larvae:</span>
              <strong style={{ color: 'var(--text-main)' }}>₹{fin.seedCost.toLocaleString()} (11%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Probiotics, Minerals & Chemicals:</span>
              <strong style={{ color: 'var(--text-main)' }}>₹{fin.probioticsMineralsCost.toLocaleString()} (9%)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Electricity & Aeration Diesel:</span>
              <strong style={{ color: 'var(--text-main)' }}>₹{fin.electricityFuelCost.toLocaleString()} (7%)</strong>
            </div>
          </div>

        </div>

      </div>

      {/* Daily Pond Feeding & Water Monitoring Log */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Daily Pond Log & Feed Check Tray Records</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Log morning DO, pH, and check-tray clearance to detect health issues early.
            </p>
          </div>
          {logAddedSuccess && (
            <span className="badge badge-emerald" style={{ fontSize: '0.82rem' }}>
              ✓ Daily Reading Recorded Successfully!
            </span>
          )}
        </div>

        {/* Quick Log Entry Form */}
        <form onSubmit={handleAddLog} style={{
          background: 'var(--bg-surface)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          alignItems: 'flex-end',
          marginBottom: '20px'
        }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Morning DO (ppm):
            </label>
            <input 
              type="number"
              step="0.1"
              value={newDO}
              onChange={(e) => setNewDO(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Water pH:
            </label>
            <input 
              type="number"
              step="0.1"
              value={newPH}
              onChange={(e) => setNewPH(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Check Tray Clearance:
            </label>
            <select
              value={newCheckTray}
              onChange={(e) => setNewCheckTray(e.target.value)}
              className="input-field"
            >
              <option value="Clean (100% consumed)">Clean (100% consumed)</option>
              <option value="Good (90% consumed)">Good (90% consumed)</option>
              <option value="Leftover feed (20%)">Leftover feed (20%)</option>
              <option value="Feed refused (50%+)">Feed refused (50%+ Alert)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Mortalities Found:
            </label>
            <input 
              type="number"
              min="0"
              value={newMortality}
              onChange={(e) => setNewMortality(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            style={{ padding: '10px 16px', fontSize: '0.88rem' }}
          >
            <Save size={16} />
            <span>Save Log</span>
          </button>
        </form>

        {/* Recent Logs Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-deep)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Date & Time</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Dissolved Oxygen</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Water pH</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Feed Check Tray</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Mortality</th>
                <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, lIdx) => (
                <tr key={lIdx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {log.date} <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({log.time})</span>
                  </td>
                  <td style={{ padding: '10px 12px', color: log.doVal < 4.0 ? '#f43f5e' : 'var(--text-main)', fontWeight: 600 }}>
                    {log.doVal} ppm
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-main)' }}>{log.phVal}</td>
                  <td style={{ padding: '10px 12px', color: log.feedCheck.includes('refused') ? '#f43f5e' : '#34d399' }}>
                    {log.feedCheck}
                  </td>
                  <td style={{ padding: '10px 12px', color: log.mortality > 0 ? '#fbbf24' : 'var(--text-muted)' }}>
                    {log.mortality} pcs
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span className={`badge ${log.mortality === 0 && log.doVal >= 4.5 ? 'badge-emerald' : 'badge-amber'}`}>
                      {log.mortality === 0 && log.doVal >= 4.5 ? 'Optimal' : 'Attention'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
