'use client'

import {GameRoom} from "@/types/game";
import {useSelector} from "react-redux";
import {selectUserId} from "@/store/authSlice";
import {useMemo} from "react";
import {Countdown} from "@/components/ui/Countdown";

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

      <ul
        className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600">
        {sortedPlayers.map((player) => (
          <PlayerItem
            key={player.id}
            name={player.username}
            score={player.score ?? 0}
            isMe={myId === player.id}
            status={player.status}
            isCorrect={player.isCorrect ?? false}
          />
        ))}
      </ul>
    </div>
  )
}

const PlayerItem = ({name, score, status, isMe = false, isCorrect}: {
  name: string,
  score: number,
  status: string,
  isMe?: boolean,
  isCorrect: boolean
}) => {
  return (
    <li className={`
      flex justify-between items-center p-3 rounded-lg border transition-all duration-300
      ${
      isCorrect
        ? "bg-emerald-600/40 border-emerald-500/50 text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]" // Зеленый (Правильно)
        : "bg-red-600/20 border-red-500/50 text-gray-200" // Красный (Неправильно)
    }
    `}>
      <div className="flex items-center gap-3 min-w-0 flex-1">

        <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center font-bold text-xs relative
          ${isMe ? "bg-amber-500 text-black" : "bg-gray-700 text-gray-300"}
        `}>
          {name.charAt(0).toUpperCase()}
          <span className={`absolute bottom-0 right-0 w-2 h-2 rounded ${status === 'CONNECTED' ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
        </div>

        <span className={`font-medium truncate ${isMe ? "font-bold" : ""}`} title={name}>
          {name} {isMe && "(You)"}
        </span>
      </div>

      <div className="flex items-center gap-1 text-amber-400 font-bold text-sm shrink-0">
        {isCorrect ? (
          <span className="text-emerald-400 font-bold text-xs mr-2 animate-pulse">
             CORRECT
          </span>
        ) : (
          <span className="text-red-400 font-bold text-xs mr-2">
             WRONG
          </span>
        )}
        <span>{score}</span>
        <span className="text-xs">⭐️</span>
      </div>
    </li>
  )
}