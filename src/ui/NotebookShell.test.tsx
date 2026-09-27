// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { NotebookShell } from "./NotebookShell";
import { PAGE_FLIP_DURATION, usePageFlip } from "./usePageFlip";

function mockMotion(reduced = false) {
  const events = new EventTarget();
  let matches = reduced;
  const media = {
    get matches() { return matches; },
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
  };
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  return (next: boolean) => {
    matches = next;
    events.dispatchEvent(new Event("change"));
  };
}

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("visual notebook navigation", () => {
  it("commits only at the midpoint and ignores rapid navigation until the sheet is gone", () => {
    vi.useFakeTimers(); mockMotion();
    const commit = vi.fn();
    const { result } = renderHook(() => usePageFlip("plan", commit));
    act(() => { result.current.navigate("review"); result.current.navigate("meeting"); });
    expect(result.current.flip?.direction).toBe("forward");
    expect(result.current.busy).toBe(true);
    expect(commit).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(PAGE_FLIP_DURATION / 2 - 1));
    expect(commit).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(commit).toHaveBeenCalledExactlyOnceWith("review");
    expect(result.current.busy).toBe(true);
    act(() => vi.advanceTimersByTime(PAGE_FLIP_DURATION / 2));
    expect(result.current.flip).toBeNull();
    expect(result.current.busy).toBe(false);
  });

  it("reset cancellation discards the pending screen and makes navigation available again", () => {
    vi.useFakeTimers(); mockMotion();
    const commit = vi.fn();
    const { result } = renderHook(() => usePageFlip("review", commit));
    act(() => result.current.navigate("plan"));
    expect(result.current.flip?.direction).toBe("backward");
    act(() => result.current.cancel());
    act(() => vi.runAllTimers());
    expect(commit).not.toHaveBeenCalled();
    expect(result.current.busy).toBe(false);
    act(() => result.current.navigate("meeting"));
    act(() => vi.runAllTimers());
    expect(commit).toHaveBeenCalledExactlyOnceWith("meeting");
  });

  it("unmount clears the timers so a discarded notebook cannot change its screen", () => {
    vi.useFakeTimers(); mockMotion();
    const commit = vi.fn();
    const { result, unmount } = renderHook(() => usePageFlip("plan", commit));
    act(() => result.current.navigate("review"));
    unmount();
    act(() => vi.runAllTimers());
    expect(commit).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(["reduced", "unavailable"])("switches immediately when motion is %s", mode => {
    vi.useFakeTimers();
    if (mode === "reduced") mockMotion(true);
    else vi.stubGlobal("matchMedia", undefined);
    const commit = vi.fn();
    const { result } = renderHook(() => usePageFlip("plan", commit));
    act(() => result.current.navigate("review"));
    expect(commit).toHaveBeenCalledExactlyOnceWith("review");
    expect(result.current.flip).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([false, true])("finishes safely when reduced motion is enabled during a flip (committed: %s)", pastMidpoint => {
    vi.useFakeTimers(); const changeMotion = mockMotion();
    const commit = vi.fn();
    const { result } = renderHook(() => usePageFlip("plan", commit));
    act(() => result.current.navigate("review"));
    if (pastMidpoint) act(() => vi.advanceTimersByTime(PAGE_FLIP_DURATION / 2));
    act(() => changeMotion(true));
    expect(result.current.flip).toBeNull();
    act(() => vi.runAllTimers());
    expect(commit).toHaveBeenCalledExactlyOnceWith("review");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("all routes out of an unconfirmed plan preserve the confirmation gate", () => {
    const navigate = vi.fn();
    render(<NotebookShell screen="plan" confirmed={false} flip={null} busy={false} onNavigate={navigate}><h1>Plan</h1></NotebookShell>);
    for (const label of ["02 Check the records", "03 Prepare for the meeting", "Next: Evidence", "Turn page to Evidence"]) {
      const control = screen.getByRole("button", { name: label });
      expect(control).toBeDisabled();
      fireEvent.click(control);
    }
    expect(navigate).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Previous: cover" }));
    expect(navigate).toHaveBeenCalledExactlyOnceWith("home");
  });

  it("keeps the business element in place and inert while the independent sheet turns", () => {
    const navigate = vi.fn();
    const children = <button>Business action</button>;
    const { rerender, container } = render(<NotebookShell screen="review" confirmed flip={null} busy={false} onNavigate={navigate}>{children}</NotebookShell>);
    const business = screen.getByRole("button", { name: "Business action" });
    rerender(<NotebookShell screen="review" confirmed flip={{ direction: "forward", key: 1 }} busy onNavigate={navigate}>{children}</NotebookShell>);
    expect(screen.getByRole("button", { name: "Business action" })).toBe(business);
    expect(business.closest(".notebook-content")).toHaveAttribute("inert");
    expect(container.querySelector(".flip-overlay")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".flip-overlay")).not.toContainElement(business);
    expect(screen.getByRole("button", { name: "01 Understand the plan" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next: Meeting Prep" })).toBeDisabled();
  });
});
