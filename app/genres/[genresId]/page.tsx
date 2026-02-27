import React from "react";
import Link from "next/link";
import { FaStar, FaClock, FaCalendarAlt, FaChevronLeft } from "react-icons/fa";
async function GenresId(id: string) {
  const res = await fetch(`https://movies-api-theta-gilt.vercel.app/api/movies/${id}`, {
    next: { revalidate: 3600 }
  });
  
  if (!res.ok) return null;
  return res.json();
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = await GenresId(params.id);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Kino topilmadi!</h1>
        <Link href="/" className="text-blue-500 underline">Asosiy sahifaga qaytish</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white selection:bg-blue-500/30">
      <div className="container mx-auto px-6 pt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" /> 
          Orqaga qaytish
        </Link>
      </div>

      <main className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
                    <div className="w-full md:w-[400px] shrink-0">
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 ring-1 ring-white/10">
              <img 
                src={movie.poster_url} 
                alt={movie.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-yellow-500 text-black font-black px-3 py-1 rounded-lg flex items-center gap-2 shadow-xl">
                <FaStar /> {movie.ratingValue}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none">
              {movie.name}
            </h1>
            
            <div className="flex flex-wrap gap-6 mb-8 text-lg font-medium text-gray-400">
              <span className="flex items-center gap-2"><FaCalendarAlt className="text-blue-500"/> {movie.year}</span>
              <span className="flex items-center gap-2"><FaClock className="text-blue-500"/> {movie.runtime}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-10">
              {movie.genre?.map((g: string) => (
                <span key={g} className="bg-blue-600/10 text-blue-400 border border-blue-600/20 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
                  {g}
                </span>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white/50 uppercase tracking-widest">Sujet</h3>
              <p className="text-gray-300 leading-relaxed text-xl font-light max-w-2xl">
                {movie.summary_text || "Ushbu film haqida hozircha ma'lumot kiritilmagan."}
              </p>
            </div>
            <div className="mt-12 flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black transition-all active:scale-95 shadow-xl shadow-blue-600/20 uppercase tracking-widest">
                Tomosha qilish
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white px-10 py-4 rounded-2xl font-black transition-all active:scale-95 border border-gray-700 uppercase tracking-widest">
                Treyler
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}