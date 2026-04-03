import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCompetitionMatches } from '../api/competitions';

interface Match {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: { name: string };
  awayTeam: { name: string };
  competition?: { name: string };
  score: {
    fullTime: { homeTeam: number | null; awayTeam: number | null };
    extraTime: { homeTeam: number | null; awayTeam: number | null };
    penalties: { homeTeam: number | null; awayTeam: number | null };
  };
}

const formatLocalDateTime = (utcDate: string) => {
  const date = new Date(utcDate);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusRussian = (status: string) => {
  const map: Record<string, string> = {
    SCHEDULED: 'Запланирован',
    LIVE: 'В прямом эфире',
    IN_PLAY: 'В игре',
    PAUSED: 'Пауза',
    FINISHED: 'Завершен',
    POSTPONED: 'Отложен',
    SUSPENDED: 'Приостановлен',
    CANCELED: 'Отменен',
  };
  return map[status] || status;
};

const formatScore = (match: Match) => {
  // Если объекта score нет, сразу возвращаем прочерк
  if (!match.score) return '? : ?';

  // Безопасно получаем части счёта
  const ft = match.score.fullTime || {};
  const et = match.score.extraTime || {};
  const pen = match.score.penalties || {};

  // Пытаемся найти правильные ключи (homeTeam или home)
  const homeFt = ft.homeTeam;
  const awayFt = ft.awayTeam;
  const homeEt = et.homeTeam;
  const awayEt = et.awayTeam;
  const homePen = pen.homeTeam;
  const awayPen = pen.awayTeam;

  let score = '';
  if (homeFt !== undefined && homeFt !== null && awayFt !== undefined && awayFt !== null) {
    score += `${homeFt}:${awayFt}`;
  } else {
    score += '?:?';
  }

  if (homeEt !== undefined && homeEt !== null && awayEt !== undefined && awayEt !== null) {
    score += ` (${homeEt}:${awayEt})`;
  }
  if (homePen !== undefined && homePen !== null && awayPen !== undefined && awayPen !== null) {
    score += ` (${homePen}:${awayPen})`;
  }
  return score;
};

export default function LeagueMatches() {
  const { id } = useParams<{ id: string }>();
  const leagueId = Number(id);

  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!leagueId) return;
    setIsLoading(true);
    getCompetitionMatches(leagueId, dateFrom || undefined, dateTo || undefined)
      .then((data) => {
        setMatches(data || []);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [leagueId, dateFrom, dateTo]);

  if (isLoading) return <div style={{ padding: '20px' }}>Загрузка матчей...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Ошибка: {error}</div>;

  const totalPages = Math.ceil((matches?.length || 0) / itemsPerPage);
  const paginatedMatches = matches?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const leagueName = (matches[0] as Match)?.competition?.name || `Лига ${leagueId}`;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/leagues">Лиги</Link> &gt; <span>{leagueName}</span>
      </div>

      <h1>Календарь лиги</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <label>
          Дата с:
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{ marginLeft: '5px', padding: '5px' }}
          />
        </label>
        <label>
          Дата по:
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{ marginLeft: '5px', padding: '5px' }}
          />
        </label>
        <button onClick={() => { setDateFrom(''); setDateTo(''); setCurrentPage(1); }}>Сбросить</button>
      </div>

      {paginatedMatches?.length === 0 ? (
        <div>Нет матчей за выбранный период</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ccc' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Дата и время</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Статус</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Хозяева</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Гости</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Счёт</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMatches?.map((match) => (
                  <tr key={match.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px' }}>{formatLocalDateTime(match.utcDate)}</td>
                    <td style={{ padding: '10px' }}>{getStatusRussian(match.status)}</td>
                    <td style={{ padding: '10px' }}>{match.homeTeam.name}</td>
                    <td style={{ padding: '10px' }}>{match.awayTeam.name}</td>
                    <td style={{ padding: '10px' }}>{formatScore(match)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>Назад</button>
              <span>Страница {currentPage} из {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Вперёд</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}