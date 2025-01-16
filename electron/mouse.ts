import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

import { HandLandmarkerResult, Landmark } from "@mediapipe/tasks-vision";
import { i, landmarkDistance, landmarkEmptyResult } from "./landmark-util";
import type * as RobotJS from "@jitsi/robotjs";
const robot: typeof RobotJS = require("@jitsi/robotjs");

const touchThreshold = 0.03;
const pixelPerCentimeter = 30;

let pointing = false;
let clickingLeft = false;
let clickingRight = false;
let lastPosition = { x: 0, y: 0 };

export default function (handLandmarkerResult: HandLandmarkerResult) {
    if (handLandmarkerResult.landmarks.length === 0) {
        release();
        return handLandmarkerResult;
    }

    const worldLandmarks = handLandmarkerResult.worldLandmarks[0];
    if (!(isTouching(worldLandmarks, i.F1, i.F3) && isTouching(worldLandmarks, i.F1, i.F4))) {
        if (pointing) {
            release();
        }
        return handLandmarkerResult;
    }

    // ワールド座標は不安定？
    // const landmarkForMouse = handLandmarkerResult.worldLandmarks[0];
    const landmarkForMouse = handLandmarkerResult.landmarks[0];
    // console.log(worldLandmarks[i.ROOT].x, worldLandmarks[i.ROOT].y);
    if (!pointing) {
        pointing = true;
    } else {
        const dx = landmarkForMouse[i.ROOT].x - lastPosition.x;
        const dy = landmarkForMouse[i.ROOT].y - lastPosition.y;
        const pos = robot.getMousePos();
        robot.moveMouse(pos.x - dx * pixelPerCentimeter * 100, pos.y + dy * pixelPerCentimeter * 100);
    }
    lastPosition = { x: landmarkForMouse[i.ROOT].x, y: landmarkForMouse[i.ROOT].y };

    if (isTouching(worldLandmarks, i.F2, i.F3)) {
        if (!clickingLeft) {
            clickingLeft = true;
            robot.mouseToggle("down", "left");
            console.log("left down");
        }
    } else {
        if (clickingLeft) {
            clickingLeft = false;
            robot.mouseToggle("up", "left");
            console.log("left up");
        }
    }

    if (isTouching(worldLandmarks, i.F4, i.F5)) {
        if (!clickingRight) {
            clickingRight = true;
            robot.mouseToggle("down", "right");
            console.log("right down");
        } else {
            clickingRight = false;
            robot.mouseToggle("up", "right");
            console.log("right up");
        }
    }
    return landmarkEmptyResult;
}

function isTouching(worldLandmarks: Landmark[], a: number, b: number) {
    return landmarkDistance(worldLandmarks[a], worldLandmarks[b]) < touchThreshold;
}

function release() {
    console.log("release");
    if (pointing) {
        pointing = false;
    }
    if (clickingLeft) {
        clickingLeft = false;
        robot.mouseToggle("up", "left");
    }
    if (clickingRight) {
        clickingRight = false;
        robot.mouseToggle("up", "right");
    }
}