[CmdletBinding()]
param(
    [switch]$SkipInstall,
    [switch]$SkipBuild,
    [switch]$OpenReport,
    [switch]$LaunchApp
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$reportPath = Join-Path $projectRoot 'tmp-acceptance-report.json'
$htmlPath = Join-Path $projectRoot 'acceptance.html'
$results = [System.Collections.Generic.List[object]]::new()

Set-Location -LiteralPath $projectRoot

function Add-Result {
    param(
        [string]$Name,
        [ValidateSet('PASS', 'FAIL', 'SKIP')][string]$Status,
        [string]$Detail
    )
    $results.Add([pscustomobject]@{
        name = $Name
        status = $Status
        detail = $Detail.Trim()
    })
    $color = if ($Status -eq 'PASS') { 'Green' } elseif ($Status -eq 'FAIL') { 'Red' } else { 'Yellow' }
    Write-Host ('[{0}] {1}' -f $Status, $Name) -ForegroundColor $color
}

function Invoke-AcceptanceCommand {
    param(
        [string]$Name,
        [string]$Executable,
        [string[]]$Arguments
    )
    try {
        $previousErrorActionPreference = $ErrorActionPreference
        try {
            $ErrorActionPreference = 'Continue'
            $outputLines = & $Executable @Arguments 2>&1
            $exitCode = $LASTEXITCODE
        }
        finally {
            $ErrorActionPreference = $previousErrorActionPreference
        }
        $output = $outputLines | Out-String
        if ($exitCode -ne 0) {
            throw "Command exit code: $exitCode`n$output"
        }
        Add-Result -Name $Name -Status PASS -Detail $output
    }
    catch {
        Add-Result -Name $Name -Status FAIL -Detail $_.Exception.Message
    }
}

Write-Host 'Project Seal M5 Acceptance' -ForegroundColor Cyan
Write-Host "Project root: $projectRoot"

$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
$pnpm = Get-Command pnpm.cmd -ErrorAction SilentlyContinue
$packageManager = if ($npm) { $npm } else { $pnpm }
$packageManagerName = if ($npm) { 'npm' } elseif ($pnpm) { 'pnpm' } else { '' }

if ($node) {
    Add-Result -Name 'Node.js' -Status PASS -Detail (& $node.Source --version | Out-String)
} else {
    Add-Result -Name 'Node.js' -Status FAIL -Detail 'node was not found. Install Node.js LTS and reopen the terminal.'
}
if ($packageManager) {
    $managerVersion = (& $packageManager.Source --version | Out-String).Trim()
    Add-Result -Name 'Package manager' -Status PASS -Detail "$packageManagerName $managerVersion"
} else {
    Add-Result -Name 'Package manager' -Status FAIL -Detail 'npm.cmd and pnpm.cmd were not found.'
}

$manifestPath = Join-Path $projectRoot 'assets\characters\photo_001_travel_girl\manifest.json'
try {
    $manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
    $expected = @{ idle = 4; walk = 4; sleep = 2; happy = 2; poke = 2; annoyed = 2; dragged = 4 }
    $problems = [System.Collections.Generic.List[string]]::new()
    foreach ($state in $expected.Keys) {
        $frames = @($manifest.animations.$state)
        if ($frames.Count -ne $expected[$state]) {
            $problems.Add("$state expected $($expected[$state]) frames; found $($frames.Count)")
        }
        foreach ($relativePath in $frames) {
            $fullPath = Join-Path (Split-Path -Parent $manifestPath) $relativePath
            if (-not (Test-Path -LiteralPath $fullPath)) {
                $problems.Add("Missing file: $relativePath")
            }
        }
    }
    if ($problems.Count -gt 0) { throw ($problems -join "`n") }
    Add-Result -Name 'Animation assets' -Status PASS -Detail 'idle 4, walk 4, sleep 2, happy/poke 2; all referenced files exist.'
}
catch {
    Add-Result -Name 'Animation assets' -Status FAIL -Detail $_.Exception.Message
}

if (-not $packageManager) {
    Add-Result -Name 'Dependencies' -Status SKIP -Detail 'No package manager is available.'
    Add-Result -Name 'Typecheck' -Status SKIP -Detail 'No package manager is available.'
    Add-Result -Name 'Tests' -Status SKIP -Detail 'No package manager is available.'
    Add-Result -Name 'Production build' -Status SKIP -Detail 'No package manager is available.'
} else {
    if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'node_modules'))) {
        if ($SkipInstall) {
            Add-Result -Name 'Dependencies' -Status SKIP -Detail 'node_modules is missing and -SkipInstall was specified.'
        } else {
            if ($packageManagerName -eq 'npm') {
                Invoke-AcceptanceCommand -Name 'Dependencies' -Executable $packageManager.Source -Arguments @('ci')
            } else {
                Invoke-AcceptanceCommand -Name 'Dependencies' -Executable $packageManager.Source -Arguments @('install', '--lockfile=false')
            }
        }
    } else {
        Add-Result -Name 'Dependencies' -Status PASS -Detail 'node_modules exists.'
    }

    if (Test-Path -LiteralPath (Join-Path $projectRoot 'node_modules')) {
        $binRoot = Join-Path $projectRoot 'node_modules\.bin'
        Invoke-AcceptanceCommand -Name 'Typecheck' -Executable (Join-Path $binRoot 'tsc.cmd') -Arguments @('--noEmit')
        Invoke-AcceptanceCommand -Name 'Tests' -Executable (Join-Path $binRoot 'vitest.cmd') -Arguments @('run')
        if ($SkipBuild) {
            Add-Result -Name 'Production build' -Status SKIP -Detail '-SkipBuild was specified.'
        } else {
            Invoke-AcceptanceCommand -Name 'Production build' -Executable (Join-Path $binRoot 'electron-vite.cmd') -Arguments @('build')
            if ($node) {
                Invoke-AcceptanceCommand -Name 'MediaPipe asset copy' -Executable $node.Source -Arguments @('scripts/copy-mediapipe-assets.js')
            } else {
                Add-Result -Name 'MediaPipe asset copy' -Status SKIP -Detail 'node is not available.'
            }
        }
    } else {
        Add-Result -Name 'Typecheck' -Status SKIP -Detail 'Dependencies are not installed.'
        Add-Result -Name 'Tests' -Status SKIP -Detail 'Dependencies are not installed.'
        Add-Result -Name 'Production build' -Status SKIP -Detail 'Dependencies are not installed.'
        Add-Result -Name 'MediaPipe asset copy' -Status SKIP -Detail 'Dependencies are not installed.'
    }
}

$failed = @($results | Where-Object status -eq 'FAIL').Count
$passed = @($results | Where-Object status -eq 'PASS').Count
$skipped = @($results | Where-Object status -eq 'SKIP').Count
$report = [ordered]@{
    project = 'Project Seal'
    milestone = 'M5'
    generatedAt = (Get-Date).ToString('o')
    summary = [ordered]@{ passed = $passed; failed = $failed; skipped = $skipped }
    results = $results
}
$report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $reportPath -Encoding UTF8

Write-Host ''
Write-Host "Result: $passed passed, $failed failed, $skipped skipped" -ForegroundColor $(if ($failed -eq 0) { 'Green' } else { 'Red' })
Write-Host "Report: $reportPath"

if ($OpenReport) {
    Start-Process -FilePath $htmlPath
}
if ($LaunchApp -and $failed -eq 0 -and $packageManager) {
    & $packageManager.Source run dev
}

if ($failed -gt 0) { exit 1 }
exit 0
