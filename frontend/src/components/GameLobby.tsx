import { RoomUpdate } from "@/types/game";
import { Countdown } from "@/components/ui/Countdown";

interface GameLobbyProps {
  room: RoomUpdate;
  onLeave: () => void;
}

export const GameLobby = ({ room, onLeave }: GameLobbyProps) => {
  const { gameRoom } = room;

  return (
    <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-8 border border-gray-100 relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Lobby</h2>
        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
          {gameRoom.status}
        </span>
      </div>

      {gameRoom.countdownEndTime && (
        <Countdown targetDate={gameRoom.countdownEndTime} text='The game will start in' currentTime={gameRoom.currentTime}/>
      )}

      <div className="space-y-3 mb-8">
        {gameRoom.players.map((player) => (
          <div key={player.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
            <span className="font-semibold text-gray-800">{player.username}</span>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-md">
              {player.playerStatus}
            </span>
          </div>
        ))}

        {gameRoom.players.length < 2 && (
          <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center text-gray-400 italic">
            Waiting for players...
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onLeave}
          className="text-red-500 font-bold hover:text-red-700 transition-colors"
        >
          LEAVE
        </button>
      </div>
    </div>
  );
};