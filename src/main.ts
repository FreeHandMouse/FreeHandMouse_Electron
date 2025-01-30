import { HandLandmarker, FilesetResolver, HandLandmarkerResult } from "@mediapipe/tasks-vision"

const vision = await FilesetResolver.forVisionTasks(
  // TODO: ローカルにする
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.20/wasm"
)
const handLandmarker = await HandLandmarker.createFromOptions(
  vision,
  {
    baseOptions: {
      modelAssetPath: "hand_landmarker.task",
      delegate: "GPU",
    },
    numHands: 2,
    runningMode: "VIDEO",
  });

const video = document.getElementById("video") as HTMLVideoElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasContext = canvas.getContext("2d")!;

let lastVideoTime = -1;
let handLandmarkerResult: HandLandmarkerResult;
let detectedAtLastFrame = false;
let imageReverse = false;
startVideo();


async function startVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: 9999,
      height: 9999,
    },
  });
  video.srcObject = stream;
  if (imageReverse) video.style.transform = "scaleX(-1)";
  video.addEventListener("loadeddata", predictWebcam);
}

async function predictWebcam() {
  canvas.width = video.clientWidth;
  canvas.height = video.clientHeight;

  let startTimeMs = performance.now();
  if (lastVideoTime !== video.currentTime) {
    lastVideoTime = video.currentTime;
    handLandmarkerResult = handLandmarker.detectForVideo(video, startTimeMs, {

    });
  }

  if (detectedAtLastFrame || handLandmarkerResult.landmarks.length > 0) {
    window.ipcRenderer.send("landmarks", handLandmarkerResult);
    drawHandLandmarks(handLandmarkerResult);
  }
  detectedAtLastFrame = handLandmarkerResult.landmarks.length > 0;

  window.requestAnimationFrame(predictWebcam);
}

function drawHandLandmarks(handLandmarkerResult: HandLandmarkerResult) {
  let normalizedLandmarks = handLandmarkerResult.landmarks;
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  if (normalizedLandmarks) {
    for (const landmarks of normalizedLandmarks) {
      for (const landmark of landmarks) {
        canvasContext.beginPath();
        canvasContext.arc(
          imageReverse ? (1 - landmark.x) * canvas.width : landmark.x * canvas.width,
          landmark.y * canvas.height,
          5,
          0,
          2 * Math.PI
        );
        canvasContext.fill();
      }
    }
  }
}

