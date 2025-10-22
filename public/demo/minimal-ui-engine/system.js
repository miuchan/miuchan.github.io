import { createApp, createSignal, h } from './engine.js';

const [getSteps, setSteps] = createSignal([
  {
    id: 'engine-primitives',
    title: '构建 UI 原语',
    detail: '组合 createSignal、effect 与 h()，提供可组合的 UI 内核。',
    status: 'ready'
  },
  {
    id: 'render-loop',
    title: '连接渲染循环',
    detail: '以 createApp() 绑定根节点，响应状态变化重新绘制。',
    status: 'ready'
  },
  {
    id: 'minimal-system',
    title: '部署最小系统',
    detail: '将引擎 primitives 映射为状态面板、流程与事件流。',
    status: 'ready'
  }
]);

const [getFocus, setFocus] = createSignal('engine');
const [getPulse, setPulse] = createSignal(0);
const [getLogs, setLogs] = createSignal([
  {
    id: 'boot',
    time: nowLabel(),
    message: 'Mini UI Engine 启动完成，等待指令。'
  }
]);

const stackOutline = [
  {
    id: 'signal',
    title: 'Signal · createSignal()',
    detail: '声明响应式状态容器，驱动 UI 渲染刷新。'
  },
  {
    id: 'effect',
    title: 'Effect · effect(fn)',
    detail: '追踪依赖并在状态变化时重新执行计算。'
  },
  {
    id: 'element',
    title: 'Element · h(tag, props, ...children)',
    detail: '描述 UI 节点与属性，将状态映射为界面。'
  }
];

setInterval(() => {
  setPulse((value) => value + 1);
  logEvent('引擎脉冲同步完成。');
}, 4200);

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function logEvent(message) {
  const entry = { id: `${Date.now()}-${Math.random()}`, time: nowLabel(), message };
  setLogs((prev) => [entry, ...prev].slice(0, 8));
}

function toggleStep(stepId) {
  setSteps((prev) =>
    prev.map((step) => {
      if (step.id !== stepId) return step;
      const nextStatus = step.status === 'complete' ? 'ready' : 'complete';
      const verb = nextStatus === 'complete' ? '完成' : '重置';
      logEvent(`${verb}「${step.title}」步骤。`);
      return { ...step, status: nextStatus };
    })
  );
}

function activateFocus(mode) {
  setFocus((prev) => {
    if (prev !== mode) {
      const focusNames = {
        engine: 'UI 引擎状态',
        system: '系统编排图',
        timeline: '事件时间线'
      };
      logEvent(`切换到 ${focusNames[mode]}。`);
    }
    return mode;
  });
}

const focusCopy = {
  engine: [
    { label: 'Signal', value: 'createSignal()', description: '管理可读可写状态，触发响应式渲染。' },
    { label: 'Effect', value: 'effect(fn)', description: '追踪读取依赖，状态更新时重新执行。' },
    { label: 'Element', value: 'h(tag, props, ...children)', description: '使用声明式树描述 UI 结构。' }
  ],
  system: [
    { label: 'Orbit', value: '状态面板', description: '实时呈现引擎脉冲、步骤进度与组件数量。' },
    { label: 'Process', value: '执行剧本', description: '根据步骤清单推进 UI 构建的关键路径。' },
    { label: 'Stream', value: '日志总线', description: '记录每次操作与引擎脉冲，便于回溯。' }
  ],
  timeline: [
    { label: 'T+0', value: 'Boot', description: '引擎完成初始化并广播第一条日志。' },
    { label: 'T+Δ', value: 'Step Update', description: '切换步骤状态触发新的渲染周期。' },
    { label: 'T+n', value: 'Pulse Broadcast', description: '定时脉冲更新指标，模拟系统心跳。' }
  ]
};

