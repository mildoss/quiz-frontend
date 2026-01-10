'use client'

import { useGetGameInfoQuery } from "@/services/gameApi";
import { useParams, useRouter } from "next/navigation";
import {GameResultCard} from "@/components/ui/GameResultCard";

export default function GameInfoPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = Number(params.gameId);
  const { data, isLoading, isError } = useGetGameInfoQuery(gameId);

  if (isLoading) return <div className="flex justify-center text-2xl mt-10">Loading...</div>;

  if (isError || !data || data.length === 0) {
    router.push('/');
    return null;
  }

  return (
    <div className="pb-10">
      <h1 className="text-center text-3xl font-bold mt-6 text-white drop-shadow-md">
        Results of Match #{gameId}
      </h1>

      <div className="flex flex-col gap-3 mt-8 px-4">
        {data.map((user, index) => (
          <GameResultCard
            key={user.user_id}
            user={user}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}