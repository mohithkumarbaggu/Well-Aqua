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
  const van100 = products.find(p => p.id === 'van-100');
  const tiger20 = products.find(p => p.id === 'bt-20');
  const seabass = products.find(p => p.id === 'fish-seabass');
  const rohu = products.find(p => p.id === 'fish-rohu');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* 1. Header Hero Banner */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '28px 32px', 
          borderRadius: '20px', 
          background: 'linear-gradient(135deg, #091e3a 0%, #0369a1 100%)', 
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(2, 132, 199, 0.2)'
        }}
      >
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-30px',
          fontSize: '11rem',
          opacity: 0.06,
          userSelect: 'none',
          pointerEvents: 'none'
        }}>
          🦐
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.25)',
                border: '1px solid #34d399',
                color: '#6ee7b7',
                fontSize: '0.74rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#34d399',
                  boxShadow: '0 0 8px #34d399'
                }}></span>
                Live Mandi Spot Engine Active
              </span>

              <span style={{ fontSize: '0.82rem', color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} />
                <span>Today's Official Mandi Rates (లైవ్ మార్కెట్ ధరలు)</span>
              </span>
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: 900, margin: '4px 0 8px', letterSpacing: '-0.025em', color: '#ffffff' }}>
              Live Prawn & Fish Market Prices
            </h1>
            <p style={{ fontSize: '0.94rem', color: '#cbd5e1', margin: 0, maxWidth: '640px', lineHeight: 1.5 }}>
              Daily verified farm-gate spot rates for Pacific White Shrimp (Vannamei), Black Tiger, and commercial aquaculture fishes across key coastal mandis.
            </p>
          </div>

          {/* Regional Location Picker Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '12px 18px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MapPin size={20} color="#38bdf8" />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#93c5fd', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Select Mandi / Market Location
              </label>
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
                  padding: '2px 0'
                }}
              >
                {MARKET_LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.id} style={{ background: '#0f172a', color: '#ffffff' }}>
                    {loc.name} {loc.isBenchmark ? '⭐ (Benchmark Mandi)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Highlights Ticker Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '14px'
      }}>
        {van30 && (
          <div className="glass-panel" style={{ padding: '16px 18px', borderRadius: '16px', borderLeft: '4px solid #0284c7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>🦐 Vannamei 30 Count</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>▲ +₹{van30.change}</span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '4px' }}>
              ₹ {van30.currentPrice} <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ kg</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Range: ₹{van30.minPrice} - ₹{van30.maxPrice} • {currentLocObj.district}
            </div>
          </div>
        )}

        {van40 && (
          <div className="glass-panel" style={{ padding: '16px 18px', borderRadius: '16px', borderLeft: '4px solid #059669' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>🦐 Vannamei 40 Count</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>▲ +₹{van40.change}</span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
              ₹ {van40.currentPrice} <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ kg</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Export Grade • High Buyer Demand
            </div>
          </div>
        )}

        {tiger20 && (
          <div className="glass-panel" style={{ padding: '16px 18px', borderRadius: '16px', borderLeft: '4px solid #d97706' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>🐅 Black Tiger 20 Count</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>▲ +₹{tiger20.change}</span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#d97706', marginTop: '4px' }}>
              ₹ {tiger20.currentPrice} <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ kg</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Giant Jumbo Grade (మోనోడాన్)
            </div>
          </div>
        )}

        {seabass && (
          <div className="glass-panel" style={{ padding: '16px 18px', borderRadius: '16px', borderLeft: '4px solid #7c3aed' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700 }}>🐟 Pandugappa (Seabass)</span>
              <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>▲ +₹{seabass.change}</span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#7c3aed', marginTop: '4px' }}>
              ₹ {seabass.currentPrice} <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ kg</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Premium White Fish (1-2 kg)
            </div>
          </div>
        )}
      </div>

      {/* 3. Interactive Harvest Revenue Calculator */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '24px', 
          borderRadius: '18px', 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid rgba(2, 132, 199, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calculator size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.18rem', margin: 0, fontWeight: 900, color: 'var(--text-main)' }}>
                Harvest Mandi Payout Calculator (దిగుబడి ఆదాయం కాలిక్యులేటర్)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Select species/count and type total expected biomass in kg to see estimated gross realization at {currentLocObj.district} spot rates.
              </p>
            </div>
          </div>
          <span className="badge badge-cyan" style={{ fontSize: '0.75rem' }}>
            Live Spot Rate Multiplier
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          alignItems: 'center'
        }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Select Product / Count:
            </label>
            <select
              value={calcProductId}
              onChange={(e) => setCalcProductId(e.target.value)}
              className="input-field"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem' }}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.species} — {p.grade} [₹{p.currentPrice}/kg]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              Expected Pond Biomass (kg):
            </label>
            <input
              type="number"
              step="50"
              min="100"
              value={calcBiomassKg}
              onChange={(e) => setCalcBiomassKg(Math.max(0, Number(e.target.value)))}
              className="input-field"
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '0.95rem' }}
              placeholder="e.g. 2500"
            />
          </div>

          <div style={{
            background: 'var(--bg-surface)',
            border: '1.5px solid #0284c7',
            padding: '14px 20px',
            borderRadius: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.1)'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Mandi Realization
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '2px', lineHeight: 1.1 }}>
                ₹ {totalCalculatedPayout.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                {calcBiomassKg.toLocaleString()} kg @ ₹{calcProduct?.currentPrice}/kg
              </div>
            </div>

            <a
              href="tel:18004252782"
              className="btn-primary"
              style={{
                padding: '8px 14px',
                fontSize: '0.82rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
              title="Lock spot rate with verified mandi buyer"
            >
              <PhoneCall size={14} />
              <span>Lock Rate</span>
            </a>
          </div>
        </div>
      </div>

      {/* 4. Controls: Categories, Search, and View Mode */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: 800,
              borderRadius: '24px',
              border: activeCategory === 'all' ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)',
              background: activeCategory === 'all' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-surface)',
              color: activeCategory === 'all' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: activeCategory === 'all' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
              transition: 'var(--transition)'
            }}
          >
            ⭐ All Rates ({products.length})
          </button>

          <button
            onClick={() => setActiveCategory('prawn')}
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: 800,
              borderRadius: '24px',
              border: activeCategory === 'prawn' ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)',
              background: activeCategory === 'prawn' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-surface)',
              color: activeCategory === 'prawn' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeCategory === 'prawn' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
              transition: 'var(--transition)'
            }}
          >
            <span>🦐 Prawns & Shrimp (రొయ్యలు - 10 Counts)</span>
          </button>

          <button
            onClick={() => setActiveCategory('fish')}
            style={{
              padding: '8px 16px',
              fontSize: '0.84rem',
              fontWeight: 800,
              borderRadius: '24px',
              border: activeCategory === 'fish' ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)',
              background: activeCategory === 'fish' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'var(--bg-surface)',
              color: activeCategory === 'fish' ? '#ffffff' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeCategory === 'fish' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
              transition: 'var(--transition)'
            }}
          >
            <span>🐟 Commercial Fishes (చేపల రకాలు - 6)</span>
          </button>
        </div>

        {/* Search & Layout Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search count or species..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', fontSize: '0.84rem', borderRadius: '10px' }}
            />
          </div>

          <div style={{ display: 'flex', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '3px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 10px',
                border: 'none',
                borderRadius: '8px',
                background: viewMode === 'grid' ? '#0284c7' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Grid Card View"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 10px',
                border: 'none',
                borderRadius: '8px',
                background: viewMode === 'table' ? '#0284c7' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Detailed Table View"
            >
              <Table size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Products Display: Grid Mode or Table Mode */}
      {viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '16px'
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
                  gap: '14px',
                  transition: 'var(--transition)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '1.12rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        {product.grade}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--cyan)', fontWeight: 700, marginTop: '2px' }}>
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

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '16px' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                      ₹ {product.currentPrice}
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      / {product.unit}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0 0', lineHeight: 1.4 }}>
                    {product.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.76rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Mandi Range: <strong>₹{product.minPrice} - ₹{product.maxPrice}</strong></span>
                    <span style={{ color: '#059669', fontWeight: 800 }}>{product.demand}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontSize: '0.8rem'
                }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>
                    📍 {currentLocObj.district}
                  </span>

                  <button
                    onClick={() => {
                      setCalcProductId(product.id);
                      window.scrollTo({ top: 180, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#0284c7',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0
                    }}
                  >
                    <span>Calculate Batch Value</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Table View */
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 14px' }}>Species / Grade</th>
                <th style={{ padding: '12px 14px' }}>Telugu Name</th>
                <th style={{ padding: '12px 14px' }}>Spot Price (₹/kg)</th>
                <th style={{ padding: '12px 14px' }}>24h Change</th>
                <th style={{ padding: '12px 14px' }}>Mandi Range</th>
                <th style={{ padding: '12px 14px' }}>Market Demand</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => {
                const isUp = p.direction === 'up';
                const isDown = p.direction === 'down';
                return (
                  <tr key={p.id} style={{ borderBottom: idx === filteredProducts.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.94rem' }}>{p.grade}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{p.species}</div>
                    </td>
                    <td style={{ padding: '14px', color: 'var(--cyan)', fontWeight: 600, fontSize: '0.82rem' }}>
                      {p.speciesTelugu}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 900, fontSize: '1.18rem', color: 'var(--text-main)' }}>
                        ₹ {p.currentPrice} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {p.unit}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
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
                    <td style={{ padding: '14px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      ₹{p.minPrice} - ₹{p.maxPrice}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>{p.demand}</span>
                    </td>
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setCalcProductId(p.id);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          borderRadius: '8px',
                          border: '1px solid #bae6fd',
                          background: 'rgba(2, 132, 199, 0.08)',
                          color: '#0284c7',
                          cursor: 'pointer'
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
      )}

      {/* 6. Harvest Selling & Direct Trader Support Hotline */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '24px 28px', 
          borderRadius: '18px', 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(15, 23, 42, 0.02) 100%)',
          border: '1px dashed #0284c7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            color: '#ffffff',
            flexShrink: 0
          }}>
            🦐
          </div>
          <div>
            <h3 style={{ fontSize: '1.18rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              Looking to Sell Your Pond Harvest? (రొయ్యలు / చేపల అమ్మకం)
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, maxWidth: '620px', lineHeight: 1.4 }}>
              Connect with accredited exporters, cold storage processors, and licensed local weigh-bridge buyers in {currentLocObj.district}. Fair weighing, immediate online settlement, and free harvest sample grading.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="tel:18004252782"
            style={{
              padding: '10px 18px',
              fontSize: '0.88rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              color: '#ffffff',
              borderRadius: '10px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)'
            }}
          >
            <PhoneCall size={16} />
            <span>Call Market Desk: 1800-425-2782</span>
          </a>

          <a
            href="https://wa.me/919440122334?text=Hello%20Well%20Aqua,%20I%20want%20to%20know%20today's%20shrimp%20harvest%20prices%20for%20my%20farm."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 18px',
              fontSize: '0.88rem',
              fontWeight: 800,
              background: '#10b981',
              color: '#ffffff',
              borderRadius: '10px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <MessageSquare size={16} />
            <span>WhatsApp Buyer Desk</span>
          </a>
        </div>
      </div>

    </div>
  );
}
