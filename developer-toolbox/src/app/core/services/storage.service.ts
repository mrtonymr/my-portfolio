import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  get<T>(key: string, fallback: T): T {
    if (!isPlatformBrowser(this.platformId)) {
      return fallback;
    }
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  }

  set<T>(key: string, value: T): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    localStorage.removeItem(key);
  }
}
