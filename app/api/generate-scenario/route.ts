import { NextRequest } from 'next/server';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { buildScenarioPrompt } from '@/lib/ai/prompts';
import { Brief } from '@/types/brief';
import { Reel } from '@/types/reel';
import { fetchMediaByShortcode } from '@/lib/instagram/client';

async function enrichReelsWithCaptions(reels: Reel[]): Promise<Reel[]> {
  const enriched = await Promise.allSettled(
    reels.map(async (reel) => {
      try {
        const media = await fetchMediaByShortcode(reel.shortcode);
        return {
          ...reel,
          caption: media?.caption?.text || reel.caption,
        };
      } catch {
        return reel;
      }
    })
  );

  return enriched.map((result, i) =>
    result.status === 'fulfilled' ? result.value : reels[i]
  );
}

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

    const enrichedReels = await enrichReelsWithCaptions(reels.slice(0, 5));

    const prompt = buildScenarioPrompt(brief, enrichedReels);

    const result = streamText({
      model: google('gemini-2.5-flash'),
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
