/*
  Warnings:

  - Added the required column `name` to the `MallEntrance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MallEntrance" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ParkingLot" ADD COLUMN     "parkingNumber" INTEGER NOT NULL DEFAULT 0;
