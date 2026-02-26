import {PlayerItem} from "@/components/ui/PlayerItem";
import {Player} from "@/types/game";

export const PlayersSidebar = ({ players, myId }: { players: Player[], myId: number }) => (
  <aside className="w-full lg:w-80 flex flex-col gap-4">
    <div className="bg-gray-900/80 backdrop-blur border border-white/10 rounded-2xl p-5 shadow-xl h-full">
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">
        Lobby Players
      </h3>
      <ul className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600">
        {players.map((player: Player) => (
          <PlayerItem
            key={player.id}
            name={player.username}
            score={player.score ?? 0}
            isMe={myId === player.id}
            status={player.status}
            isAnswer={player.isAnswered ?? false}
          />
        ))}
      </ul>
    </div>
  </aside>
);