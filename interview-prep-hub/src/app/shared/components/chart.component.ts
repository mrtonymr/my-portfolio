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
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables,
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  template: `<canvas #canvas aria-label="Chart"></canvas>`,
  styles: `
    :host {
      display: block;
      position: relative;
      width: 100%;
      min-height: 240px;
    }
    canvas {
      width: 100% !important;
      height: 100% !important;
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

  constructor() {
    effect(() => {
      const cfg = this.config();
      const type = this.type();
      if (!this.ready) return;
      this.render(type, cfg);
    });
  }

  ngAfterViewInit(): void {
    this.ready = true;
    this.render(this.type(), this.config());
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private render(type: ChartType, config: ChartConfiguration): void {
    this.chart?.destroy();
    const ctx = this.canvas().nativeElement.getContext('2d');
    if (!ctx) return;
    this.chart = new Chart(ctx, {
      ...config,
      type,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'bottom' } },
        ...config.options,
      },
    });
  }
}
