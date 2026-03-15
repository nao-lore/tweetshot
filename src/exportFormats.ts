import { toPng, toSvg, toJpeg, toBlob } from 'html-to-image';

export type ExtendedExportFormat = 'png' | 'svg' | 'jpeg' | 'webp';

export const exportFormatOptions: { id: ExtendedExportFormat; label: string; extension: string }[] = [
  { id: 'png', label: 'PNG', extension: '.png' },
  { id: 'svg', label: 'SVG', extension: '.svg' },
  { id: 'jpeg', label: 'JPEG', extension: '.jpg' },
  { id: 'webp', label: 'WebP', extension: '.webp' },
];

export async function exportToFormat(
  element: HTMLElement,
  format: ExtendedExportFormat,
  pixelRatio: number,
  backgroundColor?: string,
): Promise<{ dataUrl: string; blob: Blob | null }> {
  const commonOptions = {
    pixelRatio,
    cacheBust: true,
    skipFonts: true,
    fetchRequestInit: { mode: 'cors' as RequestMode },
    filter: (node: HTMLElement) => {
      // Skip external images that fail CORS
      if (node.tagName === 'IMG') {
        const src = node.getAttribute('src') ?? '';
        if (src.startsWith('https://chart.googleapis.com')) return false;
      }
      return true;
    },
  };

  switch (format) {
    case 'png': {
      const dataUrl = await toPng(element, {
        ...commonOptions,
        backgroundColor,
      });
      const blob = await toBlob(element, {
        ...commonOptions,
        backgroundColor,
      });
      return { dataUrl, blob };
    }

    case 'svg': {
      const dataUrl = await toSvg(element, {
        ...commonOptions,
        backgroundColor,
      });
      return { dataUrl, blob: null };
    }

    case 'jpeg': {
      const bgColor = backgroundColor || '#ffffff';
      const dataUrl = await toJpeg(element, {
        ...commonOptions,
        backgroundColor: bgColor,
        quality: 0.95,
      });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      return { dataUrl, blob };
    }

    case 'webp': {
      const pngDataUrl = await toPng(element, {
        ...commonOptions,
        backgroundColor,
      });

      const { dataUrl, blob } = await convertPngToWebp(pngDataUrl);
      return { dataUrl, blob };
    }

    default: {
      const _exhaustive: never = format;
      throw new Error(`未対応のフォーマット: ${_exhaustive}`);
    }
  }
}

function convertPngToWebp(
  pngDataUrl: string,
): Promise<{ dataUrl: string; blob: Blob | null }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context を取得できませんでした'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL('image/webp', 0.9);
      canvas.toBlob(
        (blob) => {
          resolve({ dataUrl, blob });
        },
        'image/webp',
        0.9,
      );
    };
    img.onerror = () => reject(new Error('WebP変換用の画像読み込みに失敗しました'));
    img.src = pngDataUrl;
  });
}
