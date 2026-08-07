import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import {
  CATEGORIES,
  Category,
  DIFFICULTIES,
  Difficulty,
  Question,
} from '../../models/interview.models';
import { QuestionFilters, QuestionService } from '../../core/services/question.service';
import { ProgressService } from '../../core/services/progress.service';
import { QuestionCardComponent } from '../../shared/components/question-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-questions-list',
  imports: [
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    QuestionCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './questions-list.component.html',
  styleUrl: './questions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsListComponent {
  private readonly route = inject(ActivatedRoute);
  readonly questions = inject(QuestionService);
  readonly progress = inject(ProgressService);

  readonly categories = CATEGORIES;
  readonly difficulties = DIFFICULTIES;

  readonly search = signal('');
  readonly category = signal<Category | 'All'>('All');
  readonly difficulty = signal<Difficulty | 'All'>('All');
  readonly company = signal<string | 'All'>('All');
  readonly tag = signal<string | 'All'>('All');
  readonly status = signal<QuestionFilters['status']>('All');
  readonly source = signal<'All' | 'bundled' | 'groq'>('All');
  readonly viewMode = signal<'grid' | 'list'>('grid');

  private readonly queryQ = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('q') ?? '')),
    { initialValue: this.route.snapshot.queryParamMap.get('q') ?? '' },
  );

  constructor() {
    effect(() => {
      const q = this.queryQ();
      if (q !== this.search()) {
        this.search.set(q);
      }
    });
  }

  readonly filters = computed<QuestionFilters>(() => ({
    search: this.search(),
    category: this.category(),
    difficulty: this.difficulty(),
    company: this.company(),
    tag: this.tag(),
    status: this.status(),
    source: this.source(),
  }));

  readonly filtered = computed(() => this.questions.filter(this.filters()));

  onBookmark(q: Question): void {
    this.progress.toggleBookmark(q);
  }

  onComplete(q: Question): void {
    this.progress.toggleCompleted(q);
  }

  clearFilters(): void {
    this.search.set('');
    this.category.set('All');
    this.difficulty.set('All');
    this.company.set('All');
    this.tag.set('All');
    this.status.set('All');
    this.source.set('All');
  }
}
