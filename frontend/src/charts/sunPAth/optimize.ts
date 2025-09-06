// optimize.ts
import type { HourlyIrradiation } from "./irradiation";
import type { MaskPoint } from "./maskData";
import { computeAnnualIrradiation } from "./irradiation";

export interface OptimizationResult {
  tilt: number;
  azimuth: number;
  energy: number;
}

export async function findBestTiltAzimuth(
  lon: number,
  lat: number,
  alt: number,
  hourly: HourlyIrradiation[],
  mask: MaskPoint[]
): Promise<OptimizationResult> {
  const azRange = Array.from({ length: 361 }, (_, i) => i - 180); // -180 … +180
  const tiltRange = Array.from({ length: 91 }, (_, i) => i); // 0 … 90

  let best: OptimizationResult = { tilt: 0, azimuth: 0, energy: 0 };

  for (const az of azRange) {
    for (const tilt of tiltRange) {
      const { global } = computeAnnualIrradiation(
        lon,
        lat,
        alt,
        hourly,
        tilt,
        az,
        mask
      );
      if (global > best.energy) {
        best = { tilt, azimuth: az, energy: global };
      }
    }
  }
  return best;
}
