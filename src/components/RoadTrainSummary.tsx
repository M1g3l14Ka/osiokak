"use client";

import { TractorConfig, TrailerConfig, AxleLoadResult } from "@/types";

function t(kg: number): string {
  return (kg / 1000).toFixed(1);
}

interface RoadTrainSummaryProps {
  tractor: TractorConfig;
  trailer: TrailerConfig;
  isTelescoped: boolean;
  result: AxleLoadResult;
}

export function RoadTrainSummary({
  tractor,
  trailer,
  isTelescoped,
  result,
}: RoadTrainSummaryProps) {
  const trailerLength =
    isTelescoped && trailer.lengthExtended
      ? trailer.lengthExtended
      : trailer.length;

  const hasOverload =
    result.overloads.frontAxle ||
    result.overloads.rearAxle ||
    result.overloads.trailerAxleGroup ||
    result.overloads.totalWeight;

  return (
    <div
      className={`rounded-xl p-4 text-base space-y-2 ${
        hasOverload
          ? "bg-red-950/40 border border-red-800/50"
          : "bg-zinc-900 border border-zinc-800"
      }`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-zinc-500 font-medium">Автопоезд:</span>
        <span className="text-zinc-300">
          Вес: <b>{t(tractor.tare + trailer.tare)} т</b>
        </span>
        <span className="text-zinc-300">
          Длина: <b>{trailerLength.toFixed(1)} м</b>
        </span>
        <span className="text-zinc-300">
          Высота: <b>{trailer.height} м</b>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-zinc-500 font-medium">Груз:</span>
        <span className="text-zinc-300">
          Вес: <b>{t(result.totalCargoWeight)} т</b>
        </span>
        <span className="text-zinc-300">
          Общий: <b>{t(result.totalWeight)} т</b>
        </span>
      </div>
      {hasOverload && (
        <div className="text-red-400 font-bold text-center text-lg pt-2 animate-pulse">
          ⚠️ ПЕРЕГРУЗ!
        </div>
      )}
    </div>
  );
}
