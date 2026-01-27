# Correction du Build Docker - Tags Invalides

## Nouveau Problème Identifié

```
ERROR: failed to build: invalid tag "ghcr.io/nmissi-nadia/smartlogi-frontend:-ad7e308": 
invalid reference format
```

**Cause** : Le tag Docker contient `:-ad7e308` avec un tiret juste après les deux-points, ce qui est un format invalide.

## Analyse

Le problème vient de cette ligne dans le workflow :
```yaml
type=sha,prefix={{branch}}-
```

Lorsque `{{branch}}` est vide ou non défini, cela génère un tag comme `::-sha` ou `:-sha`, ce qui est invalide.

## Solution Appliquée

### Avant
```yaml
tags: |
  type=ref,event=branch
  type=ref,event=pr
  type=semver,pattern={{version}}
  type=semver,pattern={{major}}.{{minor}}
  type=sha,prefix={{branch}}-
```

### Après
```yaml
tags: |
  type=ref,event=branch
  type=ref,event=pr
  type=sha,prefix=sha-
  type=raw,value=latest,enable={{is_default_branch}}
```

## Changements

1. ✅ **Supprimé les tags semver** (non applicables sans tags Git)
2. ✅ **Corrigé le prefix SHA** : `sha-` au lieu de `{{branch}}-`
3. ✅ **Ajouté tag `latest`** pour la branche par défaut

## Tags Générés

Maintenant, les tags seront :
- `main` ou `develop` (nom de la branche)
- `pr-123` (pour les pull requests)
- `sha-ad7e308` (hash du commit)
- `latest` (uniquement pour la branche par défaut)

## Exemples de Tags Valides

```
ghcr.io/nmissi-nadia/smartlogi-frontend:main
ghcr.io/nmissi-nadia/smartlogi-frontend:develop
ghcr.io/nmissi-nadia/smartlogi-frontend:sha-ad7e308
ghcr.io/nmissi-nadia/smartlogi-frontend:latest
ghcr.io/nmissi-nadia/smartlogi-frontend:pr-42
```

## Vérification

Après le push, le build Docker devrait :
- ✅ Générer des tags valides
- ✅ Builder l'image avec succès
- ✅ Pusher vers GitHub Container Registry
