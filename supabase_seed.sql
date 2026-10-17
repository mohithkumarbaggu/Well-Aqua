-- =========================================================================
-- Well Aqua: Optional Seed Data for Supabase
-- Run this in the Supabase SQL Editor after running supabase_schema.sql
-- =========================================================================

-- Insert Starter Ponds
INSERT INTO public.ponds (id, name, species, doc, area_hectares, density_pl_m2, current_biomass_kg, avg_body_weight_g, survival_rate_pct, fcr, status)
VALUES
  ('pond_1', 'Pond #1 (North Gate)', 'Vannamei Shrimp (Litopenaeus vannamei)', 48, 0.8, 45, 4820, 14.8, 88.5, 1.28, 'Active Culture'),
  ('pond_2', 'Pond #2 (Creek Side)', 'Black Tiger Prawn (Penaeus monodon)', 62, 1.2, 28, 5400, 21.4, 82.0, 1.42, 'Active Culture'),
  ('pond_3', 'Pond #3 (Aerator Block)', 'GIFT Tilapia (Oreochromis niloticus)', 35, 0.6, 60, 3100, 120.0, 94.0, 1.15, 'Active Culture')
ON CONFLICT (id) DO NOTHING;

-- Insert Recent Water Quality Parameters for Pond #1
INSERT INTO public.water_parameters (pond_id, recorded_at, dissolved_oxygen_ppm, ph, salinity_ppt, alkalinity_ppm, ammonia_ppm, nitrite_ppm, temperature_c)
VALUES
  ('pond_1', now(), 4.8, 7.8, 14.5, 138, 0.04, 0.02, 29.4),
  ('pond_1', now() - INTERVAL '6 hours', 5.2, 7.9, 14.6, 140, 0.03, 0.02, 28.9),
  ('pond_1', now() - INTERVAL '12 hours', 4.1, 7.7, 14.5, 136, 0.06, 0.03, 27.8),
  ('pond_2', now(), 5.1, 8.0, 18.2, 145, 0.02, 0.01, 29.8),
  ('pond_3', now(), 5.6, 7.6, 8.0, 125, 0.01, 0.01, 30.1);

-- Insert Starter Lab Booking
INSERT INTO public.lab_bookings (id, pond_id, service_title, lab_name, booking_date, time_slot, mode, status, price, assigned_technician, farmer_notes)
VALUES
  ('LAB-2026-8821', 'pond_1', 'Comprehensive 12-Parameter Water Chemistry Profile', 'AquaCare Advanced Diagnostic Lab (Bhimavaram)', CURRENT_DATE + INTERVAL '1 day', '07:00 AM - 08:30 AM', 'Doorstep Farm Collection', 'Sample Pickup Scheduled', 850.00, 'K. Subba Rao (+91 98492 88123)', 'Standard pre-molting check')
ON CONFLICT (id) DO NOTHING;
