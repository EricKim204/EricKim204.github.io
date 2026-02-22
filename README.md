# Eric Kim - Portfolio Website

## About

This repository contains my personal portfolio website featuring my professional background, technical skills, and project work.  
The site is a **static HTML/Tailwind CSS** frontend with light JavaScript for navigation and an **Auslan fingerspelling demo** powered by **MediaPipe** and **TensorFlow.js**.  
It is deployed on GitHub Pages.

**Live Site:** `https://erickim204.github.io/`

## Featured Projects

### Auslan Web App
A web application that interprets Auslan fingerspelling into text using a custom pretrained model. The browser-based demo uses the webcam, runs MediaPipe hand tracking in real time, and feeds landmarks into a TensorFlow.js model for per-frame letter predictions.

**Technologies:** Computer Vision, TensorFlow.js, MediaPipe, JavaScript  
**Links:** [Demo](auslan_demo.html) | [Write-up](auslan_writeup.html) | [Model GitHub](https://github.com/victorwkb/auslan)

### LSTM-ARFIMA Hybrid Timeseries Forecasting
Co-authored research paper published in the Journal of Econometrics and Statistics. Timeseries forecasting combining deep learning (LSTM) and statistical modelling (ARFIMA).

**Technologies:** R, Python, Timeseries Forecasting  
**Links:** [GitHub](https://github.com/EricKim204/DLTimeSeries) | [Paper](https://www.arfjournals.com/image/catalog/Journals%20Papers/JES/2025/No%201%20(2025)/Article_7.pdf)

### Green Battery Hack
Battery optimization algorithms for the energy market using an ensemble of regression models (CatBoost and XGBoost) fitted on historical market data.

**Technologies:** XGBoost, CatBoost, Forecasting, Optimization  
**Links:** [GitHub](https://github.com/victorwkb/gbh-skvalp)

### Finetuning Vision Transformers for Object Detection
Custom training scripts in PyTorch using data augmentation and hyperparameter tuning. Achieved first place in university Kaggle competition.

**Technologies:** Computer Vision, PyTorch, Transformers  
**Links:** [GitHub](https://github.com/EricKim204/ObjectDetectionKaggleComp) | [Kaggle](https://www.kaggle.com/competitions/fit5215-objectdection-s2-2023/leaderboard)

## Project Structure

```text
├── index.html           # Main portfolio landing page (About, Projects, Contact)
├── auslan_demo.html     # Auslan fingerspelling practice demo (webcam)
├── auslan_demo.js       # MediaPipe hand tracking + TensorFlow.js inference logic
├── auslan_writeup.html  # Detailed write-up for the Auslan web app
├── landing_ui.js        # Sidebar navigation and landing page UI interactions
└── public/
    ├── images/          # Project images and thumbnails
    └── models/          # TensorFlow.js and MediaPipe model files
```