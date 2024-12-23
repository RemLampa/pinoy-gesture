import { Canvas } from './Canvas';

export class Ball {
  private x: number;
  private y: number;
  private radius: number;
  private color: string;
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;

  constructor(
    canvas: Canvas,
    x: number,
    y: number,
    radius: number,
    color: string,
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext()!;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  // Method to update the ball's position
  public updatePosition(deltaX: number, deltaY: number): void {
    this.x -= deltaX;
    this.y += deltaY;

    // Keep ball within canvas boundaries
    this.x = Math.max(
      this.radius,
      Math.min(this.canvas.getWidth() - this.radius, this.x),
    );
    this.y = Math.max(
      this.radius,
      Math.min(this.canvas.getHeight() - this.radius, this.y),
    );
  }

  // Method to draw the ball
  public draw(): void {
    // Clear the canvas
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());

    this.ctx.beginPath();

    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); // Draw a circle

    this.ctx.fillStyle = this.color;

    this.ctx.fill();

    this.ctx.closePath();
  }
}
