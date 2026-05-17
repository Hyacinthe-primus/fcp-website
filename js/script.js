const htmlEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('fcp-theme', theme);
}

(function () {
    const saved = localStorage.getItem('fcp-theme');
    if (saved === 'light' || saved === 'dark') {
        htmlEl.setAttribute('data-theme', saved);
    }
})();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
});

const btt = document.getElementById('back-to-top');
if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 400));
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const toggle = document.getElementById('mobile-toggle');
const nav    = document.getElementById('main-nav');
if (toggle && nav) {
    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    document.addEventListener('click', e => {
        if (header && !header.contains(e.target)) nav.classList.remove('open');
    });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const group = btn.closest('.formats-section') || document;
        group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        group.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
    });
});

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const block = btn.closest('.code-block');
        const code  = block ? block.querySelector('code')?.textContent : '';
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
            });
        }
    });
});

const docHeadings = document.querySelectorAll('.docs-content h2[id], .docs-content h3[id]');
const docLinks    = document.querySelectorAll('.docs-nav a');
if (docHeadings.length && docLinks.length) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                docLinks.forEach(l => l.classList.remove('active'));
                const link = document.querySelector(`.docs-nav a[href="#${entry.target.id}"]`);
                if (link) link.classList.add('active');
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px' });
    docHeadings.forEach(h => observer.observe(h));
}

const modal        = document.getElementById('donation-modal');
const modalClose   = document.getElementById('modal-close');
const modalSkip    = document.getElementById('modal-skip');
const dlStarting   = document.getElementById('download-starting');

function openModal() {
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}
function closeModal() {
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

document.querySelectorAll('.download-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        const href = btn.getAttribute('data-href');
        openModal();
        modal.dataset.downloadHref = href || '';
    });
});

function startDownload() {
    const href = modal ? modal.dataset.downloadHref : '';
    if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    if (dlStarting) dlStarting.classList.add('visible');
    setTimeout(closeModal, 2200);
}

if (modalClose) modalClose.addEventListener('click', () => { startDownload(); });
if (modalSkip)  modalSkip.addEventListener('click',  () => { startDownload(); });

if (modal) {
    modal.addEventListener('click', e => {
        if (e.target === modal) { startDownload(); }
    });
}

const kofiBtn = document.getElementById('modal-kofi-btn');
if (kofiBtn) {
    kofiBtn.addEventListener('click', () => {
        startDownload();
    });
}

function animateCount(el, target, duration) {
    const start = 0;
    const startTime = performance.now();
    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const countEl = document.getElementById('dl-count');
if (countEl) {
    fetch('https://api.github.com/repos/Hyacinthe-primus/File_Converter_Pro/releases', {
        headers: { 'Accept': 'application/vnd.github+json' }
    })
    .then(r => r.json())
    .then(releases => {
        if (!Array.isArray(releases)) return;
        const total = releases.reduce((sum, release) => {
            return sum + (release.assets || []).reduce((s, a) => s + (a.download_count || 0), 0);
        }, 0);
        if (total > 0) {
            const observer = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    animateCount(countEl, total, 1200);
                    observer.disconnect();
                }
            });
            observer.observe(countEl);
        }
    })
    .catch(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateCount(countEl, parseInt(countEl.textContent.replace(/,/g, '')) || 669, 1200);
                observer.disconnect();
            }
        });
        observer.observe(countEl);
    });
}
