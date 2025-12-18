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
import { useParams, Navigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useStreamItem } from "@motiadev/stream-client-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function EditChapterPage() {
  const { chapterId, novelId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [isWritingChapter, setIsWritingChapter] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterContent, setChapterContent] = useState("");
  const [chapterPrompt, setChapterPrompt] = useState("");
  const { user } = useAuth();

  const { data: newChapterContent } = useStreamItem<{
    content: string;
    isCompleted: boolean;
  }>({
    id: novelId,
    groupId: "gid.write.chapter.stream",
    streamName: "writeChapterStream",
  });

  useEffect(() => {
    axios
      .get<{ novel: Novel }>(`http://localhost:3000/api/novel/n/${novelId}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setNovel(res.data.novel);
        const c = res.data.novel.chapters.find((c) => c._id === chapterId);
        if (c) {
          setChapter(c);
          setChapterTitle(c.title);
          setChapterContent(c.content);
          setChapterPrompt(c.chapterPrompt || "");
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [novelId, chapterId]);

  useEffect(() => {
    if (!newChapterContent) return;
    setChapterContent(newChapterContent.content);

    if (newChapterContent.isCompleted) {
      setIsWritingChapter(false);
    }

    console.log(newChapterContent);
  }, [newChapterContent]);

  const handleSave = async () => {
    if (!chapter || !chapterTitle || !chapterContent) return;
    setIsSaving(true);
    try {
      const res = await axios.put(
        `http://localhost:3000/api/chapter/${chapterId}`,
        {
          title: chapterTitle,
          content: chapterContent,
          chapterNumber: chapter.chapterNumber,
          chapterPrompt: chapterPrompt,
        },
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      console.log(res.data);
      toast.success("Chapter saved successfully");
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Failed to write chapter");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartChapterWriting = async () => {
    if (!chapter || !chapterTitle || !chapterContent || !chapterPrompt) return;
    setIsWritingChapter(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/novel/write-chapter/${chapterId}`,
        {
          title: chapterTitle,
          content: chapterContent,
          prompt: chapterPrompt,
        },
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      console.log(res.data);
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Failed to write chapter");
    }
  };

  if (!user) return <Navigate to="/signin" />;

  return (
    <SidebarProvider>
      <Toaster position="top-center" />
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
                    <a href={`/novel/read-chapter/${novelId}/${c._id}`}>
                      <span>{c.title}</span>
                    </a>
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
                  <BreadcrumbLink href={`/novel/chapters/${novel?._id}`}>
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
            {isSaving ? (
              <Button className="w-fit ml-auto cursor-pointer" disabled>
                Saving...
              </Button>
            ) : (
              <Button
                className="w-fit ml-auto cursor-pointer"
                onClick={handleSave}
              >
                Save
              </Button>
            )}
            <div>
              <Input
                className="text-2xl font-bold"
                value={chapterTitle}
                onChange={(e) => setChapterTitle(e.target.value)}
              />
            </div>
            <Textarea
              className="text-zinc-800 text-sm"
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
            />
          </div>
        )}
      </SidebarInset>
      {isLoading ? (
        <div className="flex w-sm flex-col gap-4 p-4 border-l bg-accent">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Skeleton className="bg-muted aspect-video rounded-xl" />
            <Skeleton className="bg-muted aspect-video rounded-xl" />
            <Skeleton className="bg-muted aspect-video rounded-xl" />
          </div>
          <Skeleton className="bg-muted min-h-screen flex-1 rounded-xl md:min-h-min" />
        </div>
      ) : (
        <div className="flex w-sm flex-col gap-4 p-4 border-l bg-zinc-50">
          <h1 className="text-2xl font-bold">Prompt</h1>
          <Textarea
            placeholder="Prompt"
            value={chapterPrompt || ""}
            required
            onChange={(e) => setChapterPrompt(e.target.value)}
          />
          <Button
            className="cursor-pointer"
            onClick={handleStartChapterWriting}
            disabled={isWritingChapter}
          >
            {isWritingChapter ? "Writing..." : "Start Write"}
          </Button>
        </div>
      )}
    </SidebarProvider>
  );
}
