# Stage 1: Build the application
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the application source code and public assets
COPY src ./src
COPY public ./public
COPY next.config.js ./
COPY tailwind.config.js  postcss.config.js ./
# Optional, only if you have a next.config.js
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
# Build the Next.js app
RUN npm run build

# Install production dependencies only
RUN npm prune --production

# Stage 2: Create the production image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy production dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the built Next.js application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./

# Copy the app directory structure
COPY src ./src
COPY public ./public

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable to run the Next.js app in production mode
ENV NODE_ENV=production

# Command to start the Next.js app
CMD ["npm", "start"]
