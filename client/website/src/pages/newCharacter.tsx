import { useState } from "react";
import Navbar from "@/components/navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function NewCharacterPage() {
  const { novelId } = useParams();
  const [name, setName] = useState("");
  const [personality, setPersonality] = useState("");
  const [role, setRole] = useState("");
  const [age, setAge] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (
      !name ||
      name.length <= 2 ||
      !personality ||
      personality.length <= 10 ||
      !role ||
      role.length <= 2 ||
      !age ||
      age <= 0 ||
      age > 150
    ) {
      return;
    }

    setIsloading(true);
    try {
      const response = await axios.post<{
        title: string;
        plot: string;
        _id: string;
      }>(
        `${import.meta.env.VITE_API_ENDPOINT}/api/character/${novelId}`,
        { name, personality, role, age },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      );

      console.log(response.data);
      navigate(`/novel/overview/${novelId}`);
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Failed to create character");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-center" />
      <Navbar />
      <div className="lg:w-7xl m-auto mt-12 flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Name</h1>
          <Input
            placeholder="Name"
            value={name}
            required
            minLength={2}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Role</h1>
          <Input
            placeholder="Role"
            value={role}
            required
            minLength={2}
            maxLength={100}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Age</h1>
          <Input
            placeholder="Age"
            value={age}
            required
            min={0}
            max={150}
            type="number"
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">Character Personality</h1>
            <p className="text-sm text-gray-500">
              Describe the character's personality traits. In more than 10
              characters.
            </p>
          </div>
          <Textarea
            placeholder="Personality"
            value={personality}
            required
            minLength={10}
            maxLength={500}
            onChange={(e) => setPersonality(e.target.value)}
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
            Create Character
          </Button>
        )}
      </div>
    </div>
  );
}
