import { Tabs, type TabItem } from "../ui/Tabs";

const accountTabs: TabItem[] = [
  {
    id: "profile",
    label: "Profile",
    content: <p>Update your name, photo and contact details.</p>,
  },
  {
    id: "security",
    label: "Security",
    content: <p>Change your password and two-step verification.</p>,
  },
  {
    id: "billing",
    label: "Billing",
    content: <p>Billing is managed by your organisation.</p>,
    disabled: true,
  },
  {
    id: "notifications",
    label: "Notifications",
    content: <p>Choose which updates you receive by email.</p>,
  },
];

export function NavigationShowcase() {
  return (
    <div className="showcase-grid">
      <section className="panel showcase-span-all">
        <div className="panel-heading">
          <div>
            <h2>Tabs</h2>
            <p>
              Arrow keys move between tabs; Home and End jump to the first and
              last. Disabled tabs are skipped.
            </p>
          </div>
        </div>

        <Tabs tabs={accountTabs} ariaLabel="Account settings" />
      </section>

      <section className="panel showcase-span-all">
        <div className="panel-heading">
          <div>
            <h2>Tabs with manual activation</h2>
            <p>Arrow keys move focus; Enter or Space selects the tab.</p>
          </div>
        </div>

        <Tabs
          tabs={accountTabs}
          activationMode="manual"
          ariaLabel="Account settings, manual activation"
        />
      </section>
    </div>
  );
}
