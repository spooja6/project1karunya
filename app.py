from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# 1. Model Initialization
app = FastAPI(title="PulseML Health Predictor")

# Enable CORS for all origins (important for React frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request body schema
class PredictRequest(BaseModel):
    age: int
    bmi: float
    sleep: float
    stress: int

MODEL_PATH = "model.pkl"
model = None

@app.on_event("startup")
def load_model():
    """ Load or train model on startup """
    global model
    if os.path.exists(MODEL_PATH):
        print(f"Loading existing model from {MODEL_PATH}...")
        model = joblib.load(MODEL_PATH)
    else:
        print("Model not found. Running training script...")
        # In a real environment, we'd import and call train_model()
        # For simplicity in this script, we signal to run model_train.py first
        # os.system("python model_train.py")
        # model = joblib.load(MODEL_PATH)
        pass

@app.post("/predict")
async def predict(data: PredictRequest):
    """ Prediction endpoint """
    global model
    if model is None:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
        else:
            raise HTTPException(status_code=500, detail="Model not loaded. Please run training.")

    # Prepare features
    features = np.array([[data.age, data.bmi, data.sleep, data.stress]])
    
    # Get prediction and probabilities
    prediction = int(model.predict(features)[0])
    probabilities = model.predict_proba(features)[0]
    confidence = float(np.max(probabilities))
    
    # Map prediction to labels
    labels = ["Low Risk", "Medium Risk", "High Risk"]
    result = labels[prediction]

    return {
        "prediction": result,
        "confidence": confidence,
        "raw_probabilities": probabilities.tolist()
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
