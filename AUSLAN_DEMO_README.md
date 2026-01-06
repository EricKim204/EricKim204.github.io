# Auslan Demo Integration

## Overview
This is a vanilla JavaScript implementation of the Auslan (Australian Sign Language) fingerspelling recognition demo, converted from React to work with Jekyll/static sites.

## Files Structure

### Main Files
- `demo.html` - Standalone demo page (vanilla JS, no React)
- `index.html` - Updated portfolio with link to demo

### Model Files (Required)
- `public/models/model.json` - TensorFlow.js model
- `public/models/group1-shard1of1.bin` - Model weights
- `public/models/hand_landmarker.task` - MediaPipe hand landmark model

## How It Works

1. **MediaPipe**: Detects hand landmarks from webcam feed
2. **TensorFlow.js**: Predicts letter from hand landmarks

## Jekyll Compatibility

The demo is fully compatible with Jekyll:
- Pure HTML/CSS/JavaScript (no build step)
- Static assets in `public/` folder
- No React or build dependencies
- Can be included as a Jekyll page or standalone HTML

## Browser Requirements

- Modern browser with WebRTC support
- Webcam access permissions
- ES6 modules support

