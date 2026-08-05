import { Injectable } from '@angular/core';

export interface JsonTreeNode {
  key: string;
  value: unknown;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  children?: JsonTreeNode[];
  expanded: boolean;
}

export interface JsonProcessResult {
  valid: boolean;
  formatted: string;
  minified: string;
  error: string | null;
  parsed: unknown;
  tree: JsonTreeNode[];
}

@Injectable({ providedIn: 'root' })
export class JsonService {
  process(input: string): JsonProcessResult {
    const trimmed = input.trim();
    if (!trimmed) {
      return {
        valid: false,
        formatted: '',
        minified: '',
        error: null,
        parsed: null,
        tree: [],
      };
    }

    try {
      const parsed = JSON.parse(trimmed);
      return {
        valid: true,
        formatted: JSON.stringify(parsed, null, 2),
        minified: JSON.stringify(parsed),
        error: null,
        parsed,
        tree: this.toTree(parsed),
      };
    } catch (error) {
      return {
        valid: false,
        formatted: '',
        minified: '',
        error: error instanceof Error ? error.message : 'Invalid JSON',
        parsed: null,
        tree: [],
      };
    }
  }

  beautify(input: string): string {
    return this.process(input).formatted;
  }

  minify(input: string): string {
    return this.process(input).minified;
  }

  private toTree(value: unknown, key = 'root'): JsonTreeNode[] {
    if (Array.isArray(value)) {
      return value.map((item, index) => this.node(String(index), item));
    }
    if (value !== null && typeof value === 'object') {
      return Object.entries(value as Record<string, unknown>).map(([childKey, childValue]) =>
        this.node(childKey, childValue),
      );
    }
    return [this.node(key, value)];
  }

  private node(key: string, value: unknown): JsonTreeNode {
    const type = this.valueType(value);
    const children =
      type === 'object' || type === 'array' ? this.toTree(value, key) : undefined;
    return {
      key,
      value,
      type,
      children,
      expanded: true,
    };
  }

  private valueType(value: unknown): JsonTreeNode['type'] {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    return 'null';
  }
}
