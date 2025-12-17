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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const { novelId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [plot, setPlot] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<{ novel: Novel }>(`http://localhost:3000/api/novel/n/${novelId}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setTitle(res.data.novel.title);
        setPlot(res.data.novel.plot);
        setNovel(res.data.novel);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [novelId]);

  const handleSubmit = async () => {
    if (!title || !plot) {
      return;
    }

    if (novel?.title === title && novel?.plot === plot) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await axios.put<{
        title: string;
        plot: string;
        _id: string;
      }>(
        `http://localhost:3000/api/novel/${novelId}`,
        { title, plot },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar activeId="general-settings" props={{}} />
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
                  <BreadcrumbPage>Settings</BreadcrumbPage>
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
        )}
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
              <h1 className="text-2xl font-bold">General Settings</h1>
              <p className="text-zinc-400 text-sm">Manage your novel</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">Novel Title</h1>
              <Input
                placeholder="Title"
                value={title || ""}
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">Novel Plot</h1>
              <Textarea
                placeholder="Plot"
                value={plot || ""}
                required
                onChange={(e) => setPlot(e.target.value)}
              />
            </div>
            {isSaving ? (
              <Button type="submit" className="w-fit cursor-pointer" disabled>
                Saving...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-fit cursor-pointer"
                onClick={handleSubmit}
              >
                Save
              </Button>
            )}
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
