import { Injectable, inject } from '@angular/core';
import { ProgressService } from './progress.service';
import { QuestionService } from './question.service';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private readonly questions = inject(QuestionService);
  private readonly progress = inject(ProgressService);

  completionPercent(): number {
    const total = this.questions.questions().length;
    if (!total) return 0;
    return Math.round((this.progress.completed().length / total) * 100);
  }

  byCategory(): { label: string; total: number; completed: number; percent: number }[] {
    const completed = new Set(this.progress.completed());
    const map = new Map<string, { total: number; completed: number }>();
    for (const q of this.questions.questions()) {
      const entry = map.get(q.category) ?? { total: 0, completed: 0 };
      entry.total++;
      if (completed.has(q.id)) entry.completed++;
      map.set(q.category, entry);
    }
    return [...map.entries()]
      .map(([label, v]) => ({
        label,
        total: v.total,
        completed: v.completed,
        percent: v.total ? Math.round((v.completed / v.total) * 100) : 0,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  difficultyDistribution(): { label: string; count: number }[] {
    const map = new Map<string, number>();
    for (const q of this.questions.questions()) {
      map.set(q.difficulty, (map.get(q.difficulty) ?? 0) + 1);
    }
    return ['Easy', 'Medium', 'Hard'].map((label) => ({
      label,
      count: map.get(label) ?? 0,
    }));
  }

  completedDifficulty(): { label: string; count: number }[] {
    const completed = new Set(this.progress.completed());
    const map = new Map<string, number>([
      ['Easy', 0],
      ['Medium', 0],
      ['Hard', 0],
    ]);
    for (const q of this.questions.questions()) {
      if (completed.has(q.id)) {
        map.set(q.difficulty, (map.get(q.difficulty) ?? 0) + 1);
      }
    }
    return [...map.entries()].map(([label, count]) => ({ label, count }));
  }

  weeklyActivity(): { label: string; count: number }[] {
    const days: { label: string; count: number }[] = [];
    const activity = this.progress.activity();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const count = activity.filter((a) => a.at.slice(0, 10) === key).length;
      days.push({
        label: d.toLocaleDateString(undefined, { weekday: 'short' }),
        count,
      });
    }
    return days;
  }
}
