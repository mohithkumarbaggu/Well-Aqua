import React from 'react';
import { 
  X, 
  Printer, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  Download, 
  Award, 
  Waves
} from 'lucide-react';

export default function LabReportModal({ report, onClose }) {
  if (!report) return null;

  const summary = report.reportSummary || {
    status: 'OPTIMAL',
    conclusion: 'Water parameters are stable within standard brackish rearing range.',
    testedParameters: [
      { name: 'pH (Morning 7 AM)', result: '7.8', status: 'normal' },
      { name: 'Dissolved Oxygen (DO)', result: '5.2 ppm', status: 'normal' },
      { name: 'Salinity', result: '16.5 ppt', status: 'normal' },
      { name: 'Total Ammonia Nitrogen (TAN)', result: '0.25 mg/L', status: 'normal' },
      { name: 'Nitrite (NO2-)', result: '0.04 mg/L', status: 'normal' },
      { name: 'Total Alkalinity', result: '145 ppm', status: 'normal' },
      { name: 'Total Hardness', result: '3400 ppm', status: 'normal' },
      { name: 'Calcium (Ca++)', result: '310 ppm', status: 'normal' },
      { name: 'Magnesium (Mg++)', result: '950 ppm', status: 'normal' }
    ]
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '780px', 
          padding: '32px',
          background: 'var(--bg-surface)'
        }}
      >
        {/* Top Actions */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-emerald">Certified Laboratory Report</span>
            <span className="badge badge-cyan">{report.id}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={handlePrint}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <button 
              onClick={onClose}
              style={{ color: 'var(--text-muted)', padding: '6px' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Official Lab Certificate Header */}
        <div style={{
          borderBottom: '2px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Waves size={24} color="var(--cyan)" />
              <h2 style={{ fontSize: '1.4rem' }}>{report.labName || 'AquaCare Diagnostic Laboratories'}</h2>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Accredited Aquatic Pathology & Water Chemistry Center • ISO 17025 Certified
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Report No:</div>
            <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{report.id}</strong>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Date: {report.date}</div>
          </div>
        </div>

        {/* Farmer & Sample Metadata */}
        <div style={{
          background: 'var(--bg-deep)',
          padding: '14px 18px',
          borderRadius: '10px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          fontSize: '0.85rem',
          marginBottom: '22px'
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Farm & Pond:</span>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{report.pondName || 'Pond #1'}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Test Panel:</span>
            <div style={{ fontWeight: 600, color: 'var(--cyan)' }}>{report.serviceTitle}</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Sample Mode:</span>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{report.mode || 'Doorstep Pickup'}</div>
          </div>
        </div>

        {/* Tested Parameter Table */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '1.05rem', marginBottom: '10px', color: 'var(--text-main)' }}>
            Analytical Results & Reference Tolerances
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-deep)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Parameter Analyzed</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Observed Value</th>
                  <th style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>Health Status</th>
                </tr>
              </thead>
              <tbody>
                {summary.testedParameters.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--text-main)' }}>{p.name}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-main)' }}>{p.result}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className={`badge ${p.status === 'normal' ? 'badge-emerald' : p.status === 'warning' ? 'badge-amber' : 'badge-rose'}`}>
                        {p.status === 'normal' ? 'Optimal / Pass' : p.status === 'warning' ? 'Warning / High' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lab Conclusion & Agronomist Prescription */}
        <div style={{
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          borderRadius: '10px',
          padding: '16px 20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', fontWeight: 700, fontSize: '0.92rem', marginBottom: '6px' }}>
            <ShieldCheck size={18} />
            Diagnostic Conclusion & Agronomist Prescription:
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
            {summary.conclusion}
          </p>
          <div style={{ marginTop: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <strong>Action Steps:</strong> Maintain 12 HP paddle-wheel aerators from 22:00 to 06:00. Dose <strong>AquaMin Pro (10 kg/acre)</strong> 24h before new moon.
          </div>
        </div>

        {/* Verification Signatures */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingTop: '16px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <div>Analyzed By: <strong>Dr. B. V. Raman, M.F.Sc</strong></div>
            <div style={{ fontSize: '0.74rem' }}>Senior Aquaculture Pathologist</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
              <Award size={16} /> Digitally Signed & Certified
            </div>
            <div style={{ fontSize: '0.74rem' }}>National Aqua Diagnostic Network</div>
          </div>
        </div>

      </div>
    </div>
  );
}
