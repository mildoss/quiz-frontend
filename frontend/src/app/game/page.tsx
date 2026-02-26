'use client'

import { useGameSocket } from "@/providers/SocketProvider";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectGameRoom } from "@/store/gameSlice";
import { selectUserId } from "@/store/authSlice";
import { Spinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { RoundResults } from "@/components/RoundResults";
import { useGetActiveGameQuery } from "@/services/gameApi";
import { GameStatus } from "@/types/game";
import { QuestionBoard } from "@/components/QuestionBoard";
import { AnswerGrid } from "@/components/AnswerGrid";
import { PlayersSidebar } from "@/components/PlayerSidebar";

export default function GamePage() {
  const { isConnected, findGame } = useGameSocket();
  const { data: gameData } = useGetActiveGameQuery();
  const room = useSelector(selectGameRoom);
  const gameRoom = room?.gameRoom;
  const myId = useSelector(selectUserId);
  const router = useRouter();
  const isFinishedRound = gameRoom?.status === GameStatus.ROUND_FINISHED;
  const isFinishedGame = gameRoom?.status === GameStatus.FINISHED;

  const iAmAnswered = useMemo(() => {
    return gameRoom?.players.find(p => p.id === myId)?.isAnswered ?? false;
  }, [gameRoom, myId]);

  useEffect(() => {
    if (isConnected && !gameRoom && (gameData?.status === 'CONNECTED' || gameData?.status === 'DISCONNECTED')) {
      findGame();
    }
  }, [isConnected, gameRoom, gameData?.status, findGame]);

  useEffect(() => {
    if (gameRoom && isFinishedGame && gameRoom?.gameId) {
      router.push(`/game/${gameRoom.gameId}`);
    }
  }, [gameRoom, isFinishedGame, router]);

  if (!gameRoom || isFinishedGame) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (isFinishedRound) {
    return <RoundResults game={gameRoom} />
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-6">
      <QuestionBoard room={gameRoom} />

      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <AnswerGrid
          answers={gameRoom.currentAnswers}
          roomId={gameRoom.id}
          qId={gameRoom.currentQId}
          disabled={iAmAnswered}
        />

        <PlayersSidebar
          players={gameRoom.players}
          myId={myId ?? 0}
        />
      </div>
    </div>
  );
}