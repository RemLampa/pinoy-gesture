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
  public updatePosition(mouseX: number, mouseY: number): void {
    this.x = mouseX;
    this.y = mouseY;
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
