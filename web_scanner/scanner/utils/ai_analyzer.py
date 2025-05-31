import joblib
import os

class AIVulnerabilityClassifier:
    def __init__(self):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "../../ml_model/vuln_model.joblib")
        vectorizer_path = os.path.join(base_dir, "../../ml_model/vuln_vectorizer.joblib")

        self.model = joblib.load(model_path)
        self.vectorizer = joblib.load(vectorizer_path)

    def predict(self, text):
        X = self.vectorizer.transform([text])
        return self.model.predict(X)[0]
