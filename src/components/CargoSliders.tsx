"use client";

import { TruckConfig } from "@/types";
import { formatKg } from "@/data/boxes";

interface CargoSlidersProps {
  config: TruckConfig;
  cargoWeight: number;
  cargoPosition: number;
  maxCargo: number;
  onWeightChange: (weight: number) => void;
  onPositionChange: (position: number) => void;
}

export function CargoSliders({
  config,
  cargoWeight,
  cargoPosition,
  maxCargo,
  onWeightChange,
  onPositionChange,
}: CargoSlidersProps) {
  const trailerLength = config.trailer.length;

  return (
    <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 space-y-5">
      <h2 className="text-lg font-semibold text-white">Параметры груза</h2>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Вес груза</span>
          <span className="text-orange-400 font-mono">{formatKg(cargoWeight)} кг</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxCargo}
          step={100}
          value={cargoWeight}
          onChange={(e) => onWeightChange(Number(e.target.value))}
          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-xs text-zinc-600">
          <span>0 кг</span>
          <span>{formatKg(maxCargo)} кг (макс)</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-400">Позиция груза</span>
          <span className="text-orange-400 font-mono">{cargoPosition.toFixed(1)} м</span>
        </div>
        <input
          type="range"
          min={0.5}
          max={trailerLength - 0.5}
          step={0.1}
          value={cargoPosition}
          onChange={(e) => onPositionChange(Number(e.target.value))}
          className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-xs text-zinc-600">
          <span>0.5 м (седло)</span>
          <span>{(trailerLength - 0.5).toFixed(1)} м (хвост)</span>
        </div>
      </div>
    </div>
  );
}
