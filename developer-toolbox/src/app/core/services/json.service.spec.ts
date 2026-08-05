import { JsonService } from './json.service';

describe('JsonService', () => {
  const service = new JsonService();

  it('beautifies valid JSON', () => {
    const result = service.process('{"a":1}');
    expect(result.valid).toBeTrue();
    expect(result.formatted).toContain('\n');
    expect(result.minified).toBe('{"a":1}');
    expect(result.tree.length).toBe(1);
  });

  it('reports syntax errors', () => {
    const result = service.process('{bad');
    expect(result.valid).toBeFalse();
    expect(result.error).toBeTruthy();
  });
});
