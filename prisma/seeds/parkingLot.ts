import { ParkingLot, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

type ParkingLots = Omit<ParkingLot, 'id' | 'createdAt' | 'updatedAt'>

const main = async () => {
	// Initialize the parking lot
	const parkingLots: ParkingLots[] = []

	// Create a 5 small parking lots
	for (let i = 1; i <= 5; i++) {
		parkingLots.push({
			parkingSpace: 'SP',
			parkingNumber: i,
			vehicleId: null
		})
	}

	// Create a 5 medium parking lots
	for (let i = 1; i <= 5; i++) {
		parkingLots.push({
			parkingSpace: 'MP',
			parkingNumber: i,
			vehicleId: null
		})
	}

	// Create a 5 large parking lots
	for (let i = 1; i <= 5; i++) {
		parkingLots.push({
			parkingSpace: 'LP',
			parkingNumber: i,
			vehicleId: null
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
