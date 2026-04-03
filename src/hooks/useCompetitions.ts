// src/hooks/useCompetitions.ts
import { useQuery } from '@tanstack/react-query';
import { getCompetitions } from '../api/competitions';

export const useCompetitions = () => {
  return useQuery({
    queryKey: ['competitions'],
    queryFn: getCompetitions,
    staleTime: 5 * 60 * 1000, // данные считаются свежими 5 минут
  });
};