import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockRequireAuth = vi.fn();
vi.mock("@/lib/auth-utils", () => ({
  requireAuth: () => mockRequireAuth(),
}));

describe("Workflow Detail Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAuth.mockResolvedValue({
      user: { id: "123", email: "test@example.com" },
    });
  });

  it("should render workflow detail page with id", async () => {
    const Page = (
      await import("@/app/(dashboard)/(editor)/workflows/[workflowId]/page")
    ).default;
    
    const params = Promise.resolve({ workflowId: "workflow-123" });
    const PageComponent = await Page({ params });
    render(PageComponent);
    
    expect(screen.getByText("Workflow Id: workflow-123")).toBeInTheDocument();
  });

  it("should call requireAuth before rendering", async () => {
    const Page = (
      await import("@/app/(dashboard)/(editor)/workflows/[workflowId]/page")
    ).default;
    
    const params = Promise.resolve({ workflowId: "test-id" });
    await Page({ params });
    
    expect(mockRequireAuth).toHaveBeenCalled();
  });

  it("should handle different workflow IDs", async () => {
    const Page = (
      await import("@/app/(dashboard)/(editor)/workflows/[workflowId]/page")
    ).default;
    
    const params = Promise.resolve({ workflowId: "different-workflow" });
    const PageComponent = await Page({ params });
    render(PageComponent);
    
    expect(
      screen.getByText("Workflow Id: different-workflow")
    ).toBeInTheDocument();
  });

  it("should render paragraph element with workflow id", async () => {
    const Page = (
      await import("@/app/(dashboard)/(editor)/workflows/[workflowId]/page")
    ).default;
    
    const params = Promise.resolve({ workflowId: "abc-123" });
    const PageComponent = await Page({ params });
    render(PageComponent);
    
    const paragraph = screen.getByText(/Workflow Id:/);
    expect(paragraph.tagName).toBe("P");
  });

  it("should await params before accessing workflowId", async () => {
    const Page = (
      await import("@/app/(dashboard)/(editor)/workflows/[workflowId]/page")
    ).default;
    
    let resolveParams: any;
    const params = new Promise((resolve) => {
      resolveParams = resolve;
    });
    
    const pagePromise = Page({ params: params as any });
    
    // Resolve params after a delay
    setTimeout(() => resolveParams({ workflowId: "delayed-id" }), 0);
    
    const PageComponent = await pagePromise;
    render(PageComponent);
    
    expect(screen.getByText("Workflow Id: delayed-id")).toBeInTheDocument();
  });
});