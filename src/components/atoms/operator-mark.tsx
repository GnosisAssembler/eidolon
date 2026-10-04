import { cn } from "@/lib/cn";

export function OperatorMark({
  symbol,
  label,
  active = false,
  decorative = false,
  size = "md",
}: {
  symbol: string;
  label: string;
  active?: boolean;
  decorative?: boolean;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border font-mono font-semibold",
        size === "sm" ? "size-5 text-[11px]" : "size-7 text-sm",
        active
          ? "border-copper bg-copper text-sand"
          : "border-copper/30 bg-copper/10 text-copper-deep",
      )}
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "img" as const, "aria-label": label })}
    >
      {symbol}
    </span>
  );
}
