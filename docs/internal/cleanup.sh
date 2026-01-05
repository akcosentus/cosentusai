#!/bin/bash

# Cosentus AI - Codebase Cleanup Script
# Removes tech debt and unused code

echo "🧹 Starting cleanup..."
echo ""

# 1. Remove unused dependencies
echo "📦 Removing unused dependencies..."
npm uninstall @elevenlabs/elevenlabs-js openai animate-ui motion zod tailwind-merge

echo ""
echo "🗑️  Deleting dead API routes..."

# 2. Delete dead API routes
rm -rf src/app/api/elevenlabs
rm -rf src/app/api/voice
rm -rf src/app/api/retell/get-agent
rm -rf src/app/api/retell/get-call

echo ""
echo "🗑️  Deleting unused components..."

# 3. Delete unused components
rm -rf src/components/animate-ui

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  - Removed 6 unused dependencies"
echo "  - Deleted 4 dead API routes"
echo "  - Deleted 1 unused component"
echo ""
echo "🎯 Next steps:"
echo "  1. Review changes: git status"
echo "  2. Test the app: npm run dev"
echo "  3. Commit: git add -A && git commit -m 'Clean up tech debt'"
echo ""

