export interface PollOption {
  label: string;
  votes: number;
}

export interface PollData {
  options: PollOption[];
  totalVotes: number;
  isFinished: boolean;
}

interface PollDisplayProps {
  poll: PollData;
  isDark: boolean;
}

const ACCENT_COLOR = '#667eea';

export function PollDisplay({ poll, isDark }: PollDisplayProps) {
  const maxVotes = Math.max(...poll.options.map((o) => o.votes));

  return (
    <div style={{ marginTop: 12 }}>
      {poll.options.map((option, i) => {
        const percentage =
          poll.totalVotes > 0
            ? ((option.votes / poll.totalVotes) * 100).toFixed(1)
            : '0.0';
        const isWinner = option.votes === maxVotes && poll.isFinished;
        const barWidth =
          poll.totalVotes > 0
            ? `${(option.votes / poll.totalVotes) * 100}%`
            : '0%';

        return (
          <div
            key={i}
            style={{
              position: 'relative',
              marginBottom: 8,
              borderRadius: 6,
              overflow: 'hidden',
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Bar fill */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: barWidth,
                backgroundColor: isWinner
                  ? ACCENT_COLOR
                  : isDark
                    ? 'rgba(102, 126, 234, 0.25)'
                    : 'rgba(102, 126, 234, 0.15)',
                borderRadius: 6,
                transition: 'width 0.4s ease',
              }}
            />
            {/* Label + percentage */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                fontSize: 14,
                fontWeight: isWinner ? 700 : 400,
                color: isDark ? '#e7e9ea' : '#0f1419',
              }}
            >
              <span>{option.label}</span>
              <span>{percentage}%</span>
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 4,
          fontSize: 13,
          color: isDark ? '#71767b' : '#536471',
        }}
      >
        <span>{poll.totalVotes.toLocaleString()} 票</span>
        <span
          style={{
            padding: '2px 8px',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 500,
            backgroundColor: poll.isFinished
              ? isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.06)'
              : 'rgba(102, 126, 234, 0.15)',
            color: poll.isFinished
              ? isDark
                ? '#71767b'
                : '#536471'
              : ACCENT_COLOR,
          }}
        >
          {poll.isFinished ? '最終結果' : '投票中'}
        </span>
      </div>
    </div>
  );
}

/**
 * Extract poll data from the raw tweet API response.
 * The syndication API may include `card` data with poll information.
 */
export function extractPollData(
  tweetApiData: Record<string, unknown>,
): PollData | null {
  try {
    const card = tweetApiData.card as Record<string, unknown> | undefined;
    if (!card) return null;

    const legacy =
      (card.legacy as Record<string, unknown>) ??
      card;

    const bindingValues =
      (legacy.binding_values as Record<string, unknown>[]) ??
      (legacy.bindingValues as Record<string, unknown>[]);

    if (!bindingValues || !Array.isArray(bindingValues)) {
      return tryFlatCardExtraction(legacy);
    }

    const valueMap = new Map<string, string>();
    for (const entry of bindingValues) {
      const key = entry.key as string;
      const value = entry.value as Record<string, unknown> | undefined;
      if (key && value) {
        const strVal =
          (value.string_value as string) ??
          (value.scribe_value as string) ??
          String(value.value ?? '');
        valueMap.set(key, strVal);
      }
    }

    const options: PollOption[] = [];
    for (let i = 1; i <= 4; i++) {
      const label = valueMap.get(`choice${i}_label`);
      const count = valueMap.get(`choice${i}_count`);
      if (label != null && count != null) {
        options.push({
          label,
          votes: parseInt(count, 10) || 0,
        });
      }
    }

    if (options.length === 0) return null;

    const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

    const endDateStr = valueMap.get('end_datetime_utc') ?? valueMap.get('counts_are_final');
    const isFinished = endDateStr
      ? endDateStr === 'true' || new Date(endDateStr) < new Date()
      : true;

    return { options, totalVotes, isFinished };
  } catch {
    return null;
  }
}

function tryFlatCardExtraction(
  card: Record<string, unknown>,
): PollData | null {
  const options: PollOption[] = [];
  for (let i = 1; i <= 4; i++) {
    const label = card[`choice${i}_label`] as string | undefined;
    const count = card[`choice${i}_count`] as string | number | undefined;
    if (label != null && count != null) {
      options.push({
        label,
        votes: typeof count === 'number' ? count : parseInt(String(count), 10) || 0,
      });
    }
  }

  if (options.length === 0) return null;

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);
  const endDateStr = card['end_datetime_utc'] as string | undefined;
  const isFinished = endDateStr
    ? new Date(endDateStr) < new Date()
    : true;

  return { options, totalVotes, isFinished };
}
