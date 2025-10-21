const DEFAULT_REGISTRY_URL = '../../formal/compute_god_standard_model.json';

const REQUIRED_FIELDS = [
  'name',
  'sector',
  'statistics',
  'chirality',
  'multiplet',
  'representations',
  't3',
  'hypercharge',
  'charge',
  'baryon_number',
  'lepton_number',
  'mass_range',
  'spin'
];

const REPRESENTATION_DIMENSIONS = {
  su2: {
    singlet: 1,
    doublet: 2,
    triplet: 3
  },
  su3: {
    singlet: 1,
    fundamental: 3,
    antifundamental: 3,
    adjoint: 8
  }
};

const REPRESENTATION_DYNKIN = {
  su2: {
    singlet: 0,
    doublet: 0.5,
    triplet: 2
  },
  su3: {
    singlet: 0,
    fundamental: 0.5,
    antifundamental: 0.5,
    adjoint: 3
  }
};

const heroStatus = document.getElementById('hero-status');
const summaryContainer = document.getElementById('dataset-summary');
const reportOutput = document.getElementById('report-output');
const reportJson = document.getElementById('report-json');
const datasetEditor = document.getElementById('dataset-editor');
const fileInput = document.getElementById('file-input');

const loadDefaultButton = document.getElementById('load-default');
const openFilePickerButton = document.getElementById('open-file-picker');
const runFromEditorButton = document.getElementById('run-from-editor');

let lastSourceLabel = '默认数据集';

function setHeroStatus(text, variant = 'idle') {
  heroStatus.textContent = text;
  heroStatus.className = 'hero__status';
  if (variant === 'loading') {
    heroStatus.classList.add('hero__status--loading');
  } else if (variant === 'pass') {
    heroStatus.classList.add('hero__status--pass');
  } else if (variant === 'fail') {
    heroStatus.classList.add('hero__status--fail');
  }
}

loadDefaultButton.addEventListener('click', async () => {
  setHeroStatus('正在载入默认登记表…', 'loading');
  try {
    const response = await fetch(DEFAULT_REGISTRY_URL);
    if (!response.ok) {
      throw new Error(`无法读取默认数据：HTTP ${response.status}`);
    }
    const data = await response.json();
    lastSourceLabel = 'formal/compute_god_standard_model.json';
    runValidationPipeline(data);
    if (!datasetEditor.value.trim()) {
      datasetEditor.value = JSON.stringify(data, null, 2);
    }
  } catch (error) {
    handleError(error);
  }
});

openFilePickerButton.addEventListener('click', () => {
  fileInput.value = '';
  fileInput.click();
});

fileInput.addEventListener('change', async (event) => {
  const [file] = event.target.files ?? [];
  if (!file) {
    return;
  }
  setHeroStatus(`正在读取 ${file.name}…`, 'loading');
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    lastSourceLabel = file.name;
    datasetEditor.value = JSON.stringify(data, null, 2);
    runValidationPipeline(data);
  } catch (error) {
    handleError(error);
  }
});

runFromEditorButton.addEventListener('click', () => {
  const content = datasetEditor.value.trim();
  if (!content) {
    setHeroStatus('编辑器为空，改为载入默认数据。', 'loading');
    loadDefaultButton.click();
    return;
  }
  try {
    const data = JSON.parse(content);
    lastSourceLabel = '编辑器内容';
    runValidationPipeline(data);
  } catch (error) {
    handleError(new Error(`JSON 解析失败：${error.message}`));
  }
});

function handleError(error) {
  console.error(error);
  setHeroStatus(`验证失败：${error.message}`, 'fail');
  summaryContainer.innerHTML = '<p class="placeholder">无法生成摘要。</p>';
  reportOutput.innerHTML = `<div class="section-card"><div class="section-card__title"><h3>错误</h3></div><p class="placeholder">${error.message}</p></div>`;
  const payload = {
    status: 'error',
    message: error.message
  };
  reportJson.textContent = JSON.stringify(payload, null, 2);
}

function runValidationPipeline(data) {
  const registry = normaliseRegistry(data);
  const summary = summariseRegistry(registry);
  renderSummary(summary);
  const report = validateRegistry(registry);
  renderReport(report, summary, lastSourceLabel);
  updateReportJson(report, summary);
  setHeroStatus(
    report.passed ? '验证通过：所有分节均通过。' : '验证完成：存在需关注的分节。',
    report.passed ? 'pass' : 'fail'
  );
}

