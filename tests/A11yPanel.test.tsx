import { fireEvent, render, screen } from '@testing-library/react';
import { A11yPanel } from '../src/layout/A11yPanel/A11yPanel';
import { AppStoreProvider, useAppStore } from '../src/store/AppStore';

function StoreProbe() {
  const { state } = useAppStore();
  return (
    <div>
      <div data-testid="hc">{String(state.settings.hc)}</div>
      <div data-testid="fz">{state.settings.fz}</div>
    </div>
  );
}

describe('A11yPanel', () => {
  it('toggles high contrast and cycles font size', () => {
    render(
      <AppStoreProvider>
        <A11yPanel />
        <StoreProbe />
      </AppStoreProvider>,
    );

    const highContrastButton = screen.getByTitle('High contrast');
    const increaseButton = screen.getByLabelText('Increase font size');
    const decreaseButton = screen.getByLabelText('Decrease font size');

    fireEvent.click(highContrastButton);
    expect(screen.getByTestId('hc')).toHaveTextContent('true');

    fireEvent.click(increaseButton);
    expect(screen.getByTestId('fz')).toHaveTextContent('lg');

    fireEvent.click(increaseButton);
    expect(screen.getByTestId('fz')).toHaveTextContent('xl');

    fireEvent.click(decreaseButton);
    expect(screen.getByTestId('fz')).toHaveTextContent('lg');
  });
});
