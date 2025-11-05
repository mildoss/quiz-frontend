'use client'

import {useParams, useRouter} from "next/navigation";
import {StatsBlock} from "@/components/StatsBlock";
import {RecentGamesTable} from "@/components/RecentGamesTable";
import {useGetStatsQuery} from "@/services/statsApi";
import {Spinner} from "@/components/ui/Spinner";
import {useSelector} from "react-redux";
import {selectUserId} from "@/store/authSlice";
import {useEffect} from "react";

export default function UserStatsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.userId);
  const currentId = useSelector(selectUserId);
  const {data, isLoading: isStatsLoading, isError} = useGetStatsQuery(userId, {
    skip: !userId || isNaN(userId) || (currentId !== null && userId === currentId)
  });

  useEffect(() => {
    if (currentId !== null && userId === currentId) {
      router.push('/stats');
    }
  }, [userId, currentId, router]);

  if (isStatsLoading || (currentId !== null && userId === currentId)) {
    return (
      <div className="flex justify-center items-center w-full min-h-[79vh]">
        <Spinner/>
      </div>
    );
  }

  if (isError || isNaN(userId)) {
    return (
      <div className="flex justify-center items-center w-full min-h-[79vh]">
        <p className="text-2xl text-red-400 font-bold">User not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center text-2xl mt-2 text-shadow-xs text-shadow-black">Stats for {data?.stats.username}</h1>
      <StatsBlock userStats={data?.stats ?? null}/>
      <h2 className="text-center text-lg mt-2 text-shadow-xs text-shadow-black">Recent games</h2>
      <div className="px-4">
        <RecentGamesTable games={data?.recentlyGames ?? null}/>
      </div>
    </div>
  )
}