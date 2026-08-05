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
import { MatIconModule } from '@angular/material/icon';
import { ToolHeaderComponent } from '../../shared/components/tool-header/tool-header.component';
import { CodePanelComponent } from '../../shared/components/code-panel/code-panel.component';
import { JwtService } from '../../core/services/jwt.service';
import { ClipboardService } from '../../core/services/clipboard.service';
import { DownloadService } from '../../core/services/download.service';
import { ShareService } from '../../core/services/share.service';
import { RecentToolsService } from '../../core/services/recent-tools.service';

const DEFAULT_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldmVsb3BlciIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDAwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

@Component({
  selector: 'app-jwt',
  imports: [FormsModule, MatIconModule, ToolHeaderComponent, CodePanelComponent],
  templateUrl: './jwt.component.html',
  styleUrl: './jwt.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JwtComponent implements OnInit {
  private readonly jwtService = inject(JwtService);
  private readonly clipboard = inject(ClipboardService);
  private readonly downloadService = inject(DownloadService);
  private readonly shareService = inject(ShareService);
  private readonly recentTools = inject(RecentToolsService);

  readonly token = signal(DEFAULT_JWT);

  readonly decoded = computed(() => this.jwtService.decode(this.token()));

  readonly summary = computed(() => {
    const result = this.decoded();
    if (!result.valid) {
      return result.error ?? '';
    }
    return [
      'Header:',
      result.headerRaw,
      '',
      'Payload:',
      result.payloadRaw,
      '',
      `Issued at: ${result.issuedAt ?? 'n/a'}`,
      `Expiration: ${result.expiration ?? 'n/a'}`,
      `Expired: ${result.isExpired == null ? 'n/a' : result.isExpired ? 'yes' : 'no'}`,
      `Signature present: ${result.signaturePresent ? 'yes' : 'no'}`,
    ].join('\n');
  });

  ngOnInit(): void {
    this.recentTools.track('jwt');
  }

  onToken(value: string): void {
    this.token.set(value);
  }

  async copy(): Promise<void> {
    const result = this.decoded();
    await this.clipboard.copy(result.valid ? result.payloadRaw : this.token());
  }

  async copySummary(): Promise<void> {
    await this.clipboard.copy(this.summary());
  }

  async paste(): Promise<void> {
    const text = await this.clipboard.paste();
    if (text) {
      this.token.set(text.trim());
    }
  }

  clear(): void {
    this.token.set('');
  }

  reset(): void {
    this.token.set(DEFAULT_JWT);
  }

  download(): void {
    this.downloadService.downloadText(this.summary() || this.token(), 'jwt-decode.txt');
  }

  share(): void {
    void this.shareService.shareCurrentUrl();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'enter') {
      event.preventDefault();
      void this.copySummary();
    }
  }
}
