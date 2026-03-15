# TweetShot

ツイートを美しい画像に変換するWebアプリ。Twitter・Bluesky・TikTok対応。

Turn tweets into beautiful images. Supports Twitter, Bluesky, and TikTok.

## Features

- **マルチプラットフォーム**: Twitter/X, Bluesky, TikTok対応
- **スレッド対応**: ツイートスレッドを1枚の画像に
- **一括処理**: 複数URLを同時に画像化
- **10種以上の背景**: グラデーション、パターン、カスタムカラー、画像背景
- **4つのカードレイアウト**: デフォルト、ミニマル、新聞風、引用カード
- **8種のフォント**: Google Fonts対応
- **デバイスモックアップ**: iPhone, Android, MacBook, iPad
- **AI翻訳**: 9言語対応
- **テキストハイライト**: キーワード色付け強調
- **QRコード埋込**
- **ブランドロゴ**: カスタムウォーターマーク
- **テンプレート**: スタイル設定の保存/読込
- **4フォーマット出力**: PNG, SVG, JPEG, WebP
- **透過背景対応**
- **Chrome拡張機能**
- **キーボードショートカット**
- **日本語/英語UI**

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Deploy

Vercel対応。`vercel.json`設定済み。

```bash
vercel
```

## Tech Stack

- React 19 + TypeScript
- Vite 8
- html-to-image
- Vercel Edge Functions
- lucide-react

## Chrome Extension

`extension/` ディレクトリをChromeの `chrome://extensions` で「パッケージ化されていない拡張機能を読み込む」。

## License

MIT
