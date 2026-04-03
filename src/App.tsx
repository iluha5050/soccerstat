import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Leagues from './pages/Leagues';
import Teams from './pages/Teams';
import LeagueMatches from './pages/leagueMatches';   // ← убедитесь, что этот импорт есть

function App() {
  return (
    <BrowserRouter>
      <div>
        <nav style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', gap: '20px' }}>
          <Link to="/leagues">Лиги</Link>
          <Link to="/teams">Команды</Link>
        </nav>
        <Routes>
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/leagues/:id" element={<LeagueMatches />} />   
          <Route path="/teams" element={<Teams />} />
          <Route path="/" element={<Leagues />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;