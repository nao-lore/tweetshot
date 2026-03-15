import type { TweetData } from './types';
import { fetchTweet, fetchTweetRaw } from './fetchTweet';

export async function fetchThread(id: string): Promise<TweetData[]> {
  const tweets: TweetData[] = [];
  const visited = new Set<string>();

  // Fetch the target tweet first
  const targetTweet = await fetchTweet(id);
  tweets.push(targetTweet);
  visited.add(id);

  // Check if the target tweet is a reply and fetch parent tweets recursively
  const rawData = await fetchTweetRaw(id);
  let parentId = rawData.in_reply_to_status_id_str ?? null;

  const parentTweets: TweetData[] = [];
  let depth = 0;

  while (parentId && !visited.has(parentId) && depth < 10) {
    try {
      const parentTweet = await fetchTweet(parentId);
      parentTweets.unshift(parentTweet);
      visited.add(parentId);

      const parentRaw = await fetchTweetRaw(parentId);
      parentId = parentRaw.in_reply_to_status_id_str ?? null;
      depth++;
    } catch {
      break;
    }
  }

  // Return in chronological order (oldest first)
  return [...parentTweets, ...tweets];
}
