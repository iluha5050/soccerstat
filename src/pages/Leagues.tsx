import { useState } from 'react';
import { useCompetitions } from '../hooks/useCompetitions';
import { useNavigate } from 'react-router-dom';

interface League {
  id: number;
  name: string;
  area: {
    name: string;
  };
}

export default function Leagues() {
  const { data: leagues, isLoading, error } = useCompetitions();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  
  const leaguesList = (leagues as League[]) || [];

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка лиг...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error.message}</div>;

  const filtered = leaguesList.filter((league: League) =>
    league.name.toLowerCase().includes(search.toLowerCase()) ||
    league.area.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Лиги и соревнования</h1>
      <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '8px', marginBottom: '20px', width: '100%', maxWidth: '300px' }}
      />
      <div style={{ display: 'grid', gap: '10px' }}>
        {filtered.map((league: League) => (
          <div
            key={league.id}
            onClick={() => navigate(`/leagues/${league.id}`)}
            style={{
              padding: '15px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              background: 'white',
            }}
          >
            <strong>{league.name}</strong> <span style={{ color: '#666' }}>({league.area.name})</span>
          </div>
        ))}
      </div>
    </div>
  );
}