# 🦐 Well Aqua - Next-Gen Sustainable Aquaculture Platform

> **Comprehensive Shrimp & Fish Farm Intelligence, Doorstep Lab Diagnostics, Crop Telemetry, and Super-Admin Operations Platform**

Well Aqua is an all-in-one aquaculture operations and digital monitoring platform designed for coastal shrimp and fish farmers across Andhra Pradesh and India. It bridges real-time pond sensors, daily feeding logs, laboratory diagnostics, and administrative control into a single unified system.

---

## 🌟 Key Features

### 1. 🧑‍🌾 Farmer Digital Operations
- **Interactive Multi-Pond Dashboard**: Real-time Dissolved Oxygen (DO), pH, Salinity, Ammonia (TAN), Temperature, and Water Color monitoring.
- **Lunar & Molting Advisory**: High-precision lunar calendar tracking for full moon and new moon molting phases with mineral dosage recommendations.
- **Daily Feeding & Biomass Analytics**: Stocking count tracking, Survival Rate (SR %), Average Body Weight (ABW), and Feed Conversion Ratio (FCR).
- **Farm Performance Reports**: Comprehensive downloadable PDF reports for bank loans, CAA verification, and crop audits.
- **Bilingual Support**: Instant toggle between English and Telugu (తెలుగు).

### 2. 🧪 Accredited Lab Diagnostics Slot Booking
- Book doorstep sample collections for PCR virus testing (WSSV, EHP, IHHNV), comprehensive water chemistry, and bottom soil health.
- Real-time status tracking from sample collection to certified digital PDF report delivery.

### 3. 💊 Aquaculture Pharmacy & Probiotics Store
- Direct doorstep dispatch of certified bio-security minerals, oxygen enhancers (Oxy-Burst), yucca ammonia binders, and gut probiotics.
- Cart drawer with instant order summary and cash on delivery or digital payment.

### 4. 👑 Super-Admin Command Operations Center
- **Access**: Passcode protected with executive security (`Passcode: 9900`).
- **User Control**: Full roster of registered farmers, User ID generation (`AQ-AP-XXXX-XXXX`), 4-digit PIN management/reset, account suspension, and inspection mode.
- **Direct-to-Pond Telemetry Dispatcher**: Input accredited laboratory diagnostic test results for both water parameters and bottom soil (pH, Organic Carbon %, $H_2S$, Sludge Depth cm) and transmit live telemetry directly to the farmer's pond dashboard.
- **Statewide & District Broadcast System**: Dispatch cyclone/weather warnings, disease advisories, and market pricing alerts directly to farmer dashboards.

### 5. ☁️ Supabase Cloud Synchronization
- Native cloud persistence for:
  - `user_logins`: Registered farmer accounts, security PINs, and unique Farmer IDs.
  - `water_parameters`: Live Dissolved Oxygen, pH, Salinity, and Ammonia readings.
  - `lab_bookings`: Diagnostic appointments and technician assignments.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18 or v20+)
- npm

### Installation
```bash
# Clone the repository
git clone git@github.com:mohithkumarbaggu/aqua-farm.git
cd aqua-farm

# Install dependencies
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Build & Deployment

### Production Build
```bash
npm run build
```

### GitHub Pages Deployment
This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To deploy on GitHub Pages:
1. Push your code to the `main` branch.
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow will automatically build and publish the live site at:
   `https://mohithkumarbaggu.github.io/aqua-farm/`

---

## 🔒 Security & Environment Variables

Copy `.env.example` to `.env` and configure your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Note: `.env` is gitignored to protect your credentials).*

---

## 📄 License
MIT License. Developed for sustainable aquaculture and coastal farmers.
