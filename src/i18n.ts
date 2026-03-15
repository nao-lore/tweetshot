import { useState, useCallback } from 'react';

export type Lang = 'ja' | 'en';

const STORAGE_KEY = 'tweetshot-lang';

export const translations: Record<Lang, Record<string, string>> = {
  ja: {
    'app.title': 'TweetShot',
    'app.tagline': '\u30c4\u30a4\u30fc\u30c8\u3092\u7f8e\u3057\u3044\u753b\u50cf\u306b\u5909\u63db\uff08Twitter\u30fbBluesky\u30fbTikTok\u5bfe\u5fdc\uff09',
    'input.placeholder': 'Twitter\u30fbBluesky\u30fbTikTok\u306eURL\u3092\u8cbc\u308a\u4ed8\u3051...',
    'btn.generate': '\u751f\u6210',
    'btn.download': '\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9',
    'btn.copy': '\u30af\u30ea\u30c3\u30d7\u30dc\u30fc\u30c9\u306b\u30b3\u30d4\u30fc',
    'btn.copied': '\u30b3\u30d4\u30fc\u6e08\u307f',
    'label.background': '\u80cc\u666f',
    'label.theme': '\u30c6\u30fc\u30de',
    'label.padding': '\u4f59\u767d',
    'label.shadow': '\u5f71',
    'label.borderRadius': '\u89d2\u4e38',
    'label.border': '\u679a\u7dda',
    'label.metrics': '\u30e1\u30c8\u30ea\u30af\u30b9',
    'label.watermark': '\u30a6\u30a9\u30fc\u30bf\u30fc\u30de\u30fc\u30af',
    'label.size': '\u30b5\u30a4\u30ba',
    'label.resolution': '\u89e3\u50cf\u5ea6',
    'label.format': '\u30d5\u30a9\u30fc\u30de\u30c3\u30c8',
    'label.device': '\u30c7\u30d0\u30a4\u30b9\u30e2\u30c3\u30af\u30a2\u30c3\u30d7',
    'label.font': '\u30d5\u30a9\u30f3\u30c8',
    'label.layout': '\u30ec\u30a4\u30a2\u30a6\u30c8',
    'label.highlight': '\u30cf\u30a4\u30e9\u30a4\u30c8',
    'label.history': '\u5c65\u6b74',
    'label.template': '\u30c6\u30f3\u30d7\u30ec\u30fc\u30c8',
    'label.brandLogo': '\u30d6\u30e9\u30f3\u30c9\u30ed\u30b4',
    'theme.light': '\u30e9\u30a4\u30c8',
    'theme.dark': '\u30c0\u30fc\u30af',
    'show': '\u8868\u793a',
    'hide': '\u975e\u8868\u793a',
    'tab.single': '\u5358\u4f53',
    'tab.thread': '\u30b9\u30ec\u30c3\u30c9',
    'tab.bulk': '\u4e00\u62ec',
    'error.invalidUrl': '\u6709\u52b9\u306aURL\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044\uff08Twitter, Bluesky, TikTok\u5bfe\u5fdc\uff09',
    'error.generic': '\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f',
    'footer.text': 'Twitter\u30fbBluesky\u30fbTikTok\u306eURL\u3092\u8cbc\u308b\u3060\u3051\u3002\u30a4\u30f3\u30b9\u30bf\u30fb\u30d6\u30ed\u30b0\u30fbnote\u306b\u6700\u9069\u306a\u753b\u50cf\u3092\u751f\u6210\u3002',
    'transparent': '\u900f\u904e',
  },
  en: {
    'app.title': 'TweetShot',
    'app.tagline': 'Turn tweets into beautiful images (Twitter, Bluesky, TikTok)',
    'input.placeholder': 'Paste a Twitter, Bluesky, or TikTok URL...',
    'btn.generate': 'Generate',
    'btn.download': 'Download',
    'btn.copy': 'Copy to clipboard',
    'btn.copied': 'Copied!',
    'label.background': 'Background',
    'label.theme': 'Theme',
    'label.padding': 'Padding',
    'label.shadow': 'Shadow',
    'label.borderRadius': 'Radius',
    'label.border': 'Border',
    'label.metrics': 'Metrics',
    'label.watermark': 'Watermark',
    'label.size': 'Size',
    'label.resolution': 'Resolution',
    'label.format': 'Format',
    'label.device': 'Device Mockup',
    'label.font': 'Font',
    'label.layout': 'Layout',
    'label.highlight': 'Highlight',
    'label.history': 'History',
    'label.template': 'Template',
    'label.brandLogo': 'Brand Logo',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'show': 'Show',
    'hide': 'Hide',
    'tab.single': 'Single',
    'tab.thread': 'Thread',
    'tab.bulk': 'Bulk',
    'error.invalidUrl': 'Please enter a valid URL (Twitter, Bluesky, TikTok)',
    'error.generic': 'An error occurred',
    'footer.text': 'Just paste a URL. Generate beautiful images for Instagram, blogs, and notes.',
    'transparent': 'Transparent',
  },
};

function getInitialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ja' || stored === 'en') return stored;
  } catch {}
  return 'ja';
}

export function useI18n() {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const t = useCallback(
    (key: string): string => {
      return translations[lang][key] ?? key;
    },
    [lang],
  );

  return { lang, setLang, t };
}
