import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-code-panel',
  imports: [MatIconModule],
  template: `
    <section class="code-panel glass-panel">
      @if (title()) {
        <header>
          <h3>{{ title() }}</h3>
          @if (badge()) {
            <span [class.ok]="badgeTone() === 'ok'" [class.err]="badgeTone() === 'err'">
              {{ badge() }}
            </span>
          }
        </header>
      }
      <ng-content />
    </section>
  `,
  styles: `
    .code-panel {
      display: flex;
      flex-direction: column;
      min-height: 280px;
      overflow: hidden;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 14px 16px 0;
    }

    h3 {
      margin: 0;
      font-size: 0.95rem;
      font-weight: 500;
    }

    span {
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 999px;
      background: var(--dt-accent-soft);
      color: var(--dt-accent);
    }

    .ok {
      background: rgba(5, 150, 105, 0.14);
      color: var(--dt-success);
    }

    .err {
      background: rgba(220, 38, 38, 0.14);
      color: var(--dt-danger);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodePanelComponent {
  readonly title = input('');
  readonly badge = input('');
  readonly badgeTone = input<'ok' | 'err' | 'info'>('info');
}
