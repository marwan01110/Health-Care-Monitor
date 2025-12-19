# Health Monitor Frontend

Modern React-based medical dashboard for patient health monitoring, measurements tracking, and AI-powered risk predictions.

## Features

✅ **Authentication**
- JWT-based login system
- Secure token management with automatic refresh

✅ **Patient Management**
- Create, view, and manage patients
- Patient profile with date of birth tracking
- Bulk operations support

✅ **Vital Measurements**
- Record comprehensive vital signs:
  - Heart Rate (bpm)
  - Oxygen Saturation - SpO₂ (%)
  - Blood Pressure (Systolic/Diastolic mmHg)
  - Respiratory Rate (/min)
  - Temperature (°C)
- Measurement history with timestamps
- Auto-triggered AI predictions

✅ **Risk Prediction**
- Real-time AI-powered risk assessment
- Risk levels: Low, Medium, High
- Risk score display (0-1 scale)
- Prediction confidence and source information

✅ **Dashboard**
- Overview statistics
- Recent patients list
- Recent measurements
- High-risk cases monitoring

✅ **Professional Medical UI**
- Clean, intuitive interface
- Color-coded risk levels
- Responsive design for desktop/tablet
- Medical-appropriate color scheme

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── UI.jsx           # Reusable UI components
│   │   └── Layout.jsx       # Main layout with sidebar
│   ├── pages/
│   │   ├── LoginPage.jsx    # Authentication page
│   │   ├── DashboardPage.jsx # Main dashboard
│   │   ├── PatientsPage.jsx  # Patient management
│   │   └── PatientDetailPage.jsx # Patient details & measurements
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   ├── api.js               # API client and endpoints
│   ├── store.js             # Zustand state stores
│   └── index.css            # Tailwind & custom styles
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Dependencies
└── README.md                # This file
```

## Setup & Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Backend URL
Backend is proxied at `http://localhost:8000/api` in `vite.config.js`. Update if your backend runs elsewhere:

```js
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:8000',
      changeOrigin: true,
    }
  }
}
```

### 3. Run Development Server
```bash
npm run dev
```
Opens at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```
Output: `dist/` folder

## API Integration

All API endpoints are covered:

### Authentication
- `POST /api/auth/login/` - Login (username, password)
- `POST /api/auth/token/refresh/` - Refresh access token

### Patients
- `GET /api/health/patients/` - List all patients
- `POST /api/health/patients/` - Create new patient
- `GET /api/health/patients/{id}/` - Get patient details
- `PATCH /api/health/patients/{id}/` - Update patient
- `DELETE /api/health/patients/{id}/` - Delete patient

### Measurements
- `GET /api/health/patients/{patient_id}/measurements/` - List measurements
- `POST /api/health/patients/{patient_id}/measurements/` - Create measurement
- `GET /api/health/measurements/{id}/` - Get measurement details
- `DELETE /api/health/measurements/{id}/` - Delete measurement

### Predictions
- `GET /api/health/measurements/{measurement_id}/prediction/` - Get risk prediction

## Usage Guide

### 1. Login
1. Visit `http://localhost:3000/login`
2. Enter credentials (set up via Django: `python manage.py createsuperuser`)
3. Dashboard loads automatically after successful login

### 2. Manage Patients
1. Navigate to **Patients** → **+ Add Patient**
2. Enter patient name and date of birth
3. Click **Create Patient**
4. View patient list, click **View Details** for patient-specific data

### 3. Record Measurements
1. Open patient details page
2. Click **+ Add Measurement**
3. Enter vital signs (HR, SpO₂, BP, RR, Temp)
4. Click **Save Measurement**
5. AI prediction runs automatically and displays risk level

### 4. View Dashboard
1. Navigate to **Dashboard**
2. See key statistics:
   - Total patients
   - Recent measurements
   - High-risk cases
3. Monitor recent activity

## Component Reference

### UI Components (`components/UI.jsx`)
- `Button` - Customizable button with variants
- `Card` - Card container with shadow
- `Input` - Text input with validation
- `Select` - Dropdown select
- `Badge` - Risk level badge
- `Alert` - Alert messages
- `Loading` - Loading spinner
- `VitalCard` - Vital sign display card

### Layout (`components/Layout.jsx`)
- Sidebar navigation
- User info display
- Logout button
- Responsive design

### State Management (`store.js`)
- `useAuthStore` - Authentication state
- `usePatientStore` - Patients data
- `useMeasurementStore` - Measurements data

### API Client (`api.js`)
- Automatic token injection
- Token refresh interceptor
- Organized API methods by resource

## Color Scheme (Medical Design)

- **Primary**: Medical blue (`medical-600`)
- **Success**: Green for low risk
- **Warning**: Yellow/orange for medium risk
- **Danger**: Red for high risk
- **Neutral**: Gray for secondary info

## Security Features

- JWT authentication with token refresh
- Protected routes (redirect to login if unauthorized)
- Automatic logout on token expiration
- Secure local storage for tokens

## Styling Guide

### Custom Classes
- `.btn-primary` / `.btn-secondary` / `.btn-danger` - Buttons
- `.card` - Card container
- `.input-field` - Input styling
- `.badge-low` / `.badge-medium` / `.badge-high` - Risk badges
- `.vital-card` - Vital sign display
- `.vital-value` - Large vital numbers
- `.vital-label` - Vital labels

### Responsive Breakpoints
- Mobile: Default
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

## Troubleshooting

### "Cannot GET /api/..." - Backend Not Running
- Ensure Django backend is running: `python manage.py runserver`
- Verify backend URL in `vite.config.js`

### Login fails with "Invalid credentials"
- Check username and password
- Ensure user exists: `python manage.py createsuperuser`

### Measurements not showing
- Verify measurements were created for the patient
- Check browser console for API errors
- Ensure backend API is accessible

### Build errors
- Clear `node_modules` and `package-lock.json`
- Reinstall: `npm install`

## Performance Tips

- Backend API calls are proxied through Vite dev server
- State is persisted in Zustand (in-memory)
- Lazy loading of routes possible with code splitting
- Build generates optimized bundles with tree-shaking

## Future Enhancements

- Export measurements to PDF
- Charts/graphs for vital trends
- SMS/Email alerts for high-risk cases
- Multi-language support
- Dark mode
- Real-time WebSocket updates
- Mobile app (React Native)

## License

MIT
