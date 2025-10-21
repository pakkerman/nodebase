import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

// Mock the auth utils
const mockRequireAuth = vi.fn();
vi.mock("@/lib/auth-utils", () => ({
  requireAuth: () => mockRequireAuth(),
}));

describe("Workflows Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAuth.mockResolvedValue({
      user: { id: "123", email: "test@example.com" },
    });
  });

  it("should render workflows page", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/workflows/page")
    ).default;
    
    const PageComponent = await Page({});
    render(PageComponent);
    
    expect(screen.getByText("Workflows")).toBeInTheDocument();
  });

  it("should call requireAuth before rendering", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/workflows/page")
    ).default;
    
    await Page({});
    
    expect(mockRequireAuth).toHaveBeenCalled();
  });

  it("should render paragraph element with workflows text", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/workflows/page")
    ).default;
    
    const PageComponent = await Page({});
    render(PageComponent);
    
    const paragraph = screen.getByText("Workflows");
    expect(paragraph.tagName).toBe("P");
  });

  it("should handle authentication failure", async () => {
    mockRequireAuth.mockRejectedValue(new Error("Not authenticated"));
    
    const Page = (
      await import("@/app/(dashboard)/(rest)/workflows/page")
    ).default;
    
    await expect(Page({})).rejects.toThrow("Not authenticated");
  });
});