import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/atoms/button";

describe("Button", () => {
  it("calls the click handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Save revision</Button>);
    await user.click(screen.getByRole("button", { name: "Save revision" }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
