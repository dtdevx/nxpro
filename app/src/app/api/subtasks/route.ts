import { prisma } from "@/lib/prisma";
import { TaskState } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation
    if (!body.taskId || isNaN(body.taskId)) {
      return NextResponse.json(
        { error: "TaskId is required and must be a number" },
        { status: 400 },
      );
    }

    const task = await prisma.task.findUnique({
      where: {
        id: body.taskId,
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string" },
        { status: 400 },
      );
    }
    if (body.description && typeof body.description !== "string") {
      return NextResponse.json(
        { error: "Description must be a string" },
        { status: 400 },
      );
    }

    if (body.due && isNaN(Date.parse(body.due))) {
      return NextResponse.json(
        { error: "Due Date must be a valid date" },
        { status: 400 },
      );
    }

    if (body.state && !Object.keys(TaskState).includes(body.state)) {
      const stateValues = Object.values(TaskState).join("', '");
      return NextResponse.json(
        {
          error: `State must be one of '${stateValues}'`,
        },
        { status: 400 },
      );
    }

    // Transformation
    if (body.due === "") {
      delete body.due;
    }
    if (body.due) {
      body.due = new Date(body.due);
    }

    const newSubtask = await prisma.subtask.create({
      data: body,
    });
    return NextResponse.json(newSubtask, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create subtask" },
      { status: 500 },
    );
  }
}
