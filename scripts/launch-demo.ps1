# Launch Genting Demo Pages (Windows PowerShell)
$baseUrl = "http://localhost:3000"

Write-Host "Launching Genting Demo Pages..." -ForegroundColor Cyan

# Define pages to open
$pages = @(
    "/",
    "/login",
    "/dashboard",
    "/doctor",
    "/admin"
)

foreach ($page in $pages) {
    Start-Process "$baseUrl$page"
    Start-Sleep -Milliseconds 500
}

Write-Host "All pages launched! Good luck with the demo! 🚀" -ForegroundColor Green
