import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock window.matchMedia for Mantine
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver for Mantine ScrollArea
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

vi.mock("next/image", () => ({
  default: vi.fn(() => null),
}));

vi.mock("next/link", () => ({
  default: vi.fn(({ children }: { href: string; children: unknown }) => children),
}));

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans", className: "geist" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono", className: "geist-mono" }),
}));

vi.mock("@mantine/core/styles.css", () => ({}));
vi.mock("@mantine/dates/styles.css", () => ({}));
