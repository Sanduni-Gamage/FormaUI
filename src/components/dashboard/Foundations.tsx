import { useEffect, useRef, type CSSProperties } from "react";

/**
 * Shows the resolved value of a CSS custom property, read from the page at runtime,
 * so the dashboard can never drift from the token files. `theme` reads the value
 * inside a light or dark theme scope, whatever theme the page is in.
 */
function TokenValue({ token, theme }: { token: string; theme?: "light" | "dark" }) {
  // The value is read from a hidden probe inside the requested theme scope. The
  // visible text stays in the page's own theme, so it keeps its contrast.
  const probeRef = useRef<HTMLSpanElement>(null);
  const outputRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const probe = probeRef.current;
    const output = outputRef.current;
    if (probe && output) {
      output.textContent = getComputedStyle(probe).getPropertyValue(token).trim();
    }
  }, [token, theme]);

  return (
    <span className="token-value">
      <span ref={probeRef} data-theme={theme} hidden />
      <span ref={outputRef} />
    </span>
  );
}

function Swatch({ token, style }: { token: string; style?: CSSProperties }) {
  return (
    <span
      className="token-swatch"
      style={{ background: `var(${token})`, ...style }}
      aria-hidden="true"
    />
  );
}

const palettes = [
  {
    title: "Brand",
    description: "Primary blue, from tints to deep shades.",
    tokens: [50, 100, 200, 300, 500, 600, 700, 900].map((step) => `--color-primary-${step}`),
  },
  {
    title: "Neutral",
    description: "Slate greys for surfaces, text and borders.",
    tokens: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
      (step) => `--color-neutral-${step}`,
    ),
  },
  {
    title: "Status",
    description:
      "Base colours for fills and borders, -dark for small text on light tints, -light for dark surfaces.",
    tokens: [
      "--color-success",
      "--color-success-dark",
      "--color-success-light",
      "--color-warning",
      "--color-warning-dark",
      "--color-warning-light",
      "--color-danger",
      "--color-danger-dark",
      "--color-danger-light",
      "--color-info",
      "--color-info-light",
    ],
  },
];

const semanticGroups = [
  {
    title: "Surfaces",
    tokens: [
      ["--surface-primary", "Cards, panels and inputs"],
      ["--surface-secondary", "Page background, hover and disabled fills"],
      ["--surface-accent", "Selected navigation item, brand labels"],
    ],
  },
  {
    title: "Text",
    tokens: [
      ["--text-primary", "Body text and headings"],
      ["--text-secondary", "Hints, descriptions and captions"],
      ["--text-accent", "Links, selected tabs"],
      ["--text-accent-hover", "Hovered links"],
      ["--text-on-accent", "Text on --surface-accent"],
      ["--text-danger", "Error messages"],
      ["--text-success", "Success text and icons"],
      ["--text-warning", "Warning text and icons"],
      ["--text-info", "Information text and icons"],
    ],
  },
  {
    title: "Borders",
    tokens: [
      ["--border-default", "Dividers, cards, outline buttons"],
      ["--border-control", "Form control outlines (3:1 contrast)"],
      ["--border-danger", "Fields with an error"],
      ["--border-success", "Success alerts"],
      ["--border-warning", "Warning alerts"],
      ["--border-info", "Information alerts"],
    ],
  },
  {
    title: "Actions",
    tokens: [
      ["--action-primary-bg", "Primary button"],
      ["--action-primary-bg-hover", "Primary button, hovered"],
      ["--action-primary-text", "Text on a primary button"],
      ["--action-secondary-bg", "Secondary button"],
      ["--action-secondary-bg-hover", "Secondary button, hovered"],
      ["--action-secondary-text", "Text on a secondary button"],
      ["--action-danger-bg", "Danger button"],
      ["--action-danger-bg-hover", "Danger button, hovered"],
      ["--action-danger-text", "Text on a danger button"],
    ],
  },
  {
    title: "Controls and focus",
    tokens: [
      ["--control-checked", "Checked Checkbox, Radio and Switch"],
      ["--control-mark", "Tick, dot and Switch thumb"],
      ["--focus-ring", "Keyboard focus indicator"],
    ],
  },
];

