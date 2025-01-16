import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { landmarkEmptyResult } from "./landmark-util";

const backrushNormalized = 0.01;
const backrushWorld = 0.01;

let lastResult: HandLandmarkerResult = landmarkEmptyResult;

export default function (handLandmarkerResult: HandLandmarkerResult) {
    if (handLandmarkerResult.landmarks.length === 0) {
        lastResult = landmarkEmptyResult;
        return handLandmarkerResult;
    }

    if (lastResult.landmarks.length === 0) {
        lastResult = handLandmarkerResult;
        return lastResult;
    }

    handLandmarkerResult.landmarks[0].forEach((landmark, index) => {
        if (landmark.x < lastResult.landmarks[0][index].x) { lastResult.landmarks[0][index].x = landmark.x; }
        if (lastResult.landmarks[0][index].x + backrushNormalized < landmark.x) { lastResult.landmarks[0][index].x = landmark.x - backrushNormalized; }
        if (landmark.y < lastResult.landmarks[0][index].y) { lastResult.landmarks[0][index].y = landmark.y; }
        if (lastResult.landmarks[0][index].y + backrushNormalized < landmark.y) { lastResult.landmarks[0][index].y = landmark.y - backrushNormalized; }
        if (landmark.z < lastResult.landmarks[0][index].z) { lastResult.landmarks[0][index].z = landmark.z; }
        if (lastResult.landmarks[0][index].z + backrushNormalized < landmark.z) { lastResult.landmarks[0][index].z = landmark.z - backrushNormalized; }
        lastResult.landmarks[0][index].visibility = landmark.visibility;
    });

    handLandmarkerResult.worldLandmarks[0].forEach((landmark, index) => {
        if (landmark.x < lastResult.worldLandmarks[0][index].x) { lastResult.worldLandmarks[0][index].x = landmark.x; }
        if (lastResult.worldLandmarks[0][index].x + backrushWorld < landmark.x) { lastResult.worldLandmarks[0][index].x = landmark.x - backrushWorld; }
        if (landmark.y < lastResult.worldLandmarks[0][index].y) { lastResult.worldLandmarks[0][index].y = landmark.y; }
        if (lastResult.worldLandmarks[0][index].y + backrushWorld < landmark.y) { lastResult.worldLandmarks[0][index].y = landmark.y - backrushWorld; }
        if (landmark.z < lastResult.worldLandmarks[0][index].z) { lastResult.worldLandmarks[0][index].z = landmark.z; }
        if (lastResult.worldLandmarks[0][index].z + backrushWorld < landmark.z) { lastResult.worldLandmarks[0][index].z = landmark.z - backrushWorld; }
        lastResult.worldLandmarks[0][index].visibility = landmark.visibility;
    });

    lastResult.handedness = handLandmarkerResult.handedness;
    
    return lastResult;
}