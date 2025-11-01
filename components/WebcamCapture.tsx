"use client";

import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Hands, Results } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { GestureRecognizer } from "@/utils/gestureRecognition";
import { GestureResult, HandLandmark } from "@/types";

interface WebcamCaptureProps {
  onGestureDetected: (result: GestureResult) => void;
}

export default function WebcamCapture({ onGestureDetected }: WebcamCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [currentGesture, setCurrentGesture] = useState<string>("No hand detected");
  const gestureRecognizer = useRef(new GestureRecognizer());
  const lastGestureRef = useRef<string>("");
  const gestureCountRef = useRef<number>(0);

  useEffect(() => {
    let hands: Hands;
    let camera: Camera;

    const initializeHandDetection = async () => {
      try {
        hands = new Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
          },
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
        });

        hands.onResults(onResults);

        if (webcamRef.current && webcamRef.current.video) {
          camera = new Camera(webcamRef.current.video, {
            onFrame: async () => {
              if (webcamRef.current && webcamRef.current.video) {
                await hands.send({ image: webcamRef.current.video });
              }
            },
            width: 640,
            height: 480,
          });
          camera.start();
          setIsLoading(false);
        }
      } catch (err) {
        setError("Failed to initialize hand detection. Please check camera permissions.");
        setIsLoading(false);
      }
    };

    const onResults = (results: Results) => {
      if (canvasRef.current) {
        const canvasCtx = canvasRef.current.getContext("2d");
        if (canvasCtx) {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            for (const landmarks of results.multiHandLandmarks) {
              drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 2,
              });
              drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 1, radius: 3 });

              const handLandmarks: HandLandmark[] = landmarks.map((lm: any) => ({
                x: lm.x,
                y: lm.y,
                z: lm.z,
              }));

              const { gesture, confidence } = gestureRecognizer.current.recognizeGesture(handLandmarks);
              
              if (gesture !== "Unknown") {
                setCurrentGesture(`${gesture} (${(confidence * 100).toFixed(0)}%)`);
                
                if (gesture === lastGestureRef.current) {
                  gestureCountRef.current += 1;
                  if (gestureCountRef.current >= 10) {
                    onGestureDetected({
                      gesture,
                      confidence,
                      timestamp: new Date(),
                    });
                    gestureCountRef.current = 0;
                  }
                } else {
                  lastGestureRef.current = gesture;
                  gestureCountRef.current = 1;
                }
              } else {
                setCurrentGesture("Unknown gesture");
              }
            }
          } else {
            setCurrentGesture("No hand detected");
            lastGestureRef.current = "";
            gestureCountRef.current = 0;
          }

          canvasCtx.restore();
        }
      }
    };

    const timer = setTimeout(() => {
      initializeHandDetection();
    }, 100);

    return () => {
      clearTimeout(timer);
      if (camera) {
        camera.stop();
      }
    };
  }, [onGestureDetected]);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
        <Webcam
          ref={webcamRef}
          audio={false}
          className="hidden"
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user",
          }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-auto"
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Initializing camera and AI model...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900 bg-opacity-75">
            <div className="text-center p-6">
              <p className="text-white text-lg">{error}</p>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="text-center">
            <p className="text-white text-2xl font-bold">{currentGesture}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Hold your hand steady in front of the camera. The system recognizes ASL letters (A-Z), numbers (1-5), and common gestures.
        </p>
      </div>
    </div>
  );
}
