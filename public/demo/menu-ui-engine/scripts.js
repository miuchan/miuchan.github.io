const counters = document.querySelectorAll('[data-role="stat-value"]');
const duration = 1600;

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

const animateCounters = () => {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || '0');
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.round(target * easeOutCubic(progress));
      counter.textContent = value.toString();
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  });
};

const initTabs = () => {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (tab.classList.contains('is-active')) return;

      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach((panel) => {
        panel.classList.remove('is-active');
        panel.hidden = true;
      });

      const target = tab.dataset.target;
      const panel = document.querySelector(`#panel-${target}`);

      if (panel) {
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        panel.classList.add('is-active');
        panel.hidden = false;
      }
    });
  });
};

const refreshButton = document.querySelector('.events .icon-button');
const eventFeed = document.getElementById('event-feed');

const generateEvent = () => {
  if (!eventFeed) return;

  const now = new Date();
  const time = now.toTimeString().slice(0, 8);
  const templates = [
    {
      title: 'Signal sweep',
      desc: '扫描最新脉冲，重置 3 个冷却中的 signal。',
    },
    {
      title: 'Effect batch commit',
      desc: '批量提交 effect 队列，耗时 7.4ms。',
    },
    {
      title: 'Element diff',
      desc: '比较虚拟树差异，应用 12 个 patch。',
    },
    {
      title: 'Store checkpoint',
      desc: '写入 menu.snapshot，存储最新交互状态。',
    },
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  const item = document.createElement('li');
  item.innerHTML = `
    <span class="event__time">${time}</span>
    <div>
      <p class="event__title">${template.title}</p>
      <p class="event__desc">${template.desc}</p>
    </div>
  `;

  eventFeed.prepend(item);
  const items = eventFeed.querySelectorAll('li');
  if (items.length > 6) {
    items[items.length - 1].remove();
  }
};

refreshButton?.addEventListener('click', () => {
  generateEvent();
});

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

window.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  initTabs();
});
