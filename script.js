'use strict';

// Presentation state is local to this page; no visitor data is transmitted.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
const mobileQuery = window.matchMedia('(max-width: 760px)');

function setMenu(open, returnFocus = false) {
  navigation.dataset.open = String(open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('span').textContent = open ? '−' : '＋';

  if (returnFocus) menuButton.focus();
}

function syncMenu() {
  menuButton.hidden = !mobileQuery.matches;
  setMenu(!mobileQuery.matches);
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a') && mobileQuery.matches) {
    setMenu(false);
  }
});

document.addEventListener('click', (event) => {
  if (mobileQuery.matches && !event.target.closest('.site-header')) {
    setMenu(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    mobileQuery.matches &&
    menuButton.getAttribute('aria-expanded') === 'true'
  ) {
    setMenu(false, true);
  }
});

mobileQuery.addEventListener('change', syncMenu);
syncMenu();

const styleData = {
  electric: {
    title: 'Electric energy',
    description:
      'A loud, confident direction that makes your message the main event.',
    feel: 'Fast, fearless, and full of momentum.',
    fit: 'Music, events, creative studios, and independent brands.',
    moves:
      'Oversized condensed type, sharp color contrast, and graphic print patterns.',
    palette: 'blue',
    type: 'loud',
    message: 'MAKE SOME NOISE.',
  },

  editorial: {
    title: 'Editorial attitude',
    description:
      'The feeling of an independent magazine: expressive, considered, and unmistakably yours.',
    feel: 'Cultured, unconventional, and full of character.',
    fit: 'Designers, photographers, fashion, and culture publications.',
    moves:
      'Expressive serif type, asymmetrical compositions, and generous pauses between focal moments.',
    palette: 'pink',
    type: 'editorial',
    message: 'A LITTLE OUT OF LINE.',
  },

  playful: {
    title: 'Playful by nature',
    description:
      'A warm invitation to be curious. Bright color and unexpected combinations make room for joy.',
    feel: 'Friendly, imaginative, and a little unexpected.',
    fit: 'Independent shops, makers, food brands, and creative personal brands.',
    moves:
      'Geometric type, lively color pairings, and layers with a clear reading order.',
    palette: 'acid',
    type: 'graphic',
    message: 'GOOD WEIRD.',
  },
};

const remixForm = document.querySelector('#remix-form');
const messageInput = document.querySelector('#poster-message');
const typeInput = document.querySelector('#poster-type');
const poster = document.querySelector('#live-poster');
const messageOutput = document.querySelector('#live-message');
const remixStatus = document.querySelector('#remix-status');

let selectedStyle = 'electric';

function getRemix() {
  const data = new FormData(remixForm);

  return {
    message:
      String(data.get('message') || '')
        .trim()
        .slice(0, 32) || 'YOUR WORDS HERE.',
    palette: String(data.get('palette')),
    type: String(data.get('type')),
  };
}

function renderRemix() {
  const state = getRemix();

  messageOutput.textContent = state.message;
  poster.dataset.palette = state.palette;
  poster.dataset.type = state.type;

  selectedStyle = {
    loud: 'electric',
    editorial: 'editorial',
    graphic: 'playful',
  }[state.type];

  poster.classList.toggle('long-message', state.message.length > 20);
}

function applyRemix(data) {
  messageInput.value = data.message;
  typeInput.value = data.type;

  const radio = Array.from(remixForm.elements.palette).find(
    (input) => input.value === data.palette,
  );

  if (radio) radio.checked = true;

  renderRemix();
}

remixForm.addEventListener('input', renderRemix);

remixForm.addEventListener('submit', (event) => {
  event.preventDefault();
});

remixForm.addEventListener('reset', () => {
  requestAnimationFrame(() => {
    renderRemix();
    remixStatus.textContent = 'Poster reset to the original Acid pop design.';
  });
});

const surprises = [
  {
    message: 'MAKE SOME NOISE.',
    palette: 'pink',
    type: 'loud',
  },
  {
    message: 'GOOD WEIRD.',
    palette: 'acid',
    type: 'editorial',
  },
  {
    message: 'MORE YOU.',
    palette: 'blue',
    type: 'graphic',
  },
  {
    message: 'BE A LITTLE EXTRA.',
    palette: 'pink',
    type: 'editorial',
  },
  {
    message: 'BOLD BY NATURE.',
    palette: 'acid',
    type: 'loud',
  },
];

let previousSurprise = -1;

document.querySelector('#shuffle').addEventListener('click', () => {
  const next =
    (previousSurprise +
      1 +
      Math.floor(Math.random() * (surprises.length - 1))) %
    surprises.length;

  previousSurprise = next;
  applyRemix(surprises[next]);

  remixStatus.textContent = `New direction: ${surprises[next].message}`;
});

const styleDialog = document.querySelector('#style-dialog');
const briefDialog = document.querySelector('#brief-dialog');

styleDialog.setAttribute('aria-labelledby', 'style-dialog-title');
styleDialog.setAttribute('aria-describedby', 'style-dialog-description');
briefDialog.setAttribute('aria-label', 'Create your design brief');

function openDialog(dialog) {
  dialog.showModal();
  document.body.classList.add('dialog-open');
}

for (const dialog of [styleDialog, briefDialog]) {
  dialog.querySelector('.dialog-close').addEventListener('click', () => {
    dialog.close();
  });

  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;

    const bounds = dialog.getBoundingClientRect();

    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    ) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
  });
}

