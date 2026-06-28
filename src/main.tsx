import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/fonts/styles/global.css';
import { AppStoreProvider } from './store/AppStore';
import { DayContextProvider } from './store/DayContext';
import { ToastProvider } from './components/layout/Toast/ToastContext';
import { A11yPanel } from './layout/A11yPanel/A11yPanel';
import { Sidebar } from './layout/Sidebar/Sidebar';

function App() {
  return (
    <AppStoreProvider>
      <DayContextProvider>
        <ToastProvider>
          <main>
            <Sidebar mobileOpen={false} onNavigate={() => {}} />
            <A11yPanel />
            <h1>StudyFlow Orbit</h1>
            <p>Application shell is ready.</p>
          </main>
        </ToastProvider>
      </DayContextProvider>
    </AppStoreProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
