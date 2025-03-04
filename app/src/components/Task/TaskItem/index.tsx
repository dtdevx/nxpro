"use client";
import React, { useState } from "react";

import { Task } from "@/interfaces/task.interface";
import { Subtask } from "@prisma/client";
import TaskStateSwitcher from "../TaskStateSwitcher";
import { TaskState } from "@prisma/client";
import TaskList from "../Tasklist";
import { format } from "date-fns";
import TaskItemEdit from "../TaskItemEdit";
import Button from "@/components/Button";
import TaskCreator from "../TaskCreator";

interface TaskItemProps {
  task: Task | Subtask;
  onUpdate: () => void;
}

export default function TaskItem({ task, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const isTask = (workable: Task | Subtask): workable is Task => {
    return (workable as Task).projectId !== undefined;
  };

  const handleStateUpdate = async (newState: TaskState) => {
    if (task.state === newState) return;
    try {
      const ressource = isTask(task) ? "tasks" : "subtasks";
      const response = await fetch(`/api/${ressource}/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ state: newState }),
      });

      if (response.ok) {
        onUpdate();
      } else {
        console.error("Failed to update task state");
      }
    } catch (error) {
      console.error("Failed to update task state", error);
    }
  };

  let itemClassName = "my-3 rounded border border-gray-600 p-3";
  if (!isTask(task)) {
    itemClassName += " ml-10";
  }

  const handleEditUpdate = () => {
    setIsEditing(false);
    onUpdate();
  };

  const handleTaskCreatorUpdate = (keepOpen: boolean) => {
    onUpdate();
    if (!keepOpen) {
      setIsAddingSubtask(false);
    }
  };

  return (
    <div>
      {!isEditing ? (
        <div className={itemClassName}>
          <div className="font-bold">{task.title}</div>
          {task.due && (
            <div className="my-3 text-xs text-gray-300">
              <span className="mr-2 text-gray-700">Due on</span>
              {format(task.due, "MMMM do, yyyy")}
            </div>
          )}
          <div className="text-gray-400">{task.description}</div>
          <div className="mt-3 items-center gap-2 sm:flex">
            {task.state && (
              <TaskStateSwitcher
                currentState={task.state}
                onStateUpdate={handleStateUpdate}
              />
            )}
            <div className="mt-5 ml-auto flex gap-2 sm:mt-0">
              <Button
                label="Edit"
                style="secondary-highlight"
                size="xs"
                onClick={() => setIsEditing(true)}
              />
              {isTask(task) && (
                <Button
                  label="Add Subtask"
                  style="secondary-highlight"
                  size="xs"
                  onClick={() => setIsAddingSubtask(true)}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <TaskItemEdit task={task} onUpdate={handleEditUpdate} />
      )}
      {isAddingSubtask && (
        <TaskCreator
          type="subtask"
          parentId={task.id}
          onUpdate={(keepOpen) => handleTaskCreatorUpdate(keepOpen)}
        />
      )}
      {isTask(task) && task.subtasks && (
        <TaskList tasks={task.subtasks} onUpdate={() => onUpdate()} />
      )}
    </div>
  );
}
