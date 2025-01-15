import { HandLandmarkerResult, NormalizedLandmark } from "@mediapipe/tasks-vision";

const bufferLength = 5;
const buffer: HandLandmarkerResult[] = [];

export default function (handLandmarkerResult: HandLandmarkerResult) {
    if (handLandmarkerResult.landmarks.length === 0) {
        buffer.length = 0;
        return handLandmarkerResult;
    }
    if (buffer.length === bufferLength) {
        buffer.shift();
    }
    buffer.push(handLandmarkerResult);

    // とりあえず1つめの手の座標だけ
    const filtered: HandLandmarkerResult = {
        landmarks: [
            buffer[0].landmarks.map((_, index) => {
                let sum: NormalizedLandmark = { x: 0, y: 0, z: 0, visibility: 0 };
                for (const handLandmarkerResult of buffer) {
                    sum.x += handLandmarkerResult.landmarks[0][index].x;
                    sum.y += handLandmarkerResult.landmarks[0][index].y;
                    sum.z += handLandmarkerResult.landmarks[0][index].z;
                    sum.visibility += handLandmarkerResult.landmarks[0][index].visibility;
                }
                return {
                    x: sum.x / buffer.length,
                    y: sum.y / buffer.length,
                    z: sum.z / buffer.length,
                    visibility: sum.visibility / buffer.length,
                };
            })
        ],
        worldLandmarks: [
            buffer[0].worldLandmarks[0].map((_, index) => {
                let sum: NormalizedLandmark = { x: 0, y: 0, z: 0, visibility: 0 };
                for (const handLandmarkerResult of buffer) {
                    sum.x += handLandmarkerResult.worldLandmarks[0][index].x;
                    sum.y += handLandmarkerResult.worldLandmarks[0][index].y;
                    sum.z += handLandmarkerResult.worldLandmarks[0][index].z;
                    sum.visibility += handLandmarkerResult.worldLandmarks[0][index].visibility;
                }
                return {
                    x: sum.x / buffer.length,
                    y: sum.y / buffer.length,
                    z: sum.z / buffer.length,
                    visibility: sum.visibility / buffer.length,
                };
            })
        ],
        handedness: [],
        handednesses: [],
    }
    return filtered;
}