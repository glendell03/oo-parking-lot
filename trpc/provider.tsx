'use client'

import { PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { trpc } from './client'

const getBaseUrl = () => {
	if (process.env.VERCEL_URL)
		// reference for vercel.com
		return `https://${process.env.VERCEL_URL}/api/trpc`
	// assume localhost
	return `http://localhost:${process.env.PORT ?? 3000}/api/trpc`
}

export const TRPCProvider = ({ children }: PropsWithChildren) => {
	const [queryClient] = useState(() => new QueryClient({}))
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: getBaseUrl(),
					fetch(url, options) {
						return fetch(url, { ...options, credentials: 'include' })
					}
				})
			]
		})
	)

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	)
}
