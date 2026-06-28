import { useAppStore } from '@/store/AppStore';

export function A11yPanel() {
  const { state, dispatch } = useAppStore();
  const { hc } = state.settings;

  const setFz = (dir: 1 | -1) => {
    const order: Array<typeof state.settings.fz> = ['normal', 'lg', 'xl'];
    const idx = Math.max(0, Math.min(order.length - 1, order.indexOf(state.settings.fz) + dir));
    dispatch({ type: 'set_settings', payload: { fz: order[idx] } });
  };

  return (
    <div className="a11y" role="toolbar" aria-label="Accessibility tools">
      <button
        className="ab"
        aria-pressed={hc}
        title="High contrast"
        onClick={() => dispatch({ type: 'set_settings', payload: { hc: !hc } })}
      >
        ◑
      </button>
      <button className="ab" title="Larger text" aria-label="Increase font size" onClick={() => setFz(1)}>A+</button>
      <button className="ab" title="Smaller text" aria-label="Decrease font size" onClick={() => setFz(-1)}>A-</button>
    </div>
  );
}
