import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/atoms/badge";

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge tone="sage">published</Badge>);

    expect(screen.getByText("published")).toBeInTheDocument();
  });
});
