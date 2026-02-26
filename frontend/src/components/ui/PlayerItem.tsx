export type PlayerItemVariant = 'default' | 'answered' | 'correct' | 'wrong';

interface PlayerItemProps {
  name: string;
  score: number;
  status: string;
  isMe?: boolean;
  variant?: PlayerItemVariant;
}

export const PlayerItem = ({
                             name,
                             score,
                             status,
                             isMe = false,
                             variant = 'default'
                           }: PlayerItemProps) => {
  let containerClass = "bg-transparent border-transparent hover:bg-white/5 text-gray-300";
  if (isMe && variant === 'default') {
    containerClass = "bg-white/10 border-amber-500/50 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]";
  }

  let statusLabel = null;

  if (variant === 'answered') {
    containerClass = "bg-emerald-600/40 border-emerald-500/50 text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]";
    statusLabel = <span className="text-emerald-400 font-bold text-xs mr-2 animate-pulse">ANSWERED</span>;
  } else if (variant === 'correct') {
    containerClass = "bg-emerald-600/40 border-emerald-500/50 text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]";
    statusLabel = <span className="text-emerald-400 font-bold text-xs mr-2 animate-pulse">CORRECT</span>;
  } else if (variant === 'wrong') {
    containerClass = "bg-red-600/20 border-red-500/50 text-gray-200";
    statusLabel = <span className="text-red-400 font-bold text-xs mr-2">WRONG</span>;
  }

  return (
    <li
      className={`flex justify-between items-center p-3 rounded-lg border transition-all duration-300 ${containerClass}`}>
      <div className="flex items-center gap-3 min-w-0 flex-1">

        <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center font-bold text-xs relative
          ${isMe ? "bg-amber-500 text-black" : "bg-gray-700 text-gray-300"}
        `}>
          {name.charAt(0).toUpperCase()}
          <span
            className={`absolute bottom-0 right-0 w-2 h-2 rounded ${status === 'CONNECTED' ? 'bg-emerald-400' : 'bg-red-500'}`}
          ></span>
        </div>

        <span className={`font-medium truncate ${isMe ? "font-bold" : ""}`} title={name}>
          {name} {isMe && "(You)"}
        </span>
      </div>

      <div className="flex items-center gap-1 text-amber-400 font-bold text-sm shrink-0">
        {statusLabel}
        <span>{score}</span>
        <span className="text-xs">⭐️</span>
      </div>
    </li>
  )
}