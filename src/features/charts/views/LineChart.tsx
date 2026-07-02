import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useThemeColors } from '../hooks/useChartData';

interface LineChartProps {
  labels: string[];
  values: number[];
  label?: string;
}

export function LineChart({ labels, values, label = 'Hours' }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);
  const colors = useThemeColors();

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data: values,
          borderColor: colors.primary,
          backgroundColor: `${colors.primary}22`,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: colors.primary,
          pointRadius: 4,
          pointHoverRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: colors.grid }, ticks: { color: colors.text, maxTicksLimit: 7 } },
          y: { grid: { color: colors.grid }, ticks: { color: colors.text }, beginAtZero: true },
        },
      },
    });
    return () => chartRef.current?.destroy();
  }, [labels, values, label, colors]);

  return <canvas ref={canvasRef} />;
}
