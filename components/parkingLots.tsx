'use client'

import { trpc } from '@/trpc/client'
import { Button } from './ui/button'
import Spinner from './ui/spinner'
import { useState } from 'react'

const ParkingLots = () => {
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
			<h1>SMALL PARKING SPACE</h1>
			{SP?.map(p => (
				<div key={p.id}>
					{p.parkingNumber} {p.vehicleId}{' '}
					{p.vehicleId && (
						<Button
							onClick={() => handleUnpark(p.vehicleId)}
							disabled={unparkMutation.isPending && loading === p.vehicleId}>
							{unparkMutation.isPending && loading === p.vehicleId ? (
								<Spinner>Unparking</Spinner>
							) : (
								'Park'
							)}
						</Button>
					)}
				</div>
			))}
			<br />
			<h1>MEDIUM PARKING SPACE</h1>
			{MP?.map(p => (
				<div key={p.id}>
					{p.parkingNumber} {p.vehicleId}{' '}
					{p.vehicleId && (
						<Button
							onClick={() => handleUnpark(p.vehicleId)}
							disabled={unparkMutation.isPending && loading === p.vehicleId}>
							{unparkMutation.isPending && loading === p.vehicleId ? (
								<Spinner>Unparking</Spinner>
							) : (
								'Park'
							)}
						</Button>
					)}
				</div>
			))}
			<br />
			<h1>LARGE PARKING SPACE</h1>
			{LP?.map(p => (
				<div key={p.id}>
					{p.parkingNumber} {p.vehicleId}{' '}
					{p.vehicleId && (
						<Button
							onClick={() => handleUnpark(p.vehicleId)}
							disabled={unparkMutation.isPending && loading === p.vehicleId}>
							{unparkMutation.isPending && loading === p.vehicleId ? (
								<Spinner>Unparking</Spinner>
							) : (
								'Park'
							)}
						</Button>
					)}
				</div>
			))}
			<br />
		</div>
	)
}

export default ParkingLots
