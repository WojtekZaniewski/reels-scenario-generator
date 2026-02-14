import { HashtagSectionResponse, RawHashtagSearchResult } from './types';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST || 'instagram-api-fast-reliable-data-scraper.p.rapidapi.com';

function getHeaders() {
  return {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST,
  };
}

async function rapidApiFetch<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`https://${RAPIDAPI_HOST}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`RapidAPI error ${response.status}: ${text}`);
  }

  return response.json();
}

export async function searchHashtag(query: string): Promise<RawHashtagSearchResult[]> {
  const data = await rapidApiFetch<{ hashtags?: RawHashtagSearchResult[] }>(
    '/hashtag_search',
    { query }
  );
  return data.hashtags || [];
}

export async function getHashtagSection(hashtagName: string): Promise<HashtagSectionResponse> {
  const data = await rapidApiFetch<HashtagSectionResponse>(
    '/hashtag_section',
    { hashtag: hashtagName }
  );
  return data;
}
