#!/bin/bash
BASE_URL="http://localhost:3000"

echo "Launching Genting Demo Pages..."

# Define pages to open
pages=(
    "/"
    "/login"
    "/dashboard"
    "/doctor"
    "/admin"
)

for page in "${pages[@]}"; do
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        start "$BASE_URL$page"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "$BASE_URL$page"
    else
        xdg-open "$BASE_URL$page"
    fi
    sleep 0.5
done

echo "All pages launched! Good luck with the demo! 🚀"
