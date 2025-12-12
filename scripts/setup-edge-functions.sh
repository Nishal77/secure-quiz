#!/bin/bash

# Setup script for Supabase Edge Functions
# This script installs CLI, logs in, links project, and provides deployment instructions

set -e

echo "🚀 Setting up Supabase Edge Functions..."
echo ""

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install it first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Step 1: Install Supabase CLI
echo "📦 Step 1: Installing Supabase CLI..."
if command -v supabase &> /dev/null; then
    echo "   ✅ Supabase CLI is already installed"
    supabase --version
else
    echo "   Installing via pnpm..."
    pnpm add -g supabase
    echo "   ✅ Supabase CLI installed"
fi

echo ""

# Step 2: Login
echo "🔐 Step 2: Login to Supabase"
echo "   Run this command to login:"
echo "   supabase login"
echo "   (This will open your browser for authentication)"
echo ""

# Step 3: Link project
echo "🔗 Step 3: Link your project"
echo "   Run this command from the backend directory:"
echo "   cd backend"
echo "   supabase link --project-ref tcfgopbbhshgcvvnwjki"
echo ""

# Step 4: Set secrets
echo "🔑 Step 4: Set Edge Function Secrets"
echo "   IMPORTANT: You must set these secrets in Supabase Dashboard:"
echo "   1. Go to: Supabase Dashboard → Edge Functions → Secrets"
echo "   2. Add these secrets:"
echo "      - Name: SUPABASE_URL"
echo "        Value: https://tcfgopbbhshgcvvnwjki.supabase.co"
echo "      - Name: SUPABASE_SERVICE_ROLE_KEY"
echo "        Value: (Get from Settings → API → service_role secret)"
echo ""

# Step 5: Deploy
echo "📤 Step 5: Deploy Edge Functions"
echo "   After setting secrets, run:"
echo "   cd backend"
echo "   pnpm deploy"
echo "   (or: supabase functions deploy)"
echo ""

echo "✅ Setup instructions complete!"
echo ""
echo "📝 Quick Reference:"
echo "   Install CLI:  pnpm add -g supabase"
echo "   Login:        supabase login"
echo "   Link:         cd backend && supabase link --project-ref tcfgopbbhshgcvvnwjki"
echo "   Set Secrets:  Dashboard → Edge Functions → Secrets"
echo "   Deploy:       cd backend && pnpm deploy"
echo ""

