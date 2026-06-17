import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { DashboardData } from '../../../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  getDashboardData(): Observable<DashboardData> {
    const mockData: DashboardData = {
      kpis: {
        today: [
          {
            title: 'Receipts Created',
            count: 142,
            trend: 'up',
            percentage: 12.5,
            icon: 'bi-file-earmark-plus',
          },
          {
            title: 'Paid Receipts',
            count: 98,
            trend: 'up',
            percentage: 8.2,
            icon: 'bi-check-circle',
          },
          {
            title: 'Removed Receipts',
            count: 5,
            trend: 'down',
            percentage: -2.1,
            icon: 'bi-trash',
          },
          { title: 'Active Users', count: 45, trend: 'up', percentage: 15.0, icon: 'bi-people' },
        ],
        monthly: [
          /* Similar structure for monthly */
        ],
        yearly: [
          /* Similar structure for yearly */
        ],
      },
      recentReceipts: [
        {
          id: 'REC-2026-001',
          customerName: 'Acme Corp',
          amount: 12500.0,
          status: 'Paid',
          createdBy: 'Sarah Connor',
          createdDate: new Date('2026-06-16T10:30:00'),
          paymentDate: new Date('2026-06-16T11:00:00'),
        },
        {
          id: 'REC-2026-002',
          customerName: 'Stark Industries',
          amount: 45000.5,
          status: 'Pending',
          createdBy: 'Tony S.',
          createdDate: new Date('2026-06-16T12:15:00'),
        },
        {
          id: 'REC-2026-003',
          customerName: 'Wayne Enterprises',
          amount: 8900.0,
          status: 'Removed',
          createdBy: 'Bruce W.',
          createdDate: new Date('2026-06-15T09:00:00'),
        },
      ],
      userSessions: [
        {
          userId: 'U1',
          userName: 'John Doe',
          loginTime: new Date('2026-06-16T08:00:00'),
          sessionDuration: '7h 57m',
          ipAddress: '192.168.1.105',
          deviceType: 'Desktop',
          browser: 'Chrome',
          status: 'Online',
        },
        {
          userId: 'U2',
          userName: 'Jane Smith',
          loginTime: new Date('2026-06-16T09:30:00'),
          logoutTime: new Date('2026-06-16T14:30:00'),
          sessionDuration: '5h 0m',
          ipAddress: '10.0.0.42',
          deviceType: 'Tablet',
          browser: 'Safari',
          status: 'Offline',
        },
      ],
    };

    return of(mockData).pipe(delay(600)); // Simulate network latency
  }
}
