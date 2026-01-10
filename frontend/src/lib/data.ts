import pool from '@/lib/db';
import { cache } from 'react';
import {UserStats} from "@/types/user";
import {Game, GameInfoResponse} from "@/types/game";

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
      'SELECT gp.game_id, gp.status, gp.score, g.date ' +
      'FROM games_players gp ' +
      'JOIN games g ON gp.game_id = g.id ' +
      'WHERE gp.user_id = $1 ' +
      'ORDER BY g.date DESC ' +
      'LIMIT 10',
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
      'SELECT * FROM users_info ORDER BY total_score DESC, wins DESC, user_id ASC OFFSET $1 LIMIT $2',
      [offset,limit]
    );
    return rows;
  } catch (error) {
    console.error('Failed to fetch recently games:', error);
    return [];
  }
})

export const getGamesInfo = cache(async (gameId: number) => {
  try {
    const { rows } = await pool.query<GameInfoResponse>(
      `SELECT gp.game_id, gp.user_id, gp.score, gp.status, ui.username, ui.user_id
        FROM games_players gp
        JOIN users_info ui ON gp.user_id = ui.user_id
        WHERE gp.game_id = $1
        ORDER BY gp.score DESC`,
      [gameId]
    );
    return rows;
  } catch (error) {
    console.error('Failed to fetch games:', error);
    return [];
  }
})