export function nextTheme(current) {
  return current === 'dark' ? 'light' : 'dark';
}

export function getStoredTheme(storage = localStorage) {
  return storage.getItem('theme') || 'dark';
}

export function applyTheme(theme, root = document.documentElement, storage = localStorage) {
  root.setAttribute('data-theme', theme);
  storage.setItem('theme', theme);
}

export function toggleTheme(root = document.documentElement, storage = localStorage) {
  const current = getStoredTheme(storage);
  const theme = nextTheme(current);
  applyTheme(theme, root, storage);
  return theme;
}

export function initTheme() {
  applyTheme(getStoredTheme());

  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  btn.textContent = getStoredTheme() === 'dark' ? '☀' : '☾';
  btn.addEventListener('click', () => {
    const theme = toggleTheme();
    btn.textContent = theme === 'dark' ? '☀' : '☾';
  });
}
