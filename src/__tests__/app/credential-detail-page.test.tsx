import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

const mockRequireAuth = vi.fn();
vi.mock("@/lib/auth-utils", () => ({
  requireAuth: () => mockRequireAuth(),
}));

describe("Credential Detail Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireAuth.mockResolvedValue({
      user: { id: "123", email: "test@example.com" },
    });
  });

  it("should render credential detail page with id", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/credentials/[credentialId]/page")
    ).default;
    
    const params = Promise.resolve({ credentialId: "cred-123" });
    const PageComponent = await Page({ params });
    render(PageComponent);
    
    expect(screen.getByText("Credential Id: cred-123")).toBeInTheDocument();
  });

  it("should call requireAuth before rendering", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/credentials/[credentialId]/page")
    ).default;
    
    const params = Promise.resolve({ credentialId: "test-id" });
    await Page({ params });
    
    expect(mockRequireAuth).toHaveBeenCalled();
  });

  it("should handle different credential IDs", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/credentials/[credentialId]/page")
    ).default;
    
    const params = Promise.resolve({ credentialId: "api-key-456" });
    const PageComponent = await Page({ params });
    render(PageComponent);
    
    expect(screen.getByText("Credential Id: api-key-456")).toBeInTheDocument();
  });

  it("should render paragraph element", async () => {
    const Page = (
      await import("@/app/(dashboard)/(rest)/credentials/[credentialId]/page")
    ).default;
    
    const params = Promise.resolve({ credentialId: "test" });
    const PageComponent = await Page({ params });
    render(PageComponent);
    
    const paragraph = screen.getByText(/Credential Id:/);
    expect(paragraph.tagName).toBe("P");
  });
});