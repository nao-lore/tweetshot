export interface TweetData {
  id: string;
  text: string;
  user: {
    name: string;
    screenName: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  favoriteCount: number;
  conversationCount: number;
  createdAt: string;
  mediaUrl?: string;
}

export interface Background {
  id: string;
  label: string;
  style: string;
}

export interface SizePreset {
  id: string;
  label: string;
  width: number | null;
  height: number | null;
}

export type ExportFormat = 'png' | 'svg';

export const sizePresets: SizePreset[] = [
  { id: 'free', label: 'フリーサイズ', width: null, height: null },
  { id: 'ig-post', label: 'Instagram投稿', width: 1080, height: 1080 },
  { id: 'ig-story', label: 'Instagramストーリー', width: 1080, height: 1920 },
  { id: 'linkedin', label: 'LinkedIn', width: 1200, height: 627 },
];
