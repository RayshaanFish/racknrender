const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menu.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
});

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

const revealElements = document.querySelectorAll('.reveal');
if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
  revealElements.forEach((element) => revealObserver.observe(element));
}

const frictionContent = [
  {
    label: 'Present and convert',
    title: 'Make the next step obvious.',
    copy: 'Clarify the offer, simplify the journey, and build digital touchpoints around qualified action rather than passive attention.',
    services: 'Website development / Customer journeys / Conversion structure'
  },
  {
    label: 'Remove repetition',
    title: 'Give valuable time back to the team.',
    copy: 'Find the manual steps that drain attention, then create reliable workflows and thoughtful automations around them.',
    services: 'Workflow design / Automation / Templates'
  },
  {
    label: 'Operate with clarity',
    title: 'Connect the moving parts.',
    copy: 'Create a practical operating rhythm across tools, people, information, and ownership so work moves without constant intervention.',
    services: 'Process optimisation / Systems setup / Operations'
  },
  {
    label: 'See and decide',
    title: 'Turn information into a useful view.',
    copy: 'Bring management and financial information into a clear view that helps owners understand performance and make timely decisions.',
    services: 'Dashboards / Management reporting / Financial visibility / Strategy'
  }
];

const tabs = [...document.querySelectorAll('[data-friction]')];
const panel = document.querySelector('#friction-panel');

function selectFriction(index, moveFocus = false) {
  const content = frictionContent[index];
  tabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (moveFocus && selected) tab.focus();
  });
  panel.setAttribute('aria-labelledby', `friction-tab-${index}`);
  panel.querySelector('[data-panel-label]').textContent = content.label;
  panel.querySelector('[data-panel-title]').textContent = content.title;
  panel.querySelector('[data-panel-copy]').textContent = content.copy;
  panel.querySelector('[data-panel-services]').textContent = content.services;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectFriction(index));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else next = (index - 1 + tabs.length) % tabs.length;
    selectFriction(next, true);
  });
});

document.querySelectorAll('[data-accordion] button').forEach((button) => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', String(!expanded));
    answer.hidden = expanded;
  });
});

if (!prefersReducedMotion) {
  const story = document.querySelector('.system-story');
  const storyLines = document.querySelectorAll('.story-lines span');
  const updateStory = () => {
    const bounds = story.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height - innerHeight)));
    storyLines.forEach((line, index) => line.style.setProperty('--progress', `${Math.max(0, progress * 130 - index * 12)}%`));
  };
  window.addEventListener('scroll', updateStory, { passive: true });
  updateStory();
}

const projectForm = document.querySelector('[data-project-form]');
const formStatus = document.querySelector('#form-status');
const formSuccess = document.querySelector('[data-form-success]');
const submitButton = projectForm.querySelector('[type="submit"]');
const submitButtonLabel = submitButton.innerHTML;

function clearFieldError(field) {
  const error = document.querySelector(`#${field.id}-error`);
  if (error) error.remove();
  field.removeAttribute('aria-invalid');
  field.removeAttribute('aria-describedby');
}

function showFieldError(field, message) {
  clearFieldError(field);
  const error = document.createElement('span');
  error.className = 'field-error';
  error.id = `${field.id}-error`;
  error.textContent = message;
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', error.id);
  field.insertAdjacentElement('afterend', error);
}

function validateProjectForm(form) {
  const requiredFields = [...form.querySelectorAll('[required]')];
  let firstInvalid = null;

  requiredFields.forEach((field) => {
    clearFieldError(field);
    let message = '';
    if (!field.value.trim()) message = 'Please complete this field.';
    else if (field.type === 'email' && !field.validity.valid) message = 'Enter a valid email address.';
    if (message) {
      showFieldError(field, message);
      firstInvalid ||= field;
    }
  });

  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

projectForm.querySelectorAll('input, select, textarea').forEach((field) => {
  field.addEventListener('input', () => clearFieldError(field));
  field.addEventListener('change', () => clearFieldError(field));
});

projectForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!validateProjectForm(form) || submitButton.disabled) return;

  const endpoint = form.dataset.endpoint.trim();
  formStatus.classList.remove('is-error');
  formStatus.setAttribute('role', 'status');
  formSuccess.hidden = true;

  if (!endpoint) {
    formStatus.textContent = 'Online submission is not connected yet. Please email info@racknrender.com while the production endpoint is being configured.';
    formStatus.classList.add('is-error');
    formStatus.setAttribute('role', 'alert');
    return;
  }

  const data = new FormData(form);
  const payload = Object.fromEntries(data.entries());

  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  form.setAttribute('aria-busy', 'true');
  formStatus.textContent = 'Sending your project brief...';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);

    form.reset();
    [...form.children].forEach((element) => {
      if (!element.matches('[data-form-success]')) element.hidden = true;
    });
    formSuccess.hidden = false;
    formSuccess.focus();
  } catch (error) {
    formStatus.textContent = 'We could not send your project brief. Please try again, or email info@racknrender.com directly.';
    formStatus.classList.add('is-error');
    formStatus.setAttribute('role', 'alert');
    submitButton.disabled = false;
    submitButton.innerHTML = submitButtonLabel;
  } finally {
    form.removeAttribute('aria-busy');
  }
});
