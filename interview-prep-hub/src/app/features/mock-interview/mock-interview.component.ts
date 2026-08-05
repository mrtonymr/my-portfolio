import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  CATEGORIES,
  Category,
  DIFFICULTIES,
  Difficulty,
} from '../../models/interview.models';
import {
  MockConfig,
  MockInterviewService,
  SelfRating,
} from '../../core/services/mock-interview.service';
import { QuestionService } from '../../core/services/question.service';

@Component({
  selector: 'app-mock-interview',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressBarModule,
  ],
  templateUrl: './mock-interview.component.html',
  styleUrl: './mock-interview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockInterviewComponent {
  readonly mock = inject(MockInterviewService);
  private readonly questions = inject(QuestionService);

  readonly categories = CATEGORIES;
  readonly difficulties = DIFFICULTIES;
  readonly counts = [5, 10, 15] as const;
  readonly secondsOptions = [60, 90, 120] as const;

  readonly category = signal<Category | 'All'>('All');
  readonly difficulty = signal<Difficulty | 'All'>('All');
  readonly count = signal(5);
  readonly randomize = signal(true);
  readonly seconds = signal(90);

  readonly ratingEntries = computed(() => {
    const report = this.mock.report();
    if (!report) return [] as { id: string; title: string; rating: SelfRating }[];
    return Object.entries(report.ratings).map(([id, rating]) => ({
      id,
      title: this.questions.byId(id)?.title ?? id,
      rating,
    }));
  });

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.mock.active()) {
          this.mock.tick();
        }
      });
  }

  start(): void {
    const config: MockConfig = {
      category: this.category(),
      difficulty: this.difficulty(),
      count: this.count(),
      randomize: this.randomize(),
      secondsPerQuestion: this.seconds(),
    };
    this.mock.start(config);
  }

  reveal(): void {
    this.mock.reveal();
  }

  rate(rating: SelfRating): void {
    this.mock.rate(rating);
  }

  next(): void {
    this.mock.next();
  }

  finishEarly(): void {
    this.mock.finish();
  }

  reset(): void {
    this.mock.reset();
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  ratingLabel(r: SelfRating): string {
    if (r === 'knew') return 'Knew it';
    if (r === 'partial') return 'Partial';
    return 'Unknown';
  }
}
