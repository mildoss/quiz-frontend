"use client"

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {selectToken} from "@/store/authSlice";
import {selectGameRoom, selectIsSearching} from "@/store/gameSlice";
import {GameLobby} from "@/components/GameLobby";
import {useGameSocket} from "@/providers/SocketProvider";

export default function Home() {
  const router = useRouter();
  const token = useSelector(selectToken);
  const room = useSelector(selectGameRoom);
  const isSearching = useSelector(selectIsSearching);
  const {isConnected, findGame, leaveQueue} = useGameSocket();

  useEffect(() => {
    if (room?.gameRoom?.status === 'ACTIVE') {
      router.push('/game');
    }
  }, [room, router]);

  if (!token) return <div className="flex h-screen items-center justify-center">Unauthorized</div>;

  return (
    <div className="min-h-[calc(100vh-15vh)] flex flex-col justify-center items-center p-4">

      {!room && !isSearching && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={findGame}
            disabled={!isConnected}
            className="bg-black text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-800 disabled:bg-gray-400 transition-all active:scale-95 shadow-xl"
          >
            {isConnected ? 'FIND GAME' : 'CONNECTION...'}
          </button>
        </div>
      )}

      {room && (
        <GameLobby room={room} onLeave={() => leaveQueue(room.gameRoom.id)}/>
      )}
    </div>
  );
}