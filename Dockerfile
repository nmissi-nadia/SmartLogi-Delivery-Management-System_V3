# Stage 1: Build de l'application Angular
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances (npm install gère automatiquement les différences de lock file)
RUN npm install --production=false

# Copier le code source
COPY . .

# Build de l'application en mode production
RUN npm run build -- --configuration production

# Stage 2: Servir l'application avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers buildés depuis le stage précédent
COPY --from=build /app/dist/sdmsAngular/browser /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
