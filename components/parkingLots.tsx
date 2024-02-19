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
import { Skeleton } from './ui/skeleton'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from './ui/form'
dayjs.extend(LocalizedFormat)

const ParkingSpace = () => {
	// Fetch parking lots
	const { data, isPending } = trpc.parkingLot.all.useQuery()
	const SP = data?.[0]
	const MP = data?.[1]
	const LP = data?.[2]

	return (
		<div>
			<h1 className='my-5'>SMALL PARKING SPACE</h1>
			<div className='grid grid-cols-3 gap-4'>
				{isPending && <ParkingLoadingState />}
				{SP?.map(p => (
					<ParkingLot key={p.id} parking={p} />
				))}
			</div>
			<br />
			<h1 className='my-5'>MEDIUM PARKING SPACE</h1>
			<div className='grid grid-cols-3 gap-4'>
				{isPending && <ParkingLoadingState />}
				{MP?.map(p => (
					<ParkingLot key={p.id} parking={p} />
				))}
			</div>
			<br />
			<h1 className='my-5'>LARGE PARKING SPACE</h1>
			<div className='grid grid-cols-3 gap-4'>
				{isPending && <ParkingLoadingState />}
				{LP?.map(p => (
					<ParkingLot key={p.id} parking={p} />
				))}
			</div>
		</div>
	)
}

const ParkingLoadingState = () => {
	return (
		<>
			{Array(5)
				.fill(0)
				.map((_, i) => (
					<Skeleton className='h-[246px] w-full' key={i.toString()} />
				))}
		</>
	)
}

const unParkSchema = z.object({
	day: z.coerce.number().optional(),
	hour: z.coerce.number().optional(),
	minute: z.coerce.number().optional()
})

const ParkingLot = ({
	parking
}: {
	parking: WithDatesStringified<
		TParkingLot & { vehicle: WithDatesStringified<Vehicle> | null }
	>
}) => {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState<string | null>(null)

	// Fetch parking lots
	const { refetch } = trpc.parkingLot.all.useQuery()

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

	const form = useForm<z.infer<typeof unParkSchema>>({
		resolver: zodResolver(unParkSchema),
		defaultValues: {
			day: 0,
			hour: 0,
			minute: 0
		}
	})

	const onSubmit = ({ day, hour, minute }: z.infer<typeof unParkSchema>) => {
		if (!parking.vehicleId) return
		setLoading(parking.vehicleId)
		unparkMutation.mutate({ id: parking.vehicleId, day, hour, minute })
		form.reset()
	}

	return (
		<>
			<Card className='min-h-[246px] flex flex-col justify-between'>
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
				<CardContent>
					{parking.vehicleId && (
						<div>
							<p className='hyphens-auto'>{parking.vehicleId}</p>
							<span>
								<p className='font-bold'>Entered At:</p>{' '}
								{dayjs(parking.vehicle?.createdAt).format('llll')}
							</span>
						</div>
					)}
				</CardContent>
				<CardFooter>
					{parking.vehicleId && (
						<Button className='min-w-full' onClick={() => setOpen(true)}>
							Unpark
						</Button>
					)}
				</CardFooter>
			</Card>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Unpark vehicle</AlertDialogTitle>
						<AlertDialogDescription>
							This information is optional, and you may leave it blank if
							desired. Enter the time the vehicle left the parking lot to
							complete the unparking process. Note that this time is just to
							imitate the departure time of the vehicle.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className='space-x-4 flex mb-8'>
								<FormField
									control={form.control}
									name='day'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Day</FormLabel>
											<FormControl>
												<Input {...field} type='number' />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='hour'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Hour</FormLabel>
											<FormControl>
												<Input {...field} type='number' />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='minute'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Minute</FormLabel>
											<FormControl>
												<Input {...field} type='number' />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									type='submit'
									disabled={
										unparkMutation.isPending && loading === parking.vehicleId
									}>
									{unparkMutation.isPending && loading === parking.vehicleId ? (
										<Spinner>Unparking</Spinner>
									) : (
										'Continue'
									)}
								</AlertDialogAction>
							</AlertDialogFooter>
						</form>
					</Form>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

export default ParkingSpace
