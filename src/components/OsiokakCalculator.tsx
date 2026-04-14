"use client";

import { useState, useCallback } from "react";
import { tractors } from "@/data/tractors";
import { trailers } from "@/data/trailers";
import { calculateAxleLoads } from "@/lib/axle-calculator";
import { CargoItem } from "@/types";
import { AXLE_COLORS } from "@/data/colors";
import { TruckTrailerSelect } from "./TruckTrailerSelect";
import { TruckDiagram } from "./TruckDiagram";
import { CargoList } from "./CargoList";
import { CargoEditor } from "./CargoEditor";
import { RoadTrainSummary } from "./RoadTrainSummary";
import { FAQModal } from "./FAQModal";

let nextId = 0;

export default function OsiokakCalculator() {
  const [tractorId, setTractorId] = useState(tractors[0].id);
  const [trailerId, setTrailerId] = useState(trailers[0].id);
  const [isTelescoped, setIsTelescoped] = useState(false);
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [faqOpen, setFaqOpen] = useState(false);

  const tractor = tractors.find((t) => t.id === tractorId)!;
  const trailer = trailers.find((t) => t.id === trailerId)!;
  const trailerLength =
    isTelescoped && trailer.lengthExtended
      ? trailer.lengthExtended
      : trailer.length;

  const result = calculateAxleLoads(tractor, trailer, isTelescoped, cargoItems);

  const addCargo = useCallback(() => {
    const newCargo: CargoItem = {
      id: `cargo-${++nextId}`,
      name: `Груз ${cargoItems.length + 1}`,
      weight: 2000,
      position: 0.5,
      length: 2.0,
      height: 1.5,
      color: AXLE_COLORS[cargoItems.length % AXLE_COLORS.length],
    };
    setCargoItems((prev) => [...prev, newCargo]);
    setSelectedId(newCargo.id);
  }, [cargoItems.length]);

  const duplicateCargo = useCallback((id: string) => {
    setCargoItems((prev) => {
      const item = prev.find((c) => c.id === id);
      if (!item) return prev;
      const dup: CargoItem = {
        ...item,
        id: `cargo-${++nextId}`,
        name: `${item.name} (копия)`,
        color: AXLE_COLORS[prev.length % AXLE_COLORS.length],
      };
      return [...prev, dup];
    });
  }, []);

  const removeCargo = useCallback((id: string) => {
    setCargoItems((prev) => prev.filter((c) => c.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const clearAll = useCallback(() => {
    setCargoItems([]);
    setSelectedId(null);
  }, []);

  const updateCargo = useCallback(
    (id: string, updates: Partial<CargoItem>) => {
      setCargoItems((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
    },
    []
  );

  const moveCargo = useCallback(
    (id: string, direction: "left" | "right") => {
      setCargoItems((prev) => {
        const idx = prev.findIndex((c) => c.id === id);
        if (idx === -1) return prev;
        const item = prev[idx];
        const step = 0.5;
        let newPos =
          direction === "left"
            ? item.position - step
            : item.position + step;
        newPos = Math.max(0, Math.min(trailerLength - item.length, newPos));
        return prev.map((c, i) =>
          i === idx ? { ...c, position: Math.round(newPos * 10) / 10 } : c
        );
      });
    },
    [trailerLength]
  );

  const selectedCargo = cargoItems.find((c) => c.id === selectedId) || null;

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 flex-shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="text-orange-500">Osi</span>
          <span className="text-zinc-300">Okak</span>
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setFaqOpen(true)}
            className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-orange-500 transition-colors text-base font-bold"
            title="Помощь"
          >
            ?
          </button>
          <span className="text-sm text-zinc-500">v0.1</span>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-auto pb-6 px-4 max-w-6xl mx-auto w-full space-y-4">
        <TruckTrailerSelect
          tractors={tractors}
          trailers={trailers}
          tractorId={tractorId}
          trailerId={trailerId}
          isTelescoped={isTelescoped}
          onTractorChange={setTractorId}
          onTrailerChange={setTrailerId}
          onTelescopeToggle={setIsTelescoped}
        />

        <RoadTrainSummary
          tractor={tractor}
          trailer={trailer}
          isTelescoped={isTelescoped}
          result={result}
        />

        <TruckDiagram
          tractor={tractor}
          trailer={trailer}
          isTelescoped={isTelescoped}
          cargoItems={cargoItems}
          selectedId={selectedId}
          result={result}
          onSelect={setSelectedId}
          onDrop={updateCargo}
        />

        <CargoList
          items={cargoItems}
          selectedId={selectedId}
          onAdd={addCargo}
          onDuplicate={duplicateCargo}
          onRemove={removeCargo}
          onClearAll={clearAll}
          onSelect={setSelectedId}
        />

        {selectedCargo && (
          <CargoEditor
            cargo={selectedCargo}
            onChange={(updates) => updateCargo(selectedCargo!.id, updates)}
            onMove={moveCargo}
          />
        )}
      </div>

      <footer className="px-6 py-3 text-center text-sm text-zinc-600 border-t border-zinc-800 flex-shrink-0">
        Расчёты носят информационный характер. Не является юридической консультацией.
      </footer>

      <FAQModal open={faqOpen} onClose={() => setFaqOpen(false)} />
    </div>
  );
}
