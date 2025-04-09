"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type Manhwa = {
  id: string;
  title: string;
  image: string;
};

export default function TopManhwaPage() {
  const [manhwaList, setManhwaList] = useState<Manhwa[]>([]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchManhwa = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.mangadex.org/manga?limit=20&offset=${currentOffset}&originalLanguage[]=ko&order[followedCount]=desc&includes[]=cover_art`
        );
        const data = await res.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newManhwa: Manhwa[] = data.data.map((manga: any) => {
          const title = manga.attributes.title.en || Object.values(manga.attributes.title)[0];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const coverFile = manga.relationships.find((rel: any) => rel.type === "cover_art")?.attributes?.fileName;
          const image = `https://uploads.mangadex.org/covers/${manga.id}/${coverFile}.256.jpg`;

          return {
            id: manga.id,
            title,
            image,
          };
        });

        setManhwaList((prev) => [...prev, ...newManhwa]);
        setHasMore(data.total > currentOffset + 20);
      } catch (err) {
        console.error("Failed to fetch manhwa:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchManhwa();
  }, [currentOffset]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setCurrentOffset((prev) => prev + 20);
        }
      },
      { rootMargin: "100px" }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, loading]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">🔥 Top Manhwa (Korean)</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {manhwaList.map(({ id, title, image }, index) => (
          <motion.div
            key={`${id}-${index}`}
            className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.03 }}
          >
            <Image
              src={image}
              alt={title}
              width={300}
              height={450}
              className="rounded-md object-cover mb-2"
            />
            <h2 className="text-sm font-medium">{title}</h2>
          </motion.div>
        ))}
      </div>

      <div ref={observerRef} className="h-10 mt-10" />

      {loading && (
        <div className="text-center text-gray-400 mt-4">Loading more manhwa...</div>
      )}
    </div>
  );
}
