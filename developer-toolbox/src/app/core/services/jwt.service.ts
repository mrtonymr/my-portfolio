import { Injectable } from '@angular/core';

export interface JwtDecodeResult {
  valid: boolean;
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  signaturePresent: boolean;
  headerRaw: string;
  payloadRaw: string;
  error: string | null;
  issuedAt: string | null;
  expiration: string | null;
  isExpired: boolean | null;
}

@Injectable({ providedIn: 'root' })
export class JwtService {
  decode(token: string): JwtDecodeResult {
    const trimmed = token.trim();
    if (!trimmed) {
      return this.empty();
    }

    const parts = trimmed.split('.');
    if (parts.length < 2 || parts.length > 3) {
      return {
        ...this.empty(),
        error: 'JWT must have 2 or 3 parts separated by dots',
      };
    }

    try {
      const headerRaw = this.decodePart(parts[0]);
      const payloadRaw = this.decodePart(parts[1]);
      const header = JSON.parse(headerRaw) as Record<string, unknown>;
      const payload = JSON.parse(payloadRaw) as Record<string, unknown>;
      const signature = parts[2] ?? '';
      const issuedAt = this.formatClaim(payload['iat']);
      const expiration = this.formatClaim(payload['exp']);
      const isExpired =
        typeof payload['exp'] === 'number' ? Date.now() / 1000 > payload['exp'] : null;

      return {
        valid: true,
        header,
        payload,
        signature,
        signaturePresent: signature.length > 0,
        headerRaw: JSON.stringify(header, null, 2),
        payloadRaw: JSON.stringify(payload, null, 2),
        error: null,
        issuedAt,
        expiration,
        isExpired,
      };
    } catch (error) {
      return {
        ...this.empty(),
        error: error instanceof Error ? error.message : 'Failed to decode JWT',
      };
    }
  }

  private decodePart(part: string): string {
    const normalized = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  private formatClaim(value: unknown): string | null {
    if (typeof value !== 'number') {
      return null;
    }
    return new Date(value * 1000).toLocaleString();
  }

  private empty(): JwtDecodeResult {
    return {
      valid: false,
      header: null,
      payload: null,
      signature: '',
      signaturePresent: false,
      headerRaw: '',
      payloadRaw: '',
      error: null,
      issuedAt: null,
      expiration: null,
      isExpired: null,
    };
  }
}
