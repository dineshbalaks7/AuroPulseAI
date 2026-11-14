import time
from pathlib import Path
from functools import lru_cache
import pandas as pd
import numpy as np

from app.preprocessing import load_preprocessing, load_fd001_config
from app.predictor import fd001_model, fd002_model

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

COLUMNS = [
    "unit_number",
    "time_in_cycles",
    "op_setting_1",
    "op_setting_2",
    "op_setting_3"
] + [f"sensor_{i}" for i in range(1, 22)]

FD001_ACTIVE_SENSORS = [
    "sensor_2", "sensor_3", "sensor_4", "sensor_6", "sensor_7",
    "sensor_8", "sensor_9", "sensor_11", "sensor_12", "sensor_13",
    "sensor_14", "sensor_15", "sensor_17", "sensor_20", "sensor_21"
]

FD002_ACTIVE_SENSORS = [f"sensor_{i}" for i in range(1, 22)]

SENSOR_METADATA = {
    "sensor_1": {"name": "T2", "description": "Total temperature at fan inlet", "unit": "°R", "type": "temperature"},
    "sensor_2": {"name": "T24", "description": "Total temperature at LPC outlet", "unit": "°R", "type": "temperature"},
    "sensor_3": {"name": "T30", "description": "Total temperature at HPC outlet", "unit": "°R", "type": "temperature"},
    "sensor_4": {"name": "T50", "description": "Total temperature at LPT outlet", "unit": "°R", "type": "temperature"},
    "sensor_5": {"name": "P2", "description": "Pressure at fan inlet", "unit": "psia", "type": "pressure"},
    "sensor_6": {"name": "P15", "description": "Total pressure in bypass-duct", "unit": "psia", "type": "pressure"},
    "sensor_7": {"name": "P30", "description": "Total pressure at HPC outlet", "unit": "psia", "type": "pressure"},
    "sensor_8": {"name": "Nf", "description": "Physical fan speed", "unit": "rpm", "type": "speed"},
    "sensor_9": {"name": "Nc", "description": "Physical core speed", "unit": "rpm", "type": "speed"},
    "sensor_10": {"name": "epr", "description": "Engine pressure ratio (P50/P2)", "unit": "ratio", "type": "ratio"},
    "sensor_11": {"name": "Ps30", "description": "Static pressure at HPC outlet", "unit": "psia", "type": "pressure"},
    "sensor_12": {"name": "phi", "description": "Ratio of fuel flow to Ps30", "unit": "pps/psi", "type": "ratio"},
    "sensor_13": {"name": "NRf", "description": "Corrected fan speed", "unit": "rpm", "type": "speed"},
    "sensor_14": {"name": "NRc", "description": "Corrected core speed", "unit": "rpm", "type": "speed"},
    "sensor_15": {"name": "BPR", "description": "Bypass Ratio", "unit": "ratio", "type": "ratio"},
    "sensor_16": {"name": "farB", "description": "Burner fuel-air ratio", "unit": "ratio", "type": "ratio"},
    "sensor_17": {"name": "htBleed", "description": "Bleed Enthalpy", "unit": "ratio", "type": "ratio"},
    "sensor_18": {"name": "Nf_dmd", "description": "Demanded fan speed", "unit": "rpm", "type": "speed"},
    "sensor_19": {"name": "PCNfR_dmd", "description": "Demanded corrected fan speed", "unit": "rpm", "type": "speed"},
    "sensor_20": {"name": "W31", "description": "HPT coolant bleed", "unit": "lbm/s", "type": "flow"},
    "sensor_21": {"name": "W32", "description": "LPT coolant bleed", "unit": "lbm/s", "type": "flow"},
    "op_setting_1": {"name": "Altitude", "description": "Operating altitude", "unit": "ft", "type": "operating"},
    "op_setting_2": {"name": "Mach Number", "description": "Flight Mach number", "unit": "Mach", "type": "operating"},
    "op_setting_3": {"name": "TRA", "description": "Throttle Resolver Angle", "unit": "deg", "type": "operating"}
}

