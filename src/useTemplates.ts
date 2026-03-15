import { useState, useCallback, useEffect } from 'react';
import type { Background, SizePreset, ExportFormat } from './types';
import type { CardLayout } from './CardLayouts';

export interface TemplateSettings {
  background: Background;
  cardTheme: 'light' | 'dark';
  padding: number;
  shadow: number;
  borderRadius: number;
  showMetrics: boolean;
  showWatermark: boolean;
  border: boolean;
  borderColor: string;
  sizePreset: SizePreset;
  pixelRatio: number;
  exportFormat: ExportFormat;
  layout: CardLayout;
  fontId: string;
  fontFamily: string;
  showQR: boolean;
  transparentBg: boolean;
}

export interface StyleTemplate {
  id: string;
  name: string;
  createdAt: string;
  settings: TemplateSettings;
}

const STORAGE_KEY = 'tweetshot-templates';
const MAX_TEMPLATES = 20;

function loadFromStorage(): StyleTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(templates: StyleTemplate[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function useTemplates() {
  const [templates, setTemplates] = useState<StyleTemplate[]>(loadFromStorage);

  useEffect(() => {
    saveToStorage(templates);
  }, [templates]);

  const saveTemplate = useCallback((name: string, settings: TemplateSettings) => {
    setTemplates((prev) => {
      const newTemplate: StyleTemplate = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        settings,
      };
      const updated = [newTemplate, ...prev];
      if (updated.length > MAX_TEMPLATES) {
        updated.length = MAX_TEMPLATES;
      }
      return updated;
    });
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadTemplate = useCallback((id: string): TemplateSettings | null => {
    const found = templates.find((t) => t.id === id);
    return found ? found.settings : null;
  }, [templates]);

  return { templates, saveTemplate, deleteTemplate, loadTemplate };
}
