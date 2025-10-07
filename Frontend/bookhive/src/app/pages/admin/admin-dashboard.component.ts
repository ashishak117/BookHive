import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';
import { AdminService } from '../../core/services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [RouterLink, CommonModule],
  template: `
<h3>Admin Dashboard</h3>
<div class="row g-3">
  <div class="col-md-3">
    <div class="card p-3 shadow-sm">
      <div class="small text-muted">Users</div>
      <div class="fs-4 fw-bold">{{ admin.stats().usersCount }}</div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card p-3 shadow-sm">
      <div class="small text-muted">Books (stock)</div>
      <div class="fs-4 fw-bold">{{ admin.stats().totalBooks }}</div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card p-3 shadow-sm">
      <div class="small text-muted">Revenue (Buy)</div>
      <div class="fs-4 fw-bold">₹{{ admin.stats().totalSales }}</div>
    </div>
  </div>
  <div class="col-md-3">
    <div class="card p-3 shadow-sm">
      <div class="small text-muted">Revenue (Borrow)</div>
      <div class="fs-4 fw-bold">₹{{ admin.stats().totalBorrow }}</div>
    </div>
  </div>
</div>

<div class="row mt-3 g-3">
  <div class="col-lg-6">
    <div class="card p-3 shadow-sm">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0">Revenue Split (Bar)</h6>
        <button class="btn btn-sm btn-outline-secondary" (click)="refresh()">Refresh</button>
      </div>
      <div class="chart-wrap"><canvas #barChart></canvas></div>
    </div>
  </div>
  <div class="col-lg-6">
    <div class="card p-3 shadow-sm">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0">Revenue Over Time (Line)</h6>
        <button class="btn btn-sm btn-outline-secondary" (click)="refresh()">Refresh</button>
      </div>
      <div class="chart-wrap"><canvas #lineChart></canvas></div>
    </div>
  </div>
  <div class="col-lg-6">
    <div class="card p-3 shadow-sm">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0">Order Mix (Pie)</h6>
        <button class="btn btn-sm btn-outline-secondary" (click)="refresh()">Refresh</button>
      </div>
      <div class="chart-wrap"><canvas #pieChart></canvas></div>
    </div>
  </div>
</div>

<div class="mt-3 d-flex gap-2">
  <a routerLink="/admin/books" class="btn btn-primary">Manage Books</a>
  <a routerLink="/admin/orders" class="btn btn-outline-primary">Orders</a>
</div>
  `,
  styles: [`
    .chart-wrap { position: relative; width: 100%; height: 280px; overflow: hidden; }
    canvas { display: block; }
  `]
})
export class AdminDashboardComponent implements AfterViewInit {
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  private bar?: Chart;
  private line?: Chart;
  private pie?: Chart;

  constructor(public admin: AdminService) {}

  async ngAfterViewInit() {
    await this.admin.refresh();
    this.buildCharts();
  }

  private buildCharts() {
    const buy = this.admin.stats().totalSales;
    const borrow = this.admin.stats().totalBorrow;

    // Destroy if re-building
    this.bar?.destroy(); this.line?.destroy(); this.pie?.destroy();

    // BAR
    this.bar = new Chart(this.barChartRef.nativeElement.getContext('2d')!, {
      type: 'bar',
      data: { labels: ['Buy', 'Borrow'], datasets: [{ label: 'Revenue (₹)', data: [buy, borrow] }] },
      options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { y: { beginAtZero: true } } }
    });

    // LINE (aggregate revenue by day)
    const daily = this.admin.dailyRevenue();
    this.line = new Chart(this.lineChartRef.nativeElement.getContext('2d')!, {
      type: 'line',
      data: { labels: daily.labels, datasets: [{ label: 'Daily Revenue (₹)', data: daily.values, tension: 0.3 }] },
      options: { responsive: true, maintainAspectRatio: false, animation: false, scales: { y: { beginAtZero: true } } }
    });

    // PIE (order lines mix by type)
    const mix = this.admin.orderMix();
    this.pie = new Chart(this.pieChartRef.nativeElement.getContext('2d')!, {
      type: 'pie',
      data: { labels: ['Buy', 'Borrow'], datasets: [{ data: [mix.buy, mix.borrow] }] },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  async refresh() {
    await this.admin.refresh();
    this.buildCharts();
  }
}
