import React, { useState } from 'react';
import Link from 'next/link';

const DeploymentGuides = () => {
  const [activeTab, setActiveTab] = useState('aspnet');

  const aspnetSteps = [
    {
      number: 1,
      title: 'Cloner le repository',
      content: 'git clone https://github.com/votre-organisation/votre-projet.git',
      important: 'Toujours lancer Visual Studio en mode Administrateur pour la publication'
    },
    {
      number: 2,
      title: 'Configurer la ConnectionString',
      content: `{
  "ConnectionStrings": {
    "DefaultConnection": "Server=192.168.1.100;Database=MyAppDB;User Id=sa;Password=YourPassword123!;TrustServerCertificate=True"
  }
}`,
      tip: 'Utilisez l\'authentification SQL plutôt que Windows pour simplifier la gestion à long terme'
    },
    {
      number: 3,
      title: 'Créer le profil de publication',
      list: [
        'Clic droit sur le projet → Publier',
        'Cible : Serveur IIS',
        'Méthode : Web Deploy',
        'Configuration du serveur'
      ]
    },
    {
      number: 4,
      title: 'Configuration Web Deploy',
      config: {
        'Serveur': 'votre-serveur.com:8172',
        'Nom du site': 'Default Web Site/VotreApp',
        'Nom d\'utilisateur': 'Administrator',
        'URL de validation': 'http://votre-serveur.com/VotreApp'
      }
    },
    {
      number: 5,
      title: 'Publication',
      content: 'Cliquez sur Publier dans Visual Studio',
      warning: 'Ne modifiez jamais un profil existant pour changer de port ou d\'IP. Créez toujours un nouveau profil pour éviter les fragments de configuration.'
    }
  ];

  const nextjsSteps = [
    {
      number: 1,
      title: 'Installer IISNode et URL Rewrite',
      list: [
        'IISNode v0.2.21 (x64)',
        'URL Rewrite Module 2.1'
      ]
    },
    {
      number: 2,
      title: 'Créer server.js à la racine du projet',
      code: `const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(\`> Ready on http://\${hostname}:\${port}\`);
  });
});`
    },
    {
      number: 3,
      title: 'Installer et configurer PM2',
      commands: [
        'npm install -g pm2',
        'pm2 install pm2-windows-service',
        'iisreset'
      ]
    },
    {
      number: 4,
      title: 'Build et démarrage avec PM2',
      commands: [
        'npm run build',
        'pm2 start server.js --name "nextjs-app"',
        'pm2 save',
        'pm2 startup'
      ]
    },
    {
      number: 5,
      title: 'Configuration URL Rewrite dans IIS',
      xml: `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ReverseProxyInboundRule" stopProcessing="true">
          <match url="(.*)" />
          <action type="Rewrite" url="http://localhost:3000/{R:1}" />
        </rule>
      </rules>
    </rewrite>
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>`
    }
  ];

  const workflowExamples = {
    nextjs: `name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-nextjs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Build Next.js
        run: npm run build`,
    
    aspnet: `jobs:
  build-dotnet:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      
      - name: Restore dependencies
        run: dotnet restore
      
      - name: Build
        run: dotnet build --configuration Release --no-restore
      
      - name: Test
        run: dotnet test --no-restore --verbosity normal
      
      - name: Publish
        run: dotnet publish -c Release -o ./publish`,
    
    blazor: `jobs:
  build-blazor:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup .NET
        uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      
      - name: Install wasm-tools
        run: dotnet workload install wasm-tools
      
      - name: Build Blazor WASM
        run: dotnet build -c Release
      
      - name: Publish
        run: dotnet publish -c Release -o release --nologo`
  };

  const renderTab = (tabName) => {
    switch(tabName) {
      case 'aspnet':
        return <AspNetTab steps={aspnetSteps} />;
      case 'nextjs':
        return <NextJsTab steps={nextjsSteps} />;
      case 'workflows':
        return <WorkflowsTab examples={workflowExamples} />;
      default:
        return null;
    }
  };

  const AspNetTab = ({ steps }) => (
    <div className="tab-content active">
      <div className="section">
        <h2>🌐 Publication ASP.NET sur IIS</h2>
        
        <div className="info-box">
          <h4>📋 Prérequis</h4>
          <ul>
            <li>IIS configuré et fonctionnel</li>
            <li>Visual Studio installé</li>
            <li>Web Deploy installé sur le serveur</li>
            <li>Cmder ou PowerShell pour les commandes</li>
          </ul>
        </div>

        <h3>📦 Procédure de publication</h3>
        
        <div className="procedure-steps">
          {steps.map((step) => (
            <div key={step.number} className="step">
              <span className="step-number">{step.number}</span>
              <strong>{step.title}</strong>
              
              {step.content && (
                <div className="command-box">{step.content}</div>
              )}
              
              {step.important && (
                <div className="important-box">
                  <h4>⚠️ Important</h4>
                  <p>{step.important}</p>
                </div>
              )}
              
              {step.tip && (
                <div className="tip-box">
                  <h4>💡 Conseil</h4>
                  <p>{step.tip}</p>
                </div>
              )}
              
              {step.list && (
                <ol>
                  {step.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ol>
              )}
              
              {step.config && (
                <div className="config-example">
                  <strong>Paramètres de connexion :</strong><br />
                  {Object.entries(step.config).map(([key, value]) => (
                    <div key={key}>• {key} : {value}</div>
                  ))}
                </div>
              )}
              
              {step.warning && (
                <div className="warning-box">
                  <h4>⚠️ Bonnes pratiques</h4>
                  <p>{step.warning}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <h3>🔧 Configuration IIS Post-Déploiement</h3>
        
        <div className="procedure-steps">
          <div className="step">
            <span className="step-number">1</span>
            <strong>Vérifier le Pool d'applications</strong>
            <ul>
              <li>Version CLR : v4.0</li>
              <li>Mode pipeline : Intégré</li>
              <li>Identité : ApplicationPoolIdentity ou compte de service</li>
              <li>Enable 32-bit : False (sauf si nécessaire)</li>
            </ul>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <strong>Permissions du dossier</strong>
            <div className="command-box">icacls "C:\inetpub\wwwroot\VotreApp" /grant "IIS_IUSRS:(OI)(CI)RX"</div>
            <div className="command-box">icacls "C:\inetpub\wwwroot\VotreApp\App_Data" /grant "IIS_IUSRS:(OI)(CI)M"</div>
          </div>
        </div>
      </div>
    </div>
  );

  const NextJsTab = ({ steps }) => (
    <div className="tab-content active">
      <div className="section">
        <h2>⚡ Publication Next.js sur IIS avec PM2</h2>
        
        <div className="info-box">
          <h4>📋 Prérequis</h4>
          <ul>
            <li>Node.js installé (v18+ recommandé)</li>
            <li>IISNode installé</li>
            <li>URL Rewrite Module installé</li>
            <li>PM2 pour la gestion des processus</li>
          </ul>
        </div>

        <h3>🛠️ Installation des composants</h3>
        
        <div className="procedure-steps">
          {steps.map((step) => (
            <div key={step.number} className="step">
              <span className="step-number">{step.number}</span>
              <strong>{step.title}</strong>
              
              {step.list && (
                <ul>
                  {step.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
              
              {step.code && (
                <div className="code-block" data-lang="javascript">
                  <pre>{step.code}</pre>
                </div>
              )}
              
              {step.commands && step.commands.map((cmd, idx) => (
                <div key={idx} className="command-box">{cmd}</div>
              ))}
              
              {step.xml && (
                <div className="code-block" data-lang="xml">
                  <pre>{step.xml}</pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <h3>📊 Gestion avec PM2</h3>
        
        <div className="tip-box">
          <h4>🎮 Commandes PM2 utiles</h4>
          <ul>
            <li><code>pm2 list</code> - Voir toutes les applications</li>
            <li><code>pm2 logs nextjs-app</code> - Voir les logs</li>
            <li><code>pm2 restart nextjs-app</code> - Redémarrer l'app</li>
            <li><code>pm2 stop nextjs-app</code> - Arrêter l'app</li>
            <li><code>pm2 monit</code> - Monitoring en temps réel</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const WorkflowsTab = ({ examples }) => (
    <div className="tab-content active">
      <div className="section">
        <h2>🔄 GitHub Actions Workflows</h2>
        
        <div className="info-box">
          <h4>📋 Comprendre les workflows</h4>
          <p>Les GitHub Actions permettent d'automatiser le build, les tests et le déploiement de vos applications.</p>
        </div>

        <h3>🎯 Workflows spécifiques par technologie</h3>
        
        <div className="procedure-steps">
          <div className="step">
            <span className="step-number">1</span>
            <strong>Workflow Next.js</strong>
            <div className="code-block" data-lang="yaml">
              <pre>{examples.nextjs}</pre>
            </div>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <strong>Workflow ASP.NET Core</strong>
            <div className="code-block" data-lang="yaml">
              <pre>{examples.aspnet}</pre>
            </div>
          </div>

          <div className="step">
            <span className="step-number">3</span>
            <strong>Workflow Blazor</strong>
            <div className="code-block" data-lang="yaml">
              <pre>{examples.blazor}</pre>
            </div>
          </div>
        </div>

        <div className="warning-box">
          <h4>⚠️ Sécurité des secrets</h4>
          <p>Ne jamais hardcoder les credentials. Utilisez toujours les secrets GitHub :</p>
          <ul>
            <li>Settings → Secrets and variables → Actions</li>
            <li>Utilisez : <code>${`{{ secrets.YOUR_SECRET }}`}</code></li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
     <Link href="/" className="nav-back">← Retour au Wiki</Link>
      
      <div className="header">
        <h1>🚀 Guides de Déploiement</h1>
        <p>Publication d'applications ASP.NET et Next.js sur IIS</p>
      </div>

      <div className="content">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'aspnet' ? 'active' : ''}`}
            onClick={() => setActiveTab('aspnet')}
          >
            🌐 ASP.NET sur IIS
          </button>
          <button 
            className={`tab ${activeTab === 'nextjs' ? 'active' : ''}`}
            onClick={() => setActiveTab('nextjs')}
          >
            ⚡ Next.js sur IIS
          </button>
          <button 
            className={`tab ${activeTab === 'workflows' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflows')}
          >
            🔄 GitHub Actions
          </button>
        </div>

        {renderTab(activeTab)}
      </div>
    </div>
  );
};

export default DeploymentGuides;