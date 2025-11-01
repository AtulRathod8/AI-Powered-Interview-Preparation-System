"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  difficulty: string;
}

interface Evaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

function InterviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const domain = searchParams.get('domain');
  const difficulty = searchParams.get('difficulty');

  const [sessionId, setSessionId] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);

  useEffect(() => {
    if (domain && difficulty) {
      startInterview();
    }
  }, [domain, difficulty]);

  const startInterview = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/interview/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, difficulty }),
      });
      const data = await response.json();
      setSessionId(data.sessionId);
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: questions[currentQuestionIndex].id,
          answer,
          domain,
        }),
      });
      const data = await response.json();
      setEvaluation(data.evaluation);
      setShowEvaluation(true);
    } catch (error) {
      console.error('Error evaluating answer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer('');
      setEvaluation(null);
      setShowEvaluation(false);
    } else {
      router.push(`/results?sessionId=${sessionId}`);
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Generating your interview questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">Failed to generate questions</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700 underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Home
            </Link>
            <div className="text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {!showEvaluation ? (
            <>
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-4">
                  {currentQuestion.difficulty}
                </span>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Answer
                </label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Type your answer here..."
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={submitAnswer}
                disabled={!answer.trim() || isLoading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                  !answer.trim() || isLoading
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLoading ? 'Evaluating...' : 'Submit Answer'}
              </button>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Evaluation Results
                </h2>
                
                {/* Score */}
                <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {evaluation?.score}/10
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Your Score</div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Overall Feedback
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {evaluation?.feedback}
                  </p>
                </div>

                {/* Strengths */}
                {evaluation?.strengths && evaluation.strengths.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
                      ✓ Strengths
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {evaluation.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {evaluation?.improvements && evaluation.improvements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-2">
                      → Areas for Improvement
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                      {evaluation.improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={nextQuestion}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <InterviewContent />
    </Suspense>
  );
}
