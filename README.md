# GitSearch Project

GitSearch project allows you to search GitHub repositories based on various criteria and display search results in a convenient format.

## Using the Project

1. **Opening the Project in the Browser:**
   - Download the project from the GitHub repository.
     ```bash
     git clone https://github.com/MariaPadalka/GitHubSearcher.git
     ```
   - Open the `index.html` file in your favorite web browser.

2. **Updating the Constant for GitHub API Access:**
   - In the `script.js` file, you can update the `GIT_TOKEN` constant with your personal GitHub API token.
     ```javascript
     const GIT_TOKEN = "your_personal_access_token_here";
     ```
   - You can generate your personal access token on GitHub in [Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens).

3. **Usage:**
   - Fill out the search form on the `index.html` page, selecting the type of search (repositories, users, or organizations) and entering the relevant data.
   - Click the "Search" button to retrieve results.

## Note

- To ensure uninterrupted access to the GitHub API, you must have a valid personal access token. Without it, you may encounter rate limiting issues.
