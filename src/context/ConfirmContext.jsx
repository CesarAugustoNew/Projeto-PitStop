import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './ConfirmContext.css';

/*
  Substitui o window.confirm() por uma caixa de diálogo do próprio sistema.
  Uso:
    const confirm = useConfirm();
    const ok = await confirm({ title, message, confirmLabel, danger: true });
    if (!ok) return;
*/
const ConfirmContext = createContext(null);

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [opts, setOpts] = useState(null);
  const resolver = useRef(null);
  const cancelRef = useRef(null);

  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        resolver.current = resolve;
        setOpts(options);
      }),
    []
  );

  const close = (resultado) => {
    resolver.current?.(resultado);
    resolver.current = null;
    setOpts(null);
  };

  useEffect(() => {
    if (!opts) return;
    cancelRef.current?.focus(); // foco no "Cancelar": confirmar sem querer exige um clique deliberado
    const onKey = (e) => { if (e.key === 'Escape') close(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [opts]);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {opts && (
        <div className="modal-overlay" onClick={() => close(false)}>
          <div
            className="modal-content glass confirm-box"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-msg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`confirm-icon ${opts.danger ? 'is-danger' : ''}`} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5" />
              </svg>
            </div>
            <h3 id="confirm-title" className="confirm-title">{opts.title || 'Confirmar ação'}</h3>
            <p id="confirm-msg" className="confirm-msg">{opts.message}</p>
            <div className="confirm-actions">
              <button ref={cancelRef} type="button" className="btn btn-secondary" onClick={() => close(false)}>
                {opts.cancelLabel || 'Cancelar'}
              </button>
              <button type="button" className={`btn ${opts.danger ? 'btn-danger' : 'btn-primary'}`} onClick={() => close(true)}>
                {opts.confirmLabel || 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
