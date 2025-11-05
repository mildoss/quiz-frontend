'use client'

import {LeaderboardBlock} from "@/components/LeaderboardBlock";
import {useEffect, useState, useRef} from "react";
import {useGetLeaderboardQuery} from "@/services/leaderboardApi";
import {Spinner} from "@/components/ui/Spinner";
import {UserStats} from "@/types/user";

export default function Leaderboard() {
  const [part, setPart] = useState(1);
  const [allUsers, setAllUsers] = useState<UserStats[]>([]);
  const {data, isLoading} = useGetLeaderboardQuery(part);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (data?.users && !isLoading) {
      setAllUsers(prev => {
        const existingIds = new Set(prev.map(user => user.user_id));
        const newUsers = data.users.filter(user => !existingIds.has(user.user_id));
        return [...prev, ...newUsers];
      });
      isLoadingRef.current = false;
    }
  }, [data, isLoading]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom =
        document.documentElement.scrollHeight -
        (document.documentElement.scrollTop + window.innerHeight) < 100;

      if (scrolledToBottom && !isLoadingRef.current && part < 5) {
        isLoadingRef.current = true;
        setPart(prev => prev + 1);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, [part]);

  if (allUsers.length === 0 && isLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-[79vh]">
        <Spinner/>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center text-2xl mt-2 text-shadow-xs text-shadow-black">
        Top 100 users by score
      </h1>
      <LeaderboardBlock users={allUsers}/>
    </div>
  )
}