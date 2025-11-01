import { HandLandmark } from "@/types";

// Sign language alphabet mapping based on hand landmarks
export class GestureRecognizer {
  // Calculate angle between three points
  private calculateAngle(a: HandLandmark, b: HandLandmark, c: HandLandmark): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  }

  // Check if finger is extended
  private isFingerExtended(landmarks: HandLandmark[], fingerTip: number, fingerPip: number): boolean {
    const tipY = landmarks[fingerTip].y;
    const pipY = landmarks[fingerPip].y;
    return tipY < pipY;
  }

  // Calculate distance between two points
  private calculateDistance(a: HandLandmark, b: HandLandmark): number {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  // Recognize gesture from hand landmarks
  public recognizeGesture(landmarks: HandLandmark[]): { gesture: string; confidence: number } {
    if (!landmarks || landmarks.length !== 21) {
      return { gesture: "Unknown", confidence: 0 };
    }

    // Finger tip indices: Thumb=4, Index=8, Middle=12, Ring=16, Pinky=20
    // Finger PIP indices: Thumb=2, Index=6, Middle=10, Ring=14, Pinky=18
    
    const thumbExtended = landmarks[4].x < landmarks[3].x;
    const indexExtended = this.isFingerExtended(landmarks, 8, 6);
    const middleExtended = this.isFingerExtended(landmarks, 12, 10);
    const ringExtended = this.isFingerExtended(landmarks, 16, 14);
    const pinkyExtended = this.isFingerExtended(landmarks, 20, 18);

    const extendedFingers = [
      thumbExtended,
      indexExtended,
      middleExtended,
      ringExtended,
      pinkyExtended
    ];

    const extendedCount = extendedFingers.filter(Boolean).length;

    // Gesture recognition logic
    
    // A - Closed fist with thumb to the side
    if (extendedCount === 0 || (extendedCount === 1 && thumbExtended)) {
      return { gesture: "A", confidence: 0.85 };
    }

    // B - All fingers extended except thumb
    if (!thumbExtended && indexExtended && middleExtended && ringExtended && pinkyExtended) {
      return { gesture: "B", confidence: 0.88 };
    }

    // C - Curved hand shape
    const thumbIndexDist = this.calculateDistance(landmarks[4], landmarks[8]);
    if (thumbIndexDist > 0.1 && thumbIndexDist < 0.3 && !indexExtended) {
      return { gesture: "C", confidence: 0.82 };
    }

    // D - Index finger up, thumb touching middle finger
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      const thumbMiddleDist = this.calculateDistance(landmarks[4], landmarks[12]);
      if (thumbMiddleDist < 0.1) {
        return { gesture: "D", confidence: 0.86 };
      }
    }

    // E - All fingers curled
    if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      return { gesture: "E", confidence: 0.84 };
    }

    // F - Index and thumb forming circle, other fingers extended
    const thumbIndexCircle = this.calculateDistance(landmarks[4], landmarks[8]);
    if (thumbIndexCircle < 0.08 && middleExtended && ringExtended && pinkyExtended) {
      return { gesture: "F", confidence: 0.87 };
    }

    // G - Index finger pointing sideways
    if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && thumbExtended) {
      const indexAngle = Math.abs(landmarks[8].x - landmarks[5].x);
      if (indexAngle > 0.15) {
        return { gesture: "G", confidence: 0.83 };
      }
    }

    // H - Index and middle fingers extended sideways
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
      const fingersDist = this.calculateDistance(landmarks[8], landmarks[12]);
      if (fingersDist < 0.1) {
        return { gesture: "H", confidence: 0.85 };
      }
    }

    // I - Pinky finger extended
    if (!indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
      return { gesture: "I", confidence: 0.89 };
    }

    // L - Index finger up, thumb out
    if (indexExtended && thumbExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      const angle = this.calculateAngle(landmarks[4], landmarks[5], landmarks[8]);
      if (angle > 70 && angle < 110) {
        return { gesture: "L", confidence: 0.90 };
      }
    }

    // O - All fingers forming circle
    const thumbTipToIndex = this.calculateDistance(landmarks[4], landmarks[8]);
    if (thumbTipToIndex < 0.08 && !middleExtended && !ringExtended && !pinkyExtended) {
      return { gesture: "O", confidence: 0.86 };
    }

    // V - Index and middle fingers extended in V shape
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
      const vDistance = this.calculateDistance(landmarks[8], landmarks[12]);
      if (vDistance > 0.1) {
        return { gesture: "V", confidence: 0.88 };
      }
    }

    // Y - Thumb and pinky extended
    if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && pinkyExtended) {
      return { gesture: "Y", confidence: 0.87 };
    }

    // Numbers
    if (extendedCount === 1 && indexExtended) {
      return { gesture: "1", confidence: 0.90 };
    }
    if (extendedCount === 2 && indexExtended && middleExtended) {
      return { gesture: "2", confidence: 0.89 };
    }
    if (extendedCount === 3 && indexExtended && middleExtended && ringExtended) {
      return { gesture: "3", confidence: 0.88 };
    }
    if (extendedCount === 4 && indexExtended && middleExtended && ringExtended && pinkyExtended) {
      return { gesture: "4", confidence: 0.87 };
    }
    if (extendedCount === 5) {
      return { gesture: "5", confidence: 0.90 };
    }

    // Thumbs up
    if (thumbExtended && !indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
      if (landmarks[4].y < landmarks[2].y) {
        return { gesture: "👍 (Thumbs Up)", confidence: 0.85 };
      }
    }

    // Peace sign
    if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
      return { gesture: "✌️ (Peace)", confidence: 0.86 };
    }

    return { gesture: "Unknown", confidence: 0.5 };
  }
}
