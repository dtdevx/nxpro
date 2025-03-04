"use client";
import React from "react";

import { format } from "date-fns";
import Button from "@/components/Button";

import { Project } from "@/interfaces/project.interface";
import { Task } from "@/interfaces/task.interface";
import Link from "next/link";

interface ProjectItemProps {
  project: Project;
}

export default function ProjectItem({ project }: ProjectItemProps) {
  if (!project) {
    return null;
  }

  const getTotalSubtasks = (tasks: Task[]) => {
    return tasks.reduce((total: number, task: Task) => {
      return total + (task.subtasks ? task.subtasks.length : 0);
    }, 0);
  };

  return (
    <div>
      <div className="my-3 rounded border border-gray-600 p-3">
        {project.due && (
          <div className="mb-1 text-xs text-gray-300">
            <span className="mr-2 text-gray-700">Due on</span>
            {format(project.due, "MMMM do, yyyy")}
          </div>
        )}
        <div className="my-2 font-bold hover:text-emerald-400">
          <Link href={`/projects/${project.id}`}>{project.title}</Link>
        </div>
        <div className="mb-3 text-gray-400">{project.description}</div>
        <div className="flex items-center">
          <div className="text-sm text-gray-500">
            {project.tasks!.length} Tasks (
            {getTotalSubtasks(project.tasks as Task[])} Subtasks)
          </div>
          <Button
            link={`/projects/${project.id}`}
            label="View project"
            style="secondary-highlight"
            size="xs"
            className="ml-auto"
          />
        </div>
      </div>
    </div>
  );
}
