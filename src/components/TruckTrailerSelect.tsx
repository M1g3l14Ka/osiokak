"use client";

import { TractorConfig, TrailerConfig } from "@/types";

interface TruckTrailerSelectProps {
  tractors: TractorConfig[];
  trailers: TrailerConfig[];
  tractorId: string;
  trailerId: string;
  isTelescoped: boolean;
  onTractorChange: (id: string) => void;
  onTrailerChange: (id: string) => void;
  onTelescopeToggle: (v: boolean) => void;
}

export function TruckTrailerSelect({
  tractors,
  trailers,
  tractorId,
  trailerId,
  isTelescoped,
  onTractorChange,
  onTrailerChange,
  onTelescopeToggle,
}: TruckTrailerSelectProps) {
  const currentTrailer = trailers.find((t) => t.id === trailerId);

  return (
    <div className="space-y-3">
      <select
        value={tractorId}
        onChange={(e) => onTractorChange(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.75rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
        }}
      >
        {tractors.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        value={trailerId}
        onChange={(e) => onTrailerChange(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3.5 text-base text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 0.75rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
        }}
      >
        {trailers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {currentTrailer?.hasTelescope && (
        <button
          onClick={() => onTelescopeToggle(!isTelescoped)}
          className={`w-full py-3.5 rounded-xl text-base font-semibold transition-all flex items-center justify-center gap-2 ${
            isTelescoped
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-zinc-500"
          }`}
        >
          <span className="text-lg">{isTelescoped ? "▶" : "▶"}</span>
          Телескоп {isTelescoped ? `(${currentTrailer.lengthExtended} м)` : `(${currentTrailer.length} м)`}
        </button>
      )}
    </div>
  );
}
