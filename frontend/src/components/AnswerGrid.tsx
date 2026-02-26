import { ANSWER_THEMES, AnswerButton } from "@/components/ui/AnswerButton";
import { Answer } from "@/types/game";

interface AnswerGridProps {
  answers: Answer[];
  roomId: number;
  qId: number;
  disabled: boolean;
}

export const AnswerGrid = ({ answers, roomId, qId, disabled }: AnswerGridProps) => (
  <main className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
    {answers?.map((question: Answer, index: number) => {
      const theme = ANSWER_THEMES[index % ANSWER_THEMES.length];
      return (
        <AnswerButton
          key={question.id}
          theme={theme}
          label={question.text}
          roomId={roomId}
          qId={qId}
          answerId={question.id}
          disabled={disabled}
        />
      );
    })}
  </main>
);