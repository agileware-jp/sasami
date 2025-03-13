-- CreateTable
CREATE TABLE "KinconeExpense" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "in" VARCHAR(255),
    "out" VARCHAR(255),
    "type" INTEGER NOT NULL,
    "note" TEXT,
    "expense" INTEGER NOT NULL,

    CONSTRAINT "KinconeExpense_pkey" PRIMARY KEY ("id")
);
