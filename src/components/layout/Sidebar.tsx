import { Code } from "lucide-react";
import { pages, REPOSITORY_URL, type Page, type PageInfo } from "./pages";

export type { Page } from "./pages";

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

function NavigationItem({
  info,
  activePage,
  onNavigate,
}: {
  info: PageInfo;
  activePage: Page;
  onNavigate: (page: Page) => void;
}) {
  const isActive = activePage === info.page;
  const Icon = info.icon;

  return (
    <button
      type="button"
      className={`nav-item ${isActive ? "active" : ""}`}
      aria-current={isActive ? "page" : undefined}
      onClick={() => onNavigate(info.page)}
    >
      <span className="nav-icon" aria-hidden="true">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      {info.title}
    </button>
  );
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        {/* Decorative logo tile: the brand name follows as text. */}
        <div className="brand-icon" aria-hidden="true">
          F
        </div>
        <div>
          {/* The brand isn't a section heading, so it stays out of the outline. */}
          <div className="sidebar-brand">FormaUI</div>
          <span>Design System</span>
        </div>
      </div>

      {(["Foundations", "Components"] as const).map((section) => (
        <nav key={section} aria-label={section}>
          <p className="nav-heading">{section.toUpperCase()}</p>
          {pages
            .filter((info) => info.section === section)
            .map((info) => (
              <NavigationItem
                key={info.page}
                info={info}
                activePage={activePage}
                onNavigate={onNavigate}
              />
            ))}
        </nav>
      ))}

      <div className="sidebar-footer">
        <a className="sidebar-link" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
          <Code size={16} aria-hidden="true" />
          Source on GitHub
          <span className="visually-hidden">(opens in a new tab)</span>
        </a>
      </div>
    </aside>
  );
}
