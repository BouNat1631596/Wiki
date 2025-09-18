import React, { useState } from 'react';
import Link from 'next/link';


const CodeReviewGuide = () => {
  const [activeSection, setActiveSection] = useState('process');

  const reviewSteps = [
    {
      type: 'critical',
      title: 'Identification du problème',
      description: 'Description précise du bug ou de l\'amélioration nécessaire'
    },
    {
      type: 'important',
      title: 'Procédure de correction',
      description: 'Étapes détaillées pour résoudre le problème'
    },
    {
      type: 'standard',
      title: 'Support et accompagnement',
      description: 'Aide disponible pour la résolution'
    },
    {
      type: 'standard',
      title: 'Re-soumission',
      description: 'Nouvelle review après corrections'
    }
  ];

  const criteriaCards = [
    {
      type: 'clarity',
      title: '💡 Clarté du Code',
      items: [
        'Noms de fonctions compréhensibles',
        'Variables avec des noms explicites',
        'Code commenté aux endroits cruciaux',
        'Structure logique et organisée',
        'Indentation cohérente'
      ]
    },
    {
      type: 'bug-check',
      title: '🐛 Absence de Bugs',
      items: [
        'Code fonctionne en local',
        'Compatible multi-appareils',
        'Pas de bugs globaux',
        'Tests passent correctement',
        'Gestion d\'erreurs appropriée'
      ]
    },
    {
      type: 'structure',
      title: '🏗️ Architecture',
      items: [
        'Composants avec tâches précises',
        'Fonctions mono-responsabilité',
        'Séparation des préoccupations',
        'Réutilisabilité du code',
        'Respect des patterns établis'
      ]
    }
  ];

  const approvalTemplate = `## ✅ Review Approuvée

**Reviewer :** [Nom] (Équipe Maintenance)

### Points Positifs
- ✅ Code clair et bien structuré
- ✅ Tests passent correctement
- ✅ Pas de bugs détectés
- ✅ Architecture respectée

### Commentaires
[Commentaires constructifs si nécessaire]

**Statut :** APPROUVÉ ✅`;

  const rejectionTemplate = `## 🔄 Review - Améliorations Nécessaires

**Reviewer :** [Nom] (Équipe Maintenance)

### Problèmes Identifiés
1. **Bug détecté :** [Description précise]
   - **Localisation :** [Fichier:ligne]
   - **Impact :** [Description de l'impact]

2. **Amélioration code :** [Description]
   - **Suggestion :** [Solution proposée]

### 📋 Plan de Correction
1. [Étape 1 détaillée]
2. [Étape 2 détaillée]
3. [Tests à effectuer]

### 🤝 Support Disponible
- Documentation : [Liens utiles]
- Contact : [Personne de contact]
- Exemples : [Code de référence]

**Statut :** EN ATTENTE DE CORRECTIONS 🔄`;

  return (
    <div className="container">
      <Link href="/" className="nav-back">← Retour au Wiki</Link>
      
      <div className="header">
        <h1>🔍 Code Review</h1>
        <p>Procédures et bonnes pratiques pour une review de qualité</p>
      </div>

      <div className="content">
        <div className="review-flow">
          <h2>Processus de Review</h2>
          
          <div className="reviewers-required">
            <h3>⚠️ REQUIS OBLIGATOIRE</h3>
            <div className="number">2</div>
            <p><strong>Au moins 2 membres de l'équipe maintenance</strong> doivent accepter la review avant tout merge</p>
          </div>

          <div className="team-roles">
            <h3>🎭 Rôles dans l'équipe</h3>
            <div className="roles-grid">
              <div className="role-card">
                <div className="role-icon">👨‍💻</div>
                <h4>Développeur</h4>
                <p>Créé la PR, corrige les bugs signalés</p>
              </div>
              <div className="role-card">
                <div className="role-icon">🔧</div>
                <h4>Équipe Maintenance</h4>
                <p>Review le code, valide ou rejette avec aide</p>
              </div>
              <div className="role-card">
                <div className="role-icon">👥</div>
                <h4>Collaboration</h4>
                <p>Travail d'équipe solidaire, pas d'opposition</p>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>📋 Critères d'acceptation</h2>
          
          <div className="criteria-grid">
            {criteriaCards.map((card, index) => (
              <div key={index} className={`criteria-card ${card.type}`}>
                <h3>{card.title}</h3>
                <ul className="checklist">
                  {card.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="alert warning">
            <strong>⚠️ Important :</strong> Le code non accepté à cause de bugs sera retourné avec une procédure d'aide pour corriger les problèmes. L'équipe de maintenance agit comme alliée, pas comme ennemie.
          </div>
        </div>

        <div className="section">
          <h2>🔄 Processus en cas de rejet</h2>
          
          <div className="bug-process">
            <h3>🤝 Approche Collaborative</h3>
            <p>Quand un code est rejeté, l'équipe maintenance fournit un plan d'action détaillé pour aider le développeur.</p>
            
            <div className="process-steps">
              {reviewSteps.map((step, index) => (
                <div key={index} className="process-step">
                  <div className="step-number">{index + 1}</div>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="section">
          <h2>📝 Templates de Review</h2>
          
          <div className="approval-template">
            <h3>✅ Template d'Approbation</h3>
            <div className="code-example">
              <pre>{approvalTemplate}</pre>
            </div>
          </div>

          <div className="rejection-template">
            <h3>🔄 Template de Rejet Constructif</h3>
            <div className="code-example">
              <pre>{rejectionTemplate}</pre>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>🎯 Bonnes Pratiques</h2>
          
          <div className="alert info">
            <strong>💡 Pour les Developers :</strong>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>Testez votre code sur plusieurs environnements avant la PR</li>
              <li>Ajoutez des commentaires pour les parties complexes</li>
              <li>Respectez les conventions de nommage de l'équipe</li>
              <li>Incluez des tests unitaires quand possible</li>
            </ul>
          </div>

          <div className="alert success">
            <strong>🔧 Pour l'Équipe Maintenance :</strong>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>Soyez constructifs dans vos commentaires</li>
              <li>Fournissez des solutions, pas seulement des problèmes</li>
              <li>Aidez à comprendre le "pourquoi" des corrections</li>
              <li>Valorisez les bonnes pratiques observées</li>
            </ul>
          </div>

          <div className="reviewers-required" style={{ background: '#e8f5e8', borderColor: '#4caf50' }}>
            <h3>🎯 Objectif Final</h3>
            <p><strong>Une équipe unie qui produit du code de qualité</strong></p>
            <p>La review n'est pas un obstacle, mais un outil d'amélioration collective</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeReviewGuide;