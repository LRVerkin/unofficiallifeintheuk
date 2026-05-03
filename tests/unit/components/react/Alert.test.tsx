import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert } from "@/components/react/Alert";

describe("<Alert />", () => {
  it("uses role=status and aria-live=polite for info severity", () => {
    render(<Alert>Saved.</Alert>);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Saved.");
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("uses role=alert and aria-live=assertive for error severity", () => {
    render(<Alert severity="error">Couldn’t send feedback.</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Couldn’t send feedback.");
    expect(alert).toHaveAttribute("aria-live", "assertive");
  });

  it("uses role=alert and aria-live=assertive for success severity", () => {
    render(<Alert severity="success">Submitted, ta.</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveAttribute("aria-live", "assertive");
  });

  it("merges custom classNames", () => {
    render(
      <Alert severity="info" className="extra">
        x
      </Alert>,
    );
    expect(screen.getByRole("status").className).toMatch(/extra/);
  });
});
