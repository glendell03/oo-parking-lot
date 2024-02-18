import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

export const VehicleRouter = router({
	all: publicProcedure
		.input(
			z.object({
				isPark: z.boolean().optional()
			})
		)
		.query(async ({ ctx, input }) => {
			if (input.isPark !== undefined) {
				return await ctx.prisma.vehicle.findMany({
					orderBy: { leavedAt: 'desc' },
					where: {
						isPark: input.isPark
					}
				})
			}
			return await ctx.prisma.vehicle.findMany()
		})
})
