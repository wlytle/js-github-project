(function () {
  const baseUrl = "https://api.github.com/search/users";
  const form = document.getElementById("github-form");
  const list = document.getElementById("user-list");

  function search(e) {
    e.preventDefault();
    const search_term = e.target.search.value.replace(/\s/g, "");
    const configObj = {
      headers: { Accept: "application/vnd.github.v3+json" },
    };
    fetch(`${baseUrl}?q=${search_term}`, configObj)
      .then((resp) => resp.json())
      .then((data) => showAllResults(data));
  }

  function showAllResults(data) {
    list.innerHTML = "";
    console.log(data.items);
    for (const result of data.items) {
      showResult(result);
    }
  }

  function showResult(result) {
    const li = document.createElement("li");
    const h2 = document.createElement("h2");
    const img = document.createElement("img");
    const repos = document.createElement("a");
    const profile = document.createElement("a");
    const br1 = document.createElement("br");
    const br2 = document.createElement("br");

    h2.textContent = result.login;
    img.src = result.avatar_url;
    repos.href = result.repos_url;
    repos.textContent = `Visit all of ${result.login}'s repos`;
    profile.href = result.html_url;
    profile.textContent = `Visit ${result.login}'s account`;

    li.append(h2, img, br1, repos, br2, profile);
    list.appendChild(li);
  }

  function getRepos({ target }) {
    if (target.tagName != "H2") {
      return;
    }
    const configObj = {
      headers: { Accept: "application/vnd.github.v3+json" },
    };
    fetch(`https://api.github.com/users/${target.textContent}/repos`, configObj)
      .then((resp) => resp.json())
      .then((data) => showAllRepos(data, target.parentElement));
  }

  function showAllRepos(data, li) {
    let repoLi;
    const ul = document.createElement("ul");
    const h3 = document.createElement("h3");
    h3.textContent = "Repos";
    ul.appendChild(h3);
    for (const repo of data) {
      repoLi = showRepo(repo);
      ul.appendChild(repoLi);
    }
    li.appendChild(ul);
  }

  function showRepo(repo) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = repo.full_name;
    a.href = repo.hmtl_url;
    return li.appendChild(a);
  }

  list.addEventListener("click", getRepos);
  form.addEventListener("submit", search);
})();
