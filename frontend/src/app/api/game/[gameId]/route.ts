import {NextRequest, NextResponse} from "next/server";
import {getGamesInfo} from "@/lib/data";

export async function GET (
  request: NextRequest,
  context: { params: Promise<{ gameId: string }> }
) {
  const {gameId} = await context.params;

  const id = Number(gameId);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid game ID" }, { status: 400 });
  }

  try {
    const game = await getGamesInfo(id);

    if (!game) {
      return NextResponse.json({ error: "Stats not found" }, { status: 404 });

    }

    return NextResponse.json(game);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
