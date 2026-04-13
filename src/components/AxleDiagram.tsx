"use client";

import { TruckConfig, AxleLoadResult } from "@/types";
import { formatKg } from "@/data/boxes";

interface AxleDiagramProps {
  config: TruckConfig;
  result: AxleLoadResult;
}

export function AxleDiagram({ config, result }: AxleDiagramProps) {
  const maxAxleLoad = Math.max(
    config.tractor.maxFrontAxle,
    config.tractor.maxRearAxle,
    config.trailer.maxTrailerAxleGroup / config.trailer.trailerAxleCount
  );

  const getBarWidth = (load: number) => `${(load / maxAxleLoad) * 100}%`;
  const getBarColor = (load: number, max: number) => {
    const ratio = load / max;
    if (ratio > 1) return "bg-red-500";
    if (ratio > 0.85) return "bg-amber-500";
    return "bg-emerald-500";
  };

  return (
    <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 space-y-4">
      <h2 className="text-lg font-semibold text-white">Визуализация осей</h2>

      <div className="relative bg-zinc-800 rounded-lg p-4 space-y-3">
        {/* Truck body representation */}
        <div className="flex items-center gap-1">
          {/* Tractor */}
          <div className="flex flex-col items-center">
            <div className="text-xs text-zinc-500 mb-1">Тягач</div>
            <div className="w-24 h-12 bg-zinc-700 rounded flex items-center justify-center text-xs text-zinc-400">
              Кабина
            </div>
          </div>

          {/* Front axle */}
          <div className="flex flex-col items-center ml-2">
            <div
              className={`h-3 rounded-full ${getBarColor(result.frontAxle, config.tractor.maxFrontAxle)} transition-all`}
              style={{ width: getBarWidth(result.frontAxle) }}
            />
            <div className="text-xs text-zinc-400 mt-1">
              {formatKg(result.frontAxle)} / {formatKg(config.tractor.maxFrontAxle)}
            </div>
            {result.overloads.frontAxle && (
              <span className="text-xs text-red-400 font-bold">ПЕРЕГРУЗ!</span>
            )}
          </div>

          {/* Rear axle */}
          <div className="flex flex-col items-center ml-4">
            <div
              className={`h-3 rounded-full ${getBarColor(result.rearAxle, config.tractor.maxRearAxle)} transition-all`}
              style={{ width: getBarWidth(result.rearAxle) }}
            />
            <div className="text-xs text-zinc-400 mt-1">
              {formatKg(result.rearAxle)} / {formatKg(config.tractor.maxRearAxle)}
            </div>
            {result.overloads.rearAxle && (
              <span className="text-xs text-red-400 font-bold">ПЕРЕГРУЗ!</span>
            )}
          </div>

          {/* Trailer */}
          <div className="flex flex-col items-center ml-6">
            <div className="text-xs text-zinc-500 mb-1">Полуприцеп</div>
            <div className="w-32 h-10 bg-zinc-600 rounded flex items-center justify-center text-xs text-zinc-300">
              {config.trailer.length}м
            </div>
          </div>

          {/* Trailer axles */}
          <div className="flex flex-col items-center ml-2">
            <div
              className={`h-3 rounded-full ${getBarColor(
                result.trailerAxles[0] * config.trailer.trailerAxleCount,
                config.trailer.maxTrailerAxleGroup
              )} transition-all`}
              style={{
                width: getBarWidth(
                  result.trailerAxles[0] * config.trailer.trailerAxleCount
                ),
              }}
            />
            <div className="text-xs text-zinc-400 mt-1">
              {formatKg(result.trailerAxles.reduce((a, b) => a + b, 0))} /{" "}
              {formatKg(config.trailer.maxTrailerAxleGroup)}
            </div>
            {result.overloads.trailerAxleGroup && (
              <span className="text-xs text-red-400 font-bold">ПЕРЕГРУЗ!</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span>Норма</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span>&gt;85%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500" />
          <span>Перегруз</span>
        </div>
      </div>
    </div>
  );
}
