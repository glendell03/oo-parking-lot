import { MallEntranceRouter } from './routes/mallEntrance'
import { ParkingLotRouter } from './routes/parkingLot'
import { router } from './trpc'

export const appRouter = router({
	parkingLot: ParkingLotRouter,
	mallEntrance: MallEntranceRouter
})

export type AppRouter = typeof appRouter
