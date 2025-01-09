import { setCursorPos } from "./user32";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

const handLandmarker = await HandLandmarker.createFromOptions(
    vision,
    {
        baseOptions: {
            modelAssetPath: "hand_landmarker.task"
        },
        numHands: 2,
    }
);

const handLandmarkerResult = handLandmarker.detect();

    setCursorPos(0, 0);