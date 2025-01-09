import { dlopen, FFIType } from "bun:ffi";

const user32 = dlopen("user32.dll", {
    SetCursorPos: {
        args: [FFIType.i32, FFIType.i32],
        returns: FFIType.void,
    }
});

export function setCursorPos(x: number, y: number) {
    user32.symbols.SetCursorPos(x, y);
}