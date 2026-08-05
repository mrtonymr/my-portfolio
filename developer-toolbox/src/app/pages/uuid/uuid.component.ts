import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToolHeaderComponent } from '../../shared/components/tool-header/tool-header.component';
import { CodePanelComponent } from '../../shared/components/code-panel/code-panel.component';
import { UuidService } from '../../core/services/uuid.service';
import { ClipboardService } from '../../core/services/clipboard.service';
import { DownloadService } from '../../core/services/download.service';
import { ShareService } from '../../core/services/share.service';
import { RecentToolsService } from '../../core/services/recent-tools.service';

const COUNTS = [1, 5, 10, 50, 100] as const;

@Component({
  selector: 'app-uuid',
  imports: [MatButtonModule, MatIconModule, ToolHeaderComponent, CodePanelComponent],
  templateUrl: './uuid.component.html',
  styleUrl: './uuid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UuidComponent implements OnInit {
  private readonly uuidService = inject(UuidService);
  private readonly clipboard = inject(ClipboardService);
  private readonly downloadService = inject(DownloadService);
  private readonly shareService = inject(ShareService);
  private readonly recentTools = inject(RecentToolsService);

  readonly counts = COUNTS;
  readonly selectedCount = signal<number>(5);
  readonly uuids = signal<string[]>([]);

  ngOnInit(): void {
    this.recentTools.track('uuid');
    this.generate();
  }

  generate(count = this.selectedCount()): void {
    this.selectedCount.set(count);
    this.uuids.set(this.uuidService.generate(count));
  }

  async copyOne(value: string): Promise<void> {
    await this.clipboard.copy(value);
  }

  async copy(): Promise<void> {
    await this.clipboard.copy(this.uuids().join('\n'));
  }

  async paste(): Promise<void> {
    // No paste target for generator; generate fresh instead.
    this.generate();
  }

  clear(): void {
    this.uuids.set([]);
  }

  reset(): void {
    this.selectedCount.set(5);
    this.generate(5);
  }

  download(): void {
    this.downloadService.downloadText(this.uuids().join('\n'), 'uuids.txt');
  }

  share(): void {
    void this.shareService.shareCurrentUrl();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'enter') {
      event.preventDefault();
      this.generate();
    }
  }
}
