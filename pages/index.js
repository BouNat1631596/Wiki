import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { marked } from 'marked';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [wikiArticles, setWikiArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    loadDynamicArticles();
    showWelcomeNotification();
  }, []);

  const loadDynamicArticles = () => {
    try {
      const stored = localStorage.getItem('wikiArticles');
      if (stored) {
        const articles = JSON.parse(stored);
        setWikiArticles(articles);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    }
  };

  const showWelcomeNotification = () => {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = new Date().getTime();
    
    if (!lastVisit || now - parseInt(lastVisit) > 86400000) {
      setTimeout(() => {
        // Créer une notification (vous pouvez utiliser une bibliothèque comme react-toastify)
        console.log('Bienvenue sur le Wiki !');
        localStorage.setItem('lastVisit', now.toString());
      }, 1000);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (!term) {
      setFilteredArticles([]);
      return;
    }
    
    const filtered = staticArticles.filter(article => 
      article.title.toLowerCase().includes(term) ||
      article.description.toLowerCase().includes(term) ||
      article.tags.some(tag => tag.toLowerCase().includes(term))
    );
    
    setFilteredArticles(filtered);
  };

  const viewDynamicArticle = (articleId) => {
    const article = wikiArticles.find(a => a.id === articleId);
    if (!article) {
      alert('Article non trouvé');
      return;
    }

    const articleHTML = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
          <meta charset="UTF-8">
          <title>${article.title}</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  max-width: 900px;
                  margin: 0 auto;
                  padding: 40px 20px;
                  background: #0f0f0f;
                  color: #e2e8f0;
                  line-height: 1.6;
              }
              h1 { font-size: 2.5rem; margin-bottom: 10px; }
              h2 { color: #a78bfa; margin-top: 30px; }
              h3 { color: #c4b5fd; margin-top: 25px; }
              .meta {
                  display: flex;
                  gap: 20px;
                  margin: 15px 0;
                  flex-wrap: wrap;
              }
              .meta span {
                  background: #374151;
                  padding: 5px 12px;
                  border-radius: 15px;
                  font-size: 0.9rem;
              }
          </style>
      </head>
      <body>
          <h1>${article.title}</h1>
          <div class="meta">
              <span>👤 ${article.author}</span>
              <span>📅 ${new Date(article.dateAdded).toLocaleDateString('fr-FR')}</span>
              <span>⏱️ ${article.readingTime} min</span>
          </div>
          <div>${marked.parse(article.content)}</div>
      </body>
      </html>
    `;

    const blob = new Blob([articleHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const staticArticles = [
    {
      id: 'code-review',
      title: 'Code Review',
      subtitle: 'Procédures & Bonnes Pratiques',
      description: 'Guide complet pour les reviews de code. Processus d\'approbation par l\'équipe maintenance.',
      tags: ['Review', 'Qualité', 'Collaboration'],
      difficulty: 'medium',
      readingTime: 10,
      path: '/code-review',
      icon: '📋',
      category: 'maintenance'
    },
    {
      id: 'staging-deployment',
      title: 'Déploiement Staging',
      subtitle: 'GitHub Actions sans Docker',
      description: 'Guide complet pour automatiser le déploiement sur environnement staging avec GitHub Actions.',
      tags: ['Déploiement', 'GitHub Actions', 'Automatisation'],
      difficulty: 'medium',
      readingTime: 15,
      path: '/staging-deployment',
      icon: '🚀',
      category: 'deployment'
    },
    {
      id: 'kpi-dashboard',
      title: 'Tableau de Bord KPI',
      subtitle: 'Métriques & Performance',
      description: 'Dashboard interactif pour suivre les KPIs de développement et déploiement.',
      tags: ['Métriques', 'Qualité', 'Performance'],
      difficulty: 'easy',
      readingTime: 5,
      path: '/kpi-dashboard',
      icon: '📊',
      category: 'maintenance'
    },
    {
      id: 'testing-procedures',
      title: 'Tests Unitaires',
      subtitle: 'ASP.NET Core & Blazor',
      description: 'Guide complet pour implémenter des tests unitaires côté serveur et client avec xUnit et bUnit.',
      tags: ['Tests', 'Qualité', 'xUnit'],
      difficulty: 'medium',
      readingTime: 20,
      path: '/testing-procedures',
      icon: '🧪',
      category: 'testing'
    },
    {
      id: 'documentation-guide',
      title: 'Documentation & Branches',
      subtitle: 'Guide Git Flow simplifié',
      description: 'Procédures de documentation et gestion simplifiée des branches Git pour l\'équipe.',
      tags: ['Git', 'Documentation', 'Workflow'],
      difficulty: 'easy',
      readingTime: 12,
      path: '/documentation-guide',
      icon: '🌳',
      category: 'development'
    },
    {
      id: 'deployment-guides',
      title: 'Guides IIS',
      subtitle: 'ASP.NET & Next.js',
      description: 'Procédures complètes pour publier ASP.NET et Next.js sur IIS avec PM2.',
      tags: ['IIS', 'ASP.NET', 'Next.js'],
      difficulty: 'hard',
      readingTime: 25,
      path: '/deployment-guides',
      icon: '🌐',
      category: 'infrastructure'
    },
    {
      id: 'server-procedures',
      title: 'Infrastructure Serveur',
      subtitle: 'Configuration & Sécurité',
      description: 'Configuration complète des serveurs Windows/Linux, sécurisation avec Nmap et scripts de nettoyage.',
      tags: ['Serveur', 'Sécurité', 'Docker'],
      difficulty: 'hard',
      readingTime: 30,
      path: '/server-procedures',
      icon: '🔒',
      category: 'security'
    }
  ];

  const categoryIcons = {
    'deployment': '🚀',
    'development': '💻',
    'tools': '🛠️',
    'security': '🔒',
    'database': '🗄️',
    'testing': '🧪',
    'infrastructure': '🖥️',
    'other': '📚'
  };

  const NavCategory = ({ icon, title, description, path, isSpecial, specialClass }) => (
    <Link href={path} className={`nav-category ${specialClass || ''}`}>
      <span className="nav-category-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );

  const ArticleCard = ({ article, isDynamic = false }) => {
    const getDifficultyDots = (difficulty) => {
      if (difficulty === 'easy') {
        return (
          <>
            <div className="dot active easy"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </>
        );
      } else if (difficulty === 'medium') {
        return (
          <>
            <div className="dot active medium"></div>
            <div className="dot active medium"></div>
            <div className="dot"></div>
          </>
        );
      } else {
        return (
          <>
            <div className="dot active hard"></div>
            <div className="dot active hard"></div>
            <div className="dot active hard"></div>
          </>
        );
      }
    };

    const handleClick = () => {
      if (isDynamic) {
        viewDynamicArticle(article.id);
      }
    };

    const isNew = isDynamic && new Date(article.dateAdded) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return (
      <div className="article-card" onClick={handleClick}>
        {isDynamic ? (
          <>
            {isNew && <div className="new-badge">NOUVEAU</div>}
            <div className={`article-header ${article.category || 'other'}`}>
              <div className="article-icon">{categoryIcons[article.category] || '📄'}</div>
              <div className="article-title">{article.title || 'Titre non défini'}</div>
              <div className="article-subtitle">{article.author || 'Auteur inconnu'}</div>
            </div>
          </>
        ) : (
          <Link href={article.path} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={`article-header ${article.category}`}>
              <div className="article-icon">{article.icon}</div>
              <div className="article-title">{article.title}</div>
              <div className="article-subtitle">{article.subtitle}</div>
            </div>
          </Link>
        )}
        <div className="article-content">
          <div className="article-description">{article.description}</div>
          <div className="article-tags">
            {article.tags.map((tag, index) => (
              <span key={index} className={`tag ${article.category}`}>{tag}</span>
            ))}
          </div>
          <div className="article-meta">
            <div className="article-difficulty">
              <span>Difficulté:</span>
              <div className="difficulty-dots">
                {getDifficultyDots(article.difficulty)}
              </div>
            </div>
            <div className="article-time">⏱️ {article.readingTime} min</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h1>📚 Wiki Développement</h1>
        <p>Hub central des bonnes pratiques, guides et procédures techniques</p>
        
        <div className="search-bar">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Rechercher dans le wiki..." 
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="main-content">
        <div className="wiki-nav">
          <div className="nav-categories">
            <NavCategory 
              icon="🚀" 
              title="Déploiement" 
              description="CI/CD, automatisation, staging et production"
              path="/staging-deployment"
            />
            <NavCategory 
              icon="📋" 
              title="Code Review" 
              description="Procédures, validation et bonnes pratiques"
              path="/code-review"
            />
            <NavCategory 
              icon="📊" 
              title="Maintenance" 
              description="KPIs, métriques et tableau de bord"
              path="/kpi-dashboard"
              specialClass="maintenance-category"
            />
            <NavCategory 
              icon="📄" 
              title="Visionneuse" 
              description="Visualisez vos PDF et Markdown directement"
              path="/document-viewer"
              specialClass="viewer-category"
            />
            <NavCategory 
              icon="✏️" 
              title="Contribuer" 
              description="Ajoutez votre documentation au wiki"
              path="/contribution"
              specialClass="contribution-category"
            />
            <NavCategory 
              icon="📖" 
              title="Documentation" 
              description="Guide de documentation et gestion des branches"
              path="/documentation-guide"
            />
            <NavCategory 
              icon="🌐" 
              title="Guides IIS" 
              description="Déploiement ASP.NET et Next.js sur IIS"
              path="/deployment-guides"
            />
            <NavCategory 
              icon="🧪" 
              title="Tests" 
              description="Tests unitaires et d'intégration"
              path="/testing-procedures"
              specialClass="testing-category"
            />
            <NavCategory 
              icon="🖥️" 
              title="Infrastructure" 
              description="Configuration serveur et sécurité"
              path="/server-procedures"
            />
          </div>
        </div>

        <div className="articles-section">
          <h2 className="section-title">📖 Articles Disponibles</h2>
          
          <div className="critical-notice">
            <h4>IMPORTANT - Processus Obligatoire</h4>
            <p><strong>Tous les déploiements nécessitent l'approbation de 2 membres de l'équipe maintenance</strong></p>
          </div>
          
          <div className="recent-updates">
            <h4>🆕 Dernières mises à jour</h4>
            <p id="latestUpdate">
              {wikiArticles.length > 0 
                ? `${new Date(wikiArticles[0].dateAdded).toLocaleDateString('fr-FR')} - Nouvelle documentation: "${wikiArticles[0].title}" ajoutée par ${wikiArticles[0].author}`
                : 'Les nouvelles documentations apparaîtront ici'}
            </p>
          </div>

          <div className="articles-grid">
            {/* Articles dynamiques */}
            {wikiArticles.map(article => (
              <ArticleCard key={article.id} article={article} isDynamic={true} />
            ))}
            
            {/* Articles statiques */}
            {(searchTerm ? filteredArticles : staticArticles).map(article => (
              <ArticleCard key={article.id} article={article} isDynamic={false} />
            ))}
          </div>
        </div>
      </div>

      <div className="footer">
        <p>© 2025 Wiki Développement - Créé avec ❤️ pour l'équipe de développement</p>
        <p>Contribuez à améliorer ce wiki en ajoutant votre documentation !</p>
      </div>
    </div>
  );
};

export default HomePage;