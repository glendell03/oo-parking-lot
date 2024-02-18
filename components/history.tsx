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
dayjs.extend(LocalizedFormat)

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
						<div>
							<p className='font-bold'>Leaved At</p>
							{dayjs(d.leavedAt).format('llll')}
						</div>
						<div>
							<p className='font-bold'>Entered At</p>
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
