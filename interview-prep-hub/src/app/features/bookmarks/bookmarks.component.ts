import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DIFFICULTIES, Difficulty, Question } from '../../models/interview.models';
import { BookmarkService } from '../../core/services/bookmark.service';
import { ProgressService } from '../../core/services/progress.service';
import { QuestionCardComponent } from '../../shared/components/question-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

type SortKey = 'title' | 'difficulty' | 'category';

@Component({
  selector: 'app-bookmarks',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    QuestionCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookmarksComponent {
  readonly bookmarks = inject(BookmarkService);
  readonly progress = inject(ProgressService);

  readonly difficulties = DIFFICULTIES;
  readonly search = signal('');
  readonly difficulty = signal<Difficulty | 'All'>('All');
  readonly sort = signal<SortKey>('title');

  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const diff = this.difficulty();
    const sort = this.sort();
    let items = this.bookmarks.items();
    if (diff !== 'All') {
      items = items.filter((q) => q.difficulty === diff);
    }
    if (term) {
      items = items.filter((q) =>
        `${q.title} ${q.question} ${q.category} ${q.tags.join(' ')}`
          .toLowerCase()
          .includes(term),
      );
    }
    const difficultyRank: Record<Difficulty, number> = { Easy: 0, Medium: 1, Hard: 2 };
    return [...items].sort((a, b) => {
      if (sort === 'difficulty') {
        return difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
      }
      if (sort === 'category') {
        return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
      }
      return a.title.localeCompare(b.title);
    });
  });

  remove(q: Question): void {
    this.progress.toggleBookmark(q);
  }

  onComplete(q: Question): void {
    this.progress.toggleCompleted(q);
  }
}
