import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/atoms/logo";
import { Separator } from "@/components/atoms/separator";
import { APP_VERSION } from "@/lib/version";

export function SiteHeader({
  eyebrow,
  trailing,
}: {
  eyebrow?: string;
  trailing?: ReactNode;
}) {
  return (
    <header className="border-line bg-sand/90 flex h-16 shrink-0 items-center justify-between border-b px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link href="/" aria-label="Eidolon home" className="rounded-lg">
          <Logo />
        </Link>
        {eyebrow ? (
          <>
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <p className="text-muted hidden truncate text-sm sm:block">
              {eyebrow}
            </p>
          </>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {trailing}
        <span className="text-muted font-mono text-xs">v{APP_VERSION}</span>
      </div>
    </header>
  );
}
