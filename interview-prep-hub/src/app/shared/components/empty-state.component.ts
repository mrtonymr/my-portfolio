import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  template: `
    <div class="empty glass">
      <mat-icon>{{ icon() }}</mat-icon>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      @if (actionLabel() && actionLink()) {
        <a mat-flat-button color="primary" [routerLink]="actionLink()">{{ actionLabel() }}</a>
      }
    </div>
  `,
  styles: `
    .empty {
      padding: 2.5rem 1.5rem;
      text-align: center;
      display: grid;
      place-items: center;
      gap: 0.6rem;
    }
    mat-icon {
      font-size: 42px;
      width: 42px;
      height: 42px;
      color: var(--iph-accent);
    }
    h3 {
      margin: 0;
    }
    p {
      margin: 0;
      color: var(--iph-muted);
      max-width: 36ch;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly icon = input('inbox');
  readonly title = input('Nothing here yet');
  readonly message = input('Start exploring questions to fill this space.');
  readonly actionLabel = input('');
  readonly actionLink = input('');
}
