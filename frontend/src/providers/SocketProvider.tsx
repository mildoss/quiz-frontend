'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import { useDispatch, useSelector } from 'react-redux';
import {selectToken, selectUserId} from '@/store/authSlice';
import {setRoomData, setIsSearching, clearGame, selectGameRoom} from '@/store/gameSlice';
import {usePathname, useRouter} from "next/navigation";
import {GameStatus, Player} from "@/types/game";
import {gameApi} from "@/services/gameApi";
import {AppDispatch} from "@/store/store";

interface SocketContextType {
  isConnected: boolean;
  findGame: (quantity: number, topic: string) => void;
  reconnectInGame: () => void;
  leaveQueue: (roomId: number) => void;
  sendAnswer: (args: { qId: number; answerId: number; roomId: number }) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const token = useSelector(selectToken);
  const room = useSelector(selectGameRoom);
  const dispatch = useDispatch<AppDispatch>();
  const stompClient = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();
  const roomSubscription = useRef<StompSubscription | null>(null);
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL;
  const myId = useSelector(selectUserId);
  const isQuittingRef = useRef(false);
  const pathname = usePathname();

  const subscribeToRoomTopic = useCallback((client: Client, topic: string) => {
    if (roomSubscription.current) {
      roomSubscription.current.unsubscribe();
    }

    roomSubscription.current = client.subscribe(topic, (roomMsg) => {
      const update = JSON.parse(roomMsg.body);

      const roomUpdate = update.gameRoom || update;
      const status = roomUpdate?.status;

      if (status === GameStatus.FINISHED) {
        isQuittingRef.current = false;

        if (update && !update.gameRoom) {
          dispatch(setRoomData({ gameRoom: update, gameRoomTopic: topic }));
        } else {
          dispatch(setRoomData(update));
        }

        if (roomSubscription.current) {
          roomSubscription.current.unsubscribe();
          roomSubscription.current = null;
        }
      } else {
        const myPlayer = roomUpdate?.players?.find((p: Player) => p.id === myId);
        const amIDisconnected = !myPlayer || myPlayer.status === 'DISCONNECTED';

        if (amIDisconnected && isQuittingRef.current) {
          isQuittingRef.current = false;

          if (roomSubscription.current) {
            roomSubscription.current.unsubscribe();
            roomSubscription.current = null;
          }

          dispatch(clearGame());

          dispatch(gameApi.util.updateQueryData('getActiveGame', undefined, (draft) => {
            draft.status = 'NOT_IN_GAME';
          }));

          router.push('/');
        } else {
          if (update && !update.gameRoom) {
            dispatch(setRoomData({ gameRoom: update, gameRoomTopic: topic }));
          } else {
            dispatch(setRoomData(update));
          }
        }
      }
    });
  }, [dispatch, myId, router]);

  useEffect(() => {
    if (!token) return;

    const client = new Client({
      brokerURL: `${WS_URL}/ws-game?token=${token}`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setIsConnected(true);

      client.subscribe('/user/queue/reply', (message) => {
        try {
          const data = JSON.parse(message.body);

          const status = data?.gameRoom?.status || data?.status;
          if (status === GameStatus.FINISHED) {
            return;
          }

          dispatch(setRoomData(data));

          if (data?.gameRoomTopic) {
            subscribeToRoomTopic(client, data.gameRoomTopic);
          }
        } catch (e) {
          console.error("Error parsing message:", e);
        }
      });
    };

    client.onDisconnect = () => {
      setIsConnected(false);
      dispatch(clearGame());
    };

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [token, dispatch, subscribeToRoomTopic, WS_URL]);

  const findGame = useCallback((quantity: number, topic: string) => {
    if (stompClient.current && isConnected) {
      dispatch(setIsSearching(true));
      stompClient.current.publish({ destination: `/app/join-game_room/${quantity}/${topic}` });
    }
  }, [isConnected, dispatch]);

  const reconnectInGame = useCallback(() => {
    if (stompClient.current && isConnected) {
      dispatch(setIsSearching(true));
      stompClient.current.publish({ destination: `/app/reconnect` });
    }
  }, [isConnected, dispatch])

  const leaveQueue = useCallback((roomId: number) => {
    if (stompClient.current && isConnected) {
      isQuittingRef.current = true;

      stompClient.current.publish({
        destination: `/app/leave-game_room/${roomId}`
      });

      if (
        room?.gameRoom?.status === GameStatus.ACTIVE ||
        room?.gameRoom?.status === GameStatus.ROUND_FINISHED
      ) {
        return;
      }

      isQuittingRef.current = false;
      if (roomSubscription.current) {
        roomSubscription.current.unsubscribe();
        roomSubscription.current = null;
      }

      dispatch(clearGame());
      dispatch(gameApi.util.updateQueryData('getActiveGame', undefined, (draft) => {
        draft.status = 'NOT_IN_GAME';
      }));
      router.push('/');
    }
  }, [router, isConnected, dispatch, room?.gameRoom?.status]);

  const sendAnswer = useCallback(({qId, answerId, roomId} :{qId: number, answerId: number, roomId: number}) => {
    if (stompClient.current && isConnected) {
      stompClient.current.publish({ destination: `/app/answer/${qId}/${answerId}/${roomId}`})
    }
  }, [isConnected]);

  useEffect(() => {
    if (pathname !== '/' && room?.gameRoom) {
      const status = room.gameRoom.status;
      if (status === GameStatus.WAITING || status === GameStatus.COUNTDOWN) {
        leaveQueue(room.gameRoom.id);
      }
    }
  }, [pathname, room?.gameRoom?.status, room?.gameRoom?.id, leaveQueue]);

  return (
    <SocketContext.Provider value={{ isConnected, findGame, reconnectInGame, leaveQueue, sendAnswer }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useGameSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useGameSocket must be used within a SocketProvider');
  }
  return context;
};
