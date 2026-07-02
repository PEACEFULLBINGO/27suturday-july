import { useAppStore } from '@/store/AppStore';
import { todayIso } from '@/utils/formatters';
import { useLineData, useSubjectData, useCompletionBarData, useRadarData, useHeatmapData } from '../hooks/useChartData';
import { LineChart } from './LineChart';
import { DonutChart } from './DonutChart';
import { BarChart } from './BarChart';
import { RadarChart } from './RadarChart';
import { Heatmap } from './Heatmap';

export function GrowthChartsPage() {
  const { state } = useAppStore();
  const line = useLineData(state);
  const subjects = useSubjectData(state);
  const bar = useCompletionBarData(state);
  const radar = useRadarData(state, todayIso());
  const heatmap = useHeatmapData(state);

  return (
    <section className="page">
      <div className="pg-hd">
        <h2>Growth Charts</h2>
        <p>Built from your real activity — not sample data.</p>
      </div>

      <div className="g2 mb5">
        <div className="card ca-v">
          <div className="ch"><h3>Study hours trend</h3><span className="badge bv">7 days</span></div>
          <div className="cb"><div className="cw-t"><LineChart labels={line.labels} values={line.values} label="Study Hours" /></div></div>
        </div>
        <div className="card ca-c">
          <div className="ch"><h3>Subject balance</h3><span className="badge bc">All time</span></div>
          <div className="cb"><div className="cw-t"><DonutChart data={subjects} /></div></div>
        </div>
        <div className="card ca-e">
          <div className="ch"><h3>Daily completion %</h3><span className="badge be">7 days</span></div>
          <div className="cb"><div className="cw-t"><BarChart labels={bar.labels} values={bar.values} /></div></div>
        </div>
        <div className="card ca-r">
          <div className="ch"><h3>Balance radar</h3><span className="badge br">Cross-feature</span></div>
          <div className="cb"><div className="cw-t"><RadarChart labels={radar.labels} values={radar.values} /></div></div>
        </div>
      </div>

      <div className="card">
        <div className="ch"><h3>Activity heatmap</h3><span className="badge ba">28 days</span></div>
        <div className="cb"><Heatmap cells={heatmap} /></div>
      </div>
    </section>
  );
}
