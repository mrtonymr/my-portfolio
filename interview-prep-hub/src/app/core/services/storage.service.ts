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

  exportAll(prefix = 'iph-'): string {
    if (!isPlatformBrowser(this.platformId)) {
      return '{}';
    }
    const payload: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(prefix)) {
        continue;
      }
      try {
        payload[key] = JSON.parse(localStorage.getItem(key) ?? 'null');
      } catch {
        payload[key] = localStorage.getItem(key);
      }
    }
    return JSON.stringify(payload, null, 2);
  }

  importAll(json: string, prefix = 'iph-'): void {
    const data = JSON.parse(json) as Record<string, unknown>;
    Object.entries(data).forEach(([key, value]) => {
      if (!key.startsWith(prefix)) {
        return;
      }
      this.set(key, value);
    });
  }
}
