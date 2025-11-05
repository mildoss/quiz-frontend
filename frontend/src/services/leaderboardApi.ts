import {baseApi} from "@/services/api";
import {LeaderboardResponse} from "@/types/user";

export const leaderboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query<LeaderboardResponse,number>({
      query: (part) => ({
        url: `/leaderboard/?part=${part}`
      })
    })
  })
})

export const {useGetLeaderboardQuery} = leaderboardApi;