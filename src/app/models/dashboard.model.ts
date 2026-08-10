export interface KpiStat {
  title: string;
  count: number | string;
  trend: 'up' | 'down' | 'neutral';
  percentage: number;
  icon: string;
}

export interface ReceiptActivity {
  id: string;
  customerName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Removed';
  createdBy: string;
  createdDate: Date;
  paymentDate?: Date;
}

export interface UserSession {
  userId: string;
  userName: string;
  loginTime: Date;
  logoutTime?: Date;
  sessionDuration: string;
  ipAddress: string;
  deviceType: string;
  browser: string;
  status: 'Online' | 'Offline';
}

export interface DashboardData {
  kpis: Record<string, any[]>;
  recentReceipts: any[];
  userSessions: any[];
  trends?: Record<string, { data: number[]; labels: string[] }>;
  statusDistribution?: number[];
}
