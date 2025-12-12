#!/bin/bash

# Script to install Supabase CLI on macOS

echo "🚀 Installing Supabase CLI..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install Supabase CLI via Homebrew
echo "📦 Installing Supabase CLI via Homebrew..."
brew install supabase/tap/supabase

# Verify installation
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI installed successfully!"
    supabase --version
else
    echo "❌ Installation failed. Trying npm method..."
    npm install -g supabase
    supabase --version
fi

echo ""
echo "✅ Next steps:"
echo "1. Run: supabase login"
echo "2. Run: cd backend && supabase link --project-ref tcfgopbbhshgcvvnwjki"
echo "3. Add secrets in Supabase Dashboard → Edge Functions → Secrets"
echo "4. Run: supabase functions deploy"
