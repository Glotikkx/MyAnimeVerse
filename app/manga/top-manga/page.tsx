"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type TopManga = {
  id: number;
  title: string;
  image: string;
  score: number;
};

export default function TopAnimePage() {
  const [topAnime, setTopManga] = useState<TopManga[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  

  useEffect(() => {
    const fetchTopAnime = async (page: number) => {
      const query = `
        query ($page: Int) {
          Page(page: $page, perPage: 30) {
            pageInfo {
              currentPage
              hasNextPage
            }
            media(type: MANGA,  sort: SCORE_DESC) {
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
        setLoading(true);

        const res = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables: { page } }),
        });

        const data = await res.json();

        const newAnime = data.data.Page.media.map((anime: { id: number; title: { romaji: string }; averageScore: number; coverImage: { large: string } }) => ({
          id: anime.id,
          title: anime.title.romaji,
          score: anime.averageScore,
          image: anime.coverImage.large,
        }));

        setTopManga((prev) => [...prev, ...newAnime]);
        setHasNextPage(data.data.Page.pageInfo.hasNextPage);
      } catch (err) {
        console.error("Failed to fetch top manga:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopAnime(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loading) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { rootMargin: "100px" }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, loading]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">🔥 Top Manga</h1>
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
              href={`https://www.natomanga.com/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-xs mt-1 block"
            >
              Read on MangaNato
            </a>
          </motion.div>
        ))}
      </div>

      <div ref={observerRef} className="h-10 mt-10" />

      {loading && (
        <div className="text-center text-gray-400 mt-4">Loading more anime...</div>
      )}
    </div>
  );
}