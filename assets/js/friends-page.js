import { friendNetwork } from './friends-data.js';

function renderFriendNetwork() {
  const grid = document.getElementById('friend-grid');
  if (!grid) return;

  const fragment = document.createDocumentFragment();
  friendNetwork.forEach((friend) => {
    const card = document.createElement('article');
    card.className = 'alliance-card alliance-card--detailed';
    const tags = (friend.tags || [])
      .map((tag) => `<li>${tag}</li>`)
      .join('');

    card.innerHTML = `
      <h3>${friend.name}</h3>
      <p>${friend.description}</p>
      ${friend.note ? `<p class="alliance-card__note">${friend.note}</p>` : ''}
      <ul>${tags}</ul>
      <a href="${friend.url}" target="_blank" rel="noopener noreferrer">
        访问主页
        <span aria-hidden="true">↗</span>
      </a>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

renderFriendNetwork();
