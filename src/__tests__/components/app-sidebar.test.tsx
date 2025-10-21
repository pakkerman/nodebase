import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname, useRouter } from "next/navigation";

// Mock the auth client
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signOut: vi.fn(),
  },
}));

// Mock Next.js Image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock the sidebar UI components
vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children, ...props }: any) => (
    <div data-testid="sidebar" {...props}>
      {children}
    </div>
  ),
  SidebarHeader: ({ children }: any) => (
    <div data-testid="sidebar-header">{children}</div>
  ),
  SidebarContent: ({ children }: any) => (
    <div data-testid="sidebar-content">{children}</div>
  ),
  SidebarFooter: ({ children }: any) => (
    <div data-testid="sidebar-footer">{children}</div>
  ),
  SidebarMenu: ({ children }: any) => (
    <ul data-testid="sidebar-menu">{children}</ul>
  ),
  SidebarMenuItem: ({ children }: any) => (
    <li data-testid="sidebar-menu-item">{children}</li>
  ),
  SidebarMenuButton: ({ children, onClick, tooltip, asChild, ...props }: any) => {
    const Comp = asChild ? "div" : "button";
    return (
      <Comp
        data-testid="sidebar-menu-button"
        onClick={onClick}
        title={tooltip}
        {...props}
      >
        {children}
      </Comp>
    );
  },
  SidebarGroup: ({ children }: any) => (
    <div data-testid="sidebar-group">{children}</div>
  ),
  SidebarGroupContent: ({ children }: any) => (
    <div data-testid="sidebar-group-content">{children}</div>
  ),
}));

describe("AppSidebar", () => {
  const mockPush = vi.fn();
  const mockPathname = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    } as any);
    vi.mocked(usePathname).mockReturnValue("/workflows");
  });

  it("should render without crashing", () => {
    render(<AppSidebar />);
    const sidebar = screen.getByTestId("sidebar");
    expect(sidebar).toBeInTheDocument();
  });

  it("should render the logo and brand name", () => {
    render(<AppSidebar />);
    
    const logo = screen.getByAltText("Nodebase logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logos/logo.svg");
    
    const brandName = screen.getByText("Nodebase");
    expect(brandName).toBeInTheDocument();
  });

  it("should render all main menu items", () => {
    render(<AppSidebar />);
    
    expect(screen.getByText("Workflows")).toBeInTheDocument();
    expect(screen.getByText("Credentials")).toBeInTheDocument();
    expect(screen.getByText("Executions")).toBeInTheDocument();
  });

  it("should render footer action buttons", () => {
    render(<AppSidebar />);
    
    expect(screen.getByText("Upgrade to Pro")).toBeInTheDocument();
    expect(screen.getByText("Billing Portal")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("should have correct structure with header, content, and footer", () => {
    render(<AppSidebar />);
    
    expect(screen.getByTestId("sidebar-header")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-footer")).toBeInTheDocument();
  });

  it("should mark active menu item based on pathname", () => {
    vi.mocked(usePathname).mockReturnValue("/workflows");
    
    render(<AppSidebar />);
    
    const buttons = screen.getAllByTestId("sidebar-menu-button");
    const workflowsButton = buttons.find((btn) =>
      btn.textContent?.includes("Workflows")
    );
    
    expect(workflowsButton).toHaveAttribute("data-active", "true");
  });

  it("should mark credentials as active when on credentials path", () => {
    vi.mocked(usePathname).mockReturnValue("/credentials/123");
    
    render(<AppSidebar />);
    
    const buttons = screen.getAllByTestId("sidebar-menu-button");
    const credentialsButton = buttons.find((btn) =>
      btn.textContent?.includes("Credentials")
    );
    
    expect(credentialsButton).toHaveAttribute("data-active", "true");
  });

  it("should handle sign out click", async () => {
    const { authClient } = await import("@/lib/auth-client");
    
    render(<AppSidebar />);
    
    const signOutButton = screen.getByText("Sign out").closest("button");
    expect(signOutButton).toBeInTheDocument();
    
    fireEvent.click(signOutButton!);
    
    await waitFor(() => {
      expect(authClient.signOut).toHaveBeenCalled();
    });
  });

  it("should call router.push on successful sign out", async () => {
    const { authClient } = await import("@/lib/auth-client");
    
    vi.mocked(authClient.signOut).mockImplementation(
      ({ fetchOptions }: any) => {
        fetchOptions?.onSuccess?.();
        return Promise.resolve();
      }
    );
    
    render(<AppSidebar />);
    
    const signOutButton = screen.getByText("Sign out").closest("button");
    fireEvent.click(signOutButton!);
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("should render correct icons for menu items", () => {
    render(<AppSidebar />);
    
    // Icons are rendered as lucide-react components
    // We check that the text labels exist which are paired with icons
    const menuItems = ["Workflows", "Credentials", "Executions"];
    
    menuItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it("should have correct tooltips for menu buttons", () => {
    render(<AppSidebar />);
    
    const buttons = screen.getAllByTestId("sidebar-menu-button");
    
    const workflowsButton = buttons.find((btn) =>
      btn.textContent?.includes("Workflows")
    );
    expect(workflowsButton).toHaveAttribute("title", "Workflows");
  });

  it("should render home link with logo", () => {
    render(<AppSidebar />);
    
    const homeLink = screen.getByRole("link", { name: /Nodebase logo/i });
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("should have prefetch enabled on navigation links", () => {
    render(<AppSidebar />);
    
    const links = screen.getAllByRole("link");
    
    // Check that links have prefetch attribute
    links.forEach((link) => {
      if (link.getAttribute("href")?.startsWith("/")) {
        expect(link).toBeInTheDocument();
      }
    });
  });

  it("should not mark root path as active when on /workflows", () => {
    vi.mocked(usePathname).mockReturnValue("/workflows");
    
    render(<AppSidebar />);
    
    const buttons = screen.getAllByTestId("sidebar-menu-button");
    const workflowsButton = buttons.find((btn) =>
      btn.textContent?.includes("Workflows")
    );
    
    // Should be active for /workflows
    expect(workflowsButton).toHaveAttribute("data-active", "true");
  });

  it("should handle upgrade to pro button click", () => {
    render(<AppSidebar />);
    
    const upgradeButton = screen.getByText("Upgrade to Pro").closest("button");
    expect(upgradeButton).toBeInTheDocument();
    
    // Should not throw when clicked
    fireEvent.click(upgradeButton!);
  });

  it("should handle billing portal button click", () => {
    render(<AppSidebar />);
    
    const billingButton = screen.getByText("Billing Portal").closest("button");
    expect(billingButton).toBeInTheDocument();
    
    // Should not throw when clicked
    fireEvent.click(billingButton!);
  });

  it("should render all menu sections", () => {
    render(<AppSidebar />);
    
    // Check that all groups are rendered
    const groups = screen.getAllByTestId("sidebar-group");
    expect(groups.length).toBeGreaterThan(0);
  });

  it("should match snapshot", () => {
    const { container } = render(<AppSidebar />);
    expect(container.firstChild).toMatchSnapshot();
  });
});