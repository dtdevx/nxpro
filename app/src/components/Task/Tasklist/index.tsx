"use client";
import React from "react";

import { Task } from "@/interfaces/task.interface";
import { Subtask } from "@prisma/client";
import TaskItem from "../TaskItem";

interface TaskListProps {
  tasks: Task[] | Subtask[];

  onUpdate: () => void;
}

export default function TaskList({ tasks, onUpdate }: TaskListProps) {
  return (
    <>
      <div className="text-sm">
        <ul>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={onUpdate} />
          ))}
        </ul>
      </div>
    </>
  );
}
