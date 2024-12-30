var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Camera {
    constructor(width = 640, height = 480, container = document.body) {
        this.video = document.createElement('video');
        this.video.className = 'webcam';
        this.video.width = width;
        this.video.height = height;
        this.video.autoplay = true;
        this.video.playsInline = true;
        container.appendChild(this.video);
    }
    start(onLoad) {
        return __awaiter(this, void 0, void 0, function* () {
            const stream = yield navigator.mediaDevices.getUserMedia({
                video: {
                    width: this.width,
                    height: this.height,
                },
            });
            this.video.srcObject = stream;
            this.video.addEventListener('loadeddata', () => {
                onLoad(this.video);
            });
            return new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    resolve();
                };
            });
        });
    }
}
