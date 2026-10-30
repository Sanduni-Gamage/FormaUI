import { useState } from "react";

import Sidebar, {
  type Page,
} from "./components/layout/Sidebar";

import Header from "./components/layout/Header";
import StatCard from "./components/dashboard/StatCard";
import ColorPalette from "./components/dashboard/ColorPalette";
import ButtonShowcase from "./components/dashboard/ButtonShowcase";
import { FeedbackShowcase } from "./components/dashboard/FeedbackShowcase";
import { OverlaysShowcase } from "./components/dashboard/OverlaysShowcase";
import { NavigationShowcase } from "./components/dashboard/NavigationShowcase";
import { Input } from "./components/ui/Input";
import { Checkbox } from "./components/ui/Checkbox";
import { RadioGroup } from "./components/ui/RadioGroup";
import { Select } from "./components/ui/Select";
import { Switch } from "./components/ui/Switch";

const pageTitles: Record<Page, string> = {
  overview: "Overview",
  colors: "Colors",
  typography: "Typography",
  spacing: "Spacing",
  buttons: "Buttons",
  forms: "Form Elements",
  feedback: "Feedback",
  navigation: "Navigation",
  overlays: "Overlays",
};

function FormsShowcase() {
  return (
    <div className="showcase-grid">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Input</h2>
            <p>Text fields and validation states</p>
          </div>
        </div>

        <div className="showcase-form-field">
          <Input
            label="Full name"
            placeholder="Enter your name"
            hint="Enter your preferred name."
          />

          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            required
          />

          <Input
            label="Email with error"
            type="email"
            value="invalid-email"
            readOnly
            error="Please enter a valid email address."
          />
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Checkbox</h2>
            <p>Selection and preference controls</p>
          </div>
        </div>

        <div className="showcase-form-field">
          <Checkbox label="Accept terms and conditions" />

          <Checkbox
            label="Receive product updates"
            hint="You can change this preference later."
          />

          <Checkbox
            label="Required agreement"
            required
          />

          <Checkbox
            label="Invalid selection"
            error="This selection is required."
          />

          <Checkbox
            label="Disabled option"
            disabled
          />
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Radio Group</h2>
            <p>Single-choice selection controls</p>
          </div>
        </div>

        <div className="showcase-form-field">
          <RadioGroup
            label="Preferred contact method"
            name="contact-method"
            options={[
              { label: "Email", value: "email" },
              { label: "Phone", value: "phone" },
              { label: "SMS", value: "sms" },
            ]}
            defaultValue="email"
            hint="Choose how you would like us to contact you."
          />

          <RadioGroup
            label="Choose a plan"
            name="plan"
            options={[
              { label: "Basic", value: "basic" },
              { label: "Professional", value: "professional" },
              { label: "Enterprise", value: "enterprise" },
            ]}
            orientation="horizontal"
          />

          <RadioGroup
            label="Account type"
            name="account-type"
            options={[
              { label: "Personal", value: "personal" },
              { label: "Business", value: "business" },
            ]}
            error="Please select an account type."
            required
          />

          <RadioGroup
            label="Availability"
            options={[
              { label: "Available", value: "available" },
              { label: "Unavailable", value: "unavailable" },
            ]}
            disabled
          />
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Select</h2>
            <p>Dropdown selection controls</p>
          </div>
        </div>

        <div className="showcase-form-field">
          <Select
            label="Country"
            options={[
              { label: "New Zealand", value: "nz" },
              { label: "Australia", value: "au" },
              { label: "United Kingdom", value: "uk" },
            ]}
            placeholder="Choose your country"
            hint="Select your country of residence."
          />

          <Select
            label="Account type"
            options={[
              { label: "Personal", value: "personal" },
              { label: "Business", value: "business" },
            ]}
            required
          />

          <Select
            label="Subscription plan"
            options={[
              { label: "Basic", value: "basic" },
              { label: "Professional", value: "pro" },
              { label: "Enterprise", value: "enterprise" },
            ]}
            defaultValue="pro"
          />

          <Select
            label="Invalid selection"
            options={[
              { label: "Option one", value: "one" },
              { label: "Option two", value: "two" },
            ]}
            error="Please choose an option."
          />

          <Select
            label="Disabled selection"
            options={[
              { label: "New Zealand", value: "nz" },
              { label: "Australia", value: "au" },
            ]}
            defaultValue="nz"
            disabled
          />
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Switch</h2>
            <p>Toggle settings between enabled and disabled states.</p>
          </div>
        </div>

        <div className="showcase-form-field">
          <Switch label="Email notifications" defaultChecked />
          <Switch label="SMS notifications" />
          <Switch
            label="Marketing updates"
            hint="Receive occasional product updates."
          />
          <Switch label="Unavailable setting" disabled />
        </div>
      </section>
    </div>
  );
}

