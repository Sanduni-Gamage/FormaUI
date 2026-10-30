import { useEffect, useRef, useState } from "react";
import { Alert } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Toast } from "../ui/Toast";

export function FeedbackShowcase() {
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // When a dismiss or restore button removes itself, keyboard focus would drop to
  // the page body. These refs let us move focus to the button that replaced it.
  const alertAreaRef = useRef<HTMLDivElement>(null);
  const alertToggled = useRef(false);
  const toastAreaRef = useRef<HTMLDivElement>(null);
  const toastDismissed = useRef(false);

  useEffect(() => {
    if (!alertToggled.current) return;
    alertAreaRef.current?.querySelector("button")?.focus();
  }, [alertDismissed]);

  useEffect(() => {
    if (showToast || !toastDismissed.current) return;
    // The trigger is the first button in the toast area.
    toastAreaRef.current?.querySelector("button")?.focus();
  }, [showToast]);

  function toggleAlert(dismissed: boolean) {
    alertToggled.current = true;
    setAlertDismissed(dismissed);
  }

  function dismissToast() {
    toastDismissed.current = true;
    setShowToast(false);
  }

  return (
    <div className="showcase-grid">
      <section className="panel showcase-span-all">
        <div className="panel-heading">
          <div>
            <h2>Alerts</h2>
            <p>Persistent messages that communicate important information.</p>
          </div>
        </div>

        <div className="showcase-form-field">
          <Alert variant="success" title="Success" titleAs="h3">
            Your changes have been saved.
          </Alert>

          <Alert variant="info" title="Information" titleAs="h3">
            A new update is available.
          </Alert>

          <Alert variant="warning" title="Warning" titleAs="h3">
            Please review the information before continuing.
          </Alert>

          <Alert variant="error" title="Error" titleAs="h3">
            We couldn't complete your request.
          </Alert>

          <div ref={alertAreaRef}>
            {alertDismissed ? (
              <Button variant="outline" onClick={() => toggleAlert(false)}>
                Show alert again
              </Button>
            ) : (
              <Alert
                variant="success"
                title="Dismissible alert"
                titleAs="h3"
                dismissible
                onDismiss={() => toggleAlert(true)}
              >
                This alert includes a dismiss button.
              </Alert>
            )}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Badges</h2>
            <p>Compact indicators for status and categories.</p>
          </div>
        </div>

        <div className="showcase-inline">
          <Badge variant="success">Active</Badge>
          <Badge variant="info">Information</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="error">Failed</Badge>
          <Badge variant="neutral">Draft</Badge>
          <Badge variant="success" dot>Online</Badge>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Toasts</h2>
            <p>Temporary feedback for user actions.</p>
          </div>
        </div>

        <div className="showcase-form-field" ref={toastAreaRef}>
          <div>
            <Button onClick={() => setShowToast(true)}>
              Show success notification
            </Button>
          </div>

          {showToast && (
            <Toast
              variant="success"
              title="Saved successfully"
              onDismiss={dismissToast}
            >
              Your changes have been saved.
            </Toast>
          )}
        </div>
      </section>
    </div>
  );
}
