# Use Node.js as the base image
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine

# Set the working directory
WORKDIR /src

# Copy built application and production dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the Next.js default port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
