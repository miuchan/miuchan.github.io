const agendaForm = document.getElementById('agendaForm');
const agendaTimeline = document.getElementById('agendaTimeline');
const decisionLog = document.getElementById('decisionLog');
const exportButton = document.getElementById('exportButton');
const exportPreview = document.getElementById('exportPreview');
const insightList = document.getElementById('insightList');

const alignmentSlider = document.getElementById('alignmentSlider');
const incentiveSlider = document.getElementById('incentiveSlider');
const readinessSlider = document.getElementById('readinessSlider');
const alignmentScore = document.getElementById('alignmentScore');
const incentiveScore = document.getElementById('incentiveScore');
const readinessScore = document.getElementById('readinessScore');

const state = {
  agenda: [],
  metrics: {
    alignment: parseInt(alignmentSlider?.value ?? '82', 10),
    incentive: parseInt(incentiveSlider?.value ?? '76', 10),
    readiness: parseInt(readinessSlider?.value ?? '64', 10)
  },
  decisions: [
    {
      title: 'Adopt Atlas 2025 rituals',
      owner: 'Miu',
      outcome: 'Approved with amendments to include partner intake.',
      timestamp: timestampLabel()
    },
    {
      title: 'Launch Helium beta cohort',
      owner: 'Sora',
      outcome: 'Scheduled with telemetry guardrails and council review checkpoints.',
      timestamp: timestampLabel(-17)
    }
  ]
};

function timestampLabel(offsetMinutes = 0) {
  const date = new Date(Date.now() + offsetMinutes * 60 * 1000);
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
}

function renderAgenda() {
  if (!agendaTimeline) return;
  if (state.agenda.length === 0) {
    agendaTimeline.innerHTML = `<p class="tagline">尚未添加仪式议程。使用左侧表单创建一条。</p>`;
    return;
  }

  let cursor = 0;
  agendaTimeline.innerHTML = state.agenda
    .map((item, index) => {
      const start = minutesToLabel(cursor);
      cursor += item.duration;
      const end = minutesToLabel(cursor);
      return `
        <article class="timeline-item">
          <time>${start} - ${end}</time>
          <strong>${item.topic}</strong>
          <span class="tagline">${item.owner} · ${item.duration} 分钟</span>
        </article>
      `;
    })
    .join('');
}

function minutesToLabel(totalMinutes) {
  const baseHour = 10;
  const hours = Math.floor((baseHour * 60 + totalMinutes) / 60);
  const minutes = (baseHour * 60 + totalMinutes) % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function renderDecisions() {
  if (!decisionLog) return;
  decisionLog.innerHTML = state.decisions
    .map(
      (entry) => `
        <div class="list-item">
          <strong>${entry.title}</strong>
          <span class="tagline">${entry.timestamp} · ${entry.owner}</span>
          <span class="tagline">${entry.outcome}</span>
        </div>
      `
    )
    .join('');
}

function renderInsights() {
  if (!insightList) return;
  const { alignment, incentive, readiness } = state.metrics;
  const insights = [];

  if (alignment >= 85) {
    insights.push('联盟对齐度高，适合引入新的跨节点实验。');
  } else if (alignment <= 65) {
    insights.push('建议安排额外的回顾仪式以补强对齐度。');
  }

  if (incentive >= 80) {
    insights.push('激励循环健康，可扩展共建预算。');
  } else if (incentive < 60) {
    insights.push('重新审视激励分配，避免伙伴贡献被稀释。');
  }

  if (readiness >= 70) {
    insights.push('执行团队已就绪，能够承担下一轮发布节奏。');
  } else {
    insights.push('在启动重大任务前，需补齐执行资源或培训。');
  }

  insightList.innerHTML = insights
    .map((text) => `<div class="list-item" role="note"><span class="tagline">${text}</span></div>`)
    .join('');
}

function attachFormHandlers() {
  agendaForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const topic = document.getElementById('agendaTopic')?.value.trim();
    const owner = document.getElementById('agendaOwner')?.value.trim();
    const duration = parseInt(document.getElementById('agendaDuration')?.value ?? '0', 10);
    if (!topic || !owner || !duration) return;

    state.agenda.push({ topic, owner, duration });
    state.decisions.unshift({
      title: `Agenda added: ${topic}`,
      owner,
      outcome: `Allocated ${duration} 分钟给 ${owner}。`,
      timestamp: timestampLabel()
    });
    if (state.decisions.length > 8) state.decisions.length = 8;

    renderAgenda();
    renderDecisions();
    exportPreview.textContent = '';
    agendaForm.reset();
    document.getElementById('agendaDuration').value = '25';
  });
}

function attachMetricHandlers() {
  const bindings = [
    { slider: alignmentSlider, label: alignmentScore, key: 'alignment' },
    { slider: incentiveSlider, label: incentiveScore, key: 'incentive' },
    { slider: readinessSlider, label: readinessScore, key: 'readiness' }
  ];

  bindings.forEach(({ slider, label, key }) => {
    slider?.addEventListener('input', (event) => {
      const value = parseInt(event.target.value, 10);
      state.metrics[key] = value;
      if (label) {
        label.textContent = `${value}%`;
      }
      state.decisions.unshift({
        title: `${key.charAt(0).toUpperCase() + key.slice(1)} score updated`,
        owner: 'Council Studio',
        outcome: `新值：${value}%`,
        timestamp: timestampLabel()
      });
      if (state.decisions.length > 8) state.decisions.length = 8;
      renderInsights();
      renderDecisions();
    });
  });
}

function attachExportHandler() {
  exportButton?.addEventListener('click', () => {
    const snapshot = {
      generatedAt: new Date().toISOString(),
      agenda: state.agenda,
      metrics: state.metrics,
      decisions: state.decisions
    };
    const json = JSON.stringify(snapshot, null, 2);
    exportPreview.textContent = json.slice(0, 260) + (json.length > 260 ? '\n…' : '');

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `council-studio-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

renderAgenda();
renderDecisions();
renderInsights();
attachFormHandlers();
attachMetricHandlers();
attachExportHandler();
