#!/bin/bash

echo "🧪 Testing CADemy AI Chatbot"
echo ""

# Test backend endpoint
echo "1️⃣ Testing backend /api/chat endpoint..."
response=$(curl -s -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"How do I use boolean operations?"}' 2>&1)

if echo "$response" | grep -q "response"; then
    echo "   ✅ Backend endpoint working"
else
    echo "   ❌ Backend not responding (is it running?)"
    echo "   Start with: cd backend && npm start"
fi

echo ""
echo "2️⃣ Checking frontend dependencies..."
if [ -d "node_modules/axios" ]; then
    echo "   ✅ axios installed"
else
    echo "   ❌ axios missing - run: npm install axios"
fi

echo ""
echo "3️⃣ Checking backend dependencies..."
if [ -d "backend/node_modules/express" ]; then
    echo "   ✅ express installed"
else
    echo "   ❌ express missing - run: cd backend && npm install"
fi

echo ""
echo "📝 Next steps:"
echo "   1. Start backend: cd backend && npm start"
echo "   2. Start frontend: npm run dev"
echo "   3. Open http://localhost:3000"
echo "   4. Click chat button (bottom-right)"
