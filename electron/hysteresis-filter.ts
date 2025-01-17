import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { landmarkEmptyResult } from "./landmark-util";

const hysteresisNormalized = 0.01;
const hysteresisWorld = 0.01;

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
        if (lastResult.landmarks[0][index].x + hysteresisNormalized < landmark.x) { lastResult.landmarks[0][index].x = landmark.x - hysteresisNormalized; }
        if (landmark.y < lastResult.landmarks[0][index].y) { lastResult.landmarks[0][index].y = landmark.y; }
        if (lastResult.landmarks[0][index].y + hysteresisNormalized < landmark.y) { lastResult.landmarks[0][index].y = landmark.y - hysteresisNormalized; }
        if (landmark.z < lastResult.landmarks[0][index].z) { lastResult.landmarks[0][index].z = landmark.z; }
        if (lastResult.landmarks[0][index].z + hysteresisNormalized < landmark.z) { lastResult.landmarks[0][index].z = landmark.z - hysteresisNormalized; }
        lastResult.landmarks[0][index].visibility = landmark.visibility;
    });

    handLandmarkerResult.worldLandmarks[0].forEach((landmark, index) => {
        if (landmark.x < lastResult.worldLandmarks[0][index].x) { lastResult.worldLandmarks[0][index].x = landmark.x; }
        if (lastResult.worldLandmarks[0][index].x + hysteresisWorld < landmark.x) { lastResult.worldLandmarks[0][index].x = landmark.x - hysteresisWorld; }
        if (landmark.y < lastResult.worldLandmarks[0][index].y) { lastResult.worldLandmarks[0][index].y = landmark.y; }
        if (lastResult.worldLandmarks[0][index].y + hysteresisWorld < landmark.y) { lastResult.worldLandmarks[0][index].y = landmark.y - hysteresisWorld; }
        if (landmark.z < lastResult.worldLandmarks[0][index].z) { lastResult.worldLandmarks[0][index].z = landmark.z; }
        if (lastResult.worldLandmarks[0][index].z + hysteresisWorld < landmark.z) { lastResult.worldLandmarks[0][index].z = landmark.z - hysteresisWorld; }
        lastResult.worldLandmarks[0][index].visibility = landmark.visibility;
    });

    lastResult.handedness = handLandmarkerResult.handedness;
    
    return lastResult;
}