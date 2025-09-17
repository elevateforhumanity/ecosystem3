# 🐳 ELEVATE LICENSE SYSTEM DOCKER CONTAINER
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    bash \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY . .

# Create required directories
RUN mkdir -p logs data

# Create non-root user for security
RUN addgroup -g 1001 -S elevate && \
    adduser -S elevate -u 1001 -G elevate

# Set ownership
RUN chown -R elevate:elevate /app

# Switch to non-root user
USER elevate

# Expose port
EXPOSE 4242

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4242/health || exit 1

# Start application
CMD ["npm", "start"]