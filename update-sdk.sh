#!/bin/bash

# Script to update the public SDK file from the lib source
# Run this whenever you make changes to the SDK

echo "📦 Updating public SDK..."
cp lib/cosentus-voice/cosentus-voice.js public/cosentus-voice.js

if [ $? -eq 0 ]; then
  echo "✅ SDK updated successfully!"
  echo "📝 Don't forget to commit and push to deploy to Vercel"
else
  echo "❌ Failed to update SDK"
  exit 1
fi

