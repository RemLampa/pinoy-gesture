export class Camera {
  private video: HTMLVideoElement;
  private width: number;
  private height: number;

  constructor(
    width: number = 640,
    height: number = 480,
    container: HTMLElement = document.body,
  ) {
    this.video = document.createElement('video');
    this.video.className = 'webcam';
    this.video.width = width;
    this.video.height = height;
    this.video.autoplay = true;
    this.video.playsInline = true;

    container.appendChild(this.video);
  }

  public async start() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: this.width,
        height: this.height,
      },
    });

    this.video.srcObject = stream;

    return new Promise<void>((resolve) => {
      this.video.onloadedmetadata = () => {
        this.video.play();

        resolve();
      };
    });
  }
}
