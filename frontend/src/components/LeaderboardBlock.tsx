import {UserStats} from "@/types/user";
import {LeaderboardCard} from "@/components/ui/LeaderboardCard";

interface LeaderboardBlockProps {
  users: UserStats[];
}

export const LeaderboardBlock = ({users}: LeaderboardBlockProps) => {
  return (
    <ul className="flex flex-col gap-3 justify-center p-4">
      {users.map((user,index) => (
      <LeaderboardCard key={user.user_id} user={user} rank={index + 1}/>
      ))}
    </ul>
  )
}