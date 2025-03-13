-- CreateTable
CREATE TABLE "KinconeExpense" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "usageDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "departureLocation" VARCHAR(255),
    "targetLocation" VARCHAR(255),
    "type" INTEGER NOT NULL,
    "note" TEXT,
    "expense" INTEGER NOT NULL,

    CONSTRAINT "KinconeExpense_pkey" PRIMARY KEY ("id")
);
