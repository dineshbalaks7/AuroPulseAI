
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import (
    FD001SensorInput,
    FD002SensorInput
)

from app.predictor import (
    predict_fd001,
    predict_fd002
)
from app.api_router import router as api_router


app = FastAPI(
    title="NASA Predictive Maintenance API",
    description="Remaining Useful Life prediction using XGBoost",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include extended API routes for dataset, engines, sensors, analytics, and metrics
app.include_router(api_router)


@app.get("/")
def home():
    return {
        "message": "Predictive Maintenance API is running",
        "models": ["FD001", "FD002"]
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "models": {
            "FD001": "loaded",
            "FD002": "loaded"
        }
    }


@app.post("/predict/fd001")
def predict_fd001_endpoint(data: FD001SensorInput):
    try:
        return predict_fd001(data)

    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="FD001 prediction failed. Please try again."
        )


@app.post("/predict/fd002")
def predict_fd002_endpoint(data: FD002SensorInput):
    try:
        return predict_fd002(data)

    except ValueError as error:
        raise HTTPException(
            status_code=422,
            detail=str(error)
        )

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="FD002 prediction failed. Please try again."
        )
