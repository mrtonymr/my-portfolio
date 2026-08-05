import { UuidService } from './uuid.service';

describe('UuidService', () => {
  const service = new UuidService();

  it('generates the requested number of UUID v4 values', () => {
    const values = service.generate(5);
    expect(values.length).toBe(5);
    expect(values.every((value) => /^[0-9a-f-]{36}$/i.test(value))).toBeTrue();
    expect(new Set(values).size).toBe(5);
  });
});
