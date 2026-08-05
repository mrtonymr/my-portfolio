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
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToolHeaderComponent } from '../../shared/components/tool-header/tool-header.component';
import { CodePanelComponent } from '../../shared/components/code-panel/code-panel.component';
import { GroqService } from '../../core/services/groq.service';
import { RegexService } from '../../core/services/regex.service';
import { ClipboardService } from '../../core/services/clipboard.service';
import { DownloadService } from '../../core/services/download.service';
import { ShareService } from '../../core/services/share.service';
import { RecentToolsService } from '../../core/services/recent-tools.service';

const DEFAULT_PROMPT = 'Match email addresses';
const DEFAULT_SAMPLE = 'Reach me at hello@example.com or admin@test.org tonight.';

@Component({
  selector: 'app-regex-ai',
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ToolHeaderComponent,
    CodePanelComponent,
  ],
  templateUrl: './regex-ai.component.html',
  styleUrl: './regex-ai.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegexAiComponent implements OnInit {
  private readonly groq = inject(GroqService);
  private readonly regexService = inject(RegexService);
  private readonly clipboard = inject(ClipboardService);
  private readonly downloadService = inject(DownloadService);
  private readonly shareService = inject(ShareService);
  private readonly recentTools = inject(RecentToolsService);
  private readonly router = inject(Router);

  readonly prompt = signal(DEFAULT_PROMPT);
  readonly sampleText = signal(DEFAULT_SAMPLE);
  readonly pattern = signal('');
  readonly explanation = signal('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly hasApiKey = this.groq.hasApiKey;

  readonly miniTest = computed(() =>
    this.regexService.test(this.pattern(), 'g', this.sampleText()),
  );

  ngOnInit(): void {
    this.recentTools.track('regex-ai');
  }

  async generate(): Promise<void> {
    const prompt = this.prompt().trim();
    if (!prompt || this.loading()) {
      return;
    }
    if (!this.hasApiKey) {
      this.error.set('Groq API key is missing. Add it to environment.ts to enable Regex AI.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await this.groq.generateRegex(prompt);
      this.pattern.set(result.pattern);
      this.explanation.set(result.explanation);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to generate regex');
    } finally {
      this.loading.set(false);
    }
  }

  openInTester(): void {
    const pattern = this.pattern();
    if (!pattern) {
      return;
    }
    void this.router.navigate(['/regex'], { queryParams: { pattern } });
  }

  async copy(): Promise<void> {
    await this.clipboard.copy(this.pattern() || this.prompt());
  }

  async paste(): Promise<void> {
    const text = await this.clipboard.paste();
    if (text) {
      this.prompt.set(text);
    }
  }

  clear(): void {
    this.prompt.set('');
    this.pattern.set('');
    this.explanation.set('');
    this.error.set(null);
  }

  reset(): void {
    this.prompt.set(DEFAULT_PROMPT);
    this.sampleText.set(DEFAULT_SAMPLE);
    this.pattern.set('');
    this.explanation.set('');
    this.error.set(null);
  }

  download(): void {
    this.downloadService.downloadText(
      [
        `Prompt: ${this.prompt()}`,
        `Pattern: ${this.pattern()}`,
        `Explanation: ${this.explanation()}`,
      ].join('\n'),
      'regex-ai.txt',
    );
  }

  share(): void {
    void this.shareService.shareCurrentUrl();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'enter') {
      event.preventDefault();
      void this.generate();
    }
  }
}
