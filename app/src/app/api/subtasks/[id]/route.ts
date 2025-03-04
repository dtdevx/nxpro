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
    const updatedSubtask = await prisma.subtask.update({
      where: { id: Number(id) },
      data: { state: body.state },
    });
    return NextResponse.json(updatedSubtask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update subtask state" },
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
    const subtask = await prisma.subtask.findUnique({
      where: { id },
    });
    if (!subtask) {
      return NextResponse.json({ error: "Subtask not found" }, { status: 404 });
    }
    if (body.due === "") {
      body.due = null;
    }
    if (body.due) {
      body.due = new Date(body.due);
    }
    const updatedSubtask = await prisma.subtask.update({
      where: { id },
      data: { ...subtask, ...body },
    });
    return NextResponse.json(updatedSubtask, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update subtask" },
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
    await prisma.subtask.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Subtask deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete subtask" },
      { status: 500 },
    );
  }
}
