/**
 * Typewriter — A-style typed reveal, reusable.
 * Honors prefers-reduced-motion (renders instantly).
 */
import React, { useEffect, useRef, useState } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  cursor?: boolean;
  as?: 'span' | 'p' | 'div' | 'h1';
  style?: React.CSSProperties;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 16, className = '', cursor = true, as: Tag = 'span', style }) => {
  const [n, setN] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setN(text.length); done.current = true; return; }
    setN(0);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setN(i);
      if (i >= text.length) { clearInterval(t); done.current = true; }
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);

  return (
    <Tag className={className} style={style}>
      {text.slice(0, n)}
      {cursor && <span className="brutal-cursor" aria-hidden="true">▌</span>}
    </Tag>
  );
};

export default Typewriter;
