/***** SIDEBAR SCROLLSPY + SMOOTH SCROLL *****/
(() => {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const navLinks = Array.from(
    sidebar.querySelectorAll('a.inner-link[href^="#"]')
  );

  // Map section id -> link
  const linkById = new Map();
  navLinks.forEach((a) => {
    const id = a.getAttribute('href').trim().slice(1);
    if (id) linkById.set(id, a);
  });

  // Sections that exist on page
  const sectionSelectors = [...linkById.keys()].map(
    (id) => `#${CSS.escape(id)}`
  );
  const sections = Array.from(
    document.querySelectorAll(sectionSelectors.join(','))
  );

  // Helper: set .active on the correct link
  const setActiveLink = (id) => {
    navLinks.forEach((a) => a.classList.remove('active'));
    const active = linkById.get(id);
    if (active) active.classList.add('active');
  };

  // Smooth scroll on click (no show/hide of sections here — we scroll the page)
  navLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href');
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', hash);
      setActiveLink(hash.slice(1));
    });
  });

  // IntersectionObserver to update active state while scrolling
  let currentId = null;
  const observer = new IntersectionObserver(
    (entries) => {
      // Pick the visible section closest to the top
      const visible = entries
        .filter((en) => en.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length) {
        const id = visible[0].target.id;
        if (id && id !== currentId) {
          currentId = id;
          setActiveLink(id);
        }
      } else {
        // Fallback when scrolling fast
        const tops = sections
          .map((sec) => ({ id: sec.id, top: sec.getBoundingClientRect().top }))
          .filter((x) => x.top <= window.innerHeight * 0.25)
          .sort((a, b) => b.top - a.top);
        if (tops.length && tops[0].id !== currentId) {
          currentId = tops[0].id;
          setActiveLink(currentId);
        }
      }
    },
    {
      root: null,
      rootMargin: '-40% 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  );

  sections.forEach((sec) => observer.observe(sec));

  // Initial highlight (from hash if present, else first section)
  const initId = (location.hash || '').slice(1);
  if (initId && linkById.has(initId)) {
    setActiveLink(initId);
  } else if (sections[0]) {
    setActiveLink(sections[0].id);
  }

  // Back/forward navigation
  window.addEventListener('hashchange', () => {
    const id = (location.hash || '').slice(1);
    if (id && linkById.has(id)) setActiveLink(id);
  });

  // Sidebar collapse/expand
  const toggle = sidebar.querySelector('.toggle-sidebar');
  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
})();

/***** TYPED.JS (one-time, no cursor) *****/
var options = {
  strings: [''],
  typeSpeed: 80,
  loop: false,
  showCursor: false,
  backSpeed: 20,
};
new Typed('.field h2', options);

/***** METEOR SHOWER *****/
for (let i = 1; i <= 15; i++) {
  let meteor = document.createElement('span');
  meteor.classList = 'meteor';
  const host = document.querySelector('#home .meteor-shower');
  if (host) host.append(meteor);
}

/***** SHUFFLE FILTER (My Work) *****/
const workGridEl = document.querySelector('#my_work .work-items');
const shuffleInstance = workGridEl
  ? new Shuffle(workGridEl, { itemSelector: '.item' })
  : null;

const filterButtons = document.querySelectorAll('#my_work .filters button');
filterButtons.forEach((btn) => {
  btn.addEventListener('click', workFilter);
});

function workFilter(evt) {
  const clickedButton = evt.currentTarget;
  const clickedButtonGroup = clickedButton.getAttribute('data-group');
  const activeButton = document.querySelector(
    '#my_work .filters button.active'
  );

  if (activeButton) activeButton.classList.remove('active');
  clickedButton.classList.add('active');

  if (shuffleInstance) {
    shuffleInstance.filter(clickedButtonGroup);
  }
}

/***** WORK MODAL *****/
var workModalEl = document.getElementById('workModal');
var workModal = workModalEl ? new bootstrap.Modal(workModalEl) : null;
const workElements = document.querySelectorAll('#my_work .work-items .wrap');

workElements.forEach((item) => {
  item.addEventListener('click', function () {
    const mb = document.querySelector('#workModal .modal-body');
    if (!mb || !workModal) return;

    const setText = (sel, txt) => {
      const el = mb.querySelector(sel);
      if (el) el.innerText = txt || '';
    };
    const setAttr = (sel, attr, val) => {
      const el = mb.querySelector(sel);
      if (el && val) el.setAttribute(attr, val);
    };

    setAttr('img', 'src', item.getAttribute('data-image'));
    setText('.title', item.getAttribute('data-title'));
    setText('.description', item.getAttribute('data-description'));
    setText('.client .value', item.getAttribute('data-client'));
    setText('.completed .value', item.getAttribute('data-completed'));
    setText('.skills .value', item.getAttribute('data-skills'));
    setAttr('.project-link a', 'href', item.getAttribute('data-project-link'));

    workModal.show();
  });
});

if (workModalEl) {
  workModalEl.addEventListener('show.bs.modal', function () {
    const mw = document.getElementById('my_work');
    const sb = document.getElementById('sidebar');
    if (mw) mw.classList.add('blur');
    if (sb) sb.classList.add('blur');
  });

  workModalEl.addEventListener('hide.bs.modal', function () {
    const mw = document.getElementById('my_work');
    const sb = document.getElementById('sidebar');
    if (mw) mw.classList.remove('blur');
    if (sb) sb.classList.remove('blur');
  });
}

/***** CONTACT FORM FOCUS STYLES *****/
let contactFormItems = document.querySelectorAll(
  '#contact_me .form input, #contact_me .form textarea'
);
contactFormItems.forEach((item) => {
  item.addEventListener('focus', function () {
    item.parentElement.classList.add('focus');
  });
  item.addEventListener('blur', function () {
    if (!item.value) {
      item.parentElement.classList.remove('focus');
    }
  });
});

// (Email code goes here when you add it)
