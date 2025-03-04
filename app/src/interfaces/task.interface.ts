import { Task as PrismaTask } from "@prisma/client";
import { Subtask } from "@prisma/client";

export interface Task extends PrismaTask {
  subtasks?: Subtask[];
}
