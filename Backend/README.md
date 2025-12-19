Health Monitor AI - Django + DRF Backend
=========================================

## Overview
- JWT authentication via SimpleJWT
- Health monitoring API with Patients, Measurements, and Predictions
- ML-powered risk prediction using trained GradientBoostingRegressor model
- Robust rule-based fallback scoring when model unavailable

## Project Structure
```
Backend/
├── data/                              # Training datasets
│   └── medical_training_dataset_5000.csv  # Medical training data (5000 samples, 0.63MB)
│
├── scripts/
│   └── train_model.py                 # Model training script
│
├── core/
│   └── ai_model.py                    # HealthAI prediction engine
│
├── apps/
│   ├── healthmonitor/                 # Main health monitoring app
│   │   ├── models.py                  # Patient, Measurement, Prediction models
│   │   ├── views.py                   # REST API views
│   │   ├── serializers.py             # DRF serializers
│   │   ├── urls.py                    # URL routing
│   │   └── migrations/
│   ├── users/                         # User authentication app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── migrations/
│
├── backend/
│   ├── settings/
│   │   ├── base.py                    # Base Django settings
│   │   ├── dev.py                     # Development settings
│   │   └── prod.py                    # Production settings
│   ├── urls.py                        # Main URL configuration
│   ├── wsgi.py                        # WSGI app
│   └── asgi.py                        # ASGI app
│
├── model.pkl                          # Trained ML model (420.5KB, generated)
├── db.sqlite3                         # Development database
├── manage.py                          # Django management script
├── requirements.txt                   # Python dependencies
├── .env                               # Environment variables (create from .env template)
├── .gitignore                         # Git ignore rules
├── README.md                          # Full project documentation
└── TRAINING_GUIDE.md                  # Model training guide
```
## Setup & Installation

### 1. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
cp .env .env.local  # Edit if needed (DEBUG, SECRET_KEY, etc.)
```

### 4. Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 5. Train the ML Model
```bash
python scripts/train_model.py
```
This trains a GradientBoostingRegressor on `data/medical_training_dataset_5000.csv` and saves it as `model.pkl`.

**Model Performance:**
- Test R² Score: 0.9808 (98.08% accuracy)
- Test MAE: 0.0079
- Test RMSE: 0.0104

### 6. Run Development Server
```bash
python manage.py runserver
```
Server runs at `http://127.0.0.1:8000`

## API Endpoints

### Authentication
- **POST** `/api/auth/login/` - Get JWT token (login)
- **POST** `/api/token/refresh/` - Refresh JWT token

### Patients
- **GET/POST** `/api/health/patients/` - List/create patients
- **GET** `/api/health/patients/{id}/` - Retrieve patient details

### Measurements
- **GET/POST** `/api/health/patients/{patient_id}/measurements/` - List/create measurements
- **GET** `/api/health/measurements/{id}/` - Retrieve measurement

### Predictions
- **GET** `/api/health/measurements/{measurement_id}/prediction/` - Get risk prediction

## Example Workflow

### 1. Create Patient
```bash
curl -X POST http://127.0.0.1:8000/api/health/patients/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John Doe","dob":"1990-01-01"}'
```

### 2. Create Measurement (auto-triggers prediction)
```bash
curl -X POST http://127.0.0.1:8000/api/health/patients/1/measurements/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "heart_rate": 75,
    "spo2": 98,
    "systolic": 120,
    "diastolic": 80,
    "respiratory_rate": 16,
    "temperature": 37.0
  }'
```

### 3. Get Prediction
```bash
curl -X GET http://127.0.0.1:8000/api/health/measurements/1/prediction/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Model Training

The `scripts/train_model.py` script:
- Loads 5000 medical samples from `data/medical_training_dataset_5000.csv`
- Validates all required features (heart_rate, spo2, systolic, diastolic, respiratory_rate, temperature)
- Splits data: 80% train, 20% test
- Trains a GradientBoostingRegressor with StandardScaler preprocessing
- Saves the pipeline to `model.pkl`
- Reports comprehensive metrics (R², MAE, RMSE)

### To retrain with new data:
1. Place dataset in `data/` folder with same columns
2. Update `DATA_CSV` path in `scripts/train_model.py` if needed
3. Run: `python scripts/train_model.py`

## AI Prediction Engine (`core/ai_model.py`)

The `HealthAI` class provides multi-layer prediction:

1. **Input Validation** - Checks values are within safe clinical bounds
2. **Hard Rules** - Immediate critical condition detection (cardiac arrest, severe hypoxia, etc.)
3. **ML Model** - GradientBoostingRegressor predicts continuous risk_score (0-1)
4. **Fallback Rules** - If model unavailable or OOD, uses weighted clinical rules
5. **Risk Labels** - Converts scores to categories: 'low' (<0.33), 'medium' (0.33-0.66), 'high' (≥0.66)

Returns prediction dict:
```json
{
  "risk_score": 0.245,
  "risk_label": "low",
  "source": "model",
  "reason": "model_probability"
}
```

## Troubleshooting

### Model not loading
- Ensure `model.pkl` exists in project root
- Run `python scripts/train_model.py` to generate it
- Check logs in `apps/healthmonitor/views.py`

### Dataset not found
- Place CSV in `data/` folder: `data/medical_training_dataset_5000.csv`
- Ensure columns match: heart_rate, spo2, systolic, diastolic, respiratory_rate, temperature, risk_score, risk_label

### Prediction returns "invalid" label
- Check measurement input values against safe clinical bounds (see `HealthAI.SAFE_BOUNDS`)
- Model uses fallback scoring if inputs are out-of-distribution
