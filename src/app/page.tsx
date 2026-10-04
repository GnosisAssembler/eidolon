import type { Metadata } from "next";

import { LibraryScreen } from "@/components/templates/library-screen";

export const metadata: Metadata = {
  title: "Workflows",
};

export default function HomePage() {
  return <LibraryScreen />;
}
