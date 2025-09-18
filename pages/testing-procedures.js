import React from 'react';
import Link from 'next/link';

const TestingProcedures = () => {
  const comparisonData = [
    { critere: 'Support .NET Core', xunit: '✅ Natif et optimisé', nunit: '✅ Supporté' },
    { critere: 'Syntaxe', xunit: '[Fact], [Theory]', nunit: '[Test], [TestCase]' },
    { critere: 'Performance', xunit: 'Plus rapide', nunit: 'Standard' },
    { critere: 'Isolation', xunit: 'Nouvelle instance par test', nunit: 'Instance partagée possible' },
    { critere: 'Documentation', xunit: 'Excellente', nunit: 'Très complète' }
  ];

  const serverTestExample = `using Xunit;
using Moq;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using YourProject.Controllers;
using YourProject.Services;

namespace YourProject.Tests.Server
{
    public class UserControllerTests
    {
        private readonly Mock<IUserService> _userServiceMock;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            _userServiceMock = new Mock<IUserService>();
            _controller = new UserController(_userServiceMock.Object);
        }

        [Fact]
        public async Task GetUser_ReturnsUser_WhenUserExists()
        {
            // Arrange
            var userId = 1;
            var expectedUser = new User { Id = userId, Name = "Test User" };
            _userServiceMock.Setup(x => x.GetByIdAsync(userId))
                .ReturnsAsync(expectedUser);

            // Act
            var result = await _controller.GetUser(userId);

            // Assert
            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult.Value.Should().BeEquivalentTo(expectedUser);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        public async Task GetUser_ReturnsBadRequest_WhenIdIsInvalid(int invalidId)
        {
            // Act
            var result = await _controller.GetUser(invalidId);

            // Assert
            result.Should().BeOfType<BadRequestResult>();
        }
    }
}`;

  const blazorTestExample = `using Xunit;
using Bunit;
using YourProject.Client.Components;

namespace YourProject.Tests.Client
{
    public class CounterComponentTests : TestContext
    {
        [Fact]
        public void Counter_ClickingButton_IncrementsCount()
        {
            // Arrange
            var component = RenderComponent<Counter>();

            // Act
            var button = component.Find("button");
            button.Click();

            // Assert
            Assert.Equal("Current count: 1", 
                component.Find("p").TextContent);
        }

        [Fact]
        public void Component_RendersCorrectly_WithInitialParameters()
        {
            // Arrange & Act
            var component = RenderComponent<UserCard>(parameters => parameters
                .Add(p => p.Username, "TestUser")
                .Add(p => p.Email, "test@example.com")
            );

            // Assert
            Assert.Contains("TestUser", component.Markup);
            Assert.Contains("test@example.com", component.Markup);
        }

        [Fact]
        public void Form_Validation_ShowsErrorMessages()
        {
            // Arrange
            var component = RenderComponent<LoginForm>();
            var submitButton = component.Find("button[type='submit']");

            // Act - Submit empty form
            submitButton.Click();

            // Assert
            Assert.Contains("Username is required", component.Markup);
            Assert.Contains("Password is required", component.Markup);
        }
    }
}`;

  const integrationTestExample = `using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http.Json;
using Xunit;
using FluentAssertions;

public class IntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public IntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task API_GetUsers_ReturnsSuccessAndCorrectContentType()
    {
        // Act
        var response = await _client.GetAsync("/api/users");

        // Assert
        response.EnsureSuccessStatusCode();
        response.Content.Headers.ContentType.ToString()
            .Should().Be("application/json; charset=utf-8");
    }

    [Fact]
    public async Task API_CreateUser_ReturnsCreatedUser()
    {
        // Arrange
        var newUser = new { Name = "Test", Email = "test@test.com" };

        // Act
        var response = await _client.PostAsJsonAsync("/api/users", newUser);
        var createdUser = await response.Content.ReadFromJsonAsync<User>();

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        createdUser.Name.Should().Be("Test");
    }
}`;

  const projectStructure = `Solution/
├── src/
│   ├── YourProject.Server/
│   ├── YourProject.Client/
│   └── YourProject.Shared/
└── tests/
    ├── YourProject.Tests.Server/
    │   ├── Controllers/
    │   ├── Services/
    │   └── Helpers/
    ├── YourProject.Tests.Client/
    │   ├── Components/
    │   ├── Pages/
    │   └── Services/
    └── YourProject.Tests.Integration/
        ├── ApiTests/
        └── E2ETests/`;

  const serverSteps = [
    {
      number: 1,
      title: 'Création du projet de test',
      steps: [
        'Clic droit sur la solution → Ajouter → Nouveau projet',
        'Rechercher "Projet de test xUnit"',
        'Nommer le projet : [NomProjet].Tests.Server'
      ]
    },
    {
      number: 2,
      title: 'Ajout des références',
      steps: [
        'Clic droit sur le projet de test → Ajouter → Référence de projet',
        'Sélectionner le projet principal à tester'
      ]
    },
    {
      number: 3,
      title: 'Installation des packages NuGet requis',
      commands: [
        'dotnet add package Microsoft.AspNetCore.Mvc.Testing',
        'dotnet add package Moq',
        'dotnet add package FluentAssertions'
      ]
    }
  ];

  const clientSteps = [
    {
      number: 1,
      title: 'Création du projet de test client',
      steps: [
        'Créer un nouveau projet xUnit',
        'Nommer le projet : [NomProjet].Tests.Client'
      ]
    },
    {
      number: 2,
      title: 'Installation de bUnit',
      important: 'Installer bunit uniquement, PAS bunit.web ou bunit.core',
      command: 'dotnet add package bunit'
    },
    {
      number: 3,
      title: 'Configuration des imports',
      code: `using Xunit;
using Bunit;
using Microsoft.Extensions.DependencyInjection;
using YourProject.Client.Pages;`
    }
  ];

  const executionCommands = [
    {
      number: 1,
      title: 'Exécuter tous les tests',
      command: 'dotnet test'
    },
    {
      number: 2,
      title: 'Exécuter avec détails',
      command: 'dotnet test --logger "console;verbosity=detailed"'
    },
    {
      number: 3,
      title: 'Exécuter avec couverture de code',
      command: 'dotnet test --collect:"XPlat Code Coverage"'
    },
    {
      number: 4,
      title: 'Générer un rapport HTML',
      commands: [
        'dotnet tool install --global dotnet-reportgenerator-globaltool',
        'reportgenerator -reports:coverage.xml -targetdir:coveragereport'
      ]
    }
  ];

  return (
    <div className="container">
      <Link href="/" className="nav-back">← Retour au Wiki</Link>
      
      <div className="header">
        <h1>🧪 Tests Unitaires ASP.NET Core</h1>
        <p>Guide complet pour implémenter des tests unitaires côté serveur et client</p>
      </div>

      <div className="content">
        <div className="section">
          <h2>📋 Vue d'ensemble</h2>
          
          <div className="info-box">
            <h4>🎯 Objectif</h4>
            <p>Mettre en place un environnement de tests unitaires complet pour une application ASP.NET Core, incluant les tests serveur (backend) et client (frontend avec Blazor).</p>
          </div>

          <h3>⚖️ Comparaison xUnit vs NUnit</h3>
          
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Critère</th>
                <th>xUnit (Recommandé)</th>
                <th>NUnit</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index}>
                  <td>{row.critere}</td>
                  <td>{row.xunit}</td>
                  <td>{row.nunit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="section">
          <h2>🖥️ Tests Côté Serveur</h2>
          
          <h3>📦 Configuration du projet de test</h3>
          
          <div className="procedure-steps">
            {serverSteps.map((step) => (
              <div key={step.number} className="step">
                <span className="step-number">{step.number}</span>
                <strong>{step.title}</strong>
                {step.steps && (
                  <ol>
                    {step.steps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                )}
                {step.commands && step.commands.map((cmd, idx) => (
                  <div key={idx} className="command-box">{cmd}</div>
                ))}
              </div>
            ))}
          </div>

          <h3>📝 Structure d'un test serveur</h3>
          
          <div className="code-block" data-lang="csharp">
            <pre>{serverTestExample}</pre>
          </div>

          <div className="tip-box">
            <h4>✅ Bonnes pratiques pour les tests serveur</h4>
            <ul>
              <li>Utiliser le pattern AAA : Arrange, Act, Assert</li>
              <li>Un seul assert principal par test</li>
              <li>Noms de tests descriptifs : [Méthode]_[Résultat]_[Condition]</li>
              <li>Mocker les dépendances externes</li>
              <li>Tester les cas limites et d'erreur</li>
            </ul>
          </div>
        </div>

        <div className="section">
          <h2>💻 Tests Côté Client (Blazor)</h2>
          
          <h3>🎨 Configuration avec bUnit</h3>
          
          <div className="procedure-steps">
            {clientSteps.map((step) => (
              <div key={step.number} className="step">
                <span className="step-number">{step.number}</span>
                <strong>{step.title}</strong>
                {step.steps && (
                  <ol>
                    {step.steps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                )}
                {step.important && (
                  <div className="important-box">
                    <h4>⚠️ Important</h4>
                    <p>{step.important}</p>
                  </div>
                )}
                {step.command && (
                  <div className="command-box">{step.command}</div>
                )}
                {step.code && (
                  <div className="code-block" data-lang="csharp">
                    <pre>{step.code}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h3>🧪 Exemple de test Blazor avec bUnit</h3>
          
          <div className="code-block" data-lang="csharp">
            <pre>{blazorTestExample}</pre>
          </div>

          <h3>🔄 Tests d'intégration avec WebApplicationFactory</h3>
          
          <div className="code-block" data-lang="csharp">
            <pre>{integrationTestExample}</pre>
          </div>
        </div>

        <div className="section">
          <h2>🚀 Exécution et rapport des tests</h2>
          
          <h3>▶️ Commandes d'exécution</h3>
          
          <div className="procedure-steps">
            {executionCommands.map((step) => (
              <div key={step.number} className="step">
                <span className="step-number">{step.number}</span>
                <strong>{step.title}</strong>
                {step.command && (
                  <div className="command-box">{step.command}</div>
                )}
                {step.commands && step.commands.map((cmd, idx) => (
                  <div key={idx} className="command-box">{cmd}</div>
                ))}
              </div>
            ))}
          </div>

          <h3>📊 Structure recommandée du projet</h3>
          
          <div className="test-structure">
            <pre>{projectStructure}</pre>
          </div>

          <div className="tip-box">
            <h4>🎯 Objectifs de couverture</h4>
            <ul>
              <li><strong>Minimum requis :</strong> 60% de couverture</li>
              <li><strong>Objectif recommandé :</strong> 80% de couverture</li>
              <li><strong>Code critique :</strong> 95% de couverture</li>
              <li>Exclure : Code généré, migrations, Program.cs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingProcedures;