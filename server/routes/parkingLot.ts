import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { ParkingLot, Vehicle, VehicleType } from '@prisma/client'
import { TRPCError } from '@trpc/server'

export const ParkingLotRouter = router({
	/**
	 * Get all parking lots and return a 2D array of objects
	 * */
	all: publicProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.$transaction(async t => {
			const SP = await t.parkingLot.findMany({
				orderBy: { parkingNumber: 'asc' },
				where: { parkingSpace: 'SP' }
			})

			const MP = await t.parkingLot.findMany({
				orderBy: { parkingNumber: 'asc' },
				where: { parkingSpace: 'MP' }
			})

			const LP = await t.parkingLot.findMany({
				orderBy: { parkingNumber: 'asc' },
				where: { parkingSpace: 'LP' }
			})

			return [SP, MP, LP]
		})
	}),

	//Park a vehicle
	park: publicProcedure
		.input(
			z.object({
				vehicleType: z.nativeEnum(VehicleType),
				vehicleId: z.string().cuid().optional()
			})
		)
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.$transaction(async t => {
				let nearestLot: Pick<ParkingLot, 'id'> | null = null

				// If vehicle is small find the nearest parking lot
				// Small vehicle can park in any space
				if (input.vehicleType === 'S') {
					const smallLot = await t.parkingLot.findFirst({
						orderBy: { parkingNumber: 'asc' },
						where: { vehicleId: null, parkingSpace: 'SP' },
						select: { id: true }
					})

					/**
					 * if small lot is available, park it
					 * if small lot is not available, find the nearest medium lot
					 * if medium lot is not available, find the nearest large lot
					 * if large lot is not available, throw error
					 * */
					if (!smallLot) {
						const mediumLot = await t.parkingLot.findFirst({
							orderBy: { parkingNumber: 'asc' },
							where: { vehicleId: null, parkingSpace: 'MP' },
							select: { id: true }
						})

						if (!mediumLot) {
							const largeLot = await t.parkingLot.findFirst({
								orderBy: { parkingNumber: 'asc' },
								where: { vehicleId: null, parkingSpace: 'LP' },
								select: { id: true }
							})

							if (largeLot) {
								nearestLot = largeLot
							}
						} else {
							nearestLot = mediumLot
						}
					} else {
						nearestLot = smallLot
					}
				}

				// If vehicle is medium find the nearest parking lot that is not equal to small parking lot
				// Mediul vehicle can only park in medium or large space
				if (input.vehicleType === 'M') {
					const mediumLot = await t.parkingLot.findFirst({
						orderBy: { parkingNumber: 'asc' },
						where: { vehicleId: null, parkingSpace: 'MP' },
						select: { id: true }
					})

					/**
					 * if medium lot is available, park it
					 * if medium lot is not available, find the nearest large lot
					 * if large lot is not available, throw error
					 * */
					if (!mediumLot) {
						const largeLot = await t.parkingLot.findFirst({
							orderBy: { parkingNumber: 'asc' },
							where: { vehicleId: null, parkingSpace: 'LP' },
							select: { id: true }
						})

						if (largeLot) {
							nearestLot = largeLot
						}
					} else {
						nearestLot = mediumLot
					}
				}

				// If vehicle is large find the nearest parking lot that is only equal to large parking lot
				// Large vehicle can only park in large space
				if (input.vehicleType === 'L') {
					nearestLot = await t.parkingLot.findFirst({
						orderBy: { parkingNumber: 'asc' },
						where: { vehicleId: null, parkingSpace: 'LP' },
						select: { id: true }
					})
				}

				// Throw an error if no parking space available
				if (!nearestLot) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						message: 'No parking space available'
					})
				}

				let vehicle: Vehicle
				if (input.vehicleId) {
					vehicle = await t.vehicle.update({
						where: { id: input.vehicleId },
						data: { isPark: true }
					})
				} else {
					// Create a vehicle and park it on the nearest parking lot
					vehicle = await t.vehicle.create({
						data: { vehicleType: input.vehicleType, isPark: true }
					})
				}

				return await t.parkingLot.update({
					where: { id: nearestLot?.id },
					data: { vehicleId: vehicle.id }
				})
			})
		}),

	// Upark a vehicle
	unPark: publicProcedure
		.input(z.object({ id: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			return await ctx.prisma.$transaction(async t => {
				await t.parkingLot.update({
					where: { vehicleId: input.id },
					data: { vehicleId: null }
				})
				await t.vehicle.update({
					where: { id: input.id },
					data: {
						isPark: false,
						leavedAt: new Date()
					}
				})
			})
		}),

	// Reset the parking lot
	reset: publicProcedure.mutation(async ({ ctx }) => {
		return await ctx.prisma.$transaction(async t => {
			await t.parkingLot.updateMany({
				where: { NOT: { vehicleId: null } },
				data: { vehicleId: null }
			})

			await t.vehicle.deleteMany()
		})
	})
})
