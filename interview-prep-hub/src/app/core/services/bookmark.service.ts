import { Injectable, computed, inject } from '@angular/core';
import { ProgressService } from './progress.service';
import { QuestionService } from './question.service';
import { Question } from '../../models/interview.models';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
  private readonly questions = inject(QuestionService);
  private readonly progress = inject(ProgressService);

  readonly items = computed(() => {
    const ids = new Set(this.progress.bookmarks());
    return this.questions.questions().filter((q) => ids.has(q.id));
  });

  list(): Question[] {
    return this.items();
  }
}
