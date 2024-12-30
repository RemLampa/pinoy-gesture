var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as vision from '@mediapipe/tasks-vision';
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
export class FaceMesh {
    constructor(canvas) {
        this.isVisible = true;
        this.canvas = canvas;
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.initVisibilityButton();
    }
    initVisibilityButton() {
        this.visibilityButton = document.createElement('button');
        this.visibilityButton.addEventListener('click', this.toggleVisibility);
        this.visibilityButton.textContent = 'Hide Mesh';
        this.canvas.appendChild(this.visibilityButton);
    }
    /**
     * Initialize the FaceMesh model
     *
     * Download the model assets (this may take a while)
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.faceLandmarker) {
                // do this only once per instance
                return;
            }
            const filesetResolver = yield FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm');
            this.faceLandmarker = yield FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
                    delegate: 'GPU',
                },
                outputFaceBlendshapes: true,
                runningMode: 'VIDEO',
                numFaces: 1,
            });
        });
    }
    detectForVideo(videoElement, callback) {
        if (!this.faceLandmarker) {
            return null;
        }
        const results = this.faceLandmarker.detectForVideo(videoElement, performance.now());
        if (!results) {
            return;
        }
        this.canvas.clear();
        if (this.isVisible) {
            this.drawFaceMesh(results);
        }
        if (callback && typeof callback === 'function') {
            callback(results);
        }
        window.requestAnimationFrame(this.detectForVideo.bind(this, videoElement, callback));
    }
    drawFaceMesh(results) {
        const drawingUtils = new DrawingUtils(this.canvas.getContext());
        if (results.faceLandmarks) {
            for (const landmarks of results.faceLandmarks) {
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: '#E0E0E0' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: '#E0E0E0' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: '#E0E0E0' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: '#E0E0E0' });
                drawingUtils.drawConnectors(landmarks, 
                // NOSE TIP
                [{ start: 1, end: 2 }], { color: '#FF3030' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: '#E0E0E0' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: '#30FF30' });
                drawingUtils.drawConnectors(landmarks, 
                // left lip corner
                [{ start: 61, end: 62 }], { color: '#FF3030' });
                drawingUtils.drawConnectors(landmarks, 
                // right lip corner
                [{ start: 291, end: 292 }], { color: '#FF3030' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS, { color: '#FF3030' });
                drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS, { color: '#FF3030' });
            }
            3;
        }
    }
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        this.visibilityButton.textContent = this.isVisible
            ? 'Hide Mesh'
            : 'Show Mesh';
    }
}
