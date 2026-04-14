export interface TractorConfig {
  id: string;
  name: string;
  type: string;
  tare: number;
  length: number;
  height: number;
  wheelbase: number;
  frontTare: number;
  rearTare: number;
  kingpinOffset: number;
  maxFrontAxle: number;
  maxRearAxle: number;
  rearAxleCount: number;
  hasLiftAxle: boolean;
}

export interface TrailerConfig {
  id: string;
  name: string;
  type: string;
  tare: number;
  length: number;
  lengthExtended?: number;
  height: number;
  width: number;
  axleGroupType: 'single' | 'tandem' | 'tridem' | 'quad';
  trailerAxleCount: number;
  kingpinToAxleDistance: number;
  maxTrailerAxleGroup: number;
  hasTelescope: boolean;
  axlePositions: number[];
}

export interface RoadTrain {
  tractor: TractorConfig;
  trailer: TrailerConfig;
  isTelescoped: boolean;
}

export interface CargoItem {
  id: string;
  name: string;
  weight: number; // kg
  position: number; // meters from kingpin (0 = at kingpin, max = trailer length)
  length: number; // physical length of cargo in meters
  height?: number;
  cog?: number;
  color: string;
}

export interface AxleLoadResult {
  frontAxle: number;
  rearAxle: number;
  trailerAxles: number[];
  totalWeight: number;
  totalCargoWeight: number;
  kingpinLoad: number;
  overloads: {
    frontAxle: boolean;
    rearAxle: boolean;
    trailerAxleGroup: boolean;
    totalWeight: boolean;
  };
}
