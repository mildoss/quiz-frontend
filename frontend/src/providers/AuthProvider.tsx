'use client'

import { ReactNode, useEffect } from "react";
import { useCheckAuthQuery } from "@/services/authApi";
import { useGetActiveGameQuery } from "@/services/gameApi";
import { Spinner } from "@/components/ui/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { logout, setCredentials, selectIsAuth } from "@/store/authSlice";
import { selectGameRoom, setGameStatus } from "@/store/gameSlice";
import { useRouter, usePathname } from "next/navigation";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const room = useSelector(selectGameRoom);

  const {
    data: userData,
    isLoading: isAuthLoading,
    error: authError
  } = useCheckAuthQuery();

  const isAuth = useSelector(selectIsAuth);

  const {
    data: gameData,
    isLoading: isGameStatusLoading,
    refetch: refetchGame
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
    const isSocketActive = room?.gameRoom?.status === 'ACTIVE';
    const isGameFinished = room?.gameRoom?.status === 'FINISHED';

    const effectiveStatus = isSocketActive ? 'CONNECTED' : gameData?.status;

    if (effectiveStatus) {
      dispatch(setGameStatus(effectiveStatus));

      const isResultPage = pathname.startsWith('/game/') && pathname !== '/game';

      if (effectiveStatus === 'DISCONNECTED' || effectiveStatus === 'CONNECTED') {
        if (pathname !== '/game' && !isResultPage && !isGameFinished) {
          router.replace('/game');
        }
      } else {
        if (pathname === '/game') {
          router.replace('/');
        }
      }
    }
  }, [gameData, room, pathname, router, dispatch]);

  useEffect(() => {
    if (isAuth) {
      refetchGame();
    }
  }, [pathname, isAuth, refetchGame]);

  if (isAuthLoading || (isAuth && isGameStatusLoading)) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen flex-col gap-4">
        <Spinner />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}