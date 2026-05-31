import { Routes, Route } from 'react-router-dom';
import AuthGate from './components/AuthGate';
import BackgroundVideo from './components/BackgroundVideo';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <AuthGate>
      <BackgroundVideo />
      <div className="max-w-2xl mx-auto relative min-h-screen">
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
