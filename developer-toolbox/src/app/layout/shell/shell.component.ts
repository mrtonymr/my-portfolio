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
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { TOOLS } from '../../models/tool.model';
import { ThemeService } from '../../core/services/theme.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly themeService = inject(ThemeService);

  readonly sidenav = viewChild<MatSidenav>('drawer');
  readonly tools = TOOLS;
  readonly githubUrl = environment.githubRepoUrl;
  readonly searchQuery = signal('');

  readonly isHandset = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).pipe(
      map((result) => result.matches),
      startWith(false),
    ),
    { initialValue: false },
  );

  readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly filteredTools = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.tools;
    }
    return this.tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.keywords.some((keyword) => keyword.includes(query)),
    );
  });

  isActive(route: string): boolean {
    const url = this.currentUrl().replace(/^#/, '');
    return url === route || url.startsWith(`${route}?`);
  }

  onNavigate(): void {
    if (this.isHandset()) {
      void this.sidenav()?.close();
    }
  }

  onSearchSelect(route: string): void {
    this.searchQuery.set('');
    void this.router.navigateByUrl(route);
    this.onNavigate();
  }
}
