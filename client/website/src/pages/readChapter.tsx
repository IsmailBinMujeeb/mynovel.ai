import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import type { Chapter } from "types/chapter";
import type { Novel } from "types/novel";
import { NavUser } from "@/components/nav-user";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth.context";

export default function ReadChapterPage() {
  const { chapterId, novelId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [novel, setNovel] = useState<Novel | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get<{ novel: Novel }>(
        `${import.meta.env.VITE_API_ENDPOINT}/api/novel/n/${novelId}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )
      .then((res) => {
        setNovel(res.data.novel);
        const c = res.data.novel.chapters.find((c) => c._id === chapterId);
        if (c) {
          setChapter(c);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [novelId, chapterId]);

  if (!user) return <Navigate to="/signin" />;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Chapters</SidebarGroupLabel>
            <SidebarMenu>
              {novel?.chapters.map((c) => (
                <SidebarMenuItem key={c._id}>
                  <SidebarMenuButton
                    asChild
                    className={c._id === chapterId ? `bg-accent` : ``}
                  >
                    <Link to={`/novel/read-chapter/${novelId}/${c._id}`}>
                      <span>{c.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/home">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/novel/read/${novel?._id}`}>
                    {novel?.title}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{chapter?.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {isLoading ? (
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <Skeleton className="bg-muted aspect-video rounded-xl" />
              <Skeleton className="bg-muted aspect-video rounded-xl" />
              <Skeleton className="bg-muted aspect-video rounded-xl" />
            </div>
            <Skeleton className="bg-muted min-h-screen flex-1 rounded-xl md:min-h-min" />
          </div>
        ) : (
          <div className="py-4 px-8 flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold">{chapter?.title}</h1>
            </div>
            <pre className="text-zinc-800 text-sm text-wrap">
              {chapter?.content}
            </pre>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
