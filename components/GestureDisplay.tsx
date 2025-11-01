"use client";

import { GestureResult } from "@/types";

interface GestureDisplayProps {
  currentText: string;
  onClear: () => void;
  onSpeak: () => void;
}

export default function GestureDisplay({ currentText, onClear, onSpeak }: GestureDisplayProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recognized Text</h2>
          <div className="flex gap-2">
            <button
              onClick={onSpeak}
              disabled={!currentText}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              title="Speak text aloud"
            >
              🔊 Speak
            </button>
            <button
              onClick={onClear}
              disabled={!currentText}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="min-h-[120px] p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
          {currentText ? (
            <p className="text-3xl font-semibold text-gray-900 break-words leading-relaxed">
              {currentText}
            </p>
          ) : (
            <p className="text-xl text-gray-400 italic">
              Start signing to see text appear here...
            </p>
          )}
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span>Real-time recognition active</span>
        </div>
      </div>
    </div>
  );
}