function normaliseRegistry(data) {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new TypeError('登记表需为对象结构。');
  }
  const particles = ensureArray(data.particles ?? [], 'particles');
  const interactions = ensureArray(data.interactions ?? [], 'interactions');
  const constraints = ensureArray(data.constraints ?? [], 'constraints');
  const derivedStates = data.derived_states ?? {};
  if (derivedStates === null || typeof derivedStates !== 'object' || Array.isArray(derivedStates)) {
    throw new TypeError('derived_states 必须为对象。');
  }
  return {
    metadata: data.metadata ?? null,
    particles,
    interactions,
    constraints,
    derivedStates
  };
}

function ensureArray(value, label) {
  if (!Array.isArray(value)) {
    throw new TypeError(`${label} 必须是数组。`);
  }
  value.forEach((entry, index) => {
    if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new TypeError(`${label}[${index}] 必须为对象。`);
    }
  });
  return value;
}

function summariseRegistry(registry) {
  const sectorCounts = new Map();
  const statisticsCounts = new Map();
  for (const particle of registry.particles) {
    sectorCounts.set(particle.sector ?? '未标注', (sectorCounts.get(particle.sector ?? '未标注') ?? 0) + 1);
    statisticsCounts.set(
      particle.statistics ?? '未知',
      (statisticsCounts.get(particle.statistics ?? '未知') ?? 0) + 1
    );
  }

  const interactionChecks = { charge: 0, baryon: 0, lepton: 0, color: 0 };
  for (const interaction of registry.interactions) {
    const checks = new Set(Array.isArray(interaction.checks) ? interaction.checks : []);
    if (checks.has('electric_charge')) interactionChecks.charge += 1;
    if (checks.has('baryon_number')) interactionChecks.baryon += 1;
    if (checks.has('lepton_number')) interactionChecks.lepton += 1;
    if (checks.has('color')) interactionChecks.color += 1;
  }

  const constraintMetrics = [];
  for (const constraint of registry.constraints) {
    const value = toNumber(constraint.value);
    const prediction = toNumber(constraint.prediction);
    const uncertainty = toNumber(constraint.uncertainty);
    if (value === null || prediction === null || uncertainty === null || uncertainty <= 0) {
      continue;
    }
    const delta = Math.abs(prediction - value);
    const sigma = delta / uncertainty;
    constraintMetrics.push({ name: constraint.name ?? '未命名', sigma });
  }

  const maxSigma = constraintMetrics.reduce((acc, item) => Math.max(acc, item.sigma), 0);

  return {
    particleCount: registry.particles.length,
    interactionCount: registry.interactions.length,
    constraintCount: registry.constraints.length,
    derivedStateCount: Object.keys(registry.derivedStates).length,
    sectorCounts,
    statisticsCounts,
    interactionChecks,
    maxSigma,
    metadata: registry.metadata
  };
}

function renderSummary(summary) {
  if (!summaryContainer) return;
  summaryContainer.innerHTML = '';

  if (summary.particleCount === 0 && summary.interactionCount === 0 && summary.constraintCount === 0) {
    summaryContainer.innerHTML = '<p class="placeholder">未检测到粒子、相互作用或约束数据。</p>';
    return;
  }

  const sectorList = [...summary.sectorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([sector, count]) => `${sector} ×${count}`);

  const statisticsList = [...summary.statisticsCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([stat, count]) => `${stat} ×${count}`);

  const interactionDetails = [
    `电荷守恒：${summary.interactionChecks.charge}`,
    `重子守恒：${summary.interactionChecks.baryon}`,
    `轻子守恒：${summary.interactionChecks.lepton}`,
    `色荷守恒：${summary.interactionChecks.color}`
  ];

  summaryContainer.appendChild(
    createSummaryCard('粒子登记', `${summary.particleCount}`, () => {
      const list = document.createElement('ul');
      sectorList.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      const footer = document.createElement('p');
      footer.textContent = `统计性质：${statisticsList.join('，') || '未提供'}`;
      const fragment = document.createDocumentFragment();
      fragment.appendChild(list);
      fragment.appendChild(footer);
      return fragment;
    })
  );

  summaryContainer.appendChild(
    createSummaryCard('相互作用', `${summary.interactionCount}`, () => {
      const list = document.createElement('ul');
      interactionDetails.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      return list;
    })
  );

  summaryContainer.appendChild(
    createSummaryCard('实验约束', `${summary.constraintCount}`, () => {
      const block = document.createElement('p');
      block.textContent = summary.constraintCount
        ? `记录的最大偏差约为 ${summary.maxSigma.toFixed(2)}σ。`
        : '暂无实验约束条目。';
      return block;
    })
  );

  summaryContainer.appendChild(
    createSummaryCard('派生态', `${summary.derivedStateCount}`, () => {
      const block = document.createElement('p');
      block.textContent = summary.derivedStateCount
        ? '派生态可在交互验证中作为复合态调用。'
        : '未定义派生态，交互将仅引用基础粒子。';
      return block;
    })
  );
}

