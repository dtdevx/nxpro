"use client";
import React, { useState } from "react";

import { Task } from "@/interfaces/task.interface";
import { Subtask } from "@prisma/client";

import { TaskState } from "@prisma/client";
import Button from "@/components/Button";

interface TaskItemEditProps {
  task: Task | Subtask;
  onUpdate: () => void;
}

export default function TaskItemEdit({ task, onUpdate }: TaskItemEditProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [due, setDue] = useState(
    task.due ? new Date(task.due).toISOString().split("T")[0] : "",
  );
  const [state, setState] = useState<TaskState | string>(
    task.state || TaskState.OPEN,
  );

  const resetItemState = () => {
    setTitle(task.title);
    setDescription(task.description || "");
    setDue(task.due ? new Date(task.due).toISOString().split("T")[0] : "");
    setState(task.state || TaskState.OPEN);
  };

  const today = new Date().toISOString().split("T")[0];

  const isTask = (workable: Task | Subtask): workable is Task => {
    return (workable as Task).projectId !== undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedTask = { title, description, due, state };

    try {
      const ressource = isTask(task) ? "tasks" : "subtasks";
      const response = await fetch(`/api/${ressource}/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        onUpdate();
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
    onUpdate();
  };

  const handleDelete = async () => {
    try {
      const ressource = isTask(task) ? "tasks" : "subtasks";
      const response = await fetch(`/api/${ressource}/${task.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        resetItemState();
        onUpdate();
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  return (
    <div className="my-3 rounded border border-gray-600 p-3">
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
          <Button label="Save" size="sm" type="submit" style="primary" />
          <Button label="Cancel" size="sm" onClick={handleCancel} />
          <Button
            label="Delete"
            size="sm"
            style="danger"
            onClick={handleDelete}
            className="ml-auto"
          />
        </div>
      </form>
    </div>
  );
}
