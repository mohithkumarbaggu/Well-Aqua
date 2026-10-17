import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  LayoutDashboard, 
  BookOpen, 
  FlaskConical, 
  Pill, 
  TrendingUp, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Truck,
  Droplets,
  Calculator
} from 'lucide-react';

export default function FarmerGuideModal({ isOpen, onClose, setCurrentTab, language = 'en' }) {
  if (!isOpen) return null;

  const [activeStep, setActiveStep] = useState(0);

  const guideSteps = [
    {
      step: '1',
      title: 'Check Daily Pond Health (రోజూ చెరువు పర్యవేక్షణ)',
      icon: <LayoutDashboard size={26} color="#0284c7" />,
      color: '#0284c7',
      tabKey: 'dashboard',
      description: 'Start every morning at 6:00 AM by checking your water parameters.',
      highlights: [
        'Monitor Dissolved Oxygen (DO) - keep above 4.5 ppm to avoid suffocation.',
        'Record feed check-tray clearance (100% clean vs leftover warning).',
        'Check upcoming Full Moon / New Moon molting advisory to prepare minerals in advance.'
      ],
      tip: 'Pro-Tip: If DO is below 4.0 ppm, turn on all paddle-wheel aerators immediately!'
    },
    {
      step: '2',
      title: 'Order Tested Medicines & Probiotics (మందులు & సప్లిమెంట్స్)',
      icon: <Pill size={26} color="#059669" />,
      color: '#059669',
      tabKey: 'pharmacy',
      description: 'Genuine CAA certified aquatic medicines, sanitizers, and gut probiotics.',
      highlights: [
        'Door-to-door express delivery across coastal aquaculture districts.',
        'Use the Dosage Calculator to calculate exact probiotics per hectare.',
        'Apply coupon WELLAQUA10 for 10% instant discount on initial order.'
      ],
      tip: 'Pro-Tip: Always use gut probiotics during high-density molting cycles.'
    },
    {
      step: '3',
      title: 'Book Doorstep Lab Testing (ల్యాబ్ టెస్ట్ స్లాట్ బుకింగ్)',
      icon: <FlaskConical size={26} color="#0284c7" />,
      color: '#0284c7',
      tabKey: 'lab',
      description: 'Never guess water quality. Get certified lab testing without leaving your farm.',
      highlights: [
        'Choose Water (12 parameters), Soil Chemistry, Seed PCR SPF, or Vibrio bacteria tests.',
        'Select "Doorstep Farm Pickup" - our field agent visits your pond with a cold-chain sample icebox.',
        'Track live progress and view the certified lab report with official chemist prescription on your phone.'
      ],
      tip: 'Pro-Tip: Always do a 12-parameter water check 3 days before a major molting cycle.'
    },
    {
      step: '4',
      title: 'Order Medicine & View Harvest P&L (మందులు ఆర్డర్ & పంట ఫలితాలు)',
      icon: <Pill size={26} color="#d97706" />,
      color: '#d97706',
      tabKey: 'pharmacy',
      description: 'Order genuine probiotics and calculate exact dosages for your pond area.',
      highlights: [
        'Use the Smart Dosage Calculator: Slide your pond acres and depth to get exact kg/liter doses.',
        'Order high-grade probiotics (Nitromax), minerals (AquaMin Pro), sanitizers, and test pens.',
        'Track your Feed Conversion Ratio (FCR), Biomass, and Estimated Net Profit in the Performance Report.'
      ],
      tip: 'Pro-Tip: Use coupon code WELLAQUA10 at checkout for a 10% farmer discount!'
    }
  ];

  const current = guideSteps[activeStep];

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 300, padding: '12px' }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          maxWidth: '620px', 
          width: '100%', 
          padding: '24px',
          borderRadius: '16px'
        }}
      >
        {/* Modal Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem' }}>🌾</span>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', lineHeight: 1.2 }}>
                Well Aqua Farmer Guide (రైతు మార్గదర్శి)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                4 Simple steps to manage your aqua farm like a professional
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '6px' }} title="Close Guide">
            <X size={22} />
          </button>
        </div>

        {/* Step Indicator Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '20px' }}>
          {guideSteps.map((g, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              style={{
                padding: '8px 4px',
                borderRadius: '8px',
                border: activeStep === idx ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                background: activeStep === idx ? 'rgba(2, 132, 199, 0.1)' : '#ffffff',
                color: activeStep === idx ? 'var(--cyan)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.78rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                transition: 'var(--transition)'
              }}
            >
              <span>Step {g.step}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                {idx === 0 ? 'Pond Check' : idx === 1 ? 'Crop SOPs' : idx === 2 ? 'Book Lab' : 'Store & P&L'}
              </span>
            </button>
          ))}
        </div>

        {/* Active Step Card */}
        <div style={{
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{
              background: `${current.color}15`,
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {current.icon}
            </div>
            <div>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Step {current.step} of 4</span>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', marginTop: '2px' }}>
                {current.title}
              </h4>
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            {current.description}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {current.highlights.map((hl, hIdx) => (
              <div key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} color="var(--emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ color: 'var(--text-main)', lineHeight: 1.4 }}>{hl}</span>
              </div>
            ))}
          </div>

          {/* Practical Pro-Tip Callout */}
          <div style={{
            background: 'rgba(217, 119, 6, 0.08)',
            borderLeft: '3px solid #d97706',
            borderRadius: '6px',
            padding: '10px 12px',
            fontSize: '0.82rem',
            color: '#92400e',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={16} color="#d97706" style={{ flexShrink: 0 }} />
            <span>{current.tip}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          
          {/* Quick Helpline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Need Help?</span>
            <a 
              href="tel:18004252782"
              style={{ color: 'var(--cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <PhoneCall size={13} /> 1800-425-AQUA
            </a>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {activeStep > 0 && (
              <button
                onClick={() => setActiveStep(prev => prev - 1)}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                Previous
              </button>
            )}

            {activeStep < guideSteps.length - 1 ? (
              <button
                onClick={() => setActiveStep(prev => prev + 1)}
                className="btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                <span>Next Step</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentTab(current.tabKey);
                  onClose();
                }}
                className="btn-emerald"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                <span>Go to App Now</span>
                <ArrowRight size={15} />
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
