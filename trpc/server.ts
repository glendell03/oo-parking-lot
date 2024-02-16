'use server'

import { appRouter } from '@/server'
import { createContext } from '@/server/context'
import { createCallerFactory } from '@/server/trpc'

export const trpcServer = async () => {
	const ctx = await createContext()
	const caller = createCallerFactory(appRouter)(ctx)
	return caller
}