document.querySelector('.style-gallery').addEventListener('click', (event) => {
  const button = event.target.closest('[data-style]');

  if (!button) return;

  selectedStyle = button.dataset.style;
  const detail = styleData[selectedStyle];

  document.querySelector('#style-dialog-title').textContent = detail.title;
  document.querySelector('#style-dialog-description').textContent =
    detail.description;
  document.querySelector('#style-feel').textContent = detail.feel;
  document.querySelector('#style-fit').textContent = detail.fit;
  document.querySelector('#style-moves').textContent = detail.moves;

  openDialog(styleDialog);
});

document.querySelector('#choose-style').addEventListener('click', () => {
  applyRemix(styleData[selectedStyle]);
  styleDialog.close();

  document.querySelector('#playground').scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth',
  });

  messageInput.focus({ preventScroll: true });

  remixStatus.textContent =
    `${styleData[selectedStyle].title} applied. ` +
    'Edit the statement to make it yours.';
});

function showBrief() {
  document.querySelector('#brief-direction').value =
    styleData[selectedStyle].title;

  document.querySelector('#brief-status').textContent = '';

  openDialog(briefDialog);
}

document.querySelector('#open-brief').addEventListener('click', showBrief);
document.querySelector('#save-remix').addEventListener('click', showBrief);

document.querySelector('#brief-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const brand = form.elements.brand.value.trim();
  const goal = form.elements.goal.value.trim();

  if (!brand || !goal) {
    document.querySelector('#brief-status').textContent =
      'Please add a project name and website goal.';

    (brand ? form.elements.goal : form.elements.brand).focus();
    return;
  }

  const state = getRemix();

  const palettes = {
    acid: 'Acid pop — acid yellow, ink black, hot pink',
    pink: 'Hot press — hot pink, ink black, acid yellow',
    blue: 'Blue mood — midnight blue, cream, hot pink',
  };

  const voices = {
    loud: 'Loud & condensed',
    editorial: 'Expressive & editorial',
    graphic: 'Graphic & geometric',
  };

  const content = [
    'MORE IS MORE — DESIGN BRIEF',
    '',
    `Project: ${brand}`,
    `Design direction: ${form.elements.direction.value}`,
    '',
    'WEBSITE GOAL',
    goal,
    '',
    'MY POSTER DIRECTION',
    `Statement: ${state.message}`,
    `Palette: ${palettes[state.palette]}`,
    `Typography: ${voices[state.type]}`,
    '',
    'DESIGN PRINCIPLES',
    'Expressive typography and color with clear hierarchy.',
    'Responsive layouts from mobile to desktop.',
    'Readable content, keyboard access, and reduced-motion support.',
    '',
    'NEXT STEP',
    'Share this brief with your web developer to discuss content, scope, budget, and timing.',
    '',
    'Created with the MORE IS MORE maximalist web design showcase.',
  ].join('\n');

  const blob = new Blob([content], {
    type: 'text/plain;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const download = document.createElement('a');

  download.href = url;
  download.download = 'more-is-more-design-brief.txt';

  document.body.append(download);
  download.click();
  download.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);

  document.querySelector('#brief-status').textContent =
    'Your brief is ready. Check your browser’s downloads and share it with your developer.';
});

// A stable section marker helps orient readers without taking over native scrolling.
if ('IntersectionObserver' in window) {
  const navLinks = Array.from(navigation.querySelectorAll('a'));

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        for (const link of navLinks) {
          if (link.hash === `#${entry.target.id}`) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        }
      }
    },
    {
      rootMargin: '-15% 0px -55% 0px',
      threshold: 0,
    },
  );

  document.querySelectorAll('main > section[id]').forEach((section) => {
    observer.observe(section);
  });
}

renderRemix();

// Optional browser integration uses the same validation and state as the controls.
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();

  const reportRegistrationError = () => {
    /* The visual controls remain the primary interface. */
  };

  try {
    Promise.resolve(
      document.modelContext.registerTool(
        {
          name: 'configure_poster',
          title: 'Configure poster direction',
          description:
            'Update the visible maximalist poster statement, palette, and typography. Does not download or send anything.',

          inputSchema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                minLength: 1,
                maxLength: 32,
              },
              palette: {
                type: 'string',
                enum: ['acid', 'pink', 'blue'],
              },
              type: {
                type: 'string',
                enum: ['loud', 'editorial', 'graphic'],
              },
            },
            required: ['message', 'palette', 'type'],
            additionalProperties: false,
          },

          annotations: {
            readOnlyHint: false,
            untrustedContentHint: true,
          },

          execute(input) {
            if (
              !input ||
              typeof input !== 'object' ||
              Array.isArray(input) ||
              Object.keys(input).some(
                (key) => !['message', 'palette', 'type'].includes(key),
              ) ||
              typeof input.message !== 'string' ||
              !input.message.trim() ||
              input.message.length > 32 ||
              !['acid', 'pink', 'blue'].includes(input.palette) ||
              !['loud', 'editorial', 'graphic'].includes(input.type)
            ) {
              throw new Error(
                'Provide a statement of 1–32 characters and a supported palette and type.',
              );
            }

            applyRemix(input);

            remixStatus.textContent = 'Your poster direction has been updated.';

            return getRemix();
          },
        },
        {
          signal: lifecycle.signal,
        },
      ),
    ).catch(reportRegistrationError);
  } catch {
    reportRegistrationError();
  }

  window.addEventListener(
    'pagehide',
    (event) => {
      if (!event.persisted) lifecycle.abort();
    },
    {
      once: true,
    },
  );
}
