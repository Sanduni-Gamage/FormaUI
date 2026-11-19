import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

// The Overview's figures are written by hand, so this checks them against the
// source: a new token or component makes this fail until the Overview is updated.

const src = join(process.cwd(), "src");
const countTokens = (css: string) => (css.match(/^\s*--[\w-]+\s*:/gm) ?? []).length;

const rawTokens = readdirSync(join(src, "tokens"))
  .filter((file) => file.endsWith(".css"))
  .reduce((total, file) => total + countTokens(readFileSync(join(src, "tokens", file), "utf8")), 0);

// Every semantic token has a light value, in the first block of themes.css.
const themes = readFileSync(join(src, "styles", "themes.css"), "utf8");
const semanticTokens = countTokens(themes.slice(0, themes.indexOf("}")));

const components = readdirSync(join(src, "components", "ui"), { withFileTypes: true }).filter(
  (entry) => entry.isDirectory() && entry.name !== "utils",
).length;

function statCard(title: string) {
  const stats = screen.getByRole("region", { name: "FormaUI at a glance" });
  const card = within(stats).getByText(title).closest("article");
  if (!card) throw new Error(`No stat card titled ${title}`);
  return card;
}

describe("Overview figures", () => {
  it("match the number of design tokens in the CSS", () => {
    render(<App />);

    const card = statCard("Design tokens");
    expect(card).toHaveTextContent(String(rawTokens + semanticTokens));
    expect(card).toHaveTextContent(`${rawTokens} palette and scale tokens, ${semanticTokens} semantic`);
  });

  it("match the number of components in the library", () => {
    render(<App />);

    expect(statCard("Components")).toHaveTextContent(String(components));
  });
});
