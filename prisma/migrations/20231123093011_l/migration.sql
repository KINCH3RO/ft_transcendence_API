-- CreateEnum
CREATE TYPE "category" AS ENUM ('PADDLE', 'MAPSKIN', 'BACKGROUND');

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "category" NOT NULL,
    "price" INTEGER NOT NULL,
    "selected" BOOLEAN NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_productsToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_productsToUser_AB_unique" ON "_productsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_productsToUser_B_index" ON "_productsToUser"("B");

-- AddForeignKey
ALTER TABLE "_productsToUser" ADD CONSTRAINT "_productsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_productsToUser" ADD CONSTRAINT "_productsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
