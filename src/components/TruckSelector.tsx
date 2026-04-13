"use client";

import { TruckConfig } from "@/types";

interface TruckSelectorProps {
  configs: TruckConfig[];
  selectedId: string;
  onChange: (id: string) => void;
}

export function TruckSelector({ configs, selectedId, onChange }: TruckSelectorProps) {
  return (
    <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
      <label className="block text-sm font-medium text-zinc-400 mb-3">
        Конфигурация грузовика
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {configs.map((config) => (
          <button
            key={config.id}
            onClick={() => onChange(config.id)}
            className={`p-3 rounded-lg text-left transition-colors ${
              selectedId === config.id
                ? "bg-orange-500/20 border border-orange-500/50"
                : "bg-zinc-800 border border-zinc-700 hover:border-zinc-600"
            }`}
          >
            <div className="text-sm font-semibold text-white">{config.shortName}</div>
            <div className="text-xs text-zinc-500 mt-1">{config.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
