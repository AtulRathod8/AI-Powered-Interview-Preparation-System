export interface GestureResult {
  gesture: string;
  confidence: number;
  timestamp: Date;
}

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface DetectionResult {
  landmarks: HandLandmark[][];
  handedness: string[];
}
