import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { buildHashtagSuggestionPrompt } from '@/lib/ai/prompts';
import { Brief } from '@/types/brief';
import { HashtagSuggestionResponse } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { brief } = body as { brief: Brief };

    if (!brief?.treatment) {
      return NextResponse.json({ error: 'Podaj przynajmniej zabieg/usługę' }, { status: 400 });
    }

    const prompt = buildHashtagSuggestionPrompt(brief);

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
      temperature: 0.7,
    });

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Nie udało się sparsować odpowiedzi AI' }, { status: 500 });
    }

    const parsed: HashtagSuggestionResponse = JSON.parse(jsonMatch[0]);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Suggest hashtags error:', error);
    return NextResponse.json(
      { error: 'Nie udało się wygenerować hashtagów. Spróbuj ponownie.' },
      { status: 500 }
    );
  }
}
