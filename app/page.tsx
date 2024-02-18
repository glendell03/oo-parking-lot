import History from '@/components/history'
import MallEntrance from '@/components/mallEntrance'
import ParkingLots from '@/components/parkingLots'
import React from 'react'

const Home = () => {
	return (
		<div className='container mx-auto flex gap-7 mt-5'>
			<aside className='self-start w-80 text-nowrap'>
				<History />
			</aside>
			<div>
				<MallEntrance />
				<ParkingLots />
			</div>
		</div>
	)
}

export default Home
