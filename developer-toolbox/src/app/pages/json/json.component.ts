import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { JsonPipe, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ToolHeaderComponent } from '../../shared/components/tool-header/tool-header.component';
import { CodePanelComponent } from '../../shared/components/code-panel/code-panel.component';
import { JsonService, JsonTreeNode } from '../../core/services/json.service';
import { ClipboardService } from '../../core/services/clipboard.service';
import { DownloadService } from '../../core/services/download.service';
import { ShareService } from '../../core/services/share.service';
import { RecentToolsService } from '../../core/services/recent-tools.service';

type OutputMode = 'formatted' | 'minified' | 'tree';

@Component({
  selector: 'app-json',
  imports: [
    FormsModule,
    JsonPipe,
    NgTemplateOutlet,
    MatButtonToggleModule,
    MatIconModule,
    ToolHeaderComponent,
    CodePanelComponent,
  ],
  templateUrl: './json.component.html',
  styleUrl: './json.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonComponent implements OnInit {
  private readonly jsonService = inject(JsonService);
  private readonly clipboard = inject(ClipboardService);
  private readonly downloadService = inject(DownloadService);
  private readonly shareService = inject(ShareService);
  private readonly recentTools = inject(RecentToolsService);

  readonly input = signal('{\n  "hello": "world",\n  "count": 1\n}');
  readonly mode = signal<OutputMode>('formatted');
  readonly collapsed = signal<Set<string>>(new Set());

  readonly result = computed(() => this.jsonService.process(this.input()));
  readonly outputText = computed(() => {
    const result = this.result();
    if (!result.valid) {
      return '';
    }
    return this.mode() === 'minified' ? result.minified : result.formatted;
  });

  ngOnInit(): void {
    this.recentTools.track('json');
  }

  onInput(value: string): void {
    this.input.set(value);
  }

  async copy(): Promise<void> {
    await this.clipboard.copy(this.outputText() || this.input());
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
    this.input.set('{\n  "hello": "world",\n  "count": 1\n}');
    this.mode.set('formatted');
    this.collapsed.set(new Set());
  }

  download(): void {
    this.downloadService.downloadText(
      this.outputText() || this.input(),
      'data.json',
      'application/json',
    );
  }

  share(): void {
    void this.shareService.shareCurrentUrl();
  }

  beautify(): void {
    const formatted = this.result().formatted;
    if (formatted) {
      this.input.set(formatted);
      this.mode.set('formatted');
    }
  }

  minify(): void {
    const minified = this.result().minified;
    if (minified) {
      this.input.set(minified);
      this.mode.set('minified');
    }
  }

  pathKey(path: string, key: string): string {
    return path ? `${path}.${key}` : key;
  }

  isExpanded(path: string): boolean {
    return !this.collapsed().has(path);
  }

  togglePath(path: string): void {
    const next = new Set(this.collapsed());
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    this.collapsed.set(next);
  }

  trackNode(node: JsonTreeNode): string {
    return `${node.key}:${node.type}`;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'enter') {
      event.preventDefault();
      this.beautify();
    }
  }
}
