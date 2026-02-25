import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization');

  try {
    const response = await fetch(`${process.env.GAME_API_URL}/api/game/topics`, {
      headers: {
        'Authorization': token || '',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Backend error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}