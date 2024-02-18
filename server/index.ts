import { MallEntranceRouter } from './routes/mallEntrance'
import { ParkingLotRouter } from './routes/parkingLot'
import { VehicleRouter } from './routes/vehicle'
import { router } from './trpc'

export const appRouter = router({
	parkingLot: ParkingLotRouter,
	mallEntrance: MallEntranceRouter,
	vehicle: VehicleRouter
})

export type AppRouter = typeof appRouter
