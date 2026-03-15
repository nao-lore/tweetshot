export function parseTweetId(input: string): string | null {
  const trimmed = input.trim();

  // Plain ID
  if (/^\d+$/.test(trimmed)) return trimmed;

  // URL pattern
  const match = trimmed.match(
    /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
  );
  return match?.[1] ?? null;
}
