import { MallEntrance, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

type TMallEntrance = Omit<MallEntrance, 'id' | 'createdAt' | 'updatedAt'>

const main = async () => {
	// Initialize the mall entrance

	const mallEntrance: TMallEntrance[] = []

	// create a 3 mall entrance
	for (let i = 1; i <= 3; i++) {
		mallEntrance.push({
			name: `Entrance ${i}`
		})
	}

	await prisma.mallEntrance.createMany({ data: mallEntrance })
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
