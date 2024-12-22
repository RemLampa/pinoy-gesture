import { Canvas } from './canvas';

export class App {
  private canvas: Canvas;

  constructor() {
    this.canvas = new Canvas();

    this.canvas.setWidth(800);
    this.canvas.setHeight(600);

    this.canvas
      .getContext()
      .fillRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
  }
}
