// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { loadEthanDemo } from "../fixtures/ethan";
import { SYNTHETIC_EXAMPLES } from "../ai/examples";
import { DemoApp } from "./DemoApp";
import { QuotedSource } from "./AIPlanStep";

const candidate = { service: { value: "Speech-Language Therapy", quote: "Speech-Language Therapy" }, weeklyFrequency: { value: 2, quote: "2 sessions each school week" }, minutesPerSession: { value: 30, quote: "30 minutes per session" }, needsReview: false };
const success = () => Response.json({ candidate, origin: "live-model", exampleId: "ethan-clear" });
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

async function openAI(fetcher = vi.fn().mockImplementation(async () => success())) {
  vi.stubGlobal("fetch", fetcher); const user = userEvent.setup(); render(<DemoApp data={loadEthanDemo()} />);
  await user.click(screen.getByRole("button", { name: /Try AI with a synthetic excerpt/ }));
  return { user, fetcher };
}
async function extract(user: ReturnType<typeof userEvent.setup>) {
  if (!(screen.getByRole("checkbox", { name: /This is synthetic text/ }) as HTMLInputElement).checked) await user.click(screen.getByRole("checkbox", { name: /This is synthetic text/ }));
  await user.click(screen.getByRole("button", { name: "Extract with AI" }));
}
const confirm = () => screen.getByRole("button", { name: "Confirm" });
const scope = () => screen.getByRole("checkbox", { name: /Use these reviewed speech details/ });
function expectNavigationBlocked() {
  expect(screen.getByRole("button", { name: "02 Check the records" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "03 Prepare for the meeting" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next: Evidence" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Turn page to Evidence" })).toBeDisabled();
}

