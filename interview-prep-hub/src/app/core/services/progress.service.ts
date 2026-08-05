import { Injectable, computed, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  DEFAULT_PROGRESS,
  MockSessionResult,
  Question,
  RecentActivity,
  UserNote,
  UserProgressState,
} from '../../models/interview.models';
import { StorageService } from './storage.service';
import { todayKey } from '../../utils/date.utils';

const PROGRESS_KEY = 'iph-progress';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly storage = inject(StorageService);
  private readonly snack = inject(MatSnackBar);

  readonly state = signal<UserProgressState>(this.storage.get(PROGRESS_KEY, DEFAULT_PROGRESS));

  readonly bookmarks = computed(() => this.state().bookmarks);
  readonly completed = computed(() => this.state().completed);
  readonly notes = computed(() => this.state().notes);
  readonly recentlyViewed = computed(() => this.state().recentlyViewed);
  readonly activity = computed(() => this.state().activity);
  readonly mockHistory = computed(() => this.state().mockHistory);
  readonly streakCount = computed(() => this.computeStreak(this.state().streakDays));

  isBookmarked(id: string): boolean {
    return this.state().bookmarks.includes(id);
  }

  isCompleted(id: string): boolean {
    return this.state().completed.includes(id);
  }

  toggleBookmark(question: Question): void {
    const bookmarks = new Set(this.state().bookmarks);
    if (bookmarks.has(question.id)) {
      bookmarks.delete(question.id);
      this.pushActivity('bookmarked', `Removed bookmark: ${question.title}`, question.id);
      this.snack.open('Bookmark removed', 'OK', { duration: 1800 });
    } else {
      bookmarks.add(question.id);
      this.pushActivity('bookmarked', `Bookmarked: ${question.title}`, question.id);
      this.snack.open('Bookmarked', 'OK', { duration: 1800 });
    }
    this.patch({ bookmarks: [...bookmarks] });
  }

  toggleCompleted(question: Question): void {
    const completed = new Set(this.state().completed);
    if (completed.has(question.id)) {
      completed.delete(question.id);
      this.pushActivity('completed', `Marked incomplete: ${question.title}`, question.id);
    } else {
      completed.add(question.id);
      this.recordStudyDay();
      this.pushActivity('completed', `Completed: ${question.title}`, question.id);
      this.snack.open('Marked complete', 'OK', { duration: 1800 });
    }
    this.patch({ completed: [...completed] });
  }

  saveNote(questionId: string, content: string, title?: string): void {
    const notes = this.state().notes.filter((n) => n.questionId !== questionId);
    if (content.trim()) {
      notes.push({ questionId, content, updatedAt: new Date().toISOString() });
      this.pushActivity('note', `Updated notes${title ? `: ${title}` : ''}`, questionId);
    }
    this.patch({ notes });
  }

  getNote(questionId: string): UserNote | undefined {
    return this.state().notes.find((n) => n.questionId === questionId);
  }

  trackView(question: Question): void {
    const recentlyViewed = [
      question.id,
      ...this.state().recentlyViewed.filter((id) => id !== question.id),
    ].slice(0, 12);
    this.pushActivity('viewed', `Viewed: ${question.title}`, question.id);
    this.patch({ recentlyViewed });
  }

  recordMock(result: MockSessionResult): void {
    this.recordStudyDay();
    this.pushActivity('mock', `Finished mock interview (${result.score}% score)`);
    this.patch({ mockHistory: [result, ...this.state().mockHistory].slice(0, 30) });
  }

  ensureDailyQuestion(allIds: string[]): string | null {
    if (!allIds.length) {
      return null;
    }
    const today = todayKey();
    const current = this.state();
    if (current.lastDailyQuestionDate === today && current.lastDailyQuestionId) {
      return current.lastDailyQuestionId;
    }
    const seed = today.split('-').join('');
    const index = Number(seed) % allIds.length;
    const id = allIds[index];
    this.patch({ lastDailyQuestionId: id, lastDailyQuestionDate: today });
    return id;
  }

  resetProgress(): void {
    this.state.set({ ...DEFAULT_PROGRESS });
    this.storage.set(PROGRESS_KEY, DEFAULT_PROGRESS);
    this.snack.open('Progress reset', 'OK', { duration: 2000 });
  }

  replaceState(next: UserProgressState): void {
    this.state.set(next);
    this.storage.set(PROGRESS_KEY, next);
  }

  private recordStudyDay(): void {
    const today = todayKey();
    const streakDays = this.state().streakDays.includes(today)
      ? this.state().streakDays
      : [...this.state().streakDays, today].sort();
    this.patch({ streakDays });
  }

  private computeStreak(days: string[]): number {
    if (!days.length) {
      return 0;
    }
    const set = new Set(days);
    let streak = 0;
    const cursor = new Date();
    for (;;) {
      const local = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
      if (!set.has(local)) {
        break;
      }
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  private pushActivity(
    type: RecentActivity['type'],
    label: string,
    questionId?: string,
  ): void {
    const entry: RecentActivity = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      label,
      questionId,
      at: new Date().toISOString(),
    };
    this.patch({ activity: [entry, ...this.state().activity].slice(0, 40) });
  }

  private patch(partial: Partial<UserProgressState>): void {
    const next = { ...this.state(), ...partial };
    this.state.set(next);
    this.storage.set(PROGRESS_KEY, next);
  }
}
