import { toBlob } from 'html-to-image';
import { useCallback, useRef, useState } from 'react';

import type { AnalysisResult } from '@/types/analysis';

const SHARE_TITLE = 'AI 관상 분석 결과';
const SHARE_URL = typeof window !== 'undefined' ? window.location.origin : '';

type ShareOutcome =
  | { kind: 'shared' }
  | { kind: 'copied' }
  | { kind: 'downloaded' }
  | { kind: 'cancelled' }
  | { kind: 'error'; message: string };

export function useShareImage(result: AnalysisResult) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [busy, setBusy] = useState(false);

  const share = useCallback(async (): Promise<ShareOutcome> => {
    if (busy) return { kind: 'cancelled' };
    setBusy(true);
    try {
      const text = buildShareText(result);
      const blob = await captureCard(cardRef.current);
      const file = blob ? new File([blob], 'your-fortune.png', { type: 'image/png' }) : null;

      if (file && canShareFiles(file)) {
        try {
          await navigator.share({ title: SHARE_TITLE, text, files: [file] });
          return { kind: 'shared' };
        } catch (err) {
          if (isAbort(err)) return { kind: 'cancelled' };
          // fall through to fallback
        }
      }

      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({ title: SHARE_TITLE, text, url: SHARE_URL || undefined });
          return { kind: 'shared' };
        } catch (err) {
          if (isAbort(err)) return { kind: 'cancelled' };
        }
      }

      const copied = await copyText(text);
      if (blob) downloadBlob(blob, 'your-fortune.png');

      if (copied) return { kind: 'copied' };
      if (blob) return { kind: 'downloaded' };
      return { kind: 'error', message: '공유에 실패했어요. 다시 시도해 주세요.' };
    } catch (err) {
      console.error('share failed', err);
      return { kind: 'error', message: '공유에 실패했어요. 다시 시도해 주세요.' };
    } finally {
      setBusy(false);
    }
  }, [busy, result]);

  return { cardRef, share, busy };
}

async function captureCard(node: HTMLDivElement | null): Promise<Blob | null> {
  if (!node) return null;
  try {
    return await toBlob(node, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#ffffff',
    });
  } catch (err) {
    console.error('card capture failed', err);
    return null;
  }
}

function canShareFiles(file: File): boolean {
  if (typeof navigator === 'undefined') return false;
  if (typeof navigator.share !== 'function') return false;
  if (typeof navigator.canShare !== 'function') return false;
  try {
    return navigator.canShare({ files: [file] });
  } catch {
    return false;
  }
}

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('clipboard copy failed', err);
    return false;
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildShareText(result: AnalysisResult): string {
  const sections: string[] = [`${SHARE_TITLE}\n\n${result.overallSummary}`];
  if (result.keywords.length > 0) {
    sections.push(result.keywords.map((k) => `#${k}`).join(' '));
  }
  sections.push('※ 엔터테인먼트 목적의 분석입니다.');
  if (SHARE_URL) sections.push(SHARE_URL);
  return sections.join('\n\n');
}

function isAbort(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}
