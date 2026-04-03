import client from './client';

export const getCompetitions = async () => {
  const response = await client.get('/competitions');
  return response.data.competitions;
};

export const getCompetitionMatches = async (
  id: number,
  dateFrom?: string,
  dateTo?: string
) => {
  const params: { dateFrom?: string; dateTo?: string } = {};
  if (dateFrom) params.dateFrom = dateFrom;
  if (dateTo) params.dateTo = dateTo;
  const response = await client.get(`/competitions/${id}/matches`, { params });
  return response.data.matches;
};