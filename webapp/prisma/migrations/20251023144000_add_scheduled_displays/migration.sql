-- CreateTable
CREATE TABLE "ScheduledDisplay" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "targetDisplayId" INTEGER NOT NULL,
    "scheduleType" TEXT NOT NULL DEFAULT 'once',
    "scheduleTime" TEXT,
    "scheduleDays" TEXT,
    "scheduleDate" INTEGER,
    "contentData" TEXT NOT NULL,
    "lastExecuted" TIMESTAMP(3),
    "executionCount" INTEGER NOT NULL DEFAULT 0,
    "nextExecution" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledDisplay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledImage" (
    "id" SERIAL NOT NULL,
    "scheduledDisplayId" INTEGER NOT NULL,
    "imageType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ScheduledDisplay_targetDisplayId_idx" ON "ScheduledDisplay"("targetDisplayId");

-- CreateIndex
CREATE INDEX "ScheduledDisplay_startDate_idx" ON "ScheduledDisplay"("startDate");

-- CreateIndex
CREATE INDEX "ScheduledDisplay_isActive_idx" ON "ScheduledDisplay"("isActive");

-- CreateIndex
CREATE INDEX "ScheduledImage_scheduledDisplayId_idx" ON "ScheduledImage"("scheduledDisplayId");

-- CreateIndex
CREATE INDEX "ScheduledImage_imageType_idx" ON "ScheduledImage"("imageType");

-- AddForeignKey
ALTER TABLE "ScheduledDisplay" ADD CONSTRAINT "ScheduledDisplay_targetDisplayId_fkey" FOREIGN KEY ("targetDisplayId") REFERENCES "Display"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledImage" ADD CONSTRAINT "ScheduledImage_scheduledDisplayId_fkey" FOREIGN KEY ("scheduledDisplayId") REFERENCES "ScheduledDisplay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