function createSummaryCard(title, metric, renderBody) {
  const card = document.createElement('article');
  card.className = 'summary-card';
  const heading = document.createElement('h3');
  heading.textContent = title;
  const value = document.createElement('div');
  value.className = 'metric';
  value.textContent = metric;
  card.appendChild(heading);
  card.appendChild(value);
  const body = renderBody();
  card.appendChild(body);
  return card;
}

function validateRegistry(registry) {
  const context = {
    registry,
    particleIndex: new Map(registry.particles.map((particle) => [particle.name, particle])),
    derivedStates: registry.derivedStates
  };

  const sections = [
    validateParticleFields(context),
    validateMultipletConsistency(context),
    validateChargeRelation(context),
    validateMassRanges(context),
    validateInteractions(context),
    validateAnomalies(context),
    validateConstraints(context)
  ];

  return {
    passed: sections.every((section) => section.passed),
    sections
  };
}

function validateParticleFields(context) {
  const messages = [];
  let issues = 0;
  for (const particle of context.registry.particles) {
    const name = particle.name ?? '<未命名粒子>';
    const missing = REQUIRED_FIELDS.filter((field) => !(field in particle));
    if (missing.length) {
      issues += 1;
      messages.push(`${name}：缺失字段 ${missing.join(', ')}`);
    }
    const representations = isObject(particle.representations) ? particle.representations : {};
    if (!isObject(particle.representations)) {
      issues += 1;
      messages.push(`${name}：representations 必须为对象。`);
    }
    for (const [group, allowed] of Object.entries(REPRESENTATION_DIMENSIONS)) {
      const rep = representations[group];
      if (!(rep in allowed)) {
        issues += 1;
        messages.push(`${name}：${group} 表示非法：${String(rep)}。`);
      }
    }
    const massRange = particle.mass_range;
    if (!isObject(massRange)) {
      issues += 1;
      messages.push(`${name}：mass_range 必须为对象。`);
    } else {
      if (!('lower' in massRange) || !('upper' in massRange)) {
        issues += 1;
        messages.push(`${name}：mass_range 需同时提供 lower 与 upper。`);
      }
    }
  }
  if (issues === 0) {
    messages.push('所有粒子均包含所需元数据与表示。');
  }
  return createSection('粒子字段', issues === 0, messages);
}

function validateMultipletConsistency(context) {
  const messages = [];
  let issues = 0;
  const seen = new Map();
  for (const particle of context.registry.particles) {
    const key = `${particle.multiplet ?? 'unknown'}::${particle.generation ?? 0}`;
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, particle);
      continue;
    }
    for (const attr of ['hypercharge', 'representations', 'statistics', 'chirality']) {
      if (!deepEqual(particle[attr], existing[attr])) {
        issues += 1;
        messages.push(`${particle.name ?? '<未命名粒子>'}：同多重态字段 ${attr} 不一致。`);
      }
    }
  }
  if (issues === 0) {
    messages.push('多重态分配在各组分间保持一致。');
  }
  return createSection('多重态一致性', issues === 0, messages);
}

