# Model Training Guide

## Quick Start

### Train the model
```bash
python scripts/train_model.py
```

This will:
1. Load `data/medical_training_dataset_5000.csv`
2. Split into 80% train / 20% test sets
3. Train a GradientBoostingRegressor with StandardScaler preprocessing
4. Save the trained model to `model.pkl`
5. Display performance metrics

### Expected Output
```
Training Metrics:
  R² Score:    0.9940
  MAE:         0.0046
  RMSE:        0.0059

Test Metrics:
  R² Score:    0.9808
  MAE:         0.0079
  RMSE:        0.0104
```

## Data Format

Place your training dataset in `data/` folder with the following columns:

| Column | Type | Description |
|--------|------|-------------|
| heart_rate | float | Beats per minute (bpm) |
| spo2 | float | Oxygen saturation (%) |
| systolic | float | Systolic blood pressure (mmHg) |
| diastolic | float | Diastolic blood pressure (mmHg) |
| respiratory_rate | float | Breaths per minute |
| temperature | float | Body temperature (°C) |
| risk_score | float | Target: Risk score (0-1) |
| risk_label | string | Optional: 'low', 'medium', 'high' |

## Adding New Datasets

1. Create CSV file with required columns
2. Place in `data/` folder
3. Update `DATA_CSV` path in `scripts/train_model.py` if needed
4. Run `python scripts/train_model.py`

Example:
```bash
# If you have data/new_dataset.csv
# Edit scripts/train_model.py line 28:
DATA_CSV = os.path.join(os.path.dirname(__file__), '..', 'data', 'new_dataset.csv')

# Then train
python scripts/train_model.py
```

## Model Architecture

The trained model is a scikit-learn Pipeline with two stages:

1. **StandardScaler** - Normalizes all input features to mean=0, std=1
2. **GradientBoostingRegressor** - Ensemble gradient boosting model
   - 100 estimators
   - Learning rate: 0.1
   - Max depth: 5
   - Subsample: 0.8

## Model Serving

Once trained, the model is automatically loaded by `core/ai_model.py`:

```python
from core.ai_model import HealthAI

ai = HealthAI()
result = ai.predict({
    'heart_rate': 75,
    'spo2': 98,
    'systolic': 120,
    'diastolic': 80,
    'respiratory_rate': 16,
    'temperature': 37.0
})

# Result:
# {
#   'risk_score': 0.245,
#   'risk_label': 'low',
#   'source': 'model',
#   'reason': 'model_probability'
# }
```

## Troubleshooting

### Error: "Dataset not found"
- Ensure file exists at `data/medical_training_dataset_5000.csv`
- Check file permissions

### Error: "Missing columns"
- Verify CSV has all required columns
- Column names are case-sensitive

### Poor model performance
- Check for data quality issues (missing values, outliers)
- Adjust hyperparameters in `build_model()` function
- Try with more/different training data

### Model file too large
- Current model (`model.pkl`) is ~0.5MB
- If larger after retraining, check for overfitting
- Reduce `n_estimators` in `build_model()`
