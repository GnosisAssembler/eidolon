import { cn } from "@/lib/cn";
import { APP_NAME } from "@/lib/version";

type LogoProps = {
  className?: string;
  wordmark?: boolean;
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <path
        d="M8.5 24.5c.2-7 2.2-12.2 7.8-16.2 5.2 3.4 8.2 8.2 8.4 13.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6.5 19.5c4.2-.8 6.4 1.2 9.2.6 3.4-.7 5.2-3.6 8.8-2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="6.5" cy="19.5" r="1.45" fill="currentColor" />
      <circle cx="16.2" cy="13.2" r="1.7" fill="#d79a08" />
      <circle cx="24.5" cy="17.7" r="1.45" fill="#d79a08" />
    </svg>
  );
}

export function Logo({ className, wordmark = true }: LogoProps) {
  return (
    <span className={cn("text-ink inline-flex items-center gap-2", className)}>
      <LogoMark className="size-7" />
      {wordmark ? (
        <span className="text-sm font-semibold tracking-tight">{APP_NAME}</span>
      ) : null}
    </span>
  );
}
