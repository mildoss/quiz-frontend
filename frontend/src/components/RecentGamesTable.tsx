import {Game} from "@/types/game";

interface RecentlyGamesProps {
  games: Game[] | null;
}

export const RecentGamesTable = ({games}: RecentlyGamesProps) => {
  if (!games) return null;

  if (games.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        No recent games found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] bg-white/90 text-gray-800 border-collapse rounded-lg overflow-hidden shadow-lg mb-4">
        <thead>
        <tr className="bg-blue-900 text-white">
          <th className="w-1/4 px-4 py-2 text-left text-sm font-bold">ID</th>
          <th className="w-1/4 px-4 py-2 text-center text-sm font-bold">SCORE</th>
          <th className="w-1/4 px-4 py-2 text-center text-sm font-bold">STATUS</th>
          <th className="w-1/4 px-4 py-2 text-right text-sm font-bold">END DATE</th>
        </tr>
        </thead>
        <tbody>
        {games.map((game) => (
          <tr key={game.game_id} className="hover:bg-gray-300 transition-colors ease-in-out duration-300">
            <td className="w-1/4 px-4 py-2 text-left">{game.game_id}</td>
            <td className="w-1/4 px-4 py-2 text-center text-amber-600 font-bold">{game.score}</td>
            <td className={`w-1/4 px-4 py-2 text-center font-bold ${game.status ? 'text-emerald-600' : 'text-red-600'}`}>{game.status ? 'WIN' : 'LOSE'}</td>
            <td className="w-1/4 px-4 py-2 text-right">{new Date(game.date).toLocaleString()}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}