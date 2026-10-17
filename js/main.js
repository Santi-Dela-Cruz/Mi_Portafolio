'use strict';

const themeToggle = document.getElementById('theme-toggle');
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
let explicitTheme = false;
try { explicitTheme = ['light', 'dark'].includes(localStorage.getItem('portfolio-theme')); } catch {}
function applyTheme(theme) {
  const dark = theme === 'dark';
  document.documentElement.dataset.theme = theme;
  themeToggle?.setAttribute('aria-pressed', String(dark));
  themeToggle?.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
  if (themeToggle) themeToggle.title = dark ? 'Activar modo claro' : 'Activar modo oscuro';
  const label = document.getElementById('theme-label');
  if (label) label.textContent = dark ? 'Modo claro' : 'Modo oscuro';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = dark ? '#101522' : '#f5f6fa';
}
applyTheme(document.documentElement.dataset.theme || 'light');
themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  explicitTheme = true;
  applyTheme(next);
  try { localStorage.setItem('portfolio-theme', next); } catch {}
});
systemTheme.addEventListener('change', event => {
  if (!explicitTheme) applyTheme(event.matches ? 'dark' : 'light');
});
window.addEventListener('storage', event => {
  if (event.key !== 'portfolio-theme') return;
  explicitTheme = ['light', 'dark'].includes(event.newValue);
  applyTheme(explicitTheme ? event.newValue : (systemTheme.matches ? 'dark' : 'light'));
});

// Loading and error states keep the layout stable without hiding project details.
document.querySelectorAll('.project-image img, .portrait').forEach(img => {
  const holder = img.parentElement;
  const loading = document.createElement('span');
  loading.className = 'image-loading';
  loading.textContent = 'Cargando imagen…';
  holder.append(loading);
  function finish(failed) {
    loading.remove();
    if (!failed) return;
    img.hidden = true;
    if (holder.querySelector('.image-fallback')) return;
    const fallback = document.createElement('span');
    fallback.className = 'image-fallback';
    fallback.textContent = img.classList.contains('portrait')
      ? 'Foto de Santiago no disponible.'
      : 'Vista previa no disponible. Puedes consultar el código del proyecto.';
    holder.append(fallback);
  }
  img.addEventListener('load', () => finish(false), { once: true });
  img.addEventListener('error', () => finish(true), { once: true });
  if (img.complete) finish(!img.naturalWidth);
});

const filters = [...document.querySelectorAll('[data-filter]')];
const search = document.getElementById('project-search');
const cards = [...document.querySelectorAll('[data-type]')];
const count = document.getElementById('project-count');
const empty = document.getElementById('projects-empty');
let selectedType = 'Todos';
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function updateProjects() {
  const query = normalize(search?.value.trim() || '');
  let visible = 0;
  cards.forEach(card => {
    const show = (selectedType === 'Todos' || card.dataset.type === selectedType)
      && normalize(card.textContent).includes(query);
    card.hidden = !show;
    if (show) visible++;
  });
  filters.forEach(button => {
    const active = button.dataset.filter === selectedType;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (count) count.textContent = visible + (visible === 1 ? ' proyecto' : ' proyectos');
  if (empty) empty.hidden = visible > 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  selectedType = button.dataset.filter;
  updateProjects();
}));
search?.addEventListener('input', updateProjects);
document.getElementById('reset-projects')?.addEventListener('click', () => {
  selectedType = 'Todos';
  if (search) search.value = '';
  updateProjects();
  search?.focus();
});

