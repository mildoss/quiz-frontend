'use client'

import {GameRoom} from "@/types/game";
import {useSelector} from "react-redux";
import {selectUserId} from "@/store/authSlice";
import {useMemo} from "react";
import {Countdown} from "@/components/ui/Countdown";
import {PlayerItem} from "@/components/ui/PlayerItem";

export const RoundResults = ({game}: {game: GameRoom}) => {
  const myId = useSelector(selectUserId);

  const sortedPlayers = useMemo(() => {
    return [...game.players].sort((a, b) => {
      const scoreDiff = (b.score ?? 0) - (a.score ?? 0);
      if (scoreDiff !== 0) return scoreDiff;
      if (a.isCorrect && !b.isCorrect) return -1;
      if (!a.isCorrect && b.isCorrect) return 1;
      return 0;
    });
  }, [game.players]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
      <h2 className="text-3xl font-black text-white text-center mb-6 drop-shadow-lg">
        Results of Round #{game.currentQNum}
      </h2>

      <Countdown targetDate={game.roundEndTime} currentTime={game.currentTime}/>

      <ul className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600">
        {sortedPlayers.map((player) => (
          <PlayerItem
            key={player.id}
            name={player.username}
            score={player.score ?? 0}
            isMe={myId === player.id}
            status={player.status}
            variant={player.isCorrect ? 'correct' : 'wrong'}
          />
        ))}
      </ul>
    </div>
  )
}
