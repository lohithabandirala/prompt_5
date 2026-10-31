'use client';

interface RegenerateButtonProps {
  onClick: () => void;
  /** Accessible name describing which section is regenerated. */
  ariaLabel: string;
  label?: string;
  isRegenerating?: boolean;
  className?: string;
}

/**
 * The single "regenerate this section" control used by every plan section.
 * Centralised so the spinner, disabled state and styling stay consistent.
 */
export default function RegenerateButton({
  onClick,
  ariaLabel,
  label = 'Regenerate',
  isRegenerating = false,
  className = '',
}: RegenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isRegenerating}
      className={`btn btn-ghost btn-sm${className ? ` ${className}` : ''}`}
      aria-label={ariaLabel}
    >
      {isRegenerating ? <span className="spinner" aria-hidden="true" /> : '🔄'} {label}
    </button>
  );
}
