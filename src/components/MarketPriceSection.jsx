import React, { useState, useMemo } from 'react';
import { 
  MARKET_LOCATIONS, 
  getMarketPricesForLocation,
  getCountWiseRatesForLocation
} from '../data/marketPricesData';
import { 
  ArrowLeft,
  MapPin, 
  Calculator, 
  PhoneCall, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles, 
  CheckCircle2, 
  ChevronDown,
  Fish,
  Waves,
  Calendar,
  Share2
} from 'lucide-react';

export default function MarketPriceSection({ user, setCurrentTab }) {
  // Determine default location matching user's registered location if possible
  const defaultLocId = useMemo(() => {
    try {
      const saved = localStorage.getItem('well_aqua_market_location');
      if (saved && MARKET_LOCATIONS.some(l => l.id === saved)) return saved;
    } catch (e) {}

    if (user?.location) {
      const lower = user.location.toLowerCase();
      const matched = MARKET_LOCATIONS.find(l => 
        lower.includes(l.district.toLowerCase()) || 
        lower.includes(l.id) || 
        lower.includes(l.name.toLowerCase().split(' ')[0])
      );
      if (matched) return matched.id;
    }
    return 'bhimavaram';
  }, [user]);

  const [selectedLocation, setSelectedLocation] = useState(defaultLocId);
  const [activeTab, setActiveTab] = useState('prawn'); // 'prawn' | 'fish'
  
  // Selected count for calculator
  const [selectedCountItem, setSelectedCountItem] = useState({ count: '40', rateNum: 455 });
  const [calcBiomassKg, setCalcBiomassKg] = useState(2500);

  // Save selected location
  const handleLocationChange = (locId) => {
    setSelectedLocation(locId);
    try {
      localStorage.setItem('well_aqua_market_location', locId);
    } catch (e) {}
  };

  const currentLocObj = MARKET_LOCATIONS.find(l => l.id === selectedLocation) || MARKET_LOCATIONS[0];

  // Exact count rates computed for selected location
  const countRates = useMemo(() => {
    return getCountWiseRatesForLocation(selectedLocation);
  }, [selectedLocation]);

  // Fish rates computed for selected location
  const fishRates = useMemo(() => {
    const all = getMarketPricesForLocation(selectedLocation);
    return all.filter(p => p.category === 'fish');
  }, [selectedLocation]);

  // Calculate gross payout
  const activeRate = selectedCountItem?.rateNum || 455;
  const totalPayout = Math.round(activeRate * Number(calcBiomassKg || 0));

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '100%', 
      maxWidth: '560px', 
      margin: '0 auto', 
      paddingBottom: '40px' 
    }}>
      
      {/* 1. Mandi Location & Date Bar */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '10px 14px',
        marginBottom: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '220px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(2, 132, 199, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00629b'
          }}>
            <MapPin size={17} />
          </div>

          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
              Mandi Market Location:
            </span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  color: '#0f172a',
                  cursor: 'pointer',
                  outline: 'none',
                  paddingRight: '20px',
                  width: '100%',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              >
                {MARKET_LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} {loc.isBenchmark ? '⭐ (Benchmark Mandi)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color="#64748b" style={{ position: 'absolute', right: 0, pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(16, 185, 129, 0.1)',
          color: '#059669',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.72rem',
          fontWeight: 800
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
          <span>TODAY LIVE</span>
        </div>
      </div>

      {/* 2. Category Switcher: Prawn Counts vs Fish Rates */}
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: '#e2e8f0',
        padding: '4px',
        borderRadius: '12px',
        marginBottom: '16px'
      }}>
        <button
          onClick={() => setActiveTab('prawn')}
          style={{
            padding: '9px 12px',
            border: 'none',
            borderRadius: '9px',
            background: activeTab === 'prawn' ? '#005d8f' : 'transparent',
            color: activeTab === 'prawn' ? '#ffffff' : '#475569',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: activeTab === 'prawn' ? '0 2px 6px rgba(0, 93, 143, 0.3)' : 'none'
          }}
        >
          <span>🦐 Prawn Count Rates</span>
        </button>

        <button
          onClick={() => setActiveTab('fish')}
          style={{
            padding: '9px 12px',
            border: 'none',
            borderRadius: '9px',
            background: activeTab === 'fish' ? '#005d8f' : 'transparent',
            color: activeTab === 'fish' ? '#ffffff' : '#475569',
            fontWeight: 800,
            fontSize: '0.86rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: activeTab === 'fish' ? '0 2px 6px rgba(0, 93, 143, 0.3)' : 'none'
          }}
        >
          <span>🐟 Fish Mandi Rates</span>
        </button>
      </div>

      {/* 3. The Exact Mobile Table Card (Matching User Screenshot) */}
      <div style={{
        width: '100%',
        background: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Header Bar matching image: Deep Blue background with Back Arrow & Title */}
        <div style={{
          background: '#005d8f',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#ffffff'
        }}>
          <button
            onClick={() => setCurrentTab && setCurrentTab('dashboard')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: 0
            }}
            title="Back to Dashboard"
          >
            <ArrowLeft size={22} color="#ffffff" />
          </button>

          <h2 style={{
            fontSize: '1.18rem',
            fontWeight: 700,
            margin: 0,
            color: '#ffffff',
            letterSpacing: '-0.01em'
          }}>
            {activeTab === 'prawn' ? 'Prawn Count-wise Rates' : 'Fish Mandi Spot Rates'}
          </h2>
        </div>

        {/* Rows List */}
        <div>
          {activeTab === 'prawn' ? (
            // Prawn Counts List
            countRates.map((item, index) => {
              const isEven = index % 2 === 1; // Alternating soft light-blue stripe
              const isSelected = selectedCountItem?.count === item.count;

              return (
                <div
                  key={item.count}
                  onClick={() => {
                    if (item.rateNum) {
                      setSelectedCountItem(item);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isSelected 
                      ? 'rgba(2, 132, 199, 0.12)' 
                      : (isEven ? '#f0f7fd' : '#ffffff'),
                    padding: '13px 20px',
                    borderBottom: index === countRates.length - 1 ? 'none' : '1px solid #f1f5f9',
                    cursor: item.rateNum ? 'pointer' : 'default',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Left Column: Count */}
                  <div style={{
                    width: '45%',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    paddingLeft: '16px'
                  }}>
                    {item.count}
                  </div>

                  {/* Middle Vertical Divider */}
                  <div style={{
                    width: '1px',
                    height: '24px',
                    background: '#cbd5e1',
                    opacity: 0.6
                  }}></div>

                  {/* Right Column: Rate */}
                  <div style={{
                    width: '55%',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#005d8f',
                    paddingLeft: '32px',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {item.rate}
                  </div>
                </div>
              );
            })
          ) : (
            // Commercial Fish Rates List
            fishRates.map((fish, index) => {
              const isEven = index % 2 === 1;
              const isSelected = selectedCountItem?.grade === fish.grade;

              return (
                <div
                  key={fish.id}
                  onClick={() => {
                    setSelectedCountItem({ count: fish.species, rateNum: fish.currentPrice, grade: fish.grade });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isSelected 
                      ? 'rgba(2, 132, 199, 0.12)' 
                      : (isEven ? '#f0f7fd' : '#ffffff'),
                    padding: '13px 20px',
                    borderBottom: index === fishRates.length - 1 ? 'none' : '1px solid #f1f5f9',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                >
                  {/* Left Column: Fish name & size */}
                  <div style={{
                    width: '55%',
                    paddingLeft: '12px'
                  }}>
                    <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#1e293b' }}>
                      {fish.species.split('(')[0]}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {fish.grade}
                    </div>
                  </div>

                  {/* Middle Vertical Divider */}
                  <div style={{
                    width: '1px',
                    height: '24px',
                    background: '#cbd5e1',
                    opacity: 0.6
                  }}></div>

                  {/* Right Column: Rate */}
                  <div style={{
                    width: '45%',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#005d8f',
                    paddingLeft: '24px',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    ₹{fish.currentPrice} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>/ kg</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Quick Harvest Revenue Calculator (Integrated directly below) */}
      <div style={{
        width: '100%',
        background: '#ffffff',
        borderRadius: '16px',
        border: '1.5px solid #005d8f',
        padding: '18px 20px',
        marginTop: '18px',
        boxShadow: '0 4px 16px rgba(0, 93, 143, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={18} color="#005d8f" />
            <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
              Pond Harvest Payout Calculator
            </h4>
          </div>
          <span style={{ fontSize: '0.74rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
            {selectedCountItem?.count ? `${selectedCountItem.count} Count` : '40 Count'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Estimated Biomass (kg):
            </label>
            <input
              type="number"
              step="50"
              min="50"
              value={calcBiomassKg}
              onChange={(e) => setCalcBiomassKg(Math.max(0, Number(e.target.value)))}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                fontWeight: 800,
                color: '#0f172a'
              }}
              placeholder="e.g. 2500"
            />
          </div>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '8px 12px',
            textAlign: 'right'
          }}>
            <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
              Estimated Realization
            </span>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#005d8f', lineHeight: 1.1 }}>
              ₹ {totalPayout.toLocaleString('en-IN')}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {calcBiomassKg} kg @ ₹{activeRate}/kg
            </span>
          </div>
        </div>
      </div>

      {/* 5. Contact Buyers & Weigh-Bridge Hotline */}
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginTop: '14px'
      }}>
        <a
          href="tel:18004252782"
          style={{
            height: '44px',
            borderRadius: '10px',
            background: '#005d8f',
            color: '#ffffff',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontWeight: 800,
            fontSize: '0.84rem',
            boxShadow: '0 3px 10px rgba(0, 93, 143, 0.25)'
          }}
        >
          <PhoneCall size={15} />
          <span>Call Market Desk</span>
        </a>

        <a
          href="https://wa.me/919440122334?text=Hello%20Well%20Aqua,%20I%20want%20to%20know%20today's%20shrimp%20harvest%20prices%20for%20my%20farm."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            height: '44px',
            borderRadius: '10px',
            background: '#10b981',
            color: '#ffffff',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontWeight: 800,
            fontSize: '0.84rem',
            boxShadow: '0 3px 10px rgba(16, 185, 129, 0.25)'
          }}
        >
          <MessageSquare size={15} />
          <span>WhatsApp Buyers</span>
        </a>
      </div>

    </div>
  );
}
