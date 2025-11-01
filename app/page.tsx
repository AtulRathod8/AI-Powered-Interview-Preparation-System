"use client";

import { useState } from 'react';
import { DOMAINS, DIFFICULTIES } from '@/lib/openai';
import Link from 'next/link';

export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI Interview Prep
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master your next interview with AI-powered question generation and intelligent answer evaluation
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            {/* Domain Selection */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Select Your Domain
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DOMAINS.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      selectedDomain === domain.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className="text-4xl mb-2">{domain.icon}</div>
                    <div className="text-lg font-medium text-gray-900 dark:text-white">
                      {domain.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Choose Difficulty Level
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DIFFICULTIES.map((difficulty) => (
                  <button
                    key={difficulty.id}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      selectedDifficulty === difficulty.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {difficulty.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {difficulty.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="pt-4">
              {selectedDomain && selectedDifficulty ? (
                <Link
                  href={`/interview?domain=${selectedDomain}&difficulty=${selectedDifficulty}`}
                  className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-200 text-lg"
                >
                  Start Interview Preparation
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-semibold py-4 px-8 rounded-xl cursor-not-allowed text-lg"
                >
                  Select domain and difficulty to continue
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Targeted Questions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI-generated questions tailored to your chosen domain and difficulty level
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Smart Evaluation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get instant feedback on your answers with detailed analysis and scoring
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your improvement over time with comprehensive analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
