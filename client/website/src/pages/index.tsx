import Navbar from "@/components/navbar";

export default function IndexPage() {
  return (
    <div>
      <Navbar />
      <div className="lg:w-7xl m-auto mt-12 flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">
            Build Your Fantasy, start a novel.
          </h1>
          <p className="text-lg text-zinc-400 w-5xl">
            Start your journey with MyNovel today! Create your own unique story,
            explore new worlds, and connect with fellow writers. Join our
            vibrant community of writers and readers, and let your imagination
            run wild.
          </p>
        </div>
      </div>
    </div>
  );
}
