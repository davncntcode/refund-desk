import type { ReactNode } from "react";
import { GlobalSearch } from "./global-search";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export function Topbar({ mobilePanel, actions }: { mobilePanel: ReactNode; actions?: ReactNode }) {
  return (
    <header className="border-border bg-background/85 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 lg:px-8">
        <MobileNav>{mobilePanel}</MobileNav>
        <GlobalSearch />
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {actions}
        </div>
      </div>
    </header>
  );
}
