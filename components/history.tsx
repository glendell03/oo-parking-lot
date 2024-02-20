'use client'

import { trpc } from '@/trpc/client'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ParkingSpace, VehicleType } from '@prisma/client'
import Spinner from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import { VEHICLERATE } from '@/lib/constant'
import { cn } from '@/lib/utils'
dayjs.extend(LocalizedFormat)

// Convert integer to a currency format
const php = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'PHP',
	minimumFractionDigits: 0,
	maximumFractionDigits: 0
})

// Calculate number of hours that vehicle was parked
const hoursParked = (enteredDate: string, leavedDate: string | null) => {
	const enteredAt = dayjs(enteredDate)
	const leavedAt = dayjs(leavedDate)

	// Round up regardless of the decimal part
	// Parking fees are calculated using the rounding up method, e.g. 6.4 hours must be rounded to 7.
	const diffInMinutes = leavedAt.diff(enteredAt, 'minute') / 60
	if (diffInMinutes < 1) return 0
	const diffInHours = Math.ceil(diffInMinutes)
	return diffInHours
}

// Calculate parking rate based on the hours and vehicle type
const parkingSpaceRate = (
	parkingSpace: ParkingSpace | null,
	enteredAt: string,
	leavedAt: string | null
) => {
	if (!parkingSpace) return

	const diffInHours = hoursParked(enteredAt, leavedAt)
	const chunks = Math.floor(diffInHours / 24)
	const exceedingHour = diffInHours % 24

	if (diffInHours - 3 <= 0) return null

	if (diffInHours - 3 < 24) {
		return `${php.format(VEHICLERATE[parkingSpace])} x ${diffInHours - 3}h`
	}

	if (diffInHours >= 24) {
		return `(${php.format(5000)} x ${chunks}d) + (${php.format(
			VEHICLERATE[parkingSpace]
		)} x ${exceedingHour}h)`
	}
}

const History = () => {
	// Fetch parking lot
	const { refetch: refetchParkingLot } = trpc.parkingLot.all.useQuery()
	// Fetch vehicle
	const { data, refetch } = trpc.vehicle.all.useQuery({ isPark: false })

	const vehicleMutation = trpc.parkingLot.park.useMutation({
		onSettled: async () => {
			await refetch()
			await refetchParkingLot()
		}
	})

	// Loading state for individual park button
	const [loading, setLoading] = useState<string | null>(null)

	const handlePark = ({
		vehicleId,
		vehicleType
	}: { vehicleId: string; vehicleType: VehicleType }) => {
		setLoading(vehicleId)
		vehicleMutation.mutate({ vehicleId, vehicleType })
	}

	return (
		<div className='flex flex-col gap-4'>
			{data?.map(d => (
				<Card key={d.id}>
					<CardHeader>
						<Badge
							className={cn('justify-center', {
								'bg-green-400 hover:bg-green-500': d.vehicleType === 'S',
								'bg-blue-400 hover:bg-blue-500': d.vehicleType === 'M',
								'bg-orange-400 hover:bg-orange-500': d.vehicleType === 'L'
							})}>
							{d.vehicleType} - {d.id}
						</Badge>
					</CardHeader>
					<CardContent>
						<div className='flex'>
							<p className='font-bold mr-2'>Parking Space:</p>
							{d.parkingSpace}
						</div>
						<Separator className='my-2' />
						<div className='flex'>
							<p className='font-bold mr-2'>Hours Parked:</p>
							{hoursParked(d.createdAt, d.leavedAt)}
						</div>
						<Separator className='my-2' />
						<div>
							<p className='font-bold'>Rate:</p>
							{hoursParked(d.createdAt, d.leavedAt) < 24 && (
								<p>Flat Rate: {php.format(40)}</p>
							)}
							<p>
								{parkingSpaceRate(d.parkingSpace, d.createdAt, d.leavedAt) &&
									`Parking Space Rate: ${parkingSpaceRate(
										d.parkingSpace,
										d.createdAt,
										d.leavedAt
									)}`}
							</p>
							<p>Total: {php.format(d.rate)}</p>
						</div>
						<Separator className='my-2' />
						<div>
							<p className='font-bold '>Leaved At:</p>
							{dayjs(d.leavedAt).format('llll')}
						</div>
						<Separator className='my-2' />
						<div>
							<p className='font-bold'>Entered At:</p>
							{dayjs(d.createdAt).format('llll')}
						</div>
					</CardContent>
					<CardFooter>
						<Button
							disabled={vehicleMutation.isPending && loading === d.id}
							className='min-w-full'
							onClick={() =>
								handlePark({ vehicleId: d.id, vehicleType: d.vehicleType })
							}>
							{vehicleMutation.isPending && loading === d.id ? (
								<Spinner>Parking</Spinner>
							) : (
								'Park'
							)}
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	)
}

export default History
