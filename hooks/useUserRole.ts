import { useUserContext } from '@/components/providers/Providers'

export function useUserRole() {
  const { role, loading } = useUserContext()
  
  // dbLoading is no longer needed as a separate state since it's merged into the global profile loading
  return { role, loading, dbLoading: loading }
}
