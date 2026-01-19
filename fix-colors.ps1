# Script PowerShell pour remplacer toutes les couleurs non conformes
# Palette: Jaune (#FFC107, #FFA000) / Noir (#1A1A1A) / Blanc (#FFFFFF)

$files = Get-ChildItem -Path "c:\Users\youco\IdeaProjects\frontend\sdmsAngular\src\app\features" -Filter "*.css" -Recurse

$replacements = @{
    # Violet/Purple -> Jaune
    '#667eea' = '#FFC107'
    '#764ba2' = '#FFA000'
    
    # Vert -> Jaune (pour boutons de confirmation)
    '#10b981' = '#FFC107'
    '#059669' = '#FFA000'
    
    # Bleu -> Jaune
    '#3b82f6' = '#FFC107'
    '#2563eb' = '#FFA000'
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($old in $replacements.Keys) {
        if ($content -match $old) {
            $content = $content -replace $old, $replacements[$old]
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content
        Write-Host "✓ Modifié: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`n✅ Remplacement terminé!" -ForegroundColor Yellow
