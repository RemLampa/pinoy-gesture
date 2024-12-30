import {
  FaceLandmarker as FaceLandmarkerInterface,
  FaceLandmarkerResult,
} from '@mediapipe/tasks-vision';
import * as vision from '@mediapipe/tasks-vision';

import { Canvas } from './Canvas.js';

const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;

export class FaceMesh {
  private canvas: Canvas;

  private faceLandmarker: FaceLandmarkerInterface;

  private isVisible: Boolean = true;

  private visibilityButton: HTMLButtonElement;

  constructor(canvas: Canvas) {
    this.canvas = canvas;

    this.toggleVisibility = this.toggleVisibility.bind(this);

    this.initVisibilityButton();
  }

  private initVisibilityButton(): void {
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
  public async init(): Promise<void> {
    if (this.faceLandmarker) {
      // do this only once per instance
      return;
    }

    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
    );

    this.faceLandmarker = await FaceLandmarker.createFromOptions(
      filesetResolver,
      {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          delegate: 'GPU',
        },
        outputFaceBlendshapes: true,
        runningMode: 'VIDEO',
        numFaces: 1,
      },
    );
  }

  public detectForVideo(
    videoElement: HTMLVideoElement,
    callback?: (results: FaceLandmarkerResult) => void,
  ): void {
    if (!this.faceLandmarker) {
      return null;
    }

    const results = this.faceLandmarker.detectForVideo(
      videoElement,
      performance.now(),
    );

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

    window.requestAnimationFrame(
      this.detectForVideo.bind(this, videoElement, callback),
    );
  }

  private drawFaceMesh(results: FaceLandmarkerResult): void {
    const drawingUtils = new DrawingUtils(this.canvas.getContext());

    if (results.faceLandmarks) {
      for (const landmarks of results.faceLandmarks) {
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: '#C0C0C070', lineWidth: 1 },
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
          { color: '#E0E0E0' },
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
          { color: '#E0E0E0' },
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
          { color: '#E0E0E0' },
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
          { color: '#E0E0E0' },
        );
        drawingUtils.drawConnectors(
          landmarks,
          // NOSE TIP
          [{ start: 1, end: 2 }],
          { color: '#FF3030' },
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
          { color: '#E0E0E0' },
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LIPS,
          { color: '#30FF30' },
        );
        drawingUtils.drawConnectors(
          landmarks,
          // left lip corner
          [{ start: 61, end: 62 }],
          { color: '#FF3030' },
        );
        drawingUtils.drawConnectors(
          landmarks,
          // right lip corner
          [{ start: 291, end: 292 }],
          { color: '#FF3030' },
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
          { color: '#FF3030' },
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
          { color: '#FF3030' },
        );
      }
      3;
    }
  }

  public toggleVisibility(): void {
    this.isVisible = !this.isVisible;

    this.visibilityButton.textContent = this.isVisible
      ? 'Hide Mesh'
      : 'Show Mesh';
  }
}
