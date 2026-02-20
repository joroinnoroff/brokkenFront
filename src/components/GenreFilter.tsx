"use client";

import type { RecordType } from "@/lib/api";

interface GenreFilterProps {
  records: RecordType[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

export default function GenreFilter({
  records,
  selectedGenre,
  onGenreChange,
}: GenreFilterProps) {
  const genres = Array.from(
    new Set(records.flatMap((r) => r.genre ?? []))
  ).sort();

  if (genres.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-500">Filter by genre:</span>
      <button
        type="button"
        onClick={() => onGenreChange("")}
        className={`rounded-full px-3 py-1 text-sm ${
          selectedGenre === ""
            ? "bg-black text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre}
          type="button"
          onClick={() => onGenreChange(genre)}
          className={`rounded-full px-3 py-1 text-sm ${
            selectedGenre === genre
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
