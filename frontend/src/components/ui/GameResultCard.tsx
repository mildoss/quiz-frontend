import Link from "next/link";
import { GameInfoResponse } from "@/types/game";

interface GameResultCardProps {
  user: GameInfoResponse;
  rank: number;
}

export const GameResultCard = ({ user, rank }: GameResultCardProps) => {
  const isFirst = rank === 1;

  return (
    <div className="w-full lg:w-8/12 m-auto">
      <Link
        href={`/stats/${user.user_id}`}
        className={`flex justify-between items-center p-5 rounded-xl transition-all duration-300 shadow-lg
          ${isFirst
          ? "bg-gradient-to-r from-yellow-100 to-amber-200 border-2 border-yellow-400 scale-105 z-10"
          : "bg-white/90 hover:bg-white hover:-translate-y-1"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className={`text-2xl font-black ${isFirst ? "text-yellow-600" : "text-gray-400"}`}>
            #{rank}
          </span>
          <h2 className={`text-xl font-bold ${isFirst ? "text-amber-900" : "text-gray-800"}`}>
            {user.username} {isFirst && "👑"}
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-amber-600">
              <span className="text-xl">⭐</span>
              <span className="text-2xl font-black">{user.score}</span>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider
            ${user.status
            ? "bg-emerald-100 text-emerald-600 border border-emerald-200"
            : "bg-red-100 text-red-500 border border-red-200"
          }`}
          >
            {user.status ? 'Winner' : 'Player'}
          </div>
        </div>
      </Link>
    </div>
  );
};