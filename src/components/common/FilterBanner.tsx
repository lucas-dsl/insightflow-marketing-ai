import { Filter } from "lucide-react";

interface FilterBannerProps {
  count: number;
  label: string;
  value: string;
}

export const FilterBanner = ({ count, label, value }: FilterBannerProps) => (
  <div className="rounded-2xl border border-primary/20 bg-primary/5 px-3 py-3">
    <div className="flex items-center gap-2">
      <Filter className="h-3.5 w-3.5 text-primary" />
      <span className="text-xs font-medium text-primary">Filtro ativo</span>
      <span className="text-xs font-semibold text-foreground">{value}</span>
      <span className="ml-auto text-[10px] text-muted-foreground">
        {count} {label}
      </span>
    </div>
  </div>
);
