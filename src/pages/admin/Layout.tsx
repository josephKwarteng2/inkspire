import React from "react";
import {
  Home,
  FileText,
  BarChart2,
  PanelLeft,
  PanelRight,
  MessageCircle,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarCollapseButton = () => {
  const { state, toggleSidebar } = useSidebar();
  if (state !== "collapsed") {
    return (
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 p-1 rounded hover:bg-muted transition"
        aria-label="Collapse sidebar"
        type="button"
      >
        <PanelLeft className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleSidebar}
      className="fixed top-4 left-2 z-50 p-2 rounded-full bg-background shadow border hover:bg-muted transition"
      aria-label="Expand sidebar"
      type="button"
    >
      <PanelRight className="w-5 h-5" />
    </button>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

function LayoutInner({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar
        className="border-r relative flex-shrink-0 h-full"
        collapsible="icon"
      >
        <SidebarHeader className="relative pb-8">
          {state !== "collapsed" && (
            <span className="font-bold text-lg tracking-tight">Admin</span>
          )}
          <SidebarCollapseButton />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/admin/dashboard")}
                isActive={location.pathname === "/admin/dashboard"}
                className={
                  location.pathname === "/admin/dashboard"
                    ? "bg-primary/10 text-primary"
                    : ""
                }
                tooltip="Dashboard"
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/admin/categories")}
                isActive={location.pathname === "/admin/categories"}
                className={
                  location.pathname === "/admin/categories"
                    ? "bg-primary/10 text-primary"
                    : ""
                }
                tooltip="Categories"
              >
                <FileText className="w-4 h-4" />
                <span>Categories</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/admin/posts")}
                isActive={location.pathname === "/admin/posts"}
                className={
                  location.pathname === "/admin/posts"
                    ? "bg-primary/10 text-primary"
                    : ""
                }
                tooltip="Posts"
              >
                <FileText className="w-4 h-4" />
                <span>Posts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/admin/comments")}
                isActive={location.pathname === "/admin/comments"}
                className={
                  location.pathname === "/admin/comments"
                    ? "bg-primary/10 text-primary"
                    : ""
                }
                tooltip="Comments"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Comments</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/admin/analytics")}
                isActive={location.pathname === "/admin/analytics"}
                className={
                  location.pathname === "/admin/analytics"
                    ? "bg-primary/10 text-primary"
                    : ""
                }
                tooltip="Analytics"
              >
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div
            className={`w-full h-full transition-all duration-200 ease-linear ${
              state === "collapsed" ? "p-4 sm:p-6 lg:p-8" : "p-4 sm:p-6 lg:p-12"
            }`}
          >
            <div className="max-w-full">{children}</div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}

const Layout: React.FC<AdminLayoutProps> = (props) => {
  return (
    <SidebarProvider>
      <LayoutInner {...props} />
    </SidebarProvider>
  );
};

export default Layout;
