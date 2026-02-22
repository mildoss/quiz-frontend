"use client"

import Link from "next/link"
import Image from "next/image";
import {usePathname} from "next/navigation";
import {useSelector} from "react-redux";
import {selectIsAuth} from "@/store/authSlice";
import {AuthButton} from "@/components/ui/AuthButton";
import {BurgerMenu} from "@/components/ui/BurgerMenu";
import {useGameSocket} from "@/providers/SocketProvider";
import {selectGameRoom} from "@/store/gameSlice";

export const Menu = () => {
  const path = usePathname();
  const isAuth = useSelector(selectIsAuth);
  const {leaveQueue} = useGameSocket();
  const room = useSelector(selectGameRoom);
  const roomId = room?.gameRoom.id;
  const isInActiveGame = path === '/game';

  return (
    <nav className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        {isInActiveGame ? (
          <Image src="/logo.png" width={64} height={64} alt="quiz"/>
        ) : (
          <Link href="/">
            <Image className="cursor-pointer" src="/logo.png" width={64} height={64} alt="quiz"/>
          </Link>
        )}
      </div>

      {!isInActiveGame ? (
        <ul className="hidden md:flex justify-center gap-4">
          <li>
            <Link
              href="/"
              className={`px-3 py-1 rounded hover:text-gray-300 transition ${
                path === '/' ? 'border-b-2 border-amber-500 text-amber-400' : ''
              }`}
            >
              Game
            </Link>
          </li>
          <li>
            <Link
              href="/leaderboard"
              className={`px-3 py-1 rounded hover:text-gray-300 transition ${
                path === '/leaderboard' ? 'border-b-2 border-amber-500 text-amber-400' : ''
              }`}
            >
              Leaderboard
            </Link>
          </li>
          {isAuth && (
            <li>
              <Link
                href="/stats"
                className={`px-3 py-1 rounded hover:text-gray-300 transition ${
                  path === '/stats' ? 'border-b-2 border-amber-500 text-amber-400' : ''
                }`}
              >
                Stats
              </Link>
            </li>
          )}
        </ul>
      ) : (
        <div className="hidden md:block text-white font-black animate-pulse">
          GAME IN PROGRESS
        </div>
      )}

      <div className="flex items-center gap-2">
        {isInActiveGame ? (
            <button
              className=" sm:inline-block z-15 px-2 py-1 rounded bg-amber-700 cursor-pointer hover:text-amber-400 transition hover:-translate-y-1"
              onClick={() => roomId && leaveQueue(roomId)}
            >
              QUIT GAME
            </button>
          ) :
          (
            <>
              <div className="hidden sm:block">
                <AuthButton/>
              </div>
              <BurgerMenu/>
            </>
          )}
      </div>
    </nav>
  )
}