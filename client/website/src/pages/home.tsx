import { useEffect, useState } from "react";
import axios from "axios";
import type { Novel } from "types/novel.d";
import Navbar from "@/components/navbar";
import { NotebookPenIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import relative from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

dayjs.extend(relative);

export default function HomePage() {
  const [novels, setNovels] = useState<Novel[]>([]);
  const [isLoadingNovels, setIsLoadingNovels] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get<{ novels: Novel[] }>(`http://localhost:3000/api/novel`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setNovels(res.data.novels);
      })
      .catch((error) => console.log(error))
      .finally(() => setIsLoadingNovels(false));
  }, []);

  return (
    <div>
      <Navbar />
      <div className="lg:w-7xl m-auto mt-12 flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">
            Build Your Fantasy, start a novel.
          </h1>
          <div>
            <div
              className="rounded-xl flex items-center py-2 px-4 gap-4 border-2 border-zinc-400 w-fit cursor-pointer"
              onClick={() => navigate("/new/novel")}
            >
              <div className="rounded-sm">
                <NotebookPenIcon className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">New Novel</h2>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Your Novels</h1>
          <p className="text-sm text-zinc-400 mt-2">
            All beautiful novels from your ideas.
          </p>
          <Separator className="my-8" />
          {isLoadingNovels ? (
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <Skeleton className="bg-accent aspect-video rounded-xl" />
                <Skeleton className="bg-accent aspect-video rounded-xl" />
                <Skeleton className="bg-accent aspect-video rounded-xl" />
              </div>
              <Skeleton className="bg-accent min-h-screen flex-1 rounded-xl md:min-h-min" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {novels.map((novel) => (
                <div
                  key={novel._id}
                  className="rounded-xl border-2 border-zinc-400 p-4 cursor-pointer"
                  onClick={() => navigate(`/novel/overview/${novel._id}`)}
                >
                  <h2 className="text-xl font-bold">{novel.title}</h2>
                  <p className="text-sm text-zinc-400 truncate mt-2">
                    {novel.plot}
                  </p>
                  <div className="flex gap-2 my-4 items-center">
                    <p className="text-sm text-zinc-600">
                      Last Edited {dayjs(novel.updatedAt).fromNow()}
                    </p>
                    <p className="text-sm text-zinc-600">•</p>
                    <p className="text-sm text-zinc-600">
                      Chapters {novel.chapters.length}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex gap-4 text-bold text-zinc-500 mt-2">
                    <div className="cursor-pointer hover:text-zinc-900">
                      Edit Novel
                    </div>
                    <div
                      className="cursor-pointer hover:text-red-600"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/novel/settings/${novel._id}`);
                      }}
                    >
                      Delete
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
