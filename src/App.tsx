import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Leagues from './pages/Leagues';
import LeagueMatches from './pages/leagueMatches';
import Teams from './pages/Teams';
import TeamMatches from './pages/TeamMatches';

function App() {
  return (
    <BrowserRouter basename="/soccerstat">
      <div>
        <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', gap: '20px' }}>
          <Link to="/leagues">Лиги</Link>
          <Link to="/teams">Команды</Link>
        </nav>
        <Routes>
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/leagues/:id" element={<LeagueMatches />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:id" element={<TeamMatches />} />
          <Route path="/" element={<Leagues />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;