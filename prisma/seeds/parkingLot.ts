import { ParkingLot, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

type ParkingLots = Omit<ParkingLot, 'id' | 'createdAt' | 'updatedAt'>

const main = async () => {
	// Initialize the parking lot
	const parkingLots: ParkingLots[] = []

	// Create a 30 small parking lots
	for (let i = 1; i <= 30; i++) {
		parkingLots.push({
			vehicleType: null,
			parkingSpace: 'SP',
			parkingNumber: i
		})
	}

	// Create a 30 medium parking lots
	for (let i = 1; i <= 30; i++) {
		parkingLots.push({
			vehicleType: null,
			parkingSpace: 'MP',
			parkingNumber: i
		})
	}

	// Create a 30 large parking lots
	for (let i = 1; i <= 30; i++) {
		parkingLots.push({
			vehicleType: null,
			parkingSpace: 'LP',
			parkingNumber: i
		})
	}

	await prisma.parkingLot.createMany({ data: parkingLots })
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
