const colors = [
  {
    name: "Primary",
    token: "--color-primary-600",
    description: "Primary actions and links",
  },
  {
    name: "Success",
    token: "--color-success",
    description: "Successful states",
  },
  {
    name: "Warning",
    token: "--color-warning",
    description: "Warning messages",
  },
  {
    name: "Danger",
    token: "--color-danger",
    description: "Errors and destructive actions",
  },
  {
    name: "Neutral",
    token: "--color-neutral-500",
    description: "Secondary interface elements",
  },
];

export default function ColorPalette() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Color palette</h2>
          <p>Centralised semantic design tokens</p>
        </div>
        <span className="panel-link">Design foundations</span>
      </div>

      <div className="color-grid">
        {colors.map((color) => (
          <div className="color-item" key={color.token}>
            <div
              className="color-swatch"
              style={{
                backgroundColor: `var(${color.token})`,
              }}
              aria-hidden="true"
            />

            <strong>{color.name}</strong>
            <code>{color.token}</code>
            <span>{color.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
