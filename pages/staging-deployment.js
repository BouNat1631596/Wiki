import React from 'react';
import Link from 'next/link';

const StagingDeployment = () => {
  const workflowYaml = `name: Deploy to Staging

on:
  pull_request:
    types: [closed]
    branches: [develop, staging]

jobs:
  deploy-staging:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    
    steps:
    - name: 📂 Checkout code
      uses: actions/checkout@v4

    - name: 🟢 Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: 📦 Install dependencies
      run: npm ci

    - name: 🧪 Run tests
      run: npm test

    - name: 🔨 Build project
      run: npm run build:staging

    - name: 🚀 Deploy via FTP
      uses: SamKirkland/FTP-Deploy-Action@v4.3.4
      with:
        server: \${{ secrets.FTP_SERVER }}
        username: \${{ secrets.FTP_USERNAME }}
        password: \${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
        server-dir: /public_html/staging/

    - name: 🔔 Notify deployment
      if: success()
      run: echo "✅ Déploiement staging réussi !"`;

  const deploymentSteps = [
    {
      number: 1,
      title: '🗂️ Structure du projet',
      content: 'Suivez votre procédure de branche habituelle',
      description: 'Assurez-vous d\'avoir votre package.json configuré avec le script de build :',
      code: `{
  "name": "mon-projet",
  "scripts": {
    "build": "npm run build:prod",
    "build:staging": "NODE_ENV=staging npm run build",
    "test": "jest",
    "start": "node server.js"
  },
  "devDependencies": {
    "webpack": "^5.0.0",
    "babel": "^7.0.0"
  }
}`
    },
    {
      number: 2,
      title: '🔐 Configuration GitHub Actions',
      content: 'Créez le fichier .github/workflows/staging-deploy.yml',
      yaml: workflowYaml
    },
    {
      number: 3,
      title: '🔧 Préparation pour le déploiement',
      content: 'Quand vous êtes prêt à déployer Staging, le nom du commit doit être "déploiement Staging"',
      commands: [
        'git add .',
        'git commit -m "déploiement Staging"',
        'git push origin [Branche de développeur]'
      ],
      warning: 'Le commit avec le nom "déploiement Staging" déclenchera automatiquement le build et le déploiement après approbation de la PR.'
    },
    {
      number: 4,
      title: '🔄 Création de la Pull Request',
      content: 'Créez votre pull request vers la branche DEV ou staging',
      template: `✅ Prêt pour déploiement staging
🧪 Tests validés : [✓] Unitaires [✓] Intégration
🔨 Build testé localement : ✅
🚀 Nouvelles fonctionnalités : [détails]
🐛 Corrections : [détails]`
    },
    {
      number: 5,
      title: '⚙️ Déclenchement automatique',
      content: 'Lorsque la pull request est acceptée par au moins 2 membres de la maintenance, le workflow GitHub Actions s\'exécute automatiquement',
      processus: [
        'Vérification des approbations (2 minimum)',
        'Installation des dépendances (npm ci)',
        'Exécution des tests',
        'Build de production',
        'Upload des fichiers via FTP/SSH',
        'Notification du statut de déploiement'
      ]
    }
  ];

  return (
    <div className="container">
      <Link href="/" className="nav-back">← Retour au Wiki</Link>
      
      <div className="header">
        <h1>🚀 Déploiement Staging GitHub Actions</h1>
        <p>Guide complet pour automatiser vos déploiements sans Docker</p>
      </div>

      <div className="content">
        <div className="workflow-diagram">
          <h2>Flux de déploiement automatisé</h2>
          <div className="workflow-steps">
            <div className="workflow-step dev">
              <h3>🔧 Développement</h3>
              <p>Branche DEV<br />Code source & Build</p>
            </div>
            <div className="arrow">→</div>
            <div className="workflow-step staging">
              <h3>🧪 Staging</h3>
              <p>Tests d'intégration<br />Déploiement FTP/SSH</p>
            </div>
            <div className="arrow">→</div>
            <div className="workflow-step prod">
              <h3>🌟 Production</h3>
              <p>Environnement live<br />Utilisateurs finaux</p>
            </div>
          </div>

          <div className="review-requirement">
            <h3>REQUIS OBLIGATOIRE</h3>
            <div className="number">2</div>
            <p><strong>Au moins 2 membres de l'équipe maintenance</strong></p>
            <p>doivent approuver la review avant tout déploiement</p>
           <Link href="/code-review" className="review-link">📋 Voir les Procédures de Review</Link>
          </div>

          <div className="git-flow-visual">
            <h3>🌳 Visualisation Git Flow</h3>
            <div className="branch main">
              <span className="branch-name">main</span>
              <div className="branch-line"></div>
            </div>
            <div className="branch staging">
              <span className="branch-name">staging</span>
              <div className="branch-line">
                <div className="commit-point staging"></div>
              </div>
            </div>
            <div className="branch dev">
              <span className="branch-name">dev</span>
              <div className="branch-line">
                <div className="commit-point c1"></div>
                <div className="commit-point c2"></div>
                <div className="commit-point c3"></div>
              </div>
            </div>
          </div>

          <div className="deployment-flow">
            <h3>🔄 Processus de déploiement automatisé</h3>
            <div className="deployment-steps">
              <div className="deployment-step">
                <div className="deployment-step-icon">📝</div>
                <h4>Commit</h4>
                <p>Push vers dev/staging</p>
              </div>
              <div className="deployment-step">
                <div className="deployment-step-icon">🔍</div>
                <h4>Code Review</h4>
                <p>2 approvals requis</p>
              </div>
              <div className="deployment-step">
                <div className="deployment-step-icon">🔨</div>
                <h4>Build</h4>
                <p>npm/yarn build</p>
              </div>
              <div className="deployment-step">
                <div className="deployment-step-icon">🧪</div>
                <h4>Tests</h4>
                <p>Tests automatisés</p>
              </div>
              <div className="deployment-step">
                <div className="deployment-step-icon">📤</div>
                <h4>Deploy</h4>
                <p>Upload FTP/SSH</p>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>📋 Procédure de déploiement étape par étape</h2>
          
          <div className="alert info">
            <strong>💡 Principe :</strong> Cette procédure permet aux développeurs de déployer automatiquement sur staging via FTP/SSH sans utiliser Docker, après validation obligatoire par l'équipe maintenance.
          </div>

          <div className="steps-container">
            {deploymentSteps.map((step) => (
              <div key={step.number} className="step">
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p><strong>{step.content}</strong></p>
                
                {step.description && <p>{step.description}</p>}
                
                {step.code && (
                  <div className="code-block" data-lang="json">
                    <pre>{step.code}</pre>
                  </div>
                )}
                
                {step.yaml && (
                  <div className="code-block" data-lang="yaml">
                    <pre>{step.yaml}</pre>
                  </div>
                )}
                
                {step.commands && (
                  <>
                    {step.commands.map((cmd, idx) => (
                      <div key={idx} className="command-box">{cmd}</div>
                    ))}
                  </>
                )}
                
                {step.warning && (
                  <div className="alert warning">
                    <strong>⚠️ Important :</strong> {step.warning}
                  </div>
                )}
                
                {step.template && (
                  <div className="alert info">
                    <strong>📝 Description PR :</strong><br />
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{step.template}</pre>
                  </div>
                )}
                
                {step.number === 4 && (
                  <div className="review-requirement">
                    <h3>⚠️ ÉTAPE CRITIQUE</h3>
                    <div className="number">2</div>
                    <p><strong>L'équipe maintenance doit approuver</strong></p>
                    <p>Votre PR avant que le déploiement ne se déclenche</p>
                    <Link href="/code-review" className="review-link">📋 Guide Complet des Reviews</Link>
                  </div>
                )}
                
                {step.processus && (
                  <div className="alert success">
                    <strong>🎉 Processus automatisé :</strong>
                    <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                      {step.processus.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StagingDeployment;