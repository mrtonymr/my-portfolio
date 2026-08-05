import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  private readonly snackBar = inject(MatSnackBar);

  downloadText(content: string, filename: string, mimeType = 'text/plain'): void {
    if (!content) {
      this.snackBar.open('Nothing to download', 'Dismiss', { duration: 2000 });
      return;
    }
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    this.snackBar.open('Download started', 'Dismiss', { duration: 2000 });
  }
}
