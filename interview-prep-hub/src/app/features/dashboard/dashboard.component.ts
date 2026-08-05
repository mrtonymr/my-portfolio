import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuestionService } from '../../core/services/question.service';
import { ProgressService } from '../../core/services/progress.service';
import { StatisticsService } from '../../core/services/statistics.service';
import { ChartComponent } from '../../shared/components/chart.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    DatePipe,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    ChartComponent,
    EmptyStateComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  readonly questions = inject(QuestionService);
  readonly progress = inject(ProgressService);
  readonly stats = inject(StatisticsService);

  readonly total = computed(() => this.questions.questions().length);
  readonly completed = computed(() => this.progress.completed().length);
  readonly bookmarked = computed(() => this.progress.bookmarks().length);
  readonly streak = computed(() => this.progress.streakCount());

  readonly dailyQuestion = computed(() => {
    const id = this.progress.state().lastDailyQuestionId;
    return id ? this.questions.byId(id) : undefined;
  });

  constructor() {
    effect(() => {
      const ids = this.questions.questions().map((q) => q.id);
      if (ids.length) {
        this.progress.ensureDailyQuestion(ids);
      }
    });
  }

  readonly recentActivity = computed(() => this.progress.activity().slice(0, 8));
  readonly categoryProgress = computed(() => this.stats.byCategory());

  readonly weeklyChart = computed<ChartConfiguration>(() => {
    const weekly = this.stats.weeklyActivity();
    return {
      type: 'line',
      data: {
        labels: weekly.map((d) => d.label),
        datasets: [
          {
            label: 'Activity',
            data: weekly.map((d) => d.count),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.18)',
            fill: true,
            tension: 0.35,
          },
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    };
  });

  readonly difficultyChart = computed<ChartConfiguration>(() => {
    const dist = this.stats.difficultyDistribution();
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
}
