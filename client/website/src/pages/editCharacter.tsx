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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import type { Character } from "types/character";
import { Button } from "@/components/ui/button";

export default function EditCharacterPage() {
  const { characterId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    axios
      .get<{ character: Character }>(
        `${import.meta.env.VITE_API_ENDPOINT}/api/character/${characterId}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )
      .then((res) => {
        setCharacter(res.data.character);
      })
      .catch((err) =>
        toast.error(
          err.message || `Something went wrong, Please try again later.`,
        ),
      )
      .finally(() => setIsLoading(false));
  }, [characterId]);

  const handleSave = async () => {
    if (!character) return;
    setIsSaving(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_ENDPOINT}/api/character/${character._id}`,
        { ...character },
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );
      toast.success("Character saved successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(
          error.message || `Something went wrong, Please try again later.`,
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SidebarProvider>
      <Toaster position="top-center" />
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/novel/characters">
                    Characters
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Edit Character</BreadcrumbPage>
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
              <h1 className="text-2xl font-bold">Edit Character</h1>
              <p className="text-zinc-400 text-sm">
                Manage your character's details
              </p>
            </div>
            <Separator />
            {character && (
              <>
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl font-bold">Character Name</h1>
                  <Input
                    placeholder="Character Name"
                    value={character?.name || ""}
                    required
                    onChange={(e) =>
                      setCharacter({ ...character!, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl font-bold">Character Role</h1>
                  <Input
                    placeholder="Character Role"
                    value={character?.role || ""}
                    required
                    onChange={(e) =>
                      setCharacter({ ...character!, role: e.target.value })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl font-bold">Character Age</h1>
                  <Input
                    type="number"
                    placeholder="Character Age"
                    value={character?.age || 0}
                    required
                    onChange={(e) =>
                      setCharacter({
                        ...character!,
                        age: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-xl font-bold">Character Personality</h1>
                  <Textarea
                    placeholder="Personalities..."
                    value={character?.personality || ""}
                    required
                    onChange={(e) =>
                      setCharacter({
                        ...character!,
                        personality: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}
            {isSaving ? (
              <Button type="submit" className="w-fit cursor-pointer" disabled>
                Saving...
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-fit cursor-pointer"
                onClick={handleSave}
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
