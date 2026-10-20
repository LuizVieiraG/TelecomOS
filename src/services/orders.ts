import { api } from '@/lib/api';
import type { ServiceOrder } from '@/types';

export type NewOrderInput = Omit<ServiceOrder, 'id' | 'status'>;

const path = (id: string) => `/orders/${encodeURIComponent(id)}`;

// GET /orders
export const listOrders = () => api.get<ServiceOrder[]>('/orders');

// GET /orders/:id
export const getOrder = (id: string) => api.get<ServiceOrder>(path(id));

// POST /orders
export const createOrder = (input: NewOrderInput) => api.post<ServiceOrder>('/orders', input);

// PATCH /orders/:id
export const updateOrderStatus = (id: string, status: ServiceOrder['status']) =>
  api.patch<ServiceOrder>(path(id), { status });

// DELETE /orders/:id
export const deleteOrder = (id: string) => api.delete<void>(path(id));
