import { PROJECTS } from "./projects.js";

export function Links({ links }) {
  return (
    <div className="project-links">
      {links.map(([label, targetUrl, iconType]) => (
        <a key={label} href={targetUrl} target="_blank" rel="noreferrer">
          {label} <i className={iconType === "github" ? "fab fa-github" : "fas fa-arrow-up-right-from-square"}></i>
        </a>
      ))}
    </div>
  );
}

export function Meta({ year, role }) {
  return (
    <div className="project-meta">
      <p className="project-meta-title">PROJECT INFO</p>
      <div className="meta-row"><span>Year</span><span>{year}</span></div>
      <div className="meta-row"><span>Role</span><span>{role}</span></div>
    </div>
  );
}

export default function MoreProjects() {
  return (
    <section className="all-projects">
      <h2>MORE PROJECTS</h2>
      <div className="grid">
        {PROJECTS.map((project) => (
          <article key={project.id} className="card">
            <div className="project-image">
              {project.badge && <span className="badge">{project.badge}</span>}
              <img src={project.img} alt={project.title} />
            </div>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
            <Meta year={project.year} role={project.role} />
            <Links links={project.links} />
          </article>
        ))}
      </div>
    </section>
  );
}