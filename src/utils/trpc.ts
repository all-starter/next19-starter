import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/routers/_app'
import { QueryClientConfig } from '@tanstack/react-query'

export const trpc = createTRPCReact<AppRouter>()

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
    },
  },
}