import { Routes, Route } from 'react-router-dom';
import AuthGate from './components/AuthGate';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <AuthGate>
      <div className="max-w-lg mx-auto relative min-h-screen bg-washi">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
        <NavBar />
      </div>
    </AuthGate>
  );
}
