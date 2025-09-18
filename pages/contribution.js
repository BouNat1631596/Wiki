import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { marked } from 'marked';

export default  ContributionPage = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [wikiArticles, setWikiArticles] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [markdownPreview, setMarkdownPreview] = useState('');
  const [formData, setFormData] = useState({
    docTitle: '',
    docCategory: '',
    docAuthor: '',
    docDescription: '',
    docTags: '',
    difficulty: '',
    readingTime: '',
    docContent: '',
    deployToStaging: false
  });

  useEffect(() => {
    loadDocumentations();
    updateDeploySelect();
    loadDeploymentStatus();
  }, []);

  useEffect(() => {
    updateMarkdownPreview();
  }, [formData.docContent]);

  const loadDocumentations = () => {
    try {
      const stored = localStorage.getItem('wikiArticles');
      if (stored) {
        setWikiArticles(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const updateDeploySelect = () => {
    const articles = JSON.parse(localStorage.getItem('wikiArticles') || '[]');
    setWikiArticles(articles);
  };

  const loadDeploymentStatus = () => {
    let deps = JSON.parse(localStorage.getItem('deployments') || '[]');
    deps = deps.slice(0, 5); // Limiter à 5 derniers déploiements
    setDeployments(deps);
  };

  const updateMarkdownPreview = () => {
    const content = formData.docContent;
    if (content.trim()) {
      setMarkdownPreview(marked.parse(content));
    } else {
      setMarkdownPreview('<em style="color: #9ca3af;">Commencez à taper pour voir l\'aperçu...</em>');
    }
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked, name } = e.target;
  } 
} 