import {StatsCard} from "@/components/ui/StatsCard";
import {UserStats} from "@/types/user";


interface StatsBlockProps {
  userStats: UserStats | null;
}

export const StatsBlock = ({userStats}: StatsBlockProps) => {
  if (!userStats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 place-items-center px-4">
      <StatsCard title={'Total games'} subtitle={'Games played'} quantity={userStats.game_quantity}/>
      <StatsCard title={'Total score'} subtitle={'Score'} quantity={userStats.total_score}/>
      <StatsCard title={'Total wins'} subtitle={'Games won'} quantity={userStats.wins}/>
    </div>
  )
}