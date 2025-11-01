import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { openai } from '@/lib/openai';
import { z } from 'zod';

const startInterviewSchema = z.object({
  domain: z.string(),
  difficulty: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, difficulty } = startInterviewSchema.parse(body);

    // Create interview session
    const session = await prisma.interviewSession.create({
      data: {
        domain,
        difficulty,
      },
    });

    // Generate questions using OpenAI
    const prompt = `Generate 5 interview questions for a ${difficulty} level ${domain.replace('-', ' ')} position. 
    Return ONLY a JSON array of questions in this exact format:
    [
      {"question": "question text here", "difficulty": "${difficulty}"},
      {"question": "question text here", "difficulty": "${difficulty}"},
      ...
    ]
    
    Make the questions realistic, relevant, and appropriate for the difficulty level.
    Do not include any other text, explanations, or markdown formatting.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interviewer. Generate realistic interview questions. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const content = completion.choices[0].message.content || '[]';
    let generatedQuestions;
    
    try {
      // Try to parse the response as JSON
      generatedQuestions = JSON.parse(content);
    } catch (parseError) {
      // If parsing fails, try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        generatedQuestions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse questions from AI response');
      }
    }

    // Save questions to database
    const questions = await Promise.all(
      generatedQuestions.map((q: { question: string; difficulty: string }) =>
        prisma.question.create({
          data: {
            sessionId: session.id,
            question: q.question,
            difficulty: q.difficulty,
          },
        })
      )
    );

    return NextResponse.json({
      sessionId: session.id,
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        difficulty: q.difficulty,
      })),
    });
  } catch (error) {
    console.error('Error starting interview:', error);
    return NextResponse.json(
      { error: 'Failed to start interview' },
      { status: 500 }
    );
  }
}
