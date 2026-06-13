$basePath = "J:\TRABALHANDO\MAESTRIA\PÁGINA WEB\SITE CLÍNICA MAESTRIA\clinica-maestria"
$outputFile = Join-Path -Path $basePath -ChildPath "textos-completos-site.txt"

$htmlFiles = Get-ChildItem -Path $basePath -Recurse -Filter "*.html" | Sort-Object FullName

$result = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Extract page title
    $titleMatch = [regex]::Match($content, '<title>(.*?)</title>')
    $pageTitle = if ($titleMatch.Success) { $titleMatch.Groups[1].Value.Trim() } else { $file.Name }
    
    # Build relative path for reference
    $relPath = $file.FullName.Substring($basePath.Length + 1)
    
    $result += "========================================================================"
    $result += "PÁGINA: $pageTitle"
    $result += "Arquivo: $relPath"
    $result += "========================================================================`n"
    
    # Extract content from <main> and also post-header sections outside main
    $mainContent = ""
    
    # Get post-header section (blog post pages)
    $postHeaderMatch = [regex]::Match($content, '<section class="post-header">(.*?)</section>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($postHeaderMatch.Success) {
        $mainContent += $postHeaderMatch.Groups[1].Value + "`n"
    }
    
    # Get main content
    $mainMatch = [regex]::Match($content, '<main>(.*?)</main>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($mainMatch.Success) {
        $mainContent += $mainMatch.Groups[1].Value
    }
    
    # If no main tag, try to get content between body tags excluding nav/footer
    if (-not $mainMatch.Success -and -not $postHeaderMatch.Success) {
        $bodyMatch = [regex]::Match($content, '<body>(.*?)</body>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        if ($bodyMatch.Success) {
            $bodyContent = $bodyMatch.Groups[1].Value
            
            # Remove nav, footer, script, style, SVG, search bar, breadcrumb
            $bodyContent = [regex]::Replace($bodyContent, '<nav[^>]*>.*?</nav>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
            $bodyContent = [regex]::Replace($bodyContent, '<footer[^>]*>.*?</footer>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
            $bodyContent = [regex]::Replace($bodyContent, '<script[^>]*>.*?</script>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
            $bodyContent = [regex]::Replace($bodyContent, '<style[^>]*>.*?</style>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
            $bodyContent = [regex]::Replace($bodyContent, '<svg[^>]*>.*?</svg>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
            $bodyContent = [regex]::Replace($bodyContent, '<div class="search-bar[^>]*>.*?</div>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
            $bodyContent = [regex]::Replace($bodyContent, '<nav class="breadcrumb[^>]*>.*?</nav>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
            $mainContent = $bodyContent
        }
    }
    
    if ([string]::IsNullOrEmpty($mainContent)) {
        $result += "[CONTEÚDO NÃO ENCONTRADO]`n"
    } else {
        # Remove SVG elements
        $text = [regex]::Replace($mainContent, '<svg[^>]*>.*?</svg>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        # Remove scripts and styles
        $text = [regex]::Replace($text, '<script[^>]*>.*?</script>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        $text = [regex]::Replace($text, '<style[^>]*>.*?</style>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        # Remove HTML tags
        $text = [regex]::Replace($text, '<[^>]+>', ' ')
        # Decode HTML entities
        $text = [regex]::Replace($text, '&nbsp;', ' ')
        $text = [regex]::Replace($text, '&amp;', '&')
        $text = [regex]::Replace($text, '&lt;', '<')
        $text = [regex]::Replace($text, '&gt;', '>')
        $text = [regex]::Replace($text, '&quot;', '"')
        $text = [regex]::Replace($text, '&#39;', "'")
        $text = [regex]::Replace($text, '&ldquo;', '"')
        $text = [regex]::Replace($text, '&rdquo;', '"')
        $text = [regex]::Replace($text, '&mdash;', '—')
        # Collapse multiple spaces and newlines
        $text = [regex]::Replace($text, '\s+', ' ')
        # Fix newlines to be readable: split by sentences or double-space
        $text = [regex]::Replace($text, '\. ', ".`n")
        $text = [regex]::Replace($text, '\?\s', "?`n")
        $text = [regex]::Replace($text, '\!\s', "!`n")
        # Restore paragraph breaks by double newline
        $text = [regex]::Replace($text, '\n\s*\n', "`n`n")
        # Trim
        $text = $text.Trim()
        
        # If text is too long, add line breaks at natural points
        $lines = $text -split "`n"
        foreach ($line in $lines) {
            $line = $line.Trim()
            if ($line -ne "") {
                $result += $line
            }
        }
    }
    
    $result += "`n"
}

$result -join "`r`n" | Out-File -FilePath $outputFile -Encoding UTF8
Write-Host "Arquivo gerado: $outputFile"
Write-Host "Total de páginas processadas: $($htmlFiles.Count)"
