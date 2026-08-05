import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { QuestionService } from '../../core/services/question.service';
import { ProgressService } from '../../core/services/progress.service';
import { StatisticsService } from '../../core/services/statistics.service';
import { ChartComponent } from '../../shared/components/chart.component';

@Component({
  selector: 'app-statistics',
  imports: [MatIconModule, ChartComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsComponent {
  readonly questions = inject(QuestionService);
  readonly progress = inject(ProgressService);
  readonly stats = inject(StatisticsService);

  readonly completion = computed(() => this.stats.completionPercent());
  readonly bookmarks = computed(() => this.progress.bookmarks().length);
  readonly streak = computed(() => this.progress.streakCount());
  readonly completedCount = computed(() => this.progress.completed().length);
  readonly total = computed(() => this.questions.questions().length);

  readonly categoryBar = computed<ChartConfiguration>(() => {
    const cats = this.stats.byCategory();
    return {
      type: 'bar',
      data: {
        labels: cats.map((c) => c.label),
        datasets: [
          {
            label: 'Completed %',
            data: cats.map((c) => c.percent),
            backgroundColor: 'rgba(37, 99, 235, 0.7)',
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: 100 },
        },
      },
    };
  });

  readonly difficultyPie = computed<ChartConfiguration>(() => {
    const dist = this.stats.completedDifficulty();
    return {
      type: 'pie',
      data: {
        labels: dist.map((d) => d.label),
        datasets: [
          {
            data: dist.map((d) => d.count),
            backgroundColor: ['#059669', '#d97706', '#dc2626'],
          },
        ],
      },
    };
  });

  readonly weeklyLine = computed<ChartConfiguration>(() => {
    const weekly = this.stats.weeklyActivity();
    return {
      type: 'line',
      data: {
        labels: weekly.map((d) => d.label),
        datasets: [
          {
            label: 'Actions',
            data: weekly.map((d) => d.count),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.15)',
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    };
  });

  readonly categoryRadar = computed<ChartConfiguration>(() => {
    const cats = this.stats.byCategory();
    return {
      type: 'radar',
      data: {
        labels: cats.map((c) => c.label),
        datasets: [
          {
            label: 'Completion %',
            data: cats.map((c) => c.percent),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.2)',
          },
        ],
      },
      options: {
        scales: {
          r: { beginAtZero: true, max: 100 },
        },
      },
    };
  });
}
