import React, { useState } from 'react';
import Link from 'next/link';

const DocumentationGuide = () => {
  const [activeTab, setActiveTab] = useState('documentation');

  const documentationSteps = [
    {
      number: 1,
      title: 'Format des fichiers',
      description: 'Toute documentation doit être écrite en format Markdown (.md)',
      benefits: [
        'Léger et lisible sans logiciel particulier',
        'Convertible facilement en HTML, PDF ou Word',
        'Standard sur GitHub, GitLab, etc.'
      ]
    },
    {
      number: 2,
      title: 'Nomenclature des fichiers',
      example: '[TITRE_LOGIQUE_AVEC_CONTENU]-Doc.md',
      examples: [
        'Installation_Serveur-Doc.md',
        'Configuration_Database-Doc.md',
        'API_Authentication-Doc.md'
      ]
    },
    {
      number: 3,
      title: 'Structure du contenu',
      template: `# [TITRE]

**Auteur :** [Nom du rédacteur]
**Date :** [Date de création]
**Version :** [v1.0]

## Description
[Phrase descriptive expliquant l'objectif du document]

## Contenu
[Contenu détaillé de la documentation]

## Étapes / Procédures
1. Première étape
2. Deuxième étape
3. ...`
    },
    {
      number: 4,
      title: 'Intégration de code',
      description: 'Toujours préciser le langage avant d\'intégrer du code :',
      codeExample: `\`\`\`javascript
// Exemple de code JavaScript
function demarrerServeur() {
    console.log("Serveur démarré");
}
\`\`\`

\`\`\`python
# Exemple de code Python
def demarrer_serveur():
    print("Serveur démarré")
\`\`\``
    },
    {
      number: 5,
      title: 'Validation et envoi',
      tasks: [
        'Relecture et vérification',
        'Test des exemples de code',
        'Envoi à l\'équipe maintenance pour review'
      ]
    }
  ];

  const branchSteps = [
    {
      number: 1,
      title: 'Je crée ma branche',
      objective: 'Créer mon espace de travail personnel',
      commands: [
        'git checkout DEV',
        'git pull origin DEV',
        'git checkout -b JD_ma_nouvelle_fonctionnalite'
      ],
      note: '✅ Maintenant je peux travailler tranquillement sur ma fonctionnalité !'
    },
    {
      number: 2,
      title: 'Je travaille et je sauvegarde',
      objective: 'Sauvegarder mon travail régulièrement',
      description: 'Après avoir fait des modifications dans mes fichiers :',
      commands: [
        'git add .',
        'git commit -m "Ajout du formulaire de connexion"'
      ],
      tip: 'Fais des commits souvent avec des messages clairs !'
    },
    {
      number: 3,
      title: 'Je synchronise avec l\'équipe',
      objective: 'M\'assurer que mon code est compatible avec celui de l\'équipe',
      commands: [
        'git checkout DEV',
        'git pull origin DEV',
        'git checkout JD_ma_nouvelle_fonctionnalite',
        'git merge DEV'
      ],
      afterConflict: 'S\'il y a des conflits, Git te dira quoi faire. Une fois résolu :',
      finalCommand: 'git push origin JD_ma_nouvelle_fonctionnalite'
    },
    {
      number: 4,
      title: 'Je demande à intégrer mon travail (Pull Request)',
      objective: 'Faire valider mon code par l\'équipe',
      steps: [
        '🌐 Va sur GitHub/GitLab',
        '🔄 Clique sur "Pull Request" ou "Merge Request"',
        '🎯 IMPORTANT : Assure-toi que c\'est ta_branche → DEV (pas vers main !)',
        '📝 Écris un titre clair : "Ajout de la page de connexion"',
        '📋 Explique ce que tu as fait dans la description',
        '🚀 Crée la Pull Request'
      ]
    },
    {
      number: 5,
      title: 'Après validation : Je nettoie',
      objective: 'Garder un environnement propre',
      description: 'Une fois que ta Pull Request est acceptée :',
      commands: [
        'git checkout DEV',
        'git pull origin DEV',
        'git branch -d JD_ma_nouvelle_fonctionnalite'
      ],
      celebration: '🎉 Félicitations ! Ta fonctionnalité est maintenant dans DEV !'
    }
  ];

  const DocumentationTab = () => (
    <div className="tab-content active">
      <div className="section">
        <h2>📋 Procédure de Documentation</h2>
        
        <div className="info-box">
          <h4>💡 Objectif</h4>
          <p>Cette procédure vise à standardiser et homogénéiser la documentation de tous les projets pour assurer une cohérence et une qualité optimale.</p>
        </div>

        <h3>📌 Format et Standards</h3>
        
        <div className="procedure-steps">
          {documentationSteps.map((step) => (
            <div key={step.number} className="step">
              <span className="step-number">{step.number}</span>
              <strong>{step.title}</strong>
              
              {step.description && <p>{step.description}</p>}
              
              {step.benefits && (
                <ul>
                  {step.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              )}
              
              {step.example && (
                <div className="nomenclature-example">
                  {step.example}
                </div>
              )}
              
              {step.examples && (
                <>
                  <p>Exemples :</p>
                  <ul>
                    {step.examples.map((ex, idx) => (
                      <li key={idx}><code>{ex}</code></li>
                    ))}
                  </ul>
                </>
              )}
              
              {step.template && (
                <div className="code-block" data-lang="markdown">
                  <pre>{step.template}</pre>
                </div>
              )}
              
              {step.codeExample && (
                <div className="code-block" data-lang="markdown">
                  <pre>{step.codeExample}</pre>
                </div>
              )}
              
              {step.tasks && (
                <>
                  <p>Une fois la documentation complétée :</p>
                  <ul>
                    {step.tasks.map((task, idx) => (
                      <li key={idx}>{task}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="tip-box">
          <h4>✅ Bonnes pratiques</h4>
          <ul className="checklist">
            <li>Utilisez des titres clairs et hiérarchisés (#, ##, ###)</li>
            <li>Incluez des exemples concrets</li>
            <li>Ajoutez des captures d'écran si nécessaire</li>
            <li>Vérifiez l'orthographe et la grammaire</li>
            <li>Testez tous les exemples de code</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const BranchesTab = () => (
    <div className="tab-content active">
      <div className="section">
        <h2>🌳 Gestion des Branches Git - Guide Simplifié</h2>
        
        <div className="info-box">
          <h4>🎯 Pourquoi des branches ?</h4>
          <p>Les branches permettent de travailler sur différentes fonctionnalités en parallèle sans perturber le code principal. C'est comme avoir plusieurs copies de votre projet pour tester différentes idées !</p>
        </div>

        <h3>🏗️ Architecture Simple des Branches</h3>
        
        <div className="flow-diagram">
          <div className="flow-item" style={{ background: '#e8f5e8' }}>
            main<br /><small>(code stable)</small>
          </div>
          <span className="flow-arrow">→</span>
          <div className="flow-item" style={{ background: '#fff3e0' }}>
            DEV<br /><small>(développement)</small>
          </div>
          <span className="flow-arrow">→</span>
          <div className="flow-item" style={{ background: '#f3e5f5' }}>
            ma_branche<br /><small>(ma fonctionnalité)</small>
          </div>
        </div>

        <div className="important-box">
          <h4>📌 Règle d'or</h4>
          <p><strong>Toujours créer ta branche depuis DEV et merger vers DEV</strong><br />
          Ne jamais toucher directement à main !</p>
        </div>

        <h3>📝 Comment nommer ma branche ?</h3>
        
        <div className="nomenclature-example">
          [tes_initiales]_[ce_que_tu_fais]
        </div>
        
        <div className="scenario-box">
          <h4>💡 Exemples concrets</h4>
          <ul>
            <li><code>JD_login_page</code> → Jean Dupont travaille sur la page de connexion</li>
            <li><code>MS_fix_bug_menu</code> → Marie Smith corrige un bug dans le menu</li>
            <li><code>PL_add_database</code> → Pierre Leblanc ajoute une base de données</li>
          </ul>
        </div>

        <h3>🚀 Les 5 Étapes Simples</h3>

        <div className="procedure-steps">
          {branchSteps.map((step) => (
            <div key={step.number} className="step">
              <span className="step-number">{step.number}</span>
              <strong>{step.title}</strong>
              <p>📝 <em>Objectif : {step.objective}</em></p>
              
              {step.description && <p>{step.description}</p>}
              
              {step.commands && step.commands.map((cmd, idx) => (
                <div key={idx} className="command-box">{cmd}</div>
              ))}
              
              {step.note && <p>{step.note}</p>}
              {step.tip && <p>💡 <strong>Conseil :</strong> {step.tip}</p>}
              {step.afterConflict && <p>{step.afterConflict}</p>}
              {step.finalCommand && <div className="command-box">{step.finalCommand}</div>}
              
              {step.steps && (
                <ol>
                  {step.steps.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ol>
              )}
              
              {step.celebration && <p>{step.celebration}</p>}
            </div>
          ))}
        </div>

        <div className="scenario-box">
          <h4>🎬 Scénario complet avec Marie</h4>
          <p><strong>Marie veut ajouter un bouton "Partager" :</strong></p>
          <ol>
            <li>Elle crée sa branche : <code>MS_bouton_partager</code></li>
            <li>Elle code son bouton et fait des commits</li>
            <li>Elle synchronise avec DEV pour éviter les conflits</li>
            <li>Elle crée une Pull Request vers DEV</li>
            <li>L'équipe valide et merge</li>
            <li>Marie supprime sa branche et recommence pour une nouvelle fonctionnalité !</li>
          </ol>
        </div>

        <div className="tip-box">
          <h4>💡 Conseils pour éviter les problèmes</h4>
          <ul className="checklist">
            <li>Toujours commencer par <code>git pull origin DEV</code></li>
            <li>Faire des commits avec des messages clairs</li>
            <li>Tester son code avant de faire la Pull Request</li>
            <li>Si tu es bloqué, demande de l'aide à l'équipe !</li>
            <li>Une branche = une fonctionnalité (pas tout en vrac !)</li>
          </ul>
        </div>

        <div className="important-box">
          <h4>❌ Les erreurs à éviter</h4>
          <ul>
            <li><strong>Créer une branche depuis main :</strong> Toujours depuis DEV !</li>
            <li><strong>Pull Request vers main :</strong> Toujours vers DEV !</li>
            <li><strong>Oublier de pull DEV :</strong> Tu risques des conflits</li>
            <li><strong>Noms de branches flous :</strong> Sois précis sur ce que tu fais</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <Link href="/" className="nav-back">← Retour au Wiki</Link>
      
      <div className="header">
        <h1>📚 Documentation & Branches</h1>
        <p>Guide complet pour documenter et gérer les branches Git</p>
      </div>

      <div className="content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'documentation' ? 'active' : ''}`}
            onClick={() => setActiveTab('documentation')}
          >
            📝 Documentation
          </button>
          <button 
            className={`tab ${activeTab === 'branches' ? 'active' : ''}`}
            onClick={() => setActiveTab('branches')}
          >
            🌳 Gestion des Branches
          </button>
        </div>

        {activeTab === 'documentation' ? <DocumentationTab /> : <BranchesTab />}
      </div>
    </div>
  );
};

export default DocumentationGuide;