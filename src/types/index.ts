export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'viewer';
}

export interface SystemStatus {
  online: boolean;
  activeNodes: number;
  totalAlerts: number;
  lastUpdated: string;
}

export interface MetricCardItem {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  status: 'normal' | 'warning' | 'critical' | 'success';
}

export const SERVICE_TYPES = [
  'Instalação Fibra',
  'Reparo de Sinal',
  'Troca de Roteador',
  'Manutenção Preventiva',
] as const;

export interface ServiceOrder {
  id: string;
  clientName: string;
  serviceType: (typeof SERVICE_TYPES)[number];
  address: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'baixa' | 'media' | 'alta';
  scheduledTime: string;
}

export interface ClientItem {
  id: string;
  name: string;
  /** somente os 11 dígitos; a máscara é aplicada na exibição */
  cpf?: string;
  plan: string;
  speed: string;
  status: 'active' | 'pending' | 'blocked';
  address: string;
  onuStatus: 'online' | 'offline';
}
