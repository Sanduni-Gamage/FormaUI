type StatCardProps = {
  title: string;
  value: string;
  description: string;
};

export default function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <p>{title}</p>
      <p className="stat-card-value">{value}</p>
      <span>{description}</span>
    </article>
  );
}
