# Menu Cantine — Collège Robert Schuman

Site web ultra-moderne affichant les menus de la cantine du Collège Robert Schuman d'Amilly.
Les menus sont récupérés automatiquement (scraping) depuis le site officiel du collège.

## Tech Stack

- **Next.js 14+** (App Router)
- **Tailwind CSS** (dark mode, glassmorphism, animations)
- **Cheerio** (scraping HTML côté serveur)
- **Lucide React** (icônes)
- **TypeScript**

## Lancer le site localement

### Prérequis

- [Node.js](https://nodejs.org/) version 18 ou supérieure
- npm (inclus avec Node.js)

### Installation

```bash
# 1. Ouvrir un terminal dans le dossier du projet
cd menu-collège

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Le site sera accessible à l'adresse : **http://localhost:3000**

### Build de production

```bash
npm run build
npm start
```

## Architecture

```
src/
├── app/
│   ├── api/menus/route.ts   → API Route qui scrape les PDFs
│   ├── globals.css           → Styles globaux + Tailwind
│   ├── layout.tsx            → Layout racine (dark mode)
│   └── page.tsx              → Page principale (Server Component)
└── components/
    └── MenuCard.tsx          → Carte glassmorphism pour chaque menu
```

## Fonctionnement

1. La page principale (`page.tsx`) est un **Server Component** qui appelle l'API `/api/menus` à chaque requête.
2. L'API Route scrape la page du collège avec **Cheerio**, extrait tous les liens PDF, et les retourne en JSON.
3. Les menus sont affichés dans une grille responsive avec des cartes glassmorphism.
4. Aucune base de données — les données sont toujours fraîches, récupérées en temps réel.
