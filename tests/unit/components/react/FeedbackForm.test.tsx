import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedbackForm } from "@/components/react/FeedbackForm";
import { configureAnalytics } from "@/lib/analytics";

describe("<FeedbackForm />", () => {
  beforeEach(() => {
    configureAnalytics(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the message + email + submit + mailto fallback", () => {
    render(<FeedbackForm submitter={vi.fn()} />);
    expect(screen.getByLabelText(/Your feedback/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email \(optional\)/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send feedback/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Or just email us/ })).toHaveAttribute(
      "href",
      "mailto:feedback@unofficiallifeinthe.uk",
    );
  });

  it("disables submit until the message clears the minimum length", async () => {
    render(<FeedbackForm submitter={vi.fn()} />);
    const submit = screen.getByRole("button", { name: /Send feedback/ });
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByLabelText(/Your feedback/), "short");
    expect(submit).toBeDisabled();
    await userEvent.type(screen.getByLabelText(/Your feedback/), " thoughts here");
    expect(submit).toBeEnabled();
  });

  it("shows an inline alert prompting for more characters when below the minimum", async () => {
    render(<FeedbackForm submitter={vi.fn()} />);
    await userEvent.type(screen.getByLabelText(/Your feedback/), "tiny");
    expect(
      screen.getByText(/Add a bit more — \d+ more character\(s\)\./),
    ).toBeInTheDocument();
  });

  it("calls the submitter with form data and emits feedback_submit on success", async () => {
    const submitter = vi.fn().mockResolvedValue({ ok: true });
    const sink = vi.fn();
    configureAnalytics(sink);

    render(<FeedbackForm submitter={submitter} />);
    await userEvent.type(
      screen.getByLabelText(/Your feedback/),
      "Add a question about Greggs sausage rolls.",
    );
    await userEvent.type(screen.getByLabelText(/Email \(optional\)/), "fan@example.com");
    await userEvent.click(screen.getByRole("button", { name: /Send feedback/ }));

    expect(submitter).toHaveBeenCalledExactlyOnceWith(expect.any(FormData));
    const formData = submitter.mock.calls[0][0] as FormData;
    expect(formData.get("message")).toBe("Add a question about Greggs sausage rolls.");
    expect(formData.get("email")).toBe("fan@example.com");
    expect(formData.get("hp")).toBe("");

    expect(await screen.findByText(/Got it, thanks/)).toBeInTheDocument();
    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "feedback_submit",
        payload: { hasEmail: true },
      }),
    );
  });

  it("surfaces the server error message and keeps the form contents on failure", async () => {
    const submitter = vi
      .fn()
      .mockResolvedValue({ ok: false, message: "Resend rejected the request." });
    render(<FeedbackForm submitter={submitter} />);
    await userEvent.type(
      screen.getByLabelText(/Your feedback/),
      "Send rejection test feedback please.",
    );
    await userEvent.click(screen.getByRole("button", { name: /Send feedback/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Resend rejected the request/,
    );
    expect(screen.getByLabelText(/Your feedback/)).toHaveValue(
      "Send rejection test feedback please.",
    );
  });

  it("includes a hidden honeypot input named hp", () => {
    render(<FeedbackForm submitter={vi.fn()} />);
    const honeypot = document.querySelector('input[name="hp"]') as HTMLInputElement | null;
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute("aria-hidden", "true");
    expect(honeypot).toHaveAttribute("tabIndex", "-1");
  });
});
