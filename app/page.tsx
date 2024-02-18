import MallEntrance from '@/components/mallEntrance'
import ParkingLots from '@/components/parkingLots'
import React from 'react'

const Home = () => {
	return (
		<div className='container mx-auto'>
			<ParkingLots />
			<MallEntrance />
		</div>
	)
}

export default Home
