
import joblib
import pandas as pd

from pathlib import Path
from functools import lru_cache

from app.schemas import FD001SensorInput
from app.schemas import FD002SensorInput

# PROJECT PATHS

BASE_DIR = Path(__file__).resolve().parent.parent

# FD002 preprocessing artifact
PREPROCESSING_PATH = (
    BASE_DIR / "preprocessing" / "fd002_preprocessing.pkl"
)

# FD001 model configuration
FD001_CONFIG_PATH = (
    BASE_DIR / "models" / "model_config.pkl"
)

# FD002 PREPROCESSING CONFIGURATION

@lru_cache(maxsize=1)
def load_preprocessing():
    """
    Load and cache FD002 preprocessing artifacts.
    """

    if not PREPROCESSING_PATH.exists():
        raise FileNotFoundError(
            f"Preprocessing file not found: {PREPROCESSING_PATH}"
        )

    artifacts = joblib.load(PREPROCESSING_PATH)

    required_keys = [
        "condition_stats",
        "operating_condition_mapping",
        "selected_sensors",
        "normalized_sensors",
        "normalized_features",
        "rul_cap"
    ]

    missing_keys = [
        key for key in required_keys
        if key not in artifacts
    ]

    if missing_keys:
        raise ValueError(
            f"Missing preprocessing artifacts: {missing_keys}"
        )

    return artifacts

# FD001 MODEL CONFIGURATION
@lru_cache(maxsize=1)
def load_fd001_config():
    """
    Load FD001 model configuration.
    """

    if not FD001_CONFIG_PATH.exists():
        raise FileNotFoundError(
            f"FD001 configuration not found: {FD001_CONFIG_PATH}"
        )

    config = joblib.load(FD001_CONFIG_PATH)

    required_keys = [
        "features",
        "rul_cap"
    ]

    missing_keys = [
        key for key in required_keys
        if key not in config
    ]

    if missing_keys:
        raise ValueError(
            f"Missing FD001 configuration keys: {missing_keys}"
        )

    if len(config["features"]) != 19:
        raise ValueError(
            "FD001 must contain exactly 19 features."
        )

    return config

# FD002 PREPROCESSING

def preprocess_fd002(
    input_data: FD002SensorInput
) -> pd.DataFrame:
    """
    Validate, map operating conditions,
    normalize sensor values and arrange
    features for FD002 XGBoost prediction.
    """

    artifacts = load_preprocessing()

    # Convert validated Pydantic input into DataFrame
    df = pd.DataFrame([input_data.model_dump()])

    selected_sensors = artifacts["selected_sensors"]
    normalized_sensors = artifacts["normalized_sensors"]
    normalized_features = artifacts["normalized_features"]

    mapping_df = artifacts["operating_condition_mapping"]
    condition_stats = artifacts["condition_stats"]

    # 1. Round operating settings as in training
    df["op_setting_1"] = df["op_setting_1"].round(0)
    df["op_setting_2"] = df["op_setting_2"].round(2)

    # 2. Create unique operating-condition lookup
    lookup = mapping_df[
        [
            "op_setting_1",
            "op_setting_2",
            "op_setting_3",
            "operating_condition"
        ]
    ].copy()

    lookup["op_setting_1"] = lookup["op_setting_1"].round(0)
    lookup["op_setting_2"] = lookup["op_setting_2"].round(2)

    lookup = lookup.drop_duplicates(
        subset=[
            "op_setting_1",
            "op_setting_2",
            "op_setting_3"
        ]
    )

    # Confirm each setting combination maps to one condition
    if lookup.duplicated(
        subset=[
            "op_setting_1",
            "op_setting_2",
            "op_setting_3"
        ]
    ).any():
        raise ValueError(
            "Ambiguous operating-condition mapping."
        )

    # 3. Identify incoming operating condition
    df = df.merge(
        lookup,
        on=[
            "op_setting_1",
            "op_setting_2",
            "op_setting_3"
        ],
        how="left",
        validate="many_to_one"
    )

    if df["operating_condition"].isna().any():
        raise ValueError(
            "Unknown operating condition. "
            "The input settings do not match FD002 training regimes."
        )

    # 4. Condition-wise sensor normalization
    conditions = df["operating_condition"]

    for sensor in normalized_sensors:

        if sensor not in selected_sensors:
            raise ValueError(
                f"Unexpected normalized sensor: {sensor}"
            )

        means = condition_stats[(sensor, "mean")]
        stds = condition_stats[(sensor, "std")]

        mean_values = conditions.map(means)
        std_values = conditions.map(stds)

        if mean_values.isna().any() or std_values.isna().any():
            raise ValueError(
                f"Missing normalization statistics for {sensor}"
            )

        if (std_values <= 0).any():
            raise ValueError(
                f"Invalid standard deviation for {sensor}"
            )

        df[f"{sensor}_normalized"] = (
            df[sensor] - mean_values
        ) / std_values

    # 5. Prepare features in exact training order
    missing_features = [
        feature for feature in normalized_features
        if feature not in df.columns
    ]

    if missing_features:
        raise ValueError(
            f"Missing model features: {missing_features}"
        )

    X = df[normalized_features].copy()

    # 6. Final validation
    if X.isna().any().any():
        raise ValueError(
            "Missing values found after preprocessing."
        )

    if not X.map(
        lambda value: pd.notna(value) and abs(value) != float("inf")
    ).all().all():
        raise ValueError(
            "Infinite values found after preprocessing."
        )

    return X

# FD001 PREPROCESSING

def preprocess_fd001(
    input_data: FD001SensorInput
) -> pd.DataFrame:
    """
    Prepare raw FD001 input features
    in the exact training order.
    """

    config = load_fd001_config()

    # Convert validated input into DataFrame
    df = pd.DataFrame([input_data.model_dump()])

    feature_columns = config["features"]

    # Check missing features
    missing_features = [
        feature for feature in feature_columns
        if feature not in df.columns
    ]

    if missing_features:
        raise ValueError(
            f"Missing FD001 features: {missing_features}"
        )

    # Arrange features in training order
    X = df[feature_columns].copy()

    # Validate input
    if X.isna().any().any():
        raise ValueError(
            "Missing values found in FD001 input."
        )

    if not X.map(
        lambda value: pd.notna(value) and abs(value) != float("inf")
    ).all().all():
        raise ValueError(
            "Infinite values found in FD001 input."
        )

    return X
