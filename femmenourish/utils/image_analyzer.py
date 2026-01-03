"""
Ultrasound Image Analysis for PCOS detection.
Uses OpenCV-based detection for hackathon demo.
For production, integrate with pre-trained CNN model.
"""

import cv2
import numpy as np
from PIL import Image
import os
from typing import Dict, Optional


class UltrasoundAnalyzer:
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize ultrasound analyzer.
        
        Args:
            model_path: Path to pre-trained model (optional for hackathon)
        """
        self.model_path = model_path
        self.model = None
        
        # If model exists, load it (for future integration)
        if model_path and os.path.exists(model_path):
            try:
                import tensorflow as tf
                self.model = tf.keras.models.load_model(model_path)
                print("✅ Loaded pre-trained ultrasound model")
            except Exception as e:
                print(f"⚠️ Could not load model: {e}")
                print("Falling back to OpenCV-based analysis")
    
    def analyze_image(self, image_path: str) -> Dict:
        """
        Analyze ultrasound image for PCOS indicators.
        
        Args:
            image_path: Path to ultrasound image file
        
        Returns:
            Dict with analysis results
        """
        
        try:
            # If we have a trained model, use it
            if self.model:
                return self._analyze_with_model(image_path)
            else:
                # Fallback to OpenCV-based analysis (for demo)
                return self._analyze_with_opencv(image_path)
        
        except Exception as e:
            return {
                "error": f"Image analysis error: {str(e)}",
                "pcos_pattern": "unknown",
                "confidence": 0
            }
    
    def _analyze_with_model(self, image_path: str) -> Dict:
        """
        Analyze using pre-trained TensorFlow model.
        
        Args:
            image_path: Path to image
        
        Returns:
            Analysis results
        """
        
        import tensorflow as tf
        
        # Load and preprocess image
        img = tf.keras.preprocessing.image.load_img(
            image_path,
            target_size=(224, 224)
        )
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array / 255.0  # Normalize
        
        # Predict
        prediction = self.model.predict(img_array, verbose=0)
        confidence = float(prediction[0][0]) * 100
        
        # Interpret results
        is_pcos = confidence > 50
        
        return {
            "pcos_pattern": "positive" if is_pcos else "negative",
            "confidence": confidence if is_pcos else (100 - confidence),
            "cyst_count_estimate": self._estimate_cyst_count(is_pcos, confidence),
            "ovarian_volume_estimate": "Likely > 10ml" if is_pcos else "Likely < 10ml",
            "interpretation": self._interpret_results(is_pcos, confidence),
            "method": "deep_learning"
        }
    
    def _analyze_with_opencv(self, image_path: str) -> Dict:
        """
        Simple OpenCV-based analysis (for hackathon demo).
        Detects circular patterns that might indicate follicles.
        
        Args:
            image_path: Path to image
        
        Returns:
            Analysis results
        """
        
        # Read image
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        
        if img is None:
            return {"error": "Could not read image file"}
        
        # Preprocess
        img = cv2.medianBlur(img, 5)
        
        # Detect circles using Hough Circle Transform
        circles = cv2.HoughCircles(
            img,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=20,
            param1=50,
            param2=30,
            minRadius=5,
            maxRadius=30
        )
        
        # Count circles (potential follicles)
        cyst_count = len(circles[0]) if circles is not None else 0
        
        # Determine if pattern suggests PCOS
        # Rotterdam criteria: 12+ follicles in one ovary
        is_pcos_pattern = cyst_count >= 12
        
        # Calculate confidence based on count
        if cyst_count >= 15:
            confidence = 90
        elif cyst_count >= 12:
            confidence = 75
        elif cyst_count >= 8:
            confidence = 50
        else:
            confidence = 30
        
        return {
            "pcos_pattern": "positive" if is_pcos_pattern else "negative",
            "confidence": confidence if is_pcos_pattern else (100 - confidence),
            "cyst_count_estimate": cyst_count,
            "ovarian_volume_estimate": self._estimate_volume(cyst_count),
            "interpretation": self._interpret_results(is_pcos_pattern, confidence),
            "method": "opencv_circle_detection",
            "note": "This is a simplified analysis. Clinical ultrasound interpretation required."
        }
    
    def _estimate_cyst_count(self, is_pcos: bool, confidence: float) -> str:
        """Estimate follicle count based on prediction."""
        if is_pcos and confidence > 80:
            return "15-20 (high)"
        elif is_pcos and confidence > 60:
            return "12-15 (moderate)"
        elif is_pcos:
            return "10-12 (borderline)"
        else:
            return "< 10 (normal)"
    
    def _estimate_volume(self, cyst_count: int) -> str:
        """Estimate ovarian volume based on cyst count."""
        if cyst_count >= 15:
            return "> 12ml (enlarged)"
        elif cyst_count >= 12:
            return "10-12ml (borderline)"
        else:
            return "< 10ml (normal)"
    
    def _interpret_results(self, is_pcos: bool, confidence: float) -> str:
        """Generate interpretation text."""
        if is_pcos and confidence > 75:
            return "Strong indicators of polycystic ovarian morphology consistent with PCOS Rotterdam criteria."
        elif is_pcos and confidence > 50:
            return "Moderate indicators suggesting polycystic ovarian morphology. Clinical correlation recommended."
        elif is_pcos:
            return "Borderline findings. Consider repeat ultrasound or additional clinical evaluation."
        else:
            return "No significant polycystic ovarian morphology detected."
