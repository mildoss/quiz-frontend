import pool from '@/lib/db';
import { cache } from 'react';
import {UserStats} from "@/types/user";
import {Game} from "@/types/game";

export const getUserStatsById = cache(async (userId: number) => {
  try {
    const {rows} = await pool.query<UserStats>(
      'SELECT * FROM users_info WHERE user_id = $1',
      [userId]
    );
    return rows[0];
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return [];
  }
});

export const getRecentlyGamesById = cache(async (userId: number)=> {
  try {
    const {rows} = await pool.query<Game>(
      'SELECT * FROM games WHERE user_info_id = $1 ORDER BY date DESC LIMIT 10',
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('Failed to fetch recently games:', error);
    return [];
  }
})

export const getLeaderboard = cache(async (part: number) => {
  try {
    const limit = 20;
    const offset = (part - 1) * limit;
    const {rows} = await pool.query<UserStats>(
      'SELECT * FROM users_info ORDER BY score DESC, wins DESC, user_id ASC OFFSET $1 LIMIT $2',
      [offset,limit]
    );
    return rows;
  } catch (error) {
    console.error('Failed to fetch recently games:', error);
    return [];
  }
})