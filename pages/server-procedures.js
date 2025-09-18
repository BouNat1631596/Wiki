import React, { useState } from 'react';
import Link from 'next/link';

const ServerProcedures = () => {
  const [activeTab, setActiveTab] = useState('iis');

  const cleaningScript = `# Script PowerShell de nettoyage
# Cleaning.ps1

param(
    [string]$ProjectType = "all"
)

function Clean-DotNetProject {
    Write-Host "Nettoyage projet .NET..." -ForegroundColor Yellow
    Get-ChildItem -Path . -Include bin,obj -Recurse -Directory | Remove-Item -Recurse -Force
    dotnet clean
    dotnet restore
    dotnet build
    Write-Host "✓ Projet .NET nettoyé" -ForegroundColor Green
}

function Clean-NodeProject {
    Write-Host "Nettoyage projet Node.js..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
    npm install
    npm run build
    Write-Host "✓ Projet Node.js nettoyé" -ForegroundColor Green
}

switch ($ProjectType) {
    "dotnet" { Clean-DotNetProject }
    "node" { Clean-NodeProject }
    "all" { 
        Clean-DotNetProject
        Clean-NodeProject
    }
}`;

  const iisApplications = [
    { name: 'dotnet-hosting', version: '6.0.33 & 8.0.8', description: 'Runtime ASP.NET Core pour héberger les applications' },
    { name: 'Node.js', version: 'v20.17.0', description: 'Runtime JavaScript pour applications Next.js' },
    { name: 'IISNode', version: 'v0.2.21', description: 'Module pour héberger Node.js dans IIS' },
    { name: 'URL Rewrite', version: '2.1', description: 'Module de réécriture d\'URL' },
    { name: 'Web Deploy', version: '3.6', description: 'Outil de déploiement automatisé' },
    { name: 'PM2', version: 'Latest', description: 'Process manager pour Node.js' }
  ];

  const dockerCommands = {
    update: 'sudo apt-get update',
    installPrereqs: 'sudo apt-get install apt-transport-https ca-certificates curl software-properties-common',
    addGPG: 'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -',
    addRepo: 'sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"',
    installDocker: 'sudo apt-get install docker-ce docker-ce-cli',
    verify: 'sudo docker run hello-world'
  };

  const dockerComposeYaml = `version: '3.8'

services:
  python-app:
    image: python:3.10
    container_name: python_interpreter
    volumes:
      - ./:/usr/src/app
    working_dir: /usr/src/app
    stdin_open: true
    tty: true`;

  const githubRoles = [
    { role: 'Développeurs', permission: 'Write', description: 'Peuvent créer des branches et PRs' },
    { role: 'Équipe Maintenance', permission: 'Maintain', description: 'Peuvent approuver et merger les PRs' },
    { role: 'Chef Maintenance', permission: 'Admin', description: 'Accès complet au repository' }
  ];

  const rulesetRules = [
    'Require pull request before merging',
    'Require approvals : 2 minimum',
    'Dismiss stale pull request approvals',
    'Require review from CODEOWNERS',
    'Require status checks to pass',
    'Require branches to be up to date',
    'Include administrators'
  ];

  const nmapCommands = [
    {
      title: 'Scan basique d\'une adresse IP',
      command: 'nmap 192.168.1.100',
      description: 'Scanne les 1000 ports les plus communs'
    },
    {
      title: 'Scan complet avec détection de services',
      command: 'nmap -sV -p- 192.168.1.100',
      description: '-sV : Détection des versions des services\n-p- : Scan de tous les ports (1-65535)'
    },
    {
      title: 'Analyse des résultats',
      example: `PORT     STATE SERVICE    VERSION
22/tcp   open  ssh        OpenSSH 8.2
80/tcp   open  http       Apache 2.4
135/tcp  open  msrpc      Windows RPC
445/tcp  open  microsoft-ds`,
      note: 'Dans cet exemple, les ports 135 et 445 pourraient être inutiles et représenter des risques.'
    }
  ];

  const IISTab = () => (
    <div className="tab-content active">
      <div className="section">
        <h2>🌐 Configuration IIS Windows Server</h2>
        
        <div className="info-box">
          <h4>📋 Objectif</h4>
          <p>Guide complet pour installer et configurer IIS sur Windows Server 2022 avec toutes les applications nécessaires.</p>
        </div>

        <h3>📦 Installation des rôles IIS</h3>
        
        <div className="procedure-steps">
          <div className="step">
            <span className="step-number">1</span>
            <strong>Rôles à installer sur Windows Server 2022</strong>
            <ul>
              <li>Web Server (IIS)</li>
              <li>ASP.NET Core Runtime</li>
              <li>URL Rewrite Module</li>
              <li>Application Request Routing</li>
              <li>Web Deploy</li>
              <li>IISNode pour applications Node.js</li>
            </ul>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <strong>Configuration du site web</strong>
            <ul>
              <li><strong>Authentification :</strong> Anonyme (le site gère l'authentification)</li>
              <li><strong>Pool d'applications :</strong> .NET CLR Version v4.0</li>
              <li><strong>Mode pipeline :</strong> Intégré</li>
              <li><strong>Identité :</strong> ApplicationPoolIdentity</li>
            </ul>
          </div>
        </div>

        <h3>🛠️ Applications requises</h3>
        
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Application</th>
              <th>Version</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {iisApplications.map((app, index) => (
              <tr key={index}>
                <td>{app.name}</td>
                <td>{app.version}</td>
                <td>{app.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="tip-box">
          <h4>💡 Script d'installation automatique</h4>
          <p>Utilisez le script PowerShell <code>ServerSetup.ps1</code> pour installer automatiquement toutes les applications et MSI requis.</p>
          <div className="command-box">.\ServerSetup.ps1</div>
        </div>

        <h3>🔄 Script de nettoyage universel</h3>
        
        <div className="code-block" data-lang="powershell">
          <pre>{cleaningScript}</pre>
        </div>

        <div className="warning-box">
          <h4>⚠️ Attention</h4>
          <p>Le nettoyage supprime tous les fichiers compilés et les dépendances. Assurez-vous d'avoir sauvegardé tout travail important avant de procéder.</p>
        </div>
      </div>
    </div>
  );

  const LinuxTab = () => (
    <div className="tab-content active">
      <div className="section">
        <h2>🐧 Configuration Serveur Linux avec Docker</h2>
        
        <div className="warning-box">
          <h4>⚠️ Note importante</h4>
          <p>Le serveur Linux peut être utilisé potentiellement, mais le compilateur Stimulus a été refait dans un Docker qui roule sur IIS.</p>
        </div>

        <h3>📦 Installation de Docker sur Ubuntu</h3>
        
        <div className="procedure-steps">
          <div className="step">
            <span className="step-number">1</span>
            <strong>Mise à jour du système</strong>
            <div className="command-box">{dockerCommands.update}</div>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <strong>Installation des prérequis</strong>
            <div className="command-box">{dockerCommands.installPrereqs}</div>
          </div>

          <div className="step">
            <span className="step-number">3</span>
            <strong>Ajout du repository Docker</strong>
            <div className="command-box">{dockerCommands.addGPG}</div>
            <div className="command-box">{dockerCommands.addRepo}</div>
          </div>

          <div className="step">
            <span className="step-number">4</span>
            <strong>Installation de Docker</strong>
            <div className="command-box">sudo apt-get update</div>
            <div className="command-box">{dockerCommands.installDocker}</div>
          </div>

          <div className="step">
            <span className="step-number">5</span>
            <strong>Vérification de l'installation</strong>
            <div className="command-box">{dockerCommands.verify}</div>
          </div>
        </div>

        <h3>🐍 Configuration Python avec Docker Compose</h3>
        
        <div className="code-block" data-lang="yaml">
          <pre>{dockerComposeYaml}</pre>
        </div>

        <div className="tip-box">
          <h4>✅ Commandes Docker utiles</h4>
          <ul className="checklist">
            <li><code>docker ps</code> - Voir les conteneurs actifs</li>
            <li><code>docker logs [container]</code> - Voir les logs</li>
            <li><code>docker exec -it [container] bash</code> - Accéder au shell</li>
            <li><code>docker-compose up -d</code> - Démarrer en arrière-plan</li>
            <li><code>docker-compose down</code> - Arrêter les services</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const GitHubTab = () => (
    <div className="tab-content active">
      <div className="section">
        <h2>📦 Configuration GitHub pour l'équipe</h2>
        
        <div className="info-box">
          <h4>🎯 Objectif</h4>
          <p>Mettre en place l'environnement GitHub pour accueillir plusieurs développeurs avec des rôles et règles appropriés.</p>
        </div>

        <h3>👥 Configuration des rôles</h3>
        
        <div className="procedure-steps">
          <div className="step">
            <span className="step-number">1</span>
            <strong>Invitation des membres</strong>
            <p>Settings → Collaborators and teams → Add people</p>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <strong>Attribution des rôles</strong>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Rôle</th>
                  <th>Permission GitHub</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {githubRoles.map((role, index) => (
                  <tr key={index}>
                    <td>{role.role}</td>
                    <td><strong>{role.permission}</strong></td>
                    <td>{role.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <h3>🔒 Configuration des Rulesets</h3>
        
        <div className="procedure-steps">
          <div className="step">
            <span className="step-number">1</span>
            <strong>Création d'un ruleset</strong>
            <p>Settings → Rules → Rulesets → New ruleset</p>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <strong>Protection des branches principales</strong>
            <p>Target branches : <code>main</code>, <code>staging</code>, <code>DEV</code></p>
          </div>

          <div className="step">
            <span className="step-number">3</span>
            <strong>Règles à activer</strong>
            <ul className="checklist">
              {rulesetRules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="step">
            <span className="step-number">4</span>
            <strong>Bypass list</strong>
            <p>Ajouter les rôles <strong>maintain</strong> et <strong>admin</strong> uniquement</p>
          </div>
        </div>

        <div className="important-box">
          <h4>⚠️ Important</h4>
          <p>Avec cette configuration, les développeurs devront obligatoirement créer une pull request et obtenir 2 approbations de l'équipe maintenance avant de pouvoir merger.</p>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="tab-content active">
      <div className="section">
        <h2>🔒 Sécurisation avec Nmap</h2>
        
        <div className="info-box">
          <h4>🛡️ Description</h4>
          <p>Nmap est un scanner de ports permettant de découvrir les services actifs sur un système et de sécuriser les ports non utilisés.</p>
        </div>

        <h3>🔍 Utilisation de Nmap</h3>
        
        <div className="procedure-steps">
          {nmapCommands.map((cmd, index) => (
            <div key={index} className="step">
              <span className="step-number">{index + 1}</span>
              <strong>{cmd.title}</strong>
              {cmd.command && <div className="command-box">{cmd.command}</div>}
              {cmd.description && <p>{cmd.description}</p>}
              {cmd.example && (
                <div className="code-block" data-lang="text">
                  <pre>{cmd.example}</pre>
                </div>
              )}
              {cmd.note && <p>{cmd.note}</p>}
            </div>
          ))}
        </div>

        <h3>🛡️ Sécurisation avec Windows Firewall</h3>
        
        <div className="procedure-steps">
          <div className="step">
            <span className="step-number">1</span>
            <strong>Ouvrir Windows Defender Firewall</strong>
            <p>Panneau de configuration → Système et sécurité → Pare-feu Windows Defender → Paramètres avancés</p>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <strong>Créer une règle de blocage</strong>
            <ol>
              <li>Clic droit sur "Règles de trafic entrant" → Nouvelle règle</li>
              <li>Type : <strong>Port</strong></li>
              <li>Protocole : TCP</li>
              <li>Ports spécifiques : <code>135,445</code></li>
              <li>Action : <strong>Bloquer la connexion</strong></li>
              <li>Profils : Tous (Domaine, Privé, Public)</li>
              <li>Nom : "Blocage ports RPC et SMB"</li>
            </ol>
          </div>
        </div>

        <div className="tip-box">
          <h4>✅ Bonnes pratiques de sécurité</h4>
          <ul className="checklist">
            <li>Scanner régulièrement vos serveurs (mensuel)</li>
            <li>Documenter tous les ports ouverts et leur utilité</li>
            <li>Bloquer tous les ports non essentiels</li>
            <li>Utiliser des VPN pour l'accès administratif</li>
            <li>Activer les logs du firewall</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const CleaningTab = () => (
    <div className="tab-content active">
      <div className="section">
        <h2>🧹 Procédures de nettoyage</h2>
        
        <div className="info-box">
          <h4>💡 Quand utiliser ces procédures</h4>
          <p>Utilisez ces procédures lors de problèmes de build, mise à jour de packages, ou erreurs d'importation de dépendances.</p>
        </div>

        <h3>🔧 Nettoyage projet Stimulus (.NET)</h3>
        
        <div className="procedure-steps">
          <div className="step">
            <span className="step-number">1</span>
            <strong>Naviguer vers le dossier du projet</strong>
            <p>Allez dans le dossier <code>/server</code> ou <code>/client</code> selon la partie à nettoyer</p>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <strong>Supprimer les dossiers de cache</strong>
            <ul>
              <li>Supprimer le dossier <code>/bin</code></li>
              <li>Supprimer le dossier <code>/obj</code></li>
            </ul>
          </div>

          <div className="step">
            <span className="step-number">3</span>
            <strong>Rebuild du projet</strong>
            <div className="command-box">dotnet clean</div>
            <div className="command-box">dotnet restore</div>
            <div className="command-box">dotnet build</div>
          </div>
        </div>

        <h3>🎯 Nettoyage projet MMV (Next.js)</h3>
        
        <div className="procedure-steps">
          <div className="step">
            <span className="step-number">1</span>
            <strong>Script de nettoyage automatique</strong>
            <p>Dans le répertoire root (où se trouve package.json) :</p>
            <div className="command-box">npm run cleaning</div>
            <p>Ce script va automatiquement :</p>
            <ul>
              <li>Supprimer <code>package-lock.json</code></li>
              <li>Supprimer <code>node_modules/</code></li>
              <li>Supprimer <code>.next/</code></li>
              <li>Réinstaller les dépendances</li>
              <li>Rebuild le projet</li>
            </ul>
          </div>

          <div className="step">
            <span className="step-number">2</span>
            <strong>Nettoyage manuel (si le script échoue)</strong>
            <div className="command-box">rm -rf node_modules .next package-lock.json</div>
            <div className="command-box">npm install</div>
            <div className="command-box">npm run build</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <Link href="/" className="nav-back">← Retour au Wiki</Link>
      
      <div className="header">
        <h1>🖥️ Serveur & Infrastructure</h1>
        <p>Configuration complète des serveurs et environnements</p>
      </div>

      <div className="content">
        <div className="tabs">
          <button className={`tab ${activeTab === 'iis' ? 'active' : ''}`} onClick={() => setActiveTab('iis')}>
            🌐 IIS Setup
          </button>
          <button className={`tab ${activeTab === 'linux' ? 'active' : ''}`} onClick={() => setActiveTab('linux')}>
            🐧 Linux Docker
          </button>
          <button className={`tab ${activeTab === 'github' ? 'active' : ''}`} onClick={() => setActiveTab('github')}>
            📦 GitHub Setup
          </button>
          <button className={`tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            🔒 Sécurité
          </button>
          <button className={`tab ${activeTab === 'cleaning' ? 'active' : ''}`} onClick={() => setActiveTab('cleaning')}>
            🧹 Nettoyage
          </button>
        </div>

        {activeTab === 'iis' && <IISTab />}
        {activeTab === 'linux' && <LinuxTab />}
        {activeTab === 'github' && <GitHubTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'cleaning' && <CleaningTab />}
      </div>
    </div>
  );
};

export default ServerProcedures;