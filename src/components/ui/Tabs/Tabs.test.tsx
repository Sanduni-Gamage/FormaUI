import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it, expect, vi } from "vitest";
import { Tabs, type TabItem } from "./Tabs";

const sampleTabs: TabItem[] = [
  {
    id: "overview",
    label: "Overview",
    content: <p>Overview content</p>,
  },
  {
    id: "details",
    label: "Details",
    content: <p>Details content</p>,
  },
  {
    id: "settings",
    label: "Settings",
    content: <p>Settings content</p>,
  },
];

describe("Tabs", () => {
  it("renders all tab labels", () => {
    render(<Tabs tabs={sampleTabs} ariaLabel="Example tabs" />);

    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Details" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Settings" })).toBeInTheDocument();
  });

  it("selects the first enabled tab by default", () => {
    render(<Tabs tabs={sampleTabs} ariaLabel="Example tabs" />);

    expect(screen.getByRole("tab", { name: "Overview" }))
      .toHaveAttribute("aria-selected", "true");
  });

  it("supports defaultValue", () => {
    render(
      <Tabs
        tabs={sampleTabs}
        defaultValue="details"
        ariaLabel="Example tabs"
      />,
    );

    expect(screen.getByRole("tab", { name: "Details" }))
      .toHaveAttribute("aria-selected", "true");
  });

  it("displays only the selected panel content", () => {
    render(<Tabs tabs={sampleTabs} ariaLabel="Example tabs" />);

    expect(screen.getByText("Overview content")).toBeInTheDocument();
    expect(screen.queryByText("Details content")).not.toBeInTheDocument();
  });

  it("changes selection when a tab is clicked", () => {
    render(<Tabs tabs={sampleTabs} ariaLabel="Example tabs" />);

    fireEvent.click(screen.getByRole("tab", { name: "Details" }));

    expect(screen.getByRole("tab", { name: "Details" }))
      .toHaveAttribute("aria-selected", "true");

    expect(screen.getByText("Details content")).toBeInTheDocument();
  });

  it("calls onValueChange when selection changes", () => {
    const onValueChange = vi.fn();

    render(
      <Tabs
        tabs={sampleTabs}
        onValueChange={onValueChange}
        ariaLabel="Example tabs"
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Settings" }));

    expect(onValueChange).toHaveBeenCalledWith("settings");
  });

  it("supports controlled selection", () => {
    const onValueChange = vi.fn();

    render(
      <Tabs
        tabs={sampleTabs}
        value="overview"
        onValueChange={onValueChange}
        ariaLabel="Example tabs"
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Details" }));

    expect(onValueChange).toHaveBeenCalledWith("details");

    // The parent has not updated the controlled value.
    expect(screen.getByRole("tab", { name: "Overview" }))
      .toHaveAttribute("aria-selected", "true");
  });

  it("supports ArrowRight in horizontal mode", () => {
    render(<Tabs tabs={sampleTabs} ariaLabel="Example tabs" />);

    const overview = screen.getByRole("tab", { name: "Overview" });
    overview.focus();

    fireEvent.keyDown(overview, { key: "ArrowRight" });

    expect(screen.getByRole("tab", { name: "Details" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Details" }))
      .toHaveAttribute("aria-selected", "true");
  });

  it("supports ArrowLeft in horizontal mode", () => {
    render(
      <Tabs
        tabs={sampleTabs}
        defaultValue="details"
        ariaLabel="Example tabs"
      />,
    );

    const details = screen.getByRole("tab", { name: "Details" });
    details.focus();

    fireEvent.keyDown(details, { key: "ArrowLeft" });

    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
  });

  it("supports ArrowDown in vertical mode", () => {
    render(
      <Tabs
        tabs={sampleTabs}
        orientation="vertical"
        ariaLabel="Vertical tabs"
      />,
    );

    const overview = screen.getByRole("tab", { name: "Overview" });
    overview.focus();

    fireEvent.keyDown(overview, { key: "ArrowDown" });

    expect(screen.getByRole("tab", { name: "Details" })).toHaveFocus();
  });

  it("supports Home and End keys", () => {
    render(<Tabs tabs={sampleTabs} ariaLabel="Example tabs" />);

    const overview = screen.getByRole("tab", { name: "Overview" });
    overview.focus();

    fireEvent.keyDown(overview, { key: "End" });

    expect(screen.getByRole("tab", { name: "Settings" })).toHaveFocus();
  });

  it("skips disabled tabs during keyboard navigation", () => {
    const tabs: TabItem[] = [
      sampleTabs[0],
      { ...sampleTabs[1], disabled: true },
      sampleTabs[2],
    ];

    render(<Tabs tabs={tabs} ariaLabel="Example tabs" />);

    const overview = screen.getByRole("tab", { name: "Overview" });
    overview.focus();

    fireEvent.keyDown(overview, { key: "ArrowRight" });

    expect(screen.getByRole("tab", { name: "Settings" })).toHaveFocus();
  });

  it("supports manual activation", () => {
    render(
      <Tabs
        tabs={sampleTabs}
        activationMode="manual"
        ariaLabel="Manual tabs"
      />,
    );

    const overview = screen.getByRole("tab", { name: "Overview" });
    overview.focus();

    fireEvent.keyDown(overview, { key: "ArrowRight" });

    expect(screen.getByRole("tab", { name: "Details" })).toHaveFocus();

    expect(screen.getByRole("tab", { name: "Overview" }))
      .toHaveAttribute("aria-selected", "true");

    fireEvent.keyDown(screen.getByRole("tab", { name: "Details" }), {
      key: "Enter",
    });

    expect(screen.getByRole("tab", { name: "Details" }))
      .toHaveAttribute("aria-selected", "true");
  });

  it("exposes the tablist orientation", () => {
    render(
      <Tabs
        tabs={sampleTabs}
        orientation="vertical"
        ariaLabel="Vertical tabs"
      />,
    );

    expect(screen.getByRole("tablist"))
      .toHaveAttribute("aria-orientation", "vertical");
  });

  it("has accessible tab and panel relationships", () => {
    render(<Tabs tabs={sampleTabs} ariaLabel="Example tabs" />);

    const selectedTab = screen.getByRole("tab", { name: "Overview" });
    const selectedPanel = screen.getByRole("tabpanel");

    expect(selectedTab).toHaveAttribute(
      "aria-controls",
      selectedPanel.id,
    );

    expect(selectedPanel).toHaveAttribute(
      "aria-labelledby",
      selectedTab.id,
    );
  });

  it("does not select a disabled tab when clicked", () => {
    const tabs: TabItem[] = [
      sampleTabs[0],
      { ...sampleTabs[1], disabled: true },
      sampleTabs[2],
    ];

    render(<Tabs tabs={tabs} ariaLabel="Example tabs" />);

    const disabledTab = screen.getByRole("tab", { name: "Details" });

    expect(disabledTab).toBeDisabled();
  });

  it("handles an empty tab list", () => {
    render(<Tabs tabs={[]} ariaLabel="Empty tabs" />);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });

  // The two edge cases from the review, plus extra coverage.

  it("follows a controlled value that changes externally", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <>
        <button type="button">Before</button>
        <Tabs tabs={sampleTabs} value="overview" ariaLabel="Example tabs" />
      </>,
    );

    // Visit the tab list, then leave it.
    await user.tab();
    await user.tab();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveFocus();
    await user.tab({ shift: true });

    rerender(
      <>
        <button type="button">Before</button>
        <Tabs tabs={sampleTabs} value="settings" ariaLabel="Example tabs" />
      </>,
    );

    expect(screen.getByRole("tab", { name: "Settings" }))
      .toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Settings content")).toBeInTheDocument();

    // Tab now lands on the newly selected tab, not the previously focused one.
    await user.tab();
    expect(screen.getByRole("tab", { name: "Settings" })).toHaveFocus();
  });

  it("keeps the Tab stop on the selection after a click that doesn't move focus", () => {
    // fireEvent.click doesn't focus the button, like a click in Safari.
    const { rerender } = render(
      <Tabs tabs={sampleTabs} value="overview" ariaLabel="Example tabs" />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Details" }));

    rerender(
      <Tabs tabs={sampleTabs} value="settings" ariaLabel="Example tabs" />,
    );

    expect(
      screen.getAllByRole("tab").filter((tab) => tab.tabIndex === 0),
    ).toEqual([screen.getByRole("tab", { name: "Settings" })]);
  });

  it("moves focus to the new tab when its panel had focus and the parent changes the tab", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <Tabs tabs={sampleTabs} value="overview" ariaLabel="Example tabs" />,
    );

    // Tab from the selected tab into its panel.
    await user.tab();
    await user.tab();
    expect(screen.getByRole("tabpanel")).toHaveFocus();

    rerender(<Tabs tabs={sampleTabs} value="details" ariaLabel="Example tabs" />);

    // The old panel is hidden; focus goes to the newly selected tab, not the body.
    expect(screen.getByRole("tab", { name: "Details" })).toHaveFocus();
  });

  it("leaves focus alone when the parent changes the tab while focus is elsewhere", async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <>
        <Tabs tabs={sampleTabs} value="overview" ariaLabel="Example tabs" />
        <button type="button">Elsewhere</button>
      </>,
    );

    await user.tab();
    await user.tab();
    await user.tab(); // panel, then out to "Elsewhere"
    expect(screen.getByRole("button", { name: "Elsewhere" })).toHaveFocus();

    rerender(
      <>
        <Tabs tabs={sampleTabs} value="details" ariaLabel="Example tabs" />
        <button type="button">Elsewhere</button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Elsewhere" })).toHaveFocus();
  });

  it("selects another enabled tab when the selected tab becomes disabled", () => {
    const { rerender } = render(
      <Tabs tabs={sampleTabs} defaultValue="details" ariaLabel="Example tabs" />,
    );

    expect(screen.getByRole("tab", { name: "Details" }))
      .toHaveAttribute("aria-selected", "true");

    rerender(
      <Tabs
        tabs={sampleTabs.map((tab) =>
          tab.id === "details" ? { ...tab, disabled: true } : tab,
        )}
        defaultValue="details"
        ariaLabel="Example tabs"
      />,
    );

    expect(screen.getByRole("tab", { name: "Details" }))
      .toHaveAttribute("aria-selected", "false");
    expect(screen.getByRole("tab", { name: "Overview" }))
      .toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Overview content")).toBeInTheDocument();
    expect(screen.queryByText("Details content")).not.toBeInTheDocument();
    // Exactly one tab can be reached with Tab: the new selection.
    expect(
      screen.getAllByRole("tab").filter((tab) => tab.tabIndex === 0),
    ).toEqual([screen.getByRole("tab", { name: "Overview" })]);
  });

  it("falls back to an enabled tab when the controlled value is disabled", () => {
    render(
      <Tabs
        tabs={[sampleTabs[0], { ...sampleTabs[1], disabled: true }]}
        value="details"
        ariaLabel="Example tabs"
      />,
    );

    expect(screen.getByRole("tab", { name: "Overview" }))
      .toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Details" }))
      .toHaveAttribute("aria-selected", "false");
  });

  it("activates with Space in manual mode", async () => {
    const user = userEvent.setup();

    render(
      <Tabs tabs={sampleTabs} activationMode="manual" ariaLabel="Manual tabs" />,
    );

    await user.click(screen.getByRole("tab", { name: "Overview" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("Overview content")).toBeInTheDocument();

    await user.keyboard(" ");

    expect(screen.getByRole("tab", { name: "Details" }))
      .toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Details content")).toBeInTheDocument();
  });

  it("ignores Left and Right in vertical mode", () => {
    render(
      <Tabs
        tabs={sampleTabs}
        orientation="vertical"
        ariaLabel="Vertical tabs"
      />,
    );

    const overview = screen.getByRole("tab", { name: "Overview" });
    overview.focus();

    fireEvent.keyDown(overview, { key: "ArrowRight" });

    expect(overview).toHaveFocus();
  });

  it("has no automated accessibility violations", async () => {
    const { container } = render(
      <Tabs
        tabs={[sampleTabs[0], { ...sampleTabs[1], disabled: true }, sampleTabs[2]]}
        ariaLabel="Example tabs"
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
