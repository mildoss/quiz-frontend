import {NextRequest, NextResponse} from "next/server";
import {getLeaderboard} from "@/lib/data";

const MAX_PART = 5;

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);
    const part = Number(searchParams.get("part"));

    if (!part) {
      return NextResponse.json(
        { error: "Parameter 'part' is required" },
        { status: 400 }
      );
    }

    if (isNaN(part) || part < 1) {
      return NextResponse.json(
        { error: "Parameter 'part' must be a positive number" },
        { status: 400 }
      );
    }

    if (part > MAX_PART) {
      return NextResponse.json(
        { error: `Parameter 'part' must not exceed ${MAX_PART}` },
        { status: 400 }
      );
    }

    const users = await getLeaderboard(part);
    return NextResponse.json({users});
  } catch {
    return NextResponse.json({error: "Server error"}, {status: 500});
  }
}