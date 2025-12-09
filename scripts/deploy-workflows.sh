#!/bin/bash

KESTRA_URL="${KESTRA_URL:-http://localhost:8080}"
WORKFLOWS_DIR="./kestra-workflows"

echo "🚀 Deploying Kestra workflows to $KESTRA_URL"
echo ""

if [ ! -d "$WORKFLOWS_DIR" ]; then
    echo "❌ Error: Workflows directory not found: $WORKFLOWS_DIR"
    exit 1
fi

SUCCESS=0
FAILED=0

for workflow in "$WORKFLOWS_DIR"/*.yaml; do
    if [ -f "$workflow" ]; then
        filename=$(basename "$workflow")
        echo "📤 Deploying: $filename"
        
        response=$(curl -s -w "\n%{http_code}" -X POST "$KESTRA_URL/api/v1/flows" \
            -H "Content-Type: application/x-yaml" \
            --data-binary @"$workflow" 2>&1)
        
        http_code=$(echo "$response" | tail -n1)
        
        if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
            echo "   ✅ Success"
            ((SUCCESS++))
        else
            echo "   ❌ Failed (HTTP $http_code)"
            ((FAILED++))
        fi
        echo ""
    fi
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Deployment Summary:"
echo "   ✅ Successful: $SUCCESS"
echo "   ❌ Failed: $FAILED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
    echo "🎉 All workflows deployed successfully!"
    exit 0
else
    echo "⚠️  Some workflows failed to deploy"
    exit 1
fi
