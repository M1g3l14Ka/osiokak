"use client";

import { CargoItem } from "@/types";

interface CargoListProps {
  items: CargoItem[];
  selectedId: string | null;
  onAdd: () => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onSelect: (id: string | null) => void;
}

export function CargoList({
  items,
  selectedId,
  onAdd,
  onDuplicate,
  onRemove,
  onClearAll,
  onSelect,
}: CargoListProps) {
  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <button
          onClick={onAdd}
          className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl text-zinc-300 hover:border-orange-500 hover:text-orange-400 transition-colors font-bold"
          title="Добавить груз"
        >
          +
        </button>
        {selectedId && (
          <button
            onClick={() => onDuplicate(selectedId)}
            className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg hover:border-zinc-500 transition-colors"
            title="Дублировать"
          >
            📋
          </button>
        )}
        {selectedId && (
          <button
            onClick={() => onRemove(selectedId)}
            className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg hover:border-red-500 hover:text-red-400 transition-colors"
            title="Удалить"
          >
            🗑
          </button>
        )}
        <button
          onClick={onClearAll}
          className="h-12 px-5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors font-medium"
        >
          Clean
        </button>
        <div className="flex-1" />
        <button className="h-12 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-400 font-medium">
          Length
        </button>
        <button className="h-12 px-4 rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-400 font-medium">
          Height
        </button>
      </div>

      {/* Items */}
      <div className="space-y-2 max-h-48 overflow-auto">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id === selectedId ? null : item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
              item.id === selectedId
                ? "border-orange-500/60 bg-orange-500/10 shadow-lg shadow-orange-500/5"
                : "border-zinc-700/50 bg-zinc-800/50 hover:border-zinc-600 hover:bg-zinc-800"
            }`}
          >
            <span
              className="w-3.5 h-3.5 rounded-md flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1 text-base text-zinc-300 truncate font-medium">
              {i + 1}. {item.name}
            </span>
            <span className="text-base text-zinc-500 tabular-nums font-mono">
              {(item.weight / 1000).toFixed(1)} т
            </span>
            <span className="text-base text-zinc-500 tabular-nums font-mono">
              {item.length.toFixed(1)} м
            </span>
          </button>
        ))}
        {items.length === 0 && (
          <div className="text-center py-12 text-zinc-600 text-lg">
            Нажмите <b className="text-zinc-500">+</b> чтобы добавить груз
          </div>
        )}
      </div>
    </div>
  );
}
