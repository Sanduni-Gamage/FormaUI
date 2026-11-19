import {
  BellRing,
  Layers,
  LayoutDashboard,
  MousePointerClick,
  Palette,
  PanelTop,
  Ruler,
  TextCursorInput,
  Type,
  type LucideIcon,
} from "lucide-react";

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

export type PageSection = "Foundations" | "Components";

export interface PageInfo {
  page: Page;
  title: string;
  section: PageSection;
  icon: LucideIcon;
  /** One sentence under the page title. */
  description: string;
  /** A shorter summary for the Overview's "Explore" cards. */
  summary: string;
}

/** Every dashboard page, in navigation order. */
export const pages: PageInfo[] = [
  {
    page: "overview",
    title: "Overview",
    section: "Foundations",
    icon: LayoutDashboard,
    description:
      "An accessible React design system: design tokens, light and dark themes, and 13 tested components.",
    summary: "Start here",
  },
  {
    page: "colors",
    title: "Colors",
    section: "Foundations",
    icon: Palette,
    description:
      "The raw palette, and the semantic tokens that map it onto each theme. Components only use the semantic tokens.",
    summary: "Palettes and semantic tokens",
  },
  {
    page: "typography",
    title: "Typography",
    section: "Foundations",
    icon: Type,
    description: "The type scale and weights that give every page a clear hierarchy.",
    summary: "Type scale and weights",
  },
  {
    page: "spacing",
    title: "Spacing",
    section: "Foundations",
    icon: Ruler,
    description: "A spacing scale built on multiples of four, and the border radius scale.",
    summary: "Spacing and radius scales",
  },
  {
    page: "buttons",
    title: "Buttons",
    section: "Components",
    icon: MousePointerClick,
    description: "Actions in four variants and three sizes, with disabled and loading states.",
    summary: "Variants, sizes and states",
  },
  {
    page: "forms",
    title: "Form Elements",
    section: "Components",
    icon: TextCursorInput,
    description:
      "Native form controls with visible labels, linked hints and errors, and full keyboard support.",
    summary: "Input, Checkbox, Radio, Select, Switch",
  },
  {
    page: "feedback",
    title: "Feedback",
    section: "Components",
    icon: BellRing,
    description:
      "Messages that tell people what happened, announced to screen readers at the right urgency.",
    summary: "Alert, Badge and Toast",
  },
  {
    page: "overlays",
    title: "Overlays",
    section: "Components",
    icon: Layers,
    description:
      "Content above the page, with predictable focus: it moves in on open and back to the trigger on close.",
    summary: "Modal, Tooltip and Popover",
  },
  {
    page: "navigation",
    title: "Navigation",
    section: "Components",
    icon: PanelTop,
    description:
      "Tabs with arrow-key navigation, automatic or manual activation, and disabled tabs skipped.",
    summary: "Tabs",
  },
];

export const pageInfo = Object.fromEntries(pages.map((info) => [info.page, info])) as Record<
  Page,
  PageInfo
>;

export const REPOSITORY_URL = "https://github.com/Sanduni-Gamage/FormaUI";
