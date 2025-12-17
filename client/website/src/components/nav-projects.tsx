import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useParams, Link } from "react-router-dom";

export function NavProjects({
  projects,
  activeId,
}: {
  projects: {
    name: string;
    url: (novelId: string, chapterId: string) => string;
    icon: LucideIcon;
    id: string;
  }[];
  activeId: string;
}) {
  const { novelId, chapterId } = useParams();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem
            key={item.name}
            className={
              activeId === item.id ? "bg-accent-foreground/10 rounded-xl" : ""
            }
          >
            <SidebarMenuButton asChild>
              <Link to={item.url(novelId || "", chapterId || "")}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
