import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageHeader({ title, description, children }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
