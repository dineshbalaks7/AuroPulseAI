import json
import base64
from pathlib import Path

out_dir = Path("frontend/public/eda")
out_dir.mkdir(parents=True, exist_ok=True)

extracted = []

# FD001 extraction
with open("notebooks/FD001_Model.ipynb", "r", encoding="utf-8") as f:
    nb1 = json.load(f)

fd001_mapping = {
    9: ("fd001_sensor_distributions.png", "FD001 Sensor Telemetry Distributions", "EDA: Histograms showing distribution curves across all 21 raw sensors"),
    11: ("fd001_correlation_matrix.png", "FD001 Inter-Sensor Correlation Heatmap", "EDA: Pearson r correlation matrix identifying coupled thermodynamic variables"),
    16: ("fd001_engine_life_distribution.png", "Fleet Operational Lifetime Distribution", "EDA: Maximum operating cycles before failure comparing FD001 vs FD002"),
    18: ("fd001_engine1_sensors.png", "Engine #1 Sensor Telemetry over Time", "EDA: Critical sensor trends (T24, T30, T50, P30) over operating cycles"),
    20: ("fd001_smoothed_sensor_trends.png", "10-Cycle Rolling Mean Sensor Trends", "EDA: Noise-filtered degradation trajectories showing clear upward drift"),
    37: ("fd001_feature_importance.png", "XGBoost Feature Importance Ranking", "Model Analysis: Top 15 telemetry features driving RUL predictions"),
    68: ("fd001_true_vs_predicted_rul.png", "FD001 True vs Predicted RUL", "Prediction: Model predictions vs ground truth with target capping at 125 cycles"),
    69: ("fd001_residuals_scatter.png", "FD001 Residuals vs Predicted RUL", "Prediction: Error distribution highlighting residual dispersion around 0"),
    70: ("fd001_residuals_histogram.png", "FD001 Prediction Error Distribution", "Prediction: Error histogram confirming bell-shaped residual distribution"),
    87: ("fd001_best_worst_comparison.png", "Degradation Comparison (Best vs Worst 10 Engines)", "EDA: Core speed (Nc) and fuel ratio differences in early vs late failures"),
    94: ("fd001_engine_by_engine_rul.png", "Final Cycle RUL Prediction per Engine", "Prediction: Engine-by-engine comparison of actual vs predicted RUL"),
    103: ("fd001_model_comparison.png", "FD001 Capped vs Uncapped Performance", "Model Evaluation: MAE, RMSE, and R2 performance comparison")
}

for cell_idx, (fname, title, desc) in fd001_mapping.items():
    if cell_idx < len(nb1["cells"]):
        cell = nb1["cells"][cell_idx]
        for out in cell.get("outputs", []):
            if "data" in out and "image/png" in out["data"]:
                img_data = base64.b64decode(out["data"]["image/png"])
                fpath = out_dir / fname
                with open(fpath, "wb") as img_f:
                    img_f.write(img_data)
                extracted.append({
                    "id": fname.replace(".png", ""),
                    "dataset": "FD001",
                    "file": f"/eda/{fname}",
                    "title": title,
                    "category": "EDA" if "EDA" in desc else ("Model Analysis" if "Model" in desc else "Prediction"),
                    "desc": desc,
                    "size_kb": round(len(img_data) / 1024, 1)
                })
                break

# FD002 extraction
with open("notebooks/FD002_Model.ipynb", "r", encoding="utf-8") as f:
    nb2 = json.load(f)

fd002_mapping = {
    8: ("fd002_sensor_distributions.png", "FD002 Multi-Regime Sensor Distributions", "EDA: Sensor spreads exhibiting multi-modal distributions due to 6 flight regimes"),
    20: ("fd002_sensor2_by_condition.png", "Sensor 2 Variation across Operating Regimes", "EDA: Boxplot demonstrating strong dependency of LPC temperature on flight regime"),
    24: ("fd002_sensor_variation.png", "Within-Condition Sensor Variance", "EDA: Standard deviations within operating regimes before normalization"),
    26: ("fd002_sensor2_vs_cycles_regimes.png", "Sensor 2 Trajectory Clustered by Regimes", "EDA: Distinct clusters corresponding to the 6 operating flight envelopes"),
    28: ("fd002_engine1_condition_trajectory.png", "Engine #1 Multi-Regime Flight Cycles", "EDA: Operating conditions traversed by Engine 1 throughout its service life"),
    83: ("fd002_true_vs_predicted.png", "FD002 True vs Predicted RUL", "Prediction: Normalized XGBoost predictions vs actual RUL on multi-condition holdout"),
    106: ("fd002_model_progression.png", "FD002 Model Iteration Comparison", "Model Evaluation: Baseline vs Normalized vs Hyperparameter-Tuned XGBoost")
}

for cell_idx, (fname, title, desc) in fd002_mapping.items():
    if cell_idx < len(nb2["cells"]):
        cell = nb2["cells"][cell_idx]
        for out in cell.get("outputs", []):
            if "data" in out and "image/png" in out["data"]:
                img_data = base64.b64decode(out["data"]["image/png"])
                fpath = out_dir / fname
                with open(fpath, "wb") as img_f:
                    img_f.write(img_data)
                extracted.append({
                    "id": fname.replace(".png", ""),
                    "dataset": "FD002",
                    "file": f"/eda/{fname}",
                    "title": title,
                    "category": "EDA" if "EDA" in desc else ("Model Analysis" if "Model" in desc else "Prediction"),
                    "desc": desc,
                    "size_kb": round(len(img_data) / 1024, 1)
                })
                break

manifest_path = Path("frontend/public/eda/manifest.json")
with open(manifest_path, "w", encoding="utf-8") as f:
    json.dump(extracted, f, indent=2)

print(f"Successfully extracted {len(extracted)} plots into {out_dir}")
