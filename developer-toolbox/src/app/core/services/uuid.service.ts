import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UuidService {
  generate(count = 1): string[] {
    const safeCount = Math.max(1, Math.min(count, 1000));
    return Array.from({ length: safeCount }, () => crypto.randomUUID());
  }
}
