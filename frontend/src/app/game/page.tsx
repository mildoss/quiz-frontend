'use client'

import {useGameSocket} from "@/providers/SocketProvider";
import {useEffect, useMemo} from "react";
import {useSelector} from "react-redux";
import {selectGameRoom} from "@/store/gameSlice";
import {selectUserId} from "@/store/authSlice";
import {Spinner} from "@/components/ui/Spinner";
import {Countdown} from "@/components/ui/Countdown";
import {useRouter} from "next/navigation";

const ANSWER_THEMES = [
  {
    name: 'red',
    icon: '🟥',
    styles: "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-900/50 hover:shadow-rose-500/40 ring-rose-400"
  },
  {
    name: 'blue',
    icon: '🟦',
    styles: "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-900/50 hover:shadow-blue-500/40 ring-blue-400"
  },
  {
    name: 'yellow',
    icon: '🟨',
    styles: "bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-900/50 hover:shadow-orange-500/40 ring-amber-300"
  },
  {
    name: 'green',
    icon: '🟩',
    styles: "bg-gradient-to-br from-emerald-400 to-green-600 shadow-green-900/50 hover:shadow-emerald-500/40 ring-emerald-300"
  }
] as const;

export default function GamePage() {
  const {isConnected, findGame} = useGameSocket();
  const room = useSelector(selectGameRoom);
  const gameRoom = room?.gameRoom;
  const myId = useSelector(selectUserId);
  const router = useRouter();
  const isFinishedRound = gameRoom?.status === 'ROUND_FINISHED';

  const iAmAnswered = useMemo(() => {
    return gameRoom?.players.find(p => p.id === myId)?.isAnswered ?? false;
  }, [gameRoom, myId]);

  useEffect(() => {
    if (isConnected) {
      findGame();
    }
  }, [isConnected, findGame])

  useEffect(() => {
    if (!gameRoom && !isFinishedRound) {
      router.push('/');
    }
  }, [gameRoom, isFinishedRound, router]);

  if (!gameRoom || isFinishedRound) {
    return <div className="flex justify-center items-center min-h-screen">
      <Spinner/>
    </div>
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-6">

      <div
        className="relative w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl text-center overflow-hidden group">

        <div className="flex flex-col items-center gap-4 relative z-10">
          <span
            className="px-4 py-1 bg-black/40 text-cyan-300 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
            Round {gameRoom?.currentQNum} / {gameRoom?.qQuantity}
          </span>

          <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg leading-tight">
            {gameRoom.currentQText}
          </h1>

          <Countdown targetDate={gameRoom.roundEndTime} currentTime={gameRoom.currentTime}/>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full">

        <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">

          {gameRoom.currentAnswers.map((question, index) => {
            const theme = ANSWER_THEMES[index % ANSWER_THEMES.length];

            return (
              <AnswerButton
                key={question.id}
                theme={theme}
                label={question.text}
                roomId={gameRoom.id}
                qId={gameRoom.currentQId}
                answerId={question.id}
                disabled={iAmAnswered}
              />
            )
          })}
        </main>

        <aside className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-gray-900/80 backdrop-blur border border-white/10 rounded-2xl p-5 shadow-xl h-full">
            <h3
              className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">
              Lobby Players
            </h3>

            <ul
              className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-600">
              {gameRoom.players.map((player) => (
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

      </div>
    </div>
  )
}

type ThemeConfig = typeof ANSWER_THEMES[number];

interface AnswerButtonProps {
  theme: ThemeConfig;
  label: string;
  roomId: number;
  qId: number;
  answerId: number;
  disabled: boolean;
}

const AnswerButton = ({theme, label, roomId, answerId, qId, disabled}: AnswerButtonProps) => {
  const disabledStyle = "opacity-50 cursor-not-allowed grayscale scale-95";
  const {sendAnswer} = useGameSocket();

  return (
    <button
      onClick={() => !disabled && sendAnswer({qId, answerId, roomId})}
      disabled={disabled}
      className={`
      relative group flex items-center justify-between p-6 sm:p-10 rounded-2xl 
      text-white text-left shadow-lg transition-all duration-200 ease-out
      hover:-translate-y-1 hover:brightness-110 active:translate-y-0 active:scale-95
      focus:outline-none focus:ring-4 ring-offset-2 ring-offset-transparent
      ${disabled ? disabledStyle : 'hover:-translate-y-1 hover:brightness-110 active:translate-y-0 active:scale-95'}
      ${theme.styles}
    `}>
      <span className="text-xl sm:text-2xl font-bold drop-shadow-md">{label}</span>
      <span
        className="text-3xl opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all">{theme.icon}</span>
    </button>
  );
};

const PlayerItem = ({name, score, status, isMe = false, isAnswer}: {
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
          <span className={`absolute bottom-0 right-0 w-2 h-2 rounded ${status === 'CONNECTED' ? 'bg-emerald-400' : 'bg-red-500'}`}></span>
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
