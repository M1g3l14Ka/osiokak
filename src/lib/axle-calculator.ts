import { TractorConfig, TrailerConfig, CargoItem, AxleLoadResult } from '@/types';

export function calculateAxleLoads(
  tractor: TractorConfig,
  trailer: TrailerConfig,
  isTelescoped: boolean,
  cargoItems: CargoItem[]
): AxleLoadResult {
  const trailerLength =
    isTelescoped && trailer.lengthExtended
      ? trailer.lengthExtended
      : trailer.length;

  let totalCargoWeight = 0;
  let totalKingpinFromCargo = 0;
  let totalTrailerAxlesFromCargo = 0;

  for (const item of cargoItems) {
    totalCargoWeight += item.weight;

    // Lever: how much weight goes to kingpin vs trailer axles
    // position=0 (at kingpin) -> all weight on kingpin
    // position=kingpinToAxleDistance -> weight split evenly
    // position=trailerLength (at tail) -> more on trailer axles
    const distToAxles = trailer.kingpinToAxleDistance - item.position;
    const leverRatio = distToAxles / trailer.kingpinToAxleDistance;

    const cargoOnKingpin = item.weight * leverRatio;
    const cargoOnTrailerAxles = item.weight - cargoOnKingpin;

    totalKingpinFromCargo += cargoOnKingpin;
    totalTrailerAxlesFromCargo += cargoOnTrailerAxles;
  }

  // Trailer tare distribution
  const trailerOnKingpin =
    trailer.tare * (1 - trailer.kingpinToAxleDistance / trailerLength);
  const trailerOnAxles = trailer.tare * trailer.kingpinToAxleDistance / trailerLength;

  // Total loads
  const totalKingpinLoad = totalKingpinFromCargo + trailerOnKingpin;
  const totalTrailerAxleLoad = totalTrailerAxlesFromCargo + trailerOnAxles;

  // Distribute trailer axle load
  const perAxleLoad = totalTrailerAxleLoad / trailer.trailerAxleCount;
  const trailerAxles = Array(trailer.trailerAxleCount).fill(
    Math.round(perAxleLoad * 10) / 10
  );

  // Tractor axle loads
  // Kingpin is behind rear axle (kingpinOffset < 0)
  const kingpinDistFromRear = Math.abs(tractor.kingpinOffset);

  // Force from kingpin unloads front axle, loads rear axle
  const frontFromKingpin =
    (totalKingpinLoad * kingpinDistFromRear) / tractor.wheelbase;
  const rearFromKingpin =
    totalKingpinLoad * (tractor.wheelbase + kingpinDistFromRear) / tractor.wheelbase;

  const frontAxle = tractor.frontTare - frontFromKingpin;
  const rearAxle = tractor.rearTare + rearFromKingpin;

  const totalWeight = frontAxle + rearAxle + totalTrailerAxleLoad;
  const maxTotalWeight = 40000;

  return {
    frontAxle: Math.round(Math.max(0, frontAxle) * 10) / 10,
    rearAxle: Math.round(rearAxle * 10) / 10,
    trailerAxles,
    totalWeight: Math.round(totalWeight * 10) / 10,
    totalCargoWeight: Math.round(totalCargoWeight * 10) / 10,
    kingpinLoad: Math.round(totalKingpinLoad * 10) / 10,
    overloads: {
      frontAxle: frontAxle > tractor.maxFrontAxle,
      rearAxle: rearAxle > tractor.maxRearAxle,
      trailerAxleGroup: totalTrailerAxleLoad > trailer.maxTrailerAxleGroup,
      totalWeight: totalWeight > maxTotalWeight,
    },
  };
}

export function getLoadPercentage(load: number, maxAllowed: number): number {
  return Math.round((load / maxAllowed) * 1000) / 10;
}
