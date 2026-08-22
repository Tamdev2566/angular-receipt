import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgApexchartsModule } from 'ng-apexcharts';
import { forkJoin } from 'rxjs';
import { DashboardService } from './service/dashboard-service';
import { DashboardModel } from './model/dashboard-model/dashboard-model';
import { ModuleService } from '../../services/module-service/module-service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, DatePipe, DashboardModel],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class DashboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private dashboardService = inject(DashboardService);
  private stateService = inject(ModuleService);

  isLoading = signal<boolean>(true);
  // currentFilter = signal<'today' | 'monthly' | 'yearly'>('today');

  summaryData = signal<any>(null);
  kpiData = signal<any>(null);
  recentReceipts = signal<any[]>([]);

  toastMessage: string | null = null;

  summaryCards = computed(() => {
    const summary = this.summaryData();
    if (!summary) return [];

    return [
      {
        title: 'Total Receipts',
        count: summary.totalReceipts || 0,
        icon: 'bi-receipt-cutoff',
        percentage: 12,
        trend: 'up',
        colorClass: 'kpi-card-1',
      },
      {
        title: 'Posted to CODA',
        count: summary.postedToCodaCount || 0,
        icon: 'bi-receipt',
        percentage: 12,
        trend: 'up',
        colorClass: 'kpi-card-4',
      },
      {
        title: 'Undo Receipts',
        count: summary.undoCount || 0,
        icon: 'bi-arrow-counterclockwise',
        percentage: 2.5,
        trend: 'down',
        colorClass: 'kpi-card-2',
      },
      {
        title: 'Removed Invoices',
        count: summary.removedInvoiceCount || 0,
        icon: 'bi-file-earmark-x',
        percentage: 5,
        trend: 'down',
        colorClass: 'kpi-card-3',
      },
    ];
  });

  kpiCards = computed(() => {
    const kpi = this.kpiData();
    if (!kpi) return [];

    return [
      {
        title: 'Total Outstanding',
        value: kpi.totalOutstanding || '0',
        icon: 'bi-cash-stack',
        subtext: 'Pending customer dues',
        isCurrency: true,
      },
      {
        title: 'Aging Cheques',
        value: kpi.agingCheques || 0,
        icon: 'bi-clock-history',
        subtext: 'Over 30 days pending',
        isCurrency: false,
      },
      {
        title: 'Daily Scans',
        value: kpi.dailyScans || 0,
        icon: 'bi-upc-scan',
        subtext: 'Cheque reader scans',
        isCurrency: false,
      },
    ];
  });

  receiptSummaryBarChart: any;
  receiptStatusChart: any;
  revenueChart: any;

  isModalOpen = signal<boolean>(false);
  gridData: any[] = [];
  totalPages = 1;
  currentPage = 1;

  ngOnInit() {
    this.initCharts();
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    forkJoin({
      summary: this.dashboardService.getReceiptSummary(),
      kpis: this.dashboardService.getKPIs(),
      receipts: this.dashboardService.getRecentReceipts(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          if (res.summary?.success) {
            this.summaryData.set(res.summary);
            this.updateBarChart(res.summary);
            this.updateDonutChart(res.summary);
          }

          this.kpiData.set(res.kpis);
          this.recentReceipts.set(res.receipts);
          this.gridData = res.receipts;
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching dashboard data', err);
          this.isLoading.set(false);
        },
      });
  }

  // setFilter(filter: 'today' | 'monthly' | 'yearly') {
  //   this.currentFilter.set(filter);
  // }

  private updateBarChart(summary: any) {
    const total = summary.totalReceipts || 0;
    const undo = summary.undoCount || 0;
    const removed = summary.removedInvoiceCount || 0;
    const coda = summary.postedToCodaCount || 0;

    this.receiptSummaryBarChart = {
      ...this.receiptSummaryBarChart,
      series: [
        {
          name: 'Count',
          data: [total, coda, undo, removed],
        },
      ],
    };
  }

  private updateDonutChart(summary: any) {
    const active = (summary.totalReceipts || 0) - (summary.undoCount || 0);
    const undo = summary.undoCount || 0;
    const removed = summary.removedInvoiceCount || 0;
    const coda = summary.postedToCodaCount || 0;

    this.receiptStatusChart = {
      ...this.receiptStatusChart,
      series: [active, coda, undo, removed],
    };
  }

  private initCharts() {
    this.receiptSummaryBarChart = {
      series: [{ name: 'Count', data: [0, 0, 0] }],
      chart: { type: 'bar', height: 350, toolbar: { show: false }, background: 'transparent' },
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: '40%',
          borderRadius: 8,
          dataLabels: { position: 'top' },
        },
      },
      colors: ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'],
      dataLabels: { enabled: true, offsetY: -20, style: { fontSize: '12px', colors: ['#475569'] } },
      xaxis: {
        categories: ['Total Receipts', 'Posted to CODA', 'Undo Receipts', 'Removed Invoices'],
        labels: { style: { colors: '#94a3b8', fontSize: '13px', fontWeight: 600 } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: '#94a3b8' } }, forceNiceScale: true },
      legend: { show: false },
      tooltip: { theme: 'light' },
    };

    this.receiptStatusChart = {
      series: [0, 0, 0],
      chart: { type: 'donut', height: 350, background: 'transparent' },
      labels: ['Active/Paid', 'Posted to CODA', 'Undo', 'Removed Invoices'],
      colors: ['#3b82f6', '#f59e0b', '#ef4444', '#10b981'],
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
    };
  }

  triggerToast(msg: string) {
    this.toastMessage = msg;

    setTimeout(() => {
      this.toastMessage = null;
    }, 4000);
  }

  openViewAllModal() {
    this.isModalOpen.set(true);
    this.stateService.setModalState(true);
  }

  closeViewAllModal() {
    this.isModalOpen.set(false);
    this.stateService.setModalState(false);
  }

  changePage(event: any) {
    this.currentPage = event;
  }
}
