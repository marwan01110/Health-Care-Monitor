'''
Train a medical risk classifier using scikit-learn with the medical training dataset.
Uses columns: heart_rate, spo2, systolic, diastolic, respiratory_rate, temperature, risk_score
Creates a regression model to predict risk_score (0-1).
'''
import os
import sys
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import joblib
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Use medical_training_dataset_5000.csv from data folder
DATA_CSV = os.path.join(os.path.dirname(__file__), '..', 'data', 'medical_training_dataset_5000.csv')
MODEL_OUT = os.path.join(os.path.dirname(__file__), '..', 'model.pkl')

FEATURE_COLS = ['heart_rate', 'spo2', 'systolic', 'diastolic', 'respiratory_rate', 'temperature']
TARGET_COL = 'risk_score'

def load_and_prepare_data(csv_path):
    """Load CSV and prepare features/target"""
    if not os.path.exists(csv_path):
        logger.error(f"Dataset not found: {csv_path}")
        sys.exit(1)
    
    df = pd.read_csv(csv_path)
    logger.info(f"Loaded {len(df)} samples from {csv_path}")
    logger.info(f"Columns: {df.columns.tolist()}")
    
    # Validate required columns
    missing_cols = set(FEATURE_COLS + [TARGET_COL]) - set(df.columns)
    if missing_cols:
        logger.error(f"Missing columns: {missing_cols}")
        sys.exit(1)
    
    # Extract features and target
    X = df[FEATURE_COLS].fillna(0)
    y = df[TARGET_COL]
    
    # Log data info
    logger.info(f"Features shape: {X.shape}")
    logger.info(f"Target range: [{y.min():.4f}, {y.max():.4f}]")
    logger.info(f"Missing values in X: {X.isna().sum().sum()}")
    logger.info(f"Missing values in y: {y.isna().sum()}")
    
    return X, y

def build_model():
    """Build a scikit-learn Pipeline with scaler + ensemble regressor"""
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('regressor', GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            min_samples_split=10,
            min_samples_leaf=5,
            random_state=42,
            subsample=0.8,
            verbose=0
        ))
    ])
    return pipeline

def train_and_evaluate(model, X_train, X_test, y_train, y_test):
    """Train model and report metrics"""
    logger.info("Training model...")
    model.fit(X_train, y_train)
    
    # Training metrics
    train_pred = model.predict(X_train)
    train_r2 = r2_score(y_train, train_pred)
    train_mae = mean_absolute_error(y_train, train_pred)
    train_rmse = np.sqrt(mean_squared_error(y_train, train_pred))
    
    # Test metrics
    test_pred = model.predict(X_test)
    test_r2 = r2_score(y_test, test_pred)
    test_mae = mean_absolute_error(y_test, test_pred)
    test_rmse = np.sqrt(mean_squared_error(y_test, test_pred))
    
    logger.info(f"\n{'='*60}")
    logger.info("Training Metrics:")
    logger.info(f"  R² Score:    {train_r2:.4f}")
    logger.info(f"  MAE:         {train_mae:.4f}")
    logger.info(f"  RMSE:        {train_rmse:.4f}")
    logger.info(f"\nTest Metrics:")
    logger.info(f"  R² Score:    {test_r2:.4f}")
    logger.info(f"  MAE:         {test_mae:.4f}")
    logger.info(f"  RMSE:        {test_rmse:.4f}")
    logger.info(f"{'='*60}\n")
    
    return train_r2, test_r2, train_mae, test_mae

def main():
    logger.info("Starting model training pipeline...")
    
    # Load data
    X, y = load_and_prepare_data(DATA_CSV)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    logger.info(f"Train set: {X_train.shape[0]} samples | Test set: {X_test.shape[0]} samples")
    
    # Build and train model
    model = build_model()
    train_r2, test_r2, train_mae, test_mae = train_and_evaluate(model, X_train, X_test, y_train, y_test)
    
    # Save model
    joblib.dump(model, MODEL_OUT)
    logger.info(f"✓ Model saved to {MODEL_OUT}")
    
    # Quick sanity check
    sample_features = X_test.iloc[0:1]
    sample_pred = model.predict(sample_features)
    sample_actual = y_test.iloc[0]
    logger.info(f"\nSample prediction: {sample_pred[0]:.4f} (actual: {sample_actual:.4f})")
    
    logger.info("\n✓ Training complete!")

if __name__ == '__main__':
    main()
