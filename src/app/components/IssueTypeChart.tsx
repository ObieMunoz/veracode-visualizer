import { useEffect, useRef } from "react";
import { Chart, ArcElement, PieController, Tooltip } from "chart.js";
import { Finding } from "../types";

Chart.register(PieController, ArcElement, Tooltip);

interface IssueTypeChartProps {
  findings: Finding[];
}

const IssueTypeChart: React.FC<IssueTypeChartProps> = ({ findings }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart<"pie", number[], string> | null>(null);

  useEffect(() => {
    if (!chartRef.current || !findings) return;

    if (findings.length === 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    const issueTypeCounts = findings.reduce<Record<string, number>>(
      (acc, finding) => {
        const issueType = finding.issue_type || "Unknown Type";
        acc[issueType] = (acc[issueType] || 0) + 1;
        return acc;
      },
      {}
    );

    const sortedIssueTypes = Object.entries(issueTypeCounts).sort(
      ([, a], [, b]) => b - a
    );
    const topN = 10;
    const chartLabels: string[] = [];
    const chartData: number[] = [];
    let otherCount = 0;

    sortedIssueTypes.forEach(([type, count], index) => {
      if (index < topN) {
        chartLabels.push(type);
        chartData.push(count);
      } else {
        otherCount += count;
      }
    });

    if (otherCount > 0) {
      chartLabels.push("Other");
      chartData.push(otherCount);
    }

    const backgroundColors = chartLabels.map(
      (_, i) => `hsl(${i * (360 / Math.max(1, chartLabels.length))}, 70%, 60%)`
    );

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Findings by Issue Type",
            data: chartData,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) =>
              color.replace("60%", "50%")
            ),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw as number;
                const total = context.dataset.data.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} findings (${percentage}%)`;
              },
            },
          },
        },
      } as const,
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
        Findings by Issue Type
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

export default IssueTypeChart;
