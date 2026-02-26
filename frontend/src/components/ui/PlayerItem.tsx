export const PlayerItem = ({name, score, status, isMe = false, isAnswer}: {
  name: string,
  score: number,
  status: string,
  isMe?: boolean,
  isAnswer: boolean
}) => {
  return (
    <li className={`
      flex justify-between items-center p-3 rounded-lg border transition-all duration-300
      ${
      isAnswer
        ? "bg-emerald-600/40 border-emerald-500/50 text-white shadow-[0_0_10px_rgba(16,185,129,0.2)]"
        : isMe
          ? "bg-white/10 border-amber-500/50 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          : "bg-transparent border-transparent hover:bg-white/5 text-gray-300"
    }
    `}>
      <div className="flex items-center gap-3 min-w-0 flex-1">

        <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center font-bold text-xs relative
          ${isMe ? "bg-amber-500 text-black" : "bg-gray-700 text-gray-300"}
        `}>
          {name.charAt(0).toUpperCase()}
          <span
            className={`absolute bottom-0 right-0 w-2 h-2 rounded ${status === 'CONNECTED' ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
        </div>

        <span className={`font-medium truncate ${isMe ? "font-bold" : ""}`} title={name}>
          {name} {isMe && "(You)"}
        </span>
      </div>

      <div className="flex items-center gap-1 text-amber-400 font-bold text-sm shrink-0">
        {isAnswer && (
          <span className="text-emerald-400 font-bold text-xs mr-2 animate-pulse">
             ANSWERED
          </span>
        )}
        <span>{score}</span>
        <span className="text-xs">⭐️</span>
      </div>
    </li>
  )
}