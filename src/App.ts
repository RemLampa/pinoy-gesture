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

  constructor() {
    this.initBallContainer();

    this.initWebcam();
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

    this.addMouseListeners();

    this.animate();
  }

  // Add mousemove listener to update the ball's position
  private addMouseListeners(): void {
    this.ballContainer.addEventListener('mousemove', (event: MouseEvent) => {
      const rect = this.ballContainer.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      this.ball.updatePosition(mouseX, mouseY);
    });
  }

  // Animation loop
  private animate(): void {
    this.ball.draw();
    requestAnimationFrame(() => this.animate());
  }

  private initWebcam(): void {
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    videoContainer.style.display = 'flex';
    videoContainer.style.flexDirection = 'column';
    videoContainer.style.alignItems = 'center';

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
    console.log(normalizedHorizontalDistance);

    // Define a dynamic puckering threshold
    const puckeringThreshold = 0.04; // Base threshold
    const isPuckered = normalizedHorizontalDistance < puckeringThreshold;

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
        5 *
        distanceScale;
      const speedY =
        Math.sign(faceDirectionY) *
        Math.pow(Math.abs(faceDirectionY), 2) *
        5 *
        distanceScale;

      // Move the ball incrementally
      // this.ball.updatePosition(speedX, speedY);
      console.log('puckered');
    }
  };
}
