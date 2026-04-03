import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTeams } from '../api/teams';

interface Team {
  id: number;
  name: string;
  crestUrl?: string;
  tla?: string;
}

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getTeams()
      .then((data) => {
        setTeams(data);
        setFilteredTeams(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTeams(filtered);
  }, [search, teams]);

  if (loading) return <div style={{ padding: '20px' }}>Загрузка команд...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Команды</h1>
      <input
        type="text"
        placeholder="Поиск по названию..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: '10px', marginBottom: '20px', width: '100%', maxWidth: '400px' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {filteredTeams.map((team) => (
          <div
            key={team.id}
            onClick={() => navigate(`/teams/${team.id}`)}
            style={{
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '12px',
              cursor: 'pointer',
              backgroundColor: 'white',
              transition: '0.2s',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            {team.crestUrl && (
              <img
                src={team.crestUrl}
                alt={team.name}
                style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '10px' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            )}
            <div style={{ fontWeight: 'bold' }}>{team.name}</div>
            {team.tla && <div style={{ fontSize: '0.9em', color: '#666' }}>{team.tla}</div>}
          </div>
        ))}
      </div>
      {filteredTeams.length === 0 && <div style={{ marginTop: '20px' }}>Ничего не найдено</div>}
    </div>
  );
}