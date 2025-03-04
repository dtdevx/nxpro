// Development seed

import { PrismaClient, ProjectState, TaskState } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();

interface Workable {
  title?: string;
  description?: string;
  due?: Date;
}

interface FakeableProject extends Workable {
  state?: ProjectState;
}

interface FakeableTask extends Workable {
  state?: TaskState;
}

const createFakeProject = (modelData: FakeableProject = {}) => {
  return {
    title: modelData?.title || faker.word.words(),
    description: modelData?.description || faker.lorem.paragraph(),
    state: modelData?.state || faker.helpers.enumValue(ProjectState),
    due: modelData?.due || faker.date.future(),
  };
};

const createFakeTask = (modelData: FakeableTask = {}) => {
  return {
    title: modelData?.title || faker.word.words(),
    description: modelData?.description || faker.lorem.paragraph(),
    state: modelData?.state || faker.helpers.enumValue(TaskState),
    due: modelData?.due || faker.date.future(),
  };
};

async function main() {
  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  await prisma.project.create({
    data: {
      ...createFakeProject({ title: "My custom Test Title" }),
      tasks: {
        create: [
          {
            ...createFakeTask(),
          },
          {
            ...createFakeTask(),
            subtasks: {
              create: [
                {
                  ...createFakeTask(),
                },
              ],
            },
          },
          {
            ...createFakeTask(),
          },
          {
            ...createFakeTask(),
            subtasks: {
              create: [
                {
                  ...createFakeTask(),
                },
                {
                  ...createFakeTask(),
                },
                {
                  ...createFakeTask(),
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      ...createFakeProject(),
    },
  });

  await prisma.project.create({
    data: {
      ...createFakeProject(),
      tasks: {
        create: [
          {
            ...createFakeTask(),
          },
          {
            ...createFakeTask(),
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
