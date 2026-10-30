type HeaderProps = {
  pageTitle: string;
  darkMode: boolean;
  onToggleTheme: () => void;
};

export default function Header({
  pageTitle,
  darkMode,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="header">
      <div>
        <span className="breadcrumb">Design System /</span>{" "}
        {/* The page's one main heading; styled to read as part of the breadcrumb. */}
        <h1 className="header-page-title">{pageTitle}</h1>
      </div>

      <div className="header-actions">
        <span className="version">v1.0.0</span>
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${darkMode ? "light" : "dark"} theme`}
        >
          {darkMode ? "☀ Light" : "☾ Dark"}
        </button>
      </div>
    </header>
  );
}
