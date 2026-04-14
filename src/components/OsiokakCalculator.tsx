"use client";

import { useCalculatorStore } from "@/lib/calculator-store";
import { tractors } from "@/data/tractors";
import { trailers } from "@/data/trailers";
import { calculateAxleLoads } from "@/lib/axle-calculator";
import { TruckTrailerSelect } from "./TruckTrailerSelect";
import { TruckDiagram } from "./TruckDiagram";
import { CargoList } from "./CargoList";
import { CargoEditor } from "./CargoEditor";
import { RoadTrainSummary } from "./RoadTrainSummary";
import { FAQModal } from "./FAQModal";
import { useState } from "react";

export default function OsiokakCalculator() {
  const store = useCalculatorStore();
  const [faqOpen, setFaqOpen] = useState(false);

  const tractor = tractors.find((t) => t.id === store.tractorId)!;
  const trailer = trailers.find((t) => t.id === store.trailerId)!;
  const trailerLength =
    store.isTelescoped && trailer.lengthExtended
      ? trailer.lengthExtended
      : trailer.length;

  const result = calculateAxleLoads(
    tractor,
    trailer,
    store.isTelescoped,
    store.cargoItems
  );

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
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

      <div className="flex-1 overflow-auto pb-6 px-4 max-w-6xl mx-auto w-full space-y-4">
        <TruckTrailerSelect
          tractors={tractors}
          trailers={trailers}
          tractorId={store.tractorId}
          trailerId={store.trailerId}
          isTelescoped={store.isTelescoped}
          onTractorChange={store.setTractorId}
          onTrailerChange={store.setTrailerId}
          onTelescopeToggle={store.toggleTelescope}
        />

        <RoadTrainSummary
          tractor={tractor}
          trailer={trailer}
          isTelescoped={store.isTelescoped}
          result={result}
        />

        <TruckDiagram
          tractor={tractor}
          trailer={trailer}
          isTelescoped={store.isTelescoped}
          cargoItems={store.cargoItems}
          selectedId={store.selectedId}
          result={result}
          onSelect={store.selectCargo}
          onDrop={store.updateCargo}
        />

        <CargoList
          items={store.cargoItems}
          selectedId={store.selectedId}
          onAdd={store.addCargo}
          onDuplicate={store.duplicateCargo}
          onRemove={store.removeCargo}
          onClearAll={store.clearAll}
          onSelect={store.selectCargo}
        />

        {store.selectedId && (
          <CargoEditor
            cargo={
              store.cargoItems.find((c) => c.id === store.selectedId)!
            }
            onChange={(updates) =>
              store.updateCargo(store.selectedId!, updates)
            }
            onMove={(id, dir) => store.moveCargo(id, dir, trailerLength)}
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
