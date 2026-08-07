import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ThemeService } from '../../core/services/theme.service';
import { ProgressService } from '../../core/services/progress.service';
import { QuestionService } from '../../core/services/question.service';
import { StatisticsService } from '../../core/services/statistics.service';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressBarModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly router = inject(Router);
  private readonly breakpoints = inject(BreakpointObserver);
  readonly theme = inject(ThemeService);
  readonly progress = inject(ProgressService);
  readonly questions = inject(QuestionService);
  readonly stats = inject(StatisticsService);

  readonly drawer = viewChild<MatSidenav>('drawer');
  readonly search = signal('');

  readonly nav: NavItem[] = [
    { label: 'Dashboard', route: '/', icon: 'dashboard' },
    { label: 'Questions', route: '/questions', icon: 'menu_book' },
    { label: 'AI Questions', route: '/ai-questions', icon: 'auto_awesome' },
    { label: 'Bookmarks', route: '/bookmarks', icon: 'bookmark' },
    { label: 'Flashcards', route: '/flashcards', icon: 'style' },
    { label: 'Mock Interview', route: '/mock-interview', icon: 'record_voice_over' },
    { label: 'Statistics', route: '/statistics', icon: 'insights' },
    { label: 'Settings', route: '/settings', icon: 'settings' },
  ];

  readonly isHandset = toSignal(
    this.breakpoints.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).pipe(
      map((r) => r.matches),
      startWith(false),
    ),
    { initialValue: false },
  );

  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly completion = computed(() => this.stats.completionPercent());

  isActive(route: string): boolean {
    const url = this.currentUrl();
    if (route === '/') return url === '/' || url === '';
    return url === route || url.startsWith(`${route}/`);
  }

  onNavigate(): void {
    if (this.isHandset()) void this.drawer()?.close();
  }

  submitSearch(): void {
    const q = this.search().trim();
    void this.router.navigate(['/questions'], { queryParams: q ? { q } : {} });
    this.onNavigate();
  }
}
