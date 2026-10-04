export function formatVersion(version: number) {
  return `v${version}`;
}

export function formatRevision(version: number) {
  return `Rev ${version}`;
}

export function formatUpdated(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

export function filterWorkflows<
  T extends { name: string; description: string },
>(workflows: T[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return workflows;
  }

  return workflows.filter((workflow) =>
    `${workflow.name} ${workflow.description}`.toLowerCase().includes(needle),
  );
}
