# Script para cargar variables de entorno desde .env
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "Loaded: $name"
        }
    }
    Write-Host "✅ Variables de entorno cargadas desde .env"
} else {
    Write-Host "❌ Archivo .env no encontrado"
} 