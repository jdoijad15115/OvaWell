# PCOS Ultrasound Dataset Setup Guide

This guide explains how to download and integrate the PCOS ultrasound image dataset for enhanced diagnostic capabilities.

## Dataset Information

**Source**: Kaggle - PCOS Detection Using Ultrasound Images  
**URL**: https://www.kaggle.com/datasets/anaghachoudhari/pcos-detection-using-ultrasound-images  
**Size**: ~3,500 ultrasound images  
**Labels**: infected (PCOS positive) / notinfected (PCOS negative)  
**Format**: JPEG images

## Quick Start (No Model Training Needed)

For the hackathon demo, you can skip the dataset download. The `image_analyzer.py` module uses OpenCV-based detection that works without training data.

## Option 1: Download Dataset (Recommended for Production)

### Prerequisites
```bash
# Install Kaggle CLI
pip install kaggle
```

### Setup Kaggle API Credentials

1. Go to https://www.kaggle.com/account
2. Click "Create New API Token"
3. Download `kaggle.json` file
4. Place it in the correct location:

**Mac/Linux:**
```bash
mkdir -p ~/.kaggle
mv ~/Downloads/kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json
```

**Windows:**
```cmd
mkdir %USERPROFILE%\.kaggle
move Downloads\kaggle.json %USERPROFILE%\.kaggle\
```

### Download the Dataset

```bash
# Navigate to project directory
cd /path/to/femmenourish

# Download dataset
kaggle datasets download -d anaghachoudhari/pcos-detection-using-ultrasound-images

# Unzip to data directory
mkdir -p data/ultrasound
unzip pcos-detection-using-ultrasound-images.zip -d data/ultrasound/

# Clean up
rm pcos-detection-using-ultrasound-images.zip
```

### Expected Directory Structure

After extraction:
```
femmenourish/
├── data/
│   └── ultrasound/
│       ├── infected/          # PCOS positive images (~1750 images)
│       │   ├── image1.jpg
│       │   ├── image2.jpg
│       │   └── ...
│       └── notinfected/       # PCOS negative images (~1750 images)
│           ├── image1.jpg
│           ├── image2.jpg
│           └── ...
```

## Option 2: Train Custom Model (Advanced)

If you want to train a custom CNN model on this dataset:

### Install TensorFlow
```bash
pip install tensorflow==2.15.0
```

### Training Script (Simplified)

Create `train_model.py`:
```python
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# Data augmentation
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    validation_split=0.2
)

# Load training data
train_generator = train_datagen.flow_from_directory(
    'data/ultrasound/',
    target_size=(224, 224),
    batch_size=32,
    class_mode='binary',
    subset='training'
)

validation_generator = train_datagen.flow_from_directory(
    'data/ultrasound/',
    target_size=(224, 224),
    batch_size=32,
    class_mode='binary',
    subset='validation'
)

# Build model using transfer learning
base_model = tf.keras.applications.ResNet50(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
)

base_model.trainable = False  # Freeze base layers

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Train
history = model.fit(
    train_generator,
    epochs=10,
    validation_data=validation_generator
)

# Save model
model.save('models/pcos_ultrasound_model.h5')
print("Model saved to models/pcos_ultrasound_model.h5")
```

### Run Training
```bash
python train_model.py
```

### Use Trained Model

Update `utils/image_analyzer.py` to load your model:
```python
analyzer = UltrasoundAnalyzer(model_path='models/pcos_ultrasound_model.h5')
```

## Option 3: Use Pre-trained Model (Quickest for Demo)

If someone has already trained a model, you can download and use it directly:

```bash
# Create models directory
mkdir -p models

# Download pre-trained model (if available)
# Place .h5 file in models/ directory

# Use in app
analyzer = UltrasoundAnalyzer(model_path='models/pcos_ultrasound_model.h5')
```

## Current Implementation (No Download Needed)

The current `image_analyzer.py` uses OpenCV's Hough Circle Transform to detect circular patterns (follicles) in ultrasound images. This works without any dataset or training!

**How it works:**
1. Converts image to grayscale
2. Detects circular patterns
3. Counts circles (potential follicles)
4. If count >= 12, suggests PCOS pattern (Rotterdam criteria)

**Pros:**
- ✅ No dataset download needed
- ✅ No training required
- ✅ Works out of the box
- ✅ Fast processing

**Cons:**
- ⚠️ Less accurate than trained CNN
- ⚠️ Simplified detection logic
- ⚠️ Needs clinical validation

For a **6-hour hackathon**, the OpenCV approach is PERFECT!

For **production deployment**, train a proper CNN model.

## Testing the Ultrasound Analysis

### Create Test Script

Create `test_ultrasound.py`:
```python
from utils.image_analyzer import UltrasoundAnalyzer
import os

analyzer = UltrasoundAnalyzer()

# Test with a sample image
test_image = "data/ultrasound/infected/sample.jpg"

if os.path.exists(test_image):
    result = analyzer.analyze_image(test_image)
    print("Analysis Result:")
    print(f"  PCOS Pattern: {result['pcos_pattern']}")
    print(f"  Confidence: {result['confidence']}%")
    print(f"  Cyst Count: {result['cyst_count_estimate']}")
    print(f"  Interpretation: {result['interpretation']}")
else:
    print(f"Test image not found at {test_image}")
    print("Using OpenCV-based detection (no dataset needed)")
```

Run:
```bash
python test_ultrasound.py
```

## Sample Images for Demo

If you don't have the dataset, you can use sample ultrasound images from:
- Google Images (search "pcos ultrasound")
- Medical image repositories
- Create `assets/sample_ultrasound.jpg` with a sample image

## Troubleshooting

### "Kaggle API credentials not found"
- Make sure `kaggle.json` is in `~/.kaggle/` directory
- Check file permissions: `chmod 600 ~/.kaggle/kaggle.json`

### "Dataset download failed"
- Check internet connection
- Verify Kaggle account is verified (phone number)
- Try downloading manually from Kaggle website

### "OpenCV not detecting circles"
- Ensure image is a grayscale ultrasound
- Try adjusting Hough Circle parameters in `image_analyzer.py`
- Image quality may be too low

### "TensorFlow installation issues"
- Use Python 3.9-3.11 (TensorFlow compatibility)
- Try: `pip install --upgrade pip`
- On M1/M2 Mac: `pip install tensorflow-macos`

## Recommended Approach for Your Hackathon

**6-Hour Timeline:**
1. ✅ Skip dataset download
2. ✅ Use OpenCV-based detection (already implemented)
3. ✅ Focus on UI and API integration
4. ✅ Demo with 2-3 sample ultrasound images

**Post-Hackathon (If You Win!):**
1. Download full dataset
2. Train proper CNN model
3. Achieve 85-90% accuracy
4. Deploy as clinical-grade tool

---

**Questions?** Check the main README.md or raise an issue.

**Note**: This is a medical AI tool. Always include proper disclaimers and emphasize that it's for assisting healthcare professionals, not for self-diagnosis.
