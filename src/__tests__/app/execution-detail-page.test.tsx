import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockRequireAuth = vi.fn();
vi.mock("@/lib/auth-utils", () => ({
  requireAuth: () => mockRequireAuth(),
}));

describe("Execution Detail Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAuth.mockResolvedValue({
      user: { id: "123", email: "test@example.com" },
    });
  });

  it("should render execution detail page with id", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/executions/[executionId]/page")
    ).default;
    
    const params = Promise.resolve({ executionId: "exec-123" });
    const PageComponent = await Page({ params });
    render(PageComponent);
    
    expect(screen.getByText("Execution Id: exec-123")).toBeInTheDocument();
  });

  it("should call requireAuth before rendering", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/executions/[executionId]/page")
    ).default;
    
    const params = Promise.resolve({ executionId: "test-id" });
    await Page({ params });
    
    expect(mockRequireAuth).toHaveBeenCalled();
  });

  it("should handle different execution IDs", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/executions/[executionId]/page")
    ).default;
    
    const params = Promise.resolve({ executionId: "run-789" });
    const PageComponent = await Page({ params });
    render(PageComponent);
    
    expect(screen.getByText("Execution Id: run-789")).toBeInTheDocument();
  });

  it("should render paragraph element", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/executions/[executionId]/page")
    ).default;
    
    const params = Promise.resolve({ executionId: "test" });
    const PageComponent = await Page({ params });
    render(PageComponent);
    
    const paragraph = screen.getByText(/Execution Id:/);
    expect(paragraph.tagName).toBe("P");
  });
});