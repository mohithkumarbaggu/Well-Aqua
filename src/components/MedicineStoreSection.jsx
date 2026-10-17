import React, { useState } from 'react';
import { 
  PHARMACY_PRODUCTS 
} from '../data/mockData';
import { 
  Pill, 
  Search, 
  ShoppingCart, 
  Check, 
  Star, 
  Sparkles, 
  Calculator, 
  ShieldCheck, 
  AlertCircle, 
  Truck, 
  ArrowRight,
  Filter
} from 'lucide-react';

export default function MedicineStoreSection({ 
  cart, 
  setCart, 
  setIsCartOpen,
  showToast 
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dosage Calculator State
  const [calcAcre, setCalcAcre] = useState(2.5); // 2.5 acres
  const [calcDepth, setCalcDepth] = useState(1.2); // 1.2 meters depth
  const [calcCondition, setCalcCondition] = useState('ammonia'); // 'ammonia', 'molt', 'soft_shell', 'sludge'

  // Categories list
  const categories = ['ALL', 'Probiotics', 'Minerals', 'Feed Supplements', 'Sanitizers', 'Testing Kits'];

  // Filter products
  const filteredProducts = PHARMACY_PRODUCTS.filter(prod => {
    const matchesCat = selectedCategory === 'ALL' || prod.category === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.indication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.composition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prevCart, { ...product, qty: quantity }];
    });
    if (showToast) {
      showToast(`Added ${product.name} to Cart!`, 'success');
    }
  };

  // Dosage computation logic
  const getDosageRecommendation = () => {
    const waterVolumeFactor = (calcAcre * 4046.86) * calcDepth; // cubic meters (m³)
    
    switch (calcCondition) {
      case 'ammonia':
        return {
          title: 'Ammonia & Nitrite Reduction Protocol',
          primaryProduct: PHARMACY_PRODUCTS.find(p => p.id === 'prod-1'), // Nitromax
          secondaryProduct: PHARMACY_PRODUCTS.find(p => p.id === 'prod-6'), // OxyPlus
          primaryQty: Math.ceil(calcAcre * 1.5), // 1.5 kg per acre
          secondaryQty: Math.ceil(calcAcre * 3), // 3 kg Oxyplus per acre
          advice: 'Stop feeding by 50% for 24h. Run all aerators. Broadcast Nitromax at 10:00 AM in sunny weather.'
        };
      case 'molt':
        return {
          title: 'Full Moon / New Moon Molt Mineral Protocol',
          primaryProduct: PHARMACY_PRODUCTS.find(p => p.id === 'prod-2'), // AquaMin Pro
          secondaryProduct: PHARMACY_PRODUCTS.find(p => p.id === 'prod-5'), // Spirulina
          primaryQty: Math.ceil(calcAcre * 15), // 15 kg per acre
          secondaryQty: Math.ceil(calcAcre * 1), // 1 kg Spirulina
          advice: 'Apply minerals 24 hours prior to lunar molting cycle to prevent soft-shell syndrome and muscle cramping.'
        };
      case 'sludge':
        return {
          title: 'Pond Bottom Black Sludge & Gut Shield Protocol',
          primaryProduct: PHARMACY_PRODUCTS.find(p => p.id === 'prod-3'), // GutShield
          secondaryProduct: PHARMACY_PRODUCTS.find(p => p.id === 'prod-1'), // Nitromax
          primaryQty: Math.ceil(calcAcre * 2),
          secondaryQty: Math.ceil(calcAcre * 1),
          advice: 'Coat GutShield with feed pellets @ 15ml/kg using commercial binder for 7 continuous days.'
        };
      default:
        return {
          title: 'General Preventive Health Protocol',
          primaryProduct: PHARMACY_PRODUCTS.find(p => p.id === 'prod-2'),
          secondaryProduct: PHARMACY_PRODUCTS.find(p => p.id === 'prod-1'),
          primaryQty: Math.ceil(calcAcre * 10),
          secondaryQty: Math.ceil(calcAcre * 1),
          advice: 'Weekly maintenance dose to sustain active nitrifying microbial populations and alkalinity.'
        };
    }
  };

  const dosageRec = getDosageRecommendation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '28px', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 17, 31, 0.9) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-cyan">Certified Aquaculture Pharmacy</span>
          <span className="badge badge-emerald">Direct Farm Delivery (24-48 Hours)</span>
        </div>
        <h1 style={{ fontSize: '2.1rem', marginBottom: '8px' }}>Aquaculture Medicines, Probiotics & Minerals</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '820px', fontSize: '0.98rem' }}>
          High-potency water probiotics, bio-remediators, shell hardening mineral mixes, organic gut acidifiers, and emergency DO chemicals. 
          Use our intelligent dosage calculator to prevent over-dosing.
        </p>
      </div>

      {/* Smart Dosage Calculator Widget */}
      <div className="glass-panel" style={{ padding: '24px', border: '1px solid var(--border-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '8px', borderRadius: '8px' }}>
            <Calculator size={22} color="var(--cyan)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Smart Pond Volume & Dosage Calculator</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Accurately calculate medicine & mineral quantities by your pond's water volume.
            </p>
          </div>
        </div>

        {/* Inputs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Pond Water Area: <strong style={{ color: 'var(--text-main)' }}>{calcAcre} Acres</strong>
            </label>
            <input 
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={calcAcre}
              onChange={(e) => setCalcAcre(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--cyan)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Average Water Depth: <strong style={{ color: 'var(--text-main)' }}>{calcDepth} Meters</strong>
            </label>
            <input 
              type="range"
              min="0.8"
              max="2.5"
              step="0.1"
              value={calcDepth}
              onChange={(e) => setCalcDepth(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--cyan)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Pond Condition / Target Treatment:
            </label>
            <select
              value={calcCondition}
              onChange={(e) => setCalcCondition(e.target.value)}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              <option value="ammonia">High Ammonia (TAN above 0.5 ppm)</option>
              <option value="molt">Upcoming Full/New Moon Molting</option>
              <option value="sludge">Black Bottom Sludge & White Gut</option>
            </select>
          </div>
        </div>

        {/* Computed Result Box */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-emerald">Recommended Prescription</span>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--cyan)' }}>
                {dosageRec.title}
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              {dosageRec.advice}
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {dosageRec.primaryProduct && (
                <span>
                  • <strong>{dosageRec.primaryProduct.name.split('(')[0]}</strong>: Dose <strong>{dosageRec.primaryQty} Units/kg</strong>
                </span>
              )}
              {dosageRec.secondaryProduct && (
                <span>
                  • <strong>{dosageRec.secondaryProduct.name.split('(')[0]}</strong>: Dose <strong>{dosageRec.secondaryQty} Units/kg</strong>
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                if (dosageRec.primaryProduct) handleAddToCart(dosageRec.primaryProduct, 1);
                if (dosageRec.secondaryProduct) handleAddToCart(dosageRec.secondaryProduct, 1);
                setIsCartOpen(true);
              }}
              className="btn-primary"
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              <ShoppingCart size={16} />
              <span>Add Dose Bundle to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Search & Category Filters */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`nav-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                style={{ padding: '8px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '280px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input 
              type="text"
              placeholder="Search medicine, probiotic, or mineral..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '36px' }}
            />
          </div>

        </div>

        {/* Product Grid */}
        <div className="catalog-grid">
          {filteredProducts.map(product => {
            const inCart = cart.find(item => item.id === product.id);
            const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

            return (
              <div key={product.id} className="glass-panel service-card">
                <div>
                  {/* Top Badge & Category */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span className="badge badge-cyan">{product.category}</span>
                    <span className="badge badge-emerald">{product.badge}</span>
                  </div>

                  {/* Product Icon & Title */}
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '2.2rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '8px',
                      borderRadius: '10px',
                      lineHeight: 1
                    }}>
                      {product.image}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', lineHeight: 1.3, marginBottom: '2px' }}>
                        {product.name}
                      </h3>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        By {product.manufacturer} • Pack: <strong>{product.packSize}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#fbbf24' }}>
                      <Star size={14} fill="#fbbf24" color="#fbbf24" />
                      <span style={{ fontWeight: 700, marginLeft: '4px' }}>{product.rating}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>({product.reviews} farmer reviews)</span>
                  </div>

                  {/* Composition & Indications */}
                  <div style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.8rem' }}>
                    <div style={{ color: 'var(--cyan)', fontWeight: 600, marginBottom: '4px' }}>
                      Key Composition:
                    </div>
                    <div style={{ color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.4 }}>
                      {product.composition}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <strong>Dosage Rate:</strong> {product.dosageRate}
                    </div>
                  </div>
                </div>

                {/* Price & Add to Cart Action */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border-subtle)'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="badge badge-rose" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                      Save {discount}%
                    </span>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product)}
                    className={inCart ? "btn-emerald" : "btn-primary"}
                    style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                  >
                    {inCart ? (
                      <>
                        <Check size={16} />
                        <span>Added ({inCart.qty})</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
