import React, { useState } from 'react';
import { 
  LAB_SERVICES, 
  CERTIFIED_LABS 
} from '../data/mockData';
import { 
  FlaskConical, 
  Calendar, 
  Clock, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Phone, 
  AlertTriangle, 
  ChevronRight, 
  Star, 
  X,
  Filter,
  Sparkles,
  ArrowRight,
  Droplets,
  Microscope,
  Info
} from 'lucide-react';

export default function LabBookingSection({ 
  user,
  activePond, 
  ponds, 
  bookings, 
  setBookings, 
  setSelectedReport, 
  setIsReportModalOpen,
  showToast 
}) {
  const [selectedService, setSelectedService] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  // Booking Form State
  const [selectedPondId, setSelectedPondId] = useState(activePond?.id || ponds[0]?.id);
  const [selectedLabId, setSelectedLabId] = useState(CERTIFIED_LABS[0].id);
  const [collectionMode, setCollectionMode] = useState('Doorstep Farm Collection');
  const [bookingDate, setBookingDate] = useState('2026-10-18');
  const [bookingTime, setBookingTime] = useState('06:30 AM - 08:00 AM');
  const [farmerPhone, setFarmerPhone] = useState(user?.phone || '');
  const [farmerNotes, setFarmerNotes] = useState('');
  const [bookingSuccessAlert, setBookingSuccessAlert] = useState(null);

  // Sync phone when logged in user changes
  React.useEffect(() => {
    if (user?.phone) {
      setFarmerPhone(user.phone);
    }
  }, [user]);

  // Filter service categories
  const [serviceCategory, setServiceCategory] = useState('ALL');

  const filteredServices = LAB_SERVICES.filter(s => 
    serviceCategory === 'ALL' || s.category === serviceCategory
  );

  const handleOpenBooking = (service) => {
    setSelectedService(service);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    const lab = CERTIFIED_LABS.find(l => l.id === selectedLabId);
    const pond = ponds.find(p => p.id === selectedPondId) || activePond;

    const newBookingId = `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: newBookingId,
      serviceTitle: selectedService.title,
      pondName: pond?.name || 'Selected Pond',
      labName: lab ? lab.name : 'AquaCare Advanced Diagnostic Lab',
      date: bookingDate,
      timeSlot: bookingTime,
      mode: collectionMode,
      status: 'Sample Pickup Scheduled',
      statusStep: 1,
      assignedTechnician: 'K. Subba Rao (+91 98492 88123)',
      price: selectedService.price,
      farmerNotes: farmerNotes || 'Standard pre-molting check',
      hasReport: false
    };

    setBookings([newBooking, ...bookings]);
    setIsBookingModalOpen(false);
    if (showToast) {
      showToast(`Sample Pickup Scheduled for ${pond?.name || 'Pond'}!`, 'success');
    }
    setBookingSuccessAlert({
      id: newBookingId,
      title: selectedService.title,
      date: bookingDate,
      time: bookingTime
    });

    // Auto clear alert after 6 seconds
    setTimeout(() => {
      setBookingSuccessAlert(null);
    }, 6000);
  };

  const viewMockReport = (booking) => {
    setSelectedReport(booking);
    setIsReportModalOpen(true);
  };

  const categoryList = [
    { id: 'ALL', label: 'All Panels', count: LAB_SERVICES.length },
    { id: 'Water Testing', label: 'Water Quality', count: LAB_SERVICES.filter(s => s.category === 'Water Testing').length },
    { id: 'Soil Testing', label: 'Soil Health', count: LAB_SERVICES.filter(s => s.category === 'Soil Testing').length },
    { id: 'Seed Testing', label: 'PCR Seed Screen', count: LAB_SERVICES.filter(s => s.category === 'Seed Testing').length },
    { id: 'Microbiology', label: 'Vibrio & Micro', count: LAB_SERVICES.filter(s => s.category === 'Microbiology').length }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      
      {/* ================= 1. PREMIUM HERO HEADER ================= */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '28px', 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '1px solid #bfdbfe',
          borderRadius: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute',
          right: '-15px',
          top: '-15px',
          fontSize: '8rem',
          opacity: 0.04,
          userSelect: 'none',
          pointerEvents: 'none'
        }}>
          🔬
        </div>

        <div style={{ maxWidth: '850px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <span className="badge badge-cyan" style={{ fontSize: '0.74rem', padding: '3px 10px' }}>
              ✓ NABL & CAA Accredited Testing
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.74rem', padding: '3px 10px' }}>
              🚚 Doorstep Farm Pickup (2-Hr Dispatch)
            </span>
          </div>

          <h1 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            Pond Water, Soil & Seed Lab Testing (ల్యాబ్ పరీక్షలు)
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.5, margin: 0 }}>
            Book certified cold-chain testing for DO, TAN, Alkalinity, Vibrio count, and PCR pathogen detection. 
            Field technicians collect samples directly at your pond dyke with verified digital reports delivered within 6 hours.
          </p>

          {/* Quick Value Metrics */}
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            flexWrap: 'wrap', 
            marginTop: '18px', 
            paddingTop: '16px', 
            borderTop: '1px solid rgba(2, 132, 199, 0.12)',
            fontSize: '0.84rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--cyan)" />
              <span>Report Delivery: <strong>Within 6 - 8 Hours</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>Certified Equipment: <strong>Digital Photometer & Real-time PCR</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={16} color="#f59e0b" />
              <span>Technician Rating: <strong>4.9 / 5 (West Godavari Network)</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. SUCCESS ALERT NOTIFICATION ================= */}
      {bookingSuccessAlert && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-md)',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#10b981',
              color: '#ffffff',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <strong style={{ color: '#065f46', fontSize: '0.98rem' }}>
                Slot Booked Successfully! (Booking ID: {bookingSuccessAlert.id})
              </strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>
                Field technician assigned for <strong>{bookingSuccessAlert.date} ({bookingSuccessAlert.time})</strong>. 
                Keep sample pond gate accessible.
              </div>
            </div>
          </div>
          <button 
            onClick={() => setBookingSuccessAlert(null)} 
            style={{ color: 'var(--text-muted)', padding: '6px', borderRadius: '6px' }}
            title="Dismiss notification"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* ================= 3. ACTIVE BOOKINGS & SAMPLE TRACKER ================= */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: 800 }}>
              <Clock size={20} color="var(--cyan)" />
              <span>Active Test Bookings & Tracking (ల్యాబ్ ట్రాకింగ్)</span>
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Real-time cold-chain tracking from pond site sample collection to final laboratory analysis.
            </p>
          </div>
          <span className="badge badge-cyan" style={{ fontSize: '0.78rem', padding: '4px 10px', fontWeight: 700 }}>
            {bookings.length} Active Test{bookings.length !== 1 ? 's' : ''}
          </span>
        </div>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--text-muted)', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px dashed var(--border-subtle)' }}>
            <FlaskConical size={36} color="var(--cyan)" style={{ margin: '0 auto 10px', opacity: 0.7 }} />
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>No Active Lab Tests Scheduled</div>
            <p style={{ fontSize: '0.85rem', margin: '4px 0 16px' }}>Select an accredited testing panel below to book doorstep pickup.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {bookings.map((booking) => (
              <div 
                key={booking.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '20px',
                  transition: 'var(--transition)'
                }}
              >
                {/* Booking Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ maxWidth: '650px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-main)' }}>
                        {booking.serviceTitle}
                      </span>
                      <span className="badge badge-cyan" style={{ fontFamily: 'monospace', fontSize: '0.74rem' }}>
                        {booking.id}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span>Pond: <strong style={{ color: 'var(--text-main)' }}>{booking.pondName}</strong></span>
                      <span>•</span>
                      <span>Lab: <strong style={{ color: 'var(--text-main)' }}>{booking.labName}</strong></span>
                      <span>•</span>
                      <span style={{ color: '#d97706', fontWeight: 600 }}>Slot: {booking.date} ({booking.timeSlot})</span>
                    </div>
                  </div>

                  {/* Status Badge & Action Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span className={`badge ${booking.statusStep === 4 ? 'badge-emerald' : 'badge-amber'}`} style={{ padding: '4px 10px' }}>
                      {booking.status}
                    </span>
                    
                    {booking.hasReport ? (
                      <button 
                        onClick={() => viewMockReport(booking)}
                        className="btn-emerald"
                        style={{ padding: '8px 16px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FileText size={15} />
                        <span>View Certified Report</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => viewMockReport({
                          ...booking,
                          hasReport: true,
                          reportSummary: {
                            status: 'OPTIMAL_WITH_ADVISORY',
                            conclusion: 'DO is healthy. Slight elevation in TAN (0.35 mg/L). Probiotic dosing recommended.',
                            testedParameters: [
                              { name: 'pH (Morning 7 AM)', result: '7.9', status: 'normal' },
                              { name: 'Dissolved Oxygen (DO)', result: '5.2 ppm', status: 'normal' },
                              { name: 'Salinity', result: '17.0 ppt', status: 'normal' },
                              { name: 'Total Ammonia (TAN)', result: '0.35 mg/L', status: 'warning' },
                              { name: 'Total Alkalinity', result: '142 ppm', status: 'normal' },
                              { name: 'Calcium (Ca++)', result: '320 ppm', status: 'normal' },
                              { name: 'Magnesium (Mg++)', result: '980 ppm', status: 'normal' },
                              { name: 'Ca:Mg Ratio', result: '1 : 3.06 (Ideal)', status: 'normal' }
                            ]
                          }
                        })}
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FileText size={15} />
                        <span>Preview Live Report</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Stepper with Clean Visual Indicators */}
                <div style={{ 
                  background: 'rgba(2, 132, 199, 0.04)', 
                  border: '1px solid rgba(2, 132, 199, 0.1)',
                  padding: '14px 18px', 
                  borderRadius: '10px'
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600, color: booking.statusStep >= 0 ? 'var(--cyan)' : 'var(--text-dim)' }}>
                      <CheckCircle2 size={16} color={booking.statusStep >= 0 ? '#0284c7' : '#94a3b8'} />
                      <span>1. Slot Booked</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600, color: booking.statusStep >= 1 ? 'var(--cyan)' : 'var(--text-dim)' }}>
                      <CheckCircle2 size={16} color={booking.statusStep >= 1 ? '#0284c7' : '#94a3b8'} />
                      <span>2. Tech Dispatched</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600, color: booking.statusStep >= 2 ? 'var(--cyan)' : 'var(--text-dim)' }}>
                      <CheckCircle2 size={16} color={booking.statusStep >= 2 ? '#0284c7' : '#94a3b8'} />
                      <span>3. Lab Testing</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600, color: booking.statusStep >= 4 ? '#10b981' : 'var(--text-dim)' }}>
                      <CheckCircle2 size={16} color={booking.statusStep >= 4 ? '#10b981' : '#94a3b8'} />
                      <span>4. Report Issued</span>
                    </div>
                  </div>
                </div>

                {/* Field Executive Info Bar */}
                {booking.assignedTechnician && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Truck size={15} color="var(--cyan)" />
                      <span>Doorstep Collection Field Agent: <strong style={{ color: 'var(--text-main)' }}>{booking.assignedTechnician}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 600 }}>
                      <ShieldCheck size={14} />
                      <span>Sample Ice-Box Verified</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= 4. DIAGNOSTIC PANELS CATALOG ================= */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>Scientific Testing</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>రైతు డయాగ్నస్టిక్ ప్యానెల్స్</span>
            </div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>
              Available Lab Diagnostic Panels
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
              Select tests tailored to your pond's days of culture (DOC), molting schedule, or upcoming harvest.
            </p>
          </div>

          {/* Category Filter Pills (Horizontal Scroll on Mobile) */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto', 
            paddingBottom: '4px',
            maxWidth: '100%',
            scrollbarWidth: 'none'
          }}>
            {categoryList.map((cat) => {
              const isActive = serviceCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setServiceCategory(cat.id)}
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    borderRadius: '24px',
                    border: isActive ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                    background: isActive ? 'rgba(2, 132, 199, 0.1)' : '#ffffff',
                    color: isActive ? 'var(--cyan)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'var(--transition)'
                  }}
                >
                  <span>{cat.label}</span>
                  <span style={{ 
                    fontSize: '0.72rem', 
                    background: isActive ? 'var(--cyan)' : 'rgba(0,0,0,0.06)', 
                    color: isActive ? '#fff' : 'var(--text-muted)', 
                    padding: '1px 6px', 
                    borderRadius: '10px' 
                  }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnostic Cards Grid */}
        <div className="catalog-grid" style={{ gap: '22px' }}>
          {filteredServices.map(service => (
            <div 
              key={service.id} 
              className="glass-panel service-card"
              style={{
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                border: '1px solid var(--border-subtle)',
                background: '#ffffff'
              }}
            >
              <div>
                {/* Header Row: Category & Quality Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.74rem' }}>
                    {service.category}
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                    ⭐ {service.badge}
                  </span>
                </div>

                {/* Service Title & Description */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.3 }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {service.description}
                </p>

                {/* Key Metrics Info Box */}
                <div style={{ 
                  background: 'rgba(2, 132, 199, 0.04)', 
                  border: '1px solid rgba(2, 132, 199, 0.1)',
                  padding: '12px 14px', 
                  borderRadius: '10px', 
                  marginBottom: '16px', 
                  fontSize: '0.82rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <Clock size={15} color="var(--cyan)" />
                    <span>Report Turnaround: <strong style={{ color: 'var(--text-main)' }}>{service.turnaround}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    <FlaskConical size={15} color="#10b981" />
                    <span>Sample Required: <strong style={{ color: 'var(--text-main)' }}>{service.sampleType}</strong></span>
                  </div>
                </div>

                {/* Parameters Tested Tags */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    Included Parameters ({service.parameters.length}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {service.parameters.slice(0, 5).map((param, pIdx) => (
                      <span 
                        key={pIdx} 
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(2, 132, 199, 0.08)',
                          border: '1px solid rgba(2, 132, 199, 0.15)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          color: '#0369a1',
                          fontWeight: 500
                        }}
                      >
                        ✓ {param}
                      </span>
                    ))}
                    {service.parameters.length > 5 && (
                      <span style={{ fontSize: '0.74rem', color: 'var(--cyan)', fontWeight: 700, padding: '3px 4px' }}>
                        +{service.parameters.length - 5} more parameters
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Booking Action */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: 'auto'
              }}>
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Per Panel Fee
                  </span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ₹{service.price}
                  </div>
                </div>

                <button 
                  onClick={() => handleOpenBooking(service)}
                  className="btn-primary"
                  style={{ 
                    padding: '9px 18px', 
                    fontSize: '0.88rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    borderRadius: '10px'
                  }}
                >
                  <Calendar size={15} />
                  <span>Book Slot</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ================= 5. ACCREDITED LAB PARTNERS ================= */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
              <ShieldCheck size={20} color="#10b981" />
              <span>Accredited Coastal Aquaculture Laboratories</span>
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              NABL accredited diagnostic centers partnered with Well Aqua for cold-chain water, soil, and shrimp pathology testing.
            </p>
          </div>
          <span className="badge badge-emerald">
            ✓ NABL / CAA Certified
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '16px' }}>
          {CERTIFIED_LABS.map(lab => (
            <div 
              key={lab.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'var(--transition)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
                    {lab.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#b45309', background: '#fef3c7', padding: '2px 6px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700 }}>
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <span>{lab.rating}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="var(--cyan)" />
                  <span>{lab.address} (<strong>{lab.distance}</strong> from farm)</span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Operating Hours: <strong style={{ color: 'var(--text-main)' }}>{lab.timings}</strong>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                fontSize: '0.82rem', 
                paddingTop: '10px', 
                borderTop: '1px solid var(--border-subtle)' 
              }}>
                <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                  ✓ Doorstep Field Pickup
                </span>
                <a 
                  href={`tel:${lab.phone}`} 
                  style={{ color: 'var(--cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Phone size={13} />
                  <span>{lab.phone}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= 6. BOOKING MODAL OVERLAY ================= */}
      {isBookingModalOpen && selectedService && (
        <div className="modal-overlay" onClick={() => setIsBookingModalOpen(false)}>
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '560px', 
              padding: '28px',
              borderRadius: '20px',
              background: '#ffffff'
            }}
          >
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>{selectedService.category}</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '6px', color: 'var(--text-main)' }}>
                  Schedule Doorstep Test Slot
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Book a field sample collection technician to visit your farm dyke.
                </p>
              </div>
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                style={{ color: 'var(--text-muted)', padding: '6px', borderRadius: '8px' }}
                title="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Service Summary Strip */}
              <div style={{ 
                background: 'rgba(2, 132, 199, 0.06)', 
                border: '1px solid rgba(2, 132, 199, 0.15)',
                padding: '14px 16px', 
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                    {selectedService.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Turnaround: {selectedService.turnaround} • Sample: {selectedService.sampleType}
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--cyan)' }}>
                  ₹{selectedService.price}
                </div>
              </div>

              {/* Select Pond */}
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Select Sample Pond (చెరువు ఎంపిక):
                </label>
                <select
                  value={selectedPondId}
                  onChange={(e) => setSelectedPondId(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem' }}
                  required
                >
                  {ponds.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.species} (DOC {p.doc} Days)
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Laboratory */}
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Select Certified Testing Lab (ల్యాబ్ ఎంపిక):
                </label>
                <select
                  value={selectedLabId}
                  onChange={(e) => setSelectedLabId(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem' }}
                  required
                >
                  {CERTIFIED_LABS.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} - {l.distance} (⭐ {l.rating})
                    </option>
                  ))}
                </select>
              </div>

              {/* Collection Mode Segmented Switch */}
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Sample Collection Mode:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setCollectionMode('Doorstep Farm Collection')}
                    style={{
                      padding: '11px',
                      borderRadius: '10px',
                      border: collectionMode === 'Doorstep Farm Collection' ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                      background: collectionMode === 'Doorstep Farm Collection' ? 'rgba(2, 132, 199, 0.1)' : '#ffffff',
                      color: collectionMode === 'Doorstep Farm Collection' ? 'var(--cyan)' : 'var(--text-muted)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <Truck size={16} />
                    <span>Doorstep Pickup</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCollectionMode('Direct Drop-Off at Lab')}
                    style={{
                      padding: '11px',
                      borderRadius: '10px',
                      border: collectionMode === 'Direct Drop-Off at Lab' ? '2px solid var(--cyan)' : '1px solid var(--border-subtle)',
                      background: collectionMode === 'Direct Drop-Off at Lab' ? 'rgba(2, 132, 199, 0.1)' : '#ffffff',
                      color: collectionMode === 'Direct Drop-Off at Lab' ? 'var(--cyan)' : 'var(--text-muted)',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <FlaskConical size={16} />
                    <span>Direct Drop-off</span>
                  </button>
                </div>
              </div>

              {/* Date & Time Slot Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                    Scheduled Date:
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', fontSize: '0.86rem' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                    Preferred Time Slot:
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', fontSize: '0.86rem' }}
                    required
                  >
                    <option value="06:30 AM - 08:00 AM">06:30 AM - 08:00 AM (Best for DO)</option>
                    <option value="08:00 AM - 09:30 AM">08:00 AM - 09:30 AM</option>
                    <option value="11:00 AM - 12:30 PM">11:00 AM - 12:30 PM</option>
                    <option value="04:00 PM - 05:30 PM">04:00 PM - 05:30 PM</option>
                  </select>
                </div>
              </div>

              {/* Farmer Phone / WhatsApp */}
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Farmer Phone / WhatsApp (ఫ్రెండ్లీ ఫోన్ నంబర్):
                </label>
                <input
                  type="tel"
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '0.88rem' }}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  Pond Dykes & Landmarks (Optional):
                </label>
                <input
                  type="text"
                  value={farmerNotes}
                  onChange={(e) => setFarmerNotes(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '0.86rem' }}
                  placeholder="e.g. Near North Sluice Gate; collect sample 2 feet below water surface"
                />
              </div>

              {/* Modal Footer with Total & Submit */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginTop: '10px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'block' }}>Total Fee (Pay at Collection)</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--cyan)' }}>
                    ₹{selectedService.price}
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ padding: '11px 24px', fontSize: '0.92rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <CheckCircle2 size={18} />
                  <span>Confirm Slot Booking</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
