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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from "axios";
import { useStreamItem } from "@motiadev/stream-client-react";

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
  const [credits, setCredits] = React.useState<number>(0);
  const [isCreditsUpdating, setIsCreditsUpdating] =
    React.useState<boolean>(false);
  const [isCreditsUpdated, setIsCreditsUpdated] =
    React.useState<boolean>(false);
  const { data: updatedCredits } = useStreamItem<{ credits: number }>({
    groupId: "gid.reduce.credits.plot.enhancer.stream",
    streamName: "reduceCreditsPlotEnhancerStream",
    id: user?.credits._id,
  });

  React.useEffect(() => {
    if (user) {
      setCredits(user.credits.dailyCredits + user.credits.boughtCredits);
    }
  }, [user]);

  React.useEffect(() => {
    if (updatedCredits?.credits) {
      setCredits(updatedCredits.credits);
      setIsCreditsUpdated(true);
      setTimeout(() => setIsCreditsUpdated(false), 2000);
    }
  }, [updatedCredits]);

  const handleCredits = async () => {
    if (!user) return;
    setIsCreditsUpdating(true);
    try {
      const response = await axios.put<{ credits: number; success: boolean }>(
        `${import.meta.env.VITE_API_ENDPOINT}/api/credits/${user.credits._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      if (response.data.success) {
        setCredits(response.data.credits);
        toast.success("Credits updated successfully");
      } else {
        console.error("Failed to update credits");
        toast.error("Failed to update credits");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update credits");
    } finally {
      setIsCreditsUpdating(false);
    }
  };

  if (!user) return <Navigate to={"/signin"} />;

  return (
    <Sidebar collapsible="icon" {...props}>
      <Toaster position="top-center" />
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} activeId={activeId} />
        {user && (
          <div className="p-2 mt-auto">
            <div className="flex flex-col w-full p-2 rounded-2xl border">
              <p className="font-bold text-sm">
                <span className={isCreditsUpdated ? "text-red-500" : ""}>
                  {credits}
                </span>{" "}
                credits left
              </p>
              <p className="text-zinc-500 text-xs">Resets daily at midnight</p>
              <Separator className="my-2" />
              <p className="text-xs">
                Just for Motia Backend Reloaded hackathon, We are making all
                credits available for free. Just click the button below to get
                started.
              </p>
              <Button
                className="mt-2 cursor-pointer"
                onClick={handleCredits}
                disabled={isCreditsUpdating}
              >
                {isCreditsUpdating ? (
                  <Spinner className="size-4" />
                ) : (
                  "Get Started"
                )}
              </Button>
            </div>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
