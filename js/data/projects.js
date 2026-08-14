/**
 * Project catalog – GitHub systems, websites, and graphics work.
 */

export const projects = [
  {
    id: "mr-muungano",
    slug: "mr-muungano",
    title: "Mr. Muungano",
    summary:
      "RAG-powered AI assistant answering questions about the Union of Tanganyika and Zanzibar from official sources.",
    disciplines: ["engineering", "ai-ml"],
    category: "ai-ml",
    year: "2026",
    featured: true,
    cover: "assets/images/projects/covers/mr-muungano.jpg",
    href: "https://github.com/albert-victor/Mr_Muungano",
    external: true,
  },
  {
    id: "fikra2050",
    slug: "fikra2050",
    title: "Fikra2050",
    summary:
      "AI assistant for exploring Tanzania Development Vision 2050 through natural-language chat.",
    disciplines: ["engineering", "ai-ml"],
    category: "ai-ml",
    year: "2026",
    featured: true,
    cover: "assets/images/projects/covers/fikra2050.jpg",
    href: "https://github.com/albert-victor/Fikra2050",
    external: true,
  },
  {
    id: "performance-prediction",
    slug: "performance-prediction",
    title: "Student Performance Prediction",
    summary:
      "Machine learning model that predicts student graduation or dropout risk.",
    disciplines: ["engineering", "ai-ml"],
    category: "ai-ml",
    year: "2025",
    featured: false,
    cover: "assets/images/projects/covers/performance-prediction.jpg",
    href: "https://github.com/albert-victor/student-perfomance-prediction",
    external: true,
  },
  {
    id: "afyalink",
    slug: "afyalink",
    title: "Afyalink",
    summary:
      "Find hospitals with available services and status based on your location.",
    disciplines: ["engineering", "ai-ml", "web"],
    category: "ai-ml",
    year: "2025",
    featured: true,
    cover: "assets/images/projects/covers/afyalink.jpg",
    href: "https://github.com/albert-victor/Afyalink",
    external: true,
  },
  {
    id: "mwongozo-smart",
    slug: "mwongozo-smart",
    title: "MWONGOZO SMART",
    summary:
      "Decision-support for university admission and HESLB loan guidance in Tanzania.",
    disciplines: ["engineering"],
    category: "systems",
    year: "2025",
    featured: true,
    cover: "assets/images/projects/covers/mwongozo.jpg",
    href: "https://github.com/albert-victor/MWONGOZO-SMART",
    external: true,
  },
  {
    id: "study-tracker",
    slug: "study-tracker",
    title: "Vanilla Stack Study Tracker",
    summary:
      "Zero-dependency PHP API with token auth and a vanilla JS frontend for smart study tracking.",
    disciplines: ["engineering", "web"],
    category: "systems",
    year: "2025",
    featured: true,
    cover: "assets/images/projects/covers/study-tracker.jpg",
    href: "https://github.com/albert-victor/Vanilla-Stack-Study-Tracker-A-clean-Fast-PHP-API",
    external: true,
  },
  {
    id: "amcos",
    slug: "amcos",
    title: "AMCOS – Mgowelo Cooperative",
    summary:
      "Digital system for a cooperative agricultural agency in Mgowelo, Iringa.",
    disciplines: ["engineering"],
    category: "systems",
    year: "2025",
    featured: true,
    cover: "assets/images/projects/covers/amcos.jpg",
    href: "https://github.com/albert-victor/AMCOS",
    external: true,
  },
  {
    id: "medibook",
    slug: "medibook",
    title: "MediBook",
    summary: "Search, compare, and book doctors in minutes.",
    disciplines: ["engineering", "web"],
    category: "systems",
    year: "2026",
    featured: false,
    cover: "assets/images/projects/covers/medibook.jpg",
    href: "https://github.com/albert-victor/MediBook",
    external: true,
  },
  {
    id: "matembo-safari",
    slug: "matembo-safari",
    title: "Matembo Safaris & Tours",
    summary:
      "A modern, distinctive tourism website – refined branding and safari experiences presented with epic elegance and a premium guest journey.",
    disciplines: ["web", "design"],
    category: "web",
    year: "2026",
    featured: true,
    cover: "assets/images/projects/covers/matembo-safari.jpg",
    href: "https://www.matembosafaris.com",
    external: true,
  },
  {
    id: "wildgaze",
    slug: "wildgaze",
    title: "WildGaze Safaris",
    summary: "Tourism website focused on Tanzania's southern safari circuits.",
    disciplines: ["web", "design"],
    category: "web",
    year: "2025",
    featured: true,
    cover: "assets/images/projects/covers/wildgaze.jpg",
    href: "https://www.wildgazesafaris.co.tz",
    external: true,
  },
  {
    id: "safari-bush",
    slug: "safari-bush",
    title: "Safaris & Bush Retreats",
    summary: "Professional tourism website for safari and bush retreat experiences.",
    disciplines: ["web", "design"],
    category: "web",
    year: "2025",
    featured: true,
    cover: "assets/images/projects/covers/safari-bush.jpg",
    href: "https://safariandbushretreats.com",
    external: true,
  },
  {
    id: "er-safaris",
    slug: "er-safaris",
    title: "ER Safaris & Tours",
    summary: "Tourism website for safari experiences across Tanzania.",
    disciplines: ["web", "design"],
    category: "web",
    year: "2025",
    featured: true,
    cover: "assets/images/projects/covers/er-safaris.jpg",
    href: "https://github.com/albert-victor/Er-Safaris-and-Tours",
    external: true,
  },
  {
    id: "bamboo-village",
    slug: "bamboo-village",
    title: "Igeleke Bamboo Village",
    summary: "Eco-tourism site for Igeleke Bamboo Village – green tourism in Tanzania.",
    disciplines: ["web", "design"],
    category: "web",
    year: "2025",
    featured: false,
    cover: "assets/images/projects/covers/bamboo-village.jpg",
    href: "https://github.com/albert-victor/Bamboo-village",
    external: true,
  },
  {
    id: "graphics-portfolio",
    slug: "graphics-portfolio",
    title: "Graphics & Brand Visuals",
    summary:
      "Social media designs, church flyers, and print work – live portfolio on Instagram.",
    disciplines: ["design"],
    category: "design",
    year: "2025",
    featured: true,
    cover: "assets/images/projects/covers/graphics.jpg",
    href: "work/graphics.html",
    external: false,
  },
];

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured);
}

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug) ?? null;
}

export function filterProjectsByDiscipline(discipline) {
  if (!discipline || discipline === "all") {
    return projects;
  }

  return projects.filter((project) => project.disciplines.includes(discipline));
}
