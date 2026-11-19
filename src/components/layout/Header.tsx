import { Moon, Sun } from "lucide-react";
import type { PageInfo } from "./pages";

type HeaderProps = {
  page: PageInfo;
  darkMode: boolean;
  onToggleTheme: () => void;
};

export default function Header({ page, darkMode, onToggleTheme }: HeaderProps) {
  const ThemeIcon = darkMode ? Sun : Moon;

  return (
    <header className="header">
      {/* Where you are. The page's main heading is its title in the page intro. */}
      <p className="breadcrumb">
        <span>{page.section}</span>
        <span aria-hidden="true">/</span>
        <span className="breadcrumb-current">{page.title}</span>
      </p>

      <div className="header-actions">
        <span className="version">v1.0.0</span>
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${darkMode ? "light" : "dark"} theme`}
        >
          <ThemeIcon size={16} aria-hidden="true" />
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>
    </header>
  );
}
