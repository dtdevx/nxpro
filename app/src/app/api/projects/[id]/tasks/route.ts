import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const projectId = +(await params).id;
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: { subtasks: true },
    });
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch project tasks" },
      { status: 500 },
    );
  }
}
