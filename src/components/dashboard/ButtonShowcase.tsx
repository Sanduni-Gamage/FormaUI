import { Button } from "../ui/Button";

export default function ButtonShowcase() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Button components</h2>
          <p>Four variants for different levels of emphasis, in three sizes.</p>
        </div>
      </div>

      <div className="demo-group">
        <h3 className="demo-label">Variants</h3>
        <div className="button-showcase">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>

      <div className="demo-group">
        <h3 className="demo-label">Sizes</h3>
        <div className="button-showcase">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="demo-group">
        <h3 className="demo-label">States</h3>
        <div className="button-showcase">
          <Button disabled>Disabled</Button>
          <Button isLoading>Save changes</Button>
        </div>
      </div>
    </section>
  );
}
