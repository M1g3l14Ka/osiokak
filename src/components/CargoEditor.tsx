"use client";

import { CargoItem } from "@/types";

interface CargoEditorProps {
  cargo: CargoItem;
  trailerLength: number;
  onChange: (updates: Partial<CargoItem>) => void;
  onMove: (id: string, direction: "left" | "right") => void;
}

export function CargoEditor({
  cargo,
  trailerLength,
  onChange,
  onMove,
}: CargoEditorProps) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 space-y-4">
      {/* Name */}
      <input
        type="text"
        value={cargo.name}
        onChange={(e) => onChange({ name: e.target.value })}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
        placeholder="Название груза"
      />

      {/* Properties */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-zinc-500 block mb-1.5 font-medium">
            Масса (кг)
          </label>
          <input
            type="number"
            value={cargo.weight}
            onChange={(e) => onChange({ weight: Number(e.target.value) })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-500 block mb-1.5 font-medium">
            Длина груза (м)
          </label>
          <input
            type="number"
            step="0.1"
            value={cargo.length}
            onChange={(e) => onChange({ length: Number(e.target.value) })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-500 block mb-1.5 font-medium">
            Позиция от седла (м)
          </label>
          <input
            type="number"
            step="0.1"
            value={cargo.position}
            onChange={(e) => onChange({ position: Number(e.target.value) })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-500 block mb-1.5 font-medium">
            Высота (м)
          </label>
          <input
            type="number"
            step="0.1"
            value={cargo.height || 1.5}
            onChange={(e) => onChange({ height: Number(e.target.value) })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-base text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20"
          />
        </div>
      </div>

      {/* Position arrows */}
      <div className="flex justify-center gap-4 pt-2">
        <button
          onClick={() => onMove(cargo.id, "left")}
          className="w-14 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition-colors"
        >
          ←
        </button>
        <div className="flex items-center text-sm text-zinc-500 font-medium">
          к седлу
        </div>
        <button
          onClick={() => onMove(cargo.id, "right")}
          className="w-14 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition-colors"
        >
          →
        </button>
        <div className="flex items-center text-sm text-zinc-500 font-medium">
          к хвосту
        </div>
      </div>
    </div>
  );
}
