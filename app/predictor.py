
import xgboost as xgb
import numpy as np
import joblib

from pathlib import Path

from app.preprocessing import (
    preprocess_fd001,
    preprocess_fd002
)

from app.schemas import (
    FD001SensorInput,
    FD002SensorInput
)

# PROJECT PATHS
BASE_DIR = Path(__file__).resolve().parent.parent

FD001_MODEL_PATH = (
    BASE_DIR / "models" / "xgboost_fd001_capped.pkl"
)

FD002_MODEL_PATH = (
    BASE_DIR / "models" / "fd002_xgboost.json"
)

# LOAD FD001 MODEL

def load_fd001_model():

    if not FD001_MODEL_PATH.exists():
        raise FileNotFoundError(
            f"FD001 model not found: {FD001_MODEL_PATH}"
        )

    model = joblib.load(FD001_MODEL_PATH)

    return model

# LOAD FD002 MODEL

def load_fd002_model():

    if not FD002_MODEL_PATH.exists():
        raise FileNotFoundError(
            f"FD002 model not found: {FD002_MODEL_PATH}"
        )

    model = xgb.XGBRegressor()
    model.load_model(FD002_MODEL_PATH)

    return model


# LOAD BOTH MODELS

fd001_model = load_fd001_model()
fd002_model = load_fd002_model()

# FD001 PREDICTION

def predict_fd001(input_data: FD001SensorInput):

    # Preprocess incoming sensor readings
    X = preprocess_fd001(input_data)

    # Generate RUL prediction
    prediction = float(fd001_model.predict(X)[0])

    if not np.isfinite(prediction):
        raise ValueError(
            "FD001 model returned an invalid prediction."
        )

    # Apply training target cap
    prediction = float(np.clip(prediction, 0, 125))

    return {
        "model": "FD001",
        "predicted_rul": round(prediction, 2),
        "unit": "cycles"
    }

# FD002 PREDICTION

def predict_fd002(input_data: FD002SensorInput):

    # Preprocess incoming sensor readings
    X = preprocess_fd002(input_data)

    # Generate RUL prediction
    prediction = float(fd002_model.predict(X)[0])

    if not np.isfinite(prediction):
        raise ValueError(
            "FD002 model returned an invalid prediction."
        )

    # Apply training target cap
    prediction = float(np.clip(prediction, 0, 125))

    return {
        "model": "FD002",
        "predicted_rul": round(prediction, 2),
        "unit": "cycles"
    }
