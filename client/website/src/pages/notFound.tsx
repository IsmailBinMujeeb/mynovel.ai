import Navbar from "@/components/navbar";

export default function NotFoundPage() {
  return (
    <div>
      <Navbar />
      <div className="lg:w-7xl m-auto mt-12 flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">404 Page Not Found</h1>
        </div>
      </div>
    </div>
  );
}
