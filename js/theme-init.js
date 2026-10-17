/* Run before styles paint to avoid a flash of the wrong theme. */
try {
  const saved = localStorage.getItem('portfolio-theme');
  document.documentElement.dataset.theme = ['dark', 'light'].includes(saved)
    ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
} catch {
  document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
document.documentElement.classList.add('js');
