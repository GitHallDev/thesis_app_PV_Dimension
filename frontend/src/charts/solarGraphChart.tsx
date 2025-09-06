import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TrendingUp} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Scatter,
  ScatterChart,
} from "recharts";

import { Body, Observer, MakeTime, Horizon, Equator } from "astronomy-engine";

export type SunPoint = {
  date: any;
  azimuth: number;
  height: number;
};

const MONTHS = [
  {
    key: "jan/nov",
    label: "janvier/novembre",
    date: new Date(Date.UTC(2024, 0, 21)),
  },
  {
    key: "fev/oct",
    label: "février/octobre",
    date: new Date(Date.UTC(2024, 1, 21)),
  },
  {
    key: "mar/sep",
    label: "mars/septembre",
    date: new Date(Date.UTC(2024, 2, 21)),
  },
  {
    key: "avr/août",
    label: "avril/août",
    date: new Date(Date.UTC(2024, 3, 21)),
  },
  {
    key: "mai/jul",
    label: "mai/juillet",
    date: new Date(Date.UTC(2024, 4, 21)),
  },
  { key: "juin", label: "juin", date: new Date(Date.UTC(2024, 5, 21)) },
  { key: "dec", label: "décembre", date: new Date(Date.UTC(2024, 11, 21)) },
];

// fonction pour générer les points azimuth / hauteur du soleil pendant une année donnée
export const SunPathYearData = (
  lat: number, // ex. 45.75
  long: number, // ex. 4.85
  alt: number, // ex. 0
  startYear: number,
  endYear: number
): SunPoint[] => {
  const result: SunPoint[] = [];
  // Plage des dates de nos données
  const startDate = new Date(Date.UTC(startYear, 0, 0, 0, 0));
  const endDate = new Date(Date.UTC(endYear, 12, 31, 23, 59));
  const stepMinutes = 60;

  while (startDate <= endDate) {
    // convertion de la date en date astronomique
    const time = MakeTime(startDate);
    const instant = startDate;
    // utilisation de astronomy pour calculé la possition du soleil en fonction d'un instant précis
    // console.log("startdate: ", startDate);

    const observer = new Observer(lat, long, alt);
    const sunEq = Equator(Body.Sun, time, observer, true, true);
    const soleil = Horizon(time, observer, sunEq.ra, sunEq.dec, "normal");
    result.push({
      date: new Date(startDate),
      azimuth: Number(soleil.azimuth.toFixed(2)), // degrés avec 2 chiffres après la virgules
      height: Number(soleil.altitude.toFixed(2)), // degrés avec 2 chiffres après la virgules
    });
    startDate.setUTCMinutes(startDate.getUTCMinutes() + stepMinutes);
  }
  console.log("resultat de point: ", result);
  return result;
};

// fonction pour ajouter un couché et un lever de soleil
function insertSunriseSunset(points: SunPoint[]): SunPoint[] {
  const result: SunPoint[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];

    // Ajouter le point actuel si >= 0
    if (current.height >= 0) {
      result.push(current);
    }

    // Transition de négatif à positif (lever du soleil)
    if (current.height < 0 && next.height >= 0) {
      const ratio = (0 - current.height) / (next.height - current.height);
      const dateMillis =
        current.date.getTime() +
        ratio * (next.date.getTime() - current.date.getTime());
      const azimuth =
        current.azimuth + ratio * (next.azimuth - current.azimuth);
      result.push({
        date: new Date(dateMillis),
        azimuth,
        height: 0,
      });
      result.push(next); // ajouter le point positif après interpolation
    }

    // Transition de positif à négatif (coucher du soleil)
    if (current.height >= 0 && next.height < 0) {
      const ratio = (0 - current.height) / (next.height - current.height);
      const dateMillis =
        current.date.getTime() +
        ratio * (next.date.getTime() - current.date.getTime());
      const azimuth =
        current.azimuth + ratio * (next.azimuth - current.azimuth);
      result.push({
        date: new Date(dateMillis),
        azimuth,
        height: 0,
      });
    }
  }

  return result;
}

const chartConfig = {
  "jan/nov": {
    label: "Janvier / Novembre",
    color: "var(--chart-1)",
  },
  "fev/oct": {
    label: "Février / Octobre",
    color: "var(--chart-2)",
  },
  "mar/sep": {
    label: "Mars / Septembre",
    color: "var(--chart-3)",
  },
  "avr/août": {
    label: "Avril / Août",
    color: "var(--chart-4)",
  },
  "mai/jul": {
    label: "Mai / Juillet",
    color: "var(--chart-5)",
  },
  juin: {
    label: "Juin",
    color: "#76D7C4",
  },
  dec: {
    label: "Décembre",
    color: "#7B7D7D",
  },
} satisfies ChartConfig;

// composant custom pour les points de notre courbe
const CustomPoint = (props: any) => {
  const { cx, cy, payload, isActive, fill, stroke, index } = props;

  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={isActive ? fill : "white"} // remplissage au survol
      stroke={fill} // contour avec la couleur de la courbe
      strokeWidth={2}
    />
  );
};

export const ChartLineMultiple = () => {
  const data = SunPathYearData(45.75, 2.85, 0, 2024, 2024);

  const azimuthValues = data.map((d) => d.azimuth);
  const minAzimuth = Math.min(...azimuthValues);
  const maxAzimuth = Math.max(...azimuthValues);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>Courbe Solaire</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ScatterChart
            width={900}
            height={300}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid />
            <XAxis type="number" dataKey="azimuth" name="Azimuth" unit="°" />
            <YAxis type="number" dataKey="height" name="Hauteur" unit="°" />
            <Tooltip cursor={{ strokeDasharray: "3 2" }} />
            <Legend />
            {MONTHS.map((month, index) => {
              let monthData = data.filter((point) => {
                // console.log("monthDate: ",point.date.getUTCDate())
                return (
                  point.date.getUTCDate() === month.date.getUTCDate() &&
                  point.date.getUTCMonth() === month.date.getUTCMonth()
                );
              });
              const filtered = insertSunriseSunset(monthData);
              return (
                <Scatter
                  key={month.key}
                  fill={
                    chartConfig[month.key as keyof typeof chartConfig]?.color
                  }
                  name={
                    chartConfig[month.key as keyof typeof chartConfig]?.label ||
                    month.label
                  }
                  data={filtered}
                  line
                  shape="circle"
                />
              );
            })}
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
};
