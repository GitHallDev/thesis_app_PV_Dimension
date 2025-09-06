import { useGetMeQuery } from "@/redux/userApi/authApi";

export function useAuth() {
  const {
    data: user,
    error,
    isLoading,
  } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  return {
    user,
    isLoading,
    isAuthenticated: Boolean(user && !error),
  };
}
