"use client";

import { Task } from "@/interfaces/task.interface";
import React, { useEffect, useState } from "react";
import TaskList from "../Tasklist";
import TaskCreator from "../TaskCreator";
import Button from "@/components/Button";

interface TaskWrapperProps {
  projectId: number;
}

export default function TaskWrapper({ projectId }: TaskWrapperProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks`);
      if (response.ok) {
        const tasks = await response.json();
        setTasks(tasks);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const handleTaskCreatorUpdate = (keepOpen: boolean) => {
    fetchTasks();
    if (!keepOpen) {
      setIsAddingSubtask(false);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/tasks`);
        if (response.ok) {
          const tasks = await response.json();
          setTasks(tasks);
        } else {
          console.error("Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };
    fetchTasks();
  }, [projectId]);
  return (
    <div>
      <Button
        label="Add task"
        size="xs"
        className="border-dsashed mt-3 mb-3 ml-auto"
        style="primary"
        onClick={() => setIsAddingSubtask(true)}
      />
      {isAddingSubtask && (
        <TaskCreator
          parentId={projectId}
          type="task"
          onUpdate={(keepOpen) => handleTaskCreatorUpdate(keepOpen)}
        />
      )}
      <TaskList tasks={tasks} onUpdate={fetchTasks} />
    </div>
  );
}
