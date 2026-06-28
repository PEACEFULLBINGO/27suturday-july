import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Topbar } from '../src/layout/Topbar/Topbar';
import { AppStoreProvider } from '../src/store/AppStore';
import { ToastProvider } from '../src/components/layout/Toast/ToastContext';

describe('Topbar', () => {
  it('renders the current page title and profile fallback', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppStoreProvider>
          <ToastProvider>
            <Topbar onToggleMenu={() => {}} menuOpen={false} onOpenProfile={() => {}} />
          </ToastProvider>
        </AppStoreProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByLabelText('Profile')).toHaveTextContent('Profile');
  });
});
