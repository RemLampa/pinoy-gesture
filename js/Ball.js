export class Ball {
    constructor(canvas, x, y, radius, color) {
        this.canvas = canvas;
        this.ctx = canvas.getContext();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    // Method to update the ball's position
    updatePosition(deltaX, deltaY) {
        this.x -= deltaX;
        this.y += deltaY;
        // Keep ball within canvas boundaries
        this.x = Math.max(this.radius, Math.min(this.canvas.getWidth() - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(this.canvas.getHeight() - this.radius, this.y));
    }
    // Method to draw the ball
    draw() {
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
