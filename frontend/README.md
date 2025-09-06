# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## explication de l'utilisation de l'Api PVgis

I. Endpoints disponibles

PVGIS propose plusieurs tools via l'API REST, accessibles sous:

```ruby
https://re.jrc.ec.europa.eu/api/v5_2/{tool}
```

ou /api/v5_1 pour l'ancienne version.

Les outils principaux sont:

1. grid-connected PV (gridcalc)
2. tracking PV (trackcalc)
3. off-grid PV (offgridcalc)
4. monthly radiation (monthly)
5. daily radiation profile (daily)
6. hourly (time series) (seriescalc)
7. TMY (Tipycal Meteorological Year)(tmy)

II. Paramètres à fournir

Endpoints Paramètres principaux

Tous lat, lon, startyear, endyear, outputformat(json, csv)

gridcalc peakpower, loss, angle, aspect

trackcalc paramètres de type de suivi (axis...), peakpower, loss

offgridcalc même que grid + battery_storage etc .

monthly startyear, endyear, select des composantes (GHI, DNI, angle optimal)

daily month (ou month= all ), angle, aspect, options (clear_sky)

seriescalc comme grid/tracking + période, sert l'hourly time series GHI, DNI, etc.

tmy usehrizon, userhorizon éventuels + startyear, endyear

III. Réponses renvoyées

- Format JSON ou CSV.
- Contenu selon endpoint:

$ TMY (/tmy):
Données horaires classiques (8760 h/an) : température, GHI, DNI, vent, humidité…
Renvoie aussi : métadonnées, horizon, choix d’années par mois

$ Hourly Time Series (/seriescalc):
Séries horaires de radiation et/ou production PV.
Inclut : time, G(h), Gb(n), Gd(h), éventuellement production si peakpower défini

$ Monthly (/monthly):
Sommes mensuelles :

    - GHI, DNI sur plan horizontal
    - GHI sur plan incliné (angle optimal)
    - températures moyennes mensuelles

$ Daily (/daily)
Profil horaire moyen pour un mois:

    - irradiance (global, direct, diffuse)
    - température par heure
    - option skyline/time clear-sky

$ Grid/Track/Off-grid calculation
Renvoie:

    - production PV annuelle moyenne ou périodique
    - rendement, pertes, profil de production
    - dépend du type (fixe/tracking/off-grid)
