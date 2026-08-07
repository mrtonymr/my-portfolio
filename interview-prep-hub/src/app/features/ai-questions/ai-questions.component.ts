import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  CATEGORIES,
  Category,
  DIFFICULTIES,
  Difficulty,
} from '../../models/interview.models';
import { GroqService } from '../../core/services/groq.service';
import { QuestionService } from '../../core/services/question.service';
import { QuestionCardComponent } from '../../shared/components/question-card.component';
import { ProgressService } from '../../core/services/progress.service';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';

@Component({
  selector: 'app-ai-questions',
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    QuestionCardComponent,
    EmptyStateComponent,
  ],
  templateUrl: './ai-questions.component.html',
  styleUrl: './ai-questions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiQuestionsComponent {
  readonly groq = inject(GroqService);
  readonly questions = inject(QuestionService);
  readonly progress = inject(ProgressService);
  private readonly snack = inject(MatSnackBar);

  readonly categories = CATEGORIES;
  readonly difficulties = DIFFICULTIES;
  readonly counts = [3, 5, 8, 10];

  readonly category = signal<Category | 'All'>('JavaScript');
  readonly difficulty = signal<Difficulty | 'All'>('Medium');
  readonly count = signal(5);
  readonly topic = signal('latest frontend and backend interview topics');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly generated = computed(() =>
    this.questions.questions().filter((q) => q.source === 'groq' || this.questions.isAiQuestion(q.id)),
  );

  async generate(): Promise<void> {
    if (!this.groq.hasApiKey()) {
      this.error.set('Add your Groq API key in Settings first.');
      return;
    }
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    try {
      const items = await this.groq.generateQuestions({
        category: this.category(),
        difficulty: this.difficulty(),
        count: this.count(),
        topic: this.topic(),
      });
      const added = this.questions.addGeneratedQuestions(items);
      this.snack.open(`Added ${added} AI question${added === 1 ? '' : 's'}`, 'OK', {
        duration: 2200,
      });
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to generate questions');
    } finally {
      this.loading.set(false);
    }
  }

  remove(id: string): void {
    this.questions.removeAiQuestion(id);
    this.snack.open('Removed AI question', 'OK', { duration: 1600 });
  }

  clearAll(): void {
    const ok = window.confirm('Remove all Groq-generated questions from this device?');
    if (!ok) {
      return;
    }
    this.questions.clearAiQuestions();
    this.snack.open('AI questions cleared', 'OK', { duration: 1800 });
  }
}
