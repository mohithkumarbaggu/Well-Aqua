-- =========================================================================
-- Well Aqua: Healthy and Sustainable Aquaculture
-- Comprehensive PostgreSQL Schema for Supabase
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 2. USER LOGIN CREDENTIALS & FARMER IDENTIFIER TABLE
-- (Directly visible in Supabase Table Editor under 'user_logins')
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.user_logins (
  id TEXT PRIMARY KEY,                       -- e.g. 'AQ-AP-1234-9921'
  user_id TEXT UNIQUE NOT NULL,              -- Distinct generated Farmer ID
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  pin_code TEXT NOT NULL,                    -- Quick 4-digit security PIN or password
  farm_name TEXT NOT NULL,
  location TEXT DEFAULT 'Bhimavaram, Andhra Pradesh',
  total_acres NUMERIC(6,2) DEFAULT 5.0,
  total_ponds INT DEFAULT 3,
  primary_species TEXT DEFAULT 'Vannamei Shrimp',
  role TEXT DEFAULT 'farmer',                -- 'farmer' or 'admin'
  created_at TIMESTAMPTZ DEFAULT now(),
  last_login_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 3. FARMER PROFILES TABLE (Linked with Supabase Auth)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  farmer_id TEXT,                            -- Custom Farmer User ID (e.g. 'AQ-AP-9848-1024')
  full_name TEXT NOT NULL,
  farm_name TEXT NOT NULL DEFAULT 'My Aqua Farm',
  phone TEXT,
  email TEXT,
  login_pin TEXT,                            -- 4-Digit Security PIN
  location TEXT DEFAULT 'Bhimavaram, Andhra Pradesh',
  caa_reg_no TEXT DEFAULT 'CAA/2024/AP/WG/48291',
  mpeda_id TEXT DEFAULT 'MPEDA-IND-AP-9921',
  total_acres NUMERIC(6,2) DEFAULT 5.0,
  total_ponds INT DEFAULT 3,
  primary_species TEXT DEFAULT 'Vannamei Shrimp',
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 4. PONDS TABLE (Operational Culture Ponds)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.ponds (
  id TEXT PRIMARY KEY DEFAULT ('pond_' || substr(md5(random()::text), 1, 8)),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL DEFAULT 'Vannamei Shrimp (Litopenaeus vannamei)',
  doc INT DEFAULT 48,
  area_hectares NUMERIC(4,2) DEFAULT 0.8,
  density_pl_m2 NUMERIC(6,2) DEFAULT 45,
  stocking_date DATE DEFAULT CURRENT_DATE - INTERVAL '48 days',
  current_biomass_kg NUMERIC(10,2) DEFAULT 4820,
  avg_body_weight_g NUMERIC(6,2) DEFAULT 14.8,
  survival_rate_pct NUMERIC(5,2) DEFAULT 88.5,
  fcr NUMERIC(4,2) DEFAULT 1.28,
  target_harvest_weight_g NUMERIC(6,2) DEFAULT 28.0,
  status TEXT DEFAULT 'Active Culture',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 5. WATER PARAMETERS LOG TABLE (Daily Pond Telemetry)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.water_parameters (
  id BIGSERIAL PRIMARY KEY,
  pond_id TEXT REFERENCES public.ponds(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ DEFAULT now(),
  dissolved_oxygen_ppm NUMERIC(4,2) NOT NULL,
  ph NUMERIC(4,2) NOT NULL,
  salinity_ppt NUMERIC(5,2) NOT NULL,
  alkalinity_ppm NUMERIC(6,2) NOT NULL,
  ammonia_ppm NUMERIC(5,3) NOT NULL,
  nitrite_ppm NUMERIC(5,3) NOT NULL,
  temperature_c NUMERIC(4,1) DEFAULT 29.5
);

-- =========================================================================
-- 6. LAB BOOKINGS TABLE (Water, Soil, Seed PCR Tests)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.lab_bookings (
  id TEXT PRIMARY KEY,
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  pond_id TEXT REFERENCES public.ponds(id) ON DELETE SET NULL,
  service_title TEXT NOT NULL,
  lab_name TEXT NOT NULL,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  mode TEXT DEFAULT 'Doorstep Farm Collection',
  status TEXT DEFAULT 'Sample Pickup Scheduled',
  price NUMERIC(10,2) NOT NULL,
  assigned_technician TEXT,
  farmer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 7. PHARMACY ORDERS TABLE (Medicines, Probiotics, Minerals)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.pharmacy_orders (
  id TEXT PRIMARY KEY,
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  coupon_code TEXT,
  delivery_address TEXT NOT NULL,
  payment_status TEXT DEFAULT 'Cash on Delivery',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 8. AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    farmer_id,
    full_name,
    farm_name,
    phone,
    email,
    login_pin,
    location,
    total_acres,
    total_ponds,
    primary_species
  ) VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'farmerId', 'AQ-AP-' || right(COALESCE(new.raw_user_meta_data->>'phone', '1234'), 4) || '-' || floor(random() * 8999 + 1000)::text),
    COALESCE(new.raw_user_meta_data->>'name', 'New Farmer'),
    COALESCE(new.raw_user_meta_data->>'farmName', 'Coastal Aqua Farm'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'pin', '1234'),
    COALESCE(new.raw_user_meta_data->>'location', 'Bhimavaram, Andhra Pradesh'),
    COALESCE((new.raw_user_meta_data->>'acres')::numeric, 5.0),
    COALESCE((new.raw_user_meta_data->>'pondCount')::int, 3),
    COALESCE(new.raw_user_meta_data->>'species', 'Vannamei Shrimp')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    farm_name = EXCLUDED.farm_name,
    phone = EXCLUDED.phone,
    updated_at = now();

  -- Also auto-insert to user_logins
  INSERT INTO public.user_logins (
    id,
    user_id,
    full_name,
    phone,
    email,
    pin_code,
    farm_name,
    location,
    total_acres,
    total_ponds,
    primary_species,
    role
  ) VALUES (
    COALESCE(new.raw_user_meta_data->>'farmerId', 'AQ-AP-' || right(COALESCE(new.raw_user_meta_data->>'phone', '1234'), 4) || '-' || floor(random() * 8999 + 1000)::text),
    COALESCE(new.raw_user_meta_data->>'farmerId', 'AQ-AP-' || right(COALESCE(new.raw_user_meta_data->>'phone', '1234'), 4) || '-' || floor(random() * 8999 + 1000)::text),
    COALESCE(new.raw_user_meta_data->>'name', 'New Farmer'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'pin', '1234'),
    COALESCE(new.raw_user_meta_data->>'farmName', 'Coastal Aqua Farm'),
    COALESCE(new.raw_user_meta_data->>'location', 'Bhimavaram, Andhra Pradesh'),
    COALESCE((new.raw_user_meta_data->>'acres')::numeric, 5.0),
    COALESCE((new.raw_user_meta_data->>'pondCount')::int, 3),
    COALESCE(new.raw_user_meta_data->>'species', 'Vannamei Shrimp'),
    'farmer'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    last_login_at = now();

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =========================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES & PERMISSIONS
-- =========================================================================
ALTER TABLE public.user_logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ponds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_orders ENABLE ROW LEVEL SECURITY;

-- user_logins policies: allow anon & authenticated full access
DROP POLICY IF EXISTS "Allow public read user_logins" ON public.user_logins;
CREATE POLICY "Allow public read user_logins" ON public.user_logins FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert user_logins" ON public.user_logins;
CREATE POLICY "Allow public insert user_logins" ON public.user_logins FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update user_logins" ON public.user_logins;
CREATE POLICY "Allow public update user_logins" ON public.user_logins FOR UPDATE USING (true);

-- profiles policies: allow open select and insert
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
CREATE POLICY "Users can view profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (true);

-- ponds policies
DROP POLICY IF EXISTS "Farmers can view ponds" ON public.ponds;
CREATE POLICY "Farmers can view ponds" ON public.ponds FOR SELECT USING (true);

DROP POLICY IF EXISTS "Farmers can insert ponds" ON public.ponds;
CREATE POLICY "Farmers can insert ponds" ON public.ponds FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Farmers can update their ponds" ON public.ponds;
CREATE POLICY "Farmers can update their ponds" ON public.ponds FOR UPDATE USING (true);

-- lab bookings & pharmacy orders
DROP POLICY IF EXISTS "Farmers can view their bookings" ON public.lab_bookings;
CREATE POLICY "Farmers can view their bookings" ON public.lab_bookings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Farmers can create bookings" ON public.lab_bookings;
CREATE POLICY "Farmers can create bookings" ON public.lab_bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Farmers can view their orders" ON public.pharmacy_orders;
CREATE POLICY "Farmers can view their orders" ON public.pharmacy_orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Farmers can create orders" ON public.pharmacy_orders;
CREATE POLICY "Farmers can create orders" ON public.pharmacy_orders FOR INSERT WITH CHECK (true);

-- GRANT PERMISSIONS TO anon and authenticated
GRANT ALL ON TABLE public.user_logins TO anon, authenticated;
GRANT ALL ON TABLE public.profiles TO anon, authenticated;
GRANT ALL ON TABLE public.ponds TO anon, authenticated;
GRANT ALL ON TABLE public.water_parameters TO anon, authenticated;
GRANT ALL ON TABLE public.lab_bookings TO anon, authenticated;
GRANT ALL ON TABLE public.pharmacy_orders TO anon, authenticated;

-- =========================================================================
-- 10. PRE-SEEDED USER LOGIN DETAILS FOR VERIFICATION & IMMEDIATE VISIBILITY
-- =========================================================================
INSERT INTO public.user_logins (
  id, user_id, full_name, phone, email, pin_code, farm_name, location, total_acres, total_ponds, primary_species, role
) VALUES 
(
  'AQ-AP-1234-9921',
  'AQ-AP-1234-9921',
  'Mohith Kumar Baggu',
  '+91 98480 12345',
  'mohith.baggu@wellaqua.farm',
  '1234',
  'Srimannarayana Coastal Aqua Farm',
  'Bhimavaram, West Godavari District, Andhra Pradesh',
  6.5,
  3,
  'Vannamei Shrimp (Litopenaeus vannamei)',
  'farmer'
),
(
  'AQ-AP-5678-8840',
  'AQ-AP-5678-8840',
  'Venkata Ramana Raju',
  '+91 94401 55678',
  'v.raju@godavarisunrise.in',
  '5678',
  'Godavari Sunrise Prawn Hatcheries',
  'Kaikaluru, Eluru District, Andhra Pradesh',
  9.0,
  4,
  'Vannamei Shrimp (Litopenaeus vannamei)',
  'farmer'
),
(
  'AQ-AP-7412-7321',
  'AQ-AP-7412-7321',
  'K. Subrahmanyam Chowdary',
  '+91 98492 77412',
  'ksc.aqua@gmail.com',
  '4321',
  'Sri Venkateswara Coastal Farms',
  'Machilipatnam, Krishna District, Andhra Pradesh',
  12.5,
  5,
  'Black Tiger Prawn (Penaeus monodon)',
  'farmer'
),
(
  'AQ-ADMIN-9900-0001',
  'AQ-ADMIN-9900-0001',
  'Well Aqua System Administrator',
  '+91 99000 99000',
  'admin@wellaqua.farm',
  '9900',
  'Well Aqua Central Administrative Portal',
  'Bhimavaram Central Command, Andhra Pradesh',
  100.0,
  50,
  'Integrated Coastal Species',
  'admin'
)
ON CONFLICT (user_id) DO NOTHING;
