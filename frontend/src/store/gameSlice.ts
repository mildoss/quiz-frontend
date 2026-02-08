import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { RoomUpdate } from "@/types/game";

interface GameState {
  isSearching: boolean;
  room: RoomUpdate | null;
  status: string;
}

const initialState: GameState = {
  isSearching: false,
  room: null,
  status: "IDLE",
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    setRoomData: (state, action: PayloadAction<RoomUpdate | null>) => {
      state.room = action.payload;
      if (action.payload) {
        state.isSearching = false;
      }
    },
    setGameStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
    },
    clearGame: (state) => {
      state.isSearching = false;
      state.room = null;
    },
  },
});

export const { setIsSearching, setRoomData, setGameStatus, clearGame } = gameSlice.actions;
export default gameSlice.reducer;

export const selectIsSearching = (state: RootState) => state.game.isSearching;
export const selectGameRoom = (state: RootState) => state.game.room;