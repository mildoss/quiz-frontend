import Image from 'next/image';
import { Countdown } from "@/components/ui/Countdown";
import { GameRoom } from "@/types/game";

interface QuestionBoardProps {
  room: GameRoom;
}

export const QuestionBoard = ({ room }: QuestionBoardProps) => {
  return (
    <div className="relative w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl text-center overflow-hidden group">
      <div className="flex flex-col items-center gap-4 relative z-10">
        <span className="px-4 py-1 bg-black/40 text-cyan-300 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
          Round {room.currentQNum} / {room.qQuantity}
        </span>
        <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm md:text-base font-semibold text-cyan-300 backdrop-blur-sm shadow-md tracking-wide">
          Current topic: {room.topic}
        </span>

        <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg leading-tight">
          {room.currentQText}
        </h1>

        <div className="relative w-full max-w-md mx-auto h-64">
          <Image
            src={room.currentImageUrl}
            alt={room.currentQText}
            fill
            className="object-cover"
          />
        </div>

        <Countdown targetDate={room.roundEndTime} currentTime={room.currentTime} />
      </div>
    </div>
  );
};