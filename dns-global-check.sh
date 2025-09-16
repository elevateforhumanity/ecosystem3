#!/usr/bin/env bash
set -euo pipefail

# Automated Global DNS Check Script for elevateforhumanity.org
# Checks A and CNAME records from multiple global DNS resolvers

DOMAIN="elevateforhumanity.org"
WWW_DOMAIN="www.elevateforhumanity.org"
VERCEL_IP="76.76.21.241"
VERCEL_CNAME="cname.vercel-dns.com."

# List of public DNS resolvers
RESOLVERS=(
    "1.1.1.1"      # Cloudflare
    "8.8.8.8"      # Google
    "9.9.9.9"      # Quad9
    "208.67.222.222" # OpenDNS
    "8.26.56.26"   # Comodo
    "64.6.64.6"    # Verisign
    "185.228.168.9" # CleanBrowsing
    "76.76.21.21"  # Vercel (for reference)
)

# Function to check A record
check_a_record() {
    local domain=$1
    local resolver=$2
    dig +short @$resolver $domain A
}

# Function to check CNAME record
check_cname_record() {
    local domain=$1
    local resolver=$2
    dig +short @$resolver $domain CNAME
}

printf "\n===== GLOBAL DNS CHECK FOR %s =====\n" "$DOMAIN"
for resolver in "${RESOLVERS[@]}"; do
    echo "\nResolver: $resolver"
    echo "A record for $DOMAIN:"
    a_record=$(check_a_record "$DOMAIN" "$resolver")
    echo "$a_record"
    if [[ "$a_record" == "$VERCEL_IP" ]]; then
        echo "✅ Vercel IP detected"
    else
        echo "⚠️  Unexpected IP(s): $a_record"
    fi
    echo "CNAME for $WWW_DOMAIN:"
    cname_record=$(check_cname_record "$WWW_DOMAIN" "$resolver")
    echo "$cname_record"
    if [[ "$cname_record" == "$VERCEL_CNAME" ]]; then
        echo "✅ Vercel CNAME detected"
    else
        echo "⚠️  Unexpected CNAME(s): $cname_record"
    fi
    sleep 1
done

printf "\nDNS check complete. If any resolver returns old IPs or CNAMEs, DNS propagation is still in progress.\n"
