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
import type { Character } from "types/character";
import { Button } from "@/components/ui/button";

export default function CharactersPage() {
  const { novelId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState<Character[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<{ characters: Character[] }>(
        `${import.meta.env.VITE_API_ENDPOINT}/api/characters/${novelId}`,
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )
      .then((res) => {
        setCharacters(res.data.characters);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [novelId]);

  return (
    <SidebarProvider>
      <AppSidebar activeId="characters" props={{}} />
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
                  <BreadcrumbPage>Characters</BreadcrumbPage>
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Characters</h1>
                <p className="text-zinc-400 text-sm">
                  Click on character to edit.
                </p>
              </div>
              <Button
                className="cursor-pointer"
                onClick={() => navigate(`/novel/new-character/${novelId}`)}
              >
                Add Character
              </Button>
            </div>
            <Separator />
            <Table>
              <TableCaption>A list of characters.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Personality</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {characters &&
                  characters.map((c) => (
                    <TableRow
                      key={c._id}
                      onClick={() => navigate(`/novel/edit-character/${c._id}`)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.role}</TableCell>
                      <TableCell>{c.age}</TableCell>
                      <TableCell>{c.personality}</TableCell>
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
