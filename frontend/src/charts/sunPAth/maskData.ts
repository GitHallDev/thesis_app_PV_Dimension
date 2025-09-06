// maskData.ts

export interface MaskPoint{
    azimuth:number; // -180 ...+180
    elevation:number; // angle de masque en degrés
}

// Exemple : une valeur par degrés d'azimut
export const maskData: MaskPoint[] = [
  { azimuth: -180, elevation: 5 },
  { azimuth: -179, elevation: 5 },
  // …
  { azimuth: 180, elevation: 2 },
];


/**
 * Pour un azimut donné, renvoie l'élévation du masque (par interpolation linéaire).
 */
export const lookupMaskElevation=(
  mask: MaskPoint[],
  az: number
): number =>{
  // on suppose mask trié par azimuth croissant
  if (az <= mask[0].azimuth) return mask[0].elevation;
  if (az >= mask[mask.length - 1].azimuth) return mask[mask.length - 1].elevation;

  // trouver les deux points encadrants
  for (let i = 0; i < mask.length - 1; i++) {
    const a0 = mask[i], a1 = mask[i + 1];
    if (az >= a0.azimuth && az <= a1.azimuth) {
      const t = (az - a0.azimuth) / (a1.azimuth - a0.azimuth);
      return a0.elevation + t * (a1.elevation - a0.elevation);
    }
  }
  return 0;
}