# typescript

Chromium上でmediapipeをしばいてNode.js上で処理する

## 環境構築

### Node.jsをインストール

```
winget install CoreyButler.NVMforWindows
```

シェル再起動

```
nvm install lts
nvm use lts
```

### リポジトリをクローン

```
git clone https://github.com/FreeHandMouse/TypeScript.git
cd TypeScript
npm install
```

## 実行

`npm run dev`かVSCodeなら左下のNPMスクリプトから`dev`の再生ボタン

## ビルド

`npm run build`かVSCodeなら左下のNPMスクリプトから`build`の再生ボタン

## 公式ドキュメント

[MediaPipe Hand Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker?hl=ja)

## ランドマークのインデックス

[landmark-util.ts](src/landmark-util.ts)から`i`をimportして使う

| 指 | 先端 | 第一関節 | 第二関節 | 第三関節 |
| --- | --- | --- | --- | --- |
| 親指 | `i.F1` | `i.F1_J1` | `i.F1_J2` | `i.F1_J3` |
| 人差し指 | `i.F2` | `i.F2_J1` | `i.F2_J2` | `i.F2_J3` |
| 中指 | `i.F3` | `i.F3_J1` | `i.F3_J2` | `i.F3_J3` |
| 薬指 | `i.F4` | `i.F4_J1` | `i.F4_J2` | `i.F4_J3` |
| 小指 | `i.F5` | `i.F5_J1` | `i.F5_J2` | `i.F5_J3` |

手首 `i.ROOT`

## データ型

`HandLandmarkerResult`

```typescript
{
    // 画面端を0-1として正規化した座標
    landmarks: [
        // 手の配列
        [
            // 点の配列
            {
                // x, y, z座標
                x: number,
                y: number,
                z: number,
                // 可視度(?)
                visibility: number,
            },
            {
                ...
            },
            ...
        ],
        [
            ...
        ]
    ],
    // メートル単位での座標
    worldLandmarks: [
        // 手の配列
        [
            // 点の配列
            {
                // x, y, z座標
                x: number,
                y: number,
                z: number,
                visibility: number,
            },
            {
                ...
            },
            ...
        ],
        [
            ...
        ]
    ],
    // 手の向き?
    handedness: [
        // 手の配列
        [
            {
                // 信頼度?
                score: number,
                // インデックス(何の?)
                index: number,
                // 手の左右
                categoryName: "Left" | "Right",
                displayName: "Left" | "Right",
            },
            {
                ...
            },
        ],
        [
            ...
        ]
    ]
}
```

## 処理の流れ

[electron/main.ts](electron/main.ts)の`handLandmarkerResultHandlers`に`HandLandmarkerResult`を受け取り`HandLandmarkerResult`を返す関数を登録すると、1つめの関数に生のデータが渡され、2つめ以降の関数に前の関数の返り値が渡される。
