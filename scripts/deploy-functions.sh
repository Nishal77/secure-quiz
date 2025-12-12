#!/bin/bash

# Script to deploy all Edge Functions

echo "🚀 Deploying Edge Functions..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "📦 Please install it first:"
    echo "   brew install supabase/tap/supabase"
    echo "   or"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "📝 Not logged in. Please login first:"
    echo "   supabase login"
    exit 1
fi

# Navigate to backend directory
cd "$(dirname "$0")/../backend" || exit 1

# Deploy all functions
echo "📦 Deploying all Edge Functions..."
supabase functions deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to Supabase Dashboard → Edge Functions → Secrets"
echo "2. Add these secrets:"
echo "   - SUPABASE_URL = https://tcfgopbbhshgcvvnwjki.supabase.co"
echo "   - SUPABASE_SERVICE_ROLE_KEY = (your service role key)"
echo "3. Test the functions in Supabase Dashboard"
