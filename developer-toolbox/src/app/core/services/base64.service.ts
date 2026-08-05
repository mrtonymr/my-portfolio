import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Base64Service {
  encode(text: string): string {
    const bytes = new TextEncoder().encode(text);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  decode(base64: string): { value: string; error: string | null } {
    try {
      const normalized = base64.replace(/\s+/g, '');
      const binary = atob(normalized);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return { value: new TextDecoder().decode(bytes), error: null };
    } catch (error) {
      return {
        value: '',
        error: error instanceof Error ? error.message : 'Invalid Base64',
      };
    }
  }
}
