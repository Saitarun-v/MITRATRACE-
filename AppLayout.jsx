import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Search,
  Share2,
  ShieldAlert,
  FileCheck2,
  FolderOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { cn } from "@/lib/utils";
import Brand from "@/components/Brand";
import DataSourceBadge from "@/components/DataSourceBadge";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/investigate", label: "Wallet Investigation", icon: Search },
  { to: "/network", label: "Network Explorer", icon: Share2 },
  { to: "/detection", label: "Detection Centre", icon: ShieldAlert },
  { to: "/evidence", label: "Evidence Vault", icon: FileCheck2 },
  { to: "/cases", label: "Case Management", icon: FolderOpen },
];

function NavItems({ pathname, onNavigate }) {
  return (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active =
          item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-primary/12 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AppLayout({ children }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const initials = (user?.full_name || user?.email || "IN")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
  const current = NAV.find((n) => (n.to === "/" ? pathname === "/" : pathname.startsWith(n.to)));

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-border/70 bg-sidebar lg:flex">
        <div className="px-5 py-6">
          <Brand />
        </div>
        <div className="px-3">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
            Workspace
          </p>
          <NavItems pathname={pathname} />
        </div>
        <div className="mt-auto space-y-4 px-5 py-5">
          <div className="rounded-lg border border-border/70 bg-card/60 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Data source
              </span>
              <DataSourceBadge />
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Sample records only. Live chain providers connect here later.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-semibold text-foreground">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">
                {user?.full_name || "Investigator"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => logout()}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                MITRATRACE / Workspace
              </p>
              <p className="truncate text-sm font-medium text-foreground">
                {current?.label || "Investigation"}
              </p>
            </div>
            <DataSourceBadge className="hidden sm:inline-flex" />
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          {children}
        </main>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative h-full w-[280px] border-r border-border bg-sidebar p-4">
            <div className="flex items-center justify-between pb-5">
              <Brand />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)} aria-label="Close navigation">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <NavItems pathname={pathname} onNavigate={() => setOpen(false)} />
            <Button
              variant="outline"
              className="mt-6 w-full justify-start gap-2 border-border text-muted-foreground"
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}