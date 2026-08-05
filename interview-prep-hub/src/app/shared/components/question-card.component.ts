import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Question } from '../../models/interview.models';

@Component({
  selector: 'app-question-card',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <article class="card glass">
      <div class="card__top">
        <span class="badge">{{ question().category }}</span>
        <span
          class="badge"
          [class.badge-easy]="question().difficulty === 'Easy'"
          [class.badge-medium]="question().difficulty === 'Medium'"
          [class.badge-hard]="question().difficulty === 'Hard'"
        >
          {{ question().difficulty }}
        </span>
      </div>
      <h3>
        <a [routerLink]="['/questions', question().id]">{{ question().title }}</a>
      </h3>
      <p>{{ question().question }}</p>
      <div class="card__meta">
        <span><mat-icon>schedule</mat-icon> {{ question().estimatedTime }} min</span>
        @if (completed()) {
          <span class="done"><mat-icon>check_circle</mat-icon> Done</span>
        }
      </div>
      <div class="card__actions">
        <a mat-stroked-button [routerLink]="['/questions', question().id]">Open</a>
        <button
          mat-icon-button
          type="button"
          [matTooltip]="bookmarked() ? 'Remove bookmark' : 'Bookmark'"
          (click)="bookmark.emit()"
          [attr.aria-label]="bookmarked() ? 'Remove bookmark' : 'Bookmark'"
        >
          <mat-icon>{{ bookmarked() ? 'bookmark' : 'bookmark_border' }}</mat-icon>
        </button>
        <button
          mat-icon-button
          type="button"
          [matTooltip]="completed() ? 'Mark incomplete' : 'Mark complete'"
          (click)="complete.emit()"
          [attr.aria-label]="completed() ? 'Mark incomplete' : 'Mark complete'"
        >
          <mat-icon>{{ completed() ? 'task_alt' : 'radio_button_unchecked' }}</mat-icon>
        </button>
      </div>
    </article>
  `,
  styles: `
    .card {
      padding: 1.1rem 1.15rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .card:hover {
      transform: translateY(-3px);
    }
    .card__top {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    h3 {
      margin: 0;
      font-size: 1.05rem;
      line-height: 1.35;
    }
    p {
      margin: 0;
      color: var(--iph-muted);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }
    .card__meta {
      display: flex;
      gap: 0.85rem;
      color: var(--iph-muted);
      font-size: 0.85rem;
      align-items: center;
    }
    .card__meta mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      vertical-align: middle;
      margin-right: 2px;
    }
    .done {
      color: var(--iph-success);
    }
    .card__actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionCardComponent {
  readonly question = input.required<Question>();
  readonly bookmarked = input(false);
  readonly completed = input(false);
  readonly bookmark = output<void>();
  readonly complete = output<void>();
}
