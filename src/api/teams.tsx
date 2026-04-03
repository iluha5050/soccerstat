import client from './client';

// Получить список команд (первые 100)
export const getTeams = async () => {
  const response = await client.get('/teams?limit=100');
  return response.data.teams;
};

// Получить матчи команды по её id
export const getTeamMatches = async (
  id: number,
  dateFrom?: string,
  dateTo?: string
) => {
  const params: { dateFrom?: string; dateTo?: string } = {};
  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;
  const response = await client.get(`/teams/${id}/matches`, { params });
  return response.data.matches;
};

// Получить информацию об одной команде (для хлебных крошек)
export const getTeamById = async (id: number) => {
  const response = await client.get(`/teams/${id}`);
  return response.data;
};