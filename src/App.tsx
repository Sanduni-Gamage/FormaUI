import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import PageIntro from "./components/layout/PageIntro";
import { pageInfo, type Page } from "./components/layout/pages";

import Header from "./components/layout/Header";
import ButtonShowcase from "./components/dashboard/ButtonShowcase";
import { FeedbackShowcase } from "./components/dashboard/FeedbackShowcase";
import { OverlaysShowcase } from "./components/dashboard/OverlaysShowcase";
import { NavigationShowcase } from "./components/dashboard/NavigationShowcase";
import { OverviewPage } from "./components/dashboard/OverviewPage";
import {
  ColorFoundations,
  SpacingFoundations,
  TypographyFoundations,
} from "./components/dashboard/Foundations";
import { Input } from "./components/ui/Input";
import { Checkbox } from "./components/ui/Checkbox";
import { RadioGroup } from "./components/ui/RadioGroup";
import { Select } from "./components/ui/Select";
import { Switch } from "./components/ui/Switch";

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

function PageContent({
  page,
  onNavigate,
}: {
  page: Page;
  onNavigate: (page: Page) => void;
}) {
  switch (page) {
    case "overview":
      return <OverviewPage onNavigate={onNavigate} />;

    case "colors":
      return <ColorFoundations />;

    case "buttons":
      return <ButtonShowcase />;

    case "typography":
      return <TypographyFoundations />;

    case "spacing":
      return <SpacingFoundations />;

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
  const page = pageInfo[activePage];

  return (
    <div className="app-shell" data-theme={darkMode ? "dark" : "light"}>
      {/* Lets keyboard users jump past the navigation (WCAG 2.4.1). */}
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      <div className="main-content">
        <Header
          page={page}
          darkMode={darkMode}
          onToggleTheme={() => setDarkMode((current) => !current)}
        />

        <main id="main-content" className="dashboard-content" tabIndex={-1}>
          {/* The Overview's hero is its intro, with the page title inside it. */}
          {activePage !== "overview" && <PageIntro page={page} />}
          <PageContent page={activePage} onNavigate={setActivePage} />
        </main>
      </div>
    </div>
  );
}

export default App;
