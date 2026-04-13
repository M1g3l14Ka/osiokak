"use client";

import { useState } from "react";
import { truckConfigs } from "@/data/trucks";
import { calculateAxleLoadsFromSliders, getLoadPercentage } from "@/lib/axle-calculator";
import { TruckSelector } from "./TruckSelector";
import { CargoSliders } from "./CargoSliders";
import { AxleDiagram } from "./AxleDiagram";
import { StatsPanel } from "./StatsPanel";

export default function OsiokakCalculator() {
  const [selectedTruckId, setSelectedTruckId] = useState(truckConfigs[0].id);
  const [cargoWeight, setCargoWeight] = useState(10000);
  const [cargoPosition, setCargoPosition] = useState(6.8);

  const config = truckConfigs.find((t) => t.id === selectedTruckId)!;
  const result = calculateAxleLoadsFromSliders(config, cargoWeight, cargoPosition);

  const maxCargo = config.maxTotalWeight - config.tractor.frontTare - config.tractor.rearTare - config.trailer.tare;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          <span className="text-orange-500">Osi</span>
          <span className="text-zinc-300">Okak</span>
        </h1>
        <p className="text-zinc-500 text-sm">Калькулятор осевых нагрузок грузовика</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <TruckSelector
            configs={truckConfigs}
            selectedId={selectedTruckId}
            onChange={setSelectedTruckId}
          />

          <CargoSliders
            config={config}
            cargoWeight={cargoWeight}
            cargoPosition={cargoPosition}
            maxCargo={maxCargo}
            onWeightChange={setCargoWeight}
            onPositionChange={setCargoPosition}
          />

          <AxleDiagram config={config} result={result} />
        </div>

        <div className="space-y-6">
          <StatsPanel
            config={config}
            result={result}
            getLoadPercentage={getLoadPercentage}
          />
        </div>
      </div>
    </div>
  );
}
