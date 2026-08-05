import { UrlService } from './url.service';

describe('UrlService', () => {
  const service = new UrlService();

  it('encodes and decodes URL components', () => {
    const encoded = service.encode('a b/c?x=1');
    const decoded = service.decode(encoded);
    expect(decoded.error).toBeNull();
    expect(decoded.value).toBe('a b/c?x=1');
  });
});
