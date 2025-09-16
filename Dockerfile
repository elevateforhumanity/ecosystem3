# Dockerfile - Elevate Secure Platform
# Military-grade containerized deployment for government/enterprise environments

FROM node:18-alpine

# Set security labels
LABEL maintainer="legal@elevateforhumanity.com"
LABEL version="1.0.0"
LABEL description="Elevate for Humanity Secure Platform - Licensed Use Only"
LABEL license="COMMERCIAL"

# Create non-root user for security
RUN addgroup -g 1001 -S elevate && \
    adduser -S elevate -u 1001

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with security audit
RUN npm ci --only=production && \
    npm audit --audit-level moderate && \
    npm cache clean --force

# Copy application files
COPY --chown=elevate:elevate . .

# Remove sensitive files from container
RUN rm -rf .git .env* *.md docs/Security_Policy_* legal/ && \
    find . -name "*.log" -delete && \
    find . -name ".DS_Store" -delete

# Set proper permissions
RUN chmod -R 755 /app && \
    chmod 644 /app/package*.json

# Create logs directory
RUN mkdir -p /app/logs && \
    chown elevate:elevate /app/logs

# Switch to non-root user
USER elevate

# Expose the app port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Set environment variables securely
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info

# Start the server
CMD ["npm", "start"]
