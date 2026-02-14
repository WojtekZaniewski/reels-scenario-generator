import { NextRequest } from 'next/server';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { buildScenarioPrompt } from '@/lib/ai/prompts';
import { Brief } from '@/types/brief';
import { Reel } from '@/types/reel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brief, reels } = body as { brief: Brief; reels: Reel[] };

    if (!brief?.treatment || !reels?.length) {
      return new Response(
        JSON.stringify({ error: 'Podaj brief i wybierz Reelsy' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const prompt = buildScenarioPrompt(brief, reels);

    const result = streamText({
      model: google('gemini-2.5-flash-preview-05-20'),
      prompt,
      temperature: 0.8,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Generate scenario error:', error);
    return new Response(
      JSON.stringify({ error: 'Nie udało się wygenerować scenariusza. Spróbuj ponownie.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
