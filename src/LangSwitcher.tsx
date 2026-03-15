import type { Lang } from './i18n';

interface LangSwitcherProps {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

export function LangSwitcher({ lang, onChange }: LangSwitcherProps) {
  const toggle = () => onChange(lang === 'ja' ? 'en' : 'ja');

  return (
    <button
      onClick={toggle}
      title={lang === 'ja' ? 'Switch to English' : '\u65e5\u672c\u8a9e\u306b\u5207\u66ff'}
      style={{
        background: 'none',
        border: '1px solid rgba(128,128,128,0.3)',
        borderRadius: 6,
        padding: '4px 10px',
        cursor: 'pointer',
        fontSize: 13,
        color: 'inherit',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
    >
      {lang === 'ja' ? '\ud83c\uddef\ud83c\uddf5 / EN' : '\ud83c\uddec\ud83c\udde7 / JA'}
    </button>
  );
}
