"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type TopAnime = {
  id: number;
  title: string;
  image: string;
  score: number;
};

export default function TopAnimePage() {
  const [topAnime, setTopAnime] = useState<TopAnime[]>([]);

  useEffect(() => {
    const fetchTopAnime = async () => {
      const query = `
        query {
          Page(perPage: 30) {
            media(type: ANIME, sort: SCORE_DESC) {
              id
              title {
                romaji
              }
              averageScore
              coverImage {
                large
              }
            }
          }
        }
      `;

      try {
        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        const data = await res.json();

        type AnimeAPIResponse = {
          id: number;
          title: { romaji: string };
          averageScore: number;
          coverImage: { large: string };
        };

        const parsed = data.data.Page.media.map((anime: AnimeAPIResponse) => ({
          id: anime.id,
          title: anime.title.romaji,
          score: anime.averageScore,
          image: anime.coverImage.large,
        }));

        setTopAnime(parsed);
      } catch (err) {
        console.error("Failed to fetch top anime:", err);
      }
    };

    fetchTopAnime();
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">🔥 Top Anime</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {topAnime.map(({ id, title, image, score }, index) => (
          <motion.div
            key={id}
            className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Image
              src={image}
              alt={title}
              width={300}
              height={450}
              className="rounded-md object-cover mb-2"
            />
            <h2 className="text-sm font-medium">{title}</h2>
            <p className="text-sm text-yellow-400">⭐ {score}/100</p>
            <a
              href={`https://animepahe.ru/?search=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-xs mt-1 block"
            >
              Watch on AnimePahe
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