describe("AI candidate review (mocked transport; not a live-provider test)", () => {
  it("requires consent, quoted candidate, scope and explicit human confirmation before comparison", async () => {
    const { user, fetcher } = await openAI();
    expect(screen.getByRole("button", { name: "Extract with AI" })).toBeDisabled(); expectNavigationBlocked();
    await extract(user);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("ai-original").textContent).toBe(SYNTHETIC_EXAMPLES[0].text);
    expect(screen.getByTestId("ai-original").querySelectorAll("mark")).toHaveLength(3);
    expect(screen.getByText("Based on the IEP text above.")).toBeInTheDocument();
    expect(confirm()).toBeDisabled(); expectNavigationBlocked();
    await user.click(scope()); expect(confirm()).toBeEnabled(); expectNavigationBlocked();
    await user.click(confirm());
    expect(screen.getByTestId("documented-count")).toHaveTextContent(/^10$/);
    expect(screen.getByTestId("documented-minutes")).toHaveTextContent(/^300$/);
    await user.click(screen.getByRole("button", { name: /View confirmed details and original excerpt/ }));
    const drawer = screen.getByRole("dialog");
    expect(drawer).toHaveTextContent("Human-confirmed synthetic plan and AI evidence");
    expect(drawer).toHaveTextContent("they were not extracted from this excerpt");
    expect(Array.from(drawer.querySelectorAll("pre")).some(pre => pre.textContent === SYNTHETIC_EXAMPLES[0].text)).toBe(true);
    await user.click(within(drawer).getByRole("button", { name: "Close sources" }));
    await user.click(screen.getByRole("button", { name: "Add Sep 18 record" }));
    expect(screen.getByTestId("documented-count")).toHaveTextContent(/^11$/);
    expect(screen.getByTestId("documented-minutes")).toHaveTextContent(/^330$/);
  });
  it("edits remain human source data, preserve AI quotes and require renewed scope confirmation", async () => {
    const { user } = await openAI(); await extract(user); await user.click(scope());
    await user.click(screen.getByRole("button", { name: "Edit" })); expectNavigationBlocked();
    const duration = screen.getByRole("spinbutton", { name: "Minutes each session" });
    await user.clear(duration); await user.type(duration, "45"); await user.click(screen.getByRole("button", { name: "Save details" }));
    expect(screen.getByText(/Human edit · original AI value: 30/)).toBeInTheDocument();
    expect(screen.getByTestId("ai-original")).toHaveTextContent("30 minutes per session");
    expect(confirm()).toBeDisabled(); await user.click(scope()); await user.click(confirm());
    expect(screen.getByTestId("reference-counts")).toHaveTextContent("12 sessions · 540 minutes");
    await user.click(screen.getByRole("button", { name: /View confirmed details and original excerpt/ }));
    expect(screen.getByRole("dialog")).toHaveTextContent("Human edit; not supported by the original AI quote");
  });
  it("Needs review blocks every forward control even after scope was checked", async () => {
    const { user } = await openAI(); await extract(user); await user.click(scope());
    await user.click(screen.getByRole("button", { name: "Needs review" })); expect(confirm()).toBeDisabled(); expectNavigationBlocked();
    expect(screen.getByRole("status")).toHaveTextContent("Comparison is paused");
    await user.click(scope()); expect(confirm()).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Resume reviewing these details" }));
    expect(confirm()).toBeEnabled(); expectNavigationBlocked();
  });
  it("returning from confirmed records discards confirmation and requires a fresh extraction", async () => {
    const { user } = await openAI(); await extract(user); await user.click(scope()); await user.click(confirm());
    await user.click(screen.getByRole("button", { name: "Review plan" }));
    expectNavigationBlocked(); expect(screen.queryByTestId("ai-original")).not.toBeInTheDocument();
    await extract(user); await user.click(screen.getByRole("button", { name: "Needs review" })); expectNavigationBlocked();
    fireEvent.change(screen.getByLabelText("Synthetic IEP excerpt"), { target: { value: SYNTHETIC_EXAMPLES[1].text } });
    expect(screen.queryByRole("button", { name: "Confirm" })).not.toBeInTheDocument(); expectNavigationBlocked();
  });
  it("vague details remain null, labelled for review and cannot borrow Ethan numbers", async () => {
    const vague = { ...candidate, service: { value: "Speech-Language Therapy", quote: "speech services" }, weeklyFrequency: { value: null, quote: null }, minutesPerSession: { value: null, quote: null }, needsReview: true };
    const { user } = await openAI(vi.fn().mockResolvedValue(Response.json({ candidate: vague, origin: "live-model" })));
    await user.click(screen.getByRole("button", { name: "Vague example" })); await extract(user);
    expect(screen.getAllByText("Unknown — needs review")).toHaveLength(2);
    expect(confirm()).toBeDisabled(); expect(screen.getByRole("button", { name: "Edit" })).toBeDisabled(); expectNavigationBlocked();
    expect(screen.queryByTestId("documented-count")).not.toBeInTheDocument();
  });
  it("rejects fabricated provider quote output in the client too", async () => {
    const { user } = await openAI(vi.fn().mockResolvedValue(Response.json({ candidate: { ...candidate, weeklyFrequency: { value: 2, quote: "made-up quote" } }, origin: "live-model" })));
    await extract(user); expect(screen.getByRole("alert")).toHaveTextContent("could not be verified");
    expect(screen.queryByTestId("ai-original")).not.toBeInTheDocument(); expectNavigationBlocked();
  });
  it("keyless/off errors remain unavailable and the stable one-click demo still works", async () => {
    const { user } = await openAI(vi.fn().mockResolvedValue(Response.json({ code: "disabled", message: "must not echo arbitrary body" }, { status: 503 })));
    await extract(user); expect(screen.getByRole("alert")).toHaveTextContent("switched off");
    expect(screen.getByRole("alert")).not.toHaveTextContent("arbitrary body"); expectNavigationBlocked();
    await user.click(screen.getByRole("button", { name: "Use Ethan’s original demo" })); await user.click(confirm());
    expect(screen.getByTestId("documented-count")).toHaveTextContent(/^10$/);
  });
  it("changing text aborts the pending request and ignores a late success", async () => {
    let resolve!: (response: Response) => void;
    const fetcher = vi.fn().mockImplementation(() => new Promise<Response>(done => { resolve = done; }));
    const { user } = await openAI(fetcher); await extract(user);
    fireEvent.change(screen.getByLabelText("Synthetic IEP excerpt"), { target: { value: SYNTHETIC_EXAMPLES[1].text } });
    expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true);
    await act(async () => resolve(success()));
    expect(screen.queryByTestId("ai-original")).not.toBeInTheDocument(); expectNavigationBlocked();
  });
  it("restart/unmount invalidates an old request before reopening the plan", async () => {
    let resolve!: (response: Response) => void;
    const fetcher = vi.fn().mockImplementation(() => new Promise<Response>(done => { resolve = done; }));
    const { user } = await openAI(fetcher); await extract(user);
    await user.click(screen.getByRole("button", { name: "Restart demo" }));
    await user.click(screen.getByRole("button", { name: /Try AI with a synthetic excerpt/ }));
    await act(async () => resolve(success()));
    expect(screen.queryByTestId("ai-original")).not.toBeInTheDocument(); expectNavigationBlocked();
    expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true);
  });
  it("source highlighting preserves literal markup as text and merges overlapping quotes", () => {
    const text = '<script>alert("x")</script> speech services';
    const { container } = render(<pre><QuotedSource text={text} quotes={['<script>alert("x")</script>', "speech", "speech services"]} /></pre>);
    expect(container.querySelector("pre")?.textContent).toBe(text);
    expect(container.querySelector("script")).toBeNull(); expect(container.querySelectorAll("mark")).toHaveLength(2);
  });
});
