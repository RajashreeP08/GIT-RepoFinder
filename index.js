const languageSelect = document.getElementById('language-select');
const statusBox = document.getElementById('status');
const repoCard = document.getElementById('repo-card');
const refreshBtn = document.getElementById('refresh-btn');

// Event: on language change
languageSelect.addEventListener('change', () => {
  const language = languageSelect.value;
  if (language) {
    fetchRepo(language);
  } else {
    showEmptyState();
  }
});

// Event: Refresh button
refreshBtn.addEventListener('click', () => {
  const language = languageSelect.value;
  if (language) {
    fetchRepo(language);
  }
});

function fetchRepo(language) {
  showLoadingState();

  const url = `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (!data.items || data.items.length === 0) throw new Error();
      const randomIndex = Math.floor(Math.random() * data.items.length);
      const repo = data.items[randomIndex];
      showRepo(repo);
    })
    .catch(() => {
      showErrorState();
    });
}

function showLoadingState() {
  statusBox.classList.remove('hidden');
  repoCard.classList.add('hidden');
  refreshBtn.classList.add('hidden');

  statusBox.innerHTML = `<div class="status-box bg-light">Loading, please wait...</div>`;
}

function showEmptyState() {
  statusBox.classList.remove('hidden');
  repoCard.classList.add('hidden');
  refreshBtn.classList.add('hidden');

  statusBox.innerHTML = `<div class="status-box bg-light">Please select a language</div>`;
}

function showErrorState() {
  repoCard.classList.add('hidden');
  refreshBtn.classList.add('hidden');

  statusBox.classList.remove('hidden');
  statusBox.innerHTML = `
    <div class="error-box">Error fetching repositories</div>
    <button class="retry-btn" onclick="retryFetch()">Click to retry</button>
  `;
}

function retryFetch() {
  const language = languageSelect.value;
  if (language) fetchRepo(language);
}

function showRepo(repo) {
  statusBox.classList.add('hidden');
  repoCard.classList.remove('hidden');
  refreshBtn.classList.remove('hidden');

  repoCard.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <h5 class="card-title mb-1">
          <a href="${repo.html_url}" target="_blank" class="text-decoration-none">${repo.name}</a>
        </h5>
        <a href="${repo.html_url}" target="_blank" class="text-muted" style="font-size: 1.2rem;">
          <i class="bi bi-box-arrow-up-right"></i>
        </a>
      </div>
      <p class="card-text text-muted mb-2">${repo.description || "No description available."}</p>

      <div class="d-flex flex-wrap gap-3 text-muted small">
        <div class="language-badge">
          <span class="badge rounded-pill bg-warning-subtle text-dark">🟡 ${repo.language || "Unknown"}</span>
        </div>
        <div><i class="bi bi-star-fill"></i> ${repo.stargazers_count}</div>
        <div><i class="bi bi-git"></i> ${repo.forks_count}</div>
        <div><i class="bi bi-exclamation-circle"></i> ${repo.open_issues_count}</div>
      </div>
    </div>
  `;
}
