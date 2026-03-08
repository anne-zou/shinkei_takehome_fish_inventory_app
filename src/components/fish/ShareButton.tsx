import { useState, useEffect, useRef } from 'react';
import './ShareButton.css';

export default function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const url = window.location.href;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQrLoaded(false); }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); setQrLoaded(false); }
    }
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=f97316&bgcolor=1a1a1a&data=${encodeURIComponent(url)}`;

  return (
    <div className="share-wrap" ref={ref}>
      <button
        className="share-btn"
        onClick={() => { setOpen((v) => !v); setQrLoaded(false); }}
        aria-label="Share this page"
        aria-expanded={open}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
          <circle cx="11.5" cy="2.5" r="1.75" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="3.5" cy="7.5" r="1.75" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="11.5" cy="12.5" r="1.75" stroke="currentColor" strokeWidth="1.4" />
          <line x1="5.1" y1="6.6" x2="9.9" y2="3.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="5.1" y1="8.4" x2="9.9" y2="11.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        Share
      </button>

      {open && (
        <div className="share-popover" role="dialog" aria-label="Share options">
          <button className="share-copy-btn" onClick={handleCopy}>
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <rect x="1" y="4" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M5 4V2.5A1.5 1.5 0 016.5 1h5A1.5 1.5 0 0113 2.5v7A1.5 1.5 0 0111.5 11H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                Copy link
              </>
            )}
          </button>

          <div className="share-divider" />

          <p className="share-qr-label">Scan to open</p>
          <div className="share-qr-wrap">
            {!qrLoaded && <div className="share-qr-skeleton" aria-hidden />}
            <img
              src={qrSrc}
              alt="QR code for this page"
              width={160}
              height={160}
              className="share-qr"
              style={{ display: qrLoaded ? 'block' : 'none' }}
              onLoad={() => setQrLoaded(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
