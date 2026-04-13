export interface TruckConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  axles: number;
  tractor: {
    frontTare: number;
    rearTare: number;
    wheelbase: number;
    kingpinOffset: number;
    maxFrontAxle: number;
    maxRearAxle: number;
  };
  trailer: {
    tare: number;
    length: number;
    axleGroupType: 'single' | 'tandem' | 'tridem';
    trailerAxleCount: number;
    kingpinToAxleDistance: number;
    maxTrailerAxleGroup: number;
  };
  maxTotalWeight: number;
}

export interface AxleLoadResult {
  frontAxle: number;
  rearAxle: number;
  trailerAxles: number[];
  totalWeight: number;
  kingpinLoad: number;
  cargoOnTrailer: number;
  cargoOnKingpin: number;
  overloads: {
    frontAxle: boolean;
    rearAxle: boolean;
    trailerAxleGroup: boolean;
  };
}

export interface WeightInput {
  cargoWeight: number;
  cargoPosition: number;
}
