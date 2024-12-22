export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
  }

  public setWidth(width: number) {
    this.canvas.width = width;
  }

  public setHeight(height: number) {
    this.canvas.height = height;
  }

  public getWidth(): number {
    return this.canvas.width;
  }

  public getHeight(): number {
    return this.canvas.height;
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
  ): void {
    this.canvas.addEventListener(type, listener);
  }

  public removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
  ): void {
    this.canvas.removeEventListener(type, listener);
  }

  public getBoundingClientRect(): DOMRect {
    return this.canvas.getBoundingClientRect();
  }
}
