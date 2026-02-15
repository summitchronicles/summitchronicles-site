#!/bin/bash

echo "🏔️  Summit Chronicles Agent System"
echo "--------------------------------"
echo "Select an agent to run:"
echo "1. Mountain Researcher (Research + Draft + Process Notes)"
echo "2. UI/UX Optimizer (Analyze Site)"
echo "3. Newsletter Manager (Send Weekly Email)"
echo "4. Run All (Sequential)"
echo "q. Quit"
echo "--------------------------------"

read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo "Running Mountain Researcher..."
        npx ts-node -O '{"module":"commonjs"}' scripts/legacy/researcher/index.ts
        ;;
    2)
        echo "Running UI/UX Optimizer..."
        npx ts-node -O '{"module":"commonjs"}' scripts/legacy/optimizer/index.ts
        ;;
    3)
        echo "Running Newsletter Manager..."
        npx ts-node -O '{"module":"commonjs"}' scripts/legacy/newsletter/index.ts
        ;;
    4)
        echo "Running ALL Agents..."
        npx ts-node -O '{"module":"commonjs"}' scripts/legacy/researcher/index.ts
        npx ts-node -O '{"module":"commonjs"}' scripts/legacy/optimizer/index.ts
        # Newsletter usually manual/weekly, but included for completeness:
        # npx ts-node -O '{"module":"commonjs"}' scripts/legacy/newsletter/index.ts
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
