import { Button } from "../ui/Button";

export default function ButtonShowcase() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Button components</h2>
          <p>Interactive reusable buttons from FormaUI</p>
        </div>
        <span className="panel-link">Component library</span>
      </div>

      <div className="button-showcase">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="danger">Danger</Button>
        <Button disabled>Disabled</Button>
      </div>

      <div className="button-showcase" style={{ marginTop: 20 }}>
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>

      <div className="button-showcase" style={{ marginTop: 20 }}>
        <Button isLoading>Save changes</Button>
      </div>
    </section>
  );
}