const form = document.getElementById('contact-form');
if (form) {
  const fields = [...form.querySelectorAll('input[name], textarea[name]')];
  const status = document.getElementById('form-status');
  const result = document.getElementById('draft-result');
  const openDraft = document.getElementById('open-draft');
  const copyButton = document.getElementById('copy-message');
  const draftKey = 'portfolio-contact-draft';
  let preparedText = '';
  let copyTimer;
  function announce(message, state = '') {
    status.textContent = message;
    status.dataset.state = state;
  }
  function fieldError(field) {
    if (!field.value.trim()) return 'Completa este campo.';
    if (field.validity.typeMismatch) return 'Escribe un correo válido, como nombre@ejemplo.com.';
    if (field.minLength > 0 && field.value.trim().length < field.minLength)
      return 'Escribe al menos ' + field.minLength + ' caracteres.';
    if (field.maxLength > 0 && field.value.length > field.maxLength)
      return 'Usa un máximo de ' + field.maxLength + ' caracteres.';
    return '';
  }
  function validateField(field) {
    const message = fieldError(field);
    field.setAttribute('aria-invalid', String(Boolean(message)));
    document.getElementById(field.id + '-error').textContent = message;
    return !message;
  }
  function saveDraft() {
    try {
      const data = Object.fromEntries(fields.map(field => [field.name, field.value]));
      sessionStorage.setItem(draftKey, JSON.stringify(data));
    } catch {}
  }
  try {
    const draft = JSON.parse(sessionStorage.getItem(draftKey) || 'null');
    if (draft && typeof draft === 'object') {
      fields.forEach(field => { if (typeof draft[field.name] === 'string') field.value = draft[field.name]; });
      if (fields.some(field => field.value)) announce('Borrador recuperado en esta pestaña. Puedes seguir editándolo.');
    }
  } catch {}
  fields.forEach(field => {
    field.addEventListener('blur', () => { if (field.value || field.hasAttribute('aria-invalid')) validateField(field); });
    field.addEventListener('input', () => {
      if (field.hasAttribute('aria-invalid')) validateField(field);
      if (!result.hidden) {
        result.hidden = true;
        document.getElementById('manual-copy').hidden = true;
        announce('El mensaje cambió. Prepara el correo de nuevo para actualizarlo.');
      } else if (status.dataset.state) announce('');
      saveDraft();
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const validity = fields.map(validateField);
    if (validity.includes(false)) {
      result.hidden = true;
      announce('Revisa los campos indicados antes de continuar.', 'error');
      fields[validity.indexOf(false)].focus();
      return;
    }
    const name = form.elements.nombre.value.trim();
    const email = form.elements.email.value.trim();
    const message = form.elements.mensaje.value.trim();
    preparedText = 'Nombre: ' + name + '\nCorreo: ' + email + '\n\nMensaje:\n' + message;
    openDraft.href = 'mailto:kevin.delacruz@epn.edu.ec?subject='
      + encodeURIComponent('Contacto desde portafolio · ' + name) + '&body=' + encodeURIComponent(preparedText);
    result.hidden = false;
    saveDraft();
    announce('Borrador listo. Ábrelo en tu aplicación de correo o copia el mensaje.', 'success');
    openDraft.focus();
  });
  openDraft.addEventListener('click', () => {
    announce('Se solicitó abrir tu aplicación de correo. Revisa el borrador y pulsa Enviar allí. Si no se abre, copia el mensaje.', 'success');
  });
  copyButton.addEventListener('click', async () => {
    copyButton.disabled = true;
    copyButton.setAttribute('aria-busy', 'true');
    copyButton.textContent = 'Copiando…';
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(preparedText);
      announce('Mensaje copiado. Pégalo en un correo para kevin.delacruz@epn.edu.ec.', 'success');
      copyButton.textContent = 'Mensaje copiado';
      clearTimeout(copyTimer);
      copyTimer = setTimeout(() => { copyButton.textContent = 'Copiar mensaje'; }, 2400);
    } catch {
      const manual = document.getElementById('manual-copy');
      manual.hidden = false;
      manual.querySelector('textarea').value = preparedText;
      manual.querySelector('textarea').focus();
      manual.querySelector('textarea').select();
      announce('No se pudo copiar automáticamente. Copia el texto del campo seleccionado.', 'error');
      copyButton.textContent = 'Copiar mensaje';
    } finally {
      copyButton.disabled = false;
      copyButton.removeAttribute('aria-busy');
    }
  });
}
// Fall back to page scrolling if the profile and its contact row cannot fit.
// The card never creates an independent scrolling region.
const profileCard = document.querySelector('.profile-sidebar');
if (profileCard) {
  function updateProfilePosition() {
    const header = document.querySelector('.site-header');
    const availableHeight = window.innerHeight - (header?.offsetHeight || 0) - 48;
    profileCard.classList.toggle('is-static',
      window.innerWidth > 760 && profileCard.offsetHeight > availableHeight);
  }
  window.addEventListener('resize', updateProfilePosition);
  if ('ResizeObserver' in window) new ResizeObserver(updateProfilePosition).observe(profileCard);
  updateProfilePosition();
}