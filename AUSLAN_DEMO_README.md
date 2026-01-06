# Auslan Demo Integration

## Overview
This is a vanilla JavaScript implementation of the Auslan (Australian Sign Language) fingerspelling recognition demo, converted from React to work with Jekyll/static sites.

## Files Structure

### Main Files
- `auslan-demo.html` - Standalone demo page (vanilla JS, no React)
- `index.html` - Updated portfolio with link to demo

### Model Files (Required)
- `public/models/model.json` - TensorFlow.js model
- `public/models/group1-shard1of1.bin` - Model weights
- `public/models/hand_landmarker.task` - MediaPipe hand landmark model

### Files That Can Be Removed (React/TypeScript)
The following files are no longer needed since we converted to vanilla JS:
- `components/` folder (all React components)
- `hooks/` folder (React hooks)
- `lib/` folder (TypeScript utilities - logic converted to JS in demo)
- `_pages/` folder (if not used for Jekyll)

## How It Works

1. **MediaPipe**: Detects hand landmarks from webcam feed
2. **TensorFlow.js**: Predicts letter from hand landmarks
3. **Quiz Mode**: Tests user's ability to sign specific letters

## Dependencies

Loaded via CDN (no npm install needed):
- Tailwind CSS
- TensorFlow.js
- MediaPipe Tasks Vision

## Usage

1. Open `auslan-demo.html` in a browser
2. Allow webcam access when prompted
3. Wait for models to load
4. Click "Start Quiz" to begin
5. Show the requested letter with your hand

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

