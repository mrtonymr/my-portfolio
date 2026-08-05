import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ToolDefinition } from '../../../models/tool.model';

@Component({
  selector: 'app-tool-card',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <mat-card class="tool-card glass-panel animate-in">
      <div class="tool-card__icon">
        <mat-icon>{{ tool().icon }}</mat-icon>
      </div>
      <h3>{{ tool().name }}</h3>
      <p>{{ tool().description }}</p>
      <a mat-flat-button color="primary" [routerLink]="tool().route">
        Open
        <mat-icon>arrow_forward</mat-icon>
      </a>
    </mat-card>
  `,
  styles: `
    .tool-card {
      height: 100%;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      border-radius: var(--dt-radius) !important;
      background: var(--dt-glass) !important;
      box-shadow: var(--dt-shadow) !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-4px);
        box-shadow: var(--dt-shadow-lg) !important;
      }
    }

    .tool-card__icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      background: var(--dt-accent-soft);
      color: var(--dt-accent);
    }

    h3 {
      margin: 0;
      font-size: 1.15rem;
    }

    p {
      margin: 0;
      flex: 1;
      color: var(--dt-text-muted);
      line-height: 1.5;
    }

    a {
      align-self: flex-start;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolCardComponent {
  readonly tool = input.required<ToolDefinition>();
}
