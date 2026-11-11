import { describe, it, expect } from 'vitest';
import { skyFade, twinkle } from './starfield.js';

describe('starfield', () => {
  it('cielo a pleno arriba de todo', () => expect(skyFade(0, 900)).toBe(1));
  it('se apaga al bajar pero nunca del todo', () => {
    expect(skyFade(450, 900)).toBeLessThan(1);
    expect(skyFade(99999, 900)).toBeCloseTo(0.12);
  });
  it('no rompe con alto 0', () => expect(skyFade(100, 0)).toBe(1));
  it('el titileo queda entre 0.35 y 1', () => {
    for (let t = 0; t < 20; t += 0.37) {
      const v = twinkle(t, 1.3, 0.5);
      expect(v).toBeGreaterThanOrEqual(0.35 - 1e-9);
      expect(v).toBeLessThanOrEqual(1 + 1e-9);
    }
  });
});
