import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { openai } from '@/lib/openai';
import { z } from 'zod';

const evaluateAnswerSchema = z.object({
  questionId: z.string(),
  answer: z.string(),
  domain: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, answer, domain } = evaluateAnswerSchema.parse(body);

    // Get the question
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Evaluate answer using OpenAI
    const prompt = `You are an expert interviewer evaluating a candidate's answer for a ${domain.replace('-', ' ')} position.

Question: ${question.question}
Candidate's Answer: ${answer}

Evaluate this answer and provide:
1. A score from 0-10
2. Overall feedback (2-3 sentences)
3. List of strengths (2-3 points)
4. List of areas for improvement (2-3 points)

Return ONLY a JSON object in this exact format:
{
  "score": 8.5,
  "feedback": "Overall feedback here",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
}

Do not include any other text, explanations, or markdown formatting.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interviewer providing constructive feedback. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content || '{}';
    let evaluation;
    
    try {
      evaluation = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse evaluation from AI response');
      }
    }

    // Save answer and evaluation to database
    await prisma.answer.create({
      data: {
        questionId,
        userAnswer: answer,
        evaluation: 'completed',
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: JSON.stringify(evaluation.strengths),
        improvements: JSON.stringify(evaluation.improvements),
      },
    });

    return NextResponse.json({
      evaluation: {
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
      },
    });
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate answer' },
      { status: 500 }
    );
  }
}
