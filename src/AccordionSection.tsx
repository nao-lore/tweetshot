import { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function AccordionSection({ title, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const headerId = `${id}-header`;
  const panelId = `${id}-panel`;
  return (
    <div className="accordion-section">
      <button className="accordion-header" onClick={() => setOpen(!open)} type="button" id={headerId} aria-expanded={open} aria-controls={panelId}>
        <span>{title}</span>
        <ChevronDown size={16} className={`accordion-chevron ${open ? 'open' : ''}`} />
      </button>
      {open && <div className="accordion-body" role="region" id={panelId} aria-labelledby={headerId}>{children}</div>}
    </div>
  );
}
