import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { interval } from 'rxjs';
import { ToolHeaderComponent } from '../../shared/components/tool-header/tool-header.component';
import { CodePanelComponent } from '../../shared/components/code-panel/code-panel.component';
import {
  TimestampService,
  TimestampSnapshot,
} from '../../core/services/timestamp.service';
import { ClipboardService } from '../../core/services/clipboard.service';
import { DownloadService } from '../../core/services/download.service';
import { ShareService } from '../../core/services/share.service';
import { RecentToolsService } from '../../core/services/recent-tools.service';
import { toLocalDateTimeInputValue } from '../../utils/helpers';

@Component({
  selector: 'app-timestamp',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ToolHeaderComponent,
    CodePanelComponent,
  ],
  templateUrl: './timestamp.component.html',
  styleUrl: './timestamp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimestampComponent implements OnInit {
  private readonly timestampService = inject(TimestampService);
  private readonly clipboard = inject(ClipboardService);
  private readonly downloadService = inject(DownloadService);
  private readonly shareService = inject(ShareService);
  private readonly recentTools = inject(RecentToolsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly now = signal(this.timestampService.now());
  readonly snapshot = signal<TimestampSnapshot>(this.timestampService.now());
  readonly unixSeconds = signal('');
  readonly unixMillis = signal('');
  readonly iso = signal('');
  readonly localInput = signal('');
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.recentTools.track('timestamp');
    this.applySnapshot(this.timestampService.now());

    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.now.set(this.timestampService.now()));
  }

  useNow(): void {
    this.applySnapshot(this.timestampService.now());
  }

  fromSeconds(value: string): void {
    this.unixSeconds.set(value);
    const seconds = Number(value);
    if (!value.trim() || Number.isNaN(seconds)) {
      this.error.set(value.trim() ? 'Invalid Unix seconds' : null);
      return;
    }
    this.applySnapshot(this.timestampService.fromUnixSeconds(seconds));
  }

  fromMillis(value: string): void {
    this.unixMillis.set(value);
    const millis = Number(value);
    if (!value.trim() || Number.isNaN(millis)) {
      this.error.set(value.trim() ? 'Invalid Unix milliseconds' : null);
      return;
    }
    this.applySnapshot(this.timestampService.fromUnixMillis(millis));
  }

  fromIso(value: string): void {
    this.iso.set(value);
    if (!value.trim()) {
      this.error.set(null);
      return;
    }
    const result = this.timestampService.fromIso(value.trim());
    if (!result) {
      this.error.set('Invalid ISO date string');
      return;
    }
    this.applySnapshot(result);
  }

  fromLocal(value: string): void {
    this.localInput.set(value);
    if (!value) {
      this.error.set(null);
      return;
    }
    const result = this.timestampService.fromLocalInput(value);
    if (!result) {
      this.error.set('Invalid local datetime');
      return;
    }
    this.applySnapshot(result);
  }

  async copy(): Promise<void> {
    const s = this.snapshot();
    await this.clipboard.copy(
      [
        `Unix seconds: ${s.unixSeconds}`,
        `Unix millis: ${s.unixMillis}`,
        `ISO: ${s.iso}`,
        `Local: ${s.local}`,
        `UTC: ${s.utc}`,
      ].join('\n'),
    );
  }

  async paste(): Promise<void> {
    const text = (await this.clipboard.paste()).trim();
    if (!text) {
      return;
    }
    if (/^\d{13}$/.test(text)) {
      this.fromMillis(text);
    } else if (/^\d{10}$/.test(text)) {
      this.fromSeconds(text);
    } else {
      this.fromIso(text);
    }
  }

  clear(): void {
    this.unixSeconds.set('');
    this.unixMillis.set('');
    this.iso.set('');
    this.localInput.set('');
    this.error.set(null);
  }

  reset(): void {
    this.useNow();
  }

  download(): void {
    const s = this.snapshot();
    this.downloadService.downloadText(
      [
        `Unix seconds: ${s.unixSeconds}`,
        `Unix millis: ${s.unixMillis}`,
        `ISO: ${s.iso}`,
        `Local: ${s.local}`,
        `UTC: ${s.utc}`,
      ].join('\n'),
      'timestamp.txt',
    );
  }

  share(): void {
    void this.shareService.shareCurrentUrl();
  }

  private applySnapshot(snapshot: TimestampSnapshot): void {
    this.snapshot.set(snapshot);
    this.unixSeconds.set(String(snapshot.unixSeconds));
    this.unixMillis.set(String(snapshot.unixMillis));
    this.iso.set(snapshot.iso);
    this.localInput.set(toLocalDateTimeInputValue(snapshot.date));
    this.error.set(null);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'enter') {
      event.preventDefault();
      this.useNow();
    }
  }
}
