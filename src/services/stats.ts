import { api } from '@/lib/api';
import type { DashboardStats } from '@/types';

// GET /stats
export const getStats = () => api.get<DashboardStats>('/stats');
