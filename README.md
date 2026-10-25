# ✈️ Skymate — Smart Flight & Stay Finder

> Application web moderne de recherche de vols et de séjours combinant filtres de budget et critères météo en temps réel.

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)

🌐 **Démo en direct :** [https://skymate-henna.vercel.app](https://skymate-henna.vercel.app)

---

## 🌟 Fonctionnalités Principales

- 🔍 **Autocomplétion d'aéroports dynamique** : Recherche instantanée avec sélection des codes AITA (SkyID / EntityID).
- ☀️ **Filtre Météo Intelligent** : Sélection d'une température minimale souhaitée à destination.
- 💰 **Gestion de Budget** : Filtrage en temps réel des résultats selon un plafond tarifaire.
- 🌙 **Mode Sombre / Mode Clair** : Basculement fluide avec persistance de l'état d'affichage.
- ❤️ **Gestion des Favoris & Filtre Dédié** : Sauvegarde locale des destinations coups de cœur (`localStorage`).
- 🔄 **Architecture API Robuste avec Fallback** : Gestion automatique des quotas API (erreur HTTP 429) avec bascule transparente vers un mode démo explicite.
- 📅 **Validation des Dates** : Sécurisation UX empêchant la sélection de dates passées ou d'un retour antérieur au départ.

---

## 🛠️ Stack Technique

- **Front-end** : React 19, TypeScript
- **Styling** : Tailwind CSS v4, Lucide React (Icons)
- **Bundler & Tooling** : Vite, ESLint
- **Déploiement** : Vercel CLI
- **API & Services** : RapidAPI (SkyScanner Scrapper), Unsplash CDN API, LocalStorage Browser API

---

## 🚀 Installation & Lancement Local

1. **Cloner le projet**
   ```bash
   git clone [https://github.com/Wlm94/skymate.git](https://github.com/Wlm94/skymate.git)
   cd skymate

```

2. **Installer les dépendances**
```bash
npm install

```


3. **Configurer les variables d'environnement (Optionnel)**
Créer un fichier `.env.local` à la racine :
```env
VITE_RAPIDAPI_KEY=votre_cle_rapidapi

```


4. **Lancer le serveur de développement**
```bash
npm run dev

```



---

## 📁 Structure du Projet

```text
skymate/
├── public/
├── src/
│   ├── components/
│   │   └── SearchForm.tsx     # Composant principal d'exploration & filtres
│   ├── services/
│   │   └── flightApi.ts      # Service d'intégration API & gestion du Fallback
│   ├── App.tsx
│   ├── index.css             # Configuration Tailwind & keyframes d'animation
│   └── main.tsx
├── package.json
└── vite.config.ts

```

---

## 📝 Licence

Projet sous licence MIT. Développé par [Wlm94](https://www.google.com/search?q=https://github.com/Wlm94).

```

Une fois le fichier `README.md` enregistré, effectue un `git add .`, `git commit -m "docs: add README.md"` puis `git push` pour mettre à jour le dépôt GitHub.

```