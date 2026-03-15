import { useState, useRef, useMemo, useEffect } from 'react';
import { Download, Copy, Check, Loader2, Sun, Moon, Layers, ListOrdered } from 'lucide-react';
import type { TweetData, Background, ExportFormat } from './types';
import { sizePresets } from './types';
import { fetchPost, parsePostUrl } from './parseUrl';
import { fetchThread } from './fetchThread';
import { backgrounds } from './backgrounds';
import { TweetCard } from './TweetCard';
import { ThreadView } from './ThreadView';
import { BackgroundPicker } from './BackgroundPicker';
import { useScreenshot } from './useScreenshot';
import { DeviceMockup, deviceOptions } from './DeviceMockup';
import type { DeviceType } from './DeviceMockup';
import { BulkProcessor } from './BulkProcessor';
import { TemplatePanel } from './TemplatePanel';
import type { TemplateSettings } from './useTemplates';
import { BrandLogoPanel } from './BrandLogoPanel';
import { useBrandLogo } from './useBrandLogo';
import { TranslationPanel } from './TranslationPanel';
import { useTranslation } from './useTranslation';
import { UnsplashPicker } from './UnsplashPicker';

type ViewMode = 'single' | 'thread' | 'bulk';

export default function App() {
  const [url, setUrl] = useState('');
  const [tweet, setTweet] = useState<TweetData | null>(null);
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [background, setBackground] = useState<Background>(backgrounds[0]);
  const [cardTheme, setCardTheme] = useState<'light' | 'dark'>('light');
  const [padding, setPadding] = useState(48);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('single');

  // Style controls
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
  const [device, setDevice] = useState<DeviceType>('none');

  // Image background
  const [imageBackground, setImageBackground] = useState<string | null>(null);

  // Brand logo
  const brandLogo = useBrandLogo();

  // Translation
  const { isTranslated, reset: resetTranslation } = useTranslation(tweet?.text ?? '');
  const [displayText, setDisplayText] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const { download, copyToClipboard } = useScreenshot(cardRef, pixelRatio);

  // Handle URL params (from browser extension)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    if (urlParam) {
      setUrl(urlParam);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  async function handleGenerate() {
    const parsed = parsePostUrl(url);
    if (!parsed) {
      setError('有効なURLを入力してください（Twitter, Bluesky, TikTok対応）');
      return;
    }

    setLoading(true);
    setError(null);
    setTweet(null);
    setTweets([]);
    setDisplayText(null);

    try {
      if (viewMode === 'thread' && parsed.platform === 'twitter') {
        const threadTweets = await fetchThread(parsed.id);
        setTweets(threadTweets);
        if (threadTweets.length > 0) {
          setTweet(threadTweets[threadTweets.length - 1]);
        }
      } else {
        const data = await fetchPost(url);
        setTweet(data);
        setTweets([data]);
      }
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

  function handleBulkResults(results: TweetData[]) {
    setTweets(results);
    if (results.length > 0) {
      setTweet(results[0]);
    }
  }

  function handleTranslate(translated: string) {
    setDisplayText(translated);
  }

  function handleResetTranslation() {
    setDisplayText(null);
    resetTranslation();
  }

  function loadTemplateSettings(settings: TemplateSettings) {
    setBackground(settings.background);
    setCardTheme(settings.cardTheme);
    setPadding(settings.padding);
    setShadow(settings.shadow);
    setBorderRadius(settings.borderRadius);
    setShowMetrics(settings.showMetrics);
    setShowWatermark(settings.showWatermark);
    setBorder(settings.border);
    setBorderColor(settings.borderColor);
    setSizePreset(settings.sizePreset);
    setPixelRatio(settings.pixelRatio);
    setExportFormat(settings.exportFormat);
  }

  const currentSettings: TemplateSettings = {
    background, cardTheme, padding, shadow, borderRadius,
    showMetrics, showWatermark, border, borderColor,
    sizePreset, pixelRatio, exportFormat,
  };

  const previewScale = useMemo(() => {
    if (!sizePreset.width) return 1;
    const maxWidth = 640;
    return sizePreset.width > maxWidth ? maxWidth / sizePreset.width : 1;
  }, [sizePreset]);

  const hasTweet = tweet !== null;
  const showThread = viewMode === 'thread' && tweets.length > 1;

  return (
    <div className="app">
      <header>
        <h1>TweetShot</h1>
        <p className="tagline">ツイートを美しい画像に変換（Twitter・Bluesky・TikTok対応）</p>
      </header>

      {/* View mode tabs */}
      <div className="view-mode-tabs">
        <button
          className={`tab ${viewMode === 'single' ? 'active' : ''}`}
          onClick={() => setViewMode('single')}
          type="button"
        >
          単体
        </button>
        <button
          className={`tab ${viewMode === 'thread' ? 'active' : ''}`}
          onClick={() => setViewMode('thread')}
          type="button"
        >
          <Layers size={14} /> スレッド
        </button>
        <button
          className={`tab ${viewMode === 'bulk' ? 'active' : ''}`}
          onClick={() => setViewMode('bulk')}
          type="button"
        >
          <ListOrdered size={14} /> 一括
        </button>
      </div>

      {viewMode === 'bulk' ? (
        <BulkProcessor onResults={handleBulkResults} />
      ) : (
        <div className="input-row">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Twitter・Bluesky・TikTokのURLを貼り付け..."
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
      )}

      {error && <div className="error-box">{error}</div>}

      {/* Bulk results selector */}
      {viewMode === 'bulk' && tweets.length > 1 && (
        <div className="bulk-results">
          <label style={{ color: '#888', fontSize: 12, marginBottom: 8, display: 'block' }}>
            {tweets.length}件取得完了 — クリックでプレビュー
          </label>
          <div className="bulk-list">
            {tweets.map((t) => (
              <button
                key={t.id}
                className={`bulk-item ${tweet?.id === t.id ? 'active' : ''}`}
                onClick={() => { setTweet(t); setDisplayText(null); }}
                type="button"
              >
                <span className="bulk-item-name">@{t.user.screenName}</span>
                <span className="bulk-item-text">{t.text.slice(0, 40)}...</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {hasTweet && (
        <>
          {/* Translation */}
          <div className="control-section" style={{ marginBottom: 16 }}>
            <TranslationPanel
              originalText={tweet.text}
              onTranslate={handleTranslate}
              onReset={handleResetTranslation}
              isTranslated={isTranslated || displayText !== null}
            />
          </div>

          <div className="preview-container">
            <div style={{
              transform: previewScale < 1 ? `scale(${previewScale})` : undefined,
              transformOrigin: 'top center',
            }}>
              <DeviceMockup device={device}>
                {showThread ? (
                  <ThreadView
                    ref={cardRef}
                    tweets={tweets}
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
                ) : (
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
                    imageBackground={imageBackground}
                    brandLogoUrl={brandLogo.logoUrl}
                    brandLogoText={brandLogo.logoText}
                    brandLogoPosition={brandLogo.position}
                    displayText={displayText ?? undefined}
                  />
                )}
              </DeviceMockup>
            </div>
          </div>

          <div className="controls">
            <div className="control-section">
              <label>背景</label>
              <BackgroundPicker
                selected={background.id}
                onChange={(bg) => { setBackground(bg); setImageBackground(null); }}
                customColor={customColor}
                onCustomColorChange={setCustomColor}
              />
              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <UnsplashPicker
                  onSelect={(url) => setImageBackground(url)}
                  onClear={() => setImageBackground(null)}
                  currentUrl={imageBackground}
                />
              </div>
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

            {/* Device mockup selector */}
            <div className="control-section">
              <label>デバイスモックアップ</label>
              <div className="device-selector">
                {deviceOptions.map(d => (
                  <button
                    key={d.id}
                    className={`btn icon-toggle ${device === d.id ? 'active-toggle' : ''}`}
                    onClick={() => setDevice(d.id)}
                    type="button"
                    style={{ fontSize: 12, padding: '6px 12px' }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand logo */}
            <BrandLogoPanel
              logoUrl={brandLogo.logoUrl}
              logoText={brandLogo.logoText}
              position={brandLogo.position}
              onLogoFile={brandLogo.setLogoFile}
              onLogoText={brandLogo.setLogoText}
              onPosition={brandLogo.setPosition}
              onClear={brandLogo.clearLogo}
            />

            {/* Templates */}
            <TemplatePanel
              onLoad={loadTemplateSettings}
              currentSettings={currentSettings}
            />

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
        <p>Twitter・Bluesky・TikTokのURLを貼るだけ。インスタ・ブログ・noteに最適な画像を生成。</p>
      </footer>
    </div>
  );
}
