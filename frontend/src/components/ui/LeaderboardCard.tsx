import {UserStats} from "@/types/user";

interface LeaderboardCardProps {
  user: UserStats;
  rank: number;
}

export const LeaderboardCard = ({user,rank}: LeaderboardCardProps) => {

  const getRankInfo = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-400'
      case 3: return 'text-orange-500'
      default: return 'text-gray-600'
    }
  }

  const getRankBg = (rank: number) => {
    switch(rank) {
      case 1: return "bg-yellow-200";
      case 2: return "bg-gray-300";
      case 3: return "bg-orange-200";
      default: return "bg-white/90";
    }
  }

  return (
    <div className={`${getRankBg(rank)} w-full lg:w-8/12 flex justify-between gap-2 p-4 rounded m-auto text-amber-600 hover:-translate-y-0.5 hover:ease-in-out`}>
      <div className="flex gap-2">
        <span className={`${getRankInfo(rank)} font-bold`}>#{rank}</span>
        <h2>{user.username}</h2>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center gap-1">
          <span>⭐</span>
          <p>{user.score}</p>
        </div>
        <div className="flex items-center gap-1">
          <span>🏆</span>
          <p>{user.wins}</p>
        </div>
      </div>
    </div>
  )
}