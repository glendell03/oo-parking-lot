import MallEntrance from '@/components/mallEntrance'
import ParkingLots from '@/components/parkingLots'
import { Badge } from '@/components/ui/badge'
import React from 'react'

const Home = () => {
	return (
		<div className='container mx-auto flex gap-7 mt-5'>
			<div className='flex-1 mb-10'>
				<MallEntrance />
				<div className='mt-5 flex items-center gap-2'>
					<h1>Legend: </h1>
					<span className='space-x-2'>
						<Badge className='bg-green-400 hover:bg-green-500'>Small</Badge>
						<Badge className='bg-blue-400 hover:bg-blue-500'>Medium</Badge>
						<Badge className='bg-orange-400 hover:bg-orange-500'>Large</Badge>
					</span>
				</div>
				<ParkingLots />
			</div>
		</div>
	)
}

export default Home
