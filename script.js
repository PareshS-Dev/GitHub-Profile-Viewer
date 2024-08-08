// script.js
const usernameInput = document.getElementById('username');
const searchBtn = document.getElementById('search-btn');
const profileInfoDiv = document.getElementById('profile-info');
const usernameHeader = document.getElementById('username-header');
const bioPara = document.getElementById('bio');
const avatarImg = document.getElementById('avatar');
const reposList = document.getElementById('repos');
const repoNameDiv = document.getElementById('repo-name');
const publicReposSpan = document.getElementById('public-repos');
const publicGistsSpan = document.getElementById('public-gists');
const organizationDiv = document.getElementById('organization');
const locationDiv = document.getElementById('location');
const emailDiv = document.getElementById('email');
const hireableDiv = document.getElementById('hireable');
const createdAtDiv = document.getElementById('created-at');
const updatedAtDiv = document.getElementById('updated-at');
const followersSpan = document.getElementById('followers');
const followingSpan = document.getElementById('following');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');

searchBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (!username) return;

  loadingSpinner.classList.remove('hidden');
  profileInfoDiv.classList.add('hidden');
  errorMessage.classList.add('hidden');

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();

    if (data.message === 'Not Found') {
      throw new Error('User not found!');
    }

    profileInfoDiv.classList.remove('hidden');
    profileInfoDiv.classList.add('opacity-100');
    usernameHeader.textContent = data.login;
    bioPara.textContent = data.bio;
    avatarImg.src = data.avatar_url;

    publicReposSpan.textContent = data.public_repos;
    publicGistsSpan.textContent = data.public_gists;
    organizationDiv.textContent = data.organization ? data.organization.login : 'None';
    locationDiv.textContent = data.location ? data.location : 'None';
    emailDiv.textContent = data.email ? data.email : 'None';
    hireableDiv.textContent = data.hireable ? 'Yes' : 'No';
    createdAtDiv.textContent = new Date(data.created_at).toLocaleDateString();
    updatedAtDiv.textContent = new Date(data.updated_at).toLocaleDateString();

    followersSpan.textContent = data.followers;
    followingSpan.textContent = data.following;

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
    const reposData = await reposResponse.json();

    reposList.innerHTML = '';
    repoNameDiv.textContent = ''; // clear previous repo names
    reposData.forEach(repo => {
      const repoListItem = document.createElement('li');
      const repoLink = document.createElement('a');
      repoLink.href = repo.html_url;
      repoLink.target = '_blank';
      repoLink.textContent = repo.name;
      repoLink.className = 'repo-link';
      repoListItem.appendChild(repoLink);
      reposList.appendChild(repoListItem);

      repoNameDiv.textContent += `${repo.name} `; // display repo names
    });
  } catch (error) {
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = error.message;
  } finally {
    loadingSpinner.classList.add('hidden');
  }
});