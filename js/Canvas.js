export class Canvas {
    constructor(className = 'canvas', parentContainer = document.body) {
        this.container = document.createElement('div');
        this.container.className = className;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        parentContainer.appendChild(this.container);
    }
    setWidth(width) {
        this.canvas.width = width;
    }
    setHeight(height) {
        this.canvas.height = height;
    }
    getWidth() {
        return this.canvas.width;
    }
    getHeight() {
        return this.canvas.height;
    }
    getContext() {
        return this.ctx;
    }
    addEventListener(type, listener) {
        this.canvas.addEventListener(type, listener);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    removeEventListener(type, listener) {
        this.canvas.removeEventListener(type, listener);
    }
    getBoundingClientRect() {
        return this.canvas.getBoundingClientRect();
    }
    appendChild(child) {
        this.container.appendChild(child);
    }
    removeChild(child) {
        this.container.removeChild(child);
    }
}
