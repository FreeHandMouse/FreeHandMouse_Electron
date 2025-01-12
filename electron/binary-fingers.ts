import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { landmarkIsFold } from "./landmark-util";

export default function binaryFingers(handLandmarkerResult: HandLandmarkerResult) {
  const worldLandmarks = handLandmarkerResult.worldLandmarks[0];
  const foldeds = landmarkIsFold(worldLandmarks);
  let count = 0;
  for (let index = 0; index < foldeds.length; index++) {
    count += foldeds[index] ? 0 : 2 ** index;
  }
  console.log(count);
  return false;
}