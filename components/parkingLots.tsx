'use client'

import { trpc } from '@/trpc/client'

const ParkingLots = () => {
	// Fetch parking lots
	const { data } = trpc.parkingLot.all.useQuery()
	const SP = data?.[0]
	const MP = data?.[1]
	const LP = data?.[2]

	return (
		<div>
			<h1>SMALL PARKING SPACE</h1>
			{SP?.map(p => (
				<div key={p.id}>
					{p.parkingNumber} {p.vehicleId}
				</div>
			))}
			<br />
			<h1>MEDIUM PARKING SPACE</h1>
			{MP?.map(p => (
				<div key={p.id}>
					{p.parkingNumber} {p.vehicleId}
				</div>
			))}
			<br />
			<h1>LARGE PARKING SPACE</h1>
			{LP?.map(p => (
				<div key={p.id}>
					{p.parkingNumber} {p.vehicleId}
				</div>
			))}
			<br />
		</div>
	)
}

export default ParkingLots
