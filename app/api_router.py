from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Body
from app.data_service import (
    data_service,
    DATASET_METADATA,
    VERIFIED_METRICS,
    SENSOR_METADATA,
    classify_health
)
from app.schemas import FD001SensorInput, FD002SensorInput
from app.predictor import predict_fd001, predict_fd002

router = APIRouter()


@router.get("/datasets")
def get_datasets():
    """Return all available datasets and their metadata."""
    return {
        "datasets": list(DATASET_METADATA.values()),
        "default": "FD001"
    }


@router.get("/overview/{dataset}")
def get_overview(
    dataset: str,
    critical_threshold: float = Query(30.0, description="Application-defined critical RUL threshold"),
    warning_threshold: float = Query(75.0, description="Application-defined warning RUL threshold")
):
    """Return dashboard KPI metrics and aggregated distributions."""
    try:
        return data_service.get_overview_data(dataset, critical_threshold, warning_threshold)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/engines/{dataset}")
def get_engines(
    dataset: str,
    status: Optional[str] = Query(None, description="Filter by health status: Healthy, Warning, Critical"),
    critical_threshold: float = Query(30.0),
    warning_threshold: float = Query(75.0)
):
    """Return all engines in the dataset with their latest status and predicted RUL."""
    try:
        summaries = data_service.get_engine_summaries(dataset, critical_threshold, warning_threshold)
        if status:
            summaries = [e for e in summaries if e["health_status"].lower() == status.lower()]
        return {
            "dataset": dataset.upper(),
            "total_count": len(summaries),
            "engines": summaries
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sensors/{dataset}/{engine_id}")
def get_engine_sensors(dataset: str, engine_id: int):
    """Return complete sensor readings and trajectory for an engine."""
    try:
        return data_service.get_engine_details(dataset, engine_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sensors/{dataset}/{engine_id}/cycle/{cycle}")
def get_engine_cycle_sensor(dataset: str, engine_id: int, cycle: int):
    """Return raw sensor readings for a specific engine and cycle."""
    try:
        return data_service.get_cycle_record(dataset, engine_id, cycle)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/analytics/{dataset}")
def get_dataset_analytics(dataset: str):
    """Return correlation matrix, sensor distributions, and operating conditions."""
    try:
        return data_service.get_analytics(dataset)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/alerts/{dataset}")
def get_dataset_alerts(
    dataset: str,
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    critical_threshold: float = Query(30.0),
    warning_threshold: float = Query(75.0)
):
    """Return maintenance alerts for engines needing attention."""
    try:
        summaries = data_service.get_engine_summaries(dataset, critical_threshold, warning_threshold)
        # Filter to Critical and Warning by default unless a specific status is passed
        if status:
            alerts = [e for e in summaries if e["health_status"].lower() == status.lower()]
        else:
            alerts = [e for e in summaries if e["health_status"] in ["Critical", "Warning"]]

        if priority:
            alerts = [e for e in alerts if priority.lower() in e["priority"].lower()]

        alerts.sort(key=lambda x: x["predicted_rul"])
        return {
            "dataset": dataset.upper(),
            "total_alerts": len(alerts),
            "alerts": alerts
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/metrics/{dataset}")
def get_model_metrics(dataset: str):
    """Return verified model evaluation metrics for the dataset."""
    dataset = dataset.upper()
    if dataset not in VERIFIED_METRICS:
        raise HTTPException(status_code=404, detail=f"No verified metrics for dataset {dataset}")
    return VERIFIED_METRICS[dataset]


@router.get("/sensor-metadata")
def get_sensor_metadata():
    """Return descriptions and engineering units for all sensors."""
    return SENSOR_METADATA


@router.get("/reports/figures")
def get_report_figures(dataset: Optional[str] = Query(None)):
    """Return catalog of EDA and sensor prediction figures extracted from notebooks."""
    import json
    from pathlib import Path
    manifest_file = Path(__file__).resolve().parent.parent / "frontend" / "public" / "eda" / "manifest.json"
    if not manifest_file.exists():
        return {"figures": []}
    with open(manifest_file, "r", encoding="utf-8") as f:
        figures = json.load(f)
    if dataset:
        figures = [fig for fig in figures if fig.get("dataset", "").upper() == dataset.upper()]
    return {"figures": figures}


@router.post("/predict/{dataset}")
def predict_unified(
    dataset: str,
    data: Dict[str, Any] = Body(...)
):
    """
    Unified prediction endpoint that accepts raw sensor readings
    and delegates to the appropriate FD001 or FD002 pipeline.
    """
    dataset = dataset.upper()
    if dataset == "FD001":
        try:
            # Filter to FD001 schema fields
            filtered = {k: v for k, v in data.items() if k in FD001SensorInput.model_fields}
            validated_input = FD001SensorInput(**filtered)
            result = predict_fd001(validated_input)
            health = classify_health(result["predicted_rul"])
            result.update(health)
            return result
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"FD001 prediction error: {str(e)}")
    elif dataset == "FD002":
        try:
            filtered = {k: v for k, v in data.items() if k in FD002SensorInput.model_fields}
            validated_input = FD002SensorInput(**filtered)
            result = predict_fd002(validated_input)
            health = classify_health(result["predicted_rul"])
            result.update(health)
            return result
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"FD002 prediction error: {str(e)}")
    else:
        raise HTTPException(status_code=400, detail=f"Unknown dataset {dataset}. Expected FD001 or FD002.")
