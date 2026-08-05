import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tool-header',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="tool-header animate-in">
      <nav class="tool-header__breadcrumb" aria-label="Breadcrumb">
        <a routerLink="/">Home</a>
        <mat-icon>chevron_right</mat-icon>
        <span>{{ title() }}</span>
      </nav>

      <div class="tool-header__row">
        <div>
          <h1>{{ title() }}</h1>
          @if (description()) {
            <p>{{ description() }}</p>
          }
        </div>

        <div class="tool-header__actions">
          <button mat-stroked-button type="button" (click)="paste.emit()" matTooltip="Paste (Ctrl/Cmd+V)">
            <mat-icon>content_paste</mat-icon>
            Paste
          </button>
          <button mat-stroked-button type="button" (click)="copy.emit()" matTooltip="Copy (Ctrl/Cmd+C)">
            <mat-icon>content_copy</mat-icon>
            Copy
          </button>
          <button mat-stroked-button type="button" (click)="clear.emit()">
            <mat-icon>backspace</mat-icon>
            Clear
          </button>
          <button mat-stroked-button type="button" (click)="reset.emit()">
            <mat-icon>restart_alt</mat-icon>
            Reset
          </button>
          <button mat-stroked-button type="button" (click)="download.emit()">
            <mat-icon>download</mat-icon>
            Download
          </button>
          <button mat-stroked-button type="button" (click)="share.emit()" matTooltip="Share URL">
            <mat-icon>share</mat-icon>
            Share
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .tool-header {
      margin-bottom: 18px;
    }

    .tool-header__breadcrumb {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--dt-text-muted);
      font-size: 13px;
      margin-bottom: 10px;

      a:hover {
        color: var(--dt-accent);
      }

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    .tool-header__row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    h1 {
      margin: 0 0 6px;
      font-size: 1.75rem;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: var(--dt-text-muted);
      max-width: 60ch;
    }

    .tool-header__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly copy = output<void>();
  readonly paste = output<void>();
  readonly clear = output<void>();
  readonly reset = output<void>();
  readonly download = output<void>();
  readonly share = output<void>();
}
