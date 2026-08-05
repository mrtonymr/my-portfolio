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
import { ActivatedRoute } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { ToolHeaderComponent } from '../../shared/components/tool-header/tool-header.component';
import { CodePanelComponent } from '../../shared/components/code-panel/code-panel.component';
import { REGEX_EXAMPLES, RegexService } from '../../core/services/regex.service';
import { ClipboardService } from '../../core/services/clipboard.service';
import { DownloadService } from '../../core/services/download.service';
import { ShareService } from '../../core/services/share.service';
import { RecentToolsService } from '../../core/services/recent-tools.service';

const DEFAULT_TEXT = `Contact us at hello@example.com or visit https://example.com/docs.
UUID sample: 550e8400-e29b-41d4-a716-446655440000
Server IP: 192.168.1.42`;

@Component({
  selector: 'app-regex',
  imports: [
    FormsModule,
    MatCheckboxModule,
    MatIconModule,
    ToolHeaderComponent,
    CodePanelComponent,
  ],
  templateUrl: './regex.component.html',
  styleUrl: './regex.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegexComponent implements OnInit {
  private readonly regexService = inject(RegexService);
  private readonly clipboard = inject(ClipboardService);
  private readonly downloadService = inject(DownloadService);
  private readonly shareService = inject(ShareService);
  private readonly recentTools = inject(RecentToolsService);
  private readonly route = inject(ActivatedRoute);

  readonly examples = REGEX_EXAMPLES;
  readonly text = signal(DEFAULT_TEXT);
  readonly pattern = signal('[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}');
  readonly flagG = signal(true);
  readonly flagI = signal(false);
  readonly flagM = signal(false);
  readonly flagS = signal(false);

  readonly flags = computed(
    () =>
      `${this.flagG() ? 'g' : ''}${this.flagI() ? 'i' : ''}${this.flagM() ? 'm' : ''}${this.flagS() ? 's' : ''}`,
  );

  readonly result = computed(() =>
    this.regexService.test(this.pattern(), this.flags(), this.text()),
  );

  ngOnInit(): void {
    this.recentTools.track('regex');
    const fromQuery = this.route.snapshot.queryParamMap.get('pattern');
    if (fromQuery) {
      this.pattern.set(fromQuery);
    }
  }

  applyExample(pattern: string): void {
    this.pattern.set(pattern);
  }

  async copy(): Promise<void> {
    await this.clipboard.copy(this.pattern());
  }

  async paste(): Promise<void> {
    const text = await this.clipboard.paste();
    if (text) {
      this.pattern.set(text);
    }
  }

  clear(): void {
    this.text.set('');
    this.pattern.set('');
  }

  reset(): void {
    this.text.set(DEFAULT_TEXT);
    this.pattern.set('[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}');
    this.flagG.set(true);
    this.flagI.set(false);
    this.flagM.set(false);
    this.flagS.set(false);
  }

  download(): void {
    const result = this.result();
    const body = [
      `Pattern: /${this.pattern()}/${this.flags()}`,
      `Matches: ${result.matches.length}`,
      result.error ? `Error: ${result.error}` : '',
      '',
      'Matches:',
      ...result.matches.map((m, i) => `${i + 1}. [${m.index}] ${m.match}`),
    ]
      .filter(Boolean)
      .join('\n');
    this.downloadService.downloadText(body, 'regex-results.txt');
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
