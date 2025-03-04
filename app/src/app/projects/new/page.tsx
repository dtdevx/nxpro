"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/context/ProjectContext";
import { ProjectState } from "@prisma/client";
import Button from "@/components/Button";

export default function NewProjectPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [state, setState] = useState("PLANNED");
  const { setProjects } = useProjects();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = { title, description, due, state };

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        const createdProject = await response.json();
        setProjects((prevProjects) => [...prevProjects, createdProject]);
        router.push(`/projects/${createdProject.id}`);
      } else {
        console.error("Failed to create projectxxx");
      }
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h1 className="mb-4 text-2xl">Create New Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-bold text-gray-400"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="focus:shadow-outline w-full appearance-none rounded border border-gray-500 px-3 py-2 leading-tight text-gray-100 shadow focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="mb-2 block text-sm font-bold text-gray-400"
            htmlFor="description"
          >
            Description<span className="ml-1 text-gray-500">*</span>
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="focus:shadow-outline w-full appearance-none rounded border border-gray-500 px-3 py-2 leading-tight text-gray-100 shadow focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-400"
              htmlFor="due"
            >
              Due Date
            </label>
            <input
              id="due"
              type="date"
              min={today}
              value={due}
              onChange={(e) => setDue(e.target.value)}
              className="focus:shadow-outline w-full appearance-none rounded border border-gray-500 px-3 py-2 leading-tight text-gray-100 shadow focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-400"
              htmlFor="state"
            >
              State
            </label>
            <select
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="focus:shadow-outline w-full cursor-pointer appearance-none rounded border border-gray-500 px-3 py-2 leading-tight text-gray-100 shadow focus:outline-none"
              required
            >
              {Object.keys(ProjectState).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 mb-8 flex items-center text-sm text-gray-500">
          <span className="mr-1 text-2xl">*</span>
          <span>Optional field</span>
        </div>

        <div className="flex">
          <Button label="Create Project" style="primary" type="submit" />
          <Button
            className="ml-auto"
            label="Cancel"
            onClick={() => router.back()}
          />
        </div>
      </form>
    </div>
  );
}
