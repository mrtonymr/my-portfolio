import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UrlService {
  encode(value: string): string {
    return encodeURIComponent(value);
  }

  decode(value: string): { value: string; error: string | null } {
    try {
      return { value: decodeURIComponent(value.replace(/\+/g, ' ')), error: null };
    } catch (error) {
      return {
        value: '',
        error: error instanceof Error ? error.message : 'Invalid encoded URL',
      };
    }
  }
}
