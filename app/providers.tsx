'use client'

import React, { PropsWithChildren } from 'react'
import { TRPCProvider } from '@/trpc/provider'

const Providers = ({ children }: PropsWithChildren) => {
	return <TRPCProvider>{children}</TRPCProvider>
}

export default Providers
