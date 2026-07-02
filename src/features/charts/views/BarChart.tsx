import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useThemeColors } from '../hooks/useChartData';

export function BarChart({ labels, values }: { labels: string[]; values: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = useThemeColors();

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    const barColor = colors.palette[2];
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{ label: '%', data: values, backgroundColor: `${barColor}aa`, borderColor: barColor, borderWidth: 1, borderRadius: 6 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: colors.grid }, ticks: { color: colors.text } },
          y: { grid: { color: colors.grid }, ticks: { color: colors.text }, min: 0, max: 100 },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [labels, values, colors]);

  return <canvas ref={canvasRef} />;
}
