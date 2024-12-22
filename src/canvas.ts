export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(
    className: string = 'canvas',
    container: HTMLElement = document.body,
  ) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = className;

    this.ctx = this.canvas.getContext('2d');

    container.appendChild(this.canvas);
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

  public clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
