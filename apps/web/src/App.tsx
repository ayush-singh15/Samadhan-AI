import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { LiveTelemetryToaster } from './components/ui/LiveTelemetryToaster';

/**
 * App root — wraps in BrowserRouter then AuthProvider (Zustand-backed),
 * then renders AppRoutes which includes the Layout.
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <LiveTelemetryToaster />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
