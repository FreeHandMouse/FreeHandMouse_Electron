import { HandLandmarkerResult, Landmark } from "@mediapipe/tasks-vision";

export const i = {
  ROOT: 0,
  F1_J3: 1, F1_J2: 2, F1_J1: 3, F1: 4,
  F2_J3: 5, F2_J2: 6, F2_J1: 7, F2: 8,
  F3_J3: 9, F3_J2: 10, F3_J1: 11, F3: 12,
  F4_J3: 13, F4_J2: 14, F4_J1: 15, F4: 16,
  F5_J3: 17, F5_J2: 18, F5_J1: 19, F5: 20,
} as const;

export const landmarkEmptyResult: HandLandmarkerResult = {
  landmarks: [],
  worldLandmarks: [],
  handedness: [],
  handednesses: [],
}

export function landmarkIsFold(landmarks: Landmark[]) {
  // TODO: 閾値入れてね
  const thresholds = [
    {
      points: [i.ROOT, i.F1_J2, i.F1],
      angle: Math.PI / 2,
    },
    {
      points: [i.ROOT, i.F2_J3, i.F2],
      angle: Math.PI / 2,
    },
    {
      points: [i.ROOT, i.F3_J3, i.F3],
      angle: Math.PI / 2,
    },
    {
      points: [i.ROOT, i.F4_J3, i.F4],
      angle: Math.PI / 2,
    },
    {
      points: [i.ROOT, i.F5_J3, i.F5],
      angle: Math.PI / 2,
    },
  ]
  return thresholds.map(threshold => {
    let [a, b, c] = threshold.points;
    return landmarkAngle(landmarks[a], landmarks[b], landmarks[c])  < threshold.angle;
  });
}

export function landmarkDistance(landmark1: Landmark, landmark2: Landmark) {
  return Math.sqrt(
    Math.pow(landmark1.x - landmark2.x, 2) +
    Math.pow(landmark1.y - landmark2.y, 2) +
    Math.pow(landmark1.z - landmark2.z, 2)
  );
}

export function landmarkDot(landmark1: Landmark, landmark2: Landmark, landmark3: Landmark) {
  return (landmark2.x - landmark1.x) * (landmark3.x - landmark2.x) +
    (landmark2.y - landmark1.y) * (landmark3.y - landmark2.y) +
    (landmark2.z - landmark1.z) * (landmark3.z - landmark2.z);
}

// TODO: 実装してね
export function landmarkAngle(landmark1: Landmark, landmark2: Landmark, landmark3: Landmark) {
  return Math.PI / 2;
}