function PageContent({ page }: { page: Page }) {
  switch (page) {
    case "overview":
      return (
        <>
          <section className="welcome-section">
            <div>
              <span className="eyebrow">YOUR DESIGN SYSTEM</span>
              {/* A tagline, not a heading: the page's h1 is the title in the header. */}
              <p className="welcome-title">Design with consistency.</p>
              <p>
                Build accessible, reusable and beautiful
                user interfaces with FormaUI.
              </p>
            </div>
            <span className="version-pill">
              <span aria-hidden="true">●</span> Version 1.0
            </span>
          </section>

          <section className="stats-grid">
            <StatCard
              title="Design tokens"
              value="30+"
              description="Foundation variables"
            />
            <StatCard
              title="Components"
              value="12"
              description="Planned reusable components"
            />
            <StatCard
              title="Themes"
              value="2"
              description="Light and dark modes"
            />
            <StatCard
              title="Accessibility"
              value="AA"
              description="WCAG 2.2 target"
            />
          </section>

          <ColorPalette />
          <ButtonShowcase />
        </>
      );

    case "colors":
      return <ColorPalette />;

    case "buttons":
      return <ButtonShowcase />;

    case "typography":
      return (
        <section className="panel typography-panel">
          <h2>Typography foundations</h2>
          <p>Consistent typography creates a clear visual hierarchy.</p>
          {/* Visual samples of heading styles, deliberately not real headings,
              so they don't become part of the page's outline. */}
          <div className="type-sample type-sample-h1">Heading 1: Design better.</div>
          <div className="type-sample type-sample-h2">Heading 2: Reusable components.</div>
          <div className="type-sample type-sample-h3">Heading 3: Consistent interfaces.</div>
          <p>Body text: Build accessible interfaces for everyone.</p>
          <small>Caption text: Supporting information.</small>
        </section>
      );

    case "spacing":
      return (
        <section className="panel">
          <h2>Spacing foundations</h2>
          <p>Our spacing scale is based on multiples of four.</p>
          {[1, 2, 3, 4, 6, 8, 10, 12].map((value) => (
            <div className="spacing-example" key={value}>
              <code>--spacing-{value}</code>
              <div
                className="spacing-block"
                style={{
                  width: `var(--spacing-${value})`,
                }}
              />
            </div>
          ))}
        </section>
      );

    case "forms":
      return <FormsShowcase />;

    case "feedback":
      return <FeedbackShowcase />;

    case "overlays":
      return <OverlaysShowcase />;

    case "navigation":
      return <NavigationShowcase />;

    default:
      return null;
  }
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState<Page>("overview");

  return (
    <div
      className="app-shell"
      data-theme={darkMode ? "dark" : "light"}
    >
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="main-content">
        <Header
          pageTitle={pageTitles[activePage]}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((current) => !current)}
        />

        <div className="dashboard-content">
          <PageContent page={activePage} />
        </div>
      </main>
    </div>
  );
}

export default App;
