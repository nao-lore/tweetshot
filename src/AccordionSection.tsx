import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function AccordionSection({ title, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="accordion-section">
      <button className="accordion-header" onClick={() => setOpen(!open)} type="button">
        <span>{title}</span>
        <ChevronDown size={16} className={`accordion-chevron ${open ? 'open' : ''}`} />
      </button>
      {open && <div className="accordion-body">{children}</div>}
    </div>
  );
}