DATASET_METADATA = {
    "FD001": {
        "id": "FD001",
        "name": "FD001 – Single Condition",
        "description": "Aircraft gas turbine engine degradation simulation under single operating regime (Sea Level). Features HPC degradation fault mode.",
        "operating_conditions": 1,
        "operating_condition_desc": "Sea Level standard atmospheric conditions (Altitude: 0 ft, Mach: 0.0, TRA: 100°)",
        "fault_modes": 1,
        "fault_modes_desc": "High Pressure Compressor (HPC) degradation",
        "train_engines": 100,
        "test_engines": 100,
        "active_sensors_count": 14,
        "model_architecture": "XGBoost Regressor (Target Capped at 125 cycles)",
        "features_count": 19,
        "rul_cap": 125
    },
    "FD002": {
        "id": "FD002",
        "name": "FD002 – Multi Condition",
        "description": "Complex gas turbine simulation spanning 6 distinct operating regimes (varying flight altitude, Mach speed, and throttle settings).",
        "operating_conditions": 6,
        "operating_condition_desc": "Six operating regimes covering sea level to high altitude cruise (0-42,000 ft, 0.0-0.84 Mach)",
        "fault_modes": 1,
        "fault_modes_desc": "High Pressure Compressor (HPC) degradation",
        "train_engines": 260,
        "test_engines": 259,
        "active_sensors_count": 21,
        "model_architecture": "XGBoost Regressor with Condition-wise Z-Score Normalization",
        "features_count": 24,
        "rul_cap": 125
    }
}

VERIFIED_METRICS = {
    "FD001": {
        "dataset": "FD001",
        "model_type": "XGBoost Regressor (Capped)",
        "features": 19,
        "rul_cap": 125,
        "test_mae": 10.0040,
        "test_rmse": 15.7706,
        "test_r2": 0.6730,
        "final_cycle_mae": 14.2243,
        "final_cycle_rmse": 18.8926,
        "final_cycle_r2": 0.7933,
        "nasa_score": 611.4237,
        "avg_nasa_score": 6.1142,
        "baseline_comparison": {
            "uncapped_mae": 31.4058,
            "uncapped_rmse": 41.5673,
            "uncapped_r2": 0.5033,
            "uncapped_nasa_score": 5913.5753,
            "improvement_mae": "68.1%",
            "improvement_nasa_score": "89.7%"
        },
        "hyperparameters": {
            "n_estimators": 700,
            "max_depth": 4,
            "learning_rate": 0.01,
            "subsample": 1.0,
            "colsample_bytree": 1.0,
            "min_child_weight": 5,
            "reg_lambda": 1
        }
    },
    "FD002": {
        "dataset": "FD002",
        "model_type": "XGBoost Regressor (Normalized)",
        "features": 24,
        "rul_cap": 125,
        "validation_mae": 14.2713,
        "validation_rmse": 19.5785,
        "validation_r2": 0.7804,
        "enhanced_val_mae": 13.4035,
        "enhanced_val_rmse": 18.5647,
        "enhanced_val_r2": 0.8029,
        "final_cycle_mae": 20.7504,
        "final_cycle_rmse": 29.4203,
        "final_cycle_r2": 0.7007,
        "nasa_score": 155278.8549,
        "baseline_comparison": {
            "baseline_mae": 14.2887,
            "baseline_rmse": 19.6743,
            "baseline_r2": 0.7783,
            "baseline_nasa_score": 169944.9132,
            "improvement_nasa_score": "9.95%"
        },
        "hyperparameters": {
            "n_estimators": 1986,
            "max_depth": 3,
            "learning_rate": 0.01,
            "subsample": 0.8,
            "colsample_bytree": 0.9,
            "min_child_weight": 7,
            "reg_lambda": 10,
            "reg_alpha": 0.1
        }
    }
}


def classify_health(rul: float, critical_thresh: float = 30.0, warning_thresh: float = 75.0) -> dict:
    """Classify engine condition using application-defined RUL thresholds."""
    if rul <= critical_thresh:
        return {
            "status": "Critical",
            "color": "#DC2626",
            "priority": "High Priority",
            "action": "Immediate Inspection / Overhaul Required"
        }
    elif rul <= warning_thresh:
        return {
            "status": "Warning",
            "color": "#EAA329",
            "priority": "Medium Priority",
            "action": "Schedule Inspection Within Next Maintenance Window"
        }
    else:
        return {
            "status": "Healthy",
            "color": "#16A34A",
            "priority": "Routine",
            "action": "Continuous Monitoring"
        }


