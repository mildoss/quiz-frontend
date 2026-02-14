'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '@/store/authSlice';
import { setRoomData, setIsSearching, clearGame } from '@/store/gameSlice';
import {router} from "next/dist/client";

interface SocketContextType {
  isConnected: boolean;
  findGame: () => void;
  leaveQueue: (roomId: number) => void;
  sendAnswer: (args: { qId: number; answerId: number; roomId: number }) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const stompClient = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const roomSubscription = useRef<StompSubscription | null>(null);
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

  const subscribeToRoomTopic = useCallback((client: Client, topic: string) => {
    if (roomSubscription.current) {
      roomSubscription.current.unsubscribe();
    }

    roomSubscription.current = client.subscribe(topic, (roomMsg) => {
      const update = JSON.parse(roomMsg.body);
      if (update && !update.gameRoom) {
        dispatch(setRoomData({ gameRoom: update, gameRoomTopic: topic }));
      } else {
        dispatch(setRoomData(update));
      }
    });
  }, [dispatch]);

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

  const findGame = useCallback(() => {
    if (stompClient.current && isConnected) {
      dispatch(setIsSearching(true));
      stompClient.current.publish({ destination: '/app/join-game_room' });
    }
  }, [isConnected, dispatch]);

  const leaveQueue = useCallback((roomId: number) => {
    if (stompClient.current && isConnected) {
      if (roomSubscription.current) {
        roomSubscription.current.unsubscribe();
        roomSubscription.current = null;
      }

      stompClient.current.publish({
        destination: `/app/leave-game_room/${roomId}`
      });

      dispatch(clearGame());
      router.push('/');
    }
  }, [isConnected, dispatch]);

  const sendAnswer = ({qId, answerId, roomId} :{qId: number, answerId: number, roomId: number}) => {
    if (stompClient.current && isConnected) {
      stompClient.current.publish({ destination: `/app/answer/${qId}/${answerId}/${roomId}`})
    }
  }

  return (
    <SocketContext.Provider value={{ isConnected, findGame, leaveQueue, sendAnswer }}>
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