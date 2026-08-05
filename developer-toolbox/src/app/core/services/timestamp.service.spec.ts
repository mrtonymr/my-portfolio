import { TimestampService } from './timestamp.service';

describe('TimestampService', () => {
  const service = new TimestampService();

  it('converts unix seconds to readable formats', () => {
    const snapshot = service.fromUnixSeconds(0);
    expect(snapshot.unixMillis).toBe(0);
    expect(snapshot.iso).toBe('1970-01-01T00:00:00.000Z');
    expect(snapshot.utc).toContain('1970');
  });

  it('parses ISO dates', () => {
    const snapshot = service.fromIso('2024-01-01T00:00:00.000Z');
    expect(snapshot?.unixSeconds).toBe(1704067200);
  });
});
