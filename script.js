const GIT_TOKEN = "your_personal_access_token_here";

document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const searchInput = document.getElementById("searchInput").value.trim();
  const searchType = document.querySelector(
    'input[name="searchType"]:checked'
  ).value;
  let apiUrl;
  let userInfoUrl;
  let isUserOrOrg = false;

  // Очищуємо результати перед новим пошуком
  document.getElementById("results").innerHTML = "";

  switch (searchType) {
    case "repo":
      apiUrl = `https://api.github.com/search/repositories?q=${searchInput}`;
      break;
    case "user":
      apiUrl = `https://api.github.com/users/${searchInput}/repos`;
      userInfoUrl = `https://api.github.com/users/${searchInput}`;
      isUserOrOrg = true;
      break;
    case "org":
      apiUrl = `https://api.github.com/orgs/${searchInput}/repos`;
      userInfoUrl = `https://api.github.com/orgs/${searchInput}`;
      isUserOrOrg = true;
      break;
    default:
      console.error("Invalid search type");
      break;
  }

  if (!isUserOrOrg) {
    fetchRepositories(apiUrl, searchType);
    return;
  }

  fetchWithAuth(userInfoUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("User or organization not found");
      }
      return response.json();
    })
    .then((userInfo) => {
      displayUserInfo(userInfo, searchType);
      fetchRepositories(apiUrl, searchType);
    })
    .catch((error) => {
      displayError(error);
    });
});

function fetchWithAuth(url) {
  const token = GIT_TOKEN;
  return fetch(url, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
}

function displayUserInfo(userInfo, type) {
  let output = `<h2>Information:</h2>`;
  output += `<ul class="list-group">`;
  output += `<li class="list-group-item"><strong>Name:</strong> ${
    userInfo.name || "N/A"
  }</li>`;
  output += `<li class="list-group-item"><strong>Login:</strong> ${userInfo.login}</li>`;
  output += `<li class="list-group-item"><strong>Profile URL:</strong> <a href="${userInfo.html_url}" target="_blank">${userInfo.html_url}</a></li>`;
  output += `<li class="list-group-item"><strong>Public Repos:</strong> ${userInfo.public_repos}</li>`;
  output += `</ul>`;
  document.getElementById("results").innerHTML = output;
}

function fetchRepositories(apiUrl, type) {
  fetchWithAuth(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch repositories");
      }
      return response.json();
    })
    .then((data) => {
      let output = "";
      const repositories = data?.items ? data.items : data;
      if (repositories?.length > 0) {
        output = '<h2>Repositories:</h2><ul class="list-group">';
        repositories.forEach((repo) => {
          output += `
                        <li class="list-group-item">
                            <a href="${repo.html_url}" target="_blank">${
            repo.name
          }</a>
                            <span class="badge bg-primary">OWNER: ${
                              repo.owner.login
                            }</span>
                            <span class="badge bg-secondary">${
                              repo.language || "N/A"
                            }</span>
                        </li>
                    `;
        });
        output += "</ul>";
      } else {
        output =
          type === "repo"
            ? "<h2>Your search did not match any repositories. Try searching by user or organization.</h2>"
            : `<h2>This user doesn't have any public repositories yet.</h2>`;
      }
      document.getElementById("results").innerHTML += output;
    })
    .catch((error) => {
      displayError(error);
    });
}

function displayError(error) {
  document.getElementById("results").innerHTML += `<h2>${error.message}</h2>`;
  console.error("Error:", error);
}
