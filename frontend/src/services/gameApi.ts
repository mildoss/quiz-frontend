import {baseApi} from "@/services/api";
import {GameInfoResponse} from "@/types/game";

export const gameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGameInfo: builder.query<GameInfoResponse[], number>({
      query: (gameId) => ({
        url: `/game/${gameId}`,
        method: 'GET',
      }),
    }),
  })
})

export const {useGetGameInfoQuery} = gameApi;

