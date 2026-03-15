import { useCallback } from 'react';
import { toPng, toBlob, toSvg } from 'html-to-image';
import type { RefObject } from 'react';
import type { ExportFormat } from './types';

export function useScreenshot(ref: RefObject<HTMLDivElement | null>, pixelRatio = 2) {
  const download = useCallback(async (filename = 'tweetshot.png', format: ExportFormat = 'png') => {
    if (!ref.current) return;
    let dataUrl: string;
    let finalFilename = filename;
    if (format === 'svg') {
      dataUrl = await toSvg(ref.current, { pixelRatio });
      finalFilename = filename.replace(/\.png$/, '.svg');
    } else {
      dataUrl = await toPng(ref.current, { pixelRatio });
    }
    const link = document.createElement('a');
    link.download = finalFilename;
    link.href = dataUrl;
    link.click();
  }, [ref, pixelRatio]);

  const copyToClipboard = useCallback(async (): Promise<boolean> => {
    if (!ref.current) return false;
    try {
      const blob = await toBlob(ref.current, { pixelRatio });
      if (!blob) return false;
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      return true;
    } catch {
      return false;
    }
  }, [ref, pixelRatio]);

  return { download, copyToClipboard };
}
