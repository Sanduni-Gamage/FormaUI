import type { PageInfo } from "./pages";

/** The top of every page: its section, its title (the page's one h1) and a summary. */
export default function PageIntro({ page }: { page: PageInfo }) {
  return (
    <div className="page-intro">
      <p className="eyebrow">{page.section}</p>
      <h1>{page.title}</h1>
      <p className="page-description">{page.description}</p>
    </div>
  );
}
