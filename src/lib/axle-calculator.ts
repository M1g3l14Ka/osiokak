import { TruckConfig, CargoBox, AxleLoadResult } from '@/types';

export function calculateAxleLoadsFromSliders(
  config: TruckConfig,
  cargoWeight: number,
  cargoPosition: number
): AxleLoadResult {
  const { tractor, trailer } = config;
  const trailerLength = trailer.length;

  const cargoRatioOnAxles = cargoPosition / trailerLength;
  const cargoRatioOnKingpin = 1 - cargoRatioOnAxles;

  const cargoOnKingpin = cargoWeight * cargoRatioOnKingpin;
  const cargoOnTrailer = cargoWeight * cargoRatioOnAxles;

  const trailerWeightOnAxles = (trailer.tare * trailer.kingpinToAxleDistance) / trailerLength;
  const trailerWeightOnKingpin = trailer.tare - trailerWeightOnAxles;

  const totalKingpinLoad = cargoOnKingpin + trailerWeightOnKingpin;
  const totalTrailerAxleLoad = cargoOnTrailer + trailerWeightOnAxles;

  const wheelbase = tractor.wheelbase;
  const kingpinDistanceFromRearAxle = Math.abs(tractor.kingpinOffset);

  const frontAxleFromKingpin = (totalKingpinLoad * kingpinDistanceFromRearAxle) / wheelbase;
  const rearAxleFromKingpin = totalKingpinLoad + frontAxleFromKingpin;

  const frontAxle = tractor.frontTare - frontAxleFromKingpin;
  const rearAxle = tractor.rearTare + rearAxleFromKingpin;

  const perAxleLoad = totalTrailerAxleLoad / trailer.trailerAxleCount;
  const trailerAxles = Array(trailer.trailerAxleCount).fill(
    Math.round(perAxleLoad * 10) / 10
  );

  const totalWeight = frontAxle + rearAxle + totalTrailerAxleLoad;

  return {
    frontAxle: Math.round(Math.max(0, frontAxle) * 10) / 10,
    rearAxle: Math.round(rearAxle * 10) / 10,
    trailerAxles,
    totalWeight: Math.round(totalWeight * 10) / 10,
    kingpinLoad: Math.round(totalKingpinLoad * 10) / 10,
    cargoOnTrailer: Math.round(cargoOnTrailer * 10) / 10,
    cargoOnKingpin: Math.round(cargoOnKingpin * 10) / 10,
    overloads: {
      frontAxle: frontAxle > tractor.maxFrontAxle,
      rearAxle: rearAxle > tractor.maxRearAxle,
      trailerAxleGroup: totalTrailerAxleLoad > trailer.maxTrailerAxleGroup,
    },
  };
}

export function calculateAxleLoadsFromBoxes(
  config: TruckConfig,
  boxes: CargoBox[]
): AxleLoadResult {
  const { tractor, trailer } = config;
  const trailerLength = trailer.length;

  let totalWeight = 0;
  let totalMoment = 0;

  for (const box of boxes) {
    const posFromFront = box.x;
    const ratioOnAxles = posFromFront / trailerLength;
    const ratioOnKingpin = 1 - ratioOnAxles;

    totalWeight += box.weight;
    totalMoment += box.weight * ratioOnKingpin;
  }

  const cargoOnKingpin = totalMoment;
  const cargoOnTrailer = totalWeight - cargoOnKingpin;

  const trailerWeightOnAxles = (trailer.tare * trailer.kingpinToAxleDistance) / trailerLength;
  const trailerWeightOnKingpin = trailer.tare - trailerWeightOnAxles;

  const totalKingpinLoad = cargoOnKingpin + trailerWeightOnKingpin;
  const totalTrailerAxleLoad = cargoOnTrailer + trailerWeightOnAxles;

  const wheelbase = tractor.wheelbase;
  const kingpinDistanceFromRearAxle = Math.abs(tractor.kingpinOffset);

  const frontAxleFromKingpin = (totalKingpinLoad * kingpinDistanceFromRearAxle) / wheelbase;
  const rearAxleFromKingpin = totalKingpinLoad + frontAxleFromKingpin;

  const frontAxle = tractor.frontTare - frontAxleFromKingpin;
  const rearAxle = tractor.rearTare + rearAxleFromKingpin;

  const perAxleLoad = totalTrailerAxleLoad / trailer.trailerAxleCount;
  const trailerAxles = Array(trailer.trailerAxleCount).fill(
    Math.round(perAxleLoad * 10) / 10
  );

  const total = frontAxle + rearAxle + totalTrailerAxleLoad;

  return {
    frontAxle: Math.round(Math.max(0, frontAxle) * 10) / 10,
    rearAxle: Math.round(rearAxle * 10) / 10,
    trailerAxles,
    totalWeight: Math.round(total * 10) / 10,
    kingpinLoad: Math.round(totalKingpinLoad * 10) / 10,
    cargoOnTrailer: Math.round(cargoOnTrailer * 10) / 10,
    cargoOnKingpin: Math.round(cargoOnKingpin * 10) / 10,
    overloads: {
      frontAxle: frontAxle > tractor.maxFrontAxle,
      rearAxle: rearAxle > tractor.maxRearAxle,
      trailerAxleGroup: totalTrailerAxleLoad > trailer.maxTrailerAxleGroup,
    },
  };
}

export function getLoadPercentage(load: number, maxAllowed: number): number {
  return Math.round((load / maxAllowed) * 1000) / 10;
}
