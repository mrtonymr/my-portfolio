import { Injectable } from '@angular/core';

export interface RegexMatchResult {
  index: number;
  match: string;
  groups: string[];
  namedGroups: Record<string, string>;
}

export interface RegexTestResult {
  valid: boolean;
  error: string | null;
  matches: RegexMatchResult[];
  highlightedHtml: string;
}

@Injectable({ providedIn: 'root' })
export class RegexService {
  test(pattern: string, flags: string, input: string): RegexTestResult {
    if (!pattern) {
      return { valid: true, error: null, matches: [], highlightedHtml: this.escapeHtml(input) };
    }

    try {
      const regex = new RegExp(pattern, this.normalizeFlags(flags));
      const matches: RegexMatchResult[] = [];
      let highlightedHtml = '';
      let lastIndex = 0;

      if (!regex.global) {
        const match = regex.exec(input);
        if (match) {
          matches.push(this.toMatch(match));
          highlightedHtml =
            this.escapeHtml(input.slice(0, match.index)) +
            `<mark>${this.escapeHtml(match[0])}</mark>` +
            this.escapeHtml(input.slice(match.index + match[0].length));
        } else {
          highlightedHtml = this.escapeHtml(input);
        }
      } else {
        let match: RegExpExecArray | null;
        let guard = 0;
        while ((match = regex.exec(input)) !== null) {
          matches.push(this.toMatch(match));
          highlightedHtml += this.escapeHtml(input.slice(lastIndex, match.index));
          highlightedHtml += `<mark>${this.escapeHtml(match[0])}</mark>`;
          lastIndex = match.index + Math.max(match[0].length, 1);
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
          guard++;
          if (guard > 10000) {
            break;
          }
        }
        highlightedHtml += this.escapeHtml(input.slice(lastIndex));
      }

      return { valid: true, error: null, matches, highlightedHtml };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Invalid regular expression',
        matches: [],
        highlightedHtml: this.escapeHtml(input),
      };
    }
  }

  private normalizeFlags(flags: string): string {
    return [...new Set(flags.replace(/[^gimsuy]/g, '').split(''))].join('');
  }

  private toMatch(match: RegExpExecArray): RegexMatchResult {
    return {
      index: match.index,
      match: match[0],
      groups: match.slice(1),
      namedGroups: (match.groups ?? {}) as Record<string, string>,
    };
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

export const REGEX_EXAMPLES = [
  { label: 'Email', pattern: '[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}' },
  { label: 'URL', pattern: 'https?:\\/\\/[^\\s]+' },
  { label: 'UUID', pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}' },
  { label: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
];
