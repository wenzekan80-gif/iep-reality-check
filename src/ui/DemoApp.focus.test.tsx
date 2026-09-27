// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { loadEthanDemo } from "../fixtures/ethan";
import { DemoApp } from "./DemoApp";
import { PAGE_FLIP_DURATION } from "./usePageFlip";

afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

it("returns focus to the cover when Restart cancels the first flip after its midpoint", () => {
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  const { container } = render(<DemoApp data={loadEthanDemo()} />);
  fireEvent.click(screen.getByRole("button", { name: "Try Ethan’s fictional story" }));
  act(() => vi.advanceTimersByTime(PAGE_FLIP_DURATION / 2));
  expect(container.querySelector(".notebook-content")).toHaveAttribute("inert");
  const restart = screen.getByRole("button", { name: "Restart demo" });
  restart.focus();
  fireEvent.click(restart);
  const heading = screen.getByRole("heading", { level: 1, name: /Check the records/ });
  expect(heading).toHaveFocus();
  expect(container.querySelector(".flip-overlay")).not.toBeInTheDocument();
  act(() => vi.advanceTimersByTime(PAGE_FLIP_DURATION));
  expect(heading).toHaveFocus();
  expect(screen.queryByRole("button", { name: "Confirm" })).not.toBeInTheDocument();
});
