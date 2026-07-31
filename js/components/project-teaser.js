/**
 * Optional renderer helpers for project teasers from data.
 */

export function createProjectTeaser(project) {
  const article = document.createElement("article");
  article.className = "project-teaser";
  article.setAttribute("data-discipline", project.disciplines.join(" "));

  article.innerHTML = `
    <a class="project-teaser" href="${project.href}">
      <div class="project-teaser__media">
        <img src="${project.cover}" alt="${project.title} cover" loading="lazy" width="800" height="500" />
      </div>
      <div class="project-teaser__body">
        <div class="tag-list">
          ${project.disciplines
            .map((d) => `<span class="tag">${d}</span>`)
            .join("")}
        </div>
        <h3 class="project-teaser__title">${project.title}</h3>
        <p class="project-teaser__meta">${project.year} · ${project.summary}</p>
      </div>
    </a>
  `;

  return article.firstElementChild;
}
