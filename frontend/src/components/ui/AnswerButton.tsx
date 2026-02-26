import {useGameSocket} from "@/providers/SocketProvider";

export const ANSWER_THEMES = [
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

type ThemeConfig = typeof ANSWER_THEMES[number];

interface AnswerButtonProps {
  theme: ThemeConfig;
  label: string;
  roomId: number;
  qId: number;
  answerId: number;
  disabled: boolean;
}

export const AnswerButton = ({theme, label, roomId, answerId, qId, disabled}: AnswerButtonProps) => {
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