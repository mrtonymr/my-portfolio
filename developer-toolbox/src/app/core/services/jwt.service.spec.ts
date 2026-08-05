import { JwtService } from './jwt.service';

describe('JwtService', () => {
  const service = new JwtService();

  it('decodes a valid JWT payload and header', () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const payload = btoa(JSON.stringify({ sub: '123', iat: 1516239022, exp: 1916239022 }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    const token = `${header}.${payload}.signature`;

    const result = service.decode(token);
    expect(result.valid).toBeTrue();
    expect(result.header?.['alg']).toBe('HS256');
    expect(result.payload?.['sub']).toBe('123');
    expect(result.signaturePresent).toBeTrue();
    expect(result.issuedAt).toBeTruthy();
    expect(result.expiration).toBeTruthy();
  });

  it('rejects malformed tokens', () => {
    const result = service.decode('not-a-jwt');
    expect(result.valid).toBeFalse();
    expect(result.error).toBeTruthy();
  });
});
