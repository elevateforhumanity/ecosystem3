#!/bin/bash

echo "🔍 DNS Propagation Test for elevateforhumanity.org"
echo "=================================================="

echo ""
echo "1. Testing Root Domain A Record..."
curl -s "https://dns.google/resolve?name=elevateforhumanity.org&type=A" | python3 -c "
import sys, json
data = json.load(sys.stdin)
answers = data.get('Answer', [])
if answers:
    print('✅ A Record Found:', answers[0].get('data'))
else:
    print('❌ No A Record - DNS not configured yet')
"

echo ""
echo "2. Testing WWW CNAME Record..."
curl -s "https://dns.google/resolve?name=www.elevateforhumanity.org&type=CNAME" | python3 -c "
import sys, json
data = json.load(sys.stdin)
answers = data.get('Answer', [])
if answers:
    print('✅ CNAME Record Found:', answers[0].get('data'))
else:
    print('❌ No CNAME Record - DNS not configured yet')
"

echo ""
echo "3. Testing Site Accessibility..."
if curl -s --connect-timeout 5 -o /dev/null "https://elevateforhumanity.org" 2>/dev/null; then
    echo "✅ Site is accessible"
else
    echo "❌ Site not accessible - waiting for DNS"
fi

echo ""
echo "4. Testing WWW Site Accessibility..."
if curl -s --connect-timeout 5 -o /dev/null "https://www.elevateforhumanity.org" 2>/dev/null; then
    echo "✅ WWW site is accessible"
else
    echo "❌ WWW site not accessible - waiting for DNS"
fi

echo ""
echo "📋 Next Steps for Durable Hosting:"
echo "1. Add CNAME record: @ → elevateforhumanity.durable.co"
echo "2. Add CNAME record: www → elevateforhumanity.durable.co"
echo "3. Configure custom domain in Durable dashboard"
echo "4. Wait 15-60 minutes for propagation"
echo "5. Run this script again to verify"