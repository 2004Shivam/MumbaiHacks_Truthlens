import { Routes, Route } from 'react-router-dom';
import { ModeProvider } from './context/ModeContext';
import AppShell from './components/layout/AppShell';

// Pages
import Dashboard from './pages/Dashboard';
import Topics from './pages/Topics';
import TopicDetail from './pages/TopicDetail';
import Claims from './pages/Claims';
import ClaimDetail from './pages/ClaimDetail';
import Verify from './pages/Verify';
import Admin from './pages/Admin';
import Insights from './pages/Insights';

function App() {
  return (
    <ModeProvider>
      <Routes>
        <Route path="/" element={<AppShell pageTitle="Dashboard"><Dashboard /></AppShell>} />
        <Route path="/topics" element={<AppShell pageTitle="Topics"><Topics /></AppShell>} />
        <Route path="/topics/:id" element={<AppShell pageTitle="Topic Details"><TopicDetail /></AppShell>} />
        <Route path="/claims" element={<AppShell pageTitle="Claims"><Claims /></AppShell>} />
        <Route path="/claims/:id" element={<AppShell pageTitle="Claim Details"><ClaimDetail /></AppShell>} />
        <Route path="/verify" element={<AppShell pageTitle="Verify Claim"><Verify /></AppShell>} />
        <Route path="/insights" element={<AppShell pageTitle="Insights"><Insights /></AppShell>} />
        <Route path="/admin" element={<AppShell pageTitle="Admin"><Admin /></AppShell>} />
      </Routes>
    </ModeProvider>
  );
}

export default App;
