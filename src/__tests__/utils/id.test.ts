import { createId, createUuid, shortId } from '@/lib/utils/id';

describe('identifier helpers', () => {
  it('generates unique UUIDs', () => {
    const ids = new Set(Array.from({ length: 50 }, () => createUuid()));
    expect(ids.size).toBe(50);
  });

  it('prefixes entity ids with the requested namespace', () => {
    expect(createId('task-custom')).toMatch(/^task-custom-[0-9a-f-]+$/i);
    expect(createId('vendor-custom')).toMatch(/^vendor-custom-[0-9a-f-]+$/i);
  });

  it('returns an eight-character short id', () => {
    expect(shortId()).toHaveLength(8);
  });
});
