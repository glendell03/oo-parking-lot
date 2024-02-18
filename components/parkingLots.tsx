'use client'

import { trpc } from '@/trpc/client'
import { Button } from './ui/button'
import Spinner from './ui/spinner'
import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { ParkingLot as TParkingLot, Vehicle } from '@prisma/client'
import { WithDatesStringified } from '@/types/withDateStringified'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(LocalizedFormat)

const ParkingSpace = () => {
	// Fetch parking lots
	const { data, refetch } = trpc.parkingLot.all.useQuery()
	const SP = data?.[0]
	const MP = data?.[1]
	const LP = data?.[2]

	// Fetch unparked vehicles
	const { refetch: refetchVehicles } = trpc.vehicle.all.useQuery({
		isPark: false
	})

	// Unpark a vehicle
	const unparkMutation = trpc.parkingLot.unPark.useMutation({
		onSettled: async () => {
			await refetch()
			await refetchVehicles()
		}
	})

	const [loading, setLoading] = useState<string | null>(null)

	const handleUnpark = (id: string | null) => {
		if (!id) return
		setLoading(id)
		unparkMutation.mutate({ id })
	}

	return (
		<div>
			<h1 className='my-5'>SMALL PARKING SPACE</h1>
			<div className='grid grid-cols-3 gap-4'>
				{SP?.map(p => (
					<ParkingLot
						key={p.id}
						parking={p}
						loading={loading}
						isPending={unparkMutation.isPending}
						onClick={() => handleUnpark(p.vehicleId)}
					/>
				))}
			</div>
			<br />
			<h1 className='my-5'>MEDIUM PARKING SPACE</h1>
			<div className='grid grid-cols-3 gap-4'>
				{MP?.map(p => (
					<ParkingLot
						key={p.id}
						parking={p}
						loading={loading}
						isPending={unparkMutation.isPending}
						onClick={() => handleUnpark(p.vehicleId)}
					/>
				))}
			</div>
			<br />
			<h1 className='my-5'>LARGE PARKING SPACE</h1>
			<div className='grid grid-cols-3 gap-4'>
				{LP?.map(p => (
					<ParkingLot
						key={p.id}
						parking={p}
						loading={loading}
						isPending={unparkMutation.isPending}
						onClick={() => handleUnpark(p.vehicleId)}
					/>
				))}
			</div>
		</div>
	)
}

const ParkingLot = ({
	parking,
	loading,
	isPending,
	onClick
}: {
	parking: WithDatesStringified<
		TParkingLot & { vehicle: WithDatesStringified<Vehicle> | null }
	>
	loading: string | null
	isPending: boolean
	onClick: () => void
}) => (
	<Card>
		<CardHeader>
			<Badge
				className={cn('justify-center', {
					'bg-green-400 hover:bg-green-500':
						parking.vehicleId && parking.vehicle?.vehicleType === 'S',
					'bg-blue-400 hover:bg-blue-500':
						parking.vehicleId && parking.vehicle?.vehicleType === 'M',
					'bg-orange-400 hover:bg-orange-500':
						parking.vehicleId && parking.vehicle?.vehicleType === 'L'
				})}
				variant={parking.vehicleId ? 'default' : 'outline'}>
				{parking.parkingNumber}
			</Badge>
		</CardHeader>
		<CardContent className='h-[150px]'>
			{parking.vehicleId && (
				<div>
					<p className='hyphens-auto'>{parking.vehicleId}</p>
					<span>
						<p className='font-bold'>Entered At:</p>{' '}
						{dayjs(parking.createdAt).format('llll')}
					</span>
				</div>
			)}
		</CardContent>
		<CardFooter>
			{parking.vehicleId && (
				<Button
					className='min-w-full'
					onClick={onClick}
					disabled={isPending && loading === parking.vehicleId}>
					{isPending && loading === parking.vehicleId ? (
						<Spinner>Unparking</Spinner>
					) : (
						'Unpark'
					)}
				</Button>
			)}
		</CardFooter>
	</Card>
)

export default ParkingSpace
