export type Page =
  | "overview"
  | "colors"
  | "typography"
  | "spacing"
  | "buttons"
  | "forms"
  | "feedback"
  | "overlays"
  | "navigation";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const foundationNavigation: {
  label: string;
  page: Page;
  icon: string;
}[] = [
  { label: "Overview", page: "overview", icon: "◫" },
  { label: "Colors", page: "colors", icon: "◉" },
  { label: "Typography", page: "typography", icon: "T" },
  { label: "Spacing", page: "spacing", icon: "⊞" },
];

const componentNavigation: {
  label: string;
  page: Page;
  icon: string;
}[] = [
  { label: "Buttons", page: "buttons", icon: "▣" },
  { label: "Form Elements", page: "forms", icon: "☷" },
  { label: "Feedback", page: "feedback", icon: "◎" },
  { label: "Overlays", page: "overlays", icon: "▢" },
  { label: "Navigation", page: "navigation", icon: "⊟" },
];

interface NavigationItemProps {
  label: string;
  page: Page;
  icon: string;
  activePage: Page;
  onNavigate: (page: Page) => void;
}

function NavigationItem({
  label,
  page,
  icon,
  activePage,
  onNavigate,
}: NavigationItemProps) {
  const isActive = activePage === page;

  return (
    <button
      type="button"
      className={`nav-item ${isActive ? "active" : ""}`}
      aria-current={isActive ? "page" : undefined}
      onClick={() => onNavigate(page)}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </button>
  );
}

export default function Sidebar({
  activePage,
  onNavigate,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        {/* Decorative logo tile: the brand name follows as text. */}
        <div className="brand-icon" aria-hidden="true">F</div>
        <div>
          {/* The brand isn't a section heading, so it stays out of the outline. */}
          <div className="sidebar-brand">FormaUI</div>
          <span>Design System</span>
        </div>
      </div>

      <p className="nav-heading">FOUNDATIONS</p>

      {foundationNavigation.map((item) => (
        <NavigationItem
          key={item.page}
          {...item}
          activePage={activePage}
          onNavigate={onNavigate}
        />
      ))}

      <p className="nav-heading">COMPONENTS</p>

      {componentNavigation.map((item) => (
        <NavigationItem
          key={item.page}
          {...item}
          activePage={activePage}
          onNavigate={onNavigate}
        />
      ))}

      <div className="sidebar-footer">
        <span className="status-dot" />
        Design system v1.0
      </div>
    </aside>
  );
}
