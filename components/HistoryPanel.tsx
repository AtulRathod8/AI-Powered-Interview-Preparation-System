"use client";

import { GestureResult } from "@/types";

interface HistoryPanelProps {
  history: GestureResult[];
  onClearHistory: () => void;
}

export default function HistoryPanel({ history, onClearHistory }: HistoryPanelProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Recognition History</h2>
          <button
            onClick={onClearHistory}
            disabled={history.length === 0}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            Clear History
          </button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto space-y-2">
          {history.length === 0 ? (
            <p className="text-gray-400 italic text-center py-8">
              No gestures recognized yet. Start signing!
            </p>
          ) : (
            history.slice().reverse().map((item, index) => (
              <div
                key={history.length - index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-600 w-12 text-center">
                    {item.gesture}
                  </span>
                  <div>
                    <p className="text-sm text-gray-600">
                      Confidence: <span className="font-semibold text-gray-800">{(item.confidence * 100).toFixed(0)}%</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${item.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {history.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total gestures recognized: <span className="font-semibold text-gray-800">{history.length}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
