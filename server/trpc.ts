import { initTRPC } from '@trpc/server'
import { createContext } from './context'
import { ZodError } from 'zod'

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create({
	errorFormatter(opts) {
		const { shape, error } = opts
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
						? error.cause.flatten()
						: null
			}
		}
	}
})

export const router = t.router
export const publicProcedure = t.procedure

export const createCallerFactory = t.createCallerFactory
