// =============================================================
// Load data.json lalu render seluruh konten dinamis
// =============================================================
async function loadData() {
  try {
    const res = await fetch('data/data.json');
    if (!res.ok) throw new Error('Gagal memuat data.json');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

function renderProfile(data) {
  const { profile } = data;
  document.getElementById('profile-tagline').textContent = profile.tagline;
  document.getElementById('profile-location').textContent = profile.location;
  document.getElementById('about-text').textContent = profile.about;
}

function renderEducation(data) {
  const wrap = document.getElementById('education-list');
  wrap.innerHTML = data.education.map(edu => `
    <div class="edu-card">
      <h3>${edu.school}</h3>
      <span class="edu-period">${edu.period}</span>
      <p>${edu.description}</p>
    </div>
  `).join('');
}

function renderSkills(data) {
  const board = document.getElementById('skills-board');
  board.innerHTML = data.skills.map(skill => `
    <div class="skill-chip">
      <div class="skill-chip__top">
        <span>${skill.name}</span>
        <span>${skill.level}%</span>
      </div>
      <div class="skill-chip__bar">
        <div class="skill-chip__fill" data-level="${skill.level}"></div>
      </div>
    </div>
  `).join('');
}

function renderProjects(data) {
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = data.projects.map(p => `
    <article class="project-card">
      <span class="project-card__cat">${p.category}</span>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="project-card__tags">
        ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </article>
  `).join('');
}

function renderExperience(data) {
  const list = document.getElementById('experience-list');
  list.innerHTML = data.experience.map(exp => `
    <div class="exp-item">
      <span class="exp-item__role">${exp.company}</span>
      <div>
        <h3>${exp.role}</h3>
        <p>${exp.description}</p>
      </div>
    </div>
  `).join('');
}

function renderContact(data) {
  const { profile } = data;
  const list = document.getElementById('contact-list');
  list.innerHTML = `
    <li><b>EMAIL</b> ${profile.email}</li>
    <li><b>PHONE</b> ${profile.phone}</li>
    <li><b>LOKASI</b> ${profile.location}</li>
    <li><b>IG</b> <a href="${profile.instagram}" target="_blank" rel="noopener">@muhammad.al_10</a></li>
  `;
}

// =============================================================
// Scroll circuit-trace fill + active nav link
// =============================================================
function initScrollTrace() {
  const fill = document.querySelector('.trace-fill');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('[data-nav]');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    const dashLength = 1000;
    fill.style.strokeDashoffset = `${dashLength - progress * dashLength}`;

    let current = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom > 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// =============================================================
// Animate skill bars when visible
// =============================================================
function initSkillReveal() {
  const fills = document.querySelectorAll('.skill-chip__fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = `${el.dataset.level}%`;
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach(f => observer.observe(f));
}

// =============================================================
// Mobile burger menu
// =============================================================
function initBurger() {
  const burger = document.getElementById('burger');
  const nav = document.querySelector('.nav');
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', isOpen);
  });
  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// =============================================================
// Contact form (demo — tidak ada backend, mailto fallback)
// =============================================================
function initContactForm(data) {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = 'Mohon lengkapi semua field.';
      return;
    }

    const subject = encodeURIComponent(`Pesan dari Portofolio — ${name}`);
    const body = encodeURIComponent(`${message}\n\nDari: ${name} (${email})`);
    window.location.href = `mailto:${data.profile.email}?subject=${subject}&body=${body}`;

    status.textContent = 'Membuka aplikasi email kamu...';
    form.reset();
  });
}

// =============================================================
// Init
// =============================================================
document.getElementById('year').textContent = new Date().getFullYear();

(async function init() {
  const data = await loadData();
  if (!data) return;

  renderProfile(data);
  renderEducation(data);
  renderSkills(data);
  renderProjects(data);
  renderExperience(data);
  renderContact(data);

  initScrollTrace();
  initSkillReveal();
  initBurger();
  initContactForm(data);
})();
