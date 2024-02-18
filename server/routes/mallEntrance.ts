import { publicProcedure, router } from '../trpc'

export const MallEntranceRouter = router({
	all: publicProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.mallEntrance.findMany()
	})
})
