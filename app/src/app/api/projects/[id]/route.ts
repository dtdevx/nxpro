import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProjectState } from "@prisma/client";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = +(await params).id;
    const project = await prisma.project.findUnique({
      where: { id: id },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

interface PartialProject {
  title?: string;
  description?: string;
  due?: string | Date | null;
  state?: ProjectState;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = +(await params).id;
    const body: PartialProject = await req.json();
    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (body.due === "") {
      body.due = null;
    }
    if (body.due) {
      body.due = new Date(body.due);
    }
    const updatedProject = await prisma.project.update({
      where: { id },
      data: { ...project, ...body },
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = +(await params).id;

    const tasks = await prisma.task.findMany({
      where: { projectId: id },
    });

    // Delete all subtasks first
    tasks.map(async (task) => {
      await prisma.subtask.deleteMany({
        where: { taskId: task.id },
      });
    });

    // Delete all tasks second
    await prisma.task.deleteMany({
      where: { projectId: id },
    });

    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
