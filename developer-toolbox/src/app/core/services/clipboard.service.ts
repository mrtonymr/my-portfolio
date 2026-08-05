import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ClipboardService {
  private readonly snackBar = inject(MatSnackBar);

  async copy(text: string, successMessage = 'Copied to clipboard'): Promise<boolean> {
    try {
      if (!text) {
        this.snackBar.open('Nothing to copy', 'Dismiss', { duration: 2000 });
        return false;
      }
      await navigator.clipboard.writeText(text);
      this.snackBar.open(successMessage, 'Dismiss', { duration: 2000 });
      return true;
    } catch {
      this.snackBar.open('Failed to copy', 'Dismiss', { duration: 2500 });
      return false;
    }
  }

  async paste(): Promise<string> {
    try {
      return await navigator.clipboard.readText();
    } catch {
      this.snackBar.open('Clipboard paste permission denied', 'Dismiss', { duration: 2500 });
      return '';
    }
  }
}
