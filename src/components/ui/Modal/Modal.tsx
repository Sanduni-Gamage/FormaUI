import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import "./Modal.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  closeOnBackdropClick = true,
  showCloseButton = true,
  className = "",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    onClose();
  };

  // The browser can close the dialog itself, e.g. Chrome lets a second Escape press
  // through even after the first was cancelled. Keep the parent's state in sync so
  // the modal can be reopened. When the parent closed it, `open` is already false.
  const handleNativeClose = () => {
    if (open) onClose();
  };

  // Only treat it as a backdrop click if the press also started on the backdrop.
  // Otherwise selecting text inside the modal and releasing the mouse outside it
  // would close the modal, because the browser targets that click at the <dialog>.
  const pressStartedOnBackdrop = useRef(false);

  const handleBackdropPointerDown = (
    event: PointerEvent<HTMLDialogElement>,
  ) => {
    pressStartedOnBackdrop.current = event.target === dialogRef.current;
  };

  const handleBackdropClick = (
    event: MouseEvent<HTMLDialogElement>,
  ) => {
    const startedOnBackdrop = pressStartedOnBackdrop.current;
    pressStartedOnBackdrop.current = false;

    if (
      closeOnBackdropClick &&
      startedOnBackdrop &&
      event.target === dialogRef.current
    ) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={`forma-modal ${className}`.trim()}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={handleCancel}
      onClose={handleNativeClose}
      onPointerDown={handleBackdropPointerDown}
      onClick={handleBackdropClick}
    >
      <div className="forma-modal-content">
        <header className="forma-modal-header">
          <div className="forma-modal-heading">
            <h2 id={titleId} className="forma-modal-title">
              {title}
            </h2>

            {description && (
              <p
                id={descriptionId}
                className="forma-modal-description"
              >
                {description}
              </p>
            )}
          </div>

          {showCloseButton && (
            <button
              type="button"
              className="forma-modal-close"
              onClick={() => onClose()}
              aria-label="Close dialog"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </header>

        <div className="forma-modal-body">{children}</div>
      </div>
    </dialog>
  );
}
