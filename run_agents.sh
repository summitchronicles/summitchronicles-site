#!/bin/bash

echo "🏔️  Summit Chronicles Agent System"
echo "--------------------------------"
echo "Select an agent to run:"
echo "1. Content Updater (Draft Blogs from Notes)"
echo "2. Mountain Researcher (Find Trends)"
echo "3. UI/UX Optimizer (Analyze Site)"
echo "4. Newsletter Manager (Send Weekly Email)"
echo "5. Knowledge Keeper (Update AI Brain)"
echo "6. Run All (Sequential)"
echo "q. Quit"
echo "--------------------------------"

read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo "Running Content Updater..."
        npx ts-node -O '{"module":"commonjs"}' agents/content-updater/index.ts
        ;;
    2)
        echo "Running Mountain Researcher..."
        npx ts-node -O '{"module":"commonjs"}' agents/researcher/index.ts
        ;;
    3)
        echo "Running UI/UX Optimizer..."
        npx ts-node -O '{"module":"commonjs"}' agents/optimizer/index.ts
        ;;
    4)
        echo "Running Newsletter Manager..."
        npx ts-node -O '{"module":"commonjs"}' agents/newsletter/index.ts
        ;;
    5)
        echo "Running Knowledge Keeper..."
        npx ts-node -O '{"module":"commonjs"}' agents/knowledge-keeper/index.ts
        ;;
    6)
        echo "Running ALL Agents..."
        npx ts-node -O '{"module":"commonjs"}' agents/content-updater/index.ts
        npx ts-node -O '{"module":"commonjs"}' agents/researcher/index.ts
        npx ts-node -O '{"module":"commonjs"}' agents/optimizer/index.ts
        npx ts-node -O '{"module":"commonjs"}' agents/knowledge-keeper/index.ts
        # Newsletter usually manual/weekly, but included for completeness:
        # npx ts-node -O '{"module":"commonjs"}' agents/newsletter/index.ts
        echo "Done!"
        ;;
    q)
        echo "Exiting."
        exit 0
        ;;
    *)
        echo "Invalid choice."
        ;;
esac
