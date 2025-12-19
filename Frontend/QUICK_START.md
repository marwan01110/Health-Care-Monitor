# Frontend Quick Start Guide

## Installation & Run

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000` (must be running)

### 3. Login
- URL: `http://localhost:3000/login`
- Credentials: Use your Django superuser account
- Example: `username: admin` / `password: (from setup)`

## Key Pages & Features

### 📊 Dashboard (`/dashboard`)
- Overview statistics
- Total patients
- Recent measurements
- High-risk cases count
- Quick patient & measurement list

**Actions:**
- View recent patient details
- Navigate to full patient/measurement lists

### 👥 Patients (`/patients`)
- List all patients
- **+ Add Patient** button
  - Form: Full Name, Date of Birth
  - Auto-saves to backend
- Delete patient
- View patient details

**Actions:**
- Click **View Details** to manage patient measurements

### 🏥 Patient Details (`/patients/{id}`)
- Patient information
- **Latest Measurement** card with all vitals
- AI risk prediction badge + score
- **+ Add Measurement** button
  - Form: HR, SpO₂, BP, RR, Temp
  - Auto-triggers AI prediction
  - Displays result immediately
- **Measurement History** list
  - All past measurements
  - Delete individual measurements

**Vital Signs Tracked:**
- ❤️ Heart Rate (bpm)
- 💨 SpO₂ / Oxygen Saturation (%)
- 🩺 Blood Pressure (Systolic/Diastolic mmHg)
- 🫁 Respiratory Rate (/min)
- 🌡️ Temperature (°C)

### 🔐 Authentication (`/login`)
- JWT-based login
- Automatic token refresh
- Protected routes (redirect to login if unauthorized)
- Logout button in sidebar

## UI Components & Buttons

### Buttons
- **Primary** (Blue): Main actions (Create, Save)
- **Secondary** (Gray): Cancel, less important actions
- **Success** (Green): Positive actions (Add, Record)
- **Danger** (Red): Destructive actions (Delete)
- **Outline**: Secondary navigation

### Risk Badges
- 🟢 **LOW** (Green): Risk score < 0.33
- 🟡 **MEDIUM** (Orange): Risk score 0.33-0.66
- 🔴 **HIGH** (Red): Risk score ≥ 0.66

### Forms
- Validation feedback (red error messages)
- Disabled submit while processing
- Clear labels and placeholders
- Numeric inputs with step controls

## API Endpoints Covered

| Method | Endpoint | Action |
|--------|----------|--------|
| POST | `/api/token/` | Login |
| POST | `/api/token/refresh/` | Refresh token |
| GET | `/api/health/patients/` | List patients |
| POST | `/api/health/patients/` | Create patient |
| GET | `/api/health/patients/{id}/` | Get patient |
| PATCH | `/api/health/patients/{id}/` | Update patient |
| DELETE | `/api/health/patients/{id}/` | Delete patient |
| GET | `/api/health/patients/{id}/measurements/` | List measurements |
| POST | `/api/health/patients/{id}/measurements/` | Create measurement |
| GET | `/api/health/measurements/{id}/` | Get measurement |
| DELETE | `/api/health/measurements/{id}/` | Delete measurement |
| GET | `/api/health/measurements/{id}/prediction/` | Get prediction |

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── UI.jsx           # Button, Card, Input, Badge, etc.
│   │   └── Layout.jsx       # Sidebar + Header layout
│   ├── pages/
│   │   ├── LoginPage.jsx    # Login form
│   │   ├── DashboardPage.jsx # Statistics & overview
│   │   ├── PatientsPage.jsx  # Patient list & add form
│   │   └── PatientDetailPage.jsx # Patient measurements
│   ├── App.jsx              # Routing configuration
│   ├── main.jsx             # React entry point
│   ├── api.js               # Axios client + endpoints
│   ├── store.js             # Zustand state management
│   └── index.css            # TailwindCSS + custom styles
├── index.html               # HTML template
├── vite.config.js           # Vite + backend proxy
├── tailwind.config.js       # Medical color scheme
└── package.json             # Dependencies
```

## Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
Output: `dist/` folder (ready for static hosting)

### Preview Build
```bash
npm run preview
```

## Troubleshooting

### "Cannot POST /api/token/" - Backend Not Running
**Solution**: Start Django backend
```bash
python manage.py runserver
```

### Login succeeds but redirect fails
**Solution**: Check browser console for errors
- Ensure backend is running
- Verify API proxy in vite.config.js

### Measurements not displayed after creation
**Solution**: 
- Refresh the page (F5)
- Check Django logs for prediction errors
- Verify all vital values are within safe bounds

### Styling issues / buttons look wrong
**Solution**:
- Clear browser cache (Ctrl+Shift+Del)
- Rebuild: `npm run build`
- Check that TailwindCSS compiled (look for `dist/` CSS files)

## Next Steps

1. ✅ Backend running at `http://localhost:8000`
2. ✅ Frontend running at `http://localhost:3000`
3. ✅ Create superuser: `python manage.py createsuperuser`
4. ✅ Train model: `python scripts/train_model.py`
5. ✅ Login with credentials
6. ✅ Create patients and record measurements
7. ✅ View AI-powered risk predictions

Enjoy! 🎉