function validateChargeRelation(context) {
  const messages = [];
  let failures = 0;
  for (const particle of context.registry.particles) {
    if (particle.validate_charge_relation === false) {
      continue;
    }
    const name = particle.name ?? '<未命名粒子>';
    const t3 = toNumber(particle.t3);
    const hypercharge = toNumber(particle.hypercharge);
    const charge = toNumber(particle.charge);
    if (t3 === null || hypercharge === null || charge === null) {
      failures += 1;
      messages.push(`${name}：T3/超荷/电荷需为数值。`);
      continue;
    }
    const expected = t3 + hypercharge / 2;
    if (!isClose(expected, charge)) {
      failures += 1;
      messages.push(`${name}：电荷 ${charge} 与 Q = T3 + Y/2 (${expected}) 不符。`);
    }
  }
  if (failures === 0) {
    messages.push('所有粒子满足电荷量子化关系 Q = T3 + Y/2。');
  }
  return createSection('电荷量子化', failures === 0, messages);
}

function validateMassRanges(context) {
  const messages = [];
  let failures = 0;
  for (const particle of context.registry.particles) {
    const name = particle.name ?? '<未命名粒子>';
    const massRange = isObject(particle.mass_range) ? particle.mass_range : null;
    if (!massRange) {
      failures += 1;
      messages.push(`${name}：mass_range 必须为对象。`);
      continue;
    }
    const lower = toNumber(massRange.lower);
    const upper = toNumber(massRange.upper);
    if (lower === null || upper === null) {
      failures += 1;
      messages.push(`${name}：质量上下界需为数值。`);
      continue;
    }
    if (lower > upper) {
      failures += 1;
      messages.push(`${name}：质量下界 ${lower} 大于上界 ${upper}。`);
    }
    if (lower < 0 || upper < 0) {
      failures += 1;
      messages.push(`${name}：质量区间需为非负数。`);
    }
  }
  if (failures === 0) {
    messages.push('全部质量区间具备物理可行性。');
  }
  return createSection('质量区间', failures === 0, messages);
}

function validateInteractions(context) {
  const messages = [];
  let failures = 0;
  const resolver = createStateResolver(context);
  for (const interaction of context.registry.interactions) {
    const name = interaction.name ?? '<未命名交互>';
    const incoming = Array.isArray(interaction.incoming) ? interaction.incoming : [];
    const outgoing = Array.isArray(interaction.outgoing) ? interaction.outgoing : [];
    let incomingProfiles;
    let outgoingProfiles;
    try {
      incomingProfiles = incoming.map((label) => resolver(label));
      outgoingProfiles = outgoing.map((label) => resolver(label));
    } catch (error) {
      failures += 1;
      messages.push(`${name}：引用未知态 ${error.message}`);
      continue;
    }
    const checks = new Set(Array.isArray(interaction.checks) ? interaction.checks : []);
    if (checks.has('electric_charge') && !compareSum(incomingProfiles, outgoingProfiles, 'charge')) {
      failures += 1;
      messages.push(`${name}：电荷守恒被破坏。`);
    }
    if (checks.has('baryon_number') && !compareSum(incomingProfiles, outgoingProfiles, 'baryon')) {
      failures += 1;
      messages.push(`${name}：重子数不守恒。`);
    }
    if (checks.has('lepton_number') && !compareSum(incomingProfiles, outgoingProfiles, 'lepton')) {
      failures += 1;
      messages.push(`${name}：轻子数不守恒。`);
    }
    if (checks.has('color')) {
      const incomingColor = incomingProfiles.reduce((acc, profile) => acc + profile.color_fundamental, 0);
      const outgoingColor = outgoingProfiles.reduce((acc, profile) => acc + profile.color_fundamental, 0);
      if (incomingColor !== outgoingColor) {
        failures += 1;
        messages.push(
          `${name}：色荷流失配（入射 ${incomingColor} 基本色表示，对应出射 ${outgoingColor}）。`
        );
      }
    }
  }
  if (failures === 0) {
    messages.push('全部交互满足已声明的守恒律。');
  }
  return createSection('相互作用', failures === 0, messages);
}

