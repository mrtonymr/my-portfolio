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
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToolHeaderComponent } from '../../shared/components/tool-header/tool-header.component';
import { CodePanelComponent } from '../../shared/components/code-panel/code-panel.component';
import { ColorFormats, ColorService } from '../../core/services/color.service';
import { ClipboardService } from '../../core/services/clipboard.service';
import { DownloadService } from '../../core/services/download.service';
import { ShareService } from '../../core/services/share.service';
import { RecentToolsService } from '../../core/services/recent-tools.service';
import { StorageService } from '../../core/services/storage.service';

const STORAGE_KEY = 'dt-recent-colors';
const MAX_RECENT = 12;
const DEFAULT_HEX = '#2563eb';

@Component({
  selector: 'app-color',
  imports: [FormsModule, MatButtonModule, MatIconModule, ToolHeaderComponent, CodePanelComponent],
  templateUrl: './color.component.html',
  styleUrl: './color.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorComponent implements OnInit {
  private readonly colorService = inject(ColorService);
  private readonly clipboard = inject(ClipboardService);
  private readonly downloadService = inject(DownloadService);
  private readonly shareService = inject(ShareService);
  private readonly recentTools = inject(RecentToolsService);
  private readonly storage = inject(StorageService);

  readonly hex = signal(DEFAULT_HEX);
  readonly recent = signal<string[]>([]);

  readonly color = computed<ColorFormats | null>(() => this.colorService.fromHex(this.hex()));

  readonly formats = computed(() => {
    const c = this.color();
    if (!c) {
      return [] as Array<{ label: string; value: string }>;
    }
    return [
      { label: 'Hex', value: c.hex },
      { label: 'RGB', value: c.rgb },
      { label: 'RGBA', value: c.rgba },
      { label: 'HSL', value: c.hsl },
      { label: 'HSV', value: c.hsv },
    ];
  });

  ngOnInit(): void {
    this.recentTools.track('color');
    this.recent.set(this.storage.get<string[]>(STORAGE_KEY, []));
    this.remember(this.hex());
  }

  onPicker(value: string): void {
    this.setHex(value);
  }

  onHexInput(value: string): void {
    const normalized = value.startsWith('#') ? value : `#${value}`;
    this.hex.set(normalized);
    if (this.colorService.fromHex(normalized)) {
      this.remember(normalized);
    }
  }

  setHex(value: string): void {
    this.hex.set(value);
    this.remember(value);
  }

  async copyValue(value: string): Promise<void> {
    await this.clipboard.copy(value);
  }

  async copy(): Promise<void> {
    const lines = this.formats()
      .map((f) => `${f.label}: ${f.value}`)
      .join('\n');
    await this.clipboard.copy(lines || this.hex());
  }

  async paste(): Promise<void> {
    const text = (await this.clipboard.paste()).trim();
    if (!text) {
      return;
    }
    const parsed = this.colorService.fromHex(text);
    if (parsed) {
      this.setHex(parsed.hex);
    }
  }

  clear(): void {
    this.hex.set('#000000');
  }

  reset(): void {
    this.setHex(DEFAULT_HEX);
  }

  download(): void {
    const lines = this.formats()
      .map((f) => `${f.label}: ${f.value}`)
      .join('\n');
    this.downloadService.downloadText(lines || this.hex(), 'color.txt');
  }

  share(): void {
    void this.shareService.shareCurrentUrl();
  }

  private remember(hex: string): void {
    const normalized = this.colorService.fromHex(hex)?.hex;
    if (!normalized) {
      return;
    }
    const next = [normalized, ...this.recent().filter((c) => c.toLowerCase() !== normalized.toLowerCase())].slice(
      0,
      MAX_RECENT,
    );
    this.recent.set(next);
    this.storage.set(STORAGE_KEY, next);
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'enter') {
      event.preventDefault();
      void this.copy();
    }
  }
}
