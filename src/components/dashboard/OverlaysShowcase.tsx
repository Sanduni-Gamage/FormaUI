import { useState } from "react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Popover } from "../ui/Popover";
import { Tooltip } from "../ui/Tooltip";

export function OverlaysShowcase() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="showcase-grid">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Modal</h2>
            <p>A focused dialog that blocks the rest of the page.</p>
          </div>
        </div>

        <div className="showcase-form-field">
          <div>
            <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          </div>
        </div>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm changes"
          description="Review your changes before continuing."
        >
          <p>Your profile will be updated for everyone in your team.</p>
          <div className="button-showcase">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>Confirm</Button>
          </div>
        </Modal>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Tooltip</h2>
            <p>Short help text on hover or keyboard focus.</p>
          </div>
        </div>

        <div className="showcase-form-field">
          <div>
            <Tooltip content="Save your changes">
              <Button variant="outline">Save</Button>
            </Tooltip>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Popover</h2>
            <p>Non-modal interactive content anchored to a trigger.</p>
          </div>
        </div>

        <div className="showcase-form-field">
          <div>
            <Popover
              title="Share this page"
              titleAs="h3"
              trigger={<Button variant="outline">Share</Button>}
            >
              <p>Anyone in your team with the link can view this page.</p>
              <div>
                <Button size="sm">Copy link</Button>
              </div>
            </Popover>
          </div>
        </div>
      </section>
    </div>
  );
}
