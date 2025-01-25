import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { landmarkIsFold } from "./landmark-util";
import { app } from "electron";

export default function binaryFingers(handLandmarkerResult: HandLandmarkerResult) {
    if (process.platform !== "darwin" || handLandmarkerResult.landmarks.length === 0) {
        return handLandmarkerResult;
    }

    const worldLandmarks = handLandmarkerResult.worldLandmarks[0];
    const foldeds = landmarkIsFold(worldLandmarks);
    if (
        foldeds[0] &&
        foldeds[1] &&
        !foldeds[2] &&
        foldeds[3] &&
        foldeds[4]
    ) {
        console.log("kill");
        app.quit();
    }
    return handLandmarkerResult;
}