import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  input,
  viewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  template: `
    <div class="chart-frame">
      <canvas #canvas aria-label="Chart"></canvas>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 260px;
      max-height: 260px;
      overflow: hidden;
      contain: layout size;
    }

    .chart-frame {
      position: relative;
      width: 100%;
      height: 260px;
      max-height: 260px;
    }

    canvas {
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements AfterViewInit, OnDestroy {
  readonly type = input<ChartType>('bar');
  readonly config = input.required<ChartConfiguration>();

  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart | null = null;
  private ready = false;
  private lastSignature = '';

  constructor() {
    effect(() => {
      const cfg = this.config();
      const type = this.type();
      if (!this.ready) {
        return;
      }
      this.render(type, cfg);
    });
  }

  ngAfterViewInit(): void {
    this.ready = true;
    this.render(this.type(), this.config());
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }

  private render(type: ChartType, config: ChartConfiguration): void {
    const signature = JSON.stringify({
      type,
      labels: config.data?.labels ?? [],
      datasets: (config.data?.datasets ?? []).map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor,
        borderColor: dataset.borderColor,
      })),
    });

    if (signature === this.lastSignature && this.chart) {
      return;
    }
    this.lastSignature = signature;

    const ctx = this.canvas().nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    this.chart?.destroy();
    this.chart = new Chart(ctx, {
      ...config,
      type,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        resizeDelay: 100,
        plugins: {
          legend: { display: true, position: 'bottom' },
        },
        ...config.options,
      },
    });
  }
}
