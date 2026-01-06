 // Constants
 const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
 const CAPTURE_INTERVAL = 50; // ms

 // State
 let handLandmarker = null;
 let model = null;
 let video = null;
 let canvas = null;
 let ctx = null;
 let captureInterval = null;
 let videoStream = null;

 // Hand landmark connections
 const HAND_CONNECTIONS = [
     [0, 1], [1, 2], [2, 3], [3, 4],           // Thumb
     [0, 5], [5, 6], [6, 7], [7, 8],           // Index
     [0, 9], [9, 10], [10, 11], [11, 12],      // Middle
     [0, 13], [13, 14], [14, 15], [15, 16],    // Ring
     [0, 17], [17, 18], [18, 19], [19, 20]     // Pinky
 ];

 // Load MediaPipe
 async function loadMediaPipeLibrary() {
     if (window.HandLandmarker && window.FilesetResolver) return;
     
     updateStatus('Loading MediaPipe library...');
     try {
         const mediapipeModule = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3');
         window.HandLandmarker = mediapipeModule.HandLandmarker;
         window.FilesetResolver = mediapipeModule.FilesetResolver;
         console.log('MediaPipe loaded');
     } catch (e) {
         console.error('Failed to load MediaPipe:', e);
         throw e;
     }
 }

 // Initialize
 async function init() {
     setupButtons();
     
     video = document.getElementById('video');
     canvas = document.getElementById('canvas');
     ctx = canvas.getContext('2d');

     try {
         updateStatus('Initializing...');
         await loadMediaPipeLibrary();
         
         if (!window.HandLandmarker || !window.FilesetResolver) {
             throw new Error('MediaPipe library not available');
         }

         updateStatus('Loading models...');
         await Promise.all([loadMediaPipeModel(), loadTensorFlowModel()]);
         
         updateStatus('Ready to start');
     } catch (error) {
         console.error('Init error:', error);
         updateStatus('Error: ' + error.message);
     }
 }

 // Setup buttons
 function setupButtons() {
     const startBtn = document.getElementById('start-btn');
     const exitBtn = document.getElementById('exit-btn');
     
     if (startBtn) {
         startBtn.addEventListener('click', startDemo);
     }
     if (exitBtn) {
         exitBtn.addEventListener('click', exitDemo);
     }
 }

 // Start demo
 async function startDemo() {
     document.getElementById('start-screen').classList.add('hidden');
     document.getElementById('demo-area').classList.remove('hidden');
     
     updateStatus('Initializing webcam...');
     await initWebcam();
     updateStatus('Ready');
     startCapture();
 }

 // Exit demo
 function exitDemo() {
     // Stop capture
     if (captureInterval) {
         clearInterval(captureInterval);
         captureInterval = null;
     }
     
     // Stop video stream
     if (videoStream) {
         videoStream.getTracks().forEach(track => track.stop());
         videoStream = null;
     }
     
     // Clear video
     if (video) {
         video.srcObject = null;
     }
     
     // Clear canvas
     if (ctx) {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
     }
     
     // Reset displays
     document.getElementById('prediction-display').textContent = '--';
     document.getElementById('confidence-display').textContent = '--%';
     
     // Return to start screen
     document.getElementById('start-screen').classList.remove('hidden');
     document.getElementById('demo-area').classList.add('hidden');
     
     updateStatus('Ready to start');
 }

 // Initialize webcam
 async function initWebcam() {
     videoStream = await navigator.mediaDevices.getUserMedia({
         video: { width: { ideal: 1920 }, height: { ideal: 1440 }, facingMode: 'user' }
     });
     video.srcObject = videoStream;
     await video.play();
 }

 // Load MediaPipe model
 async function loadMediaPipeModel() {
     console.log('Loading MediaPipe model...');
     const HandLandmarker = window.HandLandmarker;
     const FilesetResolver = window.FilesetResolver;

     const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
     
     const modelPaths = [
         './public/models/hand_landmarker.task',
     ];

     for (const modelPath of modelPaths) {
         try {
             console.log('Trying model path:', modelPath);
             handLandmarker = await HandLandmarker.createFromOptions(vision, {
                 baseOptions: { modelAssetPath: modelPath },
                 runningMode: 'IMAGE',
                 numHands: 2,
                 minHandDetectionConfidence: 0.5,
                 minHandPresenceConfidence: 0.5
             });
             console.log('✓ MediaPipe model loaded from:', modelPath);
             return;
         } catch (e) {
             console.log('✗ Failed path:', modelPath, e.message);
         }
     }
     throw new Error('Could not load MediaPipe model from any path. Check console for details.');
 }

 // Load TensorFlow model
 async function loadTensorFlowModel() {
     console.log('Loading TensorFlow model...');
     const modelPaths = [
         './public/models/model.json',
     ];

     for (const modelPath of modelPaths) {
         try {
             model = await tf.loadGraphModel(modelPath);
             console.log('TensorFlow model loaded');
             return;
         } catch (e) {
             console.log('Failed path:', modelPath);
         }
     }
     console.warn('TensorFlow model not loaded - predictions will not work');
 }

 // Preprocess hand landmarks
 function preprocessHandLandmarks(handWorldLandmarks) {
     if (handWorldLandmarks.length < 1) {
         return tf.tensor([], [0, 0, 0], 'float32');
     }

     const coordinates = handWorldLandmarks.flatMap((handLandmarks) =>
         handLandmarks.map((landmark) => [landmark.x, landmark.y, landmark.z])
     );

     if (handWorldLandmarks.length === 1) {
         coordinates.push(...Array(21).fill([-1, -1, -1]));
     }

     return tf.tensor(coordinates)
         .reshape([2, 21, 3])
         .transpose([1, 2, 0])
         .expandDims();
 }

 // Get prediction
 async function getPrediction(landmarkTensor) {
     if (!model) {
         return { letter: 'No Model', confidence: 0 };
     }

     try {
         const prediction = model.predict(landmarkTensor);
         const probabilities = tf.softmax(prediction, 1);
         const maxProbability = (await probabilities.max().data())[0];
         const maxIndex = (await probabilities.argMax(1).data())[0];
         
         prediction.dispose();
         probabilities.dispose();

         const confidencePercent = (maxProbability * 100).toFixed(1);
         return {
             letter: ALPHABET[maxIndex] || 'Unknown',
             confidence: maxProbability,
             confidencePercent
         };
     } catch (e) {
         console.error('Prediction error:', e);
         return { letter: 'Error', confidence: 0, confidencePercent: '0.0' };
     }
 }

 // Draw landmarks
 function drawLandmarks(landmarks) {
     if (!landmarks) return;

     // Draw connections
     ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
     ctx.lineWidth = 3;

     for (const hand of landmarks) {
         HAND_CONNECTIONS.forEach(([start, end]) => {
             if (hand[start] && hand[end]) {
                 ctx.beginPath();
                 ctx.moveTo(hand[start].x * canvas.width, hand[start].y * canvas.height);
                 ctx.lineTo(hand[end].x * canvas.width, hand[end].y * canvas.height);
                 ctx.stroke();
             }
         });
     }

     // Draw joints
     ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
     for (const hand of landmarks) {
         for (const landmark of hand) {
             ctx.beginPath();
             ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 4, 0, 2 * Math.PI);
             ctx.fill();
         }
     }
 }

 // Process frame
 async function processFrame() {
     if (!video || !canvas || !handLandmarker || video.readyState !== 4) return;

     canvas.width = video.videoWidth;
     canvas.height = video.videoHeight;

     ctx.drawImage(video, 0, 0);
     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
     const results = handLandmarker.detect(imageData);

     ctx.clearRect(0, 0, canvas.width, canvas.height);
     ctx.drawImage(video, 0, 0);

     if (results.landmarks && results.landmarks.length > 0) {
         drawLandmarks(results.landmarks);

         const landmarkTensor = preprocessHandLandmarks(results.worldLandmarks);
         const predictionResult = await getPrediction(landmarkTensor);
         
         // Update confidence display
         document.getElementById('prediction-display').textContent = predictionResult.letter;
         document.getElementById('confidence-display').textContent = predictionResult.confidencePercent + '%';

         landmarkTensor.dispose();
     } else {
         document.getElementById('prediction-display').textContent = '--';
         document.getElementById('confidence-display').textContent = '--%';
     }
 }

 // Start capture
 function startCapture() {
     if (captureInterval) clearInterval(captureInterval);
     captureInterval = setInterval(processFrame, CAPTURE_INTERVAL);
 }

 // Update status
 function updateStatus(text) {
     document.getElementById('status-text').textContent = text;
 }

 // Start on load
 window.addEventListener('load', init);