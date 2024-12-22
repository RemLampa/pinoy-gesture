import { Canvas } from './Canvas';
import { Ball } from './Ball';
import { Camera } from './Camera';

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
    await this.camera.start();
  }
}
