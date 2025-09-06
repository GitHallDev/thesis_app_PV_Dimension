// src/Charts/InteractivePvChart.tsx
"use client";
import { useEffect, useState } from "react";
import React from "react";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import parseTime from "../utils/parseTime";


export const description = "An interactive line chart";

type RawData = {
  time: string; // Format: "2020-01-01T12:00",
  "G(i)": number; // Irradiance in W/m²,
  H_sun: number; // Sun hours in hours,
  T2m: number; // Temperature in °C,
  WS10m: number; // Wind speed at 10m in m/s,
  Int: number; // Intensity in W/m²,
};

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

const chartDataYearly = [
  { date: "2020", value: 760 },
  { date: "2021", value: 789 },
  { date: "2022", value: 805 },
];

const chartDataMonthly = [
  { date: "2020-01", value: 23.1 },
  { date: "2020-02", value: 42.3 },
  { date: "2020-03", value: 78.9 },
  { date: "2020-04", value: 110.4 },
  { date: "2020-05", value: 95.2 },
  { date: "2020-06", value: 88.1 },
  { date: "2020-07", value: 120.5 },
  { date: "2020-08", value: 150.3 },
  { date: "2020-09", value: 130.7 },
  { date: "2020-10", value: 110.9 },
  { date: "2020-11", value: 95.6 },
  { date: "2020-12", value: 25.7 },
];

const chartDataDaily = [
  { date: "2020-01-01", value: 1.2 },
  { date: "2020-01-02", value: 1.5 },
  { date: "2020-01-03", value: 2.1 },
  { date: "2020-01-04", value: 3.4 },
  { date: "2020-01-05", value: 2.8 },
  { date: "2020-01-06", value: 3.6 },
  { date: "2020-01-07", value: 4.2 },
  { date: "2020-01-08", value: 5.1 },
  { date: "2020-01-09", value: 6.3 },
  { date: "2020-01-10", value: 7.4 },
  { date: "2020-01-11", value: 8.2 },
  { date: "2020-01-12", value: 9.1 },
  { date: "2020-01-13", value: 10.5 },
  { date: "2020-01-14", value: 11.3 },
  { date: "2020-01-15", value: 12.7 },
  { date: "2020-01-16", value: 13.8 },
  { date: "2020-01-17", value: 14.6 },
  { date: "2020-01-18", value: 15.2 },
  { date: "2020-01-19", value: 16.4 },
  { date: "2020-01-20", value: 17.5 },
  { date: "2020-01-21", value: 18.3 },
  { date: "2020-01-22", value: 19.1 },
  { date: "2020-01-23", value: 20.2 },
  { date: "2020-01-24", value: 21.4 },
  { date: "2020-01-25", value: 22.5 },
  { date: "2020-01-26", value: 23.6 },
  { date: "2020-01-27", value: 24.8 },
  { date: "2020-01-28", value: 25.9 },
  { date: "2020-01-29", value: 26.7 },
  { date: "2020-01-30", value: 27.5 },
  { date: "2020-01-31", value: 28.4 },
];

const chartConfig = {
  // views: {
  //   label: "Page Views",
  // },
  // desktop: {
  //   label: "Desktop",
  //   color: "var(--chart-1)",
  // },
  // mobile: {
  //   label: "Mobile",
  //   color: "var(--chart-2)",
  // },
  yearly: {
    label: "Year",
    color: "var(--chart-3)",
  },
  monthly: {
    label: "Month",
    color: "var(--chart-4)",
  },
  daily: {
    label: "Day",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function InteractivePVChart() {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("monthly");

  // Données groupées par date (une seule vue)
  const [chartData, setChartData] = useState<{ date: string; value: number }[]>(
    []
  );

  // Données filtrées à afficher
  const [filteredData, setFilteredData] = useState<
    { date: string; value: number }[]
  >([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  // Selection avtives pour filtrage
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null); //ex: "2024-04"
  const [selectedYear, setSlectedYear] = useState<string | null>(null); //ex: "2024"

  const total = React.useMemo(() => {
    return filteredData.reduce((acc, curr) => acc + curr.value, 0);
  }, [filteredData]);

  // charger les données dans le localStorage une seule fois
  useEffect(() => {
    const raw = localStorage.getItem("pvGisData");

    if (!raw) return;

    const hourlyData: RawData[] = JSON.parse(raw)["outputs"]["hourly"];

    const grouped: Record<string, number> = {};

    for (const entry of hourlyData) {
      const date = parseTime(entry.time);
      let key = "";

      switch (activeChart) {
        case "daily":
          key = date.toISOString().slice(0, 10); // YYYY-MM-DD
          break;
        case "monthly":
          key = date.toISOString().slice(0, 7); // YYYY-MM
          break;
        case "yearly":
          key = date.toISOString().slice(0, 4); // YYYY
          break;
      }
      grouped[key] = (grouped[key] || 0) + entry["G(i)"];
    }

    const groupedArray = Object.entries(grouped).map(([date, value]) => ({
      date,
      value,
    }));
    setChartData(groupedArray);
  }, [activeChart]);

  useEffect(() => {
    if (activeChart === "daily") {
      // affichée tous les jours du mois sélectionné
      if (selectedMonth) {
        setFilteredData(
          chartData.filter((item) => item.date.startsWith(selectedMonth))
        );
      } else {
        if (chartData[0])
          console.log("premiere mois: ", chartData[0].date.slice(0, 7));
        setFilteredData(
          chartData.filter((item) =>
            item.date.startsWith(chartData[0].date.slice(0, 7))
          )
        );
      }
    } else if (activeChart === "monthly") {
      // afficher tous les mois de l'année sélectionnée
      if (selectedYear) {
        setFilteredData(
          chartData.filter((item) => item.date.startsWith(selectedYear))
        );
      } else {
        setFilteredData(
          chartData.filter((item) =>
            item.date.startsWith(chartData[0].date.slice(0, 4))
          )
        );
      }
    } else {
      // yaerly aucune sélection nécessaire
      setFilteredData(chartData);
    }
  }, [chartData, activeChart, selectedMonth, selectedYear]);

  // test
  useEffect(() => {
    console.log("filtered: ", filteredData);
  }, [filteredData]);

// Card balise enlever: sm:w-[600px]
  return (
    <Card className="py-4 sm:py-0 my-4 sm:my-0 w-full h-full"> 
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Line Chart - Interactive</CardTitle>
          <CardDescription>
            {"Date:" }

              {/* Selecte pour les mois */}
                {activeChart === "daily" && (
                  <select onChange={(e) => setSelectedMonth(e.target.value)}>
                    {[...new Set(chartData.map((d) => d.date.slice(0, 7)))].map(
                      (month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      )
                    )}
                  </select>
                )}{
                  activeChart === "monthly"&& (
                    <select onChange={(e) => setSlectedYear(e.target.value)}>
                      {[
                        ...new Set(chartData.map((d) => d.date.slice(0, 4))),
                      ].map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  )
                }
          </CardDescription>
        </div>
        <div className="flex">
          {["daily", "yearly", "monthly"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => {
                  setActiveChart(chart);
                }}
              >
                <span className="text-muted-foreground text-lg">
                  {chartConfig[chart].label}
                </span>
                <span className="text-xs leading-none font-medium  sm:text-xl">
                  {activeChart === chart
                    ? total.toLocaleString()
                    : "change view"}
                  {/* {total ? "salut " : "bonjour"}  */}
                </span>
              </button>
            );
          })}
        </div>

        {/*  */}
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px]">
          <LineChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  // year:"numeric",
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={"value"}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
