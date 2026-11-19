import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export default function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card-header">
        <p className="stat-card-title">{title}</p>
        <span className="stat-card-icon" aria-hidden="true">
          <Icon size={16} strokeWidth={2} />
        </span>
      </div>
      <p className="stat-card-value">{value}</p>
      <span className="stat-card-description">{description}</span>
    </article>
  );
}
