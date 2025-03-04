"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import { TaskState } from "@prisma/client";

interface TaskCreatorProps {
  parentId: number;
  type?: "task" | "subtask";
  onUpdate: (keepOpen: boolean) => void;
}

export default function TaskCreator({
  parentId,
  type = "task",
  onUpdate,
}: TaskCreatorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [state, setState] = useState<TaskState | string>("OPEN");

  const resetItemState = () => {
    setTitle("");
    setDescription("");
    setDue(new Date().toISOString().split("T")[0]);
    setState("OPEN");
  };

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleAddTask = async (keepOpen = false) => {
    const task = { title, description, due, state };

    if (!title || title.length === 0) {
      return;
    }

    try {
      let ressource = "";
      let body = {};
      if (type === "task") {
        ressource = "tasks";
        body = { ...task, projectId: parentId };
      } else {
        ressource = "subtasks";
        body = { ...task, taskId: parentId };
      }
      const response = await fetch(`/api/${ressource}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onUpdate(keepOpen);
        resetItemState();
      } else {
        console.error("Failed to update task");
      }
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleCancel = () => {
    resetItemState();
    onUpdate(false);
  };
  return (
    <div>
      <div
        className={
          `rounded border border-dashed border-gray-600 p-3 text-sm` +
          (type === "subtask" ? " ml-10" : "")
        }
      >
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
              rows={4}
              className="focus:shadow-outline w-full appearance-none rounded border border-gray-500 px-3 py-2 leading-tight text-gray-100 shadow focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-400"
                htmlFor="due"
              >
                Due Date<span className="ml-1 text-gray-500">*</span>
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
                {Object.keys(TaskState).map((state) => (
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

          <div className="flex items-center gap-4">
            <Button
              label="Add"
              size="sm"
              style="primary"
              onClick={() => {
                handleAddTask();
              }}
            />
            <Button
              label="Add & New"
              size="sm"
              style="secondary-highlight"
              onClick={() => {
                handleAddTask(true);
              }}
            />
            <Button
              label="Cancel"
              size="sm"
              onClick={handleCancel}
              className="ml-auto"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