export function ColorFoundations() {
  return (
    <>
      {palettes.map((palette) => (
        <section className="panel" key={palette.title}>
          <div className="panel-heading">
            <div>
              <h2>{palette.title} palette</h2>
              <p>{palette.description}</p>
            </div>
          </div>

          <ul className="swatch-grid">
            {palette.tokens.map((token) => (
              <li key={token}>
                <Swatch token={token} />
                <code>{token}</code>
                <TokenValue token={token} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2 id="semantic-tokens-heading">Semantic tokens</h2>
            <p>
              What components use. Each token maps to a palette colour per theme, so
              switching theme restyles every component.
            </p>
          </div>
        </div>

        <table className="token-table" aria-labelledby="semantic-tokens-heading">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Light</th>
              <th scope="col">Dark</th>
            </tr>
          </thead>
          {semanticGroups.map((group) => (
            <tbody key={group.title}>
              <tr>
                <th scope="rowgroup" colSpan={3} className="token-group">
                  {group.title}
                </th>
              </tr>
              {group.tokens.map(([token, role]) => (
                <tr key={token}>
                  <td>
                    <code>{token}</code>
                    <span className="token-role">{role}</span>
                  </td>
                  {(["light", "dark"] as const).map((theme) => (
                    <td key={theme}>
                      <span className="token-sample" data-theme={theme}>
                        <Swatch token={token} />
                      </span>
                      <TokenValue token={token} theme={theme} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </section>
    </>
  );
}

const fontSizes = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];
const fontWeights = ["normal", "medium", "semibold", "bold"];

export function TypographyFoundations() {
  return (
    <>
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

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Font sizes</h2>
            <p>
              Family: <TokenValue token="--font-family-base" />
            </p>
          </div>
        </div>

        <ul className="token-list">
          {fontSizes.map((size) => {
            const token = `--font-size-${size}`;
            return (
              <li key={token}>
                <code>{token}</code>
                <TokenValue token={token} />
                <span className="token-preview" style={{ fontSize: `var(${token})` }}>
                  The quick brown fox
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Font weights</h2>
          </div>
        </div>

        <ul className="token-list">
          {fontWeights.map((weight) => {
            const token = `--font-weight-${weight}`;
            return (
              <li key={token}>
                <code>{token}</code>
                <TokenValue token={token} />
                <span className="token-preview" style={{ fontWeight: `var(${token})` }}>
                  The quick brown fox
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}

const spacingSteps = [1, 2, 3, 4, 5, 6, 8, 10, 12];
const radii = ["sm", "md", "lg", "xl", "full"];

export function SpacingFoundations() {
  return (
    <>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Spacing foundations</h2>
            <p>Our spacing scale is based on multiples of four.</p>
          </div>
        </div>

        <ul className="token-list">
          {spacingSteps.map((step) => {
            const token = `--spacing-${step}`;
            return (
              <li key={token}>
                <code>{token}</code>
                <TokenValue token={token} />
                <span
                  className="spacing-block"
                  style={{ width: `var(${token})` }}
                  aria-hidden="true"
                />
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Border radius</h2>
            <p>Corner rounding, from subtle to fully round.</p>
          </div>
        </div>

        <ul className="swatch-grid">
          {radii.map((radius) => {
            const token = `--radius-${radius}`;
            return (
              <li key={token}>
                <Swatch
                  token="--surface-accent"
                  style={{
                    borderRadius: `var(${token})`,
                    border: "2px solid var(--text-accent)",
                    width: 64,
                    height: 64,
                  }}
                />
                <code>{token}</code>
                <TokenValue token={token} />
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
