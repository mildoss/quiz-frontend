"use client"

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {selectToken} from "@/store/authSlice";
import {clearGame, selectGameRoom, selectIsSearching, setGameStatus} from "@/store/gameSlice";
import {GameLobby} from "@/components/GameLobby";
import {useGameSocket} from "@/providers/SocketProvider";
import {AppDispatch} from "@/store/store";
import {useGetTopicsQuery} from "@/services/gameApi";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectToken);
  const room = useSelector(selectGameRoom);
  const isSearching = useSelector(selectIsSearching);
  const {isConnected, findGame, leaveQueue} = useGameSocket();
  const {data: topicsData, isLoading} = useGetTopicsQuery();
  const topics = topicsData || [];
  const [selectedCount, setSelectedCount] = useState(3);
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    if (room?.gameRoom?.status === 'ACTIVE') {
      router.push('/game');
    }


    if (room?.gameRoom?.status === 'FINISHED') {
      dispatch(clearGame());
      dispatch(setGameStatus('NOT_IN_GAME'));
    }
  }, [room, router, dispatch]);

  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0]);
    }
  }, [topics, selectedTopic]);

  if (!token) return <div className="flex h-screen items-center justify-center">Unauthorized</div>;

  return (
    <div className="min-h-[calc(100vh-15vh)] flex flex-col justify-center items-center p-4">



      {!room && !isSearching && (
        <>
          <div className="sm:flex-row flex flex-col gap-6 mb-10">
            <div className="flex flex-col gap-2">
              <label className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Topic</label>
              <div className="relative">
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  disabled={isLoading}
                  className="w-60 h-12 px-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-gray-200 outline-none cursor-pointer hover:border-emerald-500/50 focus:border-emerald-500 transition-all appearance-none shadow-2xl"
                >
                  {topics.map((topic) => (
                    <option key={topic} value={topic} className="bg-[#1a1a1a]">{topic}</option>
                  ))}
                </select>
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-[10px]">▼</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Quantity</label>
              <div className="relative">
                <select
                  value={selectedCount}
                  onChange={(e) => setSelectedCount(Number(e.target.value))}
                  className="w-60 h-12 px-4 bg-[#1a1a1a] border border-white/10 rounded-xl text-gray-200 outline-none cursor-pointer hover:border-emerald-500/50 focus:border-emerald-500 transition-all appearance-none shadow-2xl"
                >
                  {Array.from({length: 13}, (_, i) => i + 3).map((num) => (
                    <option key={num} value={num} className="bg-[#1a1a1a]">{num}</option>
                  ))}
                </select>
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-[10px]">▼</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => findGame(selectedCount, selectedTopic)}
              disabled={!isConnected}
              className="bg-black text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-gray-800 disabled:bg-gray-400 transition-all active:scale-95 shadow-xl cursor-pointer"
            >
              {isConnected ? 'FIND GAME' : 'CONNECTION...'}
            </button>
          </div>
        </>
      )}

      {room && (
        <GameLobby room={room} onLeave={() => leaveQueue(room.gameRoom.id)}/>
      )}
    </div>
  );
}