// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { reconcile } from "../domain/reconcile";
import { loadEthanDemo } from "../fixtures/ethan";
import { addLateEvidence, confirmDemoPlan } from "./demo-data";
import { EvidenceResolution } from "./EvidenceResolution";

afterEach(cleanup);

function renderEvidence(sessions: number) {
  const data = loadEthanDemo();
  const input = confirmDemoPlan(data, sessions, 30);
  const before = reconcile(input);
  const after = reconcile(addLateEvidence(input, data));
  const matched = after.findings.find(f => f.status === "documented" && f.sourceBlockIds.includes(data.lateSource.id));
  render(<EvidenceResolution change={{ before: before.summary, after: after.summary,
    findingId: matched?.id ?? null, resolved: !!matched }} />);
  return { before, after };
}

function expectMetric(label: string, before: number, after: number) {
  const row = screen.getByText(label).closest("div")!;
  expect(within(row).getByRole("definition")).toHaveTextContent(`${before} → ${after}`);
}

describe("new evidence annotation", () => {
  it("shows the original case's actual before and after counts", () => {
    renderEvidence(2);
    expect(screen.getByText("Record found.")).toBeInTheDocument();
    expectMetric("Documented", 10, 11);
    expectMetric("To clarify", 1, 0);
    expectMetric("Meeting questions", 2, 1);
  });

  it("does not claim a meeting question was resolved when an edited plan still has one missing record that week", () => {
    const { before, after } = renderEvidence(3);
    expect(after.meetingQuestions.map(q => q.id)).toEqual(before.meetingQuestions.map(q => q.id));
    expect(screen.getByText("Record found.")).toBeInTheDocument();
    expect(screen.queryByText(/question.*resolved/i)).not.toBeInTheDocument();
    expectMetric("Documented", 10, 11);
    expectMetric("To clarify", 7, 6);
    expectMetric("Meeting questions", 7, 7);
  });

  it("uses a neutral annotation when an edited plan requires review and the new record cannot be matched", () => {
    const { after } = renderEvidence(1);
    expect(after.summary.comparisonComplete).toBe(false);
    expect(screen.getByText("Record added.")).toBeInTheDocument();
    expect(screen.queryByText("Record found.")).not.toBeInTheDocument();
    expectMetric("Documented", 1, 0);
    expectMetric("To clarify", 0, 0);
    expectMetric("Meeting questions", 5, 6);
  });
});
