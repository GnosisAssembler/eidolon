"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitBranch, Library } from "lucide-react";
import type { ReactNode } from "react";

import { LogoMark } from "@/components/atoms/logo";
import { cn } from "@/lib/cn";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const editing = pathname.startsWith("/workflows/");

  return (
    <div className="bg-paper text-ink flex h-dvh">
      <nav className="bg-rail flex w-12 shrink-0 flex-col items-center gap-1 py-3 text-white">
        <LogoMark className="mb-3 size-7" />
        <RailLink href="/" label="Workflows" active={!editing}>
          <Library className="size-4" />
        </RailLink>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-md",
            editing ? "bg-white/12 text-white" : "text-white/45",
          )}
          aria-hidden={!editing}
          title="Canvas"
        >
          <GitBranch className="size-4" />
        </span>
      </nav>
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

function RailLink({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "flex size-8 items-center justify-center rounded-md",
        active
          ? "bg-white/12 text-white"
          : "text-white/70 hover:bg-white/8 hover:text-white",
      )}
    >
      {children}
    </Link>
  );
}
