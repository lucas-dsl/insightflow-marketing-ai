interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
}

export const PageHeader = ({
  title,
  description,
  badge,
}: PageHeaderProps) => (
  <header className="space-y-2">
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {badge ? (
        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
          {badge}
        </span>
      ) : null}
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </header>
);
