'use client'

import { trpc } from '@/trpc/client'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VehicleType } from '@prisma/client'
import Spinner from '@/components/ui/spinner'
import { Separator } from '@/components/ui/separator'
import { VEHICLERATE } from '@/lib/constant'
dayjs.extend(LocalizedFormat)

const hoursParked = (enteredDate: string, leavedDate: string | null) => {
	const enteredAt = dayjs(enteredDate)
	const leavedAt = dayjs(leavedDate)

	// Round up regardless of the decimal part
	// Parking fees are calculated using the rounding up method, e.g. 6.4 hours must be rounded to 7.
	const diffInHours = Math.ceil(leavedAt.diff(enteredAt, 'minute') / 60)
	return diffInHours
}

const History = () => {
	const { refetch: refetchParkingLot } = trpc.parkingLot.all.useQuery()
	const { data, refetch } = trpc.vehicle.all.useQuery({ isPark: false })
	const vehicleMutation = trpc.parkingLot.park.useMutation({
		onSettled: async () => {
			await refetch()
			await refetchParkingLot()
		}
	})

	const [loading, setLoading] = useState<string | null>(null)

	const handlePark = ({
		vehicleId,
		vehicleType
	}: { vehicleId: string; vehicleType: VehicleType }) => {
		setLoading(vehicleId)
		vehicleMutation.mutate({ vehicleId, vehicleType })
	}

	return (
		<div>
			{data?.map(d => (
				<Card key={d.id}>
					<CardHeader>
						<Badge className='justify-center'>
							{d.vehicleType} - {d.id}
						</Badge>
					</CardHeader>
					<CardContent>
						<div className='flex'>
							<p className='font-bold mr-2'>Hours Parked:</p>
							{hoursParked(d.createdAt, d.leavedAt)}
						</div>
						<Separator className='my-2' />
						<div>
							<p className='font-bold'>Rate:</p>
							<p>Flat Rate: PHP 40</p>
							{hoursParked(d.createdAt, d.leavedAt) - 3 > 0 && (
								<p>
									Parking Space Rate: PHP {VEHICLERATE[d.parkingSpace ?? 'SP']}
									{hoursParked(d.createdAt, d.leavedAt) - 3 > 0
										? ` x ${hoursParked(d.createdAt, d.leavedAt) - 3}`
										: ''}
								</p>
							)}
							<p>Total: PHP {d.rate}</p>
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
