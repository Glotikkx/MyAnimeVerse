"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type AnimeItem = {
  id: number;
  title: string;
  image: string;
  day: string;
};

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Irregular"
];

// Utility to map AniList weekday int to name
const weekdayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const fetchSeasonalAnime = async (): Promise<Record<string, AnimeItem[]>> => {
  const query = `
    query {
      Page(perPage: 50) {
        media(season: SPRING, seasonYear: 2025, type: ANIME, sort: POPULARITY_DESC) {
          id
          title {
            romaji
          }
          coverImage {
            large
          }
          airingSchedule(notYetAired: true, perPage: 1) {
            nodes {
              airingAt
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const json = await response.json();

    const grouped: Record<string, AnimeItem[]> = {};
    for (const day of daysOfWeek) grouped[day] = [];

    for (const media of json.data.Page.media) {
      const airingTimestamp = media.airingSchedule.nodes[0]?.airingAt;
      const airingDate = airingTimestamp ? new Date(airingTimestamp * 1000) : null;
      const day = airingDate ? weekdayMap[airingDate.getUTCDay()] : "Irregular";

      grouped[day].push({
        id: media.id,
        title: media.title.romaji,
        image: media.coverImage.large,
        day,
      });
    }

    return grouped;
  } catch (err) {
    console.error("Error fetching seasonal anime:", err);
    return {};
  }
};

export default function SeasonalAnimePage() {
  const [groupedAnime, setGroupedAnime] = useState<Record<string, AnimeItem[]>>({});

  useEffect(() => {
    const loadAnime = async () => {
      const grouped = await fetchSeasonalAnime();
      setGroupedAnime(grouped);
    };
    loadAnime();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center">Spring 2025 Anime Broadcast Schedule</h1>
      <div className="h-[80vh] overflow-y-scroll border border-gray-700 rounded-xl p-4">
        {daysOfWeek.map(day => (
          <div key={day} className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">{day}</h2>
            <hr className="mb-4 border-gray-600" />
            <div className="space-y-2">
              {groupedAnime[day]?.length ? (
                groupedAnime[day].map(({ id, title, image }) => (
                  <div
                    key={id}
                    className="flex items-center space-x-4 border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-sm"
                  >
                    <Image
                      src={image}
                      alt={title}
                      width={64}
                      height={96}
                      className="object-cover rounded"
                    />
                    <span className="flex flex-col">
                      <span>{title}</span>
                      <a
                        href={`https://animepahe.ru/?search=${encodeURIComponent(title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:underline"
                      >
                        Watch on AnimePahe
                      </a>
                    </span>

                  </div>
                ))
              ) : (
                <p className="text-gray-400">No anime airing on this day.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
