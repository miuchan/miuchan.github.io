const DEFAULT_OPTIONS = {
  rootWeight: 1,
  learningRate: 0.45,
  depthDecay: 0.68,
  iterations: 18,
  tolerance: 0.0005,
  minimumWeight: 0.015
};

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function deriveBaseWeight(node, depth = 0) {
  const label = typeof node.label === 'string' ? node.label : '';
  const labelComplexity = Math.min(label.length / 6, 12);
  const childCount = Array.isArray(node.children) ? node.children.length : 0;
  const depthPenalty = 1 / Math.pow(1.15 + depth * 0.08, 1 + depth * 0.15);
  const base = 1 + childCount * 0.65 + labelComplexity * 0.08;
  return Math.max(0.35, base * depthPenalty);
}

function normaliseWeights(weights, targetTotal) {
  if (!Array.isArray(weights) || weights.length === 0) {
    return [];
  }
  const sum = weights.reduce((total, value) => total + value, 0);
  if (sum <= 0) {
    const fallback = targetTotal / weights.length;
    return weights.map(() => fallback);
  }
  return weights.map((value) => (value / sum) * targetTotal);
}

export function computeInformationGradient(nodes, options = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const result = new Map();

  function descend(currentNodes, targetWeight, depth) {
    if (!Array.isArray(currentNodes) || !currentNodes.length) return;
    const target = toNumber(targetWeight, config.rootWeight);
    if (target <= 0) return;

    const baseWeights = currentNodes.map((node) => deriveBaseWeight(node, depth));
    const desiredTotals = normaliseWeights(baseWeights, target);
    let working = [...desiredTotals];

    for (let iteration = 0; iteration < config.iterations; iteration += 1) {
      const normalised = normaliseWeights(working, target);
      let largestDelta = 0;

      working = working.map((value, index) => {
        const desired = desiredTotals[index];
        const gradient = normalised[index] - desired;
        largestDelta = Math.max(largestDelta, Math.abs(gradient));
        const adjustment = gradient * config.learningRate * Math.pow(config.depthDecay, depth);
        const nextValue = value - adjustment;
        return Math.max(nextValue, config.minimumWeight);
      });

      if (largestDelta < config.tolerance) {
        break;
      }
    }

    const resolved = normaliseWeights(working, target);

    currentNodes.forEach((node, index) => {
      const resolvedWeight = resolved[index];
      if (node && typeof node.id === 'string' && node.id.length > 0) {
        result.set(node.id, resolvedWeight);
      }
      const children = node && Array.isArray(node.children) ? node.children : null;
      if (children && children.length) {
        const childTarget = resolvedWeight * config.depthDecay;
        descend(children, childTarget, depth + 1);
      }
    });
  }

  descend(nodes, config.rootWeight, 0);
  return result;
}

export function mapGradientToPercentages(gradientMap) {
  const mapped = new Map();
  gradientMap.forEach((value, key) => {
    const clamped = Math.max(0, Math.min(1, value));
    mapped.set(key, Math.round(clamped * 100));
  });
  return mapped;
}
