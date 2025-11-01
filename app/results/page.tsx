"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface SessionResult {
  domain: string;
  difficulty: string;
  totalQuestions: number;
  averageScore: number;
  completedAt: string;
  questions: Array<{
    question: string;
    userAnswer: string;
    score: number;
    feedback: string;
  }>;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [results, setResults] = useState<SessionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchResults();
    }
  }, [sessionId]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`/api/interview/results?sessionId=${sessionId}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">Results not found</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 8) return 'Excellent Performance! 🎉';
    if (score >= 6) return 'Good Job! Keep Practicing 👍';
    return 'Keep Learning! You Can Do Better 💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Interview Results
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {getPerformanceMessage(results.averageScore)}
          </p>
        </div>

        {/* Summary Card */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {results.averageScore.toFixed(1)}/10
                </div>
                <div className="text-gray-600 dark:text-gray-400">Average Score</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {results.totalQuestions}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Questions Answered</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2 capitalize">
                  {results.difficulty}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Difficulty Level</div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-1">Domain</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                {results.domain.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Question-by-Question Breakdown
          </h2>
          
          {results.questions.map((q, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
                  Question {index + 1}: {q.question}
                </h3>
                <span className={`text-2xl font-bold ml-4 ${getScoreColor(q.score)}`}>
                  {q.score}/10
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Answer:
                </h4>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  {q.userAnswer}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Feedback:
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {q.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="max-w-4xl mx-auto mt-12 flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200"
          >
            Start New Interview
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
