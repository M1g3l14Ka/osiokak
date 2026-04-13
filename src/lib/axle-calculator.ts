import { TruckConfig, WeightInput, AxleLoadResult } from '@/types';

/**
 * Расчёт нагрузки на оси автопоезда (тягач + полуприцеп)
 *
 * Физика: правило рычага (моменты сил)
 *
 * 1. Груз на полуприцепе распределяется между:
 *    - Седлом (kingpin) — точка крепления к тягачу
 *    - Тележкой прицепа (trailer axles)
 *
 * 2. Нагрузка от седла распределяется между осями тягача
 *    через моментные уравнения
 *
 * 3. Нагрузка на тележку прицепа делится поровну на все оси
 */
export function calculateAxleLoads(
  config: TruckConfig,
  input: WeightInput
): AxleLoadResult {
  const { cargoWeight, cargoPosition } = input;
  const { tractor, trailer } = config;

  // ---------- 1. Распределение груза между седлом и тележкой ----------
  // Правило рычага: F_kingpin = W × (L - x) / L
  const trailerLength = trailer.length;
  const cargoRatioOnAxles = cargoPosition / trailerLength;
  const cargoRatioOnKingpin = 1 - cargoRatioOnAxles;

  const cargoOnKingpin = cargoWeight * cargoRatioOnKingpin;
  const cargoOnTrailer = cargoWeight * cargoRatioOnAxles;

  // ---------- 2. Полная нагрузка на седло (груз + пустой прицеп) ----------
  // Пустой прицеп уже давит на седло определённую долю
  const trailerWeightOnAxles = (trailer.tare * trailer.kingpinToAxleDistance) / trailerLength;
  const trailerWeightOnKingpin = trailer.tare - trailerWeightOnAxles;

  const totalKingpinLoad = cargoOnKingpin + trailerWeightOnKingpin;
  const totalTrailerAxleLoad = cargoOnTrailer + trailerWeightOnAxles;

  // ---------- 3. Распределение нагрузки седла по осям тягача ----------
  // Момент вокруг задней оси тягача
  const wheelbase = tractor.wheelbase;
  const kingpinDistanceFromRearAxle = Math.abs(tractor.kingpinOffset);

  // Нагрузка на переднюю ось от седла
  const frontAxleFromKingpin = (totalKingpinLoad * kingpinDistanceFromRearAxle) / wheelbase;
  // Нагрузка на заднюю ось от седла
  const rearAxleFromKingpin = totalKingpinLoad + frontAxleFromKingpin;

  // Итоговые нагрузки
  const frontAxle = tractor.frontTare - frontAxleFromKingpin;
  const rearAxle = tractor.rearTare + rearAxleFromKingpin;

  // Распределяем нагрузку тележки по осям прицепа
  const perAxleLoad = totalTrailerAxleLoad / trailer.trailerAxleCount;
  const trailerAxles = Array(trailer.trailerAxleCount).fill(
    Math.round(perAxleLoad * 10) / 10
  );

  const totalWeight = frontAxle + rearAxle + totalTrailerAxleLoad;

  // Проверка перегруза
  const overloads = {
    frontAxle: frontAxle > tractor.maxFrontAxle,
    rearAxle: rearAxle > tractor.maxRearAxle,
    trailerAxleGroup: totalTrailerAxleLoad > trailer.maxTrailerAxleGroup,
  };

  return {
    frontAxle: Math.round(frontAxle * 10) / 10,
    rearAxle: Math.round(rearAxle * 10) / 10,
    trailerAxles,
    totalWeight: Math.round(totalWeight * 10) / 10,
    kingpinLoad: Math.round(totalKingpinLoad * 10) / 10,
    cargoOnTrailer: Math.round(cargoOnTrailer * 10) / 10,
    cargoOnKingpin: Math.round(cargoOnKingpin * 10) / 10,
    overloads,
  };
}

/**
 * Процент загрузки от допустимого
 */
export function getLoadPercentage(
  load: number,
  maxAllowed: number
): number {
  return Math.round((load / maxAllowed) * 1000) / 10;
}
