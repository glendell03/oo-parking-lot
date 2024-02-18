import { ParkingSpace } from '@prisma/client'

export const FLATRATE = 40
export const VEHICLERATE: Record<ParkingSpace, number> = {
	SP: 20,
	MP: 60,
	LP: 100
}
