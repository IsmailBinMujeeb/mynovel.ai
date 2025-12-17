"use client";

import * as React from "react";
import {
  BookCheck,
  CircleFadingPlus,
  FilePlus,
  FolderKanban,
  Settings,
  TableOfContents,
} from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth.context";
import { Navigate } from "react-router-dom";

// This is sample data.
const data = {
  projects: [
    {
      name: "Overview",
      url: (novelId: string) => `/novel/overview/${novelId}`,
      icon: FolderKanban,
      id: "overview",
    },
    {
      name: "New Chapter",
      url: (novelId: string) => `/novel/new-chapter/${novelId}`,
      icon: FilePlus,
      id: "new-chapter",
    },
    {
      name: "Chapters",
      url: (novelId: string) => `/novel/chapters/${novelId}`,
      icon: TableOfContents,
      id: "chapters",
    },
    {
      name: "Read Novel",
      url: (novelId: string) => `/novel/read/${novelId}`,
      icon: BookCheck,
      id: "read-novel",
    },
    {
      name: "Novel Context",
      url: (novelId: string) => `/novel/context/${novelId}/`,
      icon: CircleFadingPlus,
      id: "novel-context",
    },
    {
      name: "General Settings",
      url: (novelId: string) => `/novel/settings/${novelId}/`,
      icon: Settings,
      id: "general-settings",
    },
  ],
};

export function AppSidebar({
  activeId,
  ...props
}: {
  props: React.ComponentProps<typeof Sidebar>;
  activeId: string;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to={"/signin"} />;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} activeId={activeId} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
