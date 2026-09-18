// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadEthanDemo } from "../fixtures/ethan";
import { HeroStory, STORY_BEAT_MS, STORY_BEATS } from "./HeroStory";
import { HomePage } from "./HomePage";

function mockMotion(reduce: boolean) {
  const listeners = new Set<() => void>();
  const media = { matches: reduce, addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener) };
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  return { change(value: boolean) { media.matches = value; act(() => listeners.forEach(listener => listener())); } };
}
beforeEach(() => { vi.useFakeTimers(); mockMotion(false); });
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe("guardian homepage story", () => {
  it("uses the requested copy and CTA with a fictional family introduction", () => {
    const start = vi.fn(); render(<HomePage data={loadEthanDemo()} onStart={start} />);
    expect(screen.getByRole("heading", {level:1})).toHaveTextContent("You know your child.We help you understand the paperwork.");
    expect(screen.getByText("Fictional demo — no real student data.")).toBeInTheDocument();
    expect(screen.getByText("Ethan and Mike are fictional characters created for this demo.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name:"Try Ethan’s fictional story"}));
    expect(start).toHaveBeenCalledOnce();
  });
  it("plays six ordered scenes and softly restarts after 15 seconds", () => {
    render(<HeroStory data={loadEthanDemo()} />);
    for (let beat = 0; beat < STORY_BEATS.length; beat++) {
      expect(screen.getByRole("region")).toHaveAttribute("data-story-beat", String(beat));
      act(() => { vi.advanceTimersByTime(STORY_BEAT_MS); });
    }
    expect(STORY_BEAT_MS * STORY_BEATS.length).toBe(15000);
    expect(screen.getByRole("region")).toHaveAttribute("data-story-beat", "0");
  });
  it("can pause, select a moment without autoplay, and resume", () => {
    render(<HeroStory data={loadEthanDemo()} />);
    fireEvent.click(screen.getByRole("button", {name:"Pause story"}));
    act(() => { vi.advanceTimersByTime(15000); });
    expect(screen.getByRole("region")).toHaveAttribute("data-story-beat", "0");
    fireEvent.click(screen.getByRole("button", {name:"Show moment 4: Needs clarification"}));
    expect(screen.getByText("This does not mean the service did not occur.")).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(15000); });
    expect(screen.getByRole("region")).toHaveAttribute("data-story-beat", "3");
    fireEvent.click(screen.getByRole("button", {name:"Play story"}));
    act(() => { vi.advanceTimersByTime(STORY_BEAT_MS); });
    expect(screen.getByRole("region")).toHaveAttribute("data-story-beat", "4");
  });
  it("reduced motion presents a static final scene and allows manual exploration", () => {
    mockMotion(true); render(<HeroStory data={loadEthanDemo()} />);
    expect(screen.getByRole("region")).toHaveAttribute("data-reduced-motion", "true");
    expect(screen.getByRole("region")).toHaveAttribute("data-story-beat", "5");
    expect(screen.queryByRole("button", {name:"Play story"})).not.toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(30000); });
    expect(screen.getByRole("region")).toHaveAttribute("data-story-beat", "5");
    fireEvent.click(screen.getByRole("button", {name:"Show moment 4: Needs clarification"}));
    expect(screen.getByText("This does not mean the service did not occur.")).toBeInTheDocument();
  });
  it("responds to a changed system motion preference and cleans up timers", () => {
    const media = mockMotion(false); const {unmount} = render(<HeroStory data={loadEthanDemo()} />);
    media.change(true);
    expect(screen.getByRole("region")).toHaveAttribute("data-playing", "false");
    act(() => { vi.advanceTimersByTime(15000); });
    expect(screen.getByRole("region")).toHaveAttribute("data-story-beat", "5");
    unmount(); expect(vi.getTimerCount()).toBe(0);
  });
  it("pauses in a hidden tab and resumes on return", () => {
    let hidden = false; vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
    render(<HeroStory data={loadEthanDemo()} />);
    act(() => { hidden = true; document.dispatchEvent(new Event("visibilitychange")); vi.advanceTimersByTime(5000); });
    expect(screen.getByRole("region")).toHaveAttribute("data-playing", "false");
    const beat = screen.getByRole("region").getAttribute("data-story-beat");
    act(() => { vi.advanceTimersByTime(10000); });
    expect(screen.getByRole("region")).toHaveAttribute("data-story-beat", beat);
    act(() => { hidden = false; document.dispatchEvent(new Event("visibilitychange")); });
    expect(screen.getByRole("region")).toHaveAttribute("data-playing", "true");
  });
  it("shows the evidence change and leaves the make-up question open", () => {
    const data = loadEthanDemo(); const original = structuredClone(data); render(<HeroStory data={data} />);
    fireEvent.click(screen.getByRole("button", {name:"Show moment 3: Check the records"}));
    expect(screen.getAllByLabelText("Documented")).toHaveLength(10);
    expect(screen.getAllByLabelText("Needs clarification")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", {name:"Show moment 5: New evidence"}));
    expect(screen.getAllByLabelText("Documented")).toHaveLength(11);
    expect(screen.queryByLabelText("Needs clarification")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Explained cancellation")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name:"Show moment 6: Ready for the meeting"}));
    expect(screen.getByText("Was a make-up session offered?")).toBeInTheDocument();
    expect(data).toEqual(original);
  });
});
