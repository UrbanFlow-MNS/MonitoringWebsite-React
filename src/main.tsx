import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeContext } from '@grafana/ui';
import '../i18n.ts';
import App from './App.tsx';
import './styles/index.css';
import { urbanflowGrafanaTheme } from './lib/grafanaTheme.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeContext.Provider value={urbanflowGrafanaTheme}>
      <App />
    </ThemeContext.Provider>
  </StrictMode>,
)
