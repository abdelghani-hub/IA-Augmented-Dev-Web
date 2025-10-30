// ===== DONNÉES DES PROJETS =====
const projects = [
  {
    id: 1,
    title: "DevSync",
    description: "Plateforme collaborative de gestion de tâches sous Jakarta EE, où les managers organisent et les développeurs exécutent.",
    tech: "Java, JEE, Maven, JSP, JPA, Hibernate, JUnit, Mockito, GlassFish, Tomcat",
    url: "#",
    likes: 24
  },
  {
    id: 2,
    title: "LigueChasse",
    description: "Application de gestion des compétitions, répond aux besoins des administrateurs et des participants.",
    tech: "Java, Angular, Spring Boot, Spring Security, Maven, JPA, JUnit, Mockito, Postman, Swagger",
    url: "#",
    likes: 18
  },
  {
    id: 3,
    title: "Assamer-Market",
    description: "Marketplace pour découvrir l'artisanat et les produits locaux du Draa Tafilalet, avec paiement en ligne.",
    tech: "Java, Spring Boot, Spring Security, Maven, JPA, Angular, NGRX",
    url: "#",
    likes: 32
  },
  {
    id: 4,
    title: "SudEst Market",
    description: "Plateforme en ligne pour découvrir l'artisanat et la gastronomie locale, avec paiement en ligne.",
    tech: "PHP, Laravel, JavaScript, AJAX, jQuery, TailwindCSS, HTML5, CSS3",
    url: "#",
    likes: 9
  },
  {
    id: 5,
    title: "EVENTHarBor",
    description: "Plateforme dédiée à la gestion d'événements : découverte, réservation et génération de billets.",
    tech: "PHP, Laravel, TailwindCSS, AJAX, JavaScript",
    url: "#",
    likes: 7
  },
];

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
  initProjects();
  initThemeToggle();
  initSearch();
  loadLikesFromStorage();
});

// ===== AFFICHAGE DYNAMIQUE DES PROJETS =====
function initProjects() {
  displayProjects(projects);
}

function displayProjects(projectsToDisplay) {
  const projectsList = document.getElementById('projects-list');
  projectsList.innerHTML = '';

  if (projectsToDisplay.length === 0) {
    projectsList.innerHTML = '<div class="no-results">🔍 Aucun projet trouvé</div>';
    return;
  }

  projectsToDisplay.forEach(project => {
    const card = createProjectCard(project);
    projectsList.appendChild(card);
  });
}

function createProjectCard(project) {
  // Créer la carte
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.projectId = project.id;

  // Titre
  const title = document.createElement('h3');
  title.textContent = project.title;

  // Technologies
  const tech = document.createElement('p');
  tech.className = 'card-tech';
  tech.textContent = `🛠️ ${project.tech}`;

  // Description
  const description = document.createElement('p');
  description.textContent = project.description;

  // Footer avec bouton Like et lien du projet
  const footer = document.createElement('div');
  footer.className = 'card-footer';

  const leftGroup = document.createElement('div');
  leftGroup.style.display = 'flex';
  leftGroup.style.flexDirection = 'column';
  leftGroup.style.gap = '0.5rem';

  // Lien vers le projet
  if (project.url) {
    const projectLink = document.createElement('a');
    projectLink.className = 'project-link';
    projectLink.href = project.url;
    projectLink.target = '_blank';
    projectLink.rel = 'noopener';
    projectLink.textContent = 'Voir le projet';
    leftGroup.appendChild(projectLink);
  }

  const likeButton = document.createElement('button');
  likeButton.className = 'like-button';
  likeButton.innerHTML = `❤️ J'aime`;
  likeButton.setAttribute('aria-label', `Aimer le projet ${project.title}`);

  const likeCount = document.createElement('span');
  likeCount.className = 'like-count';
  likeCount.textContent = `${project.likes} likes`;

  // Événement de clic sur le bouton Like
  likeButton.addEventListener('click', () => handleLike(project.id, likeCount));

  const rightGroup = document.createElement('div');
  rightGroup.style.display = 'flex';
  rightGroup.style.alignItems = 'center';
  rightGroup.style.gap = '1rem';
  rightGroup.appendChild(likeButton);
  rightGroup.appendChild(likeCount);

  footer.appendChild(leftGroup);
  footer.appendChild(rightGroup);

  // Assembler la carte
  card.appendChild(title);
  card.appendChild(tech);
  card.appendChild(description);
  card.appendChild(footer);

  return card;
}

// ===== GESTION DES LIKES =====
function handleLike(projectId, likeCountElement) {
  const project = projects.find(p => p.id === projectId);
  if (project) {
    project.likes++;
    likeCountElement.textContent = `${project.likes} likes`;
    saveLikesToStorage();
    
    // Animation visuelle
    likeCountElement.style.transform = 'scale(1.3)';
    setTimeout(() => {
      likeCountElement.style.transform = 'scale(1)';
    }, 300);
  }
}

// Sauvegarder les likes dans localStorage
function saveLikesToStorage() {
  const likesData = projects.map(p => ({ id: p.id, likes: p.likes }));
  localStorage.setItem('projectLikes', JSON.stringify(likesData));
}

// Charger les likes depuis localStorage
function loadLikesFromStorage() {
  const savedLikes = localStorage.getItem('projectLikes');
  if (savedLikes) {
    const likesData = JSON.parse(savedLikes);
    likesData.forEach(saved => {
      const project = projects.find(p => p.id === saved.id);
      if (project) {
        project.likes = saved.likes;
      }
    });
    displayProjects(projects);
  }
}

// ===== RECHERCHE / FILTRAGE =====
function initSearch() {
  const searchInput = document.getElementById('search-input');
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
      displayProjects(projects);
      return;
    }

    const filteredProjects = projects.filter(project => {
      return project.title.toLowerCase().includes(searchTerm) ||
             project.tech.toLowerCase().includes(searchTerm) ||
             project.description.toLowerCase().includes(searchTerm);
    });

    displayProjects(filteredProjects);
  });
}

// ===== THÈME CLAIR / SOMBRE =====
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Charger le thème sauvegardé
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    body.classList.add('light-mode');
    themeToggle.textContent = '🌙 Thème';
  } else {
    themeToggle.textContent = '☀️ Thème';
  }

  // Basculer le thème au clic
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
      themeToggle.textContent = '🌙 Thème';
      localStorage.setItem('theme', 'light');
    } else {
      themeToggle.textContent = '☀️ Thème';
      localStorage.setItem('theme', 'dark');
    }
  });
}

// ===== GESTION DU FORMULAIRE (BONUS) =====
const form = document.querySelector('form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nom = document.getElementById('nom').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Simulation d'envoi
    alert(`✅ Message envoyé !\n\nNom: ${nom}\nEmail: ${email}\nMessage: ${message}`);
    
    // Réinitialiser le formulaire
    form.reset();
  });
}