import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QuestionService } from '../../core/services/question.service';
import { ProgressService } from '../../core/services/progress.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-question-detail',
  imports: [
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
    EmptyStateComponent,
  ],
  templateUrl: './question-detail.component.html',
  styleUrl: './question-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly snack = inject(MatSnackBar);
  readonly questions = inject(QuestionService);
  readonly progress = inject(ProgressService);

  private readonly id = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );

  readonly question = computed(() => {
    const id = this.id();
    return id ? this.questions.byId(id) : undefined;
  });

  readonly related = computed(() => {
    const q = this.question();
    return q ? this.questions.related(q) : [];
  });

  readonly bookmarked = computed(() => {
    const q = this.question();
    return q ? this.progress.isBookmarked(q.id) : false;
  });

  readonly completed = computed(() => {
    const q = this.question();
    return q ? this.progress.isCompleted(q.id) : false;
  });

  readonly noteDraft = signal('');
  private noteTimer: ReturnType<typeof setTimeout> | null = null;
  private trackedId: string | null = null;
  private skippingNoteEffect = false;

  constructor() {
    effect(() => {
      const q = this.question();
      if (!q) return;
      if (this.trackedId !== q.id) {
        this.trackedId = q.id;
        this.progress.trackView(q);
        this.skippingNoteEffect = true;
        this.noteDraft.set(this.progress.getNote(q.id)?.content ?? '');
        queueMicrotask(() => {
          this.skippingNoteEffect = false;
        });
      }
    });

    effect(() => {
      const content = this.noteDraft();
      const q = this.question();
      if (!q || this.skippingNoteEffect) return;
      if (this.noteTimer) clearTimeout(this.noteTimer);
      this.noteTimer = setTimeout(() => {
        const existing = this.progress.getNote(q.id)?.content ?? '';
        if (content !== existing) {
          this.progress.saveNote(q.id, content, q.title);
        }
      }, 400);
    });

    this.destroyRef.onDestroy(() => {
      if (this.noteTimer) clearTimeout(this.noteTimer);
    });
  }

  toggleBookmark(): void {
    const q = this.question();
    if (q) this.progress.toggleBookmark(q);
  }

  toggleCompleted(): void {
    const q = this.question();
    if (q) this.progress.toggleCompleted(q);
  }

  async copyAnswer(): Promise<void> {
    const q = this.question();
    if (!q) return;
    try {
      await navigator.clipboard.writeText(q.answer);
      this.snack.open('Answer copied', 'OK', { duration: 1800 });
    } catch {
      this.snack.open('Could not copy', 'OK', { duration: 1800 });
    }
  }

  async share(): Promise<void> {
    const q = this.question();
    if (!q) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: q.title, text: q.question, url });
      } else {
        await navigator.clipboard.writeText(url);
        this.snack.open('Link copied', 'OK', { duration: 1800 });
      }
    } catch {
      // user cancelled share
    }
  }
}
