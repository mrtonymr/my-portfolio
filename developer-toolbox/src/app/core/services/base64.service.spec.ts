import { Base64Service } from './base64.service';

describe('Base64Service', () => {
  const service = new Base64Service();

  it('encodes and decodes UTF-8 text', () => {
    const encoded = service.encode('こんにちは');
    const decoded = service.decode(encoded);
    expect(decoded.error).toBeNull();
    expect(decoded.value).toBe('こんにちは');
  });

  it('returns an error for invalid Base64', () => {
    const decoded = service.decode('%%%');
    expect(decoded.error).toBeTruthy();
  });
});
