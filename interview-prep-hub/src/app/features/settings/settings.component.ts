import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  AppSettings,
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
  UserProgressState,
} from '../../models/interview.models';
import { ThemeService } from '../../core/services/theme.service';
import { ProgressService } from '../../core/services/progress.service';
import { StorageService } from '../../core/services/storage.service';
import { GroqService } from '../../core/services/groq.service';
import { QuestionService } from '../../core/services/question.service';

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  readonly theme = inject(ThemeService);
  readonly progress = inject(ProgressService);
  readonly groq = inject(GroqService);
  readonly questions = inject(QuestionService);
  private readonly storage = inject(StorageService);
  private readonly snack = inject(MatSnackBar);

  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  readonly keyDraft = signal(this.groq.apiKey());
  readonly showKey = signal(false);
  readonly testing = signal(false);

  onDarkMode(enabled: boolean): void {
    this.theme.setDarkMode(enabled);
  }

  onAnimations(enabled: boolean): void {
    this.theme.setAnimations(enabled);
  }

  saveApiKey(): void {
    this.groq.setApiKey(this.keyDraft());
    this.snack.open(
      this.groq.hasApiKey() ? 'Groq API key saved locally' : 'Groq API key cleared',
      'OK',
      { duration: 2000 },
    );
  }

  clearApiKey(): void {
    this.keyDraft.set('');
    this.groq.clearApiKey();
    this.snack.open('Groq API key removed', 'OK', { duration: 1800 });
  }

  async testApiKey(): Promise<void> {
    this.groq.setApiKey(this.keyDraft());
    this.testing.set(true);
    try {
      const message = await this.groq.testConnection();
      this.snack.open(message, 'OK', { duration: 2500 });
    } catch (err) {
      this.snack.open(err instanceof Error ? err.message : 'Connection failed', 'OK', {
        duration: 3500,
      });
    } finally {
      this.testing.set(false);
    }
  }

  clearAiQuestions(): void {
    const ok = window.confirm(
      `Remove ${this.questions.aiCount()} Groq-generated questions from this browser?`,
    );
    if (!ok) return;
    this.questions.clearAiQuestions();
    this.snack.open('AI questions cleared', 'OK', { duration: 1800 });
  }

  resetProgress(): void {
    const ok = window.confirm(
      'Reset all progress? Bookmarks, completion, notes, and mock history will be cleared.',
    );
    if (ok) {
      this.progress.resetProgress();
    }
  }

  exportData(): void {
    const json = this.storage.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-prep-hub-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.snack.open('Export downloaded', 'OK', { duration: 1800 });
  }

  triggerImport(): void {
    this.fileInput()?.nativeElement.click();
  }

  async onImportFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      this.storage.importAll(text);
      const progress = this.storage.get<UserProgressState>('iph-progress', DEFAULT_PROGRESS);
      this.progress.replaceState(progress);
      const settings = this.storage.get<AppSettings>('iph-settings', DEFAULT_SETTINGS);
      this.theme.replaceSettings(settings);
      const key = this.storage.get<string>('iph-groq-api-key', '');
      this.groq.setApiKey(key);
      this.keyDraft.set(key);
      const ai = this.storage.get<import('../../models/interview.models').Question[]>(
        'iph-ai-questions',
        [],
      );
      this.questions.clearAiQuestions();
      if (ai.length) {
        this.questions.addAiQuestions(ai);
      }
      this.snack.open('Data imported', 'OK', { duration: 2000 });
    } catch {
      this.snack.open('Import failed — invalid JSON', 'OK', { duration: 2500 });
    } finally {
      input.value = '';
    }
  }
}
