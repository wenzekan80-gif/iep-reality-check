// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { loadEthanDemo } from "../fixtures/ethan";
import { DemoApp } from "./DemoApp";
import { addLateEvidence, resolveSources } from "./demo-data";

beforeAll(() => {
  // Native dialog focus trapping/Escape are checked separately in the browser.
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

async function openReview() {
  const data = loadEthanDemo(); const user = userEvent.setup();
  render(<DemoApp data={data} />);
  await user.click(screen.getByRole("button", { name: "Try Ethan’s fictional story" }));
  await user.click(screen.getByRole("button", { name: "Confirm" }));
  return { data, user };
}

describe("parent-facing demo flow", () => {
  it("initial confirmed view renders engine-derived 10 documented / 1 explained / 1 unresolved", async () => {
    await openReview();
    expect(screen.getByTestId("documented-count")).toHaveTextContent(/^10$/);
    expect(screen.getByTestId("documented-minutes")).toHaveTextContent(/^300$/);
    expect(screen.getByTestId("explained-count")).toHaveTextContent(/^1$/);
    expect(screen.getByTestId("unresolved-count")).toHaveTextContent(/^1$/);
    expect(screen.getByTestId("reference-counts")).toHaveTextContent("12 sessions · 360 minutes");
    expect(screen.getAllByRole("button", { name: /^Week \d, item/ })).toHaveLength(12);
  });
  it("the full late-evidence flow updates 10→11, 300→330, 1→0 and meeting questions 2→1", async () => {
    const { user } = await openReview();
    await user.click(screen.getByRole("button", { name: "Meeting prep" }));
    expect(screen.getByTestId("meeting-question-count")).toHaveTextContent(/^2$/);
    await user.click(screen.getByRole("button", { name: "Add Sep 18 record" }));
    expect(screen.getByTestId("documented-count")).toHaveTextContent(/^11$/);
    expect(screen.getByTestId("documented-minutes")).toHaveTextContent(/^330$/);
    expect(screen.getByTestId("explained-count")).toHaveTextContent(/^1$/);
    expect(screen.getByTestId("unresolved-count")).toHaveTextContent(/^0$/);
    expect(screen.getByRole("status")).toHaveTextContent("This record resolves the missing-record question.");
    expect(screen.getByRole("button", { name: "Week 3, item 2: Documented" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("button", { name: /Week 3.*Needs clarification/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Add Sep 18 record/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Meeting prep" }));
    expect(screen.getByTestId("meeting-question-count")).toHaveTextContent(/^1$/);
    expect(screen.getByRole("heading", { name: "Ask about a make-up session" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Locate the remaining service record" })).not.toBeInTheDocument();
  });
  it("unresolved and cancellation events open different detail explanations", async () => {
    const { user } = await openReview();
    await user.click(screen.getByRole("button", { name: "Week 3, item 2: Needs clarification" }));
    const detail = screen.getByRole("complementary", { name: "Selected session details" });
    expect(detail).toHaveTextContent("This does not mean the service did not occur.");
    await user.click(screen.getByRole("button", { name: "Week 4, item 1: Explained" }));
    expect(detail).toHaveTextContent("Explanation found");
    expect(detail).toHaveTextContent("provider was unavailable");
    expect(detail).toHaveTextContent("make-up");
  });
  it("source drawer shows exact existing blocks and actual row metadata, then restores focus", async () => {
    const { data, user } = await openReview();
    await user.click(screen.getByRole("button", { name: "Week 4, item 1: Explained" }));
    const trigger = screen.getByRole("button", { name: "View source" });
    await user.click(trigger);
    const drawer = screen.getByRole("dialog", { name: "Source text" });
    const source = data.initial.sourceBlocks.find(b => b.id === "ethan:log:row:8")!;
    expect(within(drawer).getByRole("heading", { name: source.documentName })).toBeInTheDocument();
    expect(within(drawer).getByText("Row 8")).toBeInTheDocument();
    expect(Array.from(drawer.querySelectorAll("pre")).some(pre => pre.textContent === source.text)).toBe(true);
    expect(within(drawer).queryByText(/^Page /)).not.toBeInTheDocument();
    await user.click(within(drawer).getByRole("button", { name: "Close sources" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it("missing source IDs fail loudly instead of generating placeholder text", () => {
    expect(() => resolveSources(["not-a-real-source"], loadEthanDemo().initial.sourceBlocks)).toThrow("missing SourceBlock");
  });
  it("normal review and meeting screens avoid prohibited and engineering language", async () => {
    const { user } = await openReview();
    const forbidden = /violation|school failed|owed minutes|noncompliant|compliance score|ServicePrescription|reconciliation engine|expectedSessions|Finding enum/i;
    expect(document.body.textContent).not.toMatch(forbidden);
    await user.click(screen.getByRole("button", { name: "Meeting prep" }));
    expect(document.body.textContent).not.toMatch(forbidden);
    await user.click(screen.getByRole("button", { name: /Add Sep 18 record/ }));
    expect(document.body.textContent).not.toMatch(forbidden);
  });
  it("unsure parents stay on the plan until they explicitly confirm", async () => {
    const user = userEvent.setup(); render(<DemoApp data={loadEthanDemo()} />);
    await user.click(screen.getByRole("button", { name: "Try Ethan’s fictional story" }));
    await user.click(screen.getByRole("button", { name: "Needs review" }));
    expect(screen.getByRole("status")).toHaveTextContent("Review the IEP details.");
    expect(screen.queryByTestId("documented-count")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "02 Check the records" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /Check the plan wording/ }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Ethan_IEP.txt");
  });
  it("edited details are confirmed and recalculated, with a distinct honest source", async () => {
    const user = userEvent.setup(); render(<DemoApp data={loadEthanDemo()} />);
    await user.click(screen.getByRole("button", { name: "Try Ethan’s fictional story" }));
    await user.click(screen.getByRole("button", { name: "Edit" }));
    const input = screen.getByLabelText("Minutes each session");
    await user.clear(input); await user.type(input, "45");
    await user.click(screen.getByRole("button", { name: "Save details" }));
    expect(screen.getByText("45 minutes each session")).toBeInTheDocument();
    expect(screen.queryByTestId("documented-count")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.getByTestId("reference-counts")).toHaveTextContent("540 minutes");
    expect(screen.getByTestId("documented-minutes")).toHaveTextContent(/^300$/);
    await user.click(screen.getByRole("button", { name: "View source" }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Your confirmed demo details");
    expect(screen.getByRole("dialog")).toHaveTextContent("not quoted from the original IEP");
    expect(screen.getByRole("dialog")).toHaveTextContent("Minutes per session: 45");
  });
  it("restarting clears added evidence and restores the original two-question case", async () => {
    const { user } = await openReview();
    await user.click(screen.getByRole("button", { name: /Add Sep 18 record/ }));
    await user.click(screen.getByRole("button", { name: "Restart demo" }));
    await user.click(screen.getByRole("button", { name: "Try Ethan’s fictional story" }));
    await user.click(screen.getByRole("button", { name: "Confirm" }));
    expect(screen.getByTestId("documented-count")).toHaveTextContent(/^10$/);
    expect(screen.getByTestId("unresolved-count")).toHaveTextContent(/^1$/);
  });
  it("the added record source is real and the add adapter is idempotent", async () => {
    const { data, user } = await openReview();
    const once = addLateEvidence(data.initial, data);
    expect(addLateEvidence(once, data)).toBe(once);
    await user.click(screen.getByRole("button", { name: /Add Sep 18 record/ }));
    await user.click(screen.getByRole("button", { name: /View added record/ }));
    const drawer = screen.getByRole("dialog");
    expect(drawer.querySelector("pre")?.textContent).toBe(data.lateSource.text);
  });
  it("meeting sheet invokes browser printing", async () => {
    const print = vi.spyOn(window, "print").mockImplementation(() => {});
    const { user } = await openReview();
    await user.click(screen.getByRole("button", { name: "Meeting prep" }));
    await user.click(screen.getByRole("button", { name: /Print meeting sheet/ }));
    expect(print).toHaveBeenCalledOnce();
  });
});
