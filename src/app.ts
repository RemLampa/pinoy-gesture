import { Canvas } from './canvas';
import { Ball } from './ball';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const BALL_RADIUS = 10;
const BALL_COLOR = 'red';

export class App {
  private canvas: Canvas;
  private ball: Ball;

  constructor() {
    this.canvas = new Canvas();

    this.canvas.setWidth(CANVAS_WIDTH);
    this.canvas.setHeight(CANVAS_HEIGHT);

    this.ball = new Ball(
      this.canvas,
      this.canvas.getWidth() / 2,
      this.canvas.getHeight() / 2,
      BALL_RADIUS,
      BALL_COLOR,
    );

    this.addMouseListeners();

    this.animate();
  }

  // Add mousemove listener to update the ball's position
  private addMouseListeners(): void {
    this.canvas.addEventListener('mousemove', (event: MouseEvent) => {
      const rect = this.canvas.getBoundingClientRect();
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
}
