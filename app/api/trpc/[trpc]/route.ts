import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { appRouter } from '@/server'
import { createContext } from '@/server/context'
import { TRPCError } from '@trpc/server'

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: 'api/trpc',
		req,
		router: appRouter,
		createContext,
		onError(opts) {
			if (opts.error.code === 'INTERNAL_SERVER_ERROR') {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Something went wrong'
				})
			}
		}
	})

export { handler as GET, handler as POST }
