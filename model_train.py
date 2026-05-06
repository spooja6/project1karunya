import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_with_shuffle
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# 1. Dataset Generation (Synthetic Health Data)
def create_dataset():
    """ Creates a synthetic dataset for health risk prediction """
    np.random.seed(42)
    n_samples = 1000
    
    # Features: Age, BMI, Sleep Hours, Stress Level (1-10)
    age = np.random.randint(18, 80, n_samples)
    bmi = np.random.uniform(18, 35, n_samples)
    sleep = np.random.uniform(4, 10, n_samples)
    stress = np.random.randint(1, 11, n_samples)
    
    data = pd.DataFrame({
        'age': age,
        'bmi': bmi,
        'sleep': sleep,
        'stress': stress
    })
    
    # Simple logic for target: Risk Score
    # Higher risk if high BMI, low sleep, high stress, high age
    risk_score = (age * 0.1) + (bmi * 0.5) - (sleep * 2) + (stress * 1.5)
    
    # Classification: 0 (Low Risk), 1 (Medium Risk), 2 (High Risk)
    target = pd.cut(risk_score, bins=[-np.inf, 15, 30, np.inf], labels=[0, 1, 2])
    
    return data, target

# 2. Model Training
def train_model():
    print("Loading/Creating dataset...")
    X, y = create_dataset()
    
    # Simple split
    split = int(0.8 * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    
    print("Training RandomForest model using scikit-learn...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # 3. Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Training Complete. Accuracy: {accuracy:.4f}")
    
    # 4. Save model
    joblib.dump(model, 'model.pkl')
    print("Model saved to model.pkl")

if __name__ == "__main__":
    train_model()
