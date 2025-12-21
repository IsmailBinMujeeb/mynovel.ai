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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useStreamItem } from "@motiadev/stream-client-react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

import { AlertCircleIcon } from "lucide-react";

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
  const [credits, setCredits] = useState<number>(0);
  const [isCreditsUpdating, setIsCreditsUpdating] = useState<boolean>(false);
  const [isCreditsUpdated, setIsCreditsUpdated] = useState<boolean>(false);
  const navigate = useNavigate();
  const { data: updatedCredits } = useStreamItem<{ credits: number }>({
    groupId: "gid.reduce.credits.plot.enhancer.stream",
    streamName: "reduceCreditsPlotEnhancerStream",
    id: user?.credits._id,
  });

  useEffect(() => {
    if (user) {
      setCredits(user.credits.dailyCredits + user.credits.boughtCredits);
    }
  }, [user]);

  useEffect(() => {
    if (updatedCredits?.credits) {
      setCredits(updatedCredits.credits);
      setIsCreditsUpdated(true);
      setTimeout(() => setIsCreditsUpdated(false), 2000);
    }
  }, [updatedCredits]);

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
        `${import.meta.env.VITE_API_ENDPOINT}/api/chapter/${chapterId}`,
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
        `${import.meta.env.VITE_API_ENDPOINT}/api/novel/write-chapter/${chapterId}`,
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

  if (!user) return <Navigate to="/signin" />;

  if (novel && !novel.form.isAllQuestionsAnswered) {
    return (
      <div className="py-4 px-8">
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>
            Before you can continue, please answer all questions which helps to
            improve your novel.
          </AlertTitle>
          <AlertDescription>
            <Button
              onClick={() => navigate(`/novel/context/${novel._id}`)}
              className="ml-auto cursor-pointer"
            >
              Continue
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
                    <Link to={`/novel/edit-chapter/${novelId}/${c._id}`}>
                      <span>{c.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          {user && (
            <div className="p-2 mt-auto">
              <div className="flex flex-col w-full p-2 rounded-2xl border">
                <p className="font-bold text-sm">
                  <span className={isCreditsUpdated ? "text-red-500" : ""}>
                    {credits}
                  </span>{" "}
                  credits left
                </p>
                <p className="text-zinc-500 text-xs">
                  Resets daily at midnight
                </p>
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
