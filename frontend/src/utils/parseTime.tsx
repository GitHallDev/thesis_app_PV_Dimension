const parseTime = (rawTime: string) => {
  const [date, time] = rawTime.split(":"); // ["20100101", "0010"]
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);
  const hour = time.slice(0, 2);
  const minute = time.slice(2, 4);

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:00Z`);
};
export default parseTime;
// This function takes a raw time string in the format "YYYYMMDD:HHMM"

// Supposons un panneau de 1kWc, avec 15% de rendement sur 1m² :
// const estimatedProductionKWh = (irradiance: number, durationHours = 1) => {
//   const panelEfficiency = 0.15;
//   const panelArea = 1; // m²
//   return (irradiance * panelArea * panelEfficiency * durationHours) / 1000;
// };