function view() {
  const steps = getSteps();
  const focus = getFocus();
  const logs = getLogs();
  const completedSteps = steps.filter((step) => step.status === 'complete').length;

  const metrics = [
    { label: '引擎脉冲', value: getPulse(), hint: '基于 setInterval() 的心跳计数。' },
    { label: '已完成步骤', value: completedSteps, hint: '在最小系统中完成的构建环节。' },
    { label: '日志事件', value: logs.length, hint: '最近保留的系统事件条目。' }
  ];

  return h(
    'div',
    { class: 'app-shell' },
    h(
      'section',
      { class: 'panel status-panel' },
      h(
        'header',
        { class: 'panel-header' },
        h('h2', { class: 'panel-title' }, '最小 UI 引擎状态'),
        h('p', { class: 'panel-subtitle' }, '实时追踪微型 UI 引擎的脉冲与运行节奏。')
      ),
      h(
        'div',
        { class: 'status-metrics' },
        metrics.map((metric) =>
          h(
            'article',
            { class: 'metric-card' },
            h('span', { class: 'metric-label' }, metric.label),
            h('span', { class: 'metric-value' }, metric.value),
            h('p', { class: 'metric-hint' }, metric.hint)
          )
        )
      )
    ),
    h(
      'section',
      { class: 'panel script-panel' },
      h(
        'header',
        { class: 'panel-header' },
        h('h2', { class: 'panel-title' }, '构建剧本'),
        h('p', { class: 'panel-subtitle' }, '按序列执行构建步骤，确保最小系统稳定上线。')
      ),
      h(
        'ul',
        { class: 'step-list' },
        steps.map((step, index) =>
          h(
            'li',
            { class: 'step-item' },
            h(
              'div',
              { class: 'step-info' },
              h('span', { class: 'step-index' }, `0${index + 1}`),
              h(
                'div',
                null,
                h('strong', null, step.title),
                h('p', { class: 'muted' }, step.detail)
              )
            ),
            h(
              'button',
              {
                type: 'button',
                class: 'step-action',
                onClick: () => toggleStep(step.id),
                'aria-pressed': step.status === 'complete'
              },
              step.status === 'complete' ? '已完成' : '标记完成'
            )
          )
        )
      )
    ),
    h(
      'section',
      { class: 'panel focus-panel' },
      h(
        'header',
        { class: 'panel-header' },
        h('h2', { class: 'panel-title' }, '系统焦点'),
        h('p', { class: 'panel-subtitle' }, '切换关注模式，检视引擎、系统与时间线的不同视角。')
      ),
      h(
        'div',
        { class: 'focus-tabs', role: 'tablist' },
        ['engine', 'system', 'timeline'].map((mode) =>
          h(
            'button',
            {
              type: 'button',
              role: 'tab',
              class: 'focus-tab',
              onClick: () => activateFocus(mode),
              'aria-pressed': focus === mode
            },
            mode === 'engine' ? '引擎' : mode === 'system' ? '系统' : '时间线'
          )
        )
      ),
      h(
        'div',
        { class: 'focus-grid', role: 'region', 'aria-live': 'polite' },
        focusCopy[focus].map((item) =>
          h(
            'article',
            { class: 'focus-card' },
            h('strong', { class: 'focus-title' }, `${item.label} · ${item.value}`),
            h('p', { class: 'focus-detail' }, item.description)
          )
        )
      )
    ),
    h(
      'section',
      { class: 'panel stack-panel' },
      h(
        'header',
        { class: 'panel-header' },
        h('h2', { class: 'panel-title' }, '系统栈'),
        h('p', { class: 'panel-subtitle' }, '核心原语组成的运行基座，保障信号与渲染协同。')
      ),
      h(
        'ul',
        { class: 'stack-list' },
        stackOutline.map((item) =>
          h(
            'li',
            { class: 'stack-item' },
            h('span', { class: 'stack-title' }, item.title),
            h('p', { class: 'stack-detail' }, item.detail)
          )
        )
      )
    ),
    h(
      'section',
      { class: 'panel log-panel' },
      h(
        'header',
        { class: 'panel-header' },
        h('h2', { class: 'panel-title' }, '事件流'),
        h('p', { class: 'panel-subtitle' }, '记录脉冲广播与操作指令，构成调试与回溯基线。')
      ),
      h(
        'div',
        { class: 'log-stream', role: 'log', 'aria-live': 'polite' },
        logs.map((entry) =>
          h(
            'article',
            { class: 'log-entry' },
            h('span', { class: 'log-time' }, entry.time),
            h('p', { class: 'log-message' }, entry.message)
          )
        )
      )
    )
  );
}

createApp('#app', view);
