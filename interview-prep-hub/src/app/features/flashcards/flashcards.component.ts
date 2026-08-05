import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  CATEGORIES,
  Category,
  DIFFICULTIES,
  Difficulty,
  Question,
} from '../../models/interview.models';
import { QuestionService } from '../../core/services/question.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-flashcards',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressBarModule,
    EmptyStateComponent,
  ],
  templateUrl: './flashcards.component.html',
  styleUrl: './flashcards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashcardsComponent {
  readonly questions = inject(QuestionService);

  readonly categories = CATEGORIES;
  readonly difficulties = DIFFICULTIES;

  readonly category = signal<Category | 'All'>('All');
  readonly difficulty = signal<Difficulty | 'All'>('All');
  readonly index = signal(0);
  readonly flipped = signal(false);
  readonly order = signal<string[]>([]);

  readonly deck = computed(() => {
    let pool = this.questions.questions();
    const cat = this.category();
    const diff = this.difficulty();
    if (cat !== 'All') pool = pool.filter((q) => q.category === cat);
    if (diff !== 'All') pool = pool.filter((q) => q.difficulty === diff);

    const order = this.order();
    if (!order.length) return pool;
    const map = new Map(pool.map((q) => [q.id, q]));
    const ordered = order.map((id) => map.get(id)).filter((q): q is Question => !!q);
    const remaining = pool.filter((q) => !order.includes(q.id));
    return [...ordered, ...remaining];
  });

  readonly current = computed(() => this.deck()[this.index()] ?? null);
  readonly progressPct = computed(() => {
    const total = this.deck().length;
    if (!total) return 0;
    return Math.round(((this.index() + 1) / total) * 100);
  });

  @HostListener('window:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
      return;
    }
    if (event.code === 'Space') {
      event.preventDefault();
      this.flip();
    } else if (event.code === 'ArrowRight') {
      event.preventDefault();
      this.next();
    } else if (event.code === 'ArrowLeft') {
      event.preventDefault();
      this.prev();
    }
  }

  flip(): void {
    if (this.current()) this.flipped.update((v) => !v);
  }

  next(): void {
    const total = this.deck().length;
    if (!total) return;
    this.index.update((i) => (i + 1) % total);
    this.flipped.set(false);
  }

  prev(): void {
    const total = this.deck().length;
    if (!total) return;
    this.index.update((i) => (i - 1 + total) % total);
    this.flipped.set(false);
  }

  shuffle(): void {
    const ids = this.deck().map((q) => q.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    this.order.set(ids);
    this.index.set(0);
    this.flipped.set(false);
  }

  onFilterChange(): void {
    this.index.set(0);
    this.flipped.set(false);
    this.order.set([]);
  }
}
