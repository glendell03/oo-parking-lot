-- CreateEnum
CREATE TYPE "ParkingSpace" AS ENUM ('SP', 'MP', 'LP');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('S', 'M', 'L');

-- CreateTable
CREATE TABLE "ParkingLot" (
    "id" TEXT NOT NULL,
    "parkingSpace" "ParkingSpace" NOT NULL DEFAULT 'SP',
    "vehicleType" "VehicleType" NOT NULL DEFAULT 'S',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParkingLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MallEntrance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MallEntrance_pkey" PRIMARY KEY ("id")
);
