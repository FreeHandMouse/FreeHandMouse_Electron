import { dlopen, FFIType, ptr } from "bun:ffi";

const user32 = dlopen("user32.dll", {
    SetCursorPos: {
        args: [FFIType.i32, FFIType.i32],
        returns: FFIType.void,
    }
});

user32.symbols.SetCursorPos(0, 0);