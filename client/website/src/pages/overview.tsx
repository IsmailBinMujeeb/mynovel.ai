import { AppSidebar } from "@/components/app-sidebar";
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
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Novel } from "types/novel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function OverviewPage() {
  const { novelId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [totalWordsInNovel, setTotalWordsInNovel] = useState<number | null>(
    null,
  );
  const [readTimeOfNovel, setReadTimeOfNovel] = useState<number | null>(null);
  const [avgWordsPerChapter, setAvgWordsPerChapter] = useState<number | null>(
    null,
  );
  const [avgReadTimePerChapter, setAvgReadTimePerChapter] = useState<
    number | null
  >(null);
  const navigate = useNavigate();

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
        const chapters = res.data.novel.chapters;
        const totalWords = chapters.reduce(
          (acc, chapter) => acc + chapter.wordCount,
          0,
        );
        const totalReadTime = chapters.reduce(
          (acc, chapter) => acc + chapter.readTime,
          0,
        );
        const avgWords = totalWords / chapters.length;
        const avgReadTime = totalReadTime / chapters.length;
        setTotalWordsInNovel(totalWords);
        setReadTimeOfNovel(totalReadTime);
        setAvgWordsPerChapter(avgWords);
        setAvgReadTimePerChapter(avgReadTime);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [novelId]);

  return (
    <SidebarProvider>
      <AppSidebar activeId="overview" props={{}} />
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
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        {novel && !novel.form.isAllQuestionsAnswered && (
          <div className="py-4 px-8">
            <Alert>
              <AlertCircleIcon />
              <AlertTitle>
                Before you can continue, please answer all questions which helps
                to improve your novel.
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
        )}{" "}
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
              <h1 className="text-2xl font-bold">Overview</h1>
              <p className="text-zinc-400 text-sm">
                Learn more about your novel and get started
              </p>
            </div>
            <Separator />
            <h1 className="text-xl font-bold">Your Novel</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="bg-muted/50 h-fit rounded-xl">
                <div className="flex p-4 flex-col items-left justify-center">
                  <h2 className="text-xl font-bold">
                    {novel?.chapters.length || 0}
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Total chapters in novel
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 h-fit rounded-xl">
                <div className="flex p-4 flex-col items-left justify-center">
                  <h2 className="text-xl font-bold">
                    {totalWordsInNovel ? totalWordsInNovel.toLocaleString() : 0}
                  </h2>
                  <p className="text-zinc-400 text-sm">Total words in novel</p>
                </div>
              </div>
              <div className="bg-muted/50 h-fit rounded-xl">
                <div className="flex p-4 flex-col items-left justify-center">
                  <h2 className="text-xl font-bold">
                    ~{readTimeOfNovel || 0} min
                  </h2>
                  <p className="text-zinc-400 text-sm">Read time of novel</p>
                </div>
              </div>
              <div className="bg-muted/50 h-fit rounded-xl">
                <div className="flex p-4 flex-col items-left justify-center">
                  <h2 className="text-xl font-bold">
                    {avgWordsPerChapter
                      ? Number(avgWordsPerChapter.toFixed()).toLocaleString()
                      : 0}
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Average words per chapter
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 h-fit rounded-xl">
                <div className="flex p-4 flex-col items-left justify-center">
                  <h2 className="text-xl font-bold">
                    ~{avgReadTimePerChapter || 0} min
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    Average read time per chapter
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
