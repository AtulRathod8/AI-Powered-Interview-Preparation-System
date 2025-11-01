"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { GestureResult } from "@/types";
import GestureDisplay from "@/components/GestureDisplay";
import HistoryPanel from "@/components/HistoryPanel";

const WebcamCapture = dynamic(() => import("@/components/WebcamCapture"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-3xl mx-auto bg-gray-900 rounded-lg h-[480px] flex items-center justify-center">
      <p className="text-white text-lg">Loading camera...</p>
    </div>
  ),
});

export default function Home() {
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [history, setHistory] = useState<GestureResult[]>([]);

  const handleGestureDetected = useCallback((result: GestureResult) => {
    setHistory((prev) => [...prev, result]);
    
    if (result.gesture.length === 1 || /^[0-9]$/.test(result.gesture)) {
      setRecognizedText((prev) => prev + result.gesture);
    } else {
      setRecognizedText((prev) => prev + " " + result.gesture + " ");
    }
  }, []);

  const handleClearText = useCallback(() => {
    setRecognizedText("");
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleSpeak = useCallback(() => {
    if (recognizedText && typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(recognizedText);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [recognizedText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Sign Language Identifier
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered real-time sign language recognition system for mute and deaf people
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium">Powered by MediaPipe & TensorFlow.js</span>
          </div>
        </header>

        <div className="space-y-6">
          <WebcamCapture onGestureDetected={handleGestureDetected} />
          
          <GestureDisplay
            currentText={recognizedText}
            onClear={handleClearText}
            onSpeak={handleSpeak}
          />
          
          <HistoryPanel history={history} onClearHistory={handleClearHistory} />
        </div>

        <footer className="mt-12 text-center">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">How to Use</h3>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-2">📷</div>
                <h4 className="font-semibold text-gray-800 mb-1">Step 1: Allow Camera</h4>
                <p className="text-sm text-gray-600">
                  Grant camera permissions when prompted to enable hand detection.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">✋</div>
                <h4 className="font-semibold text-gray-800 mb-1">Step 2: Sign</h4>
                <p className="text-sm text-gray-600">
                  Make sign language gestures in front of the camera. Hold each sign steady.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl mb-2">📝</div>
                <h4 className="font-semibold text-gray-800 mb-1">Step 3: Read</h4>
                <p className="text-sm text-gray-600">
                  Watch as your signs are converted to text in real-time. Use the speak button to hear it.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Supported Gestures:</strong> ASL Alphabet (A-Z), Numbers (1-5), Thumbs Up, Peace Sign, and more
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
