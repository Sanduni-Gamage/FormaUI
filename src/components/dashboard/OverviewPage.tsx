import {
  Accessibility,
  CircleCheck,
  Component,
  ExternalLink,
  Layers,
  SunMoon,
} from "lucide-react";
import { Button } from "../ui/Button";
import StatCard from "./StatCard";
import { pages, REPOSITORY_URL, type Page } from "../layout/pages";

const quality = [
  {
    title: "Keyboard and screen reader support",
    text: "Native elements first, a visible focus indicator on every control, and ARIA only where HTML has no equivalent.",
  },
  {
    title: "Audited against WCAG 2.2 AA",
    text: "15 criteria assessed: 14 verified and 1 partially verified, with every issue and fix documented.",
  },
  {
    title: "Tested at three levels",
    text: "Unit tests with axe checks, browser tests in both themes, and visual snapshots in Chromatic.",
  },
  {
    title: "Checked on every pull request",
    text: "GitHub Actions runs linting, type checks, all tests and both builds.",
  },
];

export function OverviewPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <>
      <section className="hero" aria-labelledby="overview-title">
        <div>
          <h1 id="overview-title" className="eyebrow hero-eyebrow">
            Overview
          </h1>
          <p className="hero-title">
            Design with consistency.
          </p>
          <p className="hero-text">
            FormaUI gives product teams accessible, reusable building blocks: one set of
            tokens, two themes, and components that behave the same way everywhere.
          </p>
          <div className="hero-actions">
            <Button onClick={() => onNavigate("buttons")}>Explore components</Button>
            <a className="link-button" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
              View source on GitHub
              <ExternalLink size={14} aria-hidden="true" />
              <span className="visually-hidden">(opens in a new tab)</span>
            </a>
          </div>
        </div>
        <span className="version-pill">
          <span aria-hidden="true">●</span> Version 1.0
        </span>
      </section>

      <section className="stats-grid" aria-label="FormaUI at a glance">
        <StatCard
          title="Design tokens"
          value="87"
          description="57 palette and scale tokens, 30 semantic"
          icon={Layers}
        />
        <StatCard
          title="Components"
          value="13"
          description="Typed, tested and documented"
          icon={Component}
        />
        <StatCard title="Themes" value="2" description="Light and dark modes" icon={SunMoon} />
        <StatCard
          title="Accessibility"
          value="AA"
          description="WCAG 2.2 target, audited"
          icon={Accessibility}
        />
      </section>

      <div className="overview-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Explore the system</h2>
              <p>Foundations first, then the components built on them.</p>
            </div>
          </div>

          {(["Foundations", "Components"] as const).map((section) => (
            <div className="explore-group" key={section}>
              <h3>{section}</h3>
              <ul className="explore-list">
                {pages
                  .filter((info) => info.section === section && info.page !== "overview")
                  .map((info) => {
                    const Icon = info.icon;
                    return (
                      <li key={info.page}>
                        <button
                          type="button"
                          className="explore-item"
                          onClick={() => onNavigate(info.page)}
                        >
                          <span className="nav-icon" aria-hidden="true">
                            <Icon size={18} strokeWidth={1.75} />
                          </span>
                          <span>
                            <strong>{info.title}</strong>
                            <span className="explore-description">{info.summary}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Built-in quality</h2>
              <p>Accessibility and consistency are checked, not assumed.</p>
            </div>
          </div>

          <ul className="quality-list">
            {quality.map((item) => (
              <li key={item.title}>
                <span className="nav-icon" aria-hidden="true">
                  <CircleCheck size={18} strokeWidth={2} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
