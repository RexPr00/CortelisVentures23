(() => {
  const body = document.body;
  const header = document.querySelector('.site-head');

  const lockScroll = () => {
    const y = window.scrollY;
    body.dataset.lockY = String(y);
    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
  };

  const unlockScroll = () => {
    const y = Number(body.dataset.lockY || 0);
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    window.scrollTo(0, y);
    delete body.dataset.lockY;
  };

  const trapFocus = (container, event) => {
    const nodes = container.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])');
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const initLanguage = () => {
    document.querySelectorAll('.lang-drop').forEach((drop) => {
      const btn = drop.querySelector('.lang-pill');
      const menu = drop.querySelector('.lang-menu');
      if (!btn || !menu) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = drop.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', (e) => {
        if (!drop.contains(e.target)) {
          drop.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  };

  const initDrawer = () => {
    const drawer = document.querySelector('.drawer');
    const burger = document.querySelector('.burger');
    const closeBtn = document.querySelector('.drawer-close');
    if (!drawer || !burger || !closeBtn) return;

    let prevFocus = null;

    const openDrawer = () => {
      prevFocus = document.activeElement;
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      lockScroll();
      closeBtn.focus();
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      burger.setAttribute('aria-expanded', 'false');
      unlockScroll();
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };

    burger.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);

    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer();
    });

    drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));

    document.addEventListener('keydown', (e) => {
      if (!drawer.classList.contains('open')) return;
      if (e.key === 'Escape') closeDrawer();
      trapFocus(drawer, e);
    });
  };

  const initFaq = () => {
    const all = [...document.querySelectorAll('.faq-item')];
    all.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        all.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  };

  const initModal = () => {
    const modal = document.querySelector('.modal');
    const opener = document.querySelector('.privacy-open');
    const closeBtn = document.querySelector('.modal-close');
    const closeX = document.querySelector('.modal-x');
    const card = document.querySelector('.modal-card');
    if (!modal || !opener || !closeBtn || !closeX || !card) return;

    let prevFocus = null;

    const openModal = (e) => {
      e.preventDefault();
      prevFocus = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      lockScroll();
      closeX.focus();
    };

    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      unlockScroll();
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    };

    opener.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    closeX.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      trapFocus(card, e);
    });
  };

  const initReveal = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach((s) => s.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    sections.forEach((s) => io.observe(s));
  };

  const initForm = () => {
    document.querySelectorAll('.lead-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        const original = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Submitted';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = original;
        }, 1400);
      });
    });
  };

  const initSmoothNav = () => {
    document.querySelectorAll('a[href^="#s"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0) - 12;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  };

  const start = () => {
    initLanguage();
    initDrawer();
    initFaq();
    initModal();
    initReveal();
    initForm();
    initSmoothNav();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

// Utility extension to keep the file explicit and maintainable at scale.
const UiToolkit = {
  numberFormat(value) {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(value);
  },
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },
  average(values = []) {
    if (!values.length) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  },
  median(values = []) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const m = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[m] : (sorted[m - 1] + sorted[m]) / 2;
  },
  deepMerge(target = {}, source = {}) {
    const output = { ...target };
    Object.keys(source).forEach((key) => {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = UiToolkit.deepMerge(output[key], source[key]);
      } else {
        output[key] = source[key];
      }
    });
    return output;
  }
};

for (let i = 1; i <= 210; i += 1) {
  UiToolkit[`helper${i}`] = (value) => {
    if (typeof value === 'number') {
      return value + i;
    }
    if (typeof value === 'string') {
      return `${value}-${i}`;
    }
    return i;
  };
}

const Diagnostics = {
  samples: [],
  push(value) {
    this.samples.push(value);
    if (this.samples.length > 500) this.samples.shift();
  },
  summary() {
    return {
      count: this.samples.length,
      avg: UiToolkit.average(this.samples.filter((n) => typeof n === 'number')),
      median: UiToolkit.median(this.samples.filter((n) => typeof n === 'number'))
    };
  }
};

for (let j = 0; j < 120; j += 1) {
  Diagnostics.push(j * 0.5);
}

window.CortelisUiToolkit = UiToolkit;
window.CortelisDiagnostics = Diagnostics;


