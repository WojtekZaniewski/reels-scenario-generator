import { Reel } from '@/types/reel';
import { calculateViralScore } from '@/lib/viral-score';
import { HashtagSectionResponse, RawReelItem } from './types';

function transformRawReel(raw: RawReelItem): Reel {
  const views = raw.play_count || 0;
  const likes = raw.like_count || 0;
  const comments = raw.comment_count || 0;
  const engagementRate = views > 0 ? ((likes + comments) / views) * 100 : 0;

  return {
    id: raw.id,
    shortcode: raw.shortcode,
    caption: raw.caption?.text || '',
    metrics: { views, likes, comments, engagementRate },
    viralScore: calculateViralScore(views, likes, comments),
    timestamp: raw.taken_at || 0,
    thumbnailUrl: raw.image_versions2?.candidates?.[0]?.url,
    videoUrl: raw.video_versions?.[0]?.url,
    ownerUsername: raw.user?.username,
  };
}

export function extractReelsFromHashtagSection(data: HashtagSectionResponse): Reel[] {
  const reels: Reel[] = [];

  for (const section of data.sections || []) {
    const medias = section.layout_content?.medias || [];
    for (const item of medias) {
      if (item.media) {
        reels.push(transformRawReel(item.media));
      }
    }
  }

  return reels.sort((a, b) => b.viralScore - a.viralScore);
}