function validateAnomalies(context) {
  const messages = [];
  let failures = 0;
  const anomalyTotals = new Map();
  const multiplets = new Map();
  for (const particle of context.registry.particles) {
    if (particle.statistics !== 'fermion') continue;
    const key = `${particle.multiplet ?? 'unknown'}::${particle.generation ?? 0}::${particle.chirality ?? 'left'}`;
    if (!multiplets.has(key)) {
      multiplets.set(key, particle);
    }
  }

  for (const [key, particle] of multiplets.entries()) {
    const [, generationRaw, chirality] = key.split('::');
    const generation = Number(generationRaw) || 0;
    const sign = chirality === 'left' ? 1 : -1;
    const reps = isObject(particle.representations) ? particle.representations : {};
    const su3Rep = reps.su3 ?? 'singlet';
    const su2Rep = reps.su2 ?? 'singlet';
    const su3Dynkin = REPRESENTATION_DYNKIN.su3[su3Rep] ?? 0;
    const su2Dynkin = REPRESENTATION_DYNKIN.su2[su2Rep] ?? 0;
    const su3Dim = REPRESENTATION_DIMENSIONS.su3[su3Rep] ?? 1;
    const su2Dim = REPRESENTATION_DIMENSIONS.su2[su2Rep] ?? 1;
    const hypercharge = toNumber(particle.hypercharge) ?? 0;

    const entry = anomalyTotals.get(generation) ?? { su3: 0, su2: 0, u1: 0, grav: 0 };
    entry.su3 += sign * hypercharge * su3Dynkin * su2Dim;
    entry.su2 += sign * hypercharge * su2Dynkin * su3Dim;
    entry.u1 += sign * Math.pow(hypercharge, 3) * su3Dim * su2Dim;
    entry.grav += sign * hypercharge * su3Dim * su2Dim;
    anomalyTotals.set(generation, entry);
  }

  for (const [generation, totals] of anomalyTotals.entries()) {
    for (const [label, value] of Object.entries(totals)) {
      if (!isClose(value, 0, 1e-9, 1e-9)) {
        failures += 1;
        messages.push(`第 ${generation} 代：${label} 规范异常残差 ${value.toExponential(2)}。`);
      }
    }
  }

  if (failures === 0) {
    messages.push('各代费米子集合的规范与混合异常均已抵消。');
  }
  return createSection('规范异常', failures === 0, messages);
}

function validateConstraints(context) {
  const messages = [];
  let failures = 0;
  for (const constraint of context.registry.constraints) {
    const name = constraint.name ?? '<未命名约束>';
    const value = toNumber(constraint.value);
    const prediction = toNumber(constraint.prediction);
    const uncertainty = toNumber(constraint.uncertainty);
    const sigmaLimit = toNumber(constraint.sigma_limit ?? 3);
    if (uncertainty === null || uncertainty <= 0) {
      failures += 1;
      messages.push(`${name}：uncertainty 必须为正数。`);
      continue;
    }
    if (value === null || prediction === null) {
      failures += 1;
      messages.push(`${name}：观测值与预测值需为数值。`);
      continue;
    }
    const delta = Math.abs(prediction - value);
    if (sigmaLimit !== null && delta > sigmaLimit * uncertainty) {
      failures += 1;
      messages.push(`${name}：偏差 ${delta.toExponential(3)} 超出 ${sigmaLimit}σ 容差。`);
    }
  }
  if (failures === 0) {
    messages.push('模型预测均在设定的实验容差范围内。');
  }
  return createSection('实验约束', failures === 0, messages);
}

function createSection(name, passed, messages) {
  return {
    name,
    passed,
    messages
  };
}

function renderReport(report, summary, sourceLabel) {
  reportOutput.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'report__header';

  const overall = document.createElement('div');
  overall.className = 'report__overall';
  overall.textContent = report.passed ? '整体状态：通过' : '整体状态：需关注';
  const badge = document.createElement('span');
  badge.className = `badge ${report.passed ? 'badge--pass' : 'badge--fail'}`;
  badge.textContent = report.passed ? 'PASS' : 'FAIL';
  overall.appendChild(badge);
  header.appendChild(overall);

  if (sourceLabel) {
    const source = document.createElement('div');
    source.className = 'report__source';
    source.textContent = `数据源：${sourceLabel}`;
    header.appendChild(source);
  }

  if (summary.metadata && typeof summary.metadata === 'object') {
    const meta = document.createElement('div');
    meta.className = 'report__source';
    const framework = summary.metadata.framework ? ` · 框架 ${summary.metadata.framework}` : '';
    const schema = summary.metadata.schema_version ? ` · 模型 ${summary.metadata.schema_version}` : '';
    meta.textContent = `单位体系：${summary.metadata.units?.mass ?? '未指定'}${framework}${schema}`;
    header.appendChild(meta);
  }

  reportOutput.appendChild(header);

  for (const section of report.sections) {
    const card = document.createElement('article');
    card.className = 'section-card';

    const title = document.createElement('div');
    title.className = 'section-card__title';
    const heading = document.createElement('h3');
    heading.textContent = section.name;
    const badgeEl = document.createElement('span');
    badgeEl.className = `badge ${section.passed ? 'badge--pass' : 'badge--fail'}`;
    badgeEl.textContent = section.passed ? 'PASS' : 'FAIL';
    title.appendChild(heading);
    title.appendChild(badgeEl);

    const list = document.createElement('ul');
    list.className = 'section-card__messages';
    if (section.messages.length === 0) {
      const item = document.createElement('li');
      item.textContent = '无额外信息。';
      list.appendChild(item);
    } else {
      section.messages.forEach((message) => {
        const item = document.createElement('li');
        item.textContent = message;
        list.appendChild(item);
      });
    }

    card.appendChild(title);
    card.appendChild(list);
    reportOutput.appendChild(card);
  }
}

