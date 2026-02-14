import { NextRequest, NextResponse } from 'next/server';
import { fetchUserReels } from '@/lib/instagram/client';
import { extractReelsFromResponse } from '@/lib/instagram/transform';
import { getCached, setCache, makeCacheKey } from '@/lib/cache';
import { Reel } from '@/types/reel';

const MAX_REELS = parseInt(process.env.MAX_REELS_PER_SEARCH || '20', 10);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accounts } = body as { accounts: string[] };

    if (!accounts || accounts.length === 0) {
      return NextResponse.json({ error: 'Podaj przynajmniej jedno konto' }, { status: 400 });
    }

    const cacheKey = makeCacheKey(accounts);
    const cached = getCached<Reel[]>(cacheKey);
    if (cached) {
      return NextResponse.json({ reels: cached, fromCache: true });
    }

    const allReels: Reel[] = [];

    for (const account of accounts.slice(0, 5)) {
      try {
        const data = await fetchUserReels(account);
        const reels = extractReelsFromResponse(data, account);
        allReels.push(...reels);
      } catch (err) {
        console.error(`Error scraping account "${account}":`, err);
      }
    }

    const uniqueReels = Array.from(
      new Map(allReels.map((r) => [r.id, r])).values()
    );

    const sortedReels = uniqueReels
      .sort((a, b) => b.viralScore - a.viralScore)
      .slice(0, MAX_REELS);

    setCache(cacheKey, sortedReels);

    return NextResponse.json({ reels: sortedReels, fromCache: false });
  } catch (error) {
    console.error('Scrape reels error:', error);
    return NextResponse.json(
      { error: 'Nie udało się pobrać Reelsów. Spróbuj ponownie.' },
      { status: 500 }
    );
  }
}
