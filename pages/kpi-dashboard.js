import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const KpiDashboard = () => {
  const [metrics, setMetrics] = useState({
    approvalRate: 87,
    reviewTime: 2.3,
    bugRatio: 0.12,
    deploySuccess: 96,
    deployTime: 12,
    rollbacks: 2,
    cycleTime: 1.8,
    teamVelocity: 23,
    satisfaction: 4.2
  });

  const [controls, setControls] = useState({
    prCount: 47,
    reviewsPerPR: 2.4,
    bugsFound: 8,
    deployments: 24
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Générer des données de graphique simulées
    const generateChartData = () => {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
          approvalRate: Math.floor(80 + Math.random() * 20),
          deploySuccess: Math.floor(85 + Math.random() * 15),
          reviewTime: (1.5 + Math.random() * 2).toFixed(1)
        });
      }
      setChartData(data);
    };

    generateChartData();
    animateProgressBars();
  }, []);

  const updateMetrics = () => {
    const { prCount, reviewsPerPR, bugsFound, deployments } = controls;

    const approvalRate = Math.max(70, Math.min(100, 100 - (bugsFound * 2)));
    const reviewTime = Math.max(1, reviewsPerPR * 0.8 + Math.random() * 2);
    const deploySuccess = Math.max(85, Math.min(100, 100 - (bugsFound * 0.5)));
    const cycleTime = Math.max(1, (prCount / deployments) * 0.8);

    setMetrics(prev => ({
      ...prev,
      approvalRate: approvalRate,
      reviewTime: reviewTime.toFixed(1),
      deploySuccess: deploySuccess,
      cycleTime: cycleTime.toFixed(1)
    }));

    animateProgressBars();
  };

  const animateProgressBars = () => {
    setTimeout(() => {
      const progressBars = document.querySelectorAll('.progress-fill');
      progressBars.forEach(bar => {
        bar.style.transition = 'width 0.8s ease';
      });
    }, 100);
  };

  const handleControlChange = (e) => {
    const { id, value } = e.target;
    setControls(prev => ({
      ...prev,
      [id]: parseFloat(value)
    }));
  };

  const getMetricClass = (value, warningThreshold, goodThreshold) => {
    if (value >= goodThreshold) return 'good';
    if (value >= warningThreshold) return 'warning';
    return 'critical';
  };

  const MetricCard = ({ title, value, label, type, trend }) => (
    <div className={`metric-card ${type}`}>
      <div className={`metric-trend trend-${trend}`}>
        {trend === 'up' && '↗'}
        {trend === 'down' && '↘'}
        {trend === 'stable' && '→'}
      </div>
      <div className={`metric-value ${getMetricClass(parseFloat(value), 85, 90)}`}>
        {value}{label.includes('%') ? '%' : label.includes('h') ? 'h' : label.includes('j') ? 'j' : ''}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );

  const KpiItem = ({ title, value, description, progress, type }) => (
    <div className={`kpi-item ${type}`}>
      <div className="kpi-title">{title}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-description">{description}</div>
      <div className="progress-bar">
        <div 
          className={`progress-fill ${type === 'excellent' || type === 'good' ? 'quality' : type === 'warning' ? 'process' : 'deployment'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="container">
      <Link href="/" className="nav-back">← Retour au Wiki</Link>
      
      <div className="header">
        <h1>📊 Tableau de Bord KPI</h1>
        <p>Indicateurs de performance pour le développement et déploiement</p>
      </div>

      <div className="dashboard">
        {/* Section Qualité du Code */}
        <div className="section">
          <h2 className="section-title">
            <span>🔍</span>
            Qualité du Code
          </h2>

          <div className="metrics-grid">
            <MetricCard 
              title="PRs Approuvées"
              value={metrics.approvalRate}
              label="PRs Approuvées 1er Coup"
              type="quality"
              trend="up"
            />
            <MetricCard 
              title="Temps Review"
              value={metrics.reviewTime}
              label="Temps Moyen Review"
              type="quality"
              trend="stable"
            />
            <MetricCard 
              title="Bug Ratio"
              value={metrics.bugRatio}
              label="Ratio Bugs Review/Prod"
              type="quality"
              trend="down"
            />
          </div>

          <div className="kpi-details">
            <KpiItem 
              title="Reviews par l'équipe maintenance"
              value="2.4 reviewers/PR"
              description="Moyenne de reviewers par PR (cible: 2 minimum)"
              progress={95}
              type="excellent"
            />
            <KpiItem 
              title="Couverture Code Review"
              value="94%"
              description="% des commits passés en review"
              progress={94}
              type="good"
            />
            <KpiItem 
              title="Temps de Resolution Bugs"
              value="4.2j"
              description="Délai moyen correction après detection"
              progress={70}
              type="warning"
            />
          </div>
        </div>

        {/* Section Déploiement */}
        <div className="section">
          <h2 className="section-title">
            <span>🚀</span>
            Performance Déploiement
          </h2>

          <div className="metrics-grid">
            <MetricCard 
              title="Succès Deploy"
              value={metrics.deploySuccess}
              label="Taux Succès Déploiement"
              type="deployment"
              trend="up"
            />
            <MetricCard 
              title="Temps Deploy"
              value={metrics.deployTime}
              label="Temps Moyen Deploy"
              type="deployment"
              trend="stable"
            />
            <MetricCard 
              title="Rollbacks"
              value={metrics.rollbacks}
              label="Rollbacks ce mois"
              type="deployment"
              trend="down"
            />
          </div>

          <div className="kpi-details">
            <KpiItem 
              title="Lead Time"
              value="3.2h"
              description="Délai commit → production"
              progress={88}
              type="excellent"
            />
            <KpiItem 
              title="MTTR"
              value="45min"
              description="Mean Time To Recovery"
              progress={82}
              type="good"
            />
            <KpiItem 
              title="Staging Success"
              value="98%"
              description="Déploiements staging réussis"
              progress={98}
              type="excellent"
            />
          </div>
        </div>

        {/* Section Processus */}
        <div className="section">
          <h2 className="section-title">
            <span>⚙️</span>
            Efficacité Processus
          </h2>

          <div className="metrics-grid">
            <MetricCard 
              title="Cycle Time"
              value={metrics.cycleTime}
              label="Cycle Time Moyen"
              type="process"
              trend="up"
            />
            <MetricCard 
              title="Vélocité"
              value={metrics.teamVelocity}
              label="Vélocité Équipe"
              type="team"
              trend="stable"
            />
            <MetricCard 
              title="Satisfaction"
              value={metrics.satisfaction}
              label="Satisfaction Équipe"
              type="team"
              trend="up"
            />
          </div>

          <div className="chart-container">
            <h3>Évolution des KPIs</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="approvalRate" stroke="#8b5cf6" name="Taux d'approbation (%)" />
                <Line type="monotone" dataKey="deploySuccess" stroke="#10b981" name="Succès déploiement (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Objectifs et Cibles */}
        <div className="targets-section">
          <div className="targets-title">🎯 Objectifs et Cibles</div>
          <div className="target-item">
            <span className="target-label">PRs approuvées 1er coup</span>
            <span className="target-value">≥ 85%</span>
          </div>
          <div className="target-item">
            <span className="target-label">Temps de review</span>
            <span className="target-value">≤ 4h</span>
          </div>
          <div className="target-item">
            <span className="target-label">Taux de succès déploiement</span>
            <span className="target-value">≥ 95%</span>
          </div>
          <div className="target-item">
            <span className="target-label">Reviews par PR minimum</span>
            <span className="target-value">2 membres maintenance</span>
          </div>
          <div className="target-item">
            <span className="target-label">Lead time max</span>
            <span className="target-value">≤ 4h</span>
          </div>
        </div>

        {/* Contrôles de Simulation */}
        <div className="simulation-controls">
          <div className="controls-title">🎮 Simuler des Données</div>
          <div className="control-group">
            <div className="control-item">
              <label className="control-label">Nb PRs ce mois:</label>
              <input 
                type="number" 
                className="control-input" 
                id="prCount" 
                value={controls.prCount}
                onChange={handleControlChange}
                min="1" 
                max="200"
              />
            </div>
            <div className="control-item">
              <label className="control-label">Nb Reviews/PR:</label>
              <input 
                type="number" 
                className="control-input" 
                id="reviewsPerPR" 
                value={controls.reviewsPerPR}
                onChange={handleControlChange}
                min="1" 
                max="5" 
                step="0.1"
              />
            </div>
            <div className="control-item">
              <label className="control-label">Bugs détectés:</label>
              <input 
                type="number" 
                className="control-input" 
                id="bugsFound" 
                value={controls.bugsFound}
                onChange={handleControlChange}
                min="0" 
                max="50"
              />
            </div>
            <div className="control-item">
              <label className="control-label">Déploiements:</label>
              <input 
                type="number" 
                className="control-input" 
                id="deployments" 
                value={controls.deployments}
                onChange={handleControlChange}
                min="1" 
                max="100"
              />
            </div>
          </div>
          <button className="update-btn" onClick={updateMetrics}>
            Mettre à Jour les Métriques
          </button>
        </div>

        {/* Insights */}
        <div className="insights-section">
          <div className="insights-title">💡 Insights et Recommandations</div>
          <div className="insight-item">
            <strong>Qualité:</strong> Le processus de review à 2 approbations fonctionne bien. {metrics.approvalRate}% d'approbation au premier coup indique une bonne qualité du code initial.
          </div>
          <div className="insight-item">
            <strong>Processus:</strong> Le temps de review de {metrics.reviewTime}h est excellent et respecte l'objectif de &lt;4h. L'équipe maintenance est réactive.
          </div>
          <div className="insight-item">
            <strong>Amélioration:</strong> Focus sur la réduction du temps de résolution des bugs (actuellement 4.2j, objectif: &lt;3j).
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiDashboard;