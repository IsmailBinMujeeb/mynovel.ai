import { useState } from "react";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewNovelPage() {
  const [title, setTitle] = useState("");
  const [plot, setPlot] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !plot || plot.length < 20) {
      return;
    }

    setIsloading(true);
    try {
      const response = await axios.post<{
        title: string;
        plot: string;
        _id: string;
      }>(
        "http://localhost:3000/api/novel",
        { title, plot },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      console.log(response.data);
      navigate(`/novel/overview/${response.data._id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="lg:w-7xl m-auto mt-12 flex flex-col gap-12">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Novel Title</h1>
          <Input
            placeholder="Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">Novel Plot</h1>
            <p className="text-sm text-gray-500">
              Plot should be at least 20 characters long.
            </p>
          </div>
          <Textarea
            placeholder="Plot"
            value={plot}
            required
            minLength={20}
            onChange={(e) => setPlot(e.target.value)}
          />
        </div>
        {isLoading ? (
          <Button type="submit" className="w-fit cursor-pointer" disabled>
            Creating...
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-fit cursor-pointer"
            onClick={handleSubmit}
          >
            Create Novel
          </Button>
        )}
      </div>
    </div>
  );
}
