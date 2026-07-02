import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useThemeColors } from '../hooks/useChartData';

export function RadarChart({ labels, values }: { labels: string[]; values: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = useThemeColors();

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Activity',
          data: values,
          backgroundColor: `${colors.primary}1a`,
          borderColor: colors.primary,
          pointBackgroundColor: colors.primary,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            grid: { color: colors.grid },
            ticks: { color: colors.text, backdropColor: 'transparent' },
            pointLabels: { color: colors.text, font: { size: 10 } },
          },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [labels, values, colors]);

  return <canvas ref={canvasRef} />;
}
