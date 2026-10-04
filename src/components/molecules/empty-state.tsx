export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-line bg-sand/70 rounded-3xl border border-dashed px-6 py-12 text-center">
      <h2 className="font-display text-ink text-2xl">{title}</h2>
      <p className="text-muted mx-auto mt-2 max-w-md text-sm">{body}</p>
    </div>
  );
}
