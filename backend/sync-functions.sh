#!/bin/bash

# Sync functions from backend/functions to supabase/functions
# This ensures both locations stay in sync

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Syncing functions to supabase/functions..."

# Create directories
mkdir -p supabase/functions

# Copy functions
echo "Copying functions..."
cp -r functions/* supabase/functions/

# Copy utils
echo "Copying utils..."
cp -r utils supabase/functions/

echo "Functions synced successfully!"
echo ""
echo "Next steps:"
echo "   pnpm run deploy"
echo ""


