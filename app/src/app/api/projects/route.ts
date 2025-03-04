import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProjectState } from "@prisma/client";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tasks: {
          include: {
            subtasks: true,
          },
        },
      },
    });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation
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

    if (body.state && !Object.keys(ProjectState).includes(body.state)) {
      const stateValues = Object.values(ProjectState).join("', '");
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

    const newProject = await prisma.project.create({
      data: body,
    });
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
