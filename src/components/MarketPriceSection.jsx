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
  CheckCircle2, 
  ChevronRight,
  ChevronDown,
  Fish,
  Waves,
  ArrowUpRight,
  Clock,
  Layers,
  Table,
  Grid,
  Info,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  Calendar
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
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'prawn' | 'fish'
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

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
  const tiger20 = products.find(p => p.id === 'bt-20');
  const seabass = products.find(p => p.id === 'fish-seabass');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '1240px', margin: '0 auto' }}>
      
      {/* 1. Header Hero Banner */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: 'clamp(20px, 3.5vw, 32px)', 
          borderRadius: '20px', 
          background: 'linear-gradient(135deg, #07192f 0%, #0369a1 100%)', 
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(2, 132, 199, 0.22)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        {/* Background Decorative Glyph */}
        <div style={{
          position: 'absolute',
          right: '-10px',
          bottom: '-30px',
          fontSize: '11rem',
          opacity: 0.05,
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1
        }}>
          🦐
        </div>

        {/* Hero Left Content */}
        <div style={{ flex: '1 1 500px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.22)',
              border: '1px solid rgba(52, 211, 153, 0.6)',
              color: '#6ee7b7',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#34d399',
                boxShadow: '0 0 8px #34d399'
              }}></span>
              Live Mandi Spot Engine Active
            </span>

            <span style={{ fontSize: '0.8rem', color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
              <Calendar size={13} />
              <span>Today's Official Mandi Rates (లైవ్ మార్కెట్ ధరలు)</span>
            </span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(1.5rem, 3vw, 2.15rem)', 
            fontWeight: 900, 
            margin: '0 0 8px 0', 
            letterSpacing: '-0.025em', 
            color: '#ffffff',
            lineHeight: 1.2
          }}>
            Live Prawn & Fish Market Prices
          </h1>

          <p style={{ 
            fontSize: '0.92rem', 
            color: '#cbd5e1', 
            margin: 0, 
            maxWidth: '620px', 
            lineHeight: 1.5 
          }}>
            Daily verified farm-gate spot rates for Pacific White Shrimp (Vannamei), Black Tiger, and commercial fishes across major coastal mandis.
          </p>
        </div>

        {/* Hero Right: Mandi Location Picker Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          padding: '12px 18px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: '270px',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MapPin size={22} color="#38bdf8" />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <label style={{ 
              fontSize: '0.68rem', 
              fontWeight: 800, 
              color: '#93c5fd', 
              display: 'block', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: '2px'
            }}>
              Selected Mandi Location
            </label>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <select
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '1rem',
                  color: '#ffffff',
                  cursor: 'pointer',
                  outline: 'none',
                  padding: '2px 22px 2px 0',
                  width: '100%',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              >
                {MARKET_LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                    {loc.name} {loc.isBenchmark ? '⭐ (Benchmark)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={16} 
                color="#93c5fd" 
                style={{ position: 'absolute', right: 0, pointerEvents: 'none' }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Highlights Benchmark Ticker Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {van30 && (
          <div 
            className="glass-panel" 
            style={{ 
              padding: '18px 20px', 
              borderRadius: '16px', 
              borderLeft: '4px solid #0284c7',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '130px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🦐</span>
                <span>Vannamei 30 Count</span>
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                ▲ +₹{van30.change}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0 4px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                ₹ {van30.currentPrice}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                / kg
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Range: ₹{van30.minPrice} - ₹{van30.maxPrice} • {currentLocObj.district}
            </div>
          </div>
        )}

        {van40 && (
          <div 
            className="glass-panel" 
            style={{ 
              padding: '18px 20px', 
              borderRadius: '16px', 
              borderLeft: '4px solid #059669',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '130px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🦐</span>
                <span>Vannamei 40 Count</span>
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                ▲ +₹{van40.change}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0 4px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#059669', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                ₹ {van40.currentPrice}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                / kg
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Export Grade • High Mandi Demand
            </div>
          </div>
        )}

        {tiger20 && (
          <div 
            className="glass-panel" 
            style={{ 
              padding: '18px 20px', 
              borderRadius: '16px', 
              borderLeft: '4px solid #d97706',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '130px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🐅</span>
                <span>Black Tiger 20 Count</span>
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                ▲ +₹{tiger20.change}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0 4px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#d97706', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                ₹ {tiger20.currentPrice}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                / kg
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Giant Jumbo Monodon (మోనోడాన్)
            </div>
          </div>
        )}

        {seabass && (
          <div 
            className="glass-panel" 
            style={{ 
              padding: '18px 20px', 
              borderRadius: '16px', 
              borderLeft: '4px solid #7c3aed',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '130px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🐟</span>
                <span>Pandugappa (Seabass)</span>
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                ▲ +₹{seabass.change}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '8px 0 4px' }}>
              <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#7c3aed', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                ₹ {seabass.currentPrice}
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                / kg
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Premium White Fish (1 - 2 kg)
            </div>
          </div>
        )}
      </div>

      {/* 3. Interactive Harvest Mandi Payout Calculator */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '24px 26px', 
          borderRadius: '18px', 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1.5px solid rgba(2, 132, 199, 0.22)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        {/* Calculator Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '12px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(2, 132, 199, 0.3)',
              flexShrink: 0
            }}>
              <Calculator size={19} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.2 }}>
                Harvest Mandi Payout Calculator (దిగుబడి ఆదాయం కాలిక్యులేటర్)
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
                Select species/count and enter expected pond biomass to calculate estimated gross revenue at {currentLocObj.district} spot rates.
              </p>
            </div>
          </div>

          <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
            Live Spot Multiplier
          </span>
        </div>

        {/* Inputs & Total Box: Perfectly Aligned to Bottom Baseline */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          alignItems: 'flex-end'
        }}>
          {/* Column 1: Select Product */}
          <div>
            <label style={{ 
              fontSize: '0.74rem', 
              fontWeight: 800, 
              color: 'var(--text-muted)', 
              display: 'block', 
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px' 
            }}>
              Select Product / Count:
            </label>
            <select
              value={calcProductId}
              onChange={(e) => setCalcProductId(e.target.value)}
              className="input-field"
              style={{ 
                width: '100%', 
                height: '48px', 
                padding: '0 14px', 
                borderRadius: '12px', 
                fontWeight: 700, 
                fontSize: '0.88rem',
                border: '1.5px solid var(--border-subtle)',
                background: 'var(--bg-surface)'
              }}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.species} — {p.grade} [₹{p.currentPrice}/kg]
                </option>
              ))}
            </select>
          </div>

          {/* Column 2: Expected Pond Biomass (kg) */}
          <div>
            <label style={{ 
              fontSize: '0.74rem', 
              fontWeight: 800, 
              color: 'var(--text-muted)', 
              display: 'block', 
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px' 
            }}>
              Expected Pond Biomass (kg):
            </label>
            <input
              type="number"
              step="50"
              min="100"
              value={calcBiomassKg}
              onChange={(e) => setCalcBiomassKg(Math.max(0, Number(e.target.value)))}
              className="input-field"
              style={{ 
                width: '100%', 
                height: '48px', 
                padding: '0 14px', 
                borderRadius: '12px', 
                fontWeight: 800, 
                fontSize: '0.94rem',
                border: '1.5px solid var(--border-subtle)',
                background: 'var(--bg-surface)'
              }}
              placeholder="e.g. 2500"
            />
          </div>

          {/* Column 3: Total Mandi Realization Box */}
          <div>
            <label style={{ 
              fontSize: '0.74rem', 
              fontWeight: 800, 
              color: '#0284c7', 
              display: 'block', 
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px' 
            }}>
              Estimated Mandi Realization:
            </label>
            <div style={{
              height: '48px',
              background: 'var(--bg-surface)',
              border: '1.5px solid #0284c7',
              borderRadius: '12px',
              padding: '0 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 10px rgba(2, 132, 199, 0.12)'
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
                  ₹ {totalCalculatedPayout.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  ({calcBiomassKg}kg @ ₹{calcProduct?.currentPrice})
                </span>
              </div>

              <a
                href="tel:18004252782"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
                }}
                title="Lock spot rate with verified mandi buyer"
              >
                <PhoneCall size={12} />
                <span>Lock Rate</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Controls: Categories, Search, and View Mode (Aligned Horizontally) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '4px 0'
      }}>
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              height: '38px',
              padding: '0 16px',
              fontSize: '0.82rem',
              fontWeight: 800,
              borderRadius: '20px',
              border: activeCategory === 'all' ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
              background: activeCategory === 'all' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-surface)',
              color: activeCategory === 'all' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: activeCategory === 'all' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
              transition: 'var(--transition)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⭐ All Rates</span>
            <span style={{ 
              fontSize: '0.72rem', 
              padding: '1px 6px', 
              borderRadius: '10px', 
              background: activeCategory === 'all' ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)' 
            }}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveCategory('prawn')}
            style={{
              height: '38px',
              padding: '0 16px',
              fontSize: '0.82rem',
              fontWeight: 800,
              borderRadius: '20px',
              border: activeCategory === 'prawn' ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
              background: activeCategory === 'prawn' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-surface)',
              color: activeCategory === 'prawn' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeCategory === 'prawn' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
              transition: 'var(--transition)'
            }}
          >
            <span>🦐 Prawns & Shrimp (రొయ్యలు)</span>
          </button>

          <button
            onClick={() => setActiveCategory('fish')}
            style={{
              height: '38px',
              padding: '0 16px',
              fontSize: '0.82rem',
              fontWeight: 800,
              borderRadius: '20px',
              border: activeCategory === 'fish' ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
              background: activeCategory === 'fish' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-surface)',
              color: activeCategory === 'fish' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeCategory === 'fish' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
              transition: 'var(--transition)'
            }}
          >
            <span>🐟 Commercial Fishes (చేపలు)</span>
          </button>
        </div>

        {/* Right Search Input & View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '250px' }}>
            <Search 
              size={15} 
              color="var(--text-muted)" 
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} 
            />
            <input
              type="text"
              placeholder="Search count or species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ 
                width: '100%', 
                height: '38px', 
                paddingLeft: '34px', 
                paddingRight: '12px', 
                fontSize: '0.82rem', 
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface)'
              }}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            height: '38px',
            background: 'var(--bg-surface)', 
            border: '1px solid var(--border-subtle)', 
            borderRadius: '10px', 
            padding: '3px' 
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0 10px',
                height: '100%',
                border: 'none',
                borderRadius: '7px',
                background: viewMode === 'grid' ? '#0284c7' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition)'
              }}
              title="Grid Cards View"
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '0 10px',
                height: '100%',
                border: 'none',
                borderRadius: '7px',
                background: viewMode === 'table' ? '#0284c7' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition)'
              }}
              title="Detailed Table View"
            >
              <Table size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Products Display: Grid Mode or Table Mode */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '18px'
        }}>
          {filteredProducts.map(product => {
            const isUp = product.direction === 'up';
            const isDown = product.direction === 'down';

            return (
              <div
                key={product.id}
                className="glass-panel hover-card"
                style={{
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  minHeight: '260px',
                  transition: 'var(--transition)'
                }}
              >
                {/* Card Top Section */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '1.14rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.2 }}>
                        {product.grade}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700, marginTop: '3px' }}>
                        {product.species} • {product.speciesTelugu}
                      </div>
                    </div>

                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: isUp ? 'rgba(16, 185, 129, 0.12)' : isDown ? 'rgba(225, 29, 72, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      color: isUp ? '#059669' : isDown ? '#e11d48' : '#d97706',
                      border: isUp ? '1px solid #10b981' : isDown ? '1px solid #f43f5e' : '1px solid #f59e0b',
                      whiteSpace: 'nowrap'
                    }}>
                      {isUp && <TrendingUp size={12} />}
                      {isDown && <TrendingDown size={12} />}
                      {!isUp && !isDown && <Minus size={12} />}
                      <span>{isUp ? `+₹${product.change}` : isDown ? `-₹${Math.abs(product.change)}` : 'Stable'}</span>
                    </span>
                  </div>

                  {/* Price Section */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '14px' }}>
                    <span style={{ 
                      fontSize: '1.95rem', 
                      fontWeight: 900, 
                      color: 'var(--text-main)', 
                      letterSpacing: '-0.02em',
                      fontVariantNumeric: 'tabular-nums',
                      lineHeight: 1
                    }}>
                      ₹ {product.currentPrice}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      / {product.unit}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: 1.45 }}>
                    {product.description}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginTop: '12px', 
                    fontSize: '0.75rem',
                    paddingTop: '8px'
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Range: <strong>₹{product.minPrice} - ₹{product.maxPrice}</strong>
                    </span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                      {product.demand}
                    </span>
                  </div>
                </div>

                {/* Card Bottom Action */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.78rem'
                }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <span>📍</span>
                    <span>{currentLocObj.district}</span>
                  </span>

                  <button
                    onClick={() => {
                      setCalcProductId(product.id);
                      window.scrollTo({ top: 160, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#0284c7',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 6px',
                      borderRadius: '6px',
                      transition: 'var(--transition)'
                    }}
                    title="Load into harvest calculator"
                  >
                    <span>Calculate Value</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="glass-panel" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ 
                  background: 'var(--bg-surface)', 
                  borderBottom: '1.5px solid var(--border-subtle)', 
                  color: 'var(--text-muted)', 
                  fontSize: '0.74rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.04em' 
                }}>
                  <th style={{ padding: '14px 18px' }}>Species / Grade</th>
                  <th style={{ padding: '14px 18px' }}>Telugu Name</th>
                  <th style={{ padding: '14px 18px' }}>Spot Price (₹/kg)</th>
                  <th style={{ padding: '14px 18px' }}>24h Change</th>
                  <th style={{ padding: '14px 18px' }}>Mandi Range</th>
                  <th style={{ padding: '14px 18px' }}>Market Demand</th>
                  <th style={{ padding: '14px 18px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, idx) => {
                  const isUp = p.direction === 'up';
                  const isDown = p.direction === 'down';
                  return (
                    <tr 
                      key={p.id} 
                      style={{ 
                        borderBottom: idx === filteredProducts.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.92rem' }}>{p.grade}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.species}</div>
                      </td>
                      <td style={{ padding: '14px 18px', color: '#0284c7', fontWeight: 600, fontSize: '0.8rem', verticalAlign: 'middle' }}>
                        {p.speciesTelugu}
                      </td>
                      <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 900, fontSize: '1.15rem', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
                          ₹ {p.currentPrice} <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ {p.unit}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          background: isUp ? 'rgba(16, 185, 129, 0.12)' : isDown ? 'rgba(225, 29, 72, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: isUp ? '#059669' : isDown ? '#e11d48' : '#d97706'
                        }}>
                          {isUp && <TrendingUp size={12} />}
                          {isDown && <TrendingDown size={12} />}
                          {!isUp && !isDown && <Minus size={12} />}
                          <span>{isUp ? `+₹${p.change}` : isDown ? `-₹${Math.abs(p.change)}` : 'Stable'}</span>
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', verticalAlign: 'middle' }}>
                        ₹{p.minPrice} - ₹{p.maxPrice}
                      </td>
                      <td style={{ padding: '14px 18px', verticalAlign: 'middle' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>{p.demand}</span>
                      </td>
                      <td style={{ padding: '14px 18px', textAlign: 'right', verticalAlign: 'middle' }}>
                        <button
                          onClick={() => {
                            setCalcProductId(p.id);
                            window.scrollTo({ top: 160, behavior: 'smooth' });
                          }}
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            borderRadius: '8px',
                            border: '1px solid #bae6fd',
                            background: 'rgba(2, 132, 199, 0.08)',
                            color: '#0284c7',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                          }}
                        >
                          Calculate Value
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Harvest Selling & Direct Trader Support Hotline */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '24px 28px', 
          borderRadius: '18px', 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(15, 23, 42, 0.02) 100%)',
          border: '1.5px dashed rgba(2, 132, 199, 0.4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 450px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            color: '#ffffff',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
          }}>
            🦐
          </div>
          <div>
            <h3 style={{ fontSize: '1.12rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              Looking to Sell Your Pond Harvest? (రొయ్యలు / చేపల అమ్మకం)
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>
              Connect with accredited exporters, cold storage processors, and verified weigh-bridge buyers in {currentLocObj.district}. Fair weighing, spot online transfer, and free harvest count grading.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="tel:18004252782"
            style={{
              height: '42px',
              padding: '0 18px',
              fontSize: '0.84rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              borderRadius: '10px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 3px 10px rgba(2, 132, 199, 0.3)',
              transition: 'var(--transition)'
            }}
          >
            <PhoneCall size={15} />
            <span>Call Market Desk: 1800-425-2782</span>
          </a>

          <a
            href="https://wa.me/919440122334?text=Hello%20Well%20Aqua,%20I%20want%20to%20know%20today's%20shrimp%20harvest%20prices%20for%20my%20farm."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              height: '42px',
              padding: '0 18px',
              fontSize: '0.84rem',
              fontWeight: 800,
              background: '#10b981',
              color: '#ffffff',
              borderRadius: '10px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)',
              transition: 'var(--transition)'
            }}
          >
            <MessageSquare size={15} />
            <span>WhatsApp Buyer Desk</span>
          </a>
        </div>
      </div>

    </div>
  );
}
