"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useProjects } from "@/context/ProjectContext";
import { ProjectState } from "@prisma/client";
import Button from "@/components/Button";

export default function NewProjectPage() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [state, setState] = useState("PLANNED");
  const { setProjects } = useProjects();
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${id}`);
        if (response.ok) {
          const project = await response.json();
          setTitle(project.title);
          setDescription(project.description);
          setDue(
            project.due
              ? new Date(project.due).toISOString().split("T")[0]
              : "",
          );
          setState(project.state);
        } else {
          console.error("Failed to fetch project");
        }
      } catch (error) {
        console.error("Failed to fetch project", error);
      }
    };

    fetchProject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProject = { title, description, due, state };

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project,
          ),
        );
        router.push(`/projects/${updatedProject.id}`);
      } else {
        console.error("Failed to update project");
      }
    } catch (error) {
      console.error("Failed to update project", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== +id!),
        );
        router.push("/");
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <h1 className="mb-4 text-2xl">Edit Project</h1>
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
            className="w-full rounded border border-gray-500 px-3 py-2 leading-tight text-gray-100 focus:outline-none"
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
            rows={3}
            className="w-full rounded border border-gray-500 px-3 py-2 leading-tight text-gray-100 focus:outline-none"
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
              className="w-full rounded border border-gray-500 px-3 py-2 leading-tight text-gray-100 focus:outline-none"
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
              className="w-full cursor-pointer appearance-none rounded border border-gray-500 px-3 py-2 leading-tight text-gray-100 focus:outline-none"
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

        <div className="flex gap-4">
          <Button
            label="Save Project"
            size="sm"
            type="submit"
            style="primary"
          />
          <Button label="Cancel" size="sm" onClick={() => router.back()} />
          <Button
            label="Delete Project"
            style="danger"
            size="sm"
            onClick={handleDelete}
            className="ml-auto"
          />
        </div>
      </form>
    </div>
  );
}
