import { FaceLandmarkerResult } from '@mediapipe/tasks-vision';

import { Canvas } from './Canvas';
import { Ball } from './Ball';
import { Camera } from './Camera';
import { FaceMesh } from './FaceMesh';

const BALL_CONTAINER_WIDTH = 800;
const BALL_CONTAINER_HEIGHT = 600;
const BALL_RADIUS = 10;
const BALL_COLOR = 'red';

const VIDEO_WIDTH = 640;
const VIDEO_HEIGHT = 480;

export class App {
  private ballContainer: Canvas;

  private ball: Ball;

  private faceMeshContainer: Canvas;

  private camera: Camera;

  // Define a dynamic puckering threshold
  private puckerThreshold = 0.04;

  constructor() {
    this.initPuckerThresholdInput();

    this.initBallContainer();

    this.initWebcam();
  }

  private initPuckerThresholdInput(): void {
    const thresholdContainer = document.createElement('div');
    thresholdContainer.className = 'pucker-threshold-container';

    const puckerThresholdLabel = document.createElement('label');
    puckerThresholdLabel.className = 'pucker-threshold-label';
    puckerThresholdLabel.htmlFor = 'pucker-threshold';
    puckerThresholdLabel.textContent = `Pucker Threshold: ${this.puckerThreshold}`;

    thresholdContainer.appendChild(puckerThresholdLabel);

    const puckerThresholdInput = document.createElement('input');
    puckerThresholdInput.id = 'pucker-threshold';
    puckerThresholdInput.type = 'range';
    puckerThresholdInput.min = '0';
    puckerThresholdInput.max = '0.1';
    puckerThresholdInput.step = '0.001';
    puckerThresholdInput.value = this.puckerThreshold.toString();

    puckerThresholdInput.addEventListener('input', (event) => {
      this.puckerThreshold = parseFloat(
        (event.target as HTMLInputElement).value,
      );

      puckerThresholdLabel.textContent = `Pucker Threshold: ${this.puckerThreshold}`;
    });

    thresholdContainer.appendChild(puckerThresholdInput);

    document.body.appendChild(thresholdContainer);
  }

  private initBallContainer(): void {
    this.ballContainer = new Canvas('ball-container');

    this.ballContainer.setWidth(BALL_CONTAINER_WIDTH);
    this.ballContainer.setHeight(BALL_CONTAINER_HEIGHT);

    this.ball = new Ball(
      this.ballContainer,
      this.ballContainer.getWidth() / 2,
      this.ballContainer.getHeight() / 2,
      BALL_RADIUS,
      BALL_COLOR,
    );

    this.animateBall();
  }

  // Animation loop
  private animateBall(): void {
    this.ball.draw();

    requestAnimationFrame(() => this.animateBall());
  }

  private initWebcam(): void {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';

    this.camera = new Camera(VIDEO_WIDTH, VIDEO_HEIGHT, videoContainer);

    this.faceMeshContainer = new Canvas('face-mesh-container', videoContainer);
    this.faceMeshContainer.setWidth(VIDEO_WIDTH);
    this.faceMeshContainer.setHeight(VIDEO_HEIGHT);

    this.enableCamera();

    document.body.appendChild(videoContainer);
  }

  // Enable the camera feed
  private async enableCamera(): Promise<void> {
    const faceMesh = new FaceMesh(this.faceMeshContainer);
    await faceMesh.init();

    // bring it all together
    await this.camera.start((video: HTMLVideoElement) =>
      faceMesh.detectForVideo(video, this.handleResults),
    );
  }

  private handleResults = (results: FaceLandmarkerResult): void => {
    const landmarks = results.faceLandmarks?.[0];

    if (!landmarks) {
      return;
    }

    // Calculate the distance between the eyes (IPD)
    const leftEye = landmarks[33]; // Left eye
    const rightEye = landmarks[263]; // Right eye
    const currentEyeDistance = Math.sqrt(
      Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2),
    );

    // Use a predefined calibrated eye distance (e.g., based on an average face at a known distance)
    const calibratedEyeDistance = 0.1; // Example: 0.1 units (tune as necessary based on camera setup)
    const distanceScale = calibratedEyeDistance / currentEyeDistance;

    // Calculate the horizontal distance between mouth corners
    const leftMouthCorner = landmarks[61]; // Left corner of the mouth
    const rightMouthCorner = landmarks[291]; // Right corner of the mouth
    const rawHorizontalDistance = Math.sqrt(
      Math.pow(rightMouthCorner.x - leftMouthCorner.x, 2) +
        Math.pow(rightMouthCorner.y - leftMouthCorner.y, 2),
    );

    // Normalize the horizontal distance using the distance scale
    const normalizedHorizontalDistance = rawHorizontalDistance * distanceScale;

    const isPuckered = normalizedHorizontalDistance < this.puckerThreshold;

    if (isPuckered) {
      // Calculate face orientation for ball movement
      const faceCenterX = (leftEye.x + rightEye.x) / 2;
      const noseTip = landmarks[1]; // Nose tip
      const faceDirectionX = noseTip.x - faceCenterX; // Horizontal face direction
      const faceDirectionY = noseTip.y - 0.5; // Vertical face direction (relative to center)

      // Apply easing function for speed, scaled by distance
      const speedX =
        Math.sign(faceDirectionX) *
        Math.pow(Math.abs(faceDirectionX), 2) *
        5000 *
        distanceScale;
      const speedY =
        Math.sign(faceDirectionY) *
        Math.pow(Math.abs(faceDirectionY), 2) *
        500 *
        distanceScale;

      // Move the ball incrementally
      this.ball.updatePosition(speedX, speedY);
    }
  };
}
