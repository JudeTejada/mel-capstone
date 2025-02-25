import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Create users with telecom industry positions
  const user1 = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      position: "Network Operations Manager",
      role: "ADMIN",
      password: "$2a$10$EprZf1THP.VKKp3g6B.AVO4xbTcx9KUHmEEwRXksJfXO6UZvX5YwO", // hashed password: password123
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      position: "RF Engineer",
      role: "USER",
      password: "$2a$10$EprZf1THP.VKKp3g6B.AVO4xbTcx9KUHmEEwRXksJfXO6UZvX5YwO",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      position: "Network Infrastructure Specialist",
      role: "USER",
      password: "$2a$10$EprZf1THP.VKKp3g6B.AVO4xbTcx9KUHmEEwRXksJfXO6UZvX5YwO",
    },
  });

  // Create a project
  const project1 = await prisma.project.create({
    data: {
      title: "5G Network Expansion",
      description: "Comprehensive 5G network deployment across metropolitan areas",
      status: "ACTIVE",
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      priority: "HIGH",
      budget: 1500000,
      ownerId: user1.id,
      tags: ["5G", "Infrastructure", "Urban Development"],
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: "Network Security Enhancement",
      description: "Implementation of advanced security measures across network infrastructure",
      status: "PLANNING",
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      priority: "HIGH",
      budget: 800000,
      ownerId: user1.id,
      tags: ["Security", "Infrastructure", "Compliance"],
    },
  });

  // Create tasks for Project 1
  await prisma.task.create({
    data: {
      title: "5G Network Site Survey",
      description: "Conduct comprehensive site surveys for 5G tower placement in downtown area",
      status: "INPROGRESS",
      priority: "HIGH",
      deadline: faker.date.future(),
      estimatedHours: 40,
      actualHours: 25,
      projectId: project1.id,
      assignees: {
        connect: [{ id: user2.id }, { id: user3.id }],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: "Equipment Procurement",
      description: "Source and order necessary 5G network equipment from approved vendors",
      status: "TODO",
      priority: "HIGH",
      deadline: faker.date.future(),
      estimatedHours: 20,
      actualHours: 0,
      projectId: project1.id,
      assignees: {
        connect: [{ id: user1.id }],
      },
    },
  });

  // Create tasks for Project 2
  await prisma.task.create({
    data: {
      title: "Security Audit Planning",
      description: "Develop comprehensive security audit framework and timeline",
      status: "COMPLETED",
      priority: "MEDIUM",
      deadline: faker.date.future(),
      estimatedHours: 30,
      actualHours: 0,
      projectId: project2.id,
      assignees: {
        connect: [{ id: user1.id }, { id: user3.id }],
      },
    },
  });

  // Add some comments
  await prisma.comment.create({
    data: {
      text: "Initial survey locations have been identified. Waiting for permit approvals.",
      userId: user2.id,
      taskId: (await prisma.task.findFirst())!.id,
    },
  });

  console.log("Database has been seeded. 🌱");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });