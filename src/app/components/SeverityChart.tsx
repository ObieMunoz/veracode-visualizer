import { useEffect, useRef } from "react";
import {
  Chart,
  DoughnutControllerChartOptions,
  DoughnutController,
  ArcElement,
} from "chart.js";
import { getSeverityInfo } from "../utils/severityUtils";
import { Finding } from "../types";

Chart.register(DoughnutController, ArcElement);

interface SeverityChartProps {
  findings: Finding[];
}

const SeverityChart: React.FC<SeverityChartProps> = ({ findings }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<"doughnut", number[], string> | null>(
    null
  );

  useEffect(() => {
    if (!chartRef.current || !findings) return;

    if (findings.length === 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    const severityCounts = findings.reduce<Record<number, number>>(
      (acc, finding) => {
        acc[finding.severity] = (acc[finding.severity] || 0) + 1;
        return acc;
      },
      {}
    );

    const sortedSeverities = Object.keys(severityCounts)
      .map(Number)
      .sort((a, b) => b - a);

    const labels = sortedSeverities.map((s) => getSeverityInfo(s).text);
    const data = sortedSeverities.map((s) => severityCounts[s]);
    const backgroundColors = sortedSeverities.map(
      (s) => getSeverityInfo(s).chartColor
    );

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Findings by Severity",
            data: data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) =>
              color.replace("0.7", "1")
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "top" } },
      } as unknown as DoughnutControllerChartOptions, // Type assertion for options
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [findings]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Findings by Severity
      </h2>
      <div className="h-[350px] w-full">
        {(!findings || findings.length === 0) && (
          <p className="text-gray-500 text-center pt-16">
            No data to display chart.
          </p>
        )}
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default SeverityChart;
