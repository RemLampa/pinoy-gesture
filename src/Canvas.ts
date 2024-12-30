export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private container: HTMLDivElement;

  constructor(
    className: string = 'canvas',
    parentContainer: HTMLElement = document.body,
  ) {
    this.container = document.createElement('div');
    this.container.className = className;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.container.appendChild(this.canvas);

    parentContainer.appendChild(this.container);
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

  public appendChild(child: HTMLElement): void {
    this.container.appendChild(child);
  }

  public removeChild(child: HTMLElement): void {
    this.container.removeChild(child);
  }
}
