import type { ReactNode } from 'react';

type SectionLabelProps = {
  children: ReactNode;
  variant?: 'light' | 'dark';
  className?: string;
};

/** A compact introductory label shared by sections across the public site. */
export default function SectionLabel({
  children,
  variant = 'light',
  className = '',
}: SectionLabelProps) {
  return (
    <span className={`section-label section-label--${variant}${className ? ` ${className}` : ''}`}>
      <svg
        className="section-label__icon"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M20.2 3.8C12.8 3.9 7.5 5.4 5 9.2c-1.7 2.6-.9 6.2 1.7 7.5 2.7 1.3 6.1-.1 7.2-3.1 1.1-3.1 2.8-6.2 6.3-9.8Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.8 20.2c2.4-5.2 5.6-8.2 10.2-10.4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
      <span className="section-label__text">{children}</span>
    </span>
  );
}
