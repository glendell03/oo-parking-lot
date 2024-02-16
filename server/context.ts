import { prisma } from '@/lib/prisma'
import { createCallerFactory } from './trpc'
import { appRouter } from '.'

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
export const createInnerTRPCContext = () => {
	return {
		prisma
	}
}

export const createContext = async () => {
	return createInnerTRPCContext()
}

export const trpcCaller = async () => {
	const ctx = await createContext()
	return createCallerFactory(appRouter)(ctx)
}

export type Context = Awaited<ReturnType<typeof createContext>>
