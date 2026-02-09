'use client'

import { ReactNode, useEffect } from "react";
import { useCheckAuthQuery } from "@/services/authApi";
import { useGetActiveGameQuery } from "@/services/gameApi";
import { Spinner } from "@/components/ui/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logout, setCredentials, selectIsAuth } from "@/store/authSlice";
import { setGameStatus } from "@/store/gameSlice";
import { useRouter, usePathname } from "next/navigation";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: userData,
    isLoading: isAuthLoading,
    error: authError
  } = useCheckAuthQuery();

  const isAuth = useSelector(selectIsAuth);

  const {
    data: gameData
  } = useGetActiveGameQuery(undefined, {
    skip: !isAuth,
    pollingInterval: 0,
    refetchOnMountOrArgChange: true
  });

  useEffect(() => {
    if (userData) {
      dispatch(setCredentials({
        token: userData.token,
        id: userData.id,
        username: userData.username
      }));
    } else if (authError && 'status' in authError && authError.status === 401) {
      dispatch(logout());
    }
  }, [userData, dispatch, authError]);

  useEffect(() => {
    if (gameData) {
      dispatch(setGameStatus(gameData.status));
      if (gameData.status === 'DISCONNECTED' || gameData.status === 'CONNECTED') {
        if (pathname !== '/game') {
          router.replace('/game');
        }
      }
    }
  }, [gameData, pathname, router, dispatch]);


  if (isAuthLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen flex-col gap-4">
        <Spinner />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}