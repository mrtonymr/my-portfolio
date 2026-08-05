import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  AppSettings,
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
  UserProgressState,
} from '../../models/interview.models';
import { ThemeService } from '../../core/services/theme.service';
import { ProgressService } from '../../core/services/progress.service';
import { StorageService } from '../../core/services/storage.service';

@Component({
  selector: 'app-settings',
  imports: [
    FormsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  readonly theme = inject(ThemeService);
  readonly progress = inject(ProgressService);
  private readonly storage = inject(StorageService);
  private readonly snack = inject(MatSnackBar);

  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  onDarkMode(enabled: boolean): void {
    this.theme.setDarkMode(enabled);
  }

  onAnimations(enabled: boolean): void {
    this.theme.setAnimations(enabled);
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
      this.snack.open('Data imported', 'OK', { duration: 2000 });
    } catch {
      this.snack.open('Import failed — invalid JSON', 'OK', { duration: 2500 });
    } finally {
      input.value = '';
    }
  }
}
