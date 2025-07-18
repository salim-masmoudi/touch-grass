#!/usr/bin/env bash
set -euo pipefail

echo "Migrating standalone frontend into monorepo..."

# Remove existing scaffold and move standalone directory in place
rm -rf frontend
mv ../touchgrass frontend

# Clean up standalone Git metadata
rm -rf frontend/.git

echo "Adding Dockerfile and .dockerignore..."

cat > frontend/Dockerfile << 'EOF'
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

cat > frontend/.dockerignore << 'EOF'
node_modules
dist
.git
EOF

echo "Migration complete."
