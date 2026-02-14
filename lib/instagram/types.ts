export interface RawHashtagSearchResult {
  id: string;
  name: string;
  media_count: number;
  profile_pic_url?: string;
}

export interface RawReelItem {
  id: string;
  shortcode: string;
  caption?: {
    text: string;
  };
  play_count?: number;
  like_count?: number;
  comment_count?: number;
  taken_at?: number;
  image_versions2?: {
    candidates?: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  video_versions?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  user?: {
    username: string;
    full_name?: string;
  };
}

export interface HashtagSectionResponse {
  sections?: Array<{
    layout_content?: {
      medias?: Array<{
        media: RawReelItem;
      }>;
    };
  }>;
  next_max_id?: string;
}