class DataService:
    def __init__(self):
        self._cache = {}

    def get_test_df(self, dataset: str) -> pd.DataFrame:
        dataset = dataset.upper()
        if dataset not in ["FD001", "FD002"]:
            raise ValueError(f"Invalid dataset: {dataset}. Must be FD001 or FD002.")

        if dataset in self._cache:
            return self._cache[dataset]

        file_path = DATA_DIR / f"test_{dataset}.txt"
        if not file_path.exists():
            raise FileNotFoundError(f"Test data file not found: {file_path}")

        df = pd.read_csv(file_path, sep=r"\s+", header=None, names=COLUMNS)
        self._cache[dataset] = df
        return df

    def get_engine_summaries(self, dataset: str, critical_thresh: float = 30.0, warning_thresh: float = 75.0) -> list:
        dataset = dataset.upper()
        cache_key = f"{dataset}_summaries_{critical_thresh}_{warning_thresh}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        df = self.get_test_df(dataset)
        last_cycles = df.groupby("unit_number").last().reset_index()

        # Batch predict for performance
        if dataset == "FD001":
            config = load_fd001_config()
            feature_cols = config["features"]
            X = last_cycles[feature_cols]
            preds = np.clip(fd001_model.predict(X), 0, 125)
        else:
            artifacts = load_preprocessing()
            df_temp = last_cycles.copy()
            df_temp["op_setting_1"] = df_temp["op_setting_1"].round(0)
            df_temp["op_setting_2"] = df_temp["op_setting_2"].round(2)
            lookup = artifacts["operating_condition_mapping"][
                ["op_setting_1", "op_setting_2", "op_setting_3", "operating_condition"]
            ].copy()
            lookup["op_setting_1"] = lookup["op_setting_1"].round(0)
            lookup["op_setting_2"] = lookup["op_setting_2"].round(2)
            lookup = lookup.drop_duplicates(subset=["op_setting_1", "op_setting_2", "op_setting_3"])

            df_temp = df_temp.merge(lookup, on=["op_setting_1", "op_setting_2", "op_setting_3"], how="left")
            conditions = df_temp["operating_condition"]

            for sensor in artifacts["normalized_sensors"]:
                means = artifacts["condition_stats"][(sensor, "mean")]
                stds = artifacts["condition_stats"][(sensor, "std")]
                df_temp[f"{sensor}_normalized"] = (df_temp[sensor] - conditions.map(means)) / conditions.map(stds)

            X = df_temp[artifacts["normalized_features"]]
            preds = np.clip(fd002_model.predict(X), 0, 125)

        engines = []
        for i, row in last_cycles.iterrows():
            rul_val = round(float(preds[i]), 1)
            health = classify_health(rul_val, critical_thresh, warning_thresh)
            engines.append({
                "engine_id": int(row["unit_number"]),
                "dataset": dataset,
                "current_cycle": int(row["time_in_cycles"]),
                "predicted_rul": rul_val,
                "unit": "cycles",
                "health_status": health["status"],
                "health_color": health["color"],
                "priority": health["priority"],
                "recommended_action": health["action"],
                "last_op_settings": {
                    "op_setting_1": float(row["op_setting_1"]),
                    "op_setting_2": float(row["op_setting_2"]),
                    "op_setting_3": float(row["op_setting_3"])
                }
            })

        self._cache[cache_key] = engines
        return engines

    def get_overview_data(self, dataset: str, critical_thresh: float = 30.0, warning_thresh: float = 75.0) -> dict:
        dataset = dataset.upper()
        summaries = self.get_engine_summaries(dataset, critical_thresh, warning_thresh)

        total_engines = len(summaries)
        healthy_count = sum(1 for e in summaries if e["health_status"] == "Healthy")
        warning_count = sum(1 for e in summaries if e["health_status"] == "Warning")
        critical_count = sum(1 for e in summaries if e["health_status"] == "Critical")
        avg_rul = round(float(np.mean([e["predicted_rul"] for e in summaries])), 1) if summaries else 0.0

        # Donut distribution
        health_distribution = [
            {"name": "Healthy", "value": healthy_count, "color": "#16A34A"},
            {"name": "Warning", "value": warning_count, "color": "#EAA329"},
            {"name": "Critical", "value": critical_count, "color": "#DC2626"}
        ]

        # RUL Histogram (binned into 10 intervals)
        ruls = [e["predicted_rul"] for e in summaries]
        bins = [0, 15, 30, 45, 60, 75, 90, 105, 120, 130]
        bin_counts, _ = np.histogram(ruls, bins=bins)
        rul_histogram = []
        for i in range(len(bin_counts)):
            label = f"{bins[i]}-{bins[i+1]}"
            rul_histogram.append({
                "range": label,
                "count": int(bin_counts[i]),
                "status": "Critical" if bins[i+1] <= 30 else ("Warning" if bins[i+1] <= 75 else "Healthy")
            })

        # Degradation trends sample: take Engine 1 or first engine's sensors over its cycles
        df = self.get_test_df(dataset)
        sample_engine_id = summaries[0]["engine_id"]
        sample_engine_df = df[df["unit_number"] == sample_engine_id].sort_values("time_in_cycles")

        # Pick key sensors depending on dataset
        key_sensors = ["sensor_2", "sensor_3", "sensor_4", "sensor_7", "sensor_11", "sensor_12"]
        sensor_trends_sample = []
        # Downsample if long to at most 50 points
        step = max(1, len(sample_engine_df) // 40)
        for _, row in sample_engine_df.iloc[::step].iterrows():
            pt = {"cycle": int(row["time_in_cycles"])}
            for s in key_sensors:
                pt[s] = round(float(row[s]), 2)
            sensor_trends_sample.append(pt)

        # Recent predictions (sample first 10 engines)
        recent_predictions = summaries[:10]

        # Recent alerts (Critical and Warning engines)
        alerts = [e for e in summaries if e["health_status"] in ["Critical", "Warning"]]
        alerts.sort(key=lambda x: x["predicted_rul"])

        return {
            "dataset": dataset,
            "metadata": DATASET_METADATA.get(dataset, {}),
            "kpis": {
                "total_engines": total_engines,
                "healthy_engines": healthy_count,
                "warning_engines": warning_count,
                "critical_engines": critical_count,
                "avg_predicted_rul": avg_rul,
                "active_maintenance_alerts": len(alerts)
            },
            "health_distribution": health_distribution,
            "rul_histogram": rul_histogram,
            "sample_engine_id": sample_engine_id,
            "sensor_trends_sample": sensor_trends_sample,
            "recent_predictions": recent_predictions,
            "recent_alerts": alerts[:8]
        }

    def get_engine_details(self, dataset: str, engine_id: int) -> dict:
        dataset = dataset.upper()
        df = self.get_test_df(dataset)
        engine_df = df[df["unit_number"] == engine_id].sort_values("time_in_cycles")

        if engine_df.empty:
            raise ValueError(f"Engine ID {engine_id} not found in {dataset}")

        max_cycle = int(engine_df["time_in_cycles"].max())
        last_row = engine_df.iloc[-1]

        # Trajectory list for charts
        trajectory = []
        active_sensors = FD001_ACTIVE_SENSORS if dataset == "FD001" else FD002_ACTIVE_SENSORS
        
        # Downsample if cycles > 100 for high UI performance, but keep start and end
        step = 1 if len(engine_df) <= 120 else (2 if len(engine_df) <= 250 else 3)
        subset = engine_df.iloc[::step].copy()
        if subset.iloc[-1]["time_in_cycles"] != max_cycle:
            subset = pd.concat([subset, engine_df.iloc[[-1]]])

        for _, row in subset.iterrows():
            pt = {
                "cycle": int(row["time_in_cycles"]),
                "op_setting_1": float(row["op_setting_1"]),
                "op_setting_2": float(row["op_setting_2"]),
                "op_setting_3": float(row["op_setting_3"]),
            }
            for s in active_sensors:
                pt[s] = round(float(row[s]), 3)
            trajectory.append(pt)

        # Run prediction for this specific engine last cycle
        last_dict = last_row.to_dict()
        del last_dict["unit_number"]
        if dataset == "FD001":
            config = load_fd001_config()
            f_cols = config["features"]
            X = pd.DataFrame([last_dict])[f_cols]
            pred_rul = round(float(np.clip(fd001_model.predict(X)[0], 0, 125)), 1)
        else:
            from app.schemas import FD002SensorInput
            del last_dict["time_in_cycles"]
            from app.predictor import predict_fd002
            pred_res = predict_fd002(FD002SensorInput(**last_dict))
            pred_rul = pred_res["predicted_rul"]

        health = classify_health(pred_rul)

        # Sensor stats for this engine
        sensor_stats = {}
        for s in active_sensors:
            s_series = engine_df[s]
            sensor_stats[s] = {
                "initial": round(float(s_series.iloc[0]), 3),
                "latest": round(float(s_series.iloc[-1]), 3),
                "min": round(float(s_series.min()), 3),
                "max": round(float(s_series.max()), 3),
                "mean": round(float(s_series.mean()), 3),
                "metadata": SENSOR_METADATA.get(s, {})
            }

        return {
            "dataset": dataset,
            "engine_id": engine_id,
            "total_cycles": max_cycle,
            "predicted_rul": pred_rul,
            "health_status": health["status"],
            "health_color": health["color"],
            "priority": health["priority"],
            "recommended_action": health["action"],
            "trajectory": trajectory,
            "sensor_stats": sensor_stats,
            "active_sensors": active_sensors,
            "last_cycle_record": {k: float(v) for k, v in last_row.items()}
        }

    def get_cycle_record(self, dataset: str, engine_id: int, cycle: int) -> dict:
        dataset = dataset.upper()
        df = self.get_test_df(dataset)
        rec = df[(df["unit_number"] == engine_id) & (df["time_in_cycles"] == cycle)]
        if rec.empty:
            raise ValueError(f"Record for Engine {engine_id} at cycle {cycle} not found")

        row = rec.iloc[0].to_dict()
        return {
            "dataset": dataset,
            "engine_id": engine_id,
            "cycle": cycle,
            "data": {k: float(v) for k, v in row.items()}
        }

    def get_analytics(self, dataset: str) -> dict:
        dataset = dataset.upper()
        cache_key = f"{dataset}_analytics"
        if cache_key in self._cache:
            return self._cache[cache_key]

        df = self.get_test_df(dataset)
        active_sensors = FD001_ACTIVE_SENSORS if dataset == "FD001" else FD002_ACTIVE_SENSORS

        # Correlation matrix
        corr = df[active_sensors].corr().round(3).to_dict()

        # Sensor distributions summary across entire dataset
        distributions = {}
        for s in active_sensors:
            distributions[s] = {
                "mean": round(float(df[s].mean()), 3),
                "std": round(float(df[s].std()), 3),
                "min": round(float(df[s].min()), 3),
                "p25": round(float(df[s].quantile(0.25)), 3),
                "median": round(float(df[s].median()), 3),
                "p75": round(float(df[s].quantile(0.75)), 3),
                "max": round(float(df[s].max()), 3),
                "metadata": SENSOR_METADATA.get(s, {})
            }

        # Operating condition distribution for FD002
        op_conditions = []
        if dataset == "FD002":
            artifacts = load_preprocessing()
            df_temp = df[["op_setting_1", "op_setting_2", "op_setting_3"]].copy()
            df_temp["op_setting_1"] = df_temp["op_setting_1"].round(0)
            df_temp["op_setting_2"] = df_temp["op_setting_2"].round(2)
            lookup = artifacts["operating_condition_mapping"][
                ["op_setting_1", "op_setting_2", "op_setting_3", "operating_condition"]
            ].copy()
            lookup["op_setting_1"] = lookup["op_setting_1"].round(0)
            lookup["op_setting_2"] = lookup["op_setting_2"].round(2)
            lookup = lookup.drop_duplicates(subset=["op_setting_1", "op_setting_2", "op_setting_3"])
            df_temp = df_temp.merge(lookup, on=["op_setting_1", "op_setting_2", "op_setting_3"], how="left")
            counts = df_temp["operating_condition"].value_counts().to_dict()
            for cond, cnt in counts.items():
                if pd.notna(cond):
                    op_conditions.append({
                        "condition": int(cond),
                        "count": int(cnt),
                        "percentage": round(float(cnt / len(df_temp) * 100), 1)
                    })
            op_conditions.sort(key=lambda x: x["condition"])

        result = {
            "dataset": dataset,
            "active_sensors": active_sensors,
            "correlation_matrix": corr,
            "distributions": distributions,
            "operating_conditions": op_conditions,
            "sensor_metadata": SENSOR_METADATA
        }
        self._cache[cache_key] = result
        return result


data_service = DataService()
