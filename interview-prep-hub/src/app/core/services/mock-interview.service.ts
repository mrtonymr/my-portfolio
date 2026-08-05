import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Category,
  Difficulty,
  MockSessionResult,
  Question,
} from '../../models/interview.models';
import { ProgressService } from './progress.service';
import { QuestionService } from './question.service';

export type SelfRating = 'knew' | 'partial' | 'unknown';

export interface MockConfig {
  category: Category | 'All';
  difficulty: Difficulty | 'All';
  count: number;
  randomize: boolean;
  secondsPerQuestion: number;
}

@Injectable({ providedIn: 'root' })
export class MockInterviewService {
  private readonly questions = inject(QuestionService);
  private readonly progress = inject(ProgressService);

  readonly active = signal(false);
  readonly config = signal<MockConfig | null>(null);
  readonly queue = signal<Question[]>([]);
  readonly index = signal(0);
  readonly ratings = signal<Record<string, SelfRating>>({});
  readonly revealed = signal(false);
  readonly startedAt = signal<string | null>(null);
  readonly remainingSeconds = signal(0);
  readonly report = signal<MockSessionResult | null>(null);

  readonly current = computed(() => this.queue()[this.index()] ?? null);
  readonly total = computed(() => this.queue().length);
  readonly progressPercent = computed(() => {
    const total = this.total();
    if (!total) return 0;
    return Math.round(((this.index() + (this.ratings()[this.current()?.id ?? ''] ? 1 : 0)) / total) * 100);
  });

  start(config: MockConfig): void {
    let pool = this.questions.questions();
    if (config.category !== 'All') {
      pool = pool.filter((q) => q.category === config.category);
    }
    if (config.difficulty !== 'All') {
      pool = pool.filter((q) => q.difficulty === config.difficulty);
    }
    if (config.randomize) {
      pool = [...pool].sort(() => Math.random() - 0.5);
    }
    const selected = pool.slice(0, Math.max(1, Math.min(config.count, pool.length)));
    this.config.set(config);
    this.queue.set(selected);
    this.index.set(0);
    this.ratings.set({});
    this.revealed.set(false);
    this.report.set(null);
    this.startedAt.set(new Date().toISOString());
    this.remainingSeconds.set(config.secondsPerQuestion);
    this.active.set(true);
  }

  reveal(): void {
    this.revealed.set(true);
  }

  rate(rating: SelfRating): void {
    const current = this.current();
    if (!current) return;
    this.ratings.update((r) => ({ ...r, [current.id]: rating }));
  }

  next(): void {
    if (this.index() >= this.total() - 1) {
      this.finish();
      return;
    }
    this.index.update((i) => i + 1);
    this.revealed.set(false);
    this.remainingSeconds.set(this.config()?.secondsPerQuestion ?? 120);
  }

  tick(): void {
    if (!this.active() || this.remainingSeconds() <= 0) return;
    this.remainingSeconds.update((s) => s - 1);
  }

  finish(): void {
    const ratings = this.ratings();
    const total = this.total() || 1;
    let score = 0;
    Object.values(ratings).forEach((r) => {
      if (r === 'knew') score += 1;
      if (r === 'partial') score += 0.5;
    });
    const result: MockSessionResult = {
      id: `mock-${Date.now()}`,
      startedAt: this.startedAt() ?? new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      category: this.config()?.category ?? 'All',
      difficulty: this.config()?.difficulty ?? 'All',
      questionCount: this.total(),
      ratings,
      score: Math.round((score / total) * 100),
    };
    this.report.set(result);
    this.progress.recordMock(result);
    this.active.set(false);
  }

  reset(): void {
    this.active.set(false);
    this.config.set(null);
    this.queue.set([]);
    this.index.set(0);
    this.ratings.set({});
    this.revealed.set(false);
    this.startedAt.set(null);
    this.remainingSeconds.set(0);
    this.report.set(null);
  }
}
