import React, { useState, useMemo } from 'react';
import { 
  MARKET_LOCATIONS, 
  getMarketPricesForLocation 
} from '../data/marketPricesData';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  MapPin, 
  Search, 
  PhoneCall, 
  Calculator, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  ChevronRight,
  Fish,
  Waves,
  ArrowUpRight,
  Clock
} from 'lucide-react';

export default function LiveMarketPrices({ userLocation = '' }) {
  // Determine default location matching user's registered location if possible
  const defaultLocId = useMemo(() => {
    try {
      const saved = localStorage.getItem('well_aqua_market_location');
      if (saved && MARKET_LOCATIONS.some(l => l.id === saved)) return saved;
    } catch (e) {}

    if (userLocation) {
      const lower = userLocation.toLowerCase();
      const matched = MARKET_LOCATIONS.find(l => 
        lower.includes(l.district.toLowerCase()) || 
        lower.includes(l.id) || 
        lower.includes(l.name.toLowerCase().split(' ')[0])
      );
      if (matched) return matched.id;
    }
    return 'bhimavaram';
  }, [userLocation]);

  const [selectedLocation, setSelectedLocation] = useState(defaultLocId);
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'prawn' | 'fish'
  const [searchQuery, setSearchQuery] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);

  // Calculator State
  const [calcProductId, setCalcProductId] = useState('van-30');
  const [calcBiomassKg, setCalcBiomassKg] = useState(2500);

  // Save selected location
  const handleLocationChange = (locId) => {
    setSelectedLocation(locId);
    try {
      localStorage.setItem('well_aqua_market_location', locId);
    } catch (e) {}
  };

  // Get products adjusted for selected location
  const products = useMemo(() => {
    return getMarketPricesForLocation(selectedLocation);
  }, [selectedLocation]);

  const currentLocObj = MARKET_LOCATIONS.find(l => l.id === selectedLocation) || MARKET_LOCATIONS[0];

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCat = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch = 
        p.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.speciesTelugu && p.speciesTelugu.includes(searchQuery)) ||
        (p.count && String(p.count).includes(searchQuery));
      return matchesCat && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Selected product for calculator
  const calcProduct = products.find(p => p.id === calcProductId) || products[0];
  const totalCalculatedPayout = calcProduct ? Math.round(calcProduct.currentPrice * Number(calcBiomassKg || 0)) : 0;

  // Key highlights
  const van30 = products.find(p => p.id === 'van-30');
  const van40 = products.find(p => p.id === 'van-40');
  const van100 = products.find(p => p.id === 'van-100');
  const seabass = products.find(p => p.id === 'fish-seabass');

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      borderRadius: '20px',
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.02) 0%, rgba(2, 132, 199, 0.04) 100%)',
      border: '1px solid rgba(2, 132, 199, 0.25)',
      boxShadow: '0 8px 32px rgba(2, 132, 199, 0.06)'
    }}>
      
      {/* 1. Header Bar with Live Indicator & Location Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid #10b981',
              color: '#059669',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
                animation: 'pulse 1.8s infinite'
              }}></span>
              Live Mandi Spot Rates
            </span>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} />
              <span>Today's Official Rates (రోజూవారీ మార్కెట్ ధరలు)</span>
            </span>
          </div>

          <h2 style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            color: 'var(--text-main)',
            margin: '8px 0 2px 0',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🦐 Prawn & Fish Live Market Prices
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Real-time farm-gate spot prices per kg across coastal processing mandis and auction yards.
          </p>
        </div>

        {/* Location Dropdown Picker */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--bg-surface)',
          padding: '8px 14px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <MapPin size={18} color="#0284c7" />
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Selected Market Hub
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.92rem',
                color: 'var(--text-main)',
                cursor: 'pointer',
                outline: 'none',
                padding: '2px 0'
              }}
            >
              {MARKET_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} {loc.isBenchmark ? '⭐ (Benchmark Mandi)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Benchmark Quick Snapshot Pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {van30 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(2, 132, 199, 0.02) 100%)',
            border: '1px solid rgba(2, 132, 199, 0.25)',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>🦐 Vannamei 30 Count</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0284c7', marginTop: '2px' }}>
                ₹{van30.currentPrice} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/ kg</span>
              </div>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
              ▲ +₹{van30.change}
            </span>
          </div>
        )}

        {van40 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>🦐 Vannamei 40 Count</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#059669', marginTop: '2px' }}>
                ₹{van40.currentPrice} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/ kg</span>
              </div>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
              ▲ +₹{van40.change}
            </span>
          </div>
        )}

        {van100 && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>🦐 Vannamei 100 Count</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>
                ₹{van100.currentPrice} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/ kg</span>
              </div>
            </div>
            <span className="badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', fontSize: '0.72rem', fontWeight: 800 }}>
              — Steady
            </span>
          </div>
        )}

        {seabass && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(147, 51, 234, 0.02) 100%)',
            border: '1px solid rgba(147, 51, 234, 0.25)',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>🐟 Pandugappa (Seabass)</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#7c3aed', marginTop: '2px' }}>
                ₹{seabass.currentPrice} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/ kg</span>
              </div>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.72rem', fontWeight: 800 }}>
              ▲ +₹{seabass.change}
            </span>
          </div>
        )}
      </div>

      {/* 3. Filter Tabs & Search Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '18px'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '20px',
              border: activeCategory === 'all' ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)',
              background: activeCategory === 'all' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-surface)',
              color: activeCategory === 'all' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            ⭐ All Rates ({products.length})
          </button>

          <button
            onClick={() => setActiveCategory('prawn')}
            style={{
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '20px',
              border: activeCategory === 'prawn' ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)',
              background: activeCategory === 'prawn' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-surface)',
              color: activeCategory === 'prawn' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🦐 Prawns & Shrimp (రొయ్యలు)</span>
          </button>

          <button
            onClick={() => setActiveCategory('fish')}
            style={{
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '20px',
              border: activeCategory === 'fish' ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)',
              background: activeCategory === 'fish' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-surface)',
              color: activeCategory === 'fish' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🐟 Commercial Fishes (చేపలు)</span>
          </button>
        </div>

        {/* Right Tools: Search & Calculator Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Filter count or fish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ width: '100%', paddingLeft: '32px', paddingRight: '10px', fontSize: '0.82rem', borderRadius: '10px' }}
            />
          </div>

          <button
            onClick={() => setShowCalculator(!showCalculator)}
            style={{
              padding: '7px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '10px',
              border: '1px solid #bae6fd',
              background: showCalculator ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'rgba(2, 132, 199, 0.08)',
              color: showCalculator ? '#ffffff' : '#0284c7',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <Calculator size={15} />
            <span>{showCalculator ? 'Close Calculator' : '🧮 Payout Calculator'}</span>
          </button>
        </div>
      </div>

      {/* 4. Interactive Live Harvest Value Calculator (Expandable) */}
      {showCalculator && (
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)',
          color: '#ffffff',
          padding: '20px 24px',
          borderRadius: '16px',
          marginBottom: '22px',
          boxShadow: '0 8px 24px rgba(2, 132, 199, 0.25)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={20} color="#38bdf8" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Harvest Payout & Mandi Revenue Calculator (దిగుబడి ఆదాయం)
              </h3>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#bae6fd', background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '20px' }}>
              Spot Rates: {currentLocObj.name}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}>
            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Select Species / Count:
              </label>
              <select
                value={calcProductId}
                onChange={(e) => setCalcProductId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              >
                {products.map(p => (
                  <option key={p.id} value={p.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                    {p.species} — {p.grade} (₹{p.currentPrice}/kg)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                Estimated Harvest Biomass (kg):
              </label>
              <input
                type="number"
                step="50"
                min="100"
                value={calcBiomassKg}
                onChange={(e) => setCalcBiomassKg(Math.max(0, Number(e.target.value)))}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '14px 18px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '0.74rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 700 }}>
                Estimated Gross Mandi Revenue
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px', lineHeight: 1.2 }}>
                ₹ {totalCalculatedPayout.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '3px' }}>
                {calcBiomassKg} kg @ ₹{calcProduct?.currentPrice}/kg in {currentLocObj.district}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Live Spot Rate Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px'
      }}>
        {filteredProducts.map(product => {
          const isUp = product.direction === 'up';
          const isDown = product.direction === 'down';

          return (
            <div
              key={product.id}
              style={{
                background: 'var(--bg-surface)',
                borderRadius: '14px',
                padding: '16px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                transition: 'var(--transition)'
              }}
              className="hover-card"
            >
              <div>
                {/* Header: Title and Category badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '1.02rem', fontWeight: 900, color: 'var(--text-main)' }}>
                      {product.grade}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--cyan)', fontWeight: 600, marginTop: '2px' }}>
                      {product.species} • {product.speciesTelugu}
                    </div>
                  </div>

                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    background: isUp ? 'rgba(16, 185, 129, 0.12)' : isDown ? 'rgba(225, 29, 72, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                    color: isUp ? '#059669' : isDown ? '#e11d48' : '#d97706',
                    border: isUp ? '1px solid #10b981' : isDown ? '1px solid #f43f5e' : '1px solid #f59e0b'
                  }}>
                    {isUp && <TrendingUp size={12} />}
                    {isDown && <TrendingDown size={12} />}
                    {!isUp && !isDown && <Minus size={12} />}
                    <span>{isUp ? `+₹${product.change}` : isDown ? `-₹${Math.abs(product.change)}` : 'Stable'}</span>
                  </span>
                </div>

                {/* Big Price Tag */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '14px' }}>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                    ₹ {product.currentPrice}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    / {product.unit}
                  </span>
                </div>

                {/* Range & Demand */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <span>Mandi Range: <strong>₹{product.minPrice} - ₹{product.maxPrice}</strong></span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>{product.demand}</span>
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.78rem'
              }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>
                  📍 {currentLocObj.district}
                </span>

                <button
                  onClick={() => {
                    setCalcProductId(product.id);
                    setShowCalculator(true);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0284c7',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  <span>Estimate Total</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* 6. Harvest Booking Hotline Card */}
      <div style={{
        marginTop: '20px',
        padding: '14px 18px',
        borderRadius: '12px',
        background: 'rgba(2, 132, 199, 0.05)',
        border: '1px dashed #38bdf8',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>📞</span>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Looking to Sell Harvest or Lock Spot Mandi Contract? (రొయ్యల అమ్మకం & కొనుగోలు)
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Get connected directly with verified processing plants, export cold chains, and local weigh-bridge buyers in {currentLocObj.district}.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a
            href="tel:18004252782"
            style={{
              padding: '7px 14px',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: '#0284c7',
              color: '#ffffff',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <PhoneCall size={14} />
            <span>Call Market Desk: 1800-425-2782</span>
          </a>
        </div>
      </div>

    </div>
  );
}
