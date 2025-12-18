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
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { Chapter } from "types/chapter";

export default function NewChapterPage() {
  const { novelId } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [chapterTitle, setChapterTitle] = useState<string | null>(null);
  const [chapterPrompt, setChapterPrompt] = useState<string | null>(null);
  const [chapterNumber, setChapterNumber] = useState<number | null>(null);
  const [isPrologue, setIsPrologue] = useState<boolean | null>(null);
  const [isEpilogue, setIsEpilogue] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!chapterTitle || !chapterPrompt || !chapterNumber) {
      return toast.error("Title, Prompt and Chapter number are required");
    }

    setIsSaving(true);
    try {
      const response = await axios.post<{
        chapter: Chapter;
      }>(
        `http://localhost:3000/api/chapter/${novelId}`,
        {
          title: chapterTitle,
          chapterPrompt,
          chapterNumber,
          isPrologue: isPrologue || false,
          isEpilogue: isEpilogue || false,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      console.log(response.data);

      toast.success("Chapter created successfully");
      navigate(`/novel/edit-chapter/${novelId}/${response.data.chapter._id}`);
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Failed to create chapter");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SidebarProvider>
      <Toaster position="top-center" />
      <AppSidebar activeId="new-chapter" props={{}} />
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
                  <BreadcrumbPage>New Chapter</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="py-4 px-8 flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">Create New Chapter</h1>
            <p className="text-zinc-400 text-sm">
              Describe the chapter's plot and title and AI will do the work.
            </p>
          </div>
          <Separator />
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Chapter Title</h1>
            <Input
              placeholder="Title"
              value={chapterTitle || ""}
              required
              onChange={(e) => setChapterTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Chapter Prompt</h1>
            <p className="text-sm text-zinc-400">
              This prompt will be used to describe what happens in the chapter.
              It's like plot of chapter but prompt for AI.
            </p>
            <Textarea
              placeholder="Prompt"
              value={chapterPrompt || ""}
              required
              onChange={(e) => setChapterPrompt(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold">Chapter Number</h1>
            <Input
              placeholder="Number"
              value={chapterNumber || "0"}
              required
              type="number"
              min={1}
              max={200}
              onChange={(e) => setChapterNumber(Number(e.target.value))}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex gap-2">
              <Checkbox
                checked={isPrologue || false}
                onCheckedChange={() => {
                  setIsPrologue((prev) => !prev);
                  setIsEpilogue(false);
                }}
              />
              <Label className="text-zinc-800">Is Prologue</Label>
            </div>
            <div className="flex gap-2">
              <Checkbox
                checked={isEpilogue || false}
                onCheckedChange={() => {
                  setIsEpilogue((prev) => !prev);
                  setIsPrologue(false);
                }}
              />
              <Label className="text-zinc-800">Is Epilogue</Label>
            </div>
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
      </SidebarInset>
    </SidebarProvider>
  );
}
