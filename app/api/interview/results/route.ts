import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get session with questions and answers
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        questions: {
          include: {
            answer: true,
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Calculate average score
    const answeredQuestions = session.questions.filter((q) => q.answer);
    const totalScore = answeredQuestions.reduce(
      (sum, q) => sum + (q.answer?.score || 0),
      0
    );
    const averageScore = answeredQuestions.length > 0 
      ? totalScore / answeredQuestions.length 
      : 0;

    // Update session with completion data
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        completedAt: new Date(),
        score: averageScore,
      },
    });

    // Format response
    const results = {
      domain: session.domain,
      difficulty: session.difficulty,
      totalQuestions: session.questions.length,
      averageScore,
      completedAt: new Date().toISOString(),
      questions: session.questions.map((q) => ({
        question: q.question,
        userAnswer: q.answer?.userAnswer || '',
        score: q.answer?.score || 0,
        feedback: q.answer?.feedback || '',
        strengths: q.answer?.strengths ? JSON.parse(q.answer.strengths) : [],
        improvements: q.answer?.improvements ? JSON.parse(q.answer.improvements) : [],
      })),
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}
