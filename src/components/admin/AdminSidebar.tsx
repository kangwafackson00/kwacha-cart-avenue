import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

const items = [
  { title: "Overview", key: "overview", icon: LayoutDashboard },
  { title: "Products", key: "products", icon: Package },
  { title: "Orders", key: "orders", icon: ShoppingCart },
  { title: "Users", key: "users", icon: Users },
];

export function AdminSidebar({ activeView, onNavigate }: { activeView: string; onNavigate: (v: string) => void }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && (
              <Link to="/" className="text-lg font-bold text-primary">
                W<span className="text-accent">Y</span>O
              </Link>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeView === item.key}
                    onClick={() => onNavigate(item.key)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
