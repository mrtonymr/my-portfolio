import { RegexService } from './regex.service';

describe('RegexService', () => {
  const service = new RegexService();

  it('finds matches and highlights them', () => {
    const result = service.test('foo', 'g', 'foo bar foo');
    expect(result.valid).toBeTrue();
    expect(result.matches.length).toBe(2);
    expect(result.highlightedHtml).toContain('<mark>foo</mark>');
  });

  it('returns errors for invalid patterns', () => {
    const result = service.test('(', 'g', 'test');
    expect(result.valid).toBeFalse();
    expect(result.error).toBeTruthy();
  });
});
