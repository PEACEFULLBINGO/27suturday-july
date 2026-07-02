import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useThemeColors } from '../hooks/useChartData';

export function DonutChart({ data }: { data: Record<string, number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = useThemeColors();

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels: Object.keys(data),
        datasets: [{ data: Object.values(data), backgroundColor: colors.palette, borderWidth: 0, hoverOffset: 6 }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: colors.text, boxWidth: 11, font: { size: 11 } } } },
        cutout: '68%',
      },
    });
    return () => chartRef.current?.destroy();
  }, [data, colors]);

  return <canvas ref={canvasRef} />;
}
