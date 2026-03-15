import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
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
import { type CardLayout, cardLayouts } from './CardLayouts';
import { FontPicker, fontOptions } from './FontPicker';
import { ShareButtons } from './ShareButtons';
import { EmbedCodePanel } from './EmbedCodePanel';
import { QRCode } from './QRCode';
import { DropZone } from './DropZone';
import { useHistory } from './useHistory';
import { HistoryPanel } from './HistoryPanel';
import { HighlightPanel } from './HighlightPanel';
import type { HighlightRule } from './TextHighlight';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { ShortcutsHelp } from './ShortcutsHelp';
import { useI18n } from './i18n';
import { LangSwitcher } from './LangSwitcher';
import { exportFormatOptions } from './exportFormats';
import { TransparencyPreview } from './TransparentBg';
import { AccordionSection } from './AccordionSection';

type ViewMode = 'single' | 'thread' | 'bulk';

export default function App() {
  const { lang, setLang, t } = useI18n();

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

  // New Phase 3 controls
  const [layout, setLayout] = useState<CardLayout>('default');
  const [fontId, setFontId] = useState('system');
  const [fontFamily, setFontFamily] = useState(fontOptions[0].family);
  const [showQR, setShowQR] = useState(false);
  const [highlights, setHighlights] = useState<HighlightRule[]>([]);
  const [transparentBg, setTransparentBg] = useState(false);

  // Image background
  const [imageBackground, setImageBackground] = useState<string | null>(null);

  // Brand logo
  const brandLogo = useBrandLogo();

  // Translation
  const { isTranslated, reset: resetTranslation } = useTranslation(tweet?.text ?? '');
  const [displayText, setDisplayText] = useState<string | null>(null);

  // History
  const history = useHistory();

  // Embed data
  const [embedDataUrl, setEmbedDataUrl] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const { download, copyToClipboard, getDataUrl } = useScreenshot(cardRef, pixelRatio);

  // Keyboard shortcuts
  const handleDownload = useCallback(() => {
    if (tweet) download(`tweetshot-${tweet.id}.png`, exportFormat, transparentBg);
  }, [tweet, download, exportFormat, transparentBg]);

  const handleCopyShortcut = useCallback(async () => {
    const ok = await copyToClipboard();
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }, [copyToClipboard]);

  const { showHelp, setShowHelp } = useKeyboardShortcuts({
    download: handleDownload,
    copy: handleCopyShortcut,
    toggleTheme: () => setCardTheme(prev => prev === 'light' ? 'dark' : 'light'),
    generate: () => { if (url.trim()) handleGenerate(); },
  }, true);

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
      setError(t('error.invalidUrl'));
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
      setError(err instanceof Error ? err.message : t('error.generic'));
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
    if (results.length > 0) setTweet(results[0]);
  }

  function handleTranslate(translated: string) { setDisplayText(translated); }
  function handleResetTranslation() { setDisplayText(null); resetTranslation(); }

  function handleDrop(droppedUrl: string) {
    setUrl(droppedUrl);
  }

  function handleHistorySelect(tweetUrl: string) {
    setUrl(tweetUrl);
  }

  // Save to history when tweet is generated
  useEffect(() => {
    if (tweet && cardRef.current) {
      const timer = setTimeout(async () => {
        const dataUrl = await getDataUrl('png');
        if (dataUrl) {
          history.addEntry(tweet, dataUrl, url);
          setEmbedDataUrl(dataUrl);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tweet?.id]);

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

  const previewContent = (
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
            tweet={tweet!}
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
            fontFamily={fontFamily}
            layout={layout}
            highlights={highlights}
            showQR={showQR}
            tweetUrl={url}
            transparentBg={transparentBg}
          />
        )}
      </DeviceMockup>
    </div>
  );

  return (
    <DropZone onDrop={handleDrop}>
      <div className="app">
        <header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <h1>{t('app.title')}</h1>
              <p className="tagline">{t('app.tagline')}</p>
            </div>
            <LangSwitcher lang={lang} onChange={setLang} />
          </div>
        </header>

        {/* View mode tabs */}
        <div className="view-mode-tabs">
          <button className={`tab ${viewMode === 'single' ? 'active' : ''}`} onClick={() => setViewMode('single')} type="button">
            {t('tab.single')}
          </button>
          <button className={`tab ${viewMode === 'thread' ? 'active' : ''}`} onClick={() => setViewMode('thread')} type="button">
            <Layers size={14} /> {t('tab.thread')}
          </button>
          <button className={`tab ${viewMode === 'bulk' ? 'active' : ''}`} onClick={() => setViewMode('bulk')} type="button">
            <ListOrdered size={14} /> {t('tab.bulk')}
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
              placeholder={t('input.placeholder')}
              spellCheck={false}
            />
            <button className="btn primary" onClick={handleGenerate} disabled={loading || !url.trim()} type="button">
              {loading ? <Loader2 size={18} className="spin" /> : t('btn.generate')}
            </button>
          </div>
        )}

        {error && <div className="error-box">{error}</div>}

        {/* Bulk results selector */}
        {viewMode === 'bulk' && tweets.length > 1 && (
          <div className="bulk-results">
            <label style={{ color: '#888', fontSize: 12, marginBottom: 8, display: 'block' }}>
              {tweets.length}件取得完了
            </label>
            <div className="bulk-list">
              {tweets.map((tw) => (
                <button key={tw.id} className={`bulk-item ${tweet?.id === tw.id ? 'active' : ''}`}
                  onClick={() => { setTweet(tw); setDisplayText(null); }} type="button">
                  <span className="bulk-item-name">@{tw.user.screenName}</span>
                  <span className="bulk-item-text">{tw.text.slice(0, 40)}...</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {!hasTweet && !loading && (
          <div className="no-tweet-placeholder">
            {t('placeholder.noTweet')}
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
              {transparentBg ? (
                <TransparencyPreview>{previewContent}</TransparencyPreview>
              ) : previewContent}
            </div>

            <div className="controls">
              {/* 1. Basic Settings */}
              <AccordionSection title={t('accordion.basic')} defaultOpen>
                <div className="control-section">
                  <label>{t('label.background')}</label>
                  <BackgroundPicker
                    selected={transparentBg ? '' : background.id}
                    onChange={(bg) => { setBackground(bg); setImageBackground(null); setTransparentBg(false); }}
                    customColor={customColor}
                    onCustomColorChange={setCustomColor}
                  />
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <UnsplashPicker
                      onSelect={(u) => { setImageBackground(u); setTransparentBg(false); }}
                      onClear={() => setImageBackground(null)}
                      currentUrl={imageBackground}
                    />
                    <button
                      className={`btn icon-toggle ${transparentBg ? 'active-toggle' : ''}`}
                      onClick={() => { setTransparentBg(!transparentBg); if (!transparentBg) setImageBackground(null); }}
                      type="button"
                      style={{ fontSize: 12, padding: '4px 10px' }}
                    >
                      {t('transparent')}
                    </button>
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-section">
                    <label>{t('label.theme')}</label>
                    <button className="btn icon-toggle" onClick={() => setCardTheme(cardTheme === 'light' ? 'dark' : 'light')} type="button">
                      {cardTheme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
                      {cardTheme === 'light' ? t('theme.light') : t('theme.dark')}
                    </button>
                  </div>
                  <div className="control-section">
                    <label>{t('label.padding')}</label>
                    <input type="range" min={16} max={80} value={padding} onChange={(e) => setPadding(Number(e.target.value))} />
                  </div>
                </div>
              </AccordionSection>

              {/* 2. Card Style */}
              <AccordionSection title={t('accordion.cardStyle')}>
                <div className="control-row">
                  <div className="control-section">
                    <label>{t('label.shadow')}</label>
                    <input type="range" min={0} max={20} value={shadow} onChange={(e) => setShadow(Number(e.target.value))} />
                  </div>
                  <div className="control-section">
                    <label>{t('label.borderRadius')}</label>
                    <input type="range" min={0} max={24} value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} />
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-section">
                    <label>{t('label.border')}</label>
                    <div className="toggle-with-color">
                      <button className={`btn icon-toggle ${border ? 'active-toggle' : ''}`} onClick={() => setBorder(!border)} type="button">
                        {border ? 'ON' : 'OFF'}
                      </button>
                      {border && <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="color-input-small" />}
                    </div>
                  </div>
                  <div className="control-section">
                    <label>{t('label.metrics')}</label>
                    <button className={`btn icon-toggle ${showMetrics ? 'active-toggle' : ''}`} onClick={() => setShowMetrics(!showMetrics)} type="button">
                      {showMetrics ? t('show') : t('hide')}
                    </button>
                  </div>
                  <div className="control-section">
                    <label>{t('label.watermark')}</label>
                    <button className={`btn icon-toggle ${showWatermark ? 'active-toggle' : ''}`} onClick={() => setShowWatermark(!showWatermark)} type="button">
                      {showWatermark ? t('show') : t('hide')}
                    </button>
                  </div>
                </div>
              </AccordionSection>

              {/* 3. Layout */}
              <AccordionSection title={t('accordion.layout')}>
                <div className="control-row">
                  <div className="control-section">
                    <label>{t('label.layout')}</label>
                    <select value={layout} onChange={(e) => setLayout(e.target.value as CardLayout)} className="select-input">
                      {cardLayouts.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                    </select>
                  </div>
                  <div className="control-section">
                    <label>{t('label.font')}</label>
                    <FontPicker selected={fontId} onChange={(id, family) => { setFontId(id); setFontFamily(family); }} />
                  </div>
                </div>
              </AccordionSection>

              {/* 4. Export */}
              <AccordionSection title={t('accordion.export')} defaultOpen>
                <div className="control-row">
                  <div className="control-section">
                    <label>{t('label.size')}</label>
                    <select value={sizePreset.id} onChange={(e) => setSizePreset(sizePresets.find(p => p.id === e.target.value) ?? sizePresets[0])} className="select-input">
                      {sizePresets.map(p => <option key={p.id} value={p.id}>{p.label}{p.width ? ` (${p.width}×${p.height})` : ''}</option>)}
                    </select>
                  </div>
                  <div className="control-section">
                    <label>{t('label.resolution')}</label>
                    <select value={pixelRatio} onChange={(e) => setPixelRatio(Number(e.target.value))} className="select-input">
                      <option value={1}>1x</option>
                      <option value={2}>2x</option>
                      <option value={4}>4x</option>
                    </select>
                  </div>
                  <div className="control-section">
                    <label>{t('label.format')}</label>
                    <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value as ExportFormat)} className="select-input">
                      {exportFormatOptions.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="btn primary" onClick={handleDownload} type="button">
                    <Download size={16} /> {t('btn.download')} ({exportFormatOptions.find(f => f.id === exportFormat)?.label})
                  </button>
                  <button className="btn secondary" onClick={handleCopy} type="button">
                    {copied ? <><Check size={16} /> {t('btn.copied')}</> : <><Copy size={16} /> {t('btn.copy')}</>}
                  </button>
                </div>
              </AccordionSection>

              {/* 5. Advanced */}
              <AccordionSection title={t('accordion.advanced')}>
                <div className="control-section">
                  <label>{t('label.device')}</label>
                  <div className="device-selector">
                    {deviceOptions.map(d => (
                      <button key={d.id} className={`btn icon-toggle ${device === d.id ? 'active-toggle' : ''}`}
                        onClick={() => setDevice(d.id)} type="button" style={{ fontSize: 12, padding: '6px 12px' }}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="control-row">
                  <div className="control-section">
                    <label>{t('label.qr')}</label>
                    <button className={`btn icon-toggle ${showQR ? 'active-toggle' : ''}`} onClick={() => setShowQR(!showQR)} type="button">
                      {showQR ? t('show') : t('hide')}
                    </button>
                  </div>
                </div>

                <div className="control-section">
                  <label>{t('label.highlight')}</label>
                  <HighlightPanel rules={highlights} onChange={setHighlights} />
                </div>
              </AccordionSection>

              {/* 6. Brand & Share */}
              <AccordionSection title={t('accordion.brandShare')}>
                <BrandLogoPanel
                  logoUrl={brandLogo.logoUrl}
                  logoText={brandLogo.logoText}
                  position={brandLogo.position}
                  onLogoFile={brandLogo.setLogoFile}
                  onLogoText={brandLogo.setLogoText}
                  onPosition={brandLogo.setPosition}
                  onClear={brandLogo.clearLogo}
                />

                <div className="control-section">
                  <label>{t('label.share')}</label>
                  <ShareButtons tweetUrl={url} />
                </div>

                {showQR && (
                  <div className="control-section">
                    <label>{t('label.qrPreview')}</label>
                    <QRCode url={url} size={120} show={true} />
                  </div>
                )}

                <div className="control-section">
                  <label>{t('label.embed')}</label>
                  <EmbedCodePanel tweetUrl={url} imageDataUrl={embedDataUrl} />
                </div>
              </AccordionSection>

              {/* 7. Templates (keep outside accordion - has own collapsible) */}
              <TemplatePanel onLoad={loadTemplateSettings} currentSettings={currentSettings} />
            </div>
          </>
        )}

        {/* History */}
        <HistoryPanel onSelect={handleHistorySelect} />

        <footer>
          <p>{t('footer.text')}</p>
        </footer>
      </div>

      <ShortcutsHelp open={showHelp} onClose={() => setShowHelp(false)} />
    </DropZone>
  );
}
