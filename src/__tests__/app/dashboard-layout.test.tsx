import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the components
vi.mock("@/components/app-sidebar", () => ({
  AppSidebar: () => <div data-testid="app-sidebar">Sidebar</div>,
}));

vi.mock("@/components/ui/sidebar", () => ({
  SidebarInset: ({ children, className }: any) => (
    <div data-testid="sidebar-inset" className={className}>
      {children}
    </div>
  ),
  SidebarProvider: ({ children }: any) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
}));

describe("Dashboard Layout", () => {
  it("should render children within layout", async () => {
    const Layout = (await import("@/app/(dashboard)/layout")).default;
    
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render SidebarProvider", async () => {
    const Layout = (await import("@/app/(dashboard)/layout")).default;
    
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    
    expect(screen.getByTestId("sidebar-provider")).toBeInTheDocument();
  });

  it("should render AppSidebar component", async () => {
    const Layout = (await import("@/app/(dashboard)/layout")).default;
    
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    
    expect(screen.getByTestId("app-sidebar")).toBeInTheDocument();
  });

  it("should render SidebarInset with correct className", async () => {
    const Layout = (await import("@/app/(dashboard)/layout")).default;
    
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    
    const inset = screen.getByTestId("sidebar-inset");
    expect(inset).toBeInTheDocument();
    expect(inset).toHaveClass("bg-accent/20");
  });

  it("should wrap children in SidebarInset", async () => {
    const Layout = (await import("@/app/(dashboard)/layout")).default;
    
    render(
      <Layout>
        <div data-testid="child-content">Child Content</div>
      </Layout>
    );
    
    const inset = screen.getByTestId("sidebar-inset");
    const child = screen.getByTestId("child-content");
    
    expect(inset).toContainElement(child);
  });

  it("should have correct component hierarchy", async () => {
    const Layout = (await import("@/app/(dashboard)/layout")).default;
    
    const { container } = render(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    
    const provider = screen.getByTestId("sidebar-provider");
    const sidebar = screen.getByTestId("app-sidebar");
    const inset = screen.getByTestId("sidebar-inset");
    
    expect(provider).toContainElement(sidebar);
    expect(provider).toContainElement(inset);
  });
});