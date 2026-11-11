import { describe, it, expect } from 'vitest';
import { wrapIndex } from './gallery.js';

describe('gallery wrapIndex', () => {
  it('avanza normalmente', () => expect(wrapIndex(2, 6)).toBe(2));
  it('vuelve al inicio después de la última', () => expect(wrapIndex(6, 6)).toBe(0));
  it('va a la última desde la primera', () => expect(wrapIndex(-1, 6)).toBe(5));
  it('no rompe con galería vacía', () => expect(wrapIndex(3, 0)).toBe(0));
});
