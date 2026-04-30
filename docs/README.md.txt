# GeoAgri Sénégal – Drought Early Warning Dashboard

## Description

GeoAgri Sénégal est un dashboard interactif permettant de visualiser les risques de sécheresse agricole au Sénégal.

Le projet combine des données géospatiales issues de Google Earth Engine avec une interface web React pour aider à identifier les régions agricoles prioritaires.

## Objectifs

- Visualiser les risques de sécheresse par région
- Identifier les régions prioritaires
- Afficher un score de risque agricole
- Générer un rapport simple
- Servir de modèle pour le futur projet GeoAgri RDC

## Fonctionnalités

- Carte interactive du Sénégal
- Classification des régions :
  - Normal
  - Risque modéré
  - Risque élevé
- Graphique de synthèse
- Liste des régions prioritaires
- Export d’un rapport texte

## Technologies utilisées

- React
- React Leaflet
- Recharts
- Google Earth Engine
- GeoJSON
- OpenStreetMap

## Données utilisées

- Données satellitaires Sentinel-2
- Indices de végétation NDVI
- Données pluviométriques CHIRPS
- Limites administratives régionales du Sénégal

## Résultat

Le dashboard permet d’obtenir une vue synthétique des régions sénégalaises exposées au risque de sécheresse agricole.

## Prochaine évolution

Ce prototype servira de base méthodologique pour développer GeoAgri RDC, avec une analyse province par province.