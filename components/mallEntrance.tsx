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
import { Menu } from 'lucide-react'
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from './ui/sheet'
import History from './history'
import Spinner from './ui/spinner'
import { ScrollArea } from './ui/scroll-area'
import { Skeleton } from './ui/skeleton'

const vehicles: Array<{ id: number; type: VehicleType; description: string }> =
	[
		{ id: 1, type: 'S', description: 'Small Vehicle' },
		{ id: 2, type: 'M', description: 'Medium Vehicle' },
		{ id: 3, type: 'L', description: 'Large Vehicle' }
	]

const MallEntrance = () => {
	const { refetch } = trpc.parkingLot.all.useQuery()
	// Fetch Mall Entrance
	const { data, isPending } = trpc.mallEntrance.all.useQuery()
	const parkMutation = trpc.parkingLot.park.useMutation({
		onSettled: async () => {
			await refetch()
			setOpen(false)
		}
	})

	// Fetch unparked vehicles
	const { refetch: refetchVehicles } = trpc.vehicle.all.useQuery({
		isPark: false
	})

	// Reset Parking Lot
	const resetMutation = trpc.parkingLot.reset.useMutation({
		onSettled: async () => {
			await refetch()
			await refetchVehicles()
		}
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

	if (isPending) return <Skeleton className='w-full h-10' />

	return (
		<div className='flex justify-between'>
			<div className='space-x-2'>
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
										onValueChange={value =>
											setVehicleType(value as VehicleType)
										}>
										{vehicles.map(v => (
											<div key={v.id} className='flex items-center space-x-2'>
												<RadioGroupItem
													value={v.type}
													id={`vehicle-${v.type}`}
												/>
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
									{parkMutation.isPending ? <Spinner>Parking</Spinner> : 'Park'}
								</Button>
							</DialogHeader>
						</DialogContent>
					</Dialog>
				))}
			</div>

			<Sheet>
				<SheetTrigger asChild>
					<Button variant='outline' size='icon'>
						<Menu size={16} />
					</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>History</SheetTitle>
					</SheetHeader>
					<SheetFooter>
						<Button className='min-w-full my-3' onClick={handleReset}>
							{resetMutation.isPending ? <Spinner>Resetting</Spinner> : 'Reset'}
						</Button>
					</SheetFooter>
					<ScrollArea className='h-[90%]'>
						<History />
					</ScrollArea>
				</SheetContent>
			</Sheet>
		</div>
	)
}

export default MallEntrance
