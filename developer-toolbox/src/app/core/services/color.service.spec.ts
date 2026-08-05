import { ColorService } from './color.service';

describe('ColorService', () => {
  const service = new ColorService();

  it('converts hex to rgb/hsl/hsv', () => {
    const color = service.fromHex('#ff0000');
    expect(color?.rgb).toBe('rgb(255, 0, 0)');
    expect(color?.hsl).toContain('hsl(');
    expect(color?.hsv).toContain('hsv(');
  });

  it('rejects invalid hex', () => {
    expect(service.fromHex('zzz')).toBeNull();
  });
});
