-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('INSTALLATION', 'RECTIFICATION');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('IN_PROGRESS', 'DONE', 'ON_HOLD');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "type" "TicketType" NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "dateCompleted" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "activityType" VARCHAR(100),

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallationProgress" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "poleExcavation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cableLaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "napLcpMounted" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "poleErected" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cableFixed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "napLcpSpliced" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstallationProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstallationProgress_ticketId_key" ON "InstallationProgress"("ticketId");

-- CreateIndex
CREATE INDEX "Ticket_userId_status_type_idx" ON "Ticket"("userId", "status", "type");

-- CreateIndex
CREATE INDEX "Ticket_dateCompleted_idx" ON "Ticket"("dateCompleted");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallationProgress" ADD CONSTRAINT "InstallationProgress_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;