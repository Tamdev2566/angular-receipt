import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardData } from '../../models/dashboard.model';
import { DashboardService } from './service/dashboard-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, DatePipe, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  // Signals
  isLoading = signal<boolean>(true);
  currentFilter = signal<'today' | 'monthly' | 'yearly'>('today');
  dashboardData = signal<DashboardData | null>(null);

  // Computed Values
  activeKpis = computed(() => {
    const data = this.dashboardData();
    if (!data) return [];
    return data.kpis[this.currentFilter()];
  });

  // Chart Configurations
  receiptTrendChart: any;
  receiptStatusChart: any;
  revenueChart: any;

  ngOnInit() {
    this.initCharts();
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.dashboardService.getDashboardData().subscribe((data) => {
      this.dashboardData.set(data);
      this.isLoading.set(false);
    });
  }

  setFilter(filter: 'today' | 'monthly' | 'yearly') {
    this.currentFilter.set(filter);
  }

  private initCharts() {
    // Shared Colors from Requirements
    const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

    this.receiptTrendChart = {
      series: [{ name: 'Receipts', data: [31, 40, 28, 51, 42, 109, 100] }],
      chart: { type: 'area', height: 350, toolbar: { show: false }, background: 'transparent' },
      colors: ['#3b82f6'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: { style: { colors: '#94a3b8' } },
      },
      yaxis: { labels: { style: { colors: '#94a3b8' } } },
      theme: { mode: 'dark' },
    };

    this.receiptStatusChart = {
      series: [65, 25, 10], // Paid, Pending, Removed
      chart: { type: 'donut', height: 350, background: 'transparent' },
      labels: ['Paid', 'Pending', 'Removed'],
      colors: ['#10b981', '#f59e0b', '#ef4444'],
      theme: { mode: 'dark' },
      plotOptions: { pie: { donut: { size: '70%' } } },
    };

    this.revenueChart = {
      series: [{ name: 'Revenue', data: [15000, 25000, 18000, 32000, 28000, 45000] }],
      chart: { type: 'bar', height: 350, toolbar: { show: false }, background: 'transparent' },
      colors: ['#10b981'],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        labels: { style: { colors: '#94a3b8' } },
      },
      theme: { mode: 'dark' },
    };
  }
}
