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

export interface ServiceOrder {
  id: string;
  clientName: string;
  serviceType: 'Instalação Fibra' | 'Reparo de Sinal' | 'Troca de Roteador' | 'Manutenção Preventiva';
  address: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'baixa' | 'media' | 'alta';
  scheduledTime: string;
}

export interface ClientItem {
  id: string;
  name: string;
  plan: string;
  speed: string;
  status: 'active' | 'pending' | 'blocked';
  address: string;
  onuStatus: 'online' | 'offline';
}
