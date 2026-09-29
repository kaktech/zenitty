import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useStats = () => useQuery({ queryKey: ['stats'], queryFn: api.stats });
export const useCategoryCounts = () => useQuery({ queryKey: ['counts'], queryFn: api.categoryCounts });
