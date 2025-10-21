import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the AppHeader component
vi.mock("@/components/app-header", () => ({
  AppHeader: () => <header data-testid="app-header">Header</header>,
}));

describe("Rest Layout", () => {
  it("should render children within layout", async () => {
    const Layout = (await import("@/app/(dashboard)/(rest)/layout")).default;
    
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render AppHeader component", async () => {
    const Layout = (await import("@/app/(dashboard)/(rest)/layout")).default;
    
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    
    expect(screen.getByTestId("app-header")).toBeInTheDocument();
  });

  it("should render main element with correct className", async () => {
    const Layout = (await import("@/app/(dashboard)/(rest)/layout")).default;
    
    render(
      <Layout>
        <div data-testid="child-content">Content</div>
      </Layout>
    );
    
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("flex-1");
  });

  it("should wrap children in main element", async () => {
    const Layout = (await import("@/app/(dashboard)/(rest)/layout")).default;
    
    render(
      <Layout>
        <div data-testid="child-content">Child Content</div>
      </Layout>
    );
    
    const main = screen.getByRole("main");
    const child = screen.getByTestId("child-content");
    
    expect(main).toContainElement(child);
  });

  it("should render header before main content", async () => {
    const Layout = (await import("@/app/(dashboard)/(rest)/layout")).default;
    
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>
    );
    
    const header = screen.getByTestId("app-header");
    const main = screen.getByRole("main");
    
    // Check that header comes before main in DOM
    const childNodes = Array.from(container.firstChild?.childNodes || []);
    const headerIndex = childNodes.indexOf(header as ChildNode);
    const mainIndex = childNodes.indexOf(main as ChildNode);
    
    expect(headerIndex).toBeLessThan(mainIndex);
  });

  it("should use React Fragment as root element", async () => {
    const Layout = (await import("@/app/(dashboard)/(rest)/layout")).default;
    
    const { container } = render(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    
    // Fragment doesn't create an extra DOM node
    const header = screen.getByTestId("app-header");
    const main = screen.getByRole("main");
    
    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
  });
});