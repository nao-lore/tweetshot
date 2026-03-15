import { useState, useRef, useMemo } from 'react';
import { Download, Copy, Check, Loader2, Sun, Moon } from 'lucide-react';
import type { TweetData, Background, ExportFormat } from './types';
import { sizePresets } from './types';
import { parseTweetId } from './parseTweetUrl';
import { fetchTweet } from './fetchTweet';
import { backgrounds } from './backgrounds';
import { TweetCard } from './TweetCard';
import { BackgroundPicker } from './BackgroundPicker';
import { useScreenshot } from './useScreenshot';

export default function App() {
  const [url, setUrl] = useState('');
  const [tweet, setTweet] = useState<TweetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [background, setBackground] = useState<Background>(backgrounds[0]);
  const [cardTheme, setCardTheme] = useState<'light' | 'dark'>('light');
  const [padding, setPadding] = useState(48);
  const [copied, setCopied] = useState(false);

  // New states
  const [customColor, setCustomColor] = useState('#667eea');
  const [shadow, setShadow] = useState(0);
  const [borderRadius, setBorderRadius] = useState(16);
  const [showMetrics, setShowMetrics] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  const [border, setBorder] = useState(false);
  const [borderColor, setBorderColor] = useState('#e0e0e0');
  const [sizePreset, setSizePreset] = useState(sizePresets[0]);
  const [pixelRatio, setPixelRatio] = useState(2);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');

  const cardRef = useRef<HTMLDivElement>(null);
  const { download, copyToClipboard } = useScreenshot(cardRef, pixelRatio);

  async function handleGenerate() {
    const id = parseTweetId(url);
    if (!id) {
      setError('有効なツイートURLを入力してください');
      return;
    }

    setLoading(true);
    setError(null);
    setTweet(null);

    try {
      const data = await fetchTweet(id);
      setTweet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    const ok = await copyToClipboard();
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleGenerate();
  }

  const previewScale = useMemo(() => {
    if (!sizePreset.width) return 1;
    const maxWidth = 640;
    return sizePreset.width > maxWidth ? maxWidth / sizePreset.width : 1;
  }, [sizePreset]);

  return (
    <div className="app">
      <header>
        <h1>TweetShot</h1>
        <p className="tagline">ツイートを美しい画像に変換</p>
      </header>

      <div className="input-row">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ツイートのURLを貼り付け..."
          spellCheck={false}
        />
        <button
          className="btn primary"
          onClick={handleGenerate}
          disabled={loading || !url.trim()}
          type="button"
        >
          {loading ? <Loader2 size={18} className="spin" /> : '生成'}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {tweet && (
        <>
          <div className="preview-container">
            <div style={{
              transform: previewScale < 1 ? `scale(${previewScale})` : undefined,
              transformOrigin: 'top center',
            }}>
              <TweetCard
                ref={cardRef}
                tweet={tweet}
                background={background}
                cardTheme={cardTheme}
                padding={padding}
                shadow={shadow}
                borderRadius={borderRadius}
                showMetrics={showMetrics}
                showWatermark={showWatermark}
                border={border}
                borderColor={borderColor}
                sizePreset={sizePreset}
              />
            </div>
          </div>

          <div className="controls">
            <div className="control-section">
              <label>背景</label>
              <BackgroundPicker
                selected={background.id}
                onChange={setBackground}
                customColor={customColor}
                onCustomColorChange={setCustomColor}
              />
            </div>

            <div className="control-row">
              <div className="control-section">
                <label>テーマ</label>
                <button
                  className="btn icon-toggle"
                  onClick={() =>
                    setCardTheme(cardTheme === 'light' ? 'dark' : 'light')
                  }
                  type="button"
                >
                  {cardTheme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                  {cardTheme === 'light' ? 'ライト' : 'ダーク'}
                </button>
              </div>

              <div className="control-section">
                <label>余白</label>
                <input
                  type="range"
                  min={16}
                  max={80}
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="control-row">
              <div className="control-section">
                <label>影</label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={shadow}
                  onChange={(e) => setShadow(Number(e.target.value))}
                />
              </div>

              <div className="control-section">
                <label>角丸</label>
                <input
                  type="range"
                  min={0}
                  max={24}
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="control-row">
              <div className="control-section">
                <label>枠線</label>
                <div className="toggle-with-color">
                  <button
                    className={`btn icon-toggle ${border ? 'active-toggle' : ''}`}
                    onClick={() => setBorder(!border)}
                    type="button"
                  >
                    {border ? 'ON' : 'OFF'}
                  </button>
                  {border && (
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="color-input-small"
                    />
                  )}
                </div>
              </div>

              <div className="control-section">
                <label>メトリクス</label>
                <button
                  className={`btn icon-toggle ${showMetrics ? 'active-toggle' : ''}`}
                  onClick={() => setShowMetrics(!showMetrics)}
                  type="button"
                >
                  {showMetrics ? '表示' : '非表示'}
                </button>
              </div>

              <div className="control-section">
                <label>ウォーターマーク</label>
                <button
                  className={`btn icon-toggle ${showWatermark ? 'active-toggle' : ''}`}
                  onClick={() => setShowWatermark(!showWatermark)}
                  type="button"
                >
                  {showWatermark ? '表示' : '非表示'}
                </button>
              </div>
            </div>

            <div className="control-row">
              <div className="control-section">
                <label>サイズ</label>
                <select
                  value={sizePreset.id}
                  onChange={(e) => setSizePreset(sizePresets.find(p => p.id === e.target.value) ?? sizePresets[0])}
                  className="select-input"
                >
                  {sizePresets.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.label}{p.width ? ` (${p.width}×${p.height})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="control-section">
                <label>解像度</label>
                <select
                  value={pixelRatio}
                  onChange={(e) => setPixelRatio(Number(e.target.value))}
                  className="select-input"
                >
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                </select>
              </div>

              <div className="control-section">
                <label>フォーマット</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                  className="select-input"
                >
                  <option value="png">PNG</option>
                  <option value="svg">SVG</option>
                </select>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="btn primary"
                onClick={() => download(`tweetshot-${tweet.id}.png`, exportFormat)}
                type="button"
              >
                <Download size={16} /> ダウンロード ({exportFormat.toUpperCase()})
              </button>
              <button
                className="btn secondary"
                onClick={handleCopy}
                type="button"
              >
                {copied ? (
                  <>
                    <Check size={16} /> コピー済み
                  </>
                ) : (
                  <>
                    <Copy size={16} /> クリップボードにコピー
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      <footer>
        <p>ツイートのURLを貼るだけ。インスタ・ブログ・noteに最適な画像を生成。</p>
      </footer>
    </div>
  );
}
