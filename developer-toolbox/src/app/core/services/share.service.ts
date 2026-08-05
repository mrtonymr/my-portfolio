import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardService } from './clipboard.service';

@Injectable({ providedIn: 'root' })
export class ShareService {
  private readonly clipboard = inject(ClipboardService);
  private readonly snackBar = inject(MatSnackBar);

  async shareCurrentUrl(message = 'Share link copied'): Promise<void> {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Developer Toolbox', url });
        return;
      } catch {
        // Fall through to clipboard copy when share is cancelled/unavailable.
      }
    }
    await this.clipboard.copy(url, message);
  }

  notify(message: string): void {
    this.snackBar.open(message, 'Dismiss', { duration: 2200 });
  }
}
