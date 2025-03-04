"use client";
import React from "react";

import { TaskState } from "@prisma/client";
import Button from "@/components/Button";

interface TaskStateSwitcherProps {
  currentState: TaskState;
  onStateUpdate: (state: TaskState) => void;
}

export default function TaskStateSwitcher({
  currentState,
  onStateUpdate,
}: TaskStateSwitcherProps) {
  return (
    <>
      <div className="flex gap-3 text-xs">
        {Object.keys(TaskState).map((state) => {
          return (
            <Button
              key={state}
              label={state}
              size="xs"
              style="secondary-dimmed"
              onClick={() => onStateUpdate(state as TaskState)}
              className={
                `btn-task-state-${state.toLowerCase()}` +
                (currentState == state ? " active cursor-default" : "")
              }
            />
          );
        })}
      </div>
    </>
  );
}
