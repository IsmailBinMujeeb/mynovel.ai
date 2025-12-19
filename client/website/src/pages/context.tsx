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
import type { Context } from "types/context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function SettingsPage() {
  const { novelId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [context, setContext] = useState<Context | null>(null);

  useEffect(() => {
    axios
      .get<{ form: Context }>(
        `${import.meta.env.VITE_API_ENDPOINT}/api/form/answer/${novelId}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )
      .then((res) => {
        setContext(res.data.form);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [novelId]);

  const handleSubmit = async () => {
    if (!context) return;
    if (!context.fields.every((field) => field.answer)) {
      return toast("All fields are required", {
        action: {
          label: "Ok",
          onClick: () => {
            console.log("Clicked");
          },
        },
      });
    }

    setIsSaving(true);
    try {
      const response = await axios.put<{
        title: string;
        plot: string;
        _id: string;
        success: boolean;
      }>(
        `${import.meta.env.VITE_API_ENDPOINT}/api/form/answer/${context._id}`,
        { fields: context.fields },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      console.log(response.data);

      if (response.data.success) {
        toast("Context has been saved", {
          action: {
            label: "Ok",
            onClick: () => {
              console.log("Clicked");
            },
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SidebarProvider>
      <Toaster position="top-center" />
      <AppSidebar activeId="novel-context" props={{}} />
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
                  <BreadcrumbPage>Context Questions</BreadcrumbPage>
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
              <h1 className="text-2xl font-bold">Context Questions</h1>
              <p className="text-zinc-400 text-sm">
                This questions helps AI to better understand your novel.
              </p>
            </div>
            <Separator />
            {context?.fields.map((field) => (
              <div className="flex flex-col gap-4" key={field._id}>
                <h1 className="text-2xl font-bold">{field.label}</h1>
                <Input
                  placeholder={field.label}
                  value={field.answer || ""}
                  required
                  onChange={(e) => {
                    const updatedFields = [...context.fields];
                    updatedFields[updatedFields.indexOf(field)].answer =
                      e.target.value;
                    setContext({ ...context, fields: updatedFields });
                  }}
                />
              </div>
            ))}
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
