import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Category, Difficulty, Question } from '../../models/interview.models';
import { ProgressService } from './progress.service';
import { StorageService } from './storage.service';

const AI_QUESTIONS_KEY = 'iph-ai-questions';

export interface QuestionFilters {
  search: string;
  category: Category | 'All';
  difficulty: Difficulty | 'All';
  company: string | 'All';
  tag: string | 'All';
  status: 'All' | 'Completed' | 'Incomplete' | 'Bookmarked';
  source?: 'All' | 'bundled' | 'groq';
}

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly http = inject(HttpClient);
  private readonly progress = inject(ProgressService);
  private readonly storage = inject(StorageService);

  readonly loaded = signal(false);
  readonly baseQuestions = signal<Question[]>([]);
  readonly aiQuestions = signal<Question[]>(this.storage.get<Question[]>(AI_QUESTIONS_KEY, []));
  readonly error = signal<string | null>(null);

  readonly questions = computed((): Question[] => {
    const ai: Question[] = this.aiQuestions().map((q) => ({
      ...q,
      source: q.source ?? 'groq',
    }));
    const aiIds = new Set(ai.map((q) => q.id));
    const base: Question[] = this.baseQuestions()
      .filter((q) => !aiIds.has(q.id))
      .map((q) => ({
        ...q,
        source: q.source ?? 'bundled',
      }));
    return [...ai, ...base];
  });

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

  readonly aiCount = computed(() => this.aiQuestions().length);

  async load(): Promise<void> {
    if (this.loaded()) {
      return;
    }
    try {
      const data = await firstValueFrom(this.http.get<Question[]>('assets/data/questions.json'));
      this.baseQuestions.set(data);
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
      if (filters.source && filters.source !== 'All') {
        const source = q.source ?? (this.isAiQuestion(q.id) ? 'groq' : 'bundled');
        if (source !== filters.source) return false;
      }
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

  addAiQuestions(incoming: Question[]): void {
    const tagged = incoming.map((q) => ({ ...q, source: 'groq' as const }));
    const merged = [...tagged, ...this.aiQuestions()];
    const deduped: Question[] = [];
    const seen = new Set<string>();
    for (const q of merged) {
      const key = `${q.category}::${q.title.trim().toLowerCase()}`;
      if (seen.has(key) || seen.has(q.id)) {
        continue;
      }
      seen.add(key);
      seen.add(q.id);
      deduped.push(q);
    }
    this.aiQuestions.set(deduped.slice(0, 200));
    this.persistAi();
  }

  addGeneratedQuestions(incoming: Question[]): number {
    const before = this.aiQuestions().length;
    this.addAiQuestions(incoming);
    return Math.max(0, this.aiQuestions().length - before);
  }

  removeAiQuestion(id: string): void {
    this.aiQuestions.set(this.aiQuestions().filter((q) => q.id !== id));
    this.persistAi();
  }

  updateQuestion(updated: Question): void {
    if (updated.id.startsWith('ai-')) {
      this.aiQuestions.update((list) =>
        list.map((q) => (q.id === updated.id ? updated : q)),
      );
      this.persistAi();
      return;
    }

    // Promote built-in question override into AI store so edits persist.
    const without = this.aiQuestions().filter((q) => q.id !== updated.id);
    this.aiQuestions.set([updated, ...without]);
    this.persistAi();
  }

  clearAiQuestions(): void {
    this.aiQuestions.set([]);
    this.storage.remove(AI_QUESTIONS_KEY);
  }

  isAiQuestion(id: string): boolean {
    return id.startsWith('ai-') || this.aiQuestions().some((q) => q.id === id);
  }

  private persistAi(): void {
    this.storage.set(AI_QUESTIONS_KEY, this.aiQuestions());
  }
}
