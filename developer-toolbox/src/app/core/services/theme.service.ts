import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'dt-theme';

  readonly theme = signal<ThemeMode>(this.readInitialTheme());

  constructor() {
    effect(() => {
      const mode = this.theme();
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      this.document.documentElement.classList.toggle('dark-theme', mode === 'dark');
      localStorage.setItem(this.storageKey, mode);
    });
  }

  toggle(): void {
    this.theme.update((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
  }

  private readInitialTheme(): ThemeMode {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }
    const stored = localStorage.getItem(this.storageKey) as ThemeMode | null;
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
