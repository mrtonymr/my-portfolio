import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Category, Difficulty, Question } from '../../models/interview.models';
import { ProgressService } from './progress.service';

export interface QuestionFilters {
  search: string;
  category: Category | 'All';
  difficulty: Difficulty | 'All';
  company: string | 'All';
  tag: string | 'All';
  status: 'All' | 'Completed' | 'Incomplete' | 'Bookmarked';
}

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly http = inject(HttpClient);
  private readonly progress = inject(ProgressService);

  readonly loaded = signal(false);
  readonly questions = signal<Question[]>([]);
  readonly error = signal<string | null>(null);

  readonly categories = computed(() => {
    const set = new Set(this.questions().map((q) => q.category));
    return [...set].sort();
  });

  readonly companies = computed(() => {
    const set = new Set(this.questions().flatMap((q) => q.company));
    return [...set].sort();
  });

  readonly tags = computed(() => {
    const set = new Set(this.questions().flatMap((q) => q.tags));
    return [...set].sort();
  });

  async load(): Promise<void> {
    if (this.loaded()) {
      return;
    }
    try {
      const data = await firstValueFrom(this.http.get<Question[]>('assets/data/questions.json'));
      this.questions.set(data);
      this.loaded.set(true);
      this.error.set(null);
    } catch {
      this.error.set('Failed to load questions');
    }
  }

  byId(id: string): Question | undefined {
    return this.questions().find((q) => q.id === id);
  }

  filter(filters: QuestionFilters): Question[] {
    const search = filters.search.trim().toLowerCase();
    return this.questions().filter((q) => {
      if (filters.category !== 'All' && q.category !== filters.category) return false;
      if (filters.difficulty !== 'All' && q.difficulty !== filters.difficulty) return false;
      if (filters.company !== 'All' && !q.company.includes(filters.company)) return false;
      if (filters.tag !== 'All' && !q.tags.includes(filters.tag)) return false;
      if (filters.status === 'Completed' && !this.progress.isCompleted(q.id)) return false;
      if (filters.status === 'Incomplete' && this.progress.isCompleted(q.id)) return false;
      if (filters.status === 'Bookmarked' && !this.progress.isBookmarked(q.id)) return false;
      if (!search) return true;
      const hay = `${q.title} ${q.question} ${q.tags.join(' ')} ${q.category}`.toLowerCase();
      return hay.includes(search);
    });
  }

  related(question: Question): Question[] {
    return question.relatedQuestions
      .map((id) => this.byId(id))
      .filter((q): q is Question => !!q);
  }
}
