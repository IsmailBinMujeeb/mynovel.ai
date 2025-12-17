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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function ChaptersPage() {
  const { novelId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [novel, setNovel] = useState<Novel | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<{ novel: Novel }>(`http://localhost:3000/api/novel/n/${novelId}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setNovel(res.data.novel);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [novelId]);

  return (
    <SidebarProvider>
      <AppSidebar activeId="chapters" props={{}} />
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
                  <BreadcrumbPage>Read Novel</BreadcrumbPage>
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
              <h1 className="text-2xl font-bold">Read Novel</h1>
              <p className="text-zinc-400 text-sm">Click on chapter to edit.</p>
            </div>
            <Separator />
            <Table>
              <TableCaption>A list of chapters in {novel?.title}.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Chapter</TableHead>
                  <TableHead>Words</TableHead>
                  <TableHead>Read Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {novel?.chapters.map((chapter) => (
                  <TableRow
                    key={chapter._id}
                    onClick={() =>
                      navigate(
                        `/novel/edit-chapter/${novel._id}/${chapter._id}`,
                      )
                    }
                  >
                    <TableCell className="font-medium">
                      {chapter.title}
                    </TableCell>
                    <TableCell>{chapter.wordCount}</TableCell>
                    <TableCell>~{chapter.readTime} min</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
