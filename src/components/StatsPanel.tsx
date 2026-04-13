"use client";

import { TruckConfig, AxleLoadResult } from "@/types";
import { formatKg } from "@/data/boxes";

interface StatsPanelProps {
  config: TruckConfig;
  result: AxleLoadResult;
  getLoadPercentage: (load: number, max: number) => number;
}

export function StatsPanel({ config, result, getLoadPercentage }: StatsPanelProps) {
  const totalMaxWeight = config.maxTotalWeight;
  const weightPercent = ((result.totalWeight / totalMaxWeight) * 100).toFixed(1);

  const stats = [
    {
      label: "Передняя ось",
      value: result.frontAxle,
      max: config.tractor.maxFrontAxle,
      overload: result.overloads.frontAxle,
    },
    {
      label: "Задняя ось тягача",
      value: result.rearAxle,
      max: config.tractor.maxRearAxle,
      overload: result.overloads.rearAxle,
    },
    {
      label: "Оси полуприцепа (группа)",
      value: result.trailerAxles.reduce((a, b) => a + b, 0),
      max: config.trailer.maxTrailerAxleGroup,
      overload: result.overloads.trailerAxleGroup,
    },
    {
      label: "Общий вес",
      value: result.totalWeight,
      max: totalMaxWeight,
      overload: result.totalWeight > totalMaxWeight,
    },
  ];

  return (
    <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 space-y-4">
      <h2 className="text-lg font-semibold text-white">Статистика нагрузок</h2>

      <div className="space-y-3">
        {stats.map((stat) => {
          const percent = getLoadPercentage(stat.value, stat.max);
          return (
            <div
              key={stat.label}
              className={`p-3 rounded-lg border ${
                stat.overload
                  ? "border-red-500/50 bg-red-500/10"
                  : "border-zinc-700 bg-zinc-800"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">{stat.label}</span>
                <span
                  className={`text-sm font-mono font-semibold ${
                    stat.overload ? "text-red-400" : "text-white"
                  }`}
                >
                  {formatKg(stat.value)} кг
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-zinc-600">
                  Макс: {formatKg(stat.max)} кг
                </span>
                <span
                  className={`text-xs font-semibold ${
                    percent > 100
                      ? "text-red-400"
                      : percent > 85
                        ? "text-amber-400"
                        : "text-emerald-400"
                  }`}
                >
                  {percent}%
                </span>
              </div>
              <div className="mt-2 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    stat.overload
                      ? "bg-red-500"
                      : percent > 85
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-zinc-700">
        <div className="text-sm text-zinc-400">Нагрузка на седло</div>
        <div className="text-lg font-mono text-orange-400 font-semibold">
          {formatKg(result.kingpinLoad)} кг
        </div>
      </div>

      {result.totalWeight > totalMaxWeight && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
          <span className="text-red-400 font-bold text-sm">
            ПРЕВЫШЕН МАКСИМАЛЬНЫЙ ВЕС!
          </span>
          <div className="text-xs text-red-300 mt-1">
            {formatKg(result.totalWeight - totalMaxWeight)} кг сверх нормы
          </div>
        </div>
      )}
    </div>
  );
}
