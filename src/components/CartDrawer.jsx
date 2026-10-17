import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle2, 
  Truck, 
  Tag, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cart, 
  setCart 
}) {
  const [deliveryAddress, setDeliveryAddress] = useState('Pond Gate #2, Srimannarayana Aquafarm, Bhimavaram, AP');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = subtotal > 2000 || subtotal === 0 ? 0 : 150;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

  const updateQuantity = (id, delta) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          return newQty > 0 ? { ...item, qty: newQty } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'WELLAQUA10' || code === 'AQUANIX10' || code === 'FARMER10') {
      setDiscountPercent(10);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try WELLAQUA10');
      setDiscountPercent(0);
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    const orderId = `ORD-AQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderConfirmed({
      orderId,
      total: grandTotal,
      itemsCount: cart.reduce((s, i) => s + i.qty, 0),
      address: deliveryAddress
    });
    setCart([]);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '480px', 
          width: '100%', 
          height: '100vh', 
          maxHeight: '100vh', 
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '24px'
        }}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="var(--cyan)" />
            <h3 style={{ fontSize: '1.25rem' }}>Aquaculture Cart</h3>
            <span className="badge badge-cyan">{cart.reduce((s, i) => s + i.qty, 0)} Items</span>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: '4px' }}>
            <X size={22} />
          </button>
        </div>

        {orderConfirmed ? (
          /* Order Confirmation View */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px' }}>
            <div style={{ 
              width: '70px', 
              height: '70px', 
              borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={42} color="#10b981" />
            </div>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              Order Placed Successfully!
            </h3>
            <span className="badge badge-cyan" style={{ fontSize: '0.85rem', marginBottom: '16px' }}>
              ID: {orderConfirmed.orderId}
            </span>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Your aquaculture medicines & supplements will be dispatched via direct cold-chain van within 24 hours.
            </p>

            <div style={{ background: 'var(--bg-surface)', padding: '16px', borderRadius: '10px', width: '100%', textAlign: 'left', fontSize: '0.85rem', marginBottom: '24px' }}>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivering to:</span>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{orderConfirmed.address}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total Amount Paid (COD / UPI):</span>
                <strong style={{ color: '#10b981', fontSize: '1rem' }}>₹{orderConfirmed.total.toLocaleString()}</strong>
              </div>
            </div>

            <button 
              onClick={() => {
                setOrderConfirmed(null);
                onClose();
              }}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              Continue Farming
            </button>
          </div>
        ) : (
          /* Regular Cart View */
          <>
            {/* Scrollable Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛒</div>
                  <p>Your medicine cart is currently empty.</p>
                  <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Add probiotics, minerals or test kits from the store.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div 
                    key={item.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '1.8rem', background: 'rgba(255, 255, 255, 0.05)', padding: '6px', borderRadius: '8px' }}>
                        {item.image}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.2 }}>
                          {item.name.split('(')[0]}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          ₹{item.price.toLocaleString()} • {item.packSize}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Quantity Selector */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-deep)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ padding: '4px 8px', color: 'var(--text-muted)' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 6px', color: 'var(--text-main)' }}>
                          {item.qty}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ padding: '4px 8px', color: 'var(--text-muted)' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        style={{ color: '#f43f5e', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              /* Footer / Checkout */
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                {/* Coupon Code Input */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Coupon code (try WELLAQUA10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                  />
                  <button 
                    onClick={applyCoupon}
                    className="btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                  >
                    Apply
                  </button>
                </div>
                {couponError && <span style={{ fontSize: '0.75rem', color: '#f43f5e' }}>{couponError}</span>}
                {discountPercent > 0 && <span style={{ fontSize: '0.75rem', color: '#10b981' }}>✓ 10% Farmer Discount Applied!</span>}

                {/* Delivery Address */}
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Farm Delivery Address:
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="input-field"
                    style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                    required
                  />
                </div>

                {/* Price Breakdown */}
                <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Items Subtotal:</span>
                    <strong style={{ color: 'var(--text-main)' }}>₹{subtotal.toLocaleString()}</strong>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                      <span>Farmer Discount ({discountPercent}%):</span>
                      <strong>-₹{discountAmount.toLocaleString()}</strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Doorstep Farm Delivery:</span>
                    <strong style={{ color: deliveryFee === 0 ? '#10b981' : 'var(--text-main)' }}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </strong>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '1.1rem', 
                    fontWeight: 800, 
                    color: 'var(--cyan)',
                    paddingTop: '6px',
                    borderTop: '1px solid var(--border-subtle)',
                    marginTop: '4px'
                  }}>
                    <span>Grand Total:</span>
                    <span>₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Confirm Order Button */}
                <button 
                  onClick={handleCheckout}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  <Truck size={18} />
                  <span>Confirm Farm Delivery</span>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
