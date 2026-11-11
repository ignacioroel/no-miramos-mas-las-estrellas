import { describe, it, expect } from 'vitest';
import { nextTheme, getStoredTheme, applyTheme, toggleTheme } from './theme.js';

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return { getItem: (k) => data[k] ?? null, setItem: (k, v) => { data[k] = String(v); } };
}
function fakeRoot() {
  const attrs = {};
  return { setAttribute: (k, v) => { attrs[k] = v; }, getAttribute: (k) => attrs[k] };
}

describe('theme', () => {
  it('alterna entre dark y light', () => {
    expect(nextTheme('dark')).toBe('light');
    expect(nextTheme('light')).toBe('dark');
  });
  it('usa dark por defecto', () => {
    expect(getStoredTheme(fakeStorage())).toBe('dark');
  });
  it('aplica y guarda el tema', () => {
    const root = fakeRoot(); const st = fakeStorage();
    applyTheme('light', root, st);
    expect(root.getAttribute('data-theme')).toBe('light');
    expect(st.getItem('theme')).toBe('light');
  });
  it('toggle cambia el tema guardado', () => {
    const root = fakeRoot(); const st = fakeStorage({ theme: 'dark' });
    expect(toggleTheme(root, st)).toBe('light');
    expect(toggleTheme(root, st)).toBe('dark');
  });
});
