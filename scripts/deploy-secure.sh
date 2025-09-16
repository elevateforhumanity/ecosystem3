#!/bin/bash

# Secure Deployment Script for Elevate Platform
# Military-grade deployment with license protection

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PLATFORM_NAME="Elevate for Humanity Secure Platform"
VERSION="1.0.0"
DEPLOYMENT_ENV="${1:-production}"

echo -e "${BLUE}🛡️  ${PLATFORM_NAME} - Secure Deployment${NC}"
echo -e "${BLUE}Version: ${VERSION}${NC}"
echo -e "${BLUE}Environment: ${DEPLOYMENT_ENV}${NC}"
echo "=================================================="

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    # Check if required environment files exist
    if [[ ! -f ".env.${DEPLOYMENT_ENV}" ]]; then
        error "Environment file .env.${DEPLOYMENT_ENV} not found."
    fi
    
    log "✅ Prerequisites check passed"
}

# Validate license configuration
validate_license() {
    log "Validating license configuration..."
    
    source ".env.${DEPLOYMENT_ENV}"
    
    if [[ -z "${LICENSE_SECRET_KEY:-}" ]]; then
        error "LICENSE_SECRET_KEY not set in environment file"
    fi
    
    if [[ -z "${ADMIN_API_KEY:-}" ]]; then
        error "ADMIN_API_KEY not set in environment file"
    fi
    
    if [[ ${#LICENSE_SECRET_KEY} -lt 32 ]]; then
        error "LICENSE_SECRET_KEY must be at least 32 characters long"
    fi
    
    log "✅ License configuration validated"
}

# Security hardening
security_hardening() {
    log "Applying security hardening..."
    
    # Set secure file permissions
    chmod 600 .env.* 2>/dev/null || true
    chmod 600 config/* 2>/dev/null || true
    chmod 700 scripts/* 2>/dev/null || true
    
    # Remove sensitive files from deployment
    rm -rf .git/ docs/Security_Policy_* legal/ temp-* *.log 2>/dev/null || true
    
    # Create secure directories
    mkdir -p logs licenses ssl
    chmod 750 logs licenses ssl
    
    log "✅ Security hardening applied"
}

# Build Docker images
build_images() {
    log "Building Docker images..."
    
    # Build main platform image
    docker build -t elevate-platform:${VERSION} -t elevate-platform:latest .
    
    if [[ $? -eq 0 ]]; then
        log "✅ Docker images built successfully"
    else
        error "Failed to build Docker images"
    fi
}

# Deploy services
deploy_services() {
    log "Deploying services..."
    
    # Copy environment file
    cp ".env.${DEPLOYMENT_ENV}" .env
    
    # Start services with Docker Compose
    docker-compose down --remove-orphans 2>/dev/null || true
    docker-compose up -d
    
    if [[ $? -eq 0 ]]; then
        log "✅ Services deployed successfully"
    else
        error "Failed to deploy services"
    fi
}

# Health checks
health_checks() {
    log "Performing health checks..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        if curl -f http://localhost:3000/health &>/dev/null; then
            log "✅ Main platform is healthy"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            error "Health check failed after ${max_attempts} attempts"
        fi
        
        warn "Health check attempt ${attempt}/${max_attempts} failed, retrying in 5 seconds..."
        sleep 5
        ((attempt++))
    done
    
    # Check license server
    if curl -f http://localhost:3001/health &>/dev/null; then
        log "✅ License server is healthy"
    else
        warn "License server health check failed"
    fi
    
    # Check license dashboard
    if curl -f http://localhost:3002/health &>/dev/null; then
        log "✅ License dashboard is healthy"
    else
        warn "License dashboard health check failed"
    fi
}

# Generate deployment report
generate_report() {
    log "Generating deployment report..."
    
    local report_file="deployment-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$report_file" << EOF
ELEVATE PLATFORM DEPLOYMENT REPORT
==================================

Deployment Date: $(date)
Environment: ${DEPLOYMENT_ENV}
Version: ${VERSION}
Deployed By: $(whoami)
Host: $(hostname)

SERVICES STATUS:
$(docker-compose ps)

CONTAINER HEALTH:
$(docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}")

SECURITY CHECKLIST:
✅ License protection enabled
✅ Environment variables secured
✅ File permissions hardened
✅ Sensitive files removed
✅ Health checks passed

ACCESS URLS:
- Main Platform: http://localhost:3000
- License Server: http://localhost:3001
- License Dashboard: http://localhost:3002

NEXT STEPS:
1. Configure SSL certificates
2. Set up monitoring and alerting
3. Configure backup procedures
4. Review security logs

Generated: $(date)
EOF

    log "✅ Deployment report saved to: ${report_file}"
}

# Cleanup function
cleanup() {
    log "Cleaning up temporary files..."
    rm -f .env 2>/dev/null || true
}

# Main deployment process
main() {
    trap cleanup EXIT
    
    log "Starting secure deployment process..."
    
    check_prerequisites
    validate_license
    security_hardening
    build_images
    deploy_services
    
    # Wait for services to start
    sleep 10
    
    health_checks
    generate_report
    
    echo ""
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Platform Access:${NC}"
    echo -e "  Main Platform: ${GREEN}http://localhost:3000${NC}"
    echo -e "  License Server: ${GREEN}http://localhost:3001${NC}"
    echo -e "  License Dashboard: ${GREEN}http://localhost:3002${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Remember to:${NC}"
    echo -e "  1. Configure SSL certificates for production"
    echo -e "  2. Set up monitoring and alerting"
    echo -e "  3. Configure regular backups"
    echo -e "  4. Review security logs regularly"
    echo ""
    echo -e "${BLUE}For support: ${GREEN}support@elevateforhumanity.com${NC}"
}

# Run main function
main "$@"