function updateReportJson(report, summary) {
  const payload = {
    generated_at: new Date().toISOString(),
    source: lastSourceLabel,
    passed: report.passed,
    sections: report.sections,
    statistics: {
      particles: summary.particleCount,
      interactions: summary.interactionCount,
      constraints: summary.constraintCount,
      derived_states: summary.derivedStateCount
    }
  };
  reportJson.textContent = JSON.stringify(payload, null, 2);
}

function createStateResolver(context) {
  const cache = new Map();
  function resolve(label, stack = []) {
    if (cache.has(label)) {
      return cache.get(label);
    }
    if (stack.includes(label)) {
      throw new Error(`派生态存在循环引用：${[...stack, label].join(' → ')}`);
    }
    if (context.particleIndex.has(label)) {
      const particle = context.particleIndex.get(label);
      const representations = isObject(particle.representations) ? particle.representations : {};
      const colorRep = representations.su3 ?? 'singlet';
      const profile = {
        charge: toNumber(particle.charge) ?? 0,
        baryon: toNumber(particle.baryon_number) ?? 0,
        lepton: toNumber(particle.lepton_number) ?? 0,
        color_fundamental: ['fundamental', 'antifundamental'].includes(colorRep) ? 1 : 0
      };
      cache.set(label, profile);
      return profile;
    }
    if (label in context.derivedStates) {
      const state = context.derivedStates[label];
      if (!isObject(state)) {
        throw new Error(`${label} 的派生态必须为对象。`);
      }
      const components = Array.isArray(state.components) ? state.components : [];
      const weights = Array.isArray(state.weights) ? state.weights : [];
      if (components.length !== weights.length) {
        throw new Error(`${label} 的派生态权重数量与组分不匹配。`);
      }
      const accum = { charge: 0, baryon: 0, lepton: 0, color_fundamental: 0 };
      components.forEach((component, index) => {
        const weight = toNumber(weights[index]) ?? 0;
        const profile = resolve(component, [...stack, label]);
        accum.charge += profile.charge * weight;
        accum.baryon += profile.baryon * weight;
        accum.lepton += profile.lepton * weight;
        accum.color_fundamental += profile.color_fundamental * weight;
      });
      accum.color_fundamental = accum.color_fundamental > 0 ? 1 : 0;
      cache.set(label, accum);
      return accum;
    }
    throw new Error(label);
  }
  return resolve;
}

function compareSum(incoming, outgoing, key) {
  const lhs = incoming.reduce((acc, profile) => acc + (profile[key] ?? 0), 0);
  const rhs = outgoing.reduce((acc, profile) => acc + (profile[key] ?? 0), 0);
  return isClose(lhs, rhs);
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function toNumber(value) {
  if (value === undefined || value === null) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((value, index) => deepEqual(value, b[index]));
  }
  if (isObject(a) && isObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => deepEqual(a[key], b[key]));
  }
  return false;
}

function isClose(a, b, relTol = 1e-9, absTol = 1e-9) {
  const diff = Math.abs(a - b);
  return diff <= Math.max(relTol * Math.max(Math.abs(a), Math.abs(b)), absTol);
}

setHeroStatus('待命：尚未载入数据集。');
