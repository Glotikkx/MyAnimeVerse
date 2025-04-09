// app/api/anime-cover/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { title } = await req.json();

  const query = `
    query ($search: String) {
      Media(search: $search, type: ANIME) {
        coverImage {
          large
        }
      }
    }
  `;
  const variables = { search: title };

  try {
    const response = await axios.post(
      "https://graphql.anilist.co",
      { query, variables },
      { headers: { "Content-Type": "application/json" } }
    );
    const image = response.data.data.Media.coverImage.large;
    return NextResponse.json({ image });
  } catch (error) {
    console.error("Server error for:", title, error);
    return NextResponse.json({ image: null });
  }
}
