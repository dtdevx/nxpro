import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TaskState } from "@prisma/client";

interface PartialTask {
  title?: string;
  description?: string;
  due?: string | Date | null;
  state?: TaskState;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = +(await params).id;
    const body = await req.json();
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { state: body.state },
    });
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update task state" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const id = +(await params).id;
    const body: PartialTask = await req.json();
    const task = await prisma.task.findUnique({
      where: { id },
    });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    if (body.due === "") {
      body.due = null;
    }
    if (body.due) {
      body.due = new Date(body.due);
    }
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { ...task, ...body },
    });
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update task" },
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

    // Delete all subtasks first
    await prisma.subtask.deleteMany({
      where: { taskId: id },
    });

    await prisma.task.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Task deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 },
    );
  }
}
