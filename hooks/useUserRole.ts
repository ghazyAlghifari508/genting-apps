import { useUserContext } from '@/components/providers/Providers'

export function useUserRole() {
  const { role, loading, isProfileLoaded } = useUserContext()
  
  return { role, loading, isProfileLoaded, dbLoading: loading }
}
