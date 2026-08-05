import { Injectable, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AppSettings, DEFAULT_SETTINGS } from '../../models/interview.models';
import { StorageService } from './storage.service';

const SETTINGS_KEY = 'iph-settings';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageService);
  private readonly document = inject(DOCUMENT);

  readonly settings = signal<AppSettings>(this.storage.get(SETTINGS_KEY, DEFAULT_SETTINGS));
  readonly darkMode = computed(() => this.settings().darkMode);
  readonly animations = computed(() => this.settings().animations);

  constructor() {
    this.applyDom(this.settings().darkMode);
  }

  toggleDarkMode(): void {
    this.patch({ darkMode: !this.settings().darkMode });
  }

  setAnimations(enabled: boolean): void {
    this.patch({ animations: enabled });
  }

  setDarkMode(enabled: boolean): void {
    this.patch({ darkMode: enabled });
  }

  replaceSettings(settings: AppSettings): void {
    this.settings.set(settings);
    this.storage.set(SETTINGS_KEY, settings);
    this.applyDom(settings.darkMode);
  }

  private patch(partial: Partial<AppSettings>): void {
    const next = { ...this.settings(), ...partial };
    this.settings.set(next);
    this.storage.set(SETTINGS_KEY, next);
    this.applyDom(next.darkMode);
  }

  private applyDom(dark: boolean): void {
    this.document.documentElement.classList.toggle('dark', dark);
    this.document.documentElement.dataset['theme'] = dark ? 'dark' : 'light';
  }
}
