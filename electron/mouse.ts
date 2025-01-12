import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

import { HandLandmarkerResult, Landmark } from "@mediapipe/tasks-vision";
import { i, landmarkDistance } from "./landmark-util";
// import robot from "@jitsi/robotjs";
const robot = require("@jitsi/robotjs");

const touchThreshold = 0.03;
const pixelPerCentimeter = 1000;

let pointing = false;
let clickingLeft = false;
let clickingRight = false;
let lastPosition = { x: 0, y: 0 };

export default function (handLandmarkerResult: HandLandmarkerResult) {
    const worldLandmarks = handLandmarkerResult.worldLandmarks[0];
    console.log(worldLandmarks[i.ROOT].x, worldLandmarks[i.ROOT].y);
    if (isTouching(worldLandmarks, i.F1, i.F3) && isTouching(worldLandmarks, i.F1, i.F4)) {
        if (!pointing) {
            pointing = true;
        } else {
            const dx = worldLandmarks[i.ROOT].x - lastPosition.x;
            const dy = worldLandmarks[i.ROOT].y - lastPosition.y;
            const pos = robot.getMousePos();
            robot.moveMouse(pos.x + dx * pixelPerCentimeter * 100, pos.y + dy * pixelPerCentimeter * 100);

        }
        lastPosition = { x: worldLandmarks[i.ROOT].x, y: worldLandmarks[i.ROOT].y };

        if (isTouching(worldLandmarks, i.F2, i.F3)) {
            if (!clickingLeft) {
                clickingLeft = true;
                robot.mouseToggle("down", "left");
            }
        } else {
            if (clickingLeft) {
                clickingLeft = false;
                robot.mouseToggle("up", "left");
            }
        }

        if (isTouching(worldLandmarks, i.F4, i.F5)) {
            if (!clickingRight) {
                clickingRight = true;
                robot.mouseToggle("down", "right");
            } else {
                clickingRight = false;
                robot.mouseToggle("up", "right");
            }
        }
        console.log(pointing, clickingLeft, clickingRight);
        return true;
    } else {
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
    return false;
}

function isTouching(worldLandmarks: Landmark[], a: number, b: number) {
    return landmarkDistance(worldLandmarks[a], worldLandmarks[b]) < touchThreshold;
}