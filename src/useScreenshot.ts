import { useCallback } from 'react';
import type { RefObject } from 'react';
import type { ExportFormat } from './types';
import { exportToFormat } from './exportFormats';

export function useScreenshot(ref: RefObject<HTMLDivElement | null>, pixelRatio = 2) {
  const download = useCallback(async (filename = 'tweetshot.png', format: ExportFormat = 'png', transparentBg = false) => {
    if (!ref.current) return;
    const ext = format === 'jpeg' ? '.jpg' : format === 'webp' ? '.webp' : format === 'svg' ? '.svg' : '.png';
    const finalFilename = filename.replace(/\.\w+$/, ext);
    const bgColor = transparentBg ? 'transparent' : undefined;
    const { dataUrl } = await exportToFormat(ref.current, format, pixelRatio, bgColor);
    const link = document.createElement('a');
    link.download = finalFilename;
    link.href = dataUrl;
    link.click();
  }, [ref, pixelRatio]);

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    if (!ref.current) return false;
    try {
      const { blob } = await exportToFormat(ref.current, 'png', pixelRatio);
      if (!blob) return false;
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return true;
    } catch {
      return false;
    }
  }, [ref, pixelRatio]);

  const getDataUrl = useCallback(async (format: ExportFormat = 'png'): Promise<string | null> => {
    if (!ref.current) return null;
    const { dataUrl } = await exportToFormat(ref.current, format, pixelRatio);
    return dataUrl;
  }, [ref, pixelRatio]);

  return { download, copyToClipboard, getDataUrl };
}
