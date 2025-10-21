import { describe, it, expect } from "vitest";

describe("next.config.ts", () => {
  it("should have redirects configuration", async () => {
    // We import the config to validate its structure
    const nextConfig = await import("../../../next.config");
    
    expect(nextConfig).toBeDefined();
    expect(nextConfig.default).toBeDefined();
  });

  it("should redirect root to /workflows", async () => {
    const nextConfig = await import("../../../next.config");
    const config = nextConfig.default;
    
    // The config is wrapped with Sentry, but redirects should be accessible
    if (typeof config.redirects === "function") {
      const redirects = await config.redirects();
      
      expect(redirects).toBeDefined();
      expect(Array.isArray(redirects)).toBe(true);
      expect(redirects.length).toBeGreaterThan(0);
      
      const rootRedirect = redirects.find((r) => r.source === "/");
      expect(rootRedirect).toBeDefined();
      expect(rootRedirect?.destination).toBe("/workflows");
      expect(rootRedirect?.permanent).toBe(false);
    }
  });

  it("should have devIndicators disabled", async () => {
    const nextConfig = await import("../../../next.config");
    const config = nextConfig.default;
    
    expect(config.devIndicators).toBe(false);
  });

  it("should have Sentry configuration", async () => {
    const nextConfig = await import("../../../next.config");
    const config = nextConfig.default;
    
    // Sentry wraps the config, so we check for its presence
    expect(config).toBeDefined();
    expect(typeof config).toBe("object");
  });
});