import { Project as PrismaProject } from "@prisma/client";
import { Task } from "./task.interface";

export interface Project extends PrismaProject {
  tasks?: Task[];
}
