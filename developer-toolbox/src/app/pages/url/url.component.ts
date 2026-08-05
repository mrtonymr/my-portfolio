import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToolHeaderComponent } from '../../shared/components/tool-header/tool-header.component';
import { CodePanelComponent } from '../../shared/components/code-panel/code-panel.component';
import { UrlService } from '../../core/services/url.service';
import { ClipboardService } from '../../core/services/clipboard.service';
import { DownloadService } from '../../core/services/download.service';
import { ShareService } from '../../core/services/share.service';
import { RecentToolsService } from '../../core/services/recent-tools.service';

type UrlMode = 'encode' | 'decode';

const DEFAULT_INPUT = 'https://example.com/search?q=developer toolbox&lang=en';

@Component({
  selector: 'app-url',
  imports: [FormsModule, MatButtonToggleModule, ToolHeaderComponent, CodePanelComponent],
  templateUrl: './url.component.html',
  styleUrl: './url.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UrlComponent implements OnInit {
  private readonly urlService = inject(UrlService);
  private readonly clipboard = inject(ClipboardService);
  private readonly downloadService = inject(DownloadService);
  private readonly shareService = inject(ShareService);
  private readonly recentTools = inject(RecentToolsService);

  readonly mode = signal<UrlMode>('encode');
  readonly input = signal(DEFAULT_INPUT);

  readonly result = computed(() => {
    const value = this.input();
    if (!value) {
      return { output: '', error: null as string | null };
    }
    if (this.mode() === 'encode') {
      return { output: this.urlService.encode(value), error: null };
    }
    const decoded = this.urlService.decode(value);
    return { output: decoded.value, error: decoded.error };
  });

  readonly output = computed(() => this.result().output);
  readonly error = computed(() => this.result().error);

  ngOnInit(): void {
    this.recentTools.track('url');
  }

  onInput(value: string): void {
    this.input.set(value);
  }

  setMode(mode: UrlMode): void {
    this.mode.set(mode);
  }

  async copy(): Promise<void> {
    await this.clipboard.copy(this.output() || this.input());
  }

  async paste(): Promise<void> {
    const text = await this.clipboard.paste();
    if (text) {
      this.input.set(text);
    }
  }

  clear(): void {
    this.input.set('');
  }

  reset(): void {
    this.mode.set('encode');
    this.input.set(DEFAULT_INPUT);
  }

  download(): void {
    this.downloadService.downloadText(
      this.output() || this.input(),
      this.mode() === 'encode' ? 'url-encoded.txt' : 'url-decoded.txt',
    );
  }

  share(): void {
    void this.shareService.shareCurrentUrl();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'enter') {
      event.preventDefault();
      void this.copy();
    }
  }
}
