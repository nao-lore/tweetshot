export interface HighlightRule {
  pattern: string;
  color: string;
  bold?: boolean;
}

interface TextHighlightProps {
  text: string;
  highlights: HighlightRule[];
  fontFamily?: string;
}

interface Segment {
  text: string;
  rule?: HighlightRule;
}

function buildSegments(text: string, highlights: HighlightRule[]): Segment[] {
  if (highlights.length === 0) {
    return [{ text }];
  }

  // Build a combined regex from all non-empty patterns
  const validRules = highlights.filter((r) => r.pattern.length > 0);
  if (validRules.length === 0) {
    return [{ text }];
  }

  // Escape regex special chars and join patterns
  const escaped = validRules.map((r) =>
    r.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );
  const combined = new RegExp(`(${escaped.join('|')})`, 'gi');

  const segments: Segment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(combined)) {
    const matchStart = match.index!;
    const matchText = match[0];

    // Add preceding plain text
    if (matchStart > lastIndex) {
      segments.push({ text: text.slice(lastIndex, matchStart) });
    }

    // Find the matching rule (case-insensitive)
    const rule = validRules.find(
      (r) => r.pattern.toLowerCase() === matchText.toLowerCase()
    );

    segments.push({ text: matchText, rule });
    lastIndex = matchStart + matchText.length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments;
}

export function TextHighlight({ text, highlights, fontFamily }: TextHighlightProps) {
  const segments = buildSegments(text, highlights);

  return (
    <span style={{ fontFamily }}>
      {segments.map((seg, i) =>
        seg.rule ? (
          <span
            key={i}
            style={{
              backgroundColor: seg.rule.color,
              fontWeight: seg.rule.bold ? 700 : undefined,
              borderRadius: 2,
              padding: '0 2px',
            }}
          >
            {seg.text}
          </span>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </span>
  );
}
