import { Loader2 } from 'lucide-react'
import React, { PropsWithChildren } from 'react'

const Spinner = ({ children }: PropsWithChildren) => {
	return (
		<div className='flex nowrap items-center justify-center gap-2'>
			<Loader2 size={16} className='animate-spin' />
			<p>{children}</p>
		</div>
	)
}

export default Spinner
