# pinoy-gesture

A meme app that allows controlling elements using the "Pinoy Nguso" gesture

## Technology Stack

Uses [Google's Face Landmarker tool](https://ai.google.dev/edge/mediapipe/solutions/vision/face_landmarker/web_js).

Code is written with TypeScript.

Built with the aid of ChatGPT.

## Usage

Needs browser camera permission to be granted.

The direction of the movement of the ball is determined by where the user is facing.

However, the ball will not move unless the user's lips are puckered (i.e. shaped as if to do a kiss).

Since human lips are of different shapes and sizes, the pucker threshold can be adjusted using the slider.

The face recognition mesh can be toggled between visible and hidden using a button.

## Development

- Install dependencies

`pnpm install`

- Run dev server

`pnpm dev`

- Production build

`pnpm build`
