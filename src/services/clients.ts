import { api } from '@/lib/api';
import type { ClientItem } from '@/types';

export interface NewClientInput {
  name: string;
  cpf?: string;
  plan: string;
  address: string;
}

export type ClientPatch = Partial<NewClientInput & Pick<ClientItem, 'status'>>;

const path = (id: string) => `/clients/${encodeURIComponent(id)}`;

// GET /clients
export const listClients = () => api.get<ClientItem[]>('/clients');

// GET /clients/:id
export const getClient = (id: string) => api.get<ClientItem>(path(id));

// POST /clients
export const createClient = (input: NewClientInput) => api.post<ClientItem>('/clients', input);

// PATCH /clients/:id
export const updateClient = (id: string, patch: ClientPatch) =>
  api.patch<ClientItem>(path(id), patch);

// DELETE /clients/:id
export const deleteClient = (id: string) => api.delete<void>(path(id));
