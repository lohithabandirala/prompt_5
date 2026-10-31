'use client';

interface GenerationOverlayProps {
  title: string;
  description: string;
  elapsedSeconds: number;
  onCancel: () => void;
}

/**
 * Blocking progress dialog shown while a plan or section is generated.
 * The request is cancellable and elapsed time is announced politely.
 */
export default function GenerationOverlay({
  title,
  description,
  elapsedSeconds,
  onCancel,
}: GenerationOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="generation-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-4 text-5xl" aria-hidden="true">
          ✨
        </div>
        <h2 id="generation-title" className="mb-2 text-xl font-bold text-slate-900">
          {title}
        </h2>
        <p className="mb-4 text-sm text-slate-500">{description}</p>
        <div className="mb-4 flex justify-center">
          <span
            className="spinner"
            style={{ width: '2rem', height: '2rem', borderWidth: '3px' }}
            aria-hidden="true"
          />
        </div>
        <p className="mb-4 text-xs text-slate-500" aria-live="polite">
          {elapsedSeconds}s elapsed
        </p>
        <button type="button" onClick={onCancel} className="btn btn-ghost btn-sm">
          Cancel request
        </button>
      </div>
    </div>
  );
}
