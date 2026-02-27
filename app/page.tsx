"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaStar,
  FaTimes,
} from "react-icons/fa";

interface Movie {
  _id: string;
  name: string;
  poster_url: string;
  year: string;
  ratingValue: string;
  runtime: string;
  genre: string[];
}

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchParam = searchParams.get("q") || "";

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const url = searchParam
        ? `https://movies-api-theta-gilt.vercel.app/api/movies/all?search=${searchParam}`
        : `https://movies-api-theta-gilt.vercel.app/api/movies/all?page=${currentPage}`;

      const res = await fetch(url);
      const data = await res.json();
      let result = Array.isArray(data) ? data : data.data || [];

      if (searchParam) {
        result = result.filter((m: Movie) =>
          m.name.toLowerCase().includes(searchParam.toLowerCase()),
        );
      }

      setMovies(result);
    } catch (error) {
      console.error("Xatolik:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchParam]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery !== (searchParams.get("q") || "")) {
        if (searchQuery.trim()) {
          router.push(`/?q=${encodeURIComponent(searchQuery)}&page=1`);
        } else {
          router.push("/");
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, router, searchParams]);

  const clearSearch = () => {
    setSearchQuery("");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white selection:bg-blue-500/30">
      <nav className="border-b border-gray-800 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-black text-blue-500 uppercase tracking-tighter"
          >
            Movie<span className="text-white">Catalog</span>
          </Link>

          <div className="relative w-1/3 hidden md:block">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Qidiruv..."
              className="w-full bg-gray-900 border border-gray-800 rounded-full py-2 pl-12 pr-10 outline-none focus:border-blue-500 transition-all text-sm text-white"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <FaTimes size={16} />
              </button>
            )}
          </div>

          <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-600/20">
            Kirish
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-10">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
              {searchParam
                ? `"${searchParam}" natijalari`
                : "Trenddagi Kinolar"}
            </h2>
            <p className="text-gray-400">
              {loading ? "Yuklanmoqda..." : `${movies.length} ta film topildi`}
            </p>
          </div>
          {!searchParam && (
            <div
              className=" text-blue-500 font-mono font-bold  bg-blue-500/5 border border-blue-500/10 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm md:text-lg flex items-center justify-center whitespace-nowrap"
            >
              <span className="opacity-70 mr-1">Sahifa:</span>
              {currentPage.toString().padStart(2, "0")}
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-gray-800/50 animate-pulse rounded-2xl border border-white/5"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <Link
                href={`/genres/${movie._id}`}
                key={movie._id}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[2/3] bg-gray-800 shadow-xl ring-1 ring-white/5">
                  <img
                    src={
                      movie.poster_url ||
                      "https://placehold.co/400x600?text=No+Poster"
                    }
                    alt={movie.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300">
                      <FaPlay className="text-white ml-1 text-sm" />
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-yellow-500">
                    <FaStar size={10} /> {movie.ratingValue || "0"}
                  </div>
                </div>
                <h3 className="mt-4 font-bold text-base line-clamp-1 group-hover:text-blue-500 transition-colors">
                  {movie.name}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300 uppercase font-bold">
                    {movie.genre?.[0] || "Kino"}
                  </span>
                  <span>{movie.year}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
        {!searchParam && !loading && (
          <div className="mt-20 flex justify-center items-center gap-3">
            <Link
              href={`/?page=${Math.max(1, currentPage - 1)}`}
              className={`w-10 h-10 rounded-lg border border-gray-800 flex items-center justify-center hover:bg-gray-800 ${currentPage === 1 ? "opacity-20 pointer-events-none" : ""}`}
            >
              <FaChevronLeft size={14} />
            </Link>
            {[1, 2, 3, 4, 5].map((num) => (
              <Link
                key={num}
                href={`/?page=${num}`}
                className={`w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all ${currentPage === num ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/30" : "border border-gray-800 hover:border-gray-600"}`}
              >
                {num}
              </Link>
            ))}
            <Link
              href={`/?page=${currentPage + 1}`}
              className="w-10 h-10 rounded-lg border border-gray-800 flex items-center justify-center hover:bg-gray-800"
            >
              <FaChevronRight size={14} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
