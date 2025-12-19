# Health Care Monitoring Project - Complete User & Developer Guide

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [System Architecture](#system-architecture)
4. [Frontend User Guide](#frontend-user-guide)
5. [Backend Development Guide](#backend-development-guide)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Installation & Setup](#installation--setup)
9. [Configuration](#configuration)
10. [Troubleshooting](#troubleshooting)
11. [Deployment Guide](#deployment-guide)
12. [Security Best Practices](#security-best-practices)

---

## Quick Start

### For End Users

1. **Open Application**
   ```
   Frontend: http://localhost:3000 or http://localhost:5173
   ```

2. **Create Account**
   - Click "Register" on login page
   - Enter username, email, password
   - Click "Create Account"

3. **Login**
   - Enter username and password
   - Click "Login"
   - You'll be redirected to Dashboard

4. **Manage Patients**
   - Go to "Patients" page
   - Click "+ Add Patient"
   - Enter name and date of birth
   - Click "Create Patient"

5. **Record Measurements**
   - View a patient's details
   - Click "+ Add Measurement"
   - Enter vital signs:
     - Heart Rate (30-200 bpm)
     - SpO₂ (50-100%)
     - Systolic/Diastolic BP (40-300 mmHg)
     - Respiratory Rate (optional)
     - Temperature (35-42°C)
   - Click "Save Measurement"
   - System automatically generates risk prediction

6. **View Predictions**
   - Go to "Predictions" page
   - See risk levels: Low, Medium, High
   - Filter by risk level
   - Click "View Patient" to see details

### For Developers

1. **Backend Setup**
   ```powershell
   cd Backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

2. **Frontend Setup**
   ```powershell
   cd Frontend
   npm install
   npm run dev
   ```

3. **Access**
   - Backend API: http://localhost:8000
   - Frontend: http://localhost:5173

---

## Project Overview

### What is This?

A Health Care Monitoring web application that:
- ✅ Manages patient records
- ✅ Records vital signs measurements
- ✅ Predicts health risks using AI
- ✅ Tracks patient history
- ✅ Provides risk assessment dashboard

### Tech Stack

**Backend:**
- Django 5.2.8 (Python web framework)
- Django REST Framework (API)
- SQLite3 (Database)
- scikit-learn (ML/AI)
- JWT Authentication

**Frontend:**
- React 18 (UI framework)
- Zustand (State management)
- Axios (HTTP client)
- Tailwind CSS (Styling)
- Vite (Build tool)

### Key Features

1. **User Management**
   - Register & Login with JWT tokens
   - Profile management
   - User-scoped data isolation

2. **Patient Management**
   - Create, view, update, delete patients
   - Store patient demographics
   - View patient history

3. **Measurement Recording**
   - Record vital signs
   - Automatic prediction generation
   - Measurement history

4. **Risk Assessment**
   - AI-powered risk prediction
   - Rule-based fallback
   - Risk categorization (Low/Medium/High)

5. **Dashboard**
   - Patient overview
   - Recent measurements
   - Prediction statistics
   - Risk filtering

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  - Pages: Dashboard, Patients, Measurements, Predictions    │
│  - State: Zustand stores                                    │
│  - API: Axios with interceptors                             │
└─────────────────────────────────────────────────────────────┘
                          ↓ (HTTP/REST API)
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Django DRF)                      │
│  - Authentication: JWT tokens                               │
│  - Views: RESTful endpoints                                 │
│  - AI: scikit-learn predictions                             │
│  - Database: SQLite3                                        │
└─────────────────────────────────────────────────────────────┘
                          ↓ (SQL)
┌─────────────────────────────────────────────────────────────┐
│                    Database (SQLite)                         │
│  - Users table                                              │
│  - Patients table                                           │
│  - Measurements table                                       │
│  - Predictions table                                        │
└─────────────────────────────────────────────────────────────┘
```

### Backend Architecture

```
Backend/
├── backend/                    # Project settings
│   ├── settings/
│   │   ├── base.py            # Main settings
│   │   ├── dev.py             # Development overrides
│   │   └── prod.py            # Production overrides
│   ├── urls.py                # Main URL router
│   └── wsgi.py                # WSGI configuration
├── apps/                       # Django apps
│   ├── users/                 # User management
│   │   ├── models.py          # User model
│   │   ├── views.py           # Auth endpoints
│   │   ├── serializers.py     # Data serialization
│   │   └── urls.py            # User routes
│   └── healthmonitor/         # Health monitoring
│       ├── models.py          # Patient, Measurement, Prediction
│       ├── views.py           # API views
│       ├── serializers.py     # Data serialization
│       └── urls.py            # Health routes
├── core/                       # Utilities
│   ├── ai_model.py            # AI prediction engine
│   └── __init__.py
└── db.sqlite3                  # SQLite database
```

### Frontend Architecture

```
Frontend/
├── src/
│   ├── pages/                  # Page components
│   │   ├── LoginPage.jsx       # Login/Register
│   │   ├── DashboardPage.jsx   # Home dashboard
│   │   ├── PatientsPage.jsx    # Patient management
│   │   ├── PatientDetailPage.jsx # Patient details
│   │   ├── MeasurementsPage.jsx  # All measurements
│   │   └── PredictionsPage.jsx   # Predictions dashboard
│   ├── components/             # Reusable components
│   │   ├── Layout.jsx          # App layout & sidebar
│   │   └── UI.jsx              # UI components (Button, Card, etc)
│   ├── api.js                  # API client & endpoints
│   ├── store.js                # Zustand state management
│   ├── App.jsx                 # Main app router
│   ├── main.jsx                # Entry point
│   └── index.css               # Styles
└── package.json                # Dependencies
```

---

## Frontend User Guide

### Pages & Features

#### 1. Login Page (`/login`)

**Features:**
- User registration form
- User login form
- Form validation
- Error messages

**How to Use:**
1. **Register New Account**
   - Click "Register" tab
   - Enter username, email, password
   - Confirm password
   - Click "Create Account"

2. **Login**
   - Click "Login" tab
   - Enter username
   - Enter password
   - Click "Login"

**What Happens:**
- Account is created and stored in database
- Tokens (access & refresh) are generated
- User is redirected to Dashboard
- Tokens stored in localStorage

---

#### 2. Dashboard Page (`/dashboard`)

**Features:**
- Welcome message
- Quick stats
- Recent measurements
- Quick actions

**What You See:**
- Total patients count
- Recent measurements
- Quick links to main pages

---

#### 3. Patients Page (`/patients`)

**Features:**
- List all patients
- Add new patient
- View patient details
- Delete patient

**How to Use:**

**Add Patient:**
1. Click "+ Add Patient" button
2. Fill in:
   - Full Name (required)
   - Date of Birth (optional)
3. Click "Create Patient"

**View Patient Details:**
1. Click "View Details" button on any patient
2. You'll see:
   - Patient information
   - Latest measurement
   - Measurement history

**Delete Patient:**
1. Click "Delete" button on patient card
2. Confirm deletion in popup
3. Patient is removed (note: this deletes all associated measurements too)

**Status Indicators:**
- "Deleting..." - Patient is being deleted, button is disabled
- Red button = Danger action

---

#### 4. Patient Detail Page (`/patients/:patientId`)

**Features:**
- View full patient profile
- Add measurements
- View measurement history
- Delete measurements
- See latest risk assessment

**How to Use:**

**Add Measurement:**
1. Click "+ Add Measurement" button
2. Enter vital signs:
   - Heart Rate: 30-200 bpm
   - SpO₂: 50-100%
   - Systolic: 40-300 mmHg
   - Diastolic: 40-300 mmHg
   - Respiratory Rate: optional
   - Temperature: 35-42°C (optional)
3. Click "Save Measurement"
4. System automatically generates risk prediction

**View Measurement:**
- Scroll down to "Measurement History"
- Each measurement shows:
  - Date/Time recorded
  - All vital signs with icons
  - Risk level badge (Low/Medium/High)
  - Risk score percentage

**Delete Measurement:**
1. Find measurement in history
2. Click "Delete" button
3. Confirm deletion
4. Measurement is removed

**Latest Measurement Section:**
- Shows the most recent measurement
- Displays all vital signs in cards
- Shows risk assessment and reason

---

#### 5. Measurements Page (`/measurements`)

**Features:**
- View all measurements across all patients
- Add new measurements
- Filter by risk level
- Search across all patients

**How to Use:**

**Add Measurement (From Global Page):**
1. Click "+ Add Measurement"
2. Select patient from dropdown
3. Enter vital signs
4. Click "Save Measurement"

**Filter by Risk:**
- Click filter buttons at top:
  - "All" - show all measurements
  - "High Risk" - only high-risk measurements
  - "Medium Risk" - medium-risk only
  - "Low Risk" - low-risk only
- Shows count next to each filter

**View Measurement Details:**
- Card shows:
  - Patient name
  - Measurement date/time
  - Risk badge
  - All vital signs in grid format
  - Risk score percentage
  - Notes (if any)

**Delete Measurement:**
1. Click "Delete" button on measurement
2. Confirm in popup
3. "Deleting..." feedback shows during deletion
4. Measurement removed from list

---

#### 6. Predictions Page (`/predictions`)

**Features:**
- View all risk predictions
- Statistics dashboard
- Filter by risk level
- Navigate to patient details

**Dashboard Shows:**
- Total Predictions (count)
- High Risk Predictions (count & %)
- Medium Risk Predictions (count & %)
- Low Risk Predictions (count & %)

**How to Use:**

**Filter Predictions:**
- Use filter buttons to see specific risk categories
- Shows count of predictions in each category

**View Prediction:**
- Each card shows:
  - Patient name
  - Measurement date
  - Risk badge
  - Vital signs
  - Risk score
  - Risk reason/explanation

**View Patient:**
- Click "View Patient" link
- Redirects to patient detail page

---

### Navigation & Layout

**Sidebar Navigation:**
```
Health Care Monitor
├── 🏠 Dashboard
├── 👥 Patients
├── 📊 Measurements
├── 🔍 Predictions
└── 👤 Profile → Logout
```

**Mobile Responsive:**
- Sidebar collapses on small screens
- Grid layouts adapt to screen size
- Touch-friendly buttons

---

## Backend Development Guide

### Models Overview

#### User Model

```python
class User(AbstractUser):
    is_verified = models.BooleanField(default=False)
    username = CharField(unique=True)
    email = EmailField()
    password = CharField(hashed)
```

**Usage:**
- Extends Django's AbstractUser
- Can be extended with additional fields
- Stores authentication credentials

---

#### Patient Model

```python
class Patient(models.Model):
    id = AutoField(primary_key=True)
    user = ForeignKey(User)  # Owner of record
    full_name = CharField(max_length=255)
    dob = DateField()
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)
```

**Usage:**
- One-to-many: User → Patients
- Stores patient demographics
- Auto-timestamps for audit trail

---

#### Measurement Model

```python
class Measurement(models.Model):
    id = AutoField(primary_key=True)
    patient = ForeignKey(Patient)
    heart_rate = FloatField()
    spo2 = FloatField()
    systolic = IntegerField()
    diastolic = IntegerField()
    respiratory_rate = FloatField(null=True)
    temperature = FloatField(null=True)
    timestamp = DateTimeField(auto_now_add=True)
```

**Usage:**
- One-to-many: Patient → Measurements
- Stores vital signs
- One measurement creates one prediction

---

#### Prediction Model

```python
class Prediction(models.Model):
    id = AutoField(primary_key=True)
    measurement = OneToOneField(Measurement)
    risk_score = FloatField()  # 0.0 to 1.0
    risk_label = CharField(choices=['low', 'medium', 'high'])
    created_at = DateTimeField(auto_now_add=True)
```

**Usage:**
- One-to-one: Measurement → Prediction
- AI-generated risk assessment
- Stores prediction reasoning

---

### API Endpoints

#### Authentication Endpoints

**POST /api/auth/register/**
```json
Request:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "password2": "SecurePassword123"
}

Response (201 Created):
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

**POST /api/auth/login/**
```json
Request:
{
  "username": "john_doe",
  "password": "SecurePassword123"
}

Response (200 OK):
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**POST /api/auth/token/refresh/**
```json
Request:
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**GET /api/auth/me/**
```json
Response (200 OK):
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "is_verified": false
}
```

---

#### Patient Endpoints

**GET /api/health/patients/**
- Get all patients for logged-in user
- Returns: List of patients

**POST /api/health/patients/**
- Create new patient
- Body: `{full_name, dob}`
- Returns: Created patient object

**GET /api/health/patients/{id}/**
- Get specific patient details
- Returns: Patient object with metadata

**PATCH /api/health/patients/{id}/**
- Update patient
- Body: `{full_name, dob}`
- Returns: Updated patient

**DELETE /api/health/patients/{id}/**
- Delete patient and all measurements
- Returns: 204 No Content

---

#### Measurement Endpoints

**GET /api/health/patients/{patient_id}/measurements/**
- Get all measurements for patient
- Returns: List of measurements with predictions

**POST /api/health/patients/{patient_id}/measurements/**
- Create measurement and auto-predict
- Body: `{heart_rate, spo2, systolic, diastolic, respiratory_rate, temperature}`
- Returns: Measurement with prediction

**GET /api/health/measurements/{id}/**
- Get specific measurement
- Returns: Measurement object

**DELETE /api/health/measurements/{id}/**
- Delete measurement (and prediction)
- Returns: 204 No Content

---

#### Prediction Endpoints

**GET /api/health/measurements/{measurement_id}/prediction/**
- Get prediction for measurement
- Returns: Prediction object with risk details

---

### AI Prediction Engine

**Located:** `Backend/core/ai_model.py`

**How It Works:**
1. Takes vital signs as input
2. Checks if ML model is available
3. If available: Uses scikit-learn to predict risk
4. If unavailable: Falls back to rule-based prediction

**Risk Scoring:**
- Low: score < 0.4 (green)
- Medium: 0.4 ≤ score < 0.7 (yellow)
- High: score ≥ 0.7 (red)

**Rule-Based Fallback:**
```python
- Heart rate < 60 or > 100: +0.3 risk
- SpO2 < 95: +0.4 risk
- BP systolic > 140 or < 100: +0.2 risk
- Temperature > 38 or < 36: +0.25 risk
```

---

## Database Schema

### SQLite Tables

```sql
-- Users
CREATE TABLE users_user (
    id INTEGER PRIMARY KEY,
    username VARCHAR(150) UNIQUE,
    email VARCHAR(254),
    password VARCHAR(128),
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    is_verified BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    is_staff BOOLEAN DEFAULT 0,
    is_superuser BOOLEAN DEFAULT 0,
    date_joined DATETIME,
    last_login DATETIME
);

-- Patients
CREATE TABLE healthmonitor_patient (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    full_name VARCHAR(255),
    dob DATE,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY(user_id) REFERENCES users_user(id)
);

-- Measurements
CREATE TABLE healthmonitor_measurement (
    id INTEGER PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    heart_rate REAL,
    spo2 REAL,
    systolic INTEGER,
    diastolic INTEGER,
    respiratory_rate REAL,
    temperature REAL,
    timestamp DATETIME,
    FOREIGN KEY(patient_id) REFERENCES healthmonitor_patient(id)
);

-- Predictions
CREATE TABLE healthmonitor_prediction (
    id INTEGER PRIMARY KEY,
    measurement_id INTEGER UNIQUE NOT NULL,
    risk_score REAL,
    risk_label VARCHAR(50),
    created_at DATETIME,
    FOREIGN KEY(measurement_id) REFERENCES healthmonitor_measurement(id)
);
```

### Relationships

```
User (1) ←→ (Many) Patient
Patient (1) ←→ (Many) Measurement
Measurement (1) ←→ (1) Prediction
```

---

## API Documentation

### Authentication

**JWT Token Flow:**
```
1. User registers/logs in
2. Server returns access_token & refresh_token
3. Client stores tokens in localStorage
4. Client sends Authorization header: "Bearer {access_token}"
5. When token expires (60 min), client uses refresh_token
6. Server returns new access_token
```

**Headers Required:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Error Responses

**400 Bad Request:**
```json
{
  "field_name": ["Error message"],
  "detail": "Invalid request"
}
```

**401 Unauthorized:**
```json
{
  "detail": "Invalid credentials"
}
```

**404 Not Found:**
```json
{
  "detail": "Resource not found"
}
```

**500 Server Error:**
```json
{
  "detail": "Internal server error"
}
```

### Rate Limiting

**Current:** None implemented ⚠️
**Recommended:** 
- 10 requests/minute for anonymous
- 100 requests/minute for authenticated

---

## Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- Git

### Backend Setup

**Step 1: Create Virtual Environment**
```powershell
cd Backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Step 2: Install Dependencies**
```powershell
pip install -r requirements.txt
```

**Step 3: Setup Environment Variables**
```powershell
# Create .env file
copy .env.example .env

# Edit .env and set:
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

**Step 4: Run Migrations**
```powershell
python manage.py makemigrations
python manage.py migrate
```

**Step 5: Create Superuser (Optional)**
```powershell
python manage.py createsuperuser
# Follow prompts
```

**Step 6: Run Server**
```powershell
python manage.py runserver
# Server runs on http://localhost:8000
```

---

### Frontend Setup

**Step 1: Install Dependencies**
```powershell
cd Frontend
npm install
```

**Step 2: Configure Environment (if needed)**
```powershell
# Check src/api.js for backend URL
# Should be: http://localhost:8000/api
```

**Step 3: Run Development Server**
```powershell
npm run dev
# Server runs on http://localhost:5173
```

**Step 4: Build for Production**
```powershell
npm run build
# Creates dist/ folder
```

---

## Configuration

### Environment Variables (.env)

**Backend (.env):**
```
# Django Settings
SECRET_KEY=your-super-secret-key-change-this
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Email (for password reset, optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8000/api
```

### Django Settings Override

**Development (settings/dev.py):**
```python
# Inherits from base.py
# Override for development specific settings
DEBUG = True
```

**Production (settings/prod.py):**
```python
# Strict security settings
DEBUG = False
SECURE_SSL_REDIRECT = True
# ... other production settings
```

**Usage:**
```powershell
# Development (default)
python manage.py runserver

# Production
set DJANGO_SETTINGS_MODULE=backend.settings.prod
python manage.py runserver
```

---

## Troubleshooting

### Common Issues

#### 1. "No such table: users_user"

**Problem:** Database not initialized

**Solution:**
```powershell
python manage.py migrate
```

---

#### 2. "CORS error: No 'Access-Control-Allow-Origin' header"

**Problem:** Frontend can't connect to backend

**Check:**
1. Backend running on http://localhost:8000
2. CORS_ALLOWED_ORIGINS includes frontend URL in .env
3. Restart backend after .env change

**Solution:**
```powershell
# In Backend/.env
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Restart backend
python manage.py runserver
```

---

#### 3. "Invalid token" on frontend

**Problem:** JWT token expired or invalid

**Solution:**
1. Clear localStorage: Open DevTools → Application → LocalStorage → Clear
2. Logout and login again
3. Check token in localStorage (should be long string)

---

#### 4. "Cannot POST /api/health/patients/"

**Problem:** API endpoint not found

**Check:**
1. Backend running?
2. Correct URL in frontend api.js?
3. Authentication token present?

**Debug:**
```powershell
# Test backend directly
curl -X GET http://localhost:8000/api/health/patients/ ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

#### 5. Module not found: "django_cors_headers"

**Problem:** Dependency not installed

**Solution:**
```powershell
pip install -r requirements.txt
```

---

#### 6. Port 8000 already in use

**Problem:** Another process using port

**Solution:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID 12345 /F

# Or use different port
python manage.py runserver 8001
```

---

#### 7. Frontend shows blank page

**Problem:** Build issues or component errors

**Solution:**
```powershell
# Clear cache and reinstall
rm -r node_modules
rm package-lock.json
npm install
npm run dev
```

---

### Debug Mode

**Enable Detailed Logging:**
```python
# In settings/base.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
```

**Browser DevTools:**
1. Press F12
2. Network tab: See API requests/responses
3. Console tab: See JavaScript errors
4. Application tab: See stored tokens

---

## Deployment Guide

### Production Checklist

- [ ] Change SECRET_KEY to random string
- [ ] Set DEBUG=False
- [ ] Set ALLOWED_HOSTS to your domain
- [ ] Configure HTTPS/SSL
- [ ] Move to PostgreSQL database
- [ ] Setup environment variables on server
- [ ] Run migrations on server
- [ ] Collect static files
- [ ] Setup gunicorn/uWSGI
- [ ] Setup nginx reverse proxy
- [ ] Setup logging and monitoring
- [ ] Run security audit
- [ ] Test with real data

### Quick Deployment (Using Heroku)

**1. Create Heroku App**
```powershell
heroku create your-app-name
```

**2. Add Buildpacks**
```powershell
heroku buildpacks:add heroku/python
```

**3. Set Environment Variables**
```powershell
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
```

**4. Deploy**
```powershell
git push heroku main
```

**5. Run Migrations**
```powershell
heroku run python manage.py migrate
```

### Docker Deployment

**Dockerfile (Backend):**
```dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

**docker-compose.yml:**
```yaml
version: '3'
services:
  backend:
    build: ./Backend
    ports:
      - "8000:8000"
  frontend:
    build: ./Frontend
    ports:
      - "3000:3000"
```

**Run:**
```powershell
docker-compose up
```

---

## Security Best Practices

### For Developers

1. **Never commit .env file**
   ```
   # .gitignore
   .env
   *.log
   venv/
   node_modules/
   ```

2. **Use HTTPS everywhere in production**
   ```python
   SECURE_SSL_REDIRECT = True
   SESSION_COOKIE_SECURE = True
   CSRF_COOKIE_SECURE = True
   ```

3. **Validate all input**
   ```python
   heart_rate = serializers.FloatField(min_value=30, max_value=200)
   ```

4. **Keep dependencies updated**
   ```powershell
   pip list --outdated
   npm outdated
   ```

5. **Use strong SECRET_KEY**
   ```powershell
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

6. **Limit token lifetime**
   ```python
   'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60)
   ```

### For System Administrators

1. **Backup database regularly**
   ```powershell
   python manage.py dumpdata > backup.json
   ```

2. **Monitor logs for suspicious activity**
3. **Keep server software updated**
4. **Use firewall to restrict access**
5. **Enable HTTPS/SSL**
6. **Set up monitoring and alerting**

### For End Users

1. **Use strong passwords** (12+ characters, mixed case, numbers, symbols)
2. **Never share your login credentials**
3. **Logout when done using the application**
4. **Report security issues to administrators**
5. **Be cautious with personal health information**

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Nov 21, 2025 | Initial release |

---

## Support & Contact

**Issues & Bug Reports:**
- Check troubleshooting section first
- Create issue with: Description, Steps to reproduce, Error message, Screenshots
- Include system info: OS, Browser, Python version, Node version

**Feature Requests:**
- Describe feature
- Explain use case
- Suggest implementation

**Security Issues:**
- ⚠️ Do not post publicly
- Email security team directly
- Include reproduction steps

---

## License

This project is proprietary. Unauthorized copying or distribution is prohibited.

---

**Last Updated:** November 21, 2025
**Project Status:** Development/Testing
**Python Version:** 3.13.7
**Node Version:** 18+

