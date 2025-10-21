let activeEffect = null;

export function createSignal(initialValue) {
  let value = initialValue;
  const subscribers = new Set();

  function read() {
    if (activeEffect) {
      subscribers.add(activeEffect);
    }
    return value;
  }

  function write(nextValue) {
    value = typeof nextValue === 'function' ? nextValue(value) : nextValue;
    subscribers.forEach((effect) => effect());
  }

  return [read, write];
}

export function effect(fn) {
  const wrapped = () => {
    activeEffect = wrapped;
    try {
      fn();
    } finally {
      activeEffect = null;
    }
  };

  wrapped();
  return () => {
    activeEffect = null;
  };
}

export function h(tag, props = {}, ...children) {
  return { tag, props, children: children.flat() };
}

function setProps(element, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const event = key.slice(2).toLowerCase();
      element.addEventListener(event, value);
    } else if (value != null) {
      element.setAttribute(key, value);
    }
  });
}

function createElement(node) {
  if (typeof node === 'string' || typeof node === 'number') {
    return document.createTextNode(String(node));
  }

  const element = document.createElement(node.tag);
  setProps(element, node.props || {});
  node.children
    .map((child) => (Array.isArray(child) ? child : [child]))
    .flat()
    .forEach((child) => {
      if (child == null) return;
      element.appendChild(createElement(child));
    });
  return element;
}

export function createApp(root, view) {
  if (typeof root === 'string') {
    root = document.querySelector(root);
  }

  if (!root) {
    throw new Error('Root element not found for Mini UI app.');
  }

  effect(() => {
    root.replaceChildren(createElement(view()));
  });
}
