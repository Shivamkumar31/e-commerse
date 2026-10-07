FROM node:20-bookworm-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update \
    && apt-get install -y openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy Prisma
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy backend source
COPY src ./src

# Copy product images
COPY public ./public

# Build TypeScript
RUN npm run build

# Render provides PORT automatically.
# Our server will listen on 0.0.0.0.
EXPOSE 4000

CMD ["npm", "start"]