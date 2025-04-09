"use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";


export default function Home() {
  // State to manage visibility of each dropdown
  const [animeOpen, setAnimeOpen] = useState(false);
  const [mangaOpen, setMangaOpen] = useState(false);
  const [manwhaOpen, setManwhaOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleAnime = () => setAnimeOpen(!animeOpen);
  const toggleManga = () => setMangaOpen(!mangaOpen);
  const toggleManwha = () => setManwhaOpen(!manwhaOpen);

  return (
    
    <div className="space-y-4 px-4 py-8">
      <Image src = "/animeverse.png" alt = "Animeverse" width = {250} height = {300} className = "mx-auto"/>

      
      <h1 className="font-bold flex justify-center text-5xl text-gray-900 dark:text-gray-100">
        MyAnimeVerse
      </h1>
      <div className="flex justify-center gap-8 max-w-full mx-auto">
        {/* Anime Section */}
        <div className="relative">
          <h1
            className="text-2xl font-bold text-black dark:text-white hover:text-blue-500 cursor-pointer"
            onClick={toggleAnime} // Toggle visibility on click
          >
            Anime
          </h1>
          {animeOpen && (
            <div className="absolute left-0 text-black dark:text-white border p-4 mt-2 w-48 rounded-lg shadow-lg">
              <ul className="space-y-2">
                <li>
                  <Link href="/anime/seasonal-anime">Seasonal Anime</Link>
                </li>
                <li>
                  <Link href="/anime/top-anime">Top Anime</Link>
                </li>
                <li>
                  <Link href="/anime/movies">Movies</Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Manga Section */}
        <div className="relative">
          <h1
            className="text-2xl font-bold text-black dark:text-white hover:text-blue-500 cursor-pointer"
            onClick={toggleManga} // Toggle visibility on click
          >
            Manga
          </h1>
          {mangaOpen && (
            <div className="absolute left-0 text-black dark:text-white border p-4 mt-2 w-48 rounded-lg shadow-lg">
              <ul className="space-y-2">
                <li>
                  <Link href="/manga/top-manga">Top Manga</Link>
                </li>
                
              </ul>
            </div>
          )}
        </div>

        {/* Manwha Section */}
        <div className="relative">
          <h1
            className="text-2xl font-bold text-black dark:text-white hover:text-blue-500 cursor-pointer"
            onClick={toggleManwha} // Toggle visibility on click
          >
            Manwha 
          </h1>
          {manwhaOpen && (
            <div className="absolute left-0  text-black dark:text-white border p-4 mt-2 w-48 rounded-lg shadow-lg">
              <ul className="space-y-2">
                <li>
                  <Link href="/manwha">Manwha</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      
    </div>
  );
}

