'use client';
import { useEffect, useState } from 'react';

/**
 * FilterToggle (Client Component): the "Hide filters / Show filters" button.
 * It flips a data-filters attribute on #results; CSS does the actual show/hide.
 * WHY not React state in a parent: the page is a Server Component, and this keeps the JS tiny.
 * Desktop starts with filters visible, mobile starts hidden (the effect syncs the label with the viewport).
 */
export function FilterToggle() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(window.matchMedia('(min-width: 1024px)').matches);
  }, []);

  function toggle() {
    const next = !visible;
    document.getElementById('results')?.setAttribute('data-filters', next ? 'shown' : 'hidden');
    setVisible(next);
  }

  return (
    <button type="button" className="toolbar__toggle" onClick={toggle} aria-expanded={visible} aria-controls="filters">
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d={visible ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
      {visible ? 'Hide filters' : 'Show filters'}
    </button>
  );
}
