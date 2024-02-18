'use client'

import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { trpc } from '@/trpc/client'
import { VehicleType } from '@prisma/client'

const vehicles: Array<{ id: number; type: VehicleType; description: string }> =
	[
		{ id: 1, type: 'S', description: 'Small Vehicle' },
		{ id: 2, type: 'M', description: 'Medium Vehicle' },
		{ id: 3, type: 'L', description: 'Large Vehicle' }
	]

const MallEntrance = () => {
	const { refetch } = trpc.parkingLot.all.useQuery()
	// Fetch Mall Entrance
	const { data } = trpc.mallEntrance.all.useQuery()
	const parkMutation = trpc.parkingLot.park.useMutation({
		onSettled: async () => {
			await refetch()
			setOpen(false)
		}
	})

	// Reset Parking Lot
	const resetMutation = trpc.parkingLot.reset.useMutation({
		onSettled: async () => await refetch()
	})

	// State for dialog
	const [open, setOpen] = useState(false)

	// State for vehicle type
	const [vehicleType, setVehicleType] = useState<VehicleType>('S')

	const handlePark = () => {
		parkMutation.mutate({ vehicleType })
	}

	const handleReset = () => {
		resetMutation.mutate()
	}

	return (
		<div className='flex gap-2'>
			<Button onClick={handleReset}>
				{resetMutation.isPending ? '...' : 'Reset'}
			</Button>

			{/* Mall entrance modals  */}
			{data?.map(e => (
				<Dialog key={e.id} onOpenChange={setOpen} open={open}>
					<DialogTrigger asChild>
						<Button>{e.name}</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Select Vehicle Type</DialogTitle>
							<div className='py-5'>
								<RadioGroup
									defaultValue='S'
									value={vehicleType}
									onValueChange={value => setVehicleType(value as VehicleType)}>
									{vehicles.map(v => (
										<div key={v.id} className='flex items-center space-x-2'>
											<RadioGroupItem value={v.type} id={`vehicle-${v.type}`} />
											<Label htmlFor={`vehicle-${v.type}`}>
												{v.type} - {v.description}
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>

							<Button
								className='min-w-full'
								onClick={handlePark}
								disabled={parkMutation.isPending}>
								{parkMutation.isPending ? '...' : 'Park'}
							</Button>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			))}
		</div>
	)
}

export default MallEntrance
