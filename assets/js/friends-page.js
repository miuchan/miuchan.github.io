import { friendNetwork } from './friends-data.js';

const createTagList = (tags = []) =>
  tags
    .map((tag) => `<li>${tag}</li>`)
    .join('');

function createFriendCard(friend, { variant = 'standard' } = {}) {
  const card = document.createElement('article');
  const description = friend.description || friend.slogan || '';
  const note = friend.note
    ? `<p class="alliance-card__note">${friend.note}</p>`
    : '';
  const tags = createTagList(friend.tags || []);

  const classes = ['alliance-card', 'alliance-card--detailed'];
  if (variant === 'featured') {
    classes.push('alliance-card--featured');
  }
  card.className = classes.join(' ');

  card.innerHTML = `
    <h3>${friend.name}</h3>
    ${description ? `<p>${description}</p>` : ''}
    ${note}
    ${tags ? `<ul>${tags}</ul>` : ''}
    <a href="${friend.url}" target="_blank" rel="noopener noreferrer">
      访问主页
      <span aria-hidden="true">↗</span>
    </a>
  `;

  return card;
}

function createFeaturedSection(featured) {
  const section = document.createElement('section');
  section.className = 'friend-featured';

  const layout = document.createElement('div');
  layout.className = 'friend-featured__layout';

  const meta = document.createElement('div');
  meta.className = 'friend-featured__meta';

  if (featured.badge) {
    const badge = document.createElement('p');
    badge.className = 'friend-featured__badge';
    badge.textContent = featured.badge;
    meta.appendChild(badge);
  }

  const title = document.createElement('h2');
  title.className = 'friend-featured__title';
  title.textContent = featured.title;
  meta.appendChild(title);

  if (featured.summary) {
    const summary = document.createElement('p');
    summary.className = 'friend-featured__summary';
    summary.textContent = featured.summary;
    meta.appendChild(summary);
  }

  layout.appendChild(meta);
  layout.appendChild(createFriendCard(featured.friend, { variant: 'featured' }));

  section.appendChild(layout);
  return section;
}

function createClusterSection(cluster) {
  const section = document.createElement('section');
  section.className = 'friend-cluster';

  const header = document.createElement('header');
  header.className = 'friend-cluster__header';

  const title = document.createElement('h2');
  title.className = 'friend-cluster__title';
  title.textContent = cluster.title;
  header.appendChild(title);

  if (cluster.summary) {
    const summary = document.createElement('p');
    summary.className = 'friend-cluster__summary';
    summary.textContent = cluster.summary;
    header.appendChild(summary);
  }

  const grid = document.createElement('div');
  grid.className = 'friend-cluster__grid alliance-grid';

  (cluster.friends || []).forEach((friend) => {
    grid.appendChild(createFriendCard(friend));
  });

  section.appendChild(header);
  section.appendChild(grid);

  return section;
}

function renderFriendNetwork() {
  const grid = document.getElementById('friend-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  const { featured, clusters } = friendNetwork;

  if (featured) {
    fragment.appendChild(createFeaturedSection(featured));
  }

  (clusters || []).forEach((cluster) => {
    fragment.appendChild(createClusterSection(cluster));
  });

  grid.appendChild(fragment);
}

renderFriendNetwork();
