import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockRequireAuth = vi.fn();
vi.mock("@/lib/auth-utils", () => ({
  requireAuth: () => mockRequireAuth(),
}));

describe("Credentials Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAuth.mockResolvedValue({
      user: { id: "123", email: "test@example.com" },
    });
  });

  it("should render credentials page", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/credentials/page")
    ).default;
    
    const PageComponent = await Page({});
    render(PageComponent);
    
    expect(screen.getByText("Credentials")).toBeInTheDocument();
  });

  it("should call requireAuth before rendering", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/credentials/page")
    ).default;
    
    await Page({});
    
    expect(mockRequireAuth).toHaveBeenCalled();
  });

  it("should render paragraph element", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/credentials/page")
    ).default;
    
    const PageComponent = await Page({});
    render(PageComponent);
    
    const paragraph = screen.getByText("Credentials");
    expect(paragraph.tagName).toBe("P");
  });
});