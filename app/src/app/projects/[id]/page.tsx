import Button from "@/components/Button";
import Tasks from "@/components/Task/TaskWrapper";
import { PrismaClient } from "@prisma/client";
import { format } from "date-fns";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const id = +(await params).id;
  const prisma = new PrismaClient();
  const project = await prisma.project.findUnique({
    where: {
      id,
    },
  });
  if (!project) return null;

  return (
    <div>
      <div className="mb-4 flex h-7 items-center">
        <div
          className={`inline-block py-1 text-xs project-state-${project.state!.toLowerCase()}`}
        >
          {project.state}
        </div>
        {project.due && (
          <>
            <div className="mr-2.5 ml-3 text-gray-700">|</div>
            <div className="mr-2 text-gray-700">Due on</div>
            <div className="text-gray-200">
              {format(project.due, "MMMM do, yyyy")}
            </div>
          </>
        )}
        <div className="grow-1 text-right">
          <Button
            label="Edit"
            style="secondary-highlight"
            size="xs"
            link={`/projects/${project.id}/edit`}
          />
        </div>
      </div>
      <hr className="mt-5 mb-4 text-gray-800" />
      <div className="mb-3 text-2xl">{project.title}</div>
      <div className="mb-5">{project.description}</div>
      <div>
        <div className="text-sm font-semibold text-gray-500">TASKS</div>
        <Tasks projectId={project.id} />
      </div>
    </div>
  );
}
