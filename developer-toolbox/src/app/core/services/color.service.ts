import { Injectable } from '@angular/core';

export interface ColorFormats {
  hex: string;
  rgb: string;
  rgba: string;
  hsl: string;
  hsv: string;
  r: number;
  g: number;
  b: number;
  a: number;
  h: number;
  s: number;
  l: number;
  v: number;
}

@Injectable({ providedIn: 'root' })
export class ColorService {
  fromHex(hex: string, alpha = 1): ColorFormats | null {
    const normalized = hex.trim().replace('#', '');
    const full =
      normalized.length === 3
        ? normalized
            .split('')
            .map((char) => char + char)
            .join('')
        : normalized;

    if (!/^[0-9a-fA-F]{6}$/.test(full)) {
      return null;
    }

    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return this.fromRgb(r, g, b, alpha);
  }

  fromRgb(r: number, g: number, b: number, a = 1): ColorFormats {
    const clamped = {
      r: this.clamp(Math.round(r), 0, 255),
      g: this.clamp(Math.round(g), 0, 255),
      b: this.clamp(Math.round(b), 0, 255),
      a: this.clamp(a, 0, 1),
    };
    const hsl = this.rgbToHsl(clamped.r, clamped.g, clamped.b);
    const hsv = this.rgbToHsv(clamped.r, clamped.g, clamped.b);
    const hex = `#${this.toHex(clamped.r)}${this.toHex(clamped.g)}${this.toHex(clamped.b)}`;

    return {
      hex,
      rgb: `rgb(${clamped.r}, ${clamped.g}, ${clamped.b})`,
      rgba: `rgba(${clamped.r}, ${clamped.g}, ${clamped.b}, ${Number(clamped.a.toFixed(2))})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
      ...clamped,
      ...hsl,
      ...hsv,
    };
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    if (max === min) {
      return { h: 0, s: 0, l: Math.round(l * 100) };
    }
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      default:
        h = ((rn - gn) / d + 4) / 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  private rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    let h = 0;
    if (d !== 0) {
      switch (max) {
        case rn:
          h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
          break;
        case gn:
          h = ((bn - rn) / d + 2) / 6;
          break;
        default:
          h = ((rn - gn) / d + 4) / 6;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(max * 100),
    };
  }

  private toHex(value: number): string {
    return value.toString(16).padStart(2, '0');
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
