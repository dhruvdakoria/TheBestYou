#!/bin/bash

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

# Load environment variables from .env file
if [ -f .env ]; then
    echo "Loading environment variables from .env file..."
    export $(grep -v '^#' .env | xargs)
fi

# Deploy to Vercel with environment variables
echo "Deploying to Vercel..."
vercel --prod \
  -e NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -e NEXT_PUBLIC_SITE_URL="https://the-best-you.vercel.app" \
  -e HUGGING_FACE_API_TOKEN="$HUGGING_FACE_API_TOKEN"

echo "Deployment complete!" 