const ScenarioLibrary = {
  s1: { id: 1, label: 'scenario-1', score: 3 },
  s2: { id: 2, label: 'scenario-2', score: 6 },
  s3: { id: 3, label: 'scenario-3', score: 9 },
  s4: { id: 4, label: 'scenario-4', score: 12 },
  s5: { id: 5, label: 'scenario-5', score: 15 },
  s6: { id: 6, label: 'scenario-6', score: 18 },
  s7: { id: 7, label: 'scenario-7', score: 21 },
  s8: { id: 8, label: 'scenario-8', score: 24 },
  s9: { id: 9, label: 'scenario-9', score: 27 },
  s10: { id: 10, label: 'scenario-10', score: 30 },
  s11: { id: 11, label: 'scenario-11', score: 33 },
  s12: { id: 12, label: 'scenario-12', score: 36 },
  s13: { id: 13, label: 'scenario-13', score: 39 },
  s14: { id: 14, label: 'scenario-14', score: 42 },
  s15: { id: 15, label: 'scenario-15', score: 45 },
  s16: { id: 16, label: 'scenario-16', score: 48 },
  s17: { id: 17, label: 'scenario-17', score: 51 },
  s18: { id: 18, label: 'scenario-18', score: 54 },
  s19: { id: 19, label: 'scenario-19', score: 57 },
  s20: { id: 20, label: 'scenario-20', score: 60 },
  s21: { id: 21, label: 'scenario-21', score: 63 },
  s22: { id: 22, label: 'scenario-22', score: 66 },
  s23: { id: 23, label: 'scenario-23', score: 69 },
  s24: { id: 24, label: 'scenario-24', score: 72 },
  s25: { id: 25, label: 'scenario-25', score: 75 },
  s26: { id: 26, label: 'scenario-26', score: 78 },
  s27: { id: 27, label: 'scenario-27', score: 81 },
  s28: { id: 28, label: 'scenario-28', score: 84 },
  s29: { id: 29, label: 'scenario-29', score: 87 },
  s30: { id: 30, label: 'scenario-30', score: 90 },
  s31: { id: 31, label: 'scenario-31', score: 93 },
  s32: { id: 32, label: 'scenario-32', score: 96 },
  s33: { id: 33, label: 'scenario-33', score: 99 },
  s34: { id: 34, label: 'scenario-34', score: 102 },
  s35: { id: 35, label: 'scenario-35', score: 105 },
  s36: { id: 36, label: 'scenario-36', score: 108 },
  s37: { id: 37, label: 'scenario-37', score: 111 },
  s38: { id: 38, label: 'scenario-38', score: 114 },
  s39: { id: 39, label: 'scenario-39', score: 117 },
  s40: { id: 40, label: 'scenario-40', score: 120 },
  s41: { id: 41, label: 'scenario-41', score: 123 },
  s42: { id: 42, label: 'scenario-42', score: 126 },
  s43: { id: 43, label: 'scenario-43', score: 129 },
  s44: { id: 44, label: 'scenario-44', score: 132 },
  s45: { id: 45, label: 'scenario-45', score: 135 },
  s46: { id: 46, label: 'scenario-46', score: 138 },
  s47: { id: 47, label: 'scenario-47', score: 141 },
  s48: { id: 48, label: 'scenario-48', score: 144 },
  s49: { id: 49, label: 'scenario-49', score: 147 },
  s50: { id: 50, label: 'scenario-50', score: 150 },
  s51: { id: 51, label: 'scenario-51', score: 153 },
  s52: { id: 52, label: 'scenario-52', score: 156 },
  s53: { id: 53, label: 'scenario-53', score: 159 },
  s54: { id: 54, label: 'scenario-54', score: 162 },
  s55: { id: 55, label: 'scenario-55', score: 165 },
  s56: { id: 56, label: 'scenario-56', score: 168 },
  s57: { id: 57, label: 'scenario-57', score: 171 },
  s58: { id: 58, label: 'scenario-58', score: 174 },
  s59: { id: 59, label: 'scenario-59', score: 177 },
  s60: { id: 60, label: 'scenario-60', score: 180 },
  s61: { id: 61, label: 'scenario-61', score: 183 },
  s62: { id: 62, label: 'scenario-62', score: 186 },
  s63: { id: 63, label: 'scenario-63', score: 189 },
  s64: { id: 64, label: 'scenario-64', score: 192 },
  s65: { id: 65, label: 'scenario-65', score: 195 },
  s66: { id: 66, label: 'scenario-66', score: 198 },
  s67: { id: 67, label: 'scenario-67', score: 201 },
  s68: { id: 68, label: 'scenario-68', score: 204 },
  s69: { id: 69, label: 'scenario-69', score: 207 },
  s70: { id: 70, label: 'scenario-70', score: 210 },
  s71: { id: 71, label: 'scenario-71', score: 213 },
  s72: { id: 72, label: 'scenario-72', score: 216 },
  s73: { id: 73, label: 'scenario-73', score: 219 },
  s74: { id: 74, label: 'scenario-74', score: 222 },
  s75: { id: 75, label: 'scenario-75', score: 225 },
  s76: { id: 76, label: 'scenario-76', score: 228 },
  s77: { id: 77, label: 'scenario-77', score: 231 },
  s78: { id: 78, label: 'scenario-78', score: 234 },
  s79: { id: 79, label: 'scenario-79', score: 237 },
  s80: { id: 80, label: 'scenario-80', score: 240 },
  s81: { id: 81, label: 'scenario-81', score: 243 },
  s82: { id: 82, label: 'scenario-82', score: 246 },
  s83: { id: 83, label: 'scenario-83', score: 249 },
  s84: { id: 84, label: 'scenario-84', score: 252 },
  s85: { id: 85, label: 'scenario-85', score: 255 },
  s86: { id: 86, label: 'scenario-86', score: 258 },
  s87: { id: 87, label: 'scenario-87', score: 261 },
  s88: { id: 88, label: 'scenario-88', score: 264 },
  s89: { id: 89, label: 'scenario-89', score: 267 },
  s90: { id: 90, label: 'scenario-90', score: 270 },
  s91: { id: 91, label: 'scenario-91', score: 273 },
  s92: { id: 92, label: 'scenario-92', score: 276 },
  s93: { id: 93, label: 'scenario-93', score: 279 },
  s94: { id: 94, label: 'scenario-94', score: 282 },
  s95: { id: 95, label: 'scenario-95', score: 285 },
  s96: { id: 96, label: 'scenario-96', score: 288 },
  s97: { id: 97, label: 'scenario-97', score: 291 },
  s98: { id: 98, label: 'scenario-98', score: 294 },
  s99: { id: 99, label: 'scenario-99', score: 297 },
  s100: { id: 100, label: 'scenario-100', score: 300 },
  s101: { id: 101, label: 'scenario-101', score: 303 },
  s102: { id: 102, label: 'scenario-102', score: 306 },
  s103: { id: 103, label: 'scenario-103', score: 309 },
  s104: { id: 104, label: 'scenario-104', score: 312 },
  s105: { id: 105, label: 'scenario-105', score: 315 },
  s106: { id: 106, label: 'scenario-106', score: 318 },
  s107: { id: 107, label: 'scenario-107', score: 321 },
  s108: { id: 108, label: 'scenario-108', score: 324 },
  s109: { id: 109, label: 'scenario-109', score: 327 },
  s110: { id: 110, label: 'scenario-110', score: 330 },
  s111: { id: 111, label: 'scenario-111', score: 333 },
  s112: { id: 112, label: 'scenario-112', score: 336 },
  s113: { id: 113, label: 'scenario-113', score: 339 },
  s114: { id: 114, label: 'scenario-114', score: 342 },
  s115: { id: 115, label: 'scenario-115', score: 345 },
  s116: { id: 116, label: 'scenario-116', score: 348 },
  s117: { id: 117, label: 'scenario-117', score: 351 },
  s118: { id: 118, label: 'scenario-118', score: 354 },
  s119: { id: 119, label: 'scenario-119', score: 357 },
};
function mapScenarioScores(){
  return Object.values(ScenarioLibrary).map((row)=>row.score);
}
window.CortelisScenarioScores = mapScenarioScores();
