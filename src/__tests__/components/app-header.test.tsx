import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppHeader } from "@/components/app-header";

// Mock the sidebar components
vi.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: () => <button data-testid="sidebar-trigger">Toggle</button>,
}));

describe("AppHeader", () => {
  it("should render without crashing", () => {
    render(<AppHeader />);
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("should have correct CSS classes", () => {
    render(<AppHeader />);
    const header = screen.getByRole("banner");
    
    expect(header).toHaveClass("flex");
    expect(header).toHaveClass("h-14");
    expect(header).toHaveClass("shrink-0");
    expect(header).toHaveClass("items-center");
    expect(header).toHaveClass("gap-2");
    expect(header).toHaveClass("border-b");
    expect(header).toHaveClass("px-4");
    expect(header).toHaveClass("bg-background");
  });

  it("should render SidebarTrigger component", () => {
    render(<AppHeader />);
    const trigger = screen.getByTestId("sidebar-trigger");
    expect(trigger).toBeInTheDocument();
  });

  it("should be a semantic header element", () => {
    render(<AppHeader />);
    const header = screen.getByRole("banner");
    expect(header.tagName).toBe("HEADER");
  });

  it("should match snapshot", () => {
    const { container } = render(<AppHeader />);
    expect(container.firstChild).toMatchSnapshot();
  